from fastapi import APIRouter
from app.api.v1 import clients, admins, blog

api_router = APIRouter()

api_router.include_router(clients.router, prefix="/clients", tags=["clients"])
api_router.include_router(admins.router, prefix="/admins", tags=["admins"])
api_router.include_router(blog.router, prefix="/blog", tags=["blog"])