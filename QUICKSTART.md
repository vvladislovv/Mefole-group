# 🚀 Быстрый старт

## Минимальные требования
- Docker и Docker Compose

## Запуск за 3 шага

1. **Клонировать и настроить**
   ```bash
   git clone <repository-url>
   cd hacktaika-website
   cp .env.example .env
   ```

2. **Запустить**
   ```bash
   docker-compose up -d
   ```

3. **Проверить**
   ```bash
   docker-compose ps
   ```

## Готово! 🎉

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000  
- **API Docs**: http://localhost:8000/docs

## Полезные команды

```bash
docker-compose up -d        # Запустить все сервисы
docker-compose ps          # Проверить статус
docker-compose logs -f     # Показать логи
docker-compose down        # Остановить все
docker-compose restart     # Перезапустить
docker-compose down -v     # Очистить данные
```