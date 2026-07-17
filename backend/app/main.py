import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.logging_config import setup_logging
from app.core.middleware import register_middleware
from app.core.exceptions import register_exception_handlers
from app.api.v1.router import api_router

# 1. Initialize Log Formats
setup_logging()

app = FastAPI(title="StadiumMind AI Backend", version="0.1.0")

# 2. CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Custom Request Metrics Middleware
register_middleware(app)

# 4. Standard Exception Interceptors
register_exception_handlers(app)

# 5. Mount Unified routers
app.include_router(api_router, prefix="/api/v1")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
