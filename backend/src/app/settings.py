from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"

    #DataBase
    DATABASE_URL: str

    # URLs
    FRONTEND_URL: str = "http://localhost:3000"
    BACKEND_URL: str = "http://localhost:8000"

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost"

    # Telegram Bot
    TELEGRAM_BOT_TOKEN: str = ""

    class Config:
        env_file = str(Path(__file__).parent.parent / ".env")
        env_file_encoding = "utf-8"
    @property
    def is_prod(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"
    
settings = Settings()
