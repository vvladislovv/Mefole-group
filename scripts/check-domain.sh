#!/bin/bash

# Скрипт проверки настроек домена

set -e

# Загружаем переменные окружения
if [ ! -f ".env.prod" ]; then
    echo "❌ Файл .env.prod не найден."
    exit 1
fi

source .env.prod

if [ "$DOMAIN" = "yourdomain.com" ]; then
    echo "❌ Пожалуйста, настройте домен в .env.prod файле"
    exit 1
fi

echo "🔍 Проверка настроек домена: $DOMAIN"
echo "========================================"

# Проверяем DNS
echo ""
echo "🌐 Проверка DNS..."
if nslookup $DOMAIN > /dev/null 2>&1; then
    echo "✅ DNS настроен корректно"
    IP=$(nslookup $DOMAIN | grep -A1 "Name:" | tail -1 | awk '{print $2}')
    echo "   IP адрес: $IP"
else
    echo "❌ DNS не настроен или домен недоступен"
fi

# Проверяем настройки в файлах
echo ""
echo "📁 Проверка конфигурационных файлов..."

# Nginx
if grep -q "server_name $DOMAIN" nginx/conf.d/default.conf; then
    echo "✅ Nginx: server_name настроен"
else
    echo "❌ Nginx: server_name не настроен"
fi

if grep -q "ssl_certificate /etc/letsencrypt/live/$DOMAIN" nginx/conf.d/default.conf; then
    echo "✅ Nginx: SSL путь настроен"
else
    echo "❌ Nginx: SSL путь не настроен"
fi

if grep -q "https://$DOMAIN" nginx/conf.d/default.conf; then
    echo "✅ Nginx: CORS headers настроены"
else
    echo "❌ Nginx: CORS headers не настроены"
fi

# Backend
if grep -q "https://$DOMAIN" backend/src/.env.prod; then
    echo "✅ Backend: URLs настроены"
else
    echo "❌ Backend: URLs не настроены"
fi

# Frontend
if grep -q "https://$DOMAIN/api" frontend/src/settings.prod.js; then
    echo "✅ Frontend: API URL настроен"
else
    echo "❌ Frontend: API URL не настроен"
fi

# Проверяем доступность сайта (если развернут)
echo ""
echo "🌐 Проверка доступности сайта..."

# HTTP (должен редиректить на HTTPS)
if curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN | grep -q "301\|302"; then
    echo "✅ HTTP редирект на HTTPS работает"
else
    echo "⚠️  HTTP редирект не настроен или сайт не развернут"
fi

# HTTPS
if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN | grep -q "200"; then
    echo "✅ HTTPS сайт доступен"
else
    echo "⚠️  HTTPS сайт недоступен или не развернут"
fi

# Health check
if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/health | grep -q "200"; then
    echo "✅ Health check работает"
else
    echo "⚠️  Health check недоступен"
fi

# API
if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/api/healthz | grep -q "200"; then
    echo "✅ API доступен"
else
    echo "⚠️  API недоступен"
fi

echo ""
echo "📋 Рекомендации:"
echo "   1. Убедитесь что DNS указывает на ваш сервер"
echo "   2. Запустите развертывание: ./scripts/deploy.sh"
echo "   3. Настройте SSL: ./scripts/setup-ssl.sh"
echo "   4. Проверьте SSL рейтинг: https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"

echo ""
echo "🎯 Ваш сайт должен быть доступен по адресу: https://$DOMAIN"