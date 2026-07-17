// backend/app/api/v1/chat.py
from fastapi import APIRouter, Body
from pydantic import BaseModel
import os

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None

class ChatResponse(BaseModel):
    reply: str
    session_id: str

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest = Body(...)):
    """Simple echo endpoint that pretends to call an LLM.
    In a real implementation you would invoke your LangChain/LLM service here.
    """
    # For demo, generate a fake reply
    user_msg = payload.message
    reply = f"You said: {user_msg}. (AI response placeholder)"
    # Generate a session id if not provided
    session_id = payload.session_id or os.urandom(8).hex()
    return ChatResponse(reply=reply, session_id=session_id)
