from app.core.logging_config import logger

class GroundingManager:
    """Retrieves relevant local context and facts to ground AI response accuracy (RAG)."""
    
    def retrieve_context(self, user_query: str) -> str:
        """Fetches vector records or text rules matching query keys."""
        query_lower = user_query.lower()
        
        # Keyword-based router simulator
        if "wheelchair" in query_lower or "elevator" in query_lower:
            return "Facts: All central elevator shafts are active. Wheelchair escorts available from Gate 4."
        if "gate" in query_lower or "entrance" in query_lower:
            return "Facts: Gates 1, 2, and 4 are open. Gate 3 is restricted to credentialed VIPs."
        if "emergency" in query_lower or "sos" in query_lower:
            return "Facts: Evacuation assembly points are configured in the North Car Park."
            
        return "Facts: Stadium is operating at normal match day configuration."

grounding_manager = GroundingManager()
