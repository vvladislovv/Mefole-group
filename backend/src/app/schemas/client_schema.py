from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional
from datetime import datetime

class TaskCreate(BaseModel):
    service_name: str
    client_name: str
    client_email: EmailStr
    client_phone: Optional[str]
    technical_task: Optional[str]