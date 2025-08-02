#!/bin/bash

# Скрипт обновления приложения

set -e

echo "🔄 Обновление Mefole Group Website..."

# Проверяем что мы в правильной директории
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Файл docker-compose.prod.yml не найден."
    exit 1
fi

# Создаем бэкап перед обновлением
echo "💾 Создаем резервную копию..."
./scripts/backup-database.sh

# Получаем последние изменения
echo "📥 Получаем обновления из Git..."
git fetch origin
git pull origin main

# Пересобираем образы
echo "🔨 Пересобираем Docker образы..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Обновляем сервисы
echo "🚀 Обновляем сервисы..."
docker-compose -f docker-compose.prod.yml up -d --force-recreate

# Ждем запуска
echo "⏳ Ждем запуска сервисов..."
sleep 30

# Проверяем статус
echo "📊 Проверяем статус..."
docker-compose -f docker-compose.prod.yml ps

# Проверяем здоровье
for i in {1..5}; do
    if curl -f http://localhost/health > /dev/null 2>&1; then
        echo "✅ Обновление завершено успешно!"
        break
    fi
    echo "   Проверка $i/5..."
    sleep 10
done

echo ""
echo "🎉 Приложение обновлено!"
echo "🌐 Проверьте сайт: https://$(grep DOMAIN .env.prod | cut -d'=' -f2)"