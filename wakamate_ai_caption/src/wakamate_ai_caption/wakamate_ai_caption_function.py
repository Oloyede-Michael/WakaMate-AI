import logging
import json
import requests
from typing import Dict, List, Any, Optional
from datetime import datetime

from pydantic import Field
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from aiq.builder.builder import Builder
from aiq.builder.framework_enum import LLMFrameworkEnum
from aiq.builder.function_info import FunctionInfo
from aiq.cli.register_workflow import register_function
from aiq.data_models.component_ref import LLMRef
from aiq.data_models.function import FunctionBaseConfig

logger = logging.getLogger(__name__)


class WakamateAiCaptionFunctionConfig(FunctionBaseConfig, name="wakamate_ai_caption"):
    """
    AI-Powered Social Media Caption Generator - Wakamate Assistant
    """
    llm_name: str = Field(description="Name of the LLM to use")
    description: str = Field(default="AI-Powered Social Media Caption Generator")
    max_history: int = Field(default=15, description="Maximum conversation history")
    api_base_url: str = Field(default="http://localhost:1050", description="Wakamate API base URL")
    auth_token: Optional[str] = Field(default="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGUzMmMyMDgxOGY4ZjI3MzU0MzczMyIsImlhdCI6MTc1NTY4MzE4MywiZXhwIjoxNzU2Mjg3OTgzfQ.Blskf_LmiE-ox5h4X39CHrbwPMXdnQtocc3RoznlBD0", description="Authentication token for API")


# API Configuration
API_BASE_URL = "http://localhost:1050"
API_HEADERS = {"Content-Type": "application/json"}
_config_auth_token = None


def set_global_auth_token(token: str):
    """Set global authentication token"""
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
            logger.warning("No authentication token provided")
        
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


class CaptionGenerator:
    """Helper class for caption generation and inventory management"""
    
    def __init__(self):
        self.products = []
        
    def fetch_inventory(self):
        """Fetch inventory data"""
        self.products = fetch_api_data("/api/products/getAll")
        if not isinstance(self.products, list):
            self.products = []
    
    def find_product_in_inventory(self, query: str) -> Optional[Dict[str, Any]]:
        """Find product in inventory based on query"""
        if not self.products:
            return None
            
        query_lower = query.lower()
        
        # Direct name match
        for product in self.products:
            name = product.get('name', '').lower()
            if query_lower in name or name in query_lower:
                return product
        
        # Category or description match
        for product in self.products:
            category = product.get('category', '').lower()
            description = product.get('description', '').lower()
            if query_lower in category or query_lower in description:
                return product
                
        return None
    
    def get_inventory_products_list(self) -> str:
        """Get formatted list of inventory products"""
        if not self.products:
            return "No products found in inventory."
        
        result = "📦 **YOUR INVENTORY PRODUCTS**:\n\n"
        for i, product in enumerate(self.products, 1):
            name = product.get('name', 'Unknown')
            category = product.get('category', 'N/A')
            stock = product.get('stock', 0)
            selling_price = product.get('sellingPrice', 0)
            
            result += f"{i}. **{name}**\n"
            result += f"   • Category: {category}\n"
            result += f"   • Stock: {stock} units\n"
            result += f"   • Price: ${selling_price:.2f}\n\n"
            
            if i >= 10:  # Limit to first 10 products
                result += f"... and {len(self.products) - 10} more products\n"
                break
                
        return result
    
    def format_product_for_caption(self, product: Dict[str, Any]) -> str:
        """Format product data for caption generation"""
        name = product.get('name', 'Unknown Product')
        category = product.get('category', 'General')
        selling_price = product.get('sellingPrice', 0)
        description = product.get('description', '')
        stock = product.get('stock', 0)
        
        context = f"Product: {name}\n"
        context += f"Category: {category}\n"
        context += f"Price: ${selling_price:.2f}\n"
        
        if description:
            context += f"Description: {description}\n"
            
        context += f"Stock Status: {'In Stock' if stock > 0 else 'Limited Stock'}\n"
        
        return context


@register_function(config_type=WakamateAiCaptionFunctionConfig, framework_wrappers=[LLMFrameworkEnum.LANGCHAIN])
async def wakamate_ai_caption_function(
    config: WakamateAiCaptionFunctionConfig, builder: Builder
):
    """
    AI-Powered Social Media Caption Generator - Wakamate Assistant
    """
    # Set authentication token
    if config.auth_token:
        set_global_auth_token(config.auth_token)
        logger.info(f"Authentication token configured: {config.auth_token[:20]}...")

    # Initialize LLM
    llm_ref = LLMRef(config.llm_name)
    llm = await builder.get_llm(llm_ref, LLMFrameworkEnum.LANGCHAIN)
    
    # Initialize caption generator
    generator = CaptionGenerator()
    
    # Create prompt template
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are Wakamate, an expert AI Social Media Caption Generator and Marketing Assistant.

Your capabilities:
- Generate engaging captions for Instagram, Facebook, Twitter, LinkedIn, TikTok
- Create product-specific marketing content using inventory data
- Generate captions for items not in inventory when specifically requested
- Provide multiple caption variations with different tones (professional, casual, trendy, funny)
- Include relevant hashtags and emojis

Guidelines:
- Always introduce yourself as "Wakamate" when greeting users
- For inventory-related requests, use real product data from the user's inventory
- For non-inventory items, generate creative captions based on the product/topic provided
- Ask for clarification when requests are ambiguous
- Provide 2-3 caption variations with different styles
- Include strategic hashtags and emojis
- Keep captions engaging and platform-appropriate

Be creative, helpful, and focus on driving engagement and sales."""),
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
            
            # Fetch fresh inventory data
            logger.info("Fetching inventory data...")
            generator.fetch_inventory()
            
            # Analyze user intent
            input_lower = input_message.lower()
            inventory_keywords = ["inventory", "stock", "my products", "what i have", "my items"]
            specific_product_keywords = ["caption for", "generate caption", "create caption"]
            
            context = f"User Request: {input_message}\n\n"
            
            # Check if user is asking about inventory
            if any(keyword in input_lower for keyword in inventory_keywords):
                if not generator.products:
                    context += "❌ **No inventory data available**. Please check API connection.\n"
                else:
                    context += f"🏪 **INVENTORY CONTEXT** ({len(generator.products)} products available):\n\n"
                    context += generator.get_inventory_products_list()
                    context += "\nGenerate engaging social media captions for these products to boost sales and engagement.\n"
            
            # Check if user mentions a specific product
            elif any(keyword in input_lower for keyword in specific_product_keywords):
                # Try to find product in inventory first
                product_found = None
                words = input_message.split()
                
                for i, word in enumerate(words):
                    potential_product = " ".join(words[i:i+3])  # Check 1-3 word combinations
                    product_found = generator.find_product_in_inventory(potential_product)
                    if product_found:
                        break
                
                if product_found:
                    context += "✅ **PRODUCT FOUND IN INVENTORY**:\n\n"
                    context += generator.format_product_for_caption(product_found)
                    context += "\nGenerate captions highlighting this product from your inventory.\n"
                else:
                    context += "💡 **PRODUCT NOT IN INVENTORY** - Generate creative captions based on the request.\n"
                    if generator.products:
                        context += f"\nNote: You have {len(generator.products)} products in your inventory if you'd like captions for those instead.\n"
            
            # General caption request
            elif "caption" in input_lower and not any(keyword in input_lower for keyword in inventory_keywords):
                if generator.products:
                    context += f"🤔 **CLARIFICATION NEEDED**: You have {len(generator.products)} products in your inventory.\n\n"
                    context += "Would you like captions for:\n"
                    context += "1. A specific product from your inventory?\n"
                    context += "2. A product not in your inventory?\n"
                    context += "3. All your inventory products?\n\n"
                    context += "For now, I'll help with your general request and show some inventory options.\n\n"
                    context += generator.get_inventory_products_list()
                else:
                    context += "💭 **GENERAL CAPTION REQUEST** - I'll create engaging captions based on your request.\n"
            
            # Default: just process the request
            else:
                if generator.products:
                    context += f"📦 **FYI**: You have {len(generator.products)} products in inventory if you need captions for those.\n\n"
                context += "Processing your request...\n"
            
            # Add conversation context
            if len(conversation_history) > 2:
                context += f"\n💬 **Session Context**: Exchange #{len(conversation_history)//2 + 1}\n"
            
            # Generate response
            logger.info(f"Processing caption request: {input_message[:50]}...")
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
            
            # Add footer
            response += f"\n\n---\n📱 **Wakamate Caption Generator**\n"
            response += f"🕒 **Generated**: {datetime.now().strftime('%H:%M:%S')}\n"
            response += f"💬 **Session**: {len(conversation_history)//2} exchanges completed"
            
            return response
            
        except Exception as e:
            logger.error(f"Error in caption generation function: {e}")
            error_msg = f"❌ **System Error**: {str(e)}\n\n"
            error_msg += "🔧 **Troubleshooting**:\n"
            error_msg += "1. Check if API server is running on http://localhost:1050\n"
            error_msg += "2. Verify authentication token is valid\n"
            error_msg += "3. Ensure database connection is stable"
            return error_msg

    try:
        yield FunctionInfo.create(single_fn=_response_fn)
    except GeneratorExit:
        logger.info("Caption generation function exited early!")
    finally:
        logger.info("Cleaning up caption generation workflow.")