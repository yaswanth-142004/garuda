import os
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage


class LLMService:
    def __init__(self):
        self.default_model = "llama-3.3-70b-versatile"
        self.fallback_model = "llama-3.1-8b-instant"
    
    def get_llm(self, model=None, temperature=0.2):
        """Get the language model based on provider."""
        return ChatGroq(
            model=model or self.default_model,
            temperature=temperature,
            max_retries=2
        )
