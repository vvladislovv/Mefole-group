from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from common_libs.db_utils.session import get_db

from src.app.models.clients import Clients, Tasks
from src.app.models.services import Services
from src.app.schemas.client_schema import TaskCreate

from uuid import uuid4
router = APIRouter()

@router.get("/get-tasks", summary="Получить все задания", tags=['Клиенты'])
async def get_tasks(db : AsyncSession = Depends(get_db)):
    result = await db.execute(select(Tasks))
    tasks = result.scalars().all()
    return {"Задания": tasks}
@router.post("/create-task", summary="Создать задание", tags=['Клиенты'])
async def create_task(data: TaskCreate, db: AsyncSession = Depends(get_db)):
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

    return {"message": "success"}
