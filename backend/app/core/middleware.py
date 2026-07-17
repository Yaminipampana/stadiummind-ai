import time
from fastapi import Request, FastAPI
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.logging_config import logger

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Logs incoming routes, query metrics, and completion headers."""
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        # Log request receipt
        logger.info(f"--> Incoming {request.method} {request.url.path}")
        
        try:
            response = await call_next(request)
            duration = time.time() - start_time
            response.headers["X-Process-Time"] = f"{duration:.4f}s"
            logger.info(f"<-- Outgoing status={response.status_code} in {duration:.4f}s")
            return response
        except Exception as e:
            duration = time.time() - start_time
            logger.error(f"<-- Crashed status=500 in {duration:.4f}s. Detail: {e}")
            raise e

def register_middleware(app: FastAPI):
    """Hooks standard custom middleware blocks into the FastAPI instance."""
    app.add_middleware(RequestLoggingMiddleware)
