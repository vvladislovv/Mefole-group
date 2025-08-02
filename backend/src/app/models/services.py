from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from common_libs.models.base import Base
from uuid import uuid4

class Services(Base):
    __tablename__ = "services"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String, nullable=False)

    # Используем строковую ссылку для избежания циклического импорта
    tasks = relationship("Tasks", back_populates="service")