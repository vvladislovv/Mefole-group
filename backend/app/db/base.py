from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Import all models here to ensure they are registered with SQLAlchemy
from app.models.admin import Admin  # noqa
from app.models.client import Client, Task  # noqa
from app.models.service import Service  # noqa