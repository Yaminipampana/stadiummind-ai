import os
import google.generativeai as genai
from typing import List, Dict, Any
from app.core.config import settings
from app.core.logging_config import logger

class AIClient:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.AI_MODEL_NAME
        # In-memory store for session logs. Maps session_id -> list of content dicts
        self.history_store: Dict[str, List[Dict[str, Any]]] = {}
        
        if self.api_key:
            genai.configure(api_key=self.api_key)
            logger.info("Google Generative AI successfully configured with active api key.")
        else:
            logger.warning("GEMINI_API_KEY is missing. AI Client running in simulation fallback mode.")

    def _get_history(self, session_id: str) -> List[Dict[str, Any]]:
        if not session_id:
            return []
        if session_id not in self.history_store:
            self.history_store[session_id] = []
        return self.history_store[session_id]

    def _add_to_history(self, session_id: str, role: str, content: str):
        if not session_id:
            return
        history = self._get_history(session_id)
        history.append({
            "role": "user" if role == "user" else "model",
            "parts": [content]
        })
        # Keep window size limited to prevent context bloat (last 20 messages)
        if len(history) > 20:
            self.history_store[session_id] = history[-20:]

    async def query_model(self, prompt: str, system_instruction: str, session_id: str = "") -> str:
        """Invokes generative modeling APIs with instructions and grounding parameters."""
        if not self.api_key:
            logger.warning("Generative modeling requested but API key is missing. Simulation reply issued.")
            return "Active Model Simulation mode. Configure GEMINI_API_KEY to interact with live Gemini models."

        try:
            # 1. Initialize Generative Model
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=system_instruction
            )

            # 2. Retrieve past session history
            history = self._get_history(session_id)
            
            # Format custom history payload to genai content types
            contents_payload = []
            for msg in history:
                contents_payload.append(
                    genai.types.Content(
                        role=msg["role"],
                        parts=[genai.types.Part.from_text(text=msg["parts"][0])]
                    )
                )

            # 3. Append current user query
            contents_payload.append(
                genai.types.Content(
                    role="user",
                    parts=[genai.types.Part.from_text(text=prompt)]
                )
            )

            # 4. Generate content asynchronously
            response = await model.generate_content_async(contents=contents_payload)
            reply_text = response.text

            # 5. Save back user prompt and assistant response to history
            self._add_to_history(session_id, "user", prompt)
            self._add_to_history(session_id, "model", reply_text)

            return reply_text
            
        except Exception as e:
            logger.error(f"Error querying Gemini API: {e}")
            raise e

ai_client = AIClient()
export_ai_client = ai_client
