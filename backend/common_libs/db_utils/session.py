from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from common_libs.models.base import Base
from src.app.settings import settings

if not settings.DATABASE_URL:
    raise RuntimeError("DATABASE_URL not set")

engine = create_async_engine(settings.DATABASE_URL, echo=True, future=True)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Function to initialize the database, creating all tables defined
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# This function is used as a dependency in FastAPI routes to get a database session
async def get_db():
    async with async_session() as session:
        yield session
