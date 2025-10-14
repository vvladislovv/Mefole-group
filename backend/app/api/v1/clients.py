from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.db.session import get_db
from app.models.client import Client, Task
from app.models.service import Service
from app.schemas.client import TaskCreate
from app.services.telegram_service import telegram_service
from uuid import uuid4
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/tasks", summary="Получить все задания", tags=['Клиенты'])
async def get_tasks(db: AsyncSession = Depends(get_db)):
    """Получить список всех заданий"""
    result = await db.execute(select(Task))
    tasks = result.scalars().all()
    return {"tasks": tasks}


@router.get("/services", summary="Получить все сервисы", tags=['Клиенты'])
async def get_services(db: AsyncSession = Depends(get_db)):
    """Получить список всех доступных сервисов"""
    result = await db.execute(select(Service))
    services = result.scalars().all()
    return {"services": [{"id": str(service.id), "name": service.name} for service in services]}


@router.post("/tasks", summary="Создать задание", tags=['Клиенты'])
async def create_task(data: TaskCreate, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    """Создать новое задание от клиента"""
    logger.info(f"🚀 Получена заявка от клиента: {data.client_name}")
    # 1. Поиск или создание клиента
    client_search_result = await db.execute(
        select(Client).where(
            or_(
                Client.email == data.client_email,
                Client.phone == data.client_phone
            )
        )
    )
    client = client_search_result.scalar_one_or_none()
    
    if not client:
        client = Client(
            id=uuid4(), 
            name=data.client_name, 
            email=data.client_email, 
            phone=data.client_phone,
            telegram=data.client_telegram
        )
        db.add(client)
        await db.commit()
        await db.refresh(client)

    # 2. Поиск или создание услуги
    service_search_result = await db.execute(select(Service).where(Service.name == data.service_name))
    service = service_search_result.scalar_one_or_none()

    if not service:
        service = Service(name=data.service_name)
        db.add(service)
        await db.commit()
        await db.refresh(service)

    # 3. Создание задания (если есть техническое задание)
    if data.technical_task:
        task = Task(
            technical_task=data.technical_task, 
            client_id=client.id, 
            service_id=service.id
        )
        db.add(task)
        await db.commit()
        await db.refresh(task)

    # 4. Отправка уведомления в Telegram
    logger.info(f"🔔 Начинаем отправку уведомления для клиента {data.client_name}")
    try:
        await telegram_service.send_new_task_notification(
            client_name=data.client_name,
            client_email=data.client_email,
            client_phone=data.client_phone,
            client_telegram=data.client_telegram,
            service_name=data.service_name,
            technical_task=data.technical_task
        )
        logger.info(f"✅ Уведомление отправлено для клиента {data.client_name}")
    except Exception as e:
        logger.error(f"❌ Ошибка при отправке уведомления в Telegram: {e}")

    return {"message": "Task created successfully"}