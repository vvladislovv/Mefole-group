# ХакТайка Website

Корпоративный сайт digital агентства ХакТайка с React frontend и FastAPI backend.

## 🚀 Быстрый старт

### Требования

- Docker и Docker Compose
- Node.js 16+ (для локальной разработки frontend)
- Python 3.11+ (для локальной разработки backend)

### Запуск через Docker

```bash
# Клонировать репозиторий
git clone <repository-url>
cd hacktaika-website

# Скопировать переменные окружения
cp .env.example .env

# Запустить все сервисы
docker-compose up --build
```

Сайт будет доступен по адресу:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API документация: http://localhost:8000/docs

### Проверка работы

```bash
# Проверить статус всех сервисов
docker-compose ps

# Проверить логи
docker-compose logs -f
```

### Локальная разработка

#### Backend (FastAPI)

```bash
# Перейти в папку backend
cd backend

# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate     # Windows

# Установить зависимости
pip install -r ../requirements.txt

# Запустить сервер разработки
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend (React)

```bash
# Перейти в папку frontend
cd frontend

# Установить зависимости
npm install

# Запустить сервер разработки
npm start
```

## 📁 Структура проекта

```
hacktaika-website/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Конфигурация
│   │   ├── db/             # База данных
│   │   ├── models/         # SQLAlchemy модели
│   │   ├── schemas/        # Pydantic схемы
│   │   ├── services/       # Бизнес-логика
│   │   └── main.py         # Точка входа
│   └── migrations/         # Alembic миграции
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── data/          # Статические данные
│   │   └── api/           # API клиент
│   └── package.json
├── docker-compose.yml      # Docker Compose для разработки
├── Dockerfile             # Dockerfile для разработки
├── requirements.txt       # Python зависимости
└── .env                   # Переменные окружения
```

## 🛠 Разработка

### Переменные окружения

Основные переменные в `.env`:

```env
# Database
DATABASE_URL=postgresql+asyncpg://postgres:mefole_dev_password@localhost:5432/mefole_dev

# Backend
SECRET_KEY=dev_secret_key_change_in_production
ALLOWED_ORIGINS=http://localhost:3000

# Frontend
REACT_APP_API_URL=http://localhost:8000

# Telegram Bot (optional)
TELEGRAM_BOT_TOKEN=
```

### API Endpoints

- `GET /api/v1/clients` - Получить список клиентов
- `POST /api/v1/clients` - Создать заявку клиента
- `GET /api/v1/admins` - Админ панель
- `GET /healthz` - Health check

### База данных

Проект использует PostgreSQL с SQLAlchemy и Alembic для миграций.

```bash
# Создать миграцию
cd backend
alembic revision --autogenerate -m "Description"

# Применить миграции
alembic upgrade head
```

## 🧪 Тестирование

```bash
# Backend тесты
cd backend
pytest

# Frontend тесты
cd frontend
npm test
```

## 📦 Сборка

```bash
# Сборка frontend для продакшена
cd frontend
npm run build

# Сборка Docker образов
docker-compose build
```

## 🔧 Полезные команды

### NPM команды

```bash
# Запустить все сервисы
npm run dev

# Запустить только базу данных
npm run dev:db

# Запустить только backend
npm run dev:backend

# Запустить только frontend
npm run dev:frontend

# Остановить все сервисы
npm run stop

# Очистить все данные
npm run clean
```

### Docker команды

```bash
# Просмотр логов всех сервисов
npm run logs

# Просмотр логов backend
npm run logs:backend

# Просмотр логов frontend
npm run logs:frontend

# Перезапуск сервисов
npm run restart

# Сборка Docker образов
npm run build:docker
```

### Локальная разработка (без Docker)

```bash
# Frontend
npm run dev:local:frontend

# Backend
npm run dev:local:backend
```

## 📞 Поддержка

- **Email**: info@hacktaika.com
- **Сайт**: https://hacktaika.com

## 🚀 Технологии

- **Frontend**: React 19, GSAP, Swiper, i18next
- **Backend**: FastAPI, SQLAlchemy, Alembic, PostgreSQL
- **DevOps**: Docker, Docker Compose
- **Дополнительно**: Telegram Bot API