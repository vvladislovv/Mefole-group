#!/bin/bash

# Скрипт для просмотра логов

SERVICE=${1:-"all"}
LINES=${2:-50}

echo "📝 Просмотр логов сервиса: $SERVICE (последние $LINES строк)"
echo "=================================================="

case $SERVICE in
    "all")
        docker-compose -f docker-compose.prod.yml logs --tail=$LINES -f
        ;;
    "backend"|"frontend"|"db"|"nginx")
        docker-compose -f docker-compose.prod.yml logs --tail=$LINES -f $SERVICE
        ;;
    "access")
        echo "📊 Логи доступа Nginx:"
        tail -f -n $LINES logs/nginx/access.log
        ;;
    "error")
        echo "❌ Логи ошибок Nginx:"
        tail -f -n $LINES logs/nginx/error.log
        ;;
    *)
        echo "❌ Неизвестный сервис: $SERVICE"
        echo ""
        echo "Доступные сервисы:"
        echo "  all      - все сервисы"
        echo "  backend  - backend API"
        echo "  frontend - frontend React"
        echo "  db       - база данных"
        echo "  nginx    - веб-сервер"
        echo "  access   - логи доступа nginx"
        echo "  error    - логи ошибок nginx"
        echo ""
        echo "Использование: $0 [service] [lines]"
        echo "Пример: $0 backend 100"
        exit 1
        ;;
esac