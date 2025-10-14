import asyncio
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import Message
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.admin import Admin
from app.core.config import settings
from app.db.session import async_session

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
        
        @self.dp.message(Command("help"))
        async def help_handler(message: Message):
            await self.handle_help(message)
    
    async def handle_start(self, message: Message):
        """Обработчик команды /start"""
        # Проверяем, является ли пользователь зарегистрированным администратором
        try:
            async with async_session() as db:
                result = await db.execute(
                    select(Admin).where(Admin.telegram_user_id == message.from_user.id)
                )
                existing_admin = result.scalar_one_or_none()
                
                if existing_admin:
                    welcome_text = (
                        "🤖 Добро пожаловать в бота уведомлений ХакТайка!\n\n"
                        "✅ Вы зарегистрированы как администратор\n\n"
                        "Доступные команды:\n"
                        "/help - Показать справку\n\n"
                        "Этот бот будет присылать вам уведомления о новых заявках с сайта."
                    )
                else:
                    welcome_text = (
                        "🤖 Добро пожаловать в бота уведомлений ХакТайка!\n\n"
                        "❌ У вас нет доступа к этому боту.\n"
                        "Обратитесь к администратору для получения доступа."
                    )
                
                await message.answer(welcome_text)
                
        except Exception as e:
            logger.error(f"Ошибка при обработке команды /start: {e}")
            await message.answer("❌ Произошла ошибка. Попробуйте позже.")
    

    
    async def handle_help(self, message: Message):
        """Обработчик команды /help"""
        # Проверяем, является ли пользователь зарегистрированным администратором
        try:
            async with async_session() as db:
                result = await db.execute(
                    select(Admin).where(Admin.telegram_user_id == message.from_user.id)
                )
                existing_admin = result.scalar_one_or_none()
                
                if existing_admin:
                    help_text = (
                        "📋 Справка по боту ХакТайка\n\n"
                        "🔹 /start - Приветственное сообщение\n"
                        "🔹 /help - Показать эту справку\n\n"
                        "ℹ️ Бот автоматически присылает уведомления о новых заявках "
                        "всем зарегистрированным администраторам."
                    )
                else:
                    help_text = (
                        "❌ У вас нет доступа к этому боту.\n"
                        "Обратитесь к администратору для получения доступа."
                    )
                
                await message.answer(help_text)
                
        except Exception as e:
            logger.error(f"Ошибка при обработке команды /help: {e}")
            await message.answer("❌ Произошла ошибка. Попробуйте позже.")
    
    async def get_all_admins(self) -> List[Admin]:
        """Получить всех активных администраторов"""
        try:
            async with async_session() as db:
                result = await db.execute(
                    select(Admin).where(Admin.is_active == True)
                )
                return result.scalars().all()
        except Exception as e:
            logger.error(f"Ошибка при получении списка администраторов: {e}")
            return []
    
    async def send_new_task_notification(self, client_name: str, client_email: str, 
                                       client_phone: Optional[str], client_telegram: Optional[str], 
                                       service_name: str, technical_task: Optional[str]):
        """Отправка уведомления о новой заявке администратору"""
        logger.info(f"🔔 Начало отправки уведомления для клиента {client_name}")
        
        if not self.bot:
            logger.warning("Telegram бот не настроен (отсутствует токен)")
            return
        
        try:
            # Используем фиксированный ID администратора
            admin_id = 7300593025
            
            # Формируем красивое сообщение
            message_text = self._format_task_message(
                client_name, client_email, client_phone, client_telegram, service_name, technical_task
            )
            
            # Отправляем уведомление администратору
            await self.bot.send_message(
                chat_id=admin_id,
                text=message_text,
                parse_mode="HTML"
            )
            
            logger.info(f"✅ Уведомление о новой заявке отправлено администратору {admin_id}")
            
        except Exception as e:
            logger.error(f"❌ Ошибка при отправке уведомления: {e}")
    
    def _format_task_message(self, client_name: str, client_email: str, 
                           client_phone: Optional[str], client_telegram: Optional[str], 
                           service_name: str, technical_task: Optional[str]) -> str:
        """Форматирование сообщения о новой заявке"""
        message = "🆕 <b>Новая заявка с сайта!</b>\n\n"
        message += f"👤 <b>Клиент:</b> {client_name}\n"
        message += f"📧 <b>Email:</b> {client_email}\n"
        
        if client_phone:
            message += f"📱 <b>Телефон:</b> {client_phone}\n"
        
        if client_telegram:
            message += f"💬 <b>Telegram:</b> @{client_telegram}\n"
        
        message += f"🛠 <b>Услуга:</b> {service_name}\n"
        
        if technical_task:
            message += f"\n📝 <b>Техническое задание:</b>\n{technical_task}"
        
        # Получаем время в UTC+3 (московское время)
        utc_plus_3 = timezone(timedelta(hours=3))
        moscow_time = datetime.now(utc_plus_3)
        message += f"\n\n⏰ <b>Время:</b> {moscow_time.strftime('%d.%m.%Y %H:%M')} (UTC+3)"
        
        return message
    
    async def start_polling(self):
        """Запуск бота в режиме polling с обработкой конфликтов"""
        if not self.bot:
            logger.warning("Не удается запустить бота - отсутствует токен")
            return
        
        max_retries = 3
        retry_count = 0
        
        while retry_count < max_retries:
            try:
                logger.info("🤖 Запуск Telegram бота...")
                print("🤖 Запуск Telegram бота...")
                
                # Принудительно останавливаем все существующие подключения
                await self.bot.delete_webhook(drop_pending_updates=True)
                
                # Ждем немного чтобы Telegram освободил подключение
                await asyncio.sleep(2)
                
                # Запускаем polling с обработкой конфликтов
                await self.dp.start_polling(
                    self.bot,
                    skip_updates=True,  # Пропускаем старые обновления
                    handle_signals=False,  # Не обрабатываем системные сигналы
                    close_bot_session=False  # Не закрываем сессию автоматически
                )
                
                # Если дошли сюда - все ок
                logger.info("✅ Telegram бот запущен успешно")
                print("✅ Telegram бот запущен успешно")
                break
                
            except Exception as e:
                retry_count += 1
                error_msg = str(e)
                
                if "Conflict" in error_msg:
                    logger.warning(f"⚠️ Конфликт Telegram бота (попытка {retry_count}/{max_retries})")
                    print(f"⚠️ Конфликт Telegram бота (попытка {retry_count}/{max_retries})")
                    
                    if retry_count < max_retries:
                        wait_time = retry_count * 5  # Увеличиваем время ожидания
                        logger.info(f"⏳ Ожидание {wait_time} секунд перед повторной попыткой...")
                        print(f"⏳ Ожидание {wait_time} секунд перед повторной попыткой...")
                        await asyncio.sleep(wait_time)
                    else:
                        logger.error("❌ Не удалось запустить бота после всех попыток")
                        print("❌ Не удалось запустить бота после всех попыток")
                        print("💡 Возможно, бот уже запущен в другом месте")
                        # Не прерываем работу приложения из-за бота
                        return
                else:
                    logger.error(f"❌ Ошибка при запуске бота: {e}")
                    print(f"❌ Ошибка при запуске бота: {e}")
                    return
    
    async def close(self):
        """Закрытие соединения с ботом"""
        if self.bot:
            await self.bot.session.close()


# Глобальный экземпляр сервиса
telegram_service = TelegramService()

# Функция для отправки сообщения (для использования в API)
async def send_telegram_message(message_text: str):
    """Отправка сообщения администратору"""
    logger.info(f"🔔 Попытка отправки сообщения в Telegram...")
    logger.info(f"🔔 TELEGRAM_BOT_TOKEN: {'установлен' if settings.TELEGRAM_BOT_TOKEN else 'не установлен'}")
    
    if not telegram_service.bot:
        logger.warning("Telegram бот не настроен (отсутствует токен)")
        return
    
    # Используем фиксированный ID администратора
    admin_id = 7300593025
    logger.info(f"🔔 Отправка сообщения администратору {admin_id}")
    
    try:
        await telegram_service.bot.send_message(
            chat_id=admin_id,
            text=message_text,
            parse_mode="HTML"
        )
        logger.info(f"✅ Сообщение успешно отправлено администратору {admin_id}")
        return
    except Exception as e:
        logger.error(f"❌ Ошибка отправки сообщения администратору {admin_id}: {e}")
        return