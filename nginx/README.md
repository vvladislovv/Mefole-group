# Nginx Configuration for Mefole Group Website

## Описание

Базовая настройка nginx с защитой, SSL и обработкой доменов для проекта Mefole Group Website.

## Файлы конфигурации

- `nginx.conf` - основная конфигурация nginx
- `conf.d/default.conf` - конфигурация виртуального хоста
- `html/error/` - кастомные страницы ошибок
- `Dockerfile` - Docker образ для nginx

## Функции безопасности

- SSL/TLS шифрование
- Заголовки безопасности (HSTS, X-Frame-Options, CSP)
- Rate limiting для API
- Блокировка доступа к служебным файлам
- Скрытие версии nginx

## Запуск

```bash
# Запуск через docker-compose
docker-compose up nginx

# Или запуск всего стека
docker-compose up
```

## SSL сертификаты

Для разработки используются самоподписанные сертификаты, которые генерируются автоматически при сборке Docker образа.

Для продакшена замените сертификаты в папке `ssl/`:
- `cert.pem` - сертификат
- `key.pem` - приватный ключ

## Домены

По умолчанию настроены домены:
- `mefole.com`
- `www.mefole.com`

Для изменения доменов отредактируйте `conf.d/default.conf`.
