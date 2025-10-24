from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.db.session import get_db, init_db
from app.api.v1.api import api_router
from app.services.telegram_service import telegram_service
from app.core.config import settings
import asyncio
import logging

logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.PROJECT_VERSION,
        description="API для сайта digital агентства ХакТайка",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    # Include API routes
    app.include_router(api_router, prefix=settings.API_V1_STR)

    # Health check endpoint
    @app.get("/healthz", tags=["system"])
    async def healthz(db: AsyncSession = Depends(get_db)):
        """Health check endpoint"""
        try:
            await db.execute(text("SELECT 1"))
        except Exception as e:
            logger.error(f"Database health check failed: {e}")
            return {"status": "fail", "db": False}
        return {"status": "ok", "db": True}

    # Startup event
    @app.on_event("startup")
    async def on_startup():
        logger.info("🚀 Запуск приложения...")
        print("🚀 Запуск приложения...")
        
        
        # Initialize database
        await init_db()
        logger.info("✅ База данных инициализирована")
        print("✅ База данных инициализирована")
        
        # Start Telegram bot
        if settings.TELEGRAM_BOT_TOKEN:
            logger.info("🚀 Создание задачи для Telegram бота...")
            print("🚀 Создание задачи для Telegram бота...")
            asyncio.create_task(telegram_service.start_polling())
            logger.info("✅ Задача Telegram бота создана")
            print("✅ Задача Telegram бота создана")

    # Shutdown event
    @app.on_event("shutdown")
    async def on_shutdown():
        logger.info("🛑 Завершение приложения...")
        print("🛑 Завершение приложения...")
        await telegram_service.close()
        logger.info("✅ Telegram бот закрыт")
        print("✅ Telegram бот закрыт")

    return app


app = create_app()