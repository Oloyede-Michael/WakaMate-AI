import logging
import asyncio
from typing import Dict, List, Any, Optional
import os
import json
import pandas as pd
from datetime import datetime, timedelta
import requests
from collections import defaultdict

from dotenv import load_dotenv
load_dotenv()

from pydantic import Field
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.tools import tool

from aiq.builder.builder import Builder
from aiq.builder.framework_enum import LLMFrameworkEnum
from aiq.builder.function_info import FunctionInfo
from aiq.cli.register_workflow import register_function
from aiq.data_models.component_ref import FunctionRef, LLMRef
from aiq.data_models.function import FunctionBaseConfig

logger = logging.getLogger(__name__)

class WakamateInventoryFunctionConfig(FunctionBaseConfig, name="wakamate_inventory"):
    """
    AI-Powered Inventory Management and Business Intelligence Assistant
    """
    llm_name: str = Field(description="Name of the LLM to use")
    tool_names: List[str] = Field(default=[], description="List of tool names to include")
    description: str = Field(default="AI-Powered Inventory Management Assistant")
    max_history: int = Field(default=20, description="Maximum conversation history")
    api_base_url: str = Field(default="http://localhost:1050", description="Wakamate API base URL")
    auth_token: Optional[str] = Field(
        default="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTIzNWRkZjFkYTA5Yzc3ODI2YWE2ZCIsImlhdCI6MTc1NTY1MDc0OSwiZXhwIjoxNzU2MjU1NTQ5fQ.mrdpoOAEHosy5R5k2Xcsdw2-ag2gEZ2ljmz3HnjWLqY", 
        description="Authentication token for API"
    )

# API Configuration
API_BASE_URL = "http://localhost:1050"
API_HEADERS = {"Content-Type": "application/json"}
_config_auth_token = None

def set_global_auth_token(token: str):
    global _config_auth_token
    _config_auth_token = token

def fetch_api_data(endpoint: str) -> Dict[str, Any]:
    """Fetch data from Wakamate API"""
    try:
        url = f"{API_BASE_URL}{endpoint}"
        headers = API_HEADERS.copy()
        
        if _config_auth_token and _config_auth_token.strip():
            clean_token = _config_auth_token.strip().replace('\n', '').replace('\r', '')
            headers["Authorization"] = f"Bearer {clean_token}"
            logger.info(f"Using authentication token: {clean_token[:20]}...")
        else:
            logger.warning("No valid authentication token provided")
        
        logger.info(f"Making API request to: {url}")
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        logger.info(f"API response received: {len(str(data))} characters")
        return data
    except requests.RequestException as e:
        logger.error(f"API request failed for {endpoint}: {e}")
        return {}
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error for {endpoint}: {e}")
        return {}

class InventoryAnalyzer:
    """Helper class for inventory analysis"""
    
    def __init__(self):
        self.products = []
        self.summary = {}
        
    def fetch_all_data(self):
        """Fetch all necessary data"""
        self.products = fetch_api_data("/api/products/getAll")
        self.summary = fetch_api_data("/api/summary")
        
        if not isinstance(self.products, list):
            self.products = []
        
    def get_inventory_summary(self) -> str:
        """Get basic inventory summary"""
        if not self.products:
            return "❌ No product data available. Please check API connection."
        
        result = f"📦 **INVENTORY SUMMARY** ({len(self.products)} products)\n"
        result += f"🕐 **Data Retrieved**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        
        total_value = 0
        total_revenue = 0
        out_of_stock = []
        low_stock = []
        
        for product in self.products:
            name = product.get('name', 'Unknown')
            stock = product.get('stock', 0)
            cost_price = product.get('costPrice', 0)
            selling_price = product.get('sellingPrice', 0)
            low_stock_flag = product.get('lowStock', False)
            
            inventory_value = stock * cost_price
            potential_revenue = stock * selling_price
            
            total_value += inventory_value
            total_revenue += potential_revenue
            
            if stock == 0:
                out_of_stock.append(name)
            elif low_stock_flag:
                low_stock.append(name)
        
        result += f"💰 **Total Inventory Value**: ${total_value:,.2f}\n"
        result += f"📈 **Total Potential Revenue**: ${total_revenue:,.2f}\n"
        result += f"💎 **Total Potential Profit**: ${(total_revenue - total_value):,.2f}\n\n"
        
        if out_of_stock:
            result += f"🔴 **OUT OF STOCK** ({len(out_of_stock)}): {', '.join(out_of_stock[:5])}\n"
        if low_stock:
            result += f"🟡 **LOW STOCK** ({len(low_stock)}): {', '.join(low_stock[:5])}\n"
        
        return result
    
    def get_profitability_analysis(self) -> str:
        """Analyze profitability"""
        if not self.products:
            return "❌ No product data available for profitability analysis."
        
        result = f"💰 **PROFITABILITY ANALYSIS**\n\n"
        
        profit_data = []
        for product in self.products:
            name = product.get('name', 'Unknown')
            cost_price = product.get('costPrice', 0)
            selling_price = product.get('sellingPrice', 0)
            stock = product.get('stock', 0)
            units_sold = product.get('unitsSold', 0)
            
            if selling_price > 0:
                profit_margin = ((selling_price - cost_price) / selling_price) * 100
                potential_profit = (selling_price - cost_price) * stock
                realized_profit = (selling_price - cost_price) * units_sold
                
                profit_data.append({
                    'name': name,
                    'margin': profit_margin,
                    'potential_profit': potential_profit,
                    'realized_profit': realized_profit,
                    'stock': stock,
                    'units_sold': units_sold
                })
        
        # Sort by potential profit
        profit_data.sort(key=lambda x: x['potential_profit'], reverse=True)
        
        result += "🏆 **TOP PROFIT OPPORTUNITIES**:\n"
        for i, item in enumerate(profit_data[:5], 1):
            result += f"{i}. **{item['name']}**\n"
            result += f"   • Margin: {item['margin']:.1f}%\n"
            result += f"   • Potential Profit: ${item['potential_profit']:,.2f}\n"
            result += f"   • Stock: {item['stock']} units\n\n"
        
        # Low margin products
        low_margin = [p for p in profit_data if p['margin'] < 25]
        if low_margin:
            result += "⚠️ **LOW MARGIN PRODUCTS** (<25%):\n"
            for item in low_margin[:3]:
                result += f"• {item['name']}: {item['margin']:.1f}% margin\n"
        
        return result
    
    def get_restock_recommendations(self) -> str:
        """Generate restock recommendations"""
        if not self.products:
            return "❌ No product data for restocking analysis."
        
        result = f"🔄 **RESTOCKING RECOMMENDATIONS**\n\n"
        
        critical_items = []
        high_priority = []
        
        for product in self.products:
            name = product.get('name', 'Unknown')
            stock = product.get('stock', 0)
            units_sold = product.get('unitsSold', 0)
            cost_price = product.get('costPrice', 0)
            min_stock = product.get('minStock', 0)
            low_stock = product.get('lowStock', False)
            
            # Calculate velocity (assume 30-day period)
            daily_velocity = units_sold / 30 if units_sold > 0 else 0.1
            days_until_stockout = stock / daily_velocity if daily_velocity > 0 else 999
            
            if stock == 0:
                recommended_qty = max(20, min_stock * 2)
                investment = recommended_qty * cost_price
                critical_items.append({
                    'name': name,
                    'qty': recommended_qty,
                    'investment': investment,
                    'reason': 'OUT OF STOCK'
                })
            elif low_stock or stock <= min_stock or days_until_stockout <= 14:
                recommended_qty = max(min_stock * 2, int(daily_velocity * 21))
                investment = recommended_qty * cost_price
                high_priority.append({
                    'name': name,
                    'current_stock': stock,
                    'qty': recommended_qty,
                    'investment': investment,
                    'days_left': days_until_stockout
                })
        
        if critical_items:
            result += "🚨 **CRITICAL - IMMEDIATE RESTOCK NEEDED**:\n"
            total_critical = 0
            for item in critical_items:
                result += f"• **{item['name']}** - {item['reason']}\n"
                result += f"  Recommended: {item['qty']} units (${item['investment']:,.2f})\n"
                total_critical += item['investment']
            result += f"  **Total Critical Investment**: ${total_critical:,.2f}\n\n"
        
        if high_priority:
            result += "🔴 **HIGH PRIORITY RESTOCKS**:\n"
            total_high = 0
            for item in high_priority[:5]:
                result += f"• **{item['name']}** - {item['current_stock']} units left\n"
                result += f"  Days until stockout: {item['days_left']:.1f}\n"
                result += f"  Recommended: {item['qty']} units (${item['investment']:,.2f})\n"
                total_high += item['investment']
            result += f"  **Total High Priority Investment**: ${total_high:,.2f}\n"
        
        if not critical_items and not high_priority:
            result += "✅ **All products are adequately stocked!**"
        
        return result

@register_function(config_type=WakamateInventoryFunctionConfig, framework_wrappers=[LLMFrameworkEnum.LANGCHAIN])
async def wakamate_inventory_function(
    config: WakamateInventoryFunctionConfig, builder: Builder
):
    """
    Simplified Inventory Management Assistant using direct LLM approach
    """
    # Set the global authentication token
    if config.auth_token:
        set_global_auth_token(config.auth_token)
        logger.info(f"Authentication token configured: {config.auth_token[:20]}...")

    # Initialize LLM
    llm_ref = LLMRef(config.llm_name)
    llm = await builder.get_llm(llm_ref, LLMFrameworkEnum.LANGCHAIN)
    
    # Initialize analyzer
    analyzer = InventoryAnalyzer()
    
    # Create prompt template
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an expert Inventory Management Assistant for the Wakamate system.

You help with:
- Product inventory analysis
- Sales performance tracking  
- Profitability analysis
- Restocking recommendations

When users ask questions, you'll be provided with current inventory data and should provide clear, actionable insights based on that real data.

Be professional, concise, and focus on actionable recommendations that can boost profits and optimize inventory management."""),
        ("human", "{input}")
    ])
    
    # Create chain
    chain = prompt | llm | StrOutputParser()
    
    # Conversation history
    conversation_history = []
    
    async def _response_fn(input_message: str) -> str:
        nonlocal conversation_history
        
        try:
            # Add user message to history
            conversation_history.append({
                "role": "user",
                "content": input_message,
                "timestamp": datetime.now().isoformat()
            })
            
            # Fetch fresh data from API
            logger.info("Fetching fresh inventory data...")
            analyzer.fetch_all_data()
            
            # Prepare context with data
            context = f"""
Current Request: {input_message}

Here is the current inventory data for analysis:

{analyzer.get_inventory_summary()}

{analyzer.get_profitability_analysis()}

{analyzer.get_restock_recommendations()}

Based on this real data, please provide comprehensive analysis and recommendations.
"""
            
            # Add conversation context if available
            if len(conversation_history) > 2:
                context += f"\n\nConversation Context: This is our {len(conversation_history)//2 + 1} exchange in this session."
            
            # Generate response
            logger.info(f"Processing request: {input_message[:50]}...")
            response = await chain.ainvoke({"input": context})
            
            # Add assistant response to history
            conversation_history.append({
                "role": "assistant", 
                "content": response,
                "timestamp": datetime.now().isoformat()
            })
            
            # Trim history if needed
            if len(conversation_history) > config.max_history * 2:
                conversation_history = conversation_history[-(config.max_history * 2):]
            
            # Add footer with data source info
            response += f"\n\n---\n📊 **Data Source**: From Your Inventory\n"
            response += f"🔄 **Last Updated**: {datetime.now().strftime('%H:%M:%S')}\n"
            response += f"💬 **Session**: {len(conversation_history)//2} exchanges completed"
            
            return response
            
        except Exception as e:
            logger.error(f"Error in inventory management function: {e}")
            error_msg = f"❌ **System Error**: {str(e)}\n\n"
            error_msg += "🔧 **Troubleshooting**:\n"
            error_msg += "1. Check if API server is running on http://localhost:1050\n"
            error_msg += "2. Verify authentication token is valid\n"
            error_msg += "3. Ensure database contains product data"
            return error_msg

    try:
        yield FunctionInfo.create(single_fn=_response_fn)
    except GeneratorExit:
        logger.info("Inventory management function exited early!")
    finally:
        logger.info("Cleaning up inventory management workflow.")