from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from common_libs.db_utils.session import get_db
from src.app.models.admins import Admins
from typing import List
from pydantic import BaseModel

router = APIRouter()

class AdminResponse(BaseModel):
    id: str
    telegram_user_id: int
    username: str | None
    first_name: str | None
    last_name: str | None
    is_active: bool
    created_at: str

    class Config:
        from_attributes = True

class AdminCreate(BaseModel):
    telegram_user_id: int
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None

@router.get("/admins", summary="Получить всех администраторов", tags=['Администраторы'], response_model=List[AdminResponse])
async def get_admins(db: AsyncSession = Depends(get_db)):
    """Получить список всех администраторов"""
    result = await db.execute(select(Admins))
    admins = result.scalars().all()
    
    return [
        AdminResponse(
            id=str(admin.id),
            telegram_user_id=admin.telegram_user_id,
            username=admin.username,
            first_name=admin.first_name,
            last_name=admin.last_name,
            is_active=admin.is_active,
            created_at=admin.created_at.isoformat()
        )
        for admin in admins
    ]

@router.post("/admins", summary="Добавить администратора", tags=['Администраторы'])
async def create_admin(admin_data: AdminCreate, db: AsyncSession = Depends(get_db)):
    """Добавить нового администратора"""
    # Проверяем, не существует ли уже такой администратор
    result = await db.execute(
        select(Admins).where(Admins.telegram_user_id == admin_data.telegram_user_id)
    )
    existing_admin = result.scalar_one_or_none()
    
    if existing_admin:
        raise HTTPException(
            status_code=400, 
            detail="Администратор с таким Telegram ID уже существует"
        )
    
    # Создаем нового администратора
    new_admin = Admins(
        telegram_user_id=admin_data.telegram_user_id,
        username=admin_data.username,
        first_name=admin_data.first_name,
        last_name=admin_data.last_name
    )
    
    db.add(new_admin)
    await db.commit()
    await db.refresh(new_admin)
    
    return {"message": "Администратор успешно добавлен", "admin_id": str(new_admin.id)}

@router.patch("/admins/{admin_id}/toggle", summary="Активировать/деактивировать администратора", tags=['Администраторы'])
async def toggle_admin_status(admin_id: str, db: AsyncSession = Depends(get_db)):
    """Изменить статус активности администратора"""
    result = await db.execute(select(Admins).where(Admins.id == admin_id))
    admin = result.scalar_one_or_none()
    
    if not admin:
        raise HTTPException(status_code=404, detail="Администратор не найден")
    
    admin.is_active = not admin.is_active
    await db.commit()
    
    status = "активирован" if admin.is_active else "деактивирован"
    return {"message": f"Администратор {status}"}

@router.delete("/admins/{admin_id}", summary="Удалить администратора", tags=['Администраторы'])
async def delete_admin(admin_id: str, db: AsyncSession = Depends(get_db)):
    """Удалить администратора"""
    result = await db.execute(select(Admins).where(Admins.id == admin_id))
    admin = result.scalar_one_or_none()
    
    if not admin:
        raise HTTPException(status_code=404, detail="Администратор не найден")
    
    await db.delete(admin)
    await db.commit()
    
    return {"message": "Администратор удален"}