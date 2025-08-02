import asyncio
import logging
from datetime import datetime
from typing import List, Optional
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import Message
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.app.models.admins import Admins
from src.app.settings import settings
from common_libs.db_utils.session import async_session

logger = logging.getLogger(__name__)

class TelegramService:
    def __init__(self):
        self.bot = Bot(token=settings.TELEGRAM_BOT_TOKEN) if settings.TELEGRAM_BOT_TOKEN else None
        self.dp = Dispatcher()
        self._setup_handlers()
    
    def _setup_handlers(self):
        """Настройка обработчиков команд бота"""
        @self.dp.message(Command("start"))
        async def start_handler(message: Message):
            await self.handle_start(message)
        
        @self.dp.message(Command("register"))
        async def register_handler(message: Message):
            await self.handle_register_admin(message)
        
        @self.dp.message(Command("help"))
        async def help_handler(message: Message):
            await self.handle_help(message)
    
    async def handle_start(self, message: Message):
        """Обработчик команды /start"""
        welcome_text = (
            "🤖 Добро пожаловать в бота уведомлений Mefole Group!\n\n"
            "Доступные команды:\n"
            "/register - Зарегистрироваться как администратор\n"
            "/help - Показать справку\n\n"
            "Этот бот будет присылать уведомления о новых заявках с сайта."
        )
        await message.answer(welcome_text)
    
    async def handle_register_admin(self, message: Message):
        """Регистрация нового администратора"""
        try:
            async with async_session() as db:
                # Проверяем, не зарегистрирован ли уже этот пользователь
                result = await db.execute(
                    select(Admins).where(Admins.telegram_user_id == message.from_user.id)
                )
                existing_admin = result.scalar_one_or_none()
                
                if existing_admin:
                    await message.answer("✅ Вы уже зарегистрированы как администратор!")
                    return
                
                # Создаем нового администратора
                new_admin = Admins(
                    telegram_user_id=message.from_user.id,
                    username=message.from_user.username,
                    first_name=message.from_user.first_name,
                    last_name=message.from_user.last_name
                )
                
                db.add(new_admin)
                await db.commit()
                
                await message.answer(
                    "🎉 Вы успешно зарегистрированы как администратор!\n"
                    "Теперь вы будете получать уведомления о новых заявках."
                )
                
        except Exception as e:
            logger.error(f"Ошибка при регистрации администратора: {e}")
            await message.answer("❌ Произошла ошибка при регистрации. Попробуйте позже.")
    
    async def handle_help(self, message: Message):
        """Обработчик команды /help"""
        help_text = (
            "📋 Справка по боту Mefole Group\n\n"
            "🔹 /start - Приветственное сообщение\n"
            "🔹 /register - Зарегистрироваться как администратор\n"
            "🔹 /help - Показать эту справку\n\n"
            "ℹ️ Бот автоматически присылает уведомления о новых заявках "
            "всем зарегистрированным администраторам."
        )
        await message.answer(help_text)
    
    async def get_all_admins(self) -> List[Admins]:
        """Получить всех активных администраторов"""
        try:
            async with async_session() as db:
                result = await db.execute(
                    select(Admins).where(Admins.is_active == True)
                )
                return result.scalars().all()
        except Exception as e:
            logger.error(f"Ошибка при получении списка администраторов: {e}")
            return []
    
    async def send_new_task_notification(self, client_name: str, client_email: str, 
                                       client_phone: Optional[str], service_name: str, 
                                       technical_task: Optional[str]):
        """Отправка уведомления о новой заявке всем администраторам"""
        if not self.bot:
            logger.warning("Telegram бот не настроен (отсутствует токен)")
            return
        
        try:
            admins = await self.get_all_admins()
            if not admins:
                logger.warning("Нет зарегистрированных администраторов для отправки уведомлений")
                return
            
            # Формируем красивое сообщение
            message_text = self._format_task_message(
                client_name, client_email, client_phone, service_name, technical_task
            )
            
            # Отправляем уведомление всем администраторам
            for admin in admins:
                try:
                    await self.bot.send_message(
                        chat_id=admin.telegram_user_id,
                        text=message_text,
                        parse_mode="HTML"
                    )
                except Exception as e:
                    logger.error(f"Ошибка отправки сообщения админу {admin.telegram_user_id}: {e}")
            
            logger.info(f"Уведомление о новой заявке отправлено {len(admins)} администраторам")
            
        except Exception as e:
            logger.error(f"Ошибка при отправке уведомлений: {e}")
    
    def _format_task_message(self, client_name: str, client_email: str, 
                           client_phone: Optional[str], service_name: str, 
                           technical_task: Optional[str]) -> str:
        """Форматирование сообщения о новой заявке"""
        message = "🆕 <b>Новая заявка с сайта!</b>\n\n"
        message += f"👤 <b>Клиент:</b> {client_name}\n"
        message += f"📧 <b>Email:</b> {client_email}\n"
        
        if client_phone:
            message += f"📱 <b>Телефон:</b> {client_phone}\n"
        
        message += f"🛠 <b>Услуга:</b> {service_name}\n"
        
        if technical_task:
            message += f"\n📝 <b>Техническое задание:</b>\n{technical_task}"
        
        message += f"\n\n⏰ <b>Время:</b> {datetime.now().strftime('%d.%m.%Y %H:%M')}"
        
        return message
    
    async def start_polling(self):
        """Запуск бота в режиме polling"""
        if not self.bot:
            logger.warning("Не удается запустить бота - отсутствует токен")
            return
        
        try:
            logger.info("🤖 Запуск Telegram бота...")
            print("🤖 Запуск Telegram бота...")  # Дополнительный вывод
            await self.dp.start_polling(self.bot)
        except Exception as e:
            logger.error(f"❌ Ошибка при запуске бота: {e}")
            print(f"❌ Ошибка при запуске бота: {e}")  # Дополнительный вывод
    
    async def close(self):
        """Закрытие соединения с ботом"""
        if self.bot:
            await self.bot.session.close()

# Глобальный экземпляр сервиса
telegram_service = TelegramService()