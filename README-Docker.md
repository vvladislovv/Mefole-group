# Docker Setup

## Структура

- `docker-compose.yml` - основной файл с всеми сервисами
- `Dockerfile.backend` - контейнер для Python API
- `Dockerfile.frontend` - контейнер для React приложения
- `nginx/` - конфигурация nginx

## Запуск

```bash
# Запустить все сервисы
docker-compose up -d

# Остановить все сервисы
docker-compose down

# Пересобрать и запустить
docker-compose up --build -d
```

## Сервисы

- **postgres** - база данных (порт 5432)
- **backend** - Python API (порт 8000)
- **frontend** - React приложение (порт 3000)
- **nginx** - reverse proxy (порт 8080)

## Переменные окружения

Создайте файл `.env`:
```
TELEGRAM_BOT_TOKEN=your_token_here
POSTGRES_PASSWORD=your_password_here
```
