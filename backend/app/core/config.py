from pydantic_settings import BaseSettings
from pathlib import Path
from typing import List


class Settings(BaseSettings):
    # Environment
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str

    # URLs
    FRONTEND_URL: str = "http://localhost:3000"
    BACKEND_URL: str = "http://localhost:8000"

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost"

    # Telegram Bot
    TELEGRAM_BOT_TOKEN: str = ""
    TELEGRAM_ADMIN_ID: str = ""

    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "ХакТайка API"
    PROJECT_VERSION: str = "1.0.0"

    class Config:
        env_file = str(Path(__file__).parent.parent.parent.parent / ".env")  # root .env
        env_file_encoding = "utf-8"

    @property
    def is_prod(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"

    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]


settings = Settings()