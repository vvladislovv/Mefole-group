from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from common_libs.db_utils.session import get_db, init_db
# подключаем роутеры
from src.app.routers.client_router import router as client_router
from src.app.routers.admin_router import router as admin_router
from src.app.services.telegram_service import telegram_service

from .settings import settings
import asyncio
import logging

logger = logging.getLogger(__name__)
def create_app() -> FastAPI:
    app = FastAPI(
        title="Vizitka",
        version="1.0.0",
        description="Сервис обработки клиентов для сайта визитки Mefole Group",
        docs_url="/docs",
        
        redoc_url="/redoc",
    )
    # CORS — в продакшн ОБЯЗАТЕЛЬНО указать домены!
    allowed_origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )
    app.include_router(client_router, prefix="/client")
    app.include_router(admin_router, prefix="/admin")
    
    # Запускаем бота сразу при создании приложения
    if settings.TELEGRAM_BOT_TOKEN:
        logger.info("🚀 Инициализация Telegram бота...")
        print("🚀 Инициализация Telegram бота...")
        # Создаем задачу для запуска бота
        import threading
        def run_bot():
            import asyncio
            asyncio.run(telegram_service.start_polling())
        
        bot_thread = threading.Thread(target=run_bot, daemon=True)
        bot_thread.start()
        logger.info("✅ Telegram бот запущен в отдельном потоке")
        print("✅ Telegram бот запущен в отдельном потоке")
    # healthcheck endpoint
    @app.get("/healthz", tags=["system"])
    async def healthz(db: AsyncSession = Depends(get_db)):
        # Проверяем Postgres
        try:
            await db.execute(text("SELECT 1"))
        except Exception as e:
            return {"status": "fail", "db": False}
        return {"status": "ok", "db": True}

    # Хук на запуск приложения — инициализация базы
    @app.on_event("startup")
    async def on_startup():
        logger.info("🚀 Запуск приложения...")
        print("🚀 Запуск приложения...")
        await init_db()
        logger.info("✅ База данных инициализирована")
        print("✅ База данных инициализирована")
        
        # Запускаем Telegram бота
        if settings.TELEGRAM_BOT_TOKEN:
            logger.info("🚀 Создание задачи для Telegram бота...")
            print("🚀 Создание задачи для Telegram бота...")
            asyncio.create_task(telegram_service.start_polling())
            logger.info("✅ Задача Telegram бота создана")
            print("✅ Задача Telegram бота создана")
    
    # Хук на завершение приложения
    @app.on_event("shutdown")
    async def on_shutdown():
        logger.info("🛑 Завершение приложения...")
        print("🛑 Завершение приложения...")
        await telegram_service.close()
        logger.info("✅ Telegram бот закрыт")
        print("✅ Telegram бот закрыт")

    return app
app = create_app()