from fastapi import APIRouter
from app.api.v1.endpoints import (
    chat,
    crowd,
    navigation,
    queue,
    volunteer,
    admin,
    accessibility,
    sustainability,
    emergency,
    health,
    auth,
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(chat.router, tags=["chat"])
api_router.include_router(crowd.router, tags=["crowd"])
api_router.include_router(navigation.router, tags=["navigation"])
api_router.include_router(queue.router, tags=["queue"])
api_router.include_router(volunteer.router, tags=["volunteer"])
api_router.include_router(admin.router, tags=["admin"])
api_router.include_router(accessibility.router, tags=["accessibility"])
api_router.include_router(sustainability.router, tags=["sustainability"])
api_router.include_router(emergency.router, tags=["emergency"])
