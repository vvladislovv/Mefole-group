from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from common_libs.db_utils.session import get_db

from src.app.models.clients import Clients, Tasks
from src.app.models.services import Services
from src.app.schemas.client_schema import TaskCreate
from src.app.services.telegram_service import telegram_service

from uuid import uuid4
router = APIRouter()

@router.get("/get-tasks", summary="Получить все задания", tags=['Клиенты'])
async def get_tasks(db : AsyncSession = Depends(get_db)):
    result = await db.execute(select(Tasks))
    tasks = result.scalars().all()
    return {"Задания": tasks}
@router.get("/services", summary="Получить все сервисы", tags=['Клиенты'])
async def get_services(db: AsyncSession = Depends(get_db)):
    """Получить список всех доступных сервисов"""
    result = await db.execute(select(Services))
    services = result.scalars().all()
    return {"services": [{"id": str(service.id), "name": service.name} for service in services]}

@router.post("/create-task", summary="Создать задание", tags=['Клиенты'])
async def create_task(data: TaskCreate, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    # 1. Создание клиента
    client_search_result = await db.execute(
        select(Clients).where(
            or_(
                Clients.email == data.client_email,
                Clients.phone == data.client_phone
            )
        )
    )
    client = client_search_result.scalar_one_or_none()
    if not client:
        client = Clients(id=uuid4(), name=data.client_name, email=data.client_email, phone=data.client_phone)
        db.add(client)
        await db.commit()
        await db.refresh(client)

    # 2. Поиск услуги
    service_search_result = await db.execute(select(Services).where(Services.name == data.service_name))
    service = service_search_result.scalar_one_or_none()

    # 3. Если услуги нет — создаём
    if not service:
        service = Services(name=data.service_name)
        db.add(service)
        await db.commit()
        await db.refresh(service)

    # 4. Если есть тех. задание — создаём задание
    if data.technical_task:
        task = Tasks(technical_task=data.technical_task, client_id=client.id, service_id=service.id)
        db.add(task)
        await db.commit()
        await db.refresh(task)

    # 5. Отправляем уведомление в Telegram
    background_tasks.add_task(
        telegram_service.send_new_task_notification,
        client_name=data.client_name,
        client_email=data.client_email,
        client_phone=data.client_phone,
        service_name=data.service_name,
        technical_task=data.technical_task
    )

    return {"message": "success"}
