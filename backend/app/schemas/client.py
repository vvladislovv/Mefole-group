from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional
from datetime import datetime


class ClientBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None


class ClientCreate(ClientBase):
    pass


class ClientUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    active: Optional[bool] = None


class ClientInDB(ClientBase):
    id: UUID
    active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TaskBase(BaseModel):
    technical_task: Optional[str] = None


class TaskCreate(TaskBase):
    service_name: str
    client_name: str
    client_email: EmailStr
    client_phone: Optional[str] = None
    client_telegram: Optional[str] = None


class TaskInDB(TaskBase):
    id: UUID
    client_id: UUID
    service_id: UUID

    class Config:
        from_attributes = True