from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.db.base import Base
from app.core.config import settings

if not settings.DATABASE_URL:
    raise RuntimeError("DATABASE_URL not set")

engine = create_async_engine(settings.DATABASE_URL, echo=True, future=True)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def init_db():
    """Initialize the database, creating all tables defined"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db():
    """Dependency to get a database session"""
    async with async_session() as session:
        yield session