from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import json
import logging
from datetime import datetime

from app.db.session import get_db
from app.services.telegram_service import send_telegram_message

logger = logging.getLogger(__name__)

router = APIRouter()

class BlogFormData(BaseModel):
    # Блок 1: О проекте
    project_type: str
    project_description: str
    business_goals: str
    
    # Блок 2: Технические требования
    platform: str
    integrations: str
    
    # Блок 3: Бюджет и сроки
    budget: str
    timeline: str
    
    # Блок 4: Контакты
    name: str
    email: EmailStr
    phone: str

@router.post("/blog-form")
async def submit_blog_form(request_data: dict, db: AsyncSession = Depends(get_db)):
    try:
        logger.info(f"Получены данные: {request_data}")
        
        # Преобразуем данные в модель
        form_data = BlogFormData(**request_data)
        logger.info(f"Получена заявка от {form_data.name} ({form_data.email})")
        
        # Сохраняем в базу данных
        query = text("""
            INSERT INTO blog_submissions (
                project_type, project_description, business_goals,
                platform, integrations,
                budget, timeline,
                name, email, phone, created_at
            ) VALUES (
                :project_type, :project_description, :business_goals,
                :platform, :integrations,
                :budget, :timeline,
                :name, :email, :phone, :created_at
            )
        """)
        
        await db.execute(query, {
            "project_type": form_data.project_type,
            "project_description": form_data.project_description,
            "business_goals": form_data.business_goals,
            "platform": form_data.platform,
            "integrations": form_data.integrations,
            "budget": form_data.budget,
            "timeline": form_data.timeline,
            "name": form_data.name,
            "email": form_data.email,
            "phone": form_data.phone,
            "created_at": datetime.now()
        })
        
        await db.commit()
        logger.info(f"Заявка от {form_data.name} сохранена в базу данных")
        
        # Формируем сообщение для Telegram
        message = f"""
🎯 <b>Новая заявка из блога!</b>

👤 <b>Контактная информация:</b>
• Имя: {form_data.name}
• Email: {form_data.email}
• Телефон: {form_data.phone}

📋 <b>О проекте:</b>
• Тип проекта: {form_data.project_type}
• Описание: {form_data.project_description}
• Бизнес-цели: {form_data.business_goals}

⚙️ <b>Технические требования:</b>
• Платформа: {form_data.platform}
• Интеграции: {form_data.integrations}

💰 <b>Бюджет и сроки:</b>
• Бюджет: {form_data.budget}
• Сроки: {form_data.timeline}

⏰ Время подачи: {datetime.now().strftime('%d.%m.%Y %H:%M')}
        """
        
        # Отправляем в Telegram
        logger.info(f"📤 Отправка уведомления в Telegram для заявки от {form_data.name}")
        try:
            await send_telegram_message(message)
            logger.info(f"✅ Уведомление в Telegram отправлено для заявки от {form_data.name}")
        except Exception as e:
            logger.error(f"❌ Ошибка при отправке уведомления в Telegram: {e}")
        
        return {"success": True, "message": "Заявка успешно отправлена!"}
        
    except Exception as e:
        await db.rollback()
        logger.error(f"Ошибка при обработке заявки: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при отправке заявки: {str(e)}")
