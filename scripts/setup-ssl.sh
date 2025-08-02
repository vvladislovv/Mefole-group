#!/bin/bash

# Скрипт настройки SSL сертификата с Let's Encrypt

set -e

echo "🔒 Настройка SSL сертификата..."

# Загружаем переменные окружения
if [ ! -f ".env.prod" ]; then
    echo "❌ Файл .env.prod не найден."
    exit 1
fi

source .env.prod

# Проверяем что домен настроен
if [ "$DOMAIN" = "yourdomain.com" ]; then
    echo "❌ Пожалуйста, настройте домен в .env.prod файле"
    exit 1
fi

echo "📋 Настройка SSL для домена: $DOMAIN"
echo "📧 Email: $LETSENCRYPT_EMAIL"

# Устанавливаем certbot если не установлен
if ! command -v certbot &> /dev/null; then
    echo "📦 Устанавливаем certbot..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

# Создаем директорию для challenge
sudo mkdir -p /var/www/certbot

# Временно останавливаем nginx контейнер
echo "🛑 Временно останавливаем nginx..."
docker-compose -f docker-compose.prod.yml stop nginx

# Получаем сертификат
echo "🔐 Получаем SSL сертификат..."
sudo certbot certonly \
    --standalone \
    --email $LETSENCRYPT_EMAIL \
    --agree-tos \
    --no-eff-email \
    --domains $DOMAIN,www.$DOMAIN

# Проверяем что сертификат получен
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "❌ Не удалось получить SSL сертификат"
    exit 1
fi

echo "✅ SSL сертификат получен успешно!"

# Запускаем nginx обратно
echo "🚀 Запускаем nginx с SSL..."
docker-compose -f docker-compose.prod.yml up -d nginx

# Настраиваем автообновление сертификата
echo "⚙️ Настраиваем автообновление сертификата..."
sudo crontab -l 2>/dev/null | grep -v "certbot renew" | sudo crontab -
(sudo crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --deploy-hook 'docker-compose -f $(pwd)/docker-compose.prod.yml restart nginx'") | sudo crontab -

echo ""
echo "🎉 SSL настроен успешно!"
echo ""
echo "📋 Проверьте:"
echo "   - Сайт доступен по HTTPS: https://$DOMAIN"
echo "   - SSL рейтинг: https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
echo ""
echo "🔄 Автообновление сертификата настроено в crontab"