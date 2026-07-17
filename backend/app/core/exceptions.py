from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
from app.core.logging_config import logger

class StadiumMindException(Exception):
    """Base class for all StadiumMind custom exceptions."""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class IncidentReportException(StadiumMindException):
    """Raised when emergency SOS coordinates or validation fails."""
    pass

class QueuePredictionException(StadiumMindException):
    """Raised when queue forecasting telemetry drops."""
    pass

def register_exception_handlers(app: FastAPI):
    """Registers standard handlers in the FastAPI app container."""
    
    @app.exception_handler(StadiumMindException)
    async def stadiummind_exception_handler(request: Request, exc: StadiumMindException):
        logger.error(f"StadiumMind error on {request.url.path}: {exc.message}")
        return JSONResponse(
            status_code=exc.status_code,
            content={"success": False, "error": exc.message, "type": exc.__class__.__name__},
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logger.critical(f"Unhandled system crash on {request.url.path}: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": "Internal operations error. Crews are dispatched to fix this."},
        )
