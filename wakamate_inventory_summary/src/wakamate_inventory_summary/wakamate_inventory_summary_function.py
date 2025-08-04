import logging
import asyncio
from typing import Dict, List, Any, Optional, Union, Tuple, Set
from enum import Enum
from dataclasses import dataclass, field
import os
import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from contextlib import asynccontextmanager
import re
from collections import defaultdict
import math
import itertools
import requests
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import time

from dotenv import load_dotenv
load_dotenv()

from pydantic import Field, BaseModel, validator
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import trim_messages
from langchain.tools.retriever import create_retriever_tool
from langchain_community.document_loaders import DirectoryLoader
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain.schema import Document
from langchain.agents import create_react_agent, AgentExecutor
from langchain import hub
from langchain_core.tools import tool
from langchain_core.prompts import PromptTemplate

from aiq.builder.builder import Builder
from aiq.builder.framework_enum import LLMFrameworkEnum
from aiq.builder.function_info import FunctionInfo
from aiq.cli.register_workflow import register_function
from aiq.data_models.component_ref import EmbedderRef, FunctionRef, LLMRef
from aiq.data_models.function import FunctionBaseConfig
from aiq.data_models.api_server import AIQChatRequest, AIQChatResponse

logger = logging.getLogger(__name__)


class WakamateInventorySummaryFunctionConfig(FunctionBaseConfig, name="wakamate_inventory_summary"):
    """
    AIQ Toolkit function for advanced inventory analysis and business intelligence.
    Provides insights on sales trends, profit optimization, and strategic recommendations.
    """
    llm_name: str = Field(description="Name of the LLM to use")
    embedder_name: str = Field(description="Name of the embedder to use")
    tool_names: List[str] = Field(default=[], description="List of tool names to include")
    ingest_glob: str = Field(description="Glob pattern for ingesting documents")
    chunk_size: int = Field(default=1024, description="Chunk size for document splitting")
    description: str = Field(default="Elite Inventory Summary Analyzer")
    max_history: int = Field(default=10, description="Maximum conversation history")
    api_base_url: str = Field(default="https://wakamate-api.onrender.com", description="Wakamate API base URL")
    auth_token: Optional[str] = Field(default=None, description="Authentication token for API")


class InventoryAnalyzer:
    """Core inventory analysis engine for business intelligence."""
    
    def __init__(self, api_base_url: str, auth_token: Optional[str] = None):
        self.api_base_url = api_base_url
        self.auth_token = auth_token
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {auth_token}" if auth_token else ""
        }
    
    async def fetch_products(self) -> List[Dict[str, Any]]:
        """Fetch all products from the API."""
        try:
            response = requests.get(
                f"{self.api_base_url}/products/getAll",
                headers=self.headers,
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Failed to fetch products: {e}")
            return []
    
    async def fetch_weekly_summary(self) -> Dict[str, Any]:
        """Fetch weekly summary from the API."""
        try:
            response = requests.get(
                f"{self.api_base_url}/summary",
                headers=self.headers,
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Failed to fetch weekly summary: {e}")
            return {}
    
    def calculate_profit_metrics(self, products: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate comprehensive profit metrics."""
        if not products:
            return {}
        
        total_revenue = 0
        total_cost = 0
        total_units_sold = 0
        product_profits = []
        
        for product in products:
            units_sold = product.get('unitsSold', 0)
            selling_price = product.get('sellingPrice', 0)
            cost_price = product.get('costPrice', 0)
            
            revenue = units_sold * selling_price
            cost = units_sold * cost_price
            profit = revenue - cost
            profit_margin = (profit / revenue * 100) if revenue > 0 else 0
            
            total_revenue += revenue
            total_cost += cost
            total_units_sold += units_sold
            
            product_profits.append({
                'name': product.get('name', 'Unknown'),
                'profit': profit,
                'profit_margin': profit_margin,
                'revenue': revenue,
                'units_sold': units_sold,
                'roi': (profit / cost * 100) if cost > 0 else 0
            })
        
        # Sort by profit descending
        product_profits.sort(key=lambda x: x['profit'], reverse=True)
        
        total_profit = total_revenue - total_cost
        overall_margin = (total_profit / total_revenue * 100) if total_revenue > 0 else 0
        
        return {
            'total_profit': total_profit,
            'total_revenue': total_revenue,
            'total_cost': total_cost,
            'overall_margin': overall_margin,
            'total_units_sold': total_units_sold,
            'product_profits': product_profits,
            'best_performer': product_profits[0] if product_profits else None,
            'worst_performer': product_profits[-1] if product_profits else None
        }
    
    def analyze_stock_status(self, products: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze stock levels and identify issues."""
        if not products:
            return {}
        
        low_stock_items = []
        overstocked_items = []
        optimal_stock_items = []
        out_of_stock_items = []
        
        for product in products:
            current_stock = product.get('stock', 0)
            min_stock = product.get('minStock', 0)
            units_sold = product.get('unitsSold', 0)
            
            # Calculate stock velocity (daily average)
            avg_daily_sales = units_sold / 30 if units_sold > 0 else 0
            days_of_stock = current_stock / avg_daily_sales if avg_daily_sales > 0 else float('inf')
            
            if current_stock == 0:
                out_of_stock_items.append(product)
            elif current_stock <= min_stock:
                low_stock_items.append({**product, 'days_remaining': days_of_stock})
            elif days_of_stock > 90:  # More than 3 months of stock
                overstocked_items.append({**product, 'days_remaining': days_of_stock})
            else:
                optimal_stock_items.append({**product, 'days_remaining': days_of_stock})
        
        return {
            'low_stock_count': len(low_stock_items),
            'out_of_stock_count': len(out_of_stock_items),
            'overstocked_count': len(overstocked_items),
            'optimal_stock_count': len(optimal_stock_items),
            'low_stock_items': low_stock_items,
            'out_of_stock_items': out_of_stock_items,
            'overstocked_items': overstocked_items,
            'stock_efficiency': len(optimal_stock_items) / len(products) * 100
        }
    
    def generate_business_recommendations(self, profit_metrics: Dict, stock_analysis: Dict, products: List[Dict]) -> List[str]:
        """Generate AI-powered business recommendations."""
        recommendations = []
        
        # Profit optimization recommendations
        if profit_metrics.get('best_performer'):
            best = profit_metrics['best_performer']
            recommendations.append(
                f"🚀 Focus on {best['name']} - your top performer with {best['profit_margin']:.1f}% margin. "
                f"Consider increasing stock or marketing investment."
            )
        
        if profit_metrics.get('worst_performer'):
            worst = profit_metrics['worst_performer']
            if worst['profit'] < 0:
                recommendations.append(
                    f"⚠️ {worst['name']} is losing money with {worst['profit_margin']:.1f}% margin. "
                    f"Review pricing strategy or consider discontinuing."
                )
        
        # Stock optimization recommendations
        if stock_analysis.get('out_of_stock_count', 0) > 0:
            recommendations.append(
                f"🔴 {stock_analysis['out_of_stock_count']} products are out of stock. "
                f"Prioritize restocking to avoid lost sales."
            )
        
        if stock_analysis.get('overstocked_count', 0) > 0:
            recommendations.append(
                f"📦 {stock_analysis['overstocked_count']} products are overstocked. "
                f"Consider promotions or reducing future orders to free up capital."
            )
        
        # Overall efficiency recommendations
        if profit_metrics.get('overall_margin', 0) < 20:
            recommendations.append(
                f"💡 Overall profit margin is {profit_metrics['overall_margin']:.1f}%. "
                f"Consider optimizing costs or increasing prices on high-demand items."
            )
        
        if stock_analysis.get('stock_efficiency', 0) < 70:
            recommendations.append(
                f"⚡ Stock efficiency is {stock_analysis['stock_efficiency']:.1f}%. "
                f"Implement better demand forecasting and inventory planning."
            )
        
        return recommendations


class InventoryInsightEngine:
    """Advanced insight generation engine using LLM for complex analysis."""
    
    def __init__(self, llm, analyzer: InventoryAnalyzer):
        self.llm = llm
        self.analyzer = analyzer
        self.conversation_history = []
    
    async def generate_insight(self, query: str, context_data: Dict[str, Any]) -> str:
        """Generate intelligent insights using LLM with real inventory data."""
        
        # Create structured context from inventory data
        context_summary = self._create_context_summary(context_data)
        
        prompt_template = ChatPromptTemplate.from_messages([
            SystemMessage(content="""You are an elite inventory management and business strategy AI assistant. 
            You have access to real-time inventory data and can provide actionable insights.
            
            Your capabilities include:
            - Sales trend analysis and forecasting
            - Profit optimization strategies
            - Stock level recommendations
            - Business growth strategies
            - Market positioning advice
            - Cost reduction opportunities
            
            Always provide specific, actionable recommendations based on the data.
            Use emojis sparingly and focus on concrete business value.
            
            Current inventory context:
            {context}
            """),
            MessagesPlaceholder(variable_name="history"),
            HumanMessage(content="{query}")
        ])
        
        # Trim conversation history to stay within context limits
        trimmed_history = self.conversation_history[-10:]  # Keep last 10 exchanges
        
        chain = prompt_template | self.llm | StrOutputParser()
        
        response = await chain.ainvoke({
            "context": context_summary,
            "history": trimmed_history,
            "query": query
        })
        
        # Update conversation history
        self.conversation_history.extend([
            HumanMessage(content=query),
            AIMessage(content=response)
        ])
        
        return response
    
    def _create_context_summary(self, context_data: Dict[str, Any]) -> str:
        """Create a structured summary of the inventory context."""
        products = context_data.get('products', [])
        weekly_summary = context_data.get('weekly_summary', {})
        profit_metrics = context_data.get('profit_metrics', {})
        stock_analysis = context_data.get('stock_analysis', {})
        
        summary_parts = []
        
        # Basic inventory overview
        summary_parts.append(f"INVENTORY OVERVIEW:")
        summary_parts.append(f"- Total products: {len(products)}")
        summary_parts.append(f"- Total revenue: ${profit_metrics.get('total_revenue', 0):,.2f}")
        summary_parts.append(f"- Total profit: ${profit_metrics.get('total_profit', 0):,.2f}")
        summary_parts.append(f"- Overall margin: {profit_metrics.get('overall_margin', 0):.1f}%")
        
        # Stock status
        summary_parts.append(f"\nSTOCK STATUS:")
        summary_parts.append(f"- Out of stock: {stock_analysis.get('out_of_stock_count', 0)}")
        summary_parts.append(f"- Low stock: {stock_analysis.get('low_stock_count', 0)}")
        summary_parts.append(f"- Overstocked: {stock_analysis.get('overstocked_count', 0)}")
        summary_parts.append(f"- Stock efficiency: {stock_analysis.get('stock_efficiency', 0):.1f}%")
        
        # Top performers
        if profit_metrics.get('product_profits'):
            top_3 = profit_metrics['product_profits'][:3]
            summary_parts.append(f"\nTOP PERFORMERS:")
            for i, product in enumerate(top_3, 1):
                summary_parts.append(f"{i}. {product['name']}: ${product['profit']:,.2f} profit ({product['profit_margin']:.1f}% margin)")
        
        # Weekly performance
        if weekly_summary:
            week_summary = weekly_summary.get('summary', [])
            total_weekly_revenue = sum(item.get('totalRevenueThisWeek', 0) for item in week_summary)
            total_weekly_units = sum(item.get('unitsSoldThisWeek', 0) for item in week_summary)
            summary_parts.append(f"\nWEEKLY PERFORMANCE:")
            summary_parts.append(f"- Units sold this week: {total_weekly_units}")
            summary_parts.append(f"- Revenue this week: ${total_weekly_revenue:,.2f}")
        
        return "\n".join(summary_parts)


@tool
async def get_inventory_data() -> str:
    """Fetch current inventory data from Wakamate API."""
    try:
        analyzer = InventoryAnalyzer("https://wakamate-api.onrender.com")
        products = await analyzer.fetch_products()
        weekly_summary = await analyzer.fetch_weekly_summary()
        
        if not products:
            return "No inventory data available. Please check API connection."
        
        # Calculate metrics
        profit_metrics = analyzer.calculate_profit_metrics(products)
        stock_analysis = analyzer.analyze_stock_status(products)
        recommendations = analyzer.generate_business_recommendations(profit_metrics, stock_analysis, products)
        
        # Create comprehensive summary
        summary = {
            'total_products': len(products),
            'total_profit': profit_metrics.get('total_profit', 0),
            'total_revenue': profit_metrics.get('total_revenue', 0),
            'overall_margin': profit_metrics.get('overall_margin', 0),
            'stock_efficiency': stock_analysis.get('stock_efficiency', 0),
            'recommendations': recommendations,
            'top_performer': profit_metrics.get('best_performer', {}),
            'stock_alerts': {
                'out_of_stock': stock_analysis.get('out_of_stock_count', 0),
                'low_stock': stock_analysis.get('low_stock_count', 0),
                'overstocked': stock_analysis.get('overstocked_count', 0)
            }
        }
        
        return json.dumps(summary, indent=2)
    
    except Exception as e:
        logger.error(f"Error fetching inventory data: {e}")
        return f"Error fetching inventory data: {str(e)}"


@tool 
async def analyze_sales_trends(time_period: str = "week") -> str:
    """Analyze sales trends for specified time period (week, month, quarter)."""
    try:
        analyzer = InventoryAnalyzer("https://wakamate-api.onrender.com")
        products = await analyzer.fetch_products()
        
        if not products:
            return "No product data available for trend analysis."
        
        # Analyze sales patterns
        trends = []
        current_date = datetime.now()
        
        for product in products:
            sales_data = product.get('sales', [])
            if not sales_data:
                continue
            
            # Filter sales by time period
            if time_period == "week":
                cutoff_date = current_date - timedelta(days=7)
            elif time_period == "month":
                cutoff_date = current_date - timedelta(days=30)
            elif time_period == "quarter":
                cutoff_date = current_date - timedelta(days=90)
            else:
                cutoff_date = current_date - timedelta(days=7)
            
            recent_sales = [
                sale for sale in sales_data 
                if datetime.fromisoformat(sale.get('date', '').replace('Z', '+00:00')) >= cutoff_date
            ]
            
            if recent_sales:
                total_quantity = sum(sale.get('quantity', 0) for sale in recent_sales)
                total_amount = sum(sale.get('amountMade', 0) for sale in recent_sales)
                avg_sale_size = total_quantity / len(recent_sales) if recent_sales else 0
                
                trends.append({
                    'product': product.get('name'),
                    'total_sold': total_quantity,
                    'total_revenue': total_amount,
                    'number_of_sales': len(recent_sales),
                    'avg_sale_size': avg_sale_size,
                    'velocity': total_quantity / 7 if time_period == "week" else total_quantity / 30
                })
        
        # Sort by velocity (sales per day)
        trends.sort(key=lambda x: x['velocity'], reverse=True)
        
        return json.dumps({
            'time_period': time_period,
            'trends': trends[:10],  # Top 10
            'analysis_date': current_date.isoformat(),
            'total_products_analyzed': len(trends)
        }, indent=2)
    
    except Exception as e:
        logger.error(f"Error analyzing sales trends: {e}")
        return f"Error analyzing trends: {str(e)}"


@tool
async def get_profit_optimization_suggestions() -> str:
    """Generate specific profit optimization suggestions based on current inventory."""
    try:
        analyzer = InventoryAnalyzer("https://wakamate-api.onrender.com")
        products = await analyzer.fetch_products()
        
        if not products:
            return "No product data available for optimization analysis."
        
        profit_metrics = analyzer.calculate_profit_metrics(products)
        stock_analysis = analyzer.analyze_stock_status(products)
        
        suggestions = {
            'pricing_optimizations': [],
            'inventory_optimizations': [],
            'cost_reduction_opportunities': [],
            'growth_opportunities': []
        }
        
        # Pricing optimization analysis
        for product_profit in profit_metrics.get('product_profits', []):
            if product_profit['profit_margin'] < 15:
                suggestions['pricing_optimizations'].append({
                    'product': product_profit['name'],
                    'current_margin': product_profit['profit_margin'],
                    'suggestion': f"Consider 10-15% price increase to improve {product_profit['profit_margin']:.1f}% margin",
                    'potential_impact': f"Could increase profit by ${(product_profit['revenue'] * 0.1):,.2f}"
                })
            elif product_profit['profit_margin'] > 50 and product_profit['units_sold'] < 10:
                suggestions['pricing_optimizations'].append({
                    'product': product_profit['name'],
                    'current_margin': product_profit['profit_margin'],
                    'suggestion': "High margin but low sales - consider price reduction to increase volume",
                    'potential_impact': "Could significantly increase sales volume"
                })
        
        # Inventory optimization
        for item in stock_analysis.get('overstocked_items', []):
            suggestions['inventory_optimizations'].append({
                'product': item['name'],
                'issue': 'overstocked',
                'days_remaining': item.get('days_remaining', 0),
                'suggestion': 'Run promotion or bundle deals to move inventory faster'
            })
        
        for item in stock_analysis.get('low_stock_items', []):
            suggestions['inventory_optimizations'].append({
                'product': item['name'],
                'issue': 'low_stock',
                'days_remaining': item.get('days_remaining', 0),
                'suggestion': 'Immediate restock needed to prevent stockouts'
            })
        
        # Growth opportunities
        best_performers = profit_metrics.get('product_profits', [])[:3]
        for performer in best_performers:
            if performer['units_sold'] > 0:
                suggestions['growth_opportunities'].append({
                    'product': performer['name'],
                    'current_performance': f"${performer['profit']:,.2f} profit",
                    'opportunity': 'Scale up marketing and inventory for this high-performer',
                    'potential': 'Could be a major revenue driver with increased investment'
                })
        
        return json.dumps(suggestions, indent=2)
    
    except Exception as e:
        logger.error(f"Error generating optimization suggestions: {e}")
        return f"Error generating suggestions: {str(e)}"


@tool
async def calculate_reorder_recommendations() -> str:
    """Calculate intelligent reorder recommendations based on sales velocity."""
    try:
        analyzer = InventoryAnalyzer("https://wakamate-api.onrender.com")
        products = await analyzer.fetch_products()
        
        if not products:
            return "No product data available for reorder analysis."
        
        reorder_suggestions = []
        
        for product in products:
            current_stock = product.get('stock', 0)
            units_sold = product.get('unitsSold', 0)
            min_stock = product.get('minStock', 0)
            cost_price = product.get('costPrice', 0)
            
            # Calculate sales velocity (units per day)
            daily_velocity = units_sold / 30 if units_sold > 0 else 0
            
            # Calculate days until stockout
            days_until_stockout = current_stock / daily_velocity if daily_velocity > 0 else float('inf')
            
            # Calculate optimal order quantity (Economic Order Quantity simplified)
            if daily_velocity > 0:
                # Assume 7-day lead time and target 30-day stock
                safety_stock = daily_velocity * 7
                target_stock = daily_velocity * 30
                reorder_point = safety_stock + (daily_velocity * 7)
                
                if current_stock <= reorder_point:
                    order_quantity = target_stock - current_stock
                    estimated_cost = order_quantity * cost_price
                    
                    reorder_suggestions.append({
                        'product': product.get('name'),
                        'current_stock': current_stock,
                        'daily_velocity': round(daily_velocity, 2),
                        'days_until_stockout': round(days_until_stockout, 1),
                        'recommended_order_quantity': math.ceil(order_quantity),
                        'estimated_cost': estimated_cost,
                        'urgency': 'HIGH' if days_until_stockout < 7 else 'MEDIUM' if days_until_stockout < 14 else 'LOW'
                    })
        
        # Sort by urgency and days until stockout
        urgency_order = {'HIGH': 0, 'MEDIUM': 1, 'LOW': 2}
        reorder_suggestions.sort(key=lambda x: (urgency_order[x['urgency']], x['days_until_stockout']))
        
        return json.dumps({
            'reorder_recommendations': reorder_suggestions,
            'total_estimated_cost': sum(r['estimated_cost'] for r in reorder_suggestions),
            'high_priority_items': len([r for r in reorder_suggestions if r['urgency'] == 'HIGH']),
            'analysis_date': datetime.now().isoformat()
        }, indent=2)
    
    except Exception as e:
        logger.error(f"Error calculating reorder recommendations: {e}")
        return f"Error calculating reorder recommendations: {str(e)}"


@register_function(config_type=WakamateInventorySummaryFunctionConfig, framework_wrappers=[LLMFrameworkEnum.LANGCHAIN])
async def wakamate_inventory_summary_function(
    config: WakamateInventorySummaryFunctionConfig, builder: Builder
):
    """
    Advanced inventory management AI agent for business intelligence and optimization.
    """
    
    # Initialize components
    llm_ref = LLMRef(config.llm_name)
    llm = await builder.get_llm(llm_ref, LLMFrameworkEnum.LANGCHAIN)
    
    # Get additional tools (non-async)
    tools = []
    for tool_name in config.tool_names:
        function_ref = FunctionRef(tool_name)
        tool_function = builder.get_function(function_ref)
        tools.append(tool_function)
    
    # Add our custom tools
    tools.extend([get_inventory_data, analyze_sales_trends, get_profit_optimization_suggestions, calculate_reorder_recommendations])
    
    # Initialize inventory analyzer and insight engine
    analyzer = InventoryAnalyzer(config.api_base_url, config.auth_token)
    insight_engine = InventoryInsightEngine(llm, analyzer)
    
    # Create a simpler prompt template for LLM chain instead of agent
    system_prompt = ChatPromptTemplate.from_messages([
        SystemMessage(content="""You are an elite inventory management AI assistant specializing in business intelligence and profit optimization.
        
        Your expertise includes:
        - Real-time inventory analysis and reporting
        - Sales trend identification and forecasting  
        - Profit margin optimization strategies
        - Stock level management and reorder planning
        - Business growth recommendations
        - Cost reduction opportunities
        - Market positioning strategies
        
        You can call the following functions to get real data:
        - get_inventory_data(): Get current inventory overview
        - analyze_sales_trends(time_period): Analyze sales patterns
        - get_profit_optimization_suggestions(): Get profit improvement ideas
        - calculate_reorder_recommendations(): Get restocking advice
        
        Always provide specific, actionable recommendations with concrete numbers and timelines.
        """),
        MessagesPlaceholder(variable_name="history"),
        HumanMessage(content="{input}")
    ])
    
    # Create LLM chain
    chain = system_prompt | llm | StrOutputParser()
    
    async def _response_fn(input_message: str) -> str:
        """Process user queries and generate intelligent inventory insights."""
        try:
            # Fetch current inventory context
            products = await analyzer.fetch_products()
            weekly_summary = await analyzer.fetch_weekly_summary()
            
            if not products:
                return "Unable to fetch inventory data. Please check your API connection and authentication."
            
            # Calculate metrics
            profit_metrics = analyzer.calculate_profit_metrics(products)
            stock_analysis = analyzer.analyze_stock_status(products)
            
            context_data = {
                'products': products,
                'weekly_summary': weekly_summary,
                'profit_metrics': profit_metrics,
                'stock_analysis': stock_analysis
            }
            
            # Determine which tools to call based on the query
            query_lower = input_message.lower()
            tool_results = {}
            
            # Auto-call relevant tools based on query intent
            if any(keyword in query_lower for keyword in ['profit', 'money', 'revenue', 'margin', 'earnings']):
                tool_results['inventory_data'] = await get_inventory_data()
            
            if any(keyword in query_lower for keyword in ['trend', 'sales', 'selling', 'performance', 'week', 'month']):
                if 'month' in query_lower:
                    tool_results['sales_trends'] = await analyze_sales_trends('month')
                elif 'quarter' in query_lower:
                    tool_results['sales_trends'] = await analyze_sales_trends('quarter')
                else:
                    tool_results['sales_trends'] = await analyze_sales_trends('week')
            
            if any(keyword in query_lower for keyword in ['optimize', 'improve', 'strategy', 'better', 'increase']):
                tool_results['optimization'] = await get_profit_optimization_suggestions()
            
            if any(keyword in query_lower for keyword in ['restock', 'order', 'buy', 'low stock', 'out of stock']):
                tool_results['reorder'] = await calculate_reorder_recommendations()
            
            # If no specific tools triggered, get general inventory data
            if not tool_results:
                tool_results['inventory_data'] = await get_inventory_data()
            
            # Prepare context for LLM
            tool_context = "\n\n".join([f"{key.upper()}:\n{value}" for key, value in tool_results.items()])
            
            # Generate enhanced response using LLM with tool results
            enhanced_input = f"{input_message}\n\nTool Results:\n{tool_context}"
            
            response = await chain.ainvoke({
                "input": enhanced_input,
                "history": insight_engine.conversation_history[-10:]  # Last 10 messages
            })
            
            # Update conversation history
            insight_engine.conversation_history.extend([
                HumanMessage(content=input_message),
                AIMessage(content=response)
            ])
            
            return response
                
        except Exception as e:
            logger.error(f"Error in inventory summary function: {e}")
            return f"An error occurred while processing your request: {str(e)}"

    try:
        yield FunctionInfo.create(single_fn=_response_fn)
    except GeneratorExit:
        logger.info("Wakamate inventory summary function exited early!")
    finally:
        logger.info("Cleaning up wakamate_inventory_summary workflow.")