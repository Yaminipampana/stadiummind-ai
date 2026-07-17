import datetime
import os
import json
import asyncio
from fastapi import APIRouter, Body, Header
from fastapi.responses import StreamingResponse
from app.schemas.stadium import ChatRequest, ChatResponse
from app.services.ai_service import ai_service

router = APIRouter()

@router.post("/chat", response_model=ChatResponse, tags=["chat"])
async def chat_endpoint(
    payload: ChatRequest = Body(...),
    accept_language: str = Header("en")
):
    """Processes queries from the client, grounding them in stadium telemetry."""
    # Canonicalize language code
    lang = accept_language.split(",")[0].split("-")[0].lower()
    
    reply = await ai_service.generate_response(
        user_prompt=payload.message,
        session_id=payload.session_id or "",
        language=lang
    )
    
    session_id = payload.session_id or os.urandom(8).hex()
    return ChatResponse(
        reply=reply,
        session_id=session_id,
        timestamp=datetime.datetime.now(datetime.timezone.utc)
    )

@router.post("/chat/stream", tags=["chat"])
async def chat_stream_endpoint(
    payload: ChatRequest = Body(...),
    accept_language: str = Header("en")
):
    """Streams token chunks to client via Server-Sent Events (SSE)."""
    lang = accept_language.split(",")[0].split("-")[0].lower()
    session_id = payload.session_id or os.urandom(8).hex()

    async def event_generator():
        # Retrieve full response from grounded AI orchestrator
        reply = await ai_service.generate_response(
            user_prompt=payload.message,
            session_id=session_id,
            language=lang
        )
        
        # Simulate network token stream delay chunk-by-chunk
        chunks = [reply[i:i+4] for i in range(0, len(reply), 4)]
        
        for chunk in chunks:
            data = {
                "chunk": chunk,
                "session_id": session_id
            }
            yield f"data: {json.dumps(data)}\n\n"
            await asyncio.sleep(0.02)
            
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
