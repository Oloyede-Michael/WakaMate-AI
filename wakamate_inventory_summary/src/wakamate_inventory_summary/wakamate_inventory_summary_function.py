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
from langchain_core.messages import HumanMessage, AIMessage
from langchain.agents import create_react_agent, AgentExecutor
from langchain import hub
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
        default="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGUzMmMyMDgxOGY4ZjI3MzU0MzczMyIsImlhdCI6MTc1NDY3NzUxMCwiZXhwIjoxNzU1MjgyMzEwfQ.DN19_y8GhRmGWbOtT4E3u0CqqVgl9lTtiwOM6bUOwQQ", 
        description="Authentication token for API"
    )

# API Configuration
API_BASE_URL = "http://localhost:1050"
API_HEADERS = {"Content-Type": "application/json"}
_config_auth_token = None

def set_global_auth_token(token: str):
    global _config_auth_token
    _config_auth_token = token

def fetch_api_data(endpoint: str, auth_token: Optional[str] = None) -> Dict[str, Any]:
    """Fetch data from Wakamate API with enhanced error handling"""
    try:
        url = f"{API_BASE_URL}{endpoint}"
        headers = API_HEADERS.copy()
        
        # Clean and validate the token
        if auth_token and auth_token.strip() and auth_token.lower() != 'none':
            clean_token = auth_token.strip().replace('\n', '').replace('\r', '')
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


@tool
def get_all_products(auth_token: Optional[str] = None) -> str:
    """
    Get all products from the inventory with detailed analysis of ACTUAL data
    
    Args:
        auth_token: JWT token for authentication (optional)
    
    Returns:
        Formatted string with comprehensive product analysis based on real data
    """
    try:
        products = fetch_api_data("/api/products/getAll", _config_auth_token)
        
        if not products:
            return "❌ **ERROR**: No products found or API connection failed. Please check your connection and try again."
        
        if not isinstance(products, list):
            return f"❌ **ERROR**: Expected list of products but got: {type(products)}"
        
        result = f"📦 **LIVE INVENTORY ANALYSIS** ({len(products)} products)\n"
        result += f"🕐 **Data Retrieved**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        
        # Initialize counters and metrics
        total_inventory_value = 0
        total_potential_revenue = 0
        low_stock_products = []
        out_of_stock_products = []
        profitable_products = []
        
        result += "📊 **DETAILED PRODUCT BREAKDOWN**\n"
        result += "=" * 60 + "\n\n"
        
        for idx, product in enumerate(products, 1):
            name = product.get('name', 'Unknown Product')
            category = product.get('category', 'Uncategorized')
            stock = product.get('stock', 0)
            selling_price = product.get('sellingPrice', 0)
            cost_price = product.get('costPrice', 0)
            units_sold = product.get('unitsSold', 0)
            min_stock = product.get('minStock', 0)
            low_stock = product.get('lowStock', False)
            product_id = product.get('_id', 'No ID')
            
            # Calculate financial metrics
            inventory_value = stock * cost_price
            potential_revenue = stock * selling_price
            profit_per_unit = selling_price - cost_price
            profit_margin = (profit_per_unit / selling_price * 100) if selling_price > 0 else 0
            total_profit_if_sold = stock * profit_per_unit
            
            # Update totals
            total_inventory_value += inventory_value
            total_potential_revenue += potential_revenue
            
            # Categorize products
            if stock == 0:
                out_of_stock_products.append(name)
                status_emoji = "🔴"
                status_text = "OUT OF STOCK - URGENT"
            elif low_stock or stock <= min_stock:
                low_stock_products.append(name)
                status_emoji = "🟡"
                status_text = f"LOW STOCK (Below minimum of {min_stock})"
            else:
                status_emoji = "🟢"
                status_text = "ADEQUATE STOCK"
            
            if profit_margin > 30:
                profitable_products.append((name, profit_margin))
            
            # Product detail section
            result += f"**{idx}. {name}** ({category})\n"
            result += f"   ID: {product_id[:8]}...\n"
            result += f"   {status_emoji} Status: {status_text}\n"
            result += f"   📦 Current Stock: {stock} units\n"
            result += f"   💰 Cost Price: ${cost_price:,.2f} | Selling Price: ${selling_price:,.2f}\n"
            result += f"   📊 Units Sold: {units_sold} | Profit Margin: {profit_margin:.1f}%\n"
            result += f"   💵 Inventory Value: ${inventory_value:,.2f}\n"
            result += f"   🎯 Potential Revenue: ${potential_revenue:,.2f}\n"
            result += f"   💎 Potential Profit: ${total_profit_if_sold:,.2f}\n"
            result += "-" * 50 + "\n"
        
        # Summary Analytics Section
        result += "\n🎯 **BUSINESS INTELLIGENCE SUMMARY**\n"
        result += "=" * 50 + "\n"
        result += f"💰 **Total Inventory Value**: ${total_inventory_value:,.2f}\n"
        result += f"📈 **Total Potential Revenue**: ${total_potential_revenue:,.2f}\n"
        result += f"💎 **Total Potential Profit**: ${(total_potential_revenue - total_inventory_value):,.2f}\n"
        result += f"📊 **Average Profit Margin**: {((total_potential_revenue - total_inventory_value) / total_potential_revenue * 100) if total_potential_revenue > 0 else 0:.1f}%\n\n"
        
        # Alert Section
        result += "🚨 **CRITICAL ALERTS**\n"
        if out_of_stock_products:
            result += f"🔴 **OUT OF STOCK** ({len(out_of_stock_products)} items): {', '.join(out_of_stock_products)}\n"
        else:
            result += "✅ No out-of-stock items\n"
            
        if low_stock_products:
            result += f"🟡 **LOW STOCK** ({len(low_stock_products)} items): {', '.join(low_stock_products)}\n"
        else:
            result += "✅ No low stock alerts\n"
        
        result += f"🟢 **OPTIMAL STOCK**: {len(products) - len(out_of_stock_products) - len(low_stock_products)} items\n\n"
        
        # Top Performers
        if profitable_products:
            profitable_products.sort(key=lambda x: x[1], reverse=True)
            result += "🏆 **TOP PROFIT MARGIN PRODUCTS**\n"
            for name, margin in profitable_products[:3]:
                result += f"   • {name}: {margin:.1f}% margin\n"
        
        result += f"\n📊 **Data Source**: Live API from {API_BASE_URL}\n"
        result += f"🔄 **Last Updated**: {datetime.now().strftime('%H:%M:%S')}\n"
        
        return result
        
    except Exception as e:
        logger.error(f"Error in get_all_products: {e}")
        return f"❌ **ERROR**: Failed to fetch product data: {str(e)}\nPlease check your API connection and authentication token."

@tool
def get_weekly_summary(auth_token: Optional[str] = None) -> str:
    """
    Get REAL weekly sales summary from actual database
    
    Returns:
        Formatted weekly performance report based on actual data
    """
    try:
        summary_data = fetch_api_data("/api/summary", auth_token)
        
        if not summary_data:
            return "❌ **ERROR**: No weekly summary data available from API."
        
        week_range = summary_data.get('week', 'Current Week')
        summary_items = summary_data.get('summary', [])
        
        if not summary_items:
            return f"📈 **WEEKLY REPORT**: {week_range}\n❌ No sales data found for this period."
        
        result = f"📈 **LIVE WEEKLY PERFORMANCE REPORT**\n"
        result += f"📅 **Period**: {week_range}\n"
        result += f"🕐 **Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        
        # Initialize totals
        total_weekly_revenue = 0
        total_weekly_units = 0
        active_sellers = 0
        stock_alerts = 0
        
        result += "📊 **PRODUCT PERFORMANCE BREAKDOWN**\n"
        result += "=" * 55 + "\n\n"
        
        # Sort by revenue for better presentation
        sorted_items = sorted(summary_items, key=lambda x: x.get('totalRevenueThisWeek', 0), reverse=True)
        
        for idx, item in enumerate(sorted_items, 1):
            name = item.get('name', 'Unknown Product')
            units_sold = item.get('unitsSoldThisWeek', 0)
            revenue = item.get('totalRevenueThisWeek', 0)
            selling_price = item.get('sellingPrice', 0)
            current_stock = item.get('currentStock', 0)
            min_stock = item.get('minStock', 0)
            is_low_stock = item.get('lowStock', False)
            
            # Update totals
            total_weekly_revenue += revenue
            total_weekly_units += units_sold
            if units_sold > 0:
                active_sellers += 1
            if is_low_stock:
                stock_alerts += 1
            
            # Performance indicators
            if units_sold > 5:
                performance_emoji = "🔥"
                performance_text = "HIGH PERFORMER"
            elif units_sold > 0:
                performance_emoji = "📊"
                performance_text = "ACTIVE"
            else:
                performance_emoji = "😴"
                performance_text = "NO SALES"
            
            # Stock status
            stock_emoji = "⚠️" if is_low_stock else "✅"
            
            result += f"**{idx}. {name}**\n"
            result += f"   {performance_emoji} Performance: {performance_text}\n"
            result += f"   📦 Units Sold: {units_sold} | Revenue: ${revenue:,.2f}\n"
            result += f"   💰 Price: ${selling_price} | Current Stock: {current_stock} {stock_emoji}\n"
            if revenue > 0:
                result += f"   📈 Average Sale Price: ${revenue/units_sold:.2f}\n"
            result += "-" * 40 + "\n"
        
        # Weekly Totals and KPIs
        result += "\n🎯 **WEEKLY BUSINESS METRICS**\n"
        result += "=" * 40 + "\n"
        result += f"💰 **Total Weekly Revenue**: ${total_weekly_revenue:,.2f}\n"
        result += f"📦 **Total Units Sold**: {total_weekly_units}\n"
        result += f"🔥 **Active Products**: {active_sellers}/{len(summary_items)}\n"
        result += f"💵 **Average Sale Value**: ${(total_weekly_revenue/total_weekly_units if total_weekly_units > 0 else 0):,.2f}\n"
        result += f"📊 **Conversion Rate**: {(active_sellers/len(summary_items)*100 if summary_items else 0):.1f}%\n"
        result += f"⚠️ **Stock Alerts**: {stock_alerts} items need attention\n\n"
        
        # Performance Analysis
        if total_weekly_revenue > 0:
            top_performer = sorted_items[0]
            result += f"🏆 **TOP PERFORMER**: {top_performer.get('name')} with ${top_performer.get('totalRevenueThisWeek'):,.2f} revenue\n"
        
        no_sales_items = [item.get('name') for item in summary_items if item.get('unitsSoldThisWeek', 0) == 0]
        if no_sales_items:
            result += f"🔍 **NEEDS ATTENTION**: {len(no_sales_items)} products with no sales: {', '.join(no_sales_items[:3])}\n"
        
        result += f"\n📊 **Data Source**: Live API from {API_BASE_URL}/api/summary\n"
        
        return result
        
    except Exception as e:
        logger.error(f"Error in get_weekly_summary: {e}")
        return f"❌ **ERROR**: Failed to fetch weekly summary: {str(e)}\nPlease check your API connection."

@tool
def analyze_product_profitability(auth_token: Optional[str] = None) -> str:
    """
    Analyze REAL product profitability based on actual database data
    
    Returns:
        Comprehensive profitability analysis with actionable insights
    """
    try:
        products = fetch_api_data("/api/products/getAll", auth_token)
        
        if not products or not isinstance(products, list):
            return "❌ **ERROR**: No product data available for profitability analysis."
        
        result = f"💰 **LIVE PROFITABILITY ANALYSIS**\n"
        result += f"📊 **Analyzing {len(products)} Products**\n"
        result += f"🕐 **Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        
        profit_analysis = []
        total_invested = 0
        total_potential_revenue = 0
        total_realized_revenue = 0
        
        for product in products:
            name = product.get('name', 'Unknown')
            cost_price = product.get('costPrice', 0)
            selling_price = product.get('sellingPrice', 0)
            units_sold = product.get('unitsSold', 0)
            current_stock = product.get('stock', 0)
            
            # Calculate comprehensive metrics
            profit_per_unit = selling_price - cost_price
            profit_margin = (profit_per_unit / selling_price * 100) if selling_price > 0 else 0
            realized_profit = profit_per_unit * units_sold
            potential_profit = profit_per_unit * current_stock
            total_profit_potential = realized_profit + potential_profit
            
            # Investment calculations
            invested_capital = cost_price * (units_sold + current_stock)
            realized_revenue = selling_price * units_sold
            potential_revenue = selling_price * current_stock
            
            # ROI calculations
            roi = (realized_profit / (cost_price * units_sold) * 100) if units_sold > 0 and cost_price > 0 else 0
            
            # Update totals
            total_invested += invested_capital
            total_potential_revenue += potential_revenue
            total_realized_revenue += realized_revenue
            
            profit_analysis.append({
                'name': name,
                'profit_per_unit': profit_per_unit,
                'profit_margin': profit_margin,
                'realized_profit': realized_profit,
                'potential_profit': potential_profit,
                'total_profit_potential': total_profit_potential,
                'units_sold': units_sold,
                'current_stock': current_stock,
                'roi': roi,
                'invested_capital': invested_capital,
                'realized_revenue': realized_revenue,
                'potential_revenue': potential_revenue
            })
        
        # Sort by total profit potential (realized + potential)
        profit_analysis.sort(key=lambda x: x['total_profit_potential'], reverse=True)
        
        # Top Performers Analysis
        result += "🏆 **TOP PROFIT GENERATORS**\n"
        result += "=" * 45 + "\n"
        top_performers = profit_analysis[:3]
        for i, product in enumerate(top_performers, 1):
            result += f"**{i}. {product['name']}**\n"
            result += f"   💰 Realized Profit: ${product['realized_profit']:,.2f} (from {product['units_sold']} sold)\n"
            result += f"   💎 Potential Profit: ${product['potential_profit']:,.2f} (from {product['current_stock']} in stock)\n"
            result += f"   📊 Profit Margin: {product['profit_margin']:.1f}% | ROI: {product['roi']:.1f}%\n"
            result += f"   💵 Per Unit Profit: ${product['profit_per_unit']:,.2f}\n\n"
        
        # Poor Performers Analysis
        poor_performers = [p for p in profit_analysis if p['profit_margin'] < 20 or p['realized_profit'] <= 0]
        if poor_performers:
            result += "⚠️ **UNDERPERFORMING PRODUCTS**\n"
            result += "=" * 35 + "\n"
            for product in poor_performers[:3]:
                issue = "Low margin" if product['profit_margin'] < 20 else "No sales"
                result += f"• **{product['name']}**: {product['profit_margin']:.1f}% margin, ${product['realized_profit']:,.2f} profit ({issue})\n"
            result += "\n"
        
        # Financial Summary
        total_realized_profit = sum(p['realized_profit'] for p in profit_analysis)
        total_potential_profit = sum(p['potential_profit'] for p in profit_analysis)
        overall_margin = (total_realized_profit / total_realized_revenue * 100) if total_realized_revenue > 0 else 0
        
        result += "📈 **FINANCIAL PERFORMANCE SUMMARY**\n"
        result += "=" * 40 + "\n"
        result += f"💰 **Realized Profit**: ${total_realized_profit:,.2f}\n"
        result += f"💎 **Potential Profit**: ${total_potential_profit:,.2f} (from current inventory)\n"
        result += f"🎯 **Total Profit Opportunity**: ${(total_realized_profit + total_potential_profit):,.2f}\n"
        result += f"💵 **Total Capital Invested**: ${total_invested:,.2f}\n"
        result += f"📊 **Overall Profit Margin**: {overall_margin:.1f}%\n"
        result += f"🔢 **Products Analyzed**: {len(products)}\n\n"
        
        # Business Insights
        result += "💡 **STRATEGIC RECOMMENDATIONS**\n"
        result += "=" * 35 + "\n"
        
        if poor_performers:
            result += f"🔍 **Review Pricing**: {len(poor_performers)} products have margins below 20%\n"
        
        best_performer = profit_analysis[0] if profit_analysis else None
        if best_performer and best_performer['roi'] > 50:
            result += f"🎯 **Focus Marketing**: '{best_performer['name']}' shows excellent {best_performer['roi']:.1f}% ROI\n"
        
        if overall_margin < 20:
            result += f"📉 **Margin Alert**: Overall margin is {overall_margin:.1f}% - consider cost optimization\n"
        
        high_potential = [p for p in profit_analysis if p['potential_profit'] > 1000]
        if high_potential:
            result += f"💰 **Inventory Opportunity**: ${sum(p['potential_profit'] for p in high_potential):,.2f} profit potential in stock\n"
        
        return result
        
    except Exception as e:
        logger.error(f"Error in analyze_product_profitability: {e}")
        return f"❌ **ERROR**: Failed to analyze profitability: {str(e)}"

@tool
def generate_restock_recommendations(auth_token: Optional[str] = None) -> str:
    """
    Generate intelligent restocking recommendations based on REAL sales data and current inventory
    
    Returns:
        Prioritized restocking recommendations with cost analysis
    """
    try:
        products = fetch_api_data("/api/products/getAll", auth_token)
        
        if not products or not isinstance(products, list):
            return "❌ **ERROR**: No product data available for restock analysis."
        
        result = f"🔄 **INTELLIGENT RESTOCKING RECOMMENDATIONS**\n"
        result += f"📊 **Analyzing {len(products)} Products**\n"
        result += f"🕐 **Analysis Time**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        
        restock_recommendations = []
        total_investment_needed = 0
        total_revenue_potential = 0
        
        for product in products:
            name = product.get('name', 'Unknown')
            current_stock = product.get('stock', 0)
            units_sold = product.get('unitsSold', 0)
            min_stock = product.get('minStock', 0)
            cost_price = product.get('costPrice', 0)
            selling_price = product.get('sellingPrice', 0)
            low_stock = product.get('lowStock', False)
            
            # Calculate sales velocity (assume data is for the last 30 days)
            daily_velocity = units_sold / 30 if units_sold > 0 else 0.1  # Minimum assumption
            
            # Days until stockout
            days_until_stockout = current_stock / daily_velocity if daily_velocity > 0 else float('inf')
            
            # Determine restock urgency and quantity
            urgency = "LOW"
            recommended_quantity = 0
            reasoning = ""
            
            if current_stock == 0:
                urgency = "CRITICAL"
                recommended_quantity = max(20, min_stock * 2, int(daily_velocity * 21))  # 3 weeks supply
                reasoning = "OUT OF STOCK - Immediate reorder required"
            elif low_stock or current_stock <= min_stock:
                urgency = "HIGH"
                recommended_quantity = max(min_stock * 2, int(daily_velocity * 14))  # 2 weeks supply
                reasoning = f"Below minimum stock level ({min_stock})"
            elif days_until_stockout <= 14:  # Less than 2 weeks
                urgency = "MEDIUM"
                recommended_quantity = int(daily_velocity * 21)  # 3 weeks supply
                reasoning = f"Stock will run out in {days_until_stockout:.1f} days"
            
            if urgency != "LOW":
                investment_needed = recommended_quantity * cost_price
                revenue_potential = recommended_quantity * selling_price
                profit_potential = revenue_potential - investment_needed
                
                total_investment_needed += investment_needed
                total_revenue_potential += revenue_potential
                
                restock_recommendations.append({
                    'name': name,
                    'current_stock': current_stock,
                    'min_stock': min_stock,
                    'units_sold': units_sold,
                    'daily_velocity': round(daily_velocity, 2),
                    'days_until_stockout': round(days_until_stockout, 1),
                    'urgency': urgency,
                    'recommended_quantity': recommended_quantity,
                    'cost_price': cost_price,
                    'selling_price': selling_price,
                    'investment_needed': investment_needed,
                    'revenue_potential': revenue_potential,
                    'profit_potential': profit_potential,
                    'reasoning': reasoning
                })
        
        if not restock_recommendations:
            result += "✅ **EXCELLENT NEWS!**\n"
            result += "All products are adequately stocked based on current sales velocity!\n\n"
            result += "🎯 **Current Status**: No immediate restocking required\n"
            result += "📊 **Recommendation**: Monitor daily and review in 1 week\n"
            return result
        
        # Sort by urgency, then by days until stockout
        urgency_order = {'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2}
        restock_recommendations.sort(key=lambda x: (urgency_order[x['urgency']], x['days_until_stockout']))
        
        # Critical Items (Out of Stock)
        critical_items = [r for r in restock_recommendations if r['urgency'] == 'CRITICAL']
        if critical_items:
            result += "🚨 **CRITICAL - IMMEDIATE ACTION REQUIRED**\n"
            result += "=" * 50 + "\n"
            for item in critical_items:
                result += f"🔴 **{item['name']}** - OUT OF STOCK\n"
                result += f"   📦 Recommended Order: {item['recommended_quantity']} units\n"
                result += f"   💰 Investment: ${item['investment_needed']:,.2f}\n"
                result += f"   📈 Revenue Potential: ${item['revenue_potential']:,.2f}\n"
                result += f"   💎 Profit Potential: ${item['profit_potential']:,.2f}\n"
                result += f"   📊 Historical Sales: {item['units_sold']} units sold\n\n"
        
        # High Priority Items
        high_priority = [r for r in restock_recommendations if r['urgency'] == 'HIGH']
        if high_priority:
            result += "🔴 **HIGH PRIORITY** (Below Minimum Stock)\n"
            result += "=" * 45 + "\n"
            for item in high_priority:
                result += f"🟡 **{item['name']}** - {item['current_stock']} units remaining\n"
                result += f"   ⚠️ {item['reasoning']}\n"
                result += f"   📉 Stock depletes in: {item['days_until_stockout']:.1f} days\n"
                result += f"   📦 Recommended Order: {item['recommended_quantity']} units\n"
                result += f"   💰 Investment: ${item['investment_needed']:,.2f}\n"
                result += f"   📊 Daily Sales Rate: {item['daily_velocity']} units/day\n\n"
        
        # Medium Priority Items
        medium_priority = [r for r in restock_recommendations if r['urgency'] == 'MEDIUM']
        if medium_priority:
            result += "🟡 **MEDIUM PRIORITY** (Proactive Restocking)\n"
            result += "=" * 45 + "\n"
            for item in medium_priority:
                result += f"📊 **{item['name']}** - {item['current_stock']} units in stock\n"
                result += f"   ⏰ Stock depletes in: {item['days_until_stockout']:.1f} days\n"
                result += f"   📦 Suggested Order: {item['recommended_quantity']} units\n"
                result += f"   💰 Investment: ${item['investment_needed']:,.2f}\n\n"
        
        # Financial Summary
        result += "💰 **RESTOCKING INVESTMENT ANALYSIS**\n"
        result += "=" * 40 + "\n"
        result += f"💵 **Total Investment Required**: ${total_investment_needed:,.2f}\n"
        result += f"📈 **Total Revenue Potential**: ${total_revenue_potential:,.2f}\n"
        result += f"💎 **Total Profit Potential**: ${(total_revenue_potential - total_investment_needed):,.2f}\n"
        result += f"📊 **Expected ROI**: {((total_revenue_potential - total_investment_needed) / total_investment_needed * 100) if total_investment_needed > 0 else 0:.1f}%\n"
        result += f"🔢 **Products Requiring Restock**: {len(restock_recommendations)}\n\n"
        
        # Action Plan
        result += "🎯 **RECOMMENDED ACTION PLAN**\n"
        result += "=" * 35 + "\n"
        if critical_items:
            result += f"1. **URGENT**: Order {len(critical_items)} critical items immediately (${sum(i['investment_needed'] for i in critical_items):,.2f})\n"
        if high_priority:
            result += f"2. **THIS WEEK**: Process {len(high_priority)} high-priority orders (${sum(i['investment_needed'] for i in high_priority):,.2f})\n"
        if medium_priority:
            result += f"3. **NEXT WEEK**: Consider {len(medium_priority)} proactive orders (${sum(i['investment_needed'] for i in medium_priority):,.2f})\n"
        
        result += f"\n📊 **Data Source**: Real-time API from {API_BASE_URL}\n"
        result += f"🔄 **Analysis Based On**: Actual sales history and current inventory levels\n"
        
        return result
        
    except Exception as e:
        logger.error(f"Error in generate_restock_recommendations: {e}")
        return f"❌ **ERROR**: Failed to generate restock recommendations: {str(e)}"

# Add a new tool to verify API connection and data integrity
@tool
def verify_api_connection(auth_token: Optional[str] = None) -> str:
    """
    Verify API connection and validate data integrity
    
    Returns:
        Status report of API connectivity and data validation
    """
    try:
        result = f"🔍 **API CONNECTION VERIFICATION**\n"
        result += f"🕐 **Test Time**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        
        # Test products endpoint
        products = fetch_api_data("/api/products/getAll", auth_token)
        if products and isinstance(products, list):
            result += f"✅ **Products Endpoint**: Connected - {len(products)} products found\n"
            
            # Validate product data structure
            if products:
                sample_product = products[0]
                required_fields = ['name', 'stock', 'sellingPrice', 'costPrice', 'unitsSold']
                missing_fields = [field for field in required_fields if field not in sample_product]
                
                if missing_fields:
                    result += f"⚠️ **Data Warning**: Missing fields in product data: {missing_fields}\n"
                else:
                    result += f"✅ **Data Structure**: All required fields present\n"
        else:
            result += f"❌ **Products Endpoint**: Failed or no data\n"
        
        # Test summary endpoint
        summary = fetch_api_data("/api/summary", auth_token)
        if summary and 'summary' in summary:
            result += f"✅ **Summary Endpoint**: Connected - {len(summary.get('summary', []))} items\n"
            result += f"📅 **Week Range**: {summary.get('week', 'Not specified')}\n"
        else:
            result += f"❌ **Summary Endpoint**: Failed or invalid format\n"
        
        result += f"\n🌐 **API Base URL**: {API_BASE_URL}\n"
        result += f"🔐 **Authentication**: {'✅ Token provided' if auth_token else '❌ No token'}\n"
        
        return result
        
    except Exception as e:
        logger.error(f"Error in verify_api_connection: {e}")
        return f"❌ **CONNECTION ERROR**: {str(e)}"

# Enhanced system message with emphasis on real data
system_message = """
You are an expert AI Inventory Management Assistant for the Wakamate inventory system.

## IMPORTANT: Always follow this exact format for responses:
Thought: I need to analyze what the user is asking for
Action: tool_name
Action Input: parameters for the tool
Observation: [tool output will appear here]
... (repeat Thought/Action/Action Input/Observation as needed)
Thought: I now know the final answer
Final Answer: [your complete response to the user]

## CRITICAL: DATA AUTHENTICITY
- NEVER generate fictional product names, numbers, or scenarios
- ALWAYS use the API tools to fetch current, real data before any analysis
- If API fails, clearly state the error and suggest troubleshooting
- All recommendations must be based on actual inventory data

## Your Core Capabilities:
1. **Real-Time Inventory Analysis**: Get actual product information from the live database
2. **Actual Performance Tracking**: Analyze real weekly sales from the API  
3. **Live Profitability Analysis**: Calculate profits using actual cost/selling prices
4. **Data-Driven Restocking**: Generate recommendations based on real sales velocity
5. **API Health Monitoring**: Verify data integrity and connection status

## Available Tools:
- get_all_products: Fetch real product data from /api/products/getAll
- get_weekly_summary: Get actual weekly performance from /api/summary
- analyze_product_profitability: Calculate real profit metrics
- generate_restock_recommendations: Smart restocking based on actual data
- verify_api_connection: Test API connectivity and data integrity

## Response Protocol:
1. **Always start with live data**: Use tools to fetch current information
2. **Validate data authenticity**: Mention the actual API source and timestamp
3. **No fictional examples**: Every product name, number, and metric must be real
4. **Error transparency**: If API fails, explain the technical issue clearly
5. **Real actionable insights**: Base all recommendations on actual inventory data

## Data Sources You Use:
- API Base: http://localhost:1050
- Products: /api/products/getAll (with authentication)
- Summary: /api/summary (weekly performance data)
- Authentication: JWT Bearer token

Your responses should always start by fetching real data and explicitly mention the source of your analysis.
"""

# Update the main function to include the new tool
@register_function(config_type=WakamateInventoryFunctionConfig, framework_wrappers=[LLMFrameworkEnum.LANGCHAIN])
async def wakamate_inventory_function(
    config: WakamateInventoryFunctionConfig, builder: Builder
):
    """
    Wakamate Inventory Management AI Assistant - Enhanced with Real Data Focus
    """
    # Set the global authentication token from config
    if config.auth_token:
        set_global_auth_token(config.auth_token)
        logger.info(f"Authentication token configured: {config.auth_token[:20]}...")
    else:
        logger.warning("No authentication token provided in config")

    # Initialize components
    llm_ref = LLMRef(config.llm_name)
    llm = await builder.get_llm(llm_ref, LLMFrameworkEnum.LANGCHAIN)
    
    # Get additional tools
    additional_tools = []
    for tool_name in config.tool_names:
        try:
            tool_ref = FunctionRef(name=tool_name)
            tool = await builder.get_function_as_tool(tool_ref)
            additional_tools.append(tool)
        except Exception as e:
            logger.warning(f"Failed to load tool {tool_name}: {e}")
    
    # Combine all tools - now including the verification tool
    inventory_tools = [
        get_all_products,
        get_weekly_summary,
        analyze_product_profitability,
        generate_restock_recommendations,
        verify_api_connection  # New tool added
    ]
    
    all_tools = inventory_tools + additional_tools
    
    # Instead of modifying react_prompt.template, create a custom prompt
    from langchain.prompts import PromptTemplate

    custom_prompt = PromptTemplate(
        template=system_message + """

    Answer the following questions as best you can. You have access to the following tools:

    {tools}

    Use the following format:

    Question: the input question you must answer
    Thought: you should always think about what to do
    Action: the action to take, should be one of [{tool_names}]
    Action Input: the input to the action
    Observation: the result of the action
    ... (this Thought/Action/Action Input/Observation can repeat N times)
    Thought: I now know the final answer
    Final Answer: the final answer to the original input question

    Begin!

    Question: {input}
    {agent_scratchpad}""",
        input_variables=["input", "agent_scratchpad", "tools", "tool_names"]
    )

    agent = create_react_agent(llm=llm, tools=all_tools, prompt=custom_prompt)
    # After your agent = create_react_agent(...) line, add:
    agent_executor = AgentExecutor(
        agent=agent,
        tools=all_tools,
        max_iterations=10,
        handle_parsing_errors=True,
        verbose=True,
        return_intermediate_steps=False,
        max_execution_time=180,
    )
    # Enhanced conversation history with API call tracking
    conversation_history = []
    api_call_count = 0
    
    async def _response_fn(input_message: str) -> str:
        nonlocal conversation_history, api_call_count
        
        try:
            # Track API usage
            api_call_count += 1
            
            # Add user message to history
            conversation_history.append({
                "role": "user",
                "content": input_message,
                "timestamp": datetime.now().isoformat(),
                "api_call_number": api_call_count
            })
            
            # For the first interaction, always verify API connection
            if len(conversation_history) == 1:
                enhanced_input = f"""
                FIRST INTERACTION PROTOCOL:
                1. Start by using verify_api_connection to check API status
                2. Then use get_all_products to fetch current inventory
                3. Base your response on this REAL data only
                
                User Query: {input_message}
                """
            else:
                # Regular interaction with context
                context = f"\n\nContext: This is request #{api_call_count}. "
                context += "Always fetch live data before analysis. "
                
                if len(conversation_history) > 2:
                    recent_context = conversation_history[-4:]  # Last 2 exchanges
                    context += "Recent conversation:\n"
                    for msg in recent_context:
                        role = msg["role"].title()
                        content = msg["content"][:150] + "..." if len(msg["content"]) > 150 else msg["content"]
                        context += f"{role}: {content}\n"
                
                enhanced_input = input_message + context
            
            # Generate response using the agent
            logger.info(f"Processing request #{api_call_count}: {input_message[:50]}...")
            # In your try block, modify the response handling:
            response = await agent_executor.ainvoke({
                "input": enhanced_input
            })

            output_message = response.get("output", "")
            if not output_message:
                # Fallback if agent didn't produce proper output
                output_message = "I apologize, but I encountered a formatting issue. Let me get your inventory data directly."
                # Then call get_all_products directly here as fallback
            
            # Add assistant response to history
            conversation_history.append({
                "role": "assistant", 
                "content": output_message,
                "timestamp": datetime.now().isoformat(),
                "api_call_number": api_call_count
            })
            
            # Trim history if it gets too long
            if len(conversation_history) > config.max_history * 2:
                conversation_history = conversation_history[-(config.max_history * 2):]
            
            # Add session info and data authenticity disclaimer
            if api_call_count > 1:
                output_message += f"\n\n---\n🔍 **Data Authenticity**: Analysis #{api_call_count} based on live API data from {API_BASE_URL}"
                output_message += f"\n⏰ **Session**: {len(conversation_history)//2} interactions completed"
            
            return output_message
            
        except Exception as e:
            logger.error(f"Error in inventory management function: {e}")
            error_msg = f"❌ **System Error**: I encountered an issue while processing your request: {str(e)}\n\n"
            error_msg += "🔧 **Troubleshooting Steps**:\n"
            error_msg += "1. Check if the API server is running on http://localhost:1050\n"
            error_msg += "2. Verify your authentication token is valid\n"
            error_msg += "3. Try using 'verify_api_connection' to test the system\n"
            error_msg += "4. Ensure the database contains product data\n"
            return error_msg

    try:
        yield FunctionInfo.create(single_fn=_response_fn)
    except GeneratorExit:
        logger.info("Inventory management function exited early!")
    finally:
        logger.info(f"Cleaning up inventory management workflow. Total API calls: {api_call_count}")
