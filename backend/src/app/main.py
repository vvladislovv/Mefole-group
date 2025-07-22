from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from common_libs.db_utils.session import get_db, init_db
# подключаем роутеры
from src.app.routers.client_router import router as client_router

from .settings import settings
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
    async def on_startup():             # после alembic испрвить!
        await init_db()

    return app
app = create_app()