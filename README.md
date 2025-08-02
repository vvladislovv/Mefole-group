# 🚀 Mefole Group Website

<div align="center">

![Mefole Group](https://img.shields.io/badge/Mefole-Group-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.116-009688?style=for-the-badge&logo=fastapi)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Современный веб-сайт для digital агентства с Telegram интеграцией**

[🌐 Live Demo](https://mefole.com) • [📚 Документация](PRODUCTION_DEPLOYMENT_GUIDE.md) • [🚀 Быстрый старт](QUICK_START.md)

</div>

---

## ✨ Особенности

- 🎨 **Современный дизайн** с адаптивной версткой
- 🌍 **Мультиязычность** (русский/английский)
- 📱 **Полная адаптивность** под все устройства
- 🤖 **Telegram бот** для автоматического приема заявок
- 📊 **9 проектов в портфолио** (веб, мобильные, боты)
- ⚡ **Высокая производительность** и SEO оптимизация
- 🐳 **Docker** контейнеризация для легкого развертывания
- 🔒 **Production-ready** с SSL и безопасностью

## 🛠 Технологический стек

### Frontend
- **React 18** - современный UI фреймворк
- **React Router** - клиентская маршрутизация
- **i18next** - интернационализация
- **CSS3** - адаптивный дизайн с анимациями

### Backend
- **FastAPI** - высокопроизводительный Python API
- **PostgreSQL** - надежная реляционная БД
- **SQLAlchemy** - современная ORM
- **Alembic** - миграции базы данных
- **Aiogram** - асинхронный Telegram бот

### DevOps
- **Docker & Docker Compose** - контейнеризация
- **Nginx** - reverse proxy с SSL
- **Let's Encrypt** - автоматические SSL сертификаты
- **Gunicorn** - WSGI сервер для продакшена

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Клонируем репозиторий
git clone https://github.com/yourusername/mefole-group-website.git
cd mefole-group-website

# Запускаем через Docker Compose
docker-compose up -d

# Открываем в браузере
open http://localhost
```

### Production развертывание

```bash
# Настраиваем домен
cp .env.prod.example .env.prod
nano .env.prod  # Указываем ваш домен

# Развертываем одной командой
./scripts/deploy.sh

# Настраиваем SSL
./scripts/setup-ssl.sh
```

**Подробная инструкция:** [QUICK_START.md](QUICK_START.md)

## 📁 Структура проекта

```
mefole-group-website/
├── 🎨 frontend/              # React приложение
│   ├── src/
│   │   ├── components/       # React компоненты
│   │   ├── data/            # Данные портфолио и сервисов
│   │   └── public/locales/  # Переводы
│   └── Dockerfile.prod      # Production образ
├── 🔧 backend/               # FastAPI сервер
│   ├── src/app/
│   │   ├── models/          # SQLAlchemy модели
│   │   ├── routers/         # API endpoints
│   │   └── services/        # Telegram бот сервис
│   └── Dockerfile.prod      # Production образ
├── 🌐 nginx/                 # Reverse proxy конфигурация
├── 📜 scripts/               # Скрипты автоматизации
└── 📚 docs/                  # Документация
```

## 🌐 API Endpoints

| Endpoint | Метод | Описание |
|----------|-------|----------|
| `/api/client/create-task` | POST | Создание заявки |
| `/api/client/services` | GET | Список сервисов |
| `/api/admin/admins` | GET | Управление админами |
| `/api/docs` | GET | Swagger документация |
| `/health` | GET | Health check |

## 🤖 Telegram Bot

Бот автоматически отправляет уведомления администраторам о новых заявках:

- **Бот:** [@MefoleOrdersBot](https://t.me/MefoleOrdersBot)
- **Команды:** `/start`, `/register`, `/help`
- **Функции:** Прием заявок, уведомления админов

## 📊 Портфолио проектов

### Веб-разработка (6 проектов)
- 🏢 Корпоративные сайты
- 🛒 E-commerce платформы
- 📱 Landing pages
- 🎨 Веб-приложения

### Мобильная разработка (1 проект)
- 📱 iOS/Android приложения

### Telegram боты (2 проекта)
- 🤖 Бизнес автоматизация
- 💬 Клиентские сервисы

## 🔧 Управление проектом

### Основные команды

```bash
# Мониторинг системы
./scripts/monitor.sh

# Просмотр логов
./scripts/logs.sh [service]

# Обновление приложения
./scripts/update-app.sh

# Резервное копирование
./scripts/backup-database.sh

# Проверка домена
./scripts/check-domain.sh
```

### Docker команды

```bash
# Статус сервисов
docker-compose -f docker-compose.prod.yml ps

# Перезапуск сервиса
docker-compose -f docker-compose.prod.yml restart [service]

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f [service]
```

## 📚 Документация

| Документ | Описание |
|----------|----------|
| [🚀 QUICK_START.md](QUICK_START.md) | Быстрое развертывание за 5 минут |
| [📖 PRODUCTION_DEPLOYMENT_GUIDE.md](PRODUCTION_DEPLOYMENT_GUIDE.md) | Полная инструкция для продакшена |
| [🌐 DOMAIN_CONFIGURATION_GUIDE.md](DOMAIN_CONFIGURATION_GUIDE.md) | Настройка домена и SSL |
| [🤖 TELEGRAM_BOT_SETUP_COMPLETE.md](TELEGRAM_BOT_SETUP_COMPLETE.md) | Настройка Telegram бота |
| [🔧 SERVICES_SYNC_FIXED.md](SERVICES_SYNC_FIXED.md) | Синхронизация сервисов |

## 🔒 Безопасность

- ✅ SSL/TLS шифрование (Let's Encrypt)
- ✅ Security headers (HSTS, XSS Protection)
- ✅ Rate limiting для API
- ✅ CORS настройки
- ✅ Environment variables для секретов
- ✅ Non-root Docker контейнеры

## 📈 Производительность

- ⚡ Gzip сжатие
- 🗄️ Кэширование статических файлов
- 🔄 HTTP/2 поддержка
- 📊 Connection pooling
- 🎯 Optimized Docker images

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📞 Поддержка

- 💬 **Telegram:** [@MefoleGroup](https://t.me/MefoleGroup)
- 📧 **Email:** info@mefole.com
- 🌐 **Website:** [mefole.com](https://mefole.com)
- 📋 **Issues:** [GitHub Issues](https://github.com/yourusername/mefole-group-website/issues)

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

---

<div align="center">

**Сделано с ❤️ командой [Mefole Group](https://mefole.com)**

⭐ Поставьте звезду если проект был полезен!

</div>