#!/bin/bash

# Скрипт развертывания Mefole Group Website на production сервере

set -e

echo "🚀 Начинаем развертывание Mefole Group Website..."

# Проверяем что мы в правильной директории
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Файл docker-compose.prod.yml не найден. Убедитесь что вы в корневой директории проекта."
    exit 1
fi

# Проверяем что .env.prod настроен
if [ ! -f ".env.prod" ]; then
    echo "❌ Файл .env.prod не найден. Скопируйте .env.prod.example и настройте его."
    exit 1
fi

# Загружаем переменные окружения
source .env.prod

# Проверяем что домен настроен
if [ "$DOMAIN" = "yourdomain.com" ]; then
    echo "❌ Пожалуйста, настройте домен в .env.prod файле"
    exit 1
fi

echo "📋 Конфигурация:"
echo "   Домен: $DOMAIN"
echo "   База данных: $DB_NAME"
echo "   Пользователь БД: $DB_USER"

# Создаем необходимые директории
echo "📁 Создаем директории..."
mkdir -p logs/nginx
mkdir -p backups
mkdir -p nginx/ssl

# Останавливаем старые контейнеры если они есть
echo "🛑 Останавливаем старые контейнеры..."
docker-compose -f docker-compose.prod.yml down --remove-orphans || true

# Обновляем настройки домена в конфигурациях
echo "⚙️ Обновляем конфигурации..."

# Заменяем домен в nginx (без https://)
sed -i "s/yourdomain.com/$DOMAIN/g" nginx/conf.d/default.conf

# Заменяем домен в backend (с https://)
sed -i "s/yourdomain.com/$DOMAIN/g" backend/src/.env.prod

# Заменяем домен в frontend (с https://)
sed -i "s/yourdomain.com/$DOMAIN/g" frontend/src/settings.prod.js

echo "✅ Домен $DOMAIN настроен во всех конфигурациях"

# Собираем образы
echo "🔨 Собираем Docker образы..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Запускаем сервисы
echo "🚀 Запускаем сервисы..."
docker-compose -f docker-compose.prod.yml up -d

# Ждем запуска сервисов
echo "⏳ Ждем запуска сервисов..."
sleep 30

# Проверяем статус
echo "📊 Проверяем статус сервисов..."
docker-compose -f docker-compose.prod.yml ps

# Проверяем здоровье сервисов
echo "🏥 Проверяем здоровье сервисов..."
for i in {1..10}; do
    if curl -f http://localhost/health > /dev/null 2>&1; then
        echo "✅ Сервисы запущены успешно!"
        break
    fi
    echo "   Попытка $i/10..."
    sleep 10
done

echo ""
echo "🎉 Развертывание завершено!"
echo ""
echo "📋 Следующие шаги:"
echo "   1. Настройте SSL сертификат: ./scripts/setup-ssl.sh"
echo "   2. Настройте резервное копирование: ./scripts/setup-backup.sh"
echo "   3. Проверьте логи: docker-compose -f docker-compose.prod.yml logs"
echo ""
echo "🌐 Ваш сайт будет доступен по адресу: https://$DOMAIN"