# 🚀 Быстрый старт для продакшена

## 📋 Минимальные шаги для развертывания

### **1. Подготовка сервера Ubuntu 22.04:**

```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Устанавливаем Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Настраиваем файрвол
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

### **2. Клонируем проект:**

```bash
cd /opt
sudo git clone https://github.com/yourusername/mefole-group-website.git
sudo chown -R $USER:$USER mefole-group-website
cd mefole-group-website
```

### **3. Настраиваем конфигурацию:**

```bash
# Копируем и редактируем .env файл
cp .env.prod.example .env.prod
nano .env.prod

# ⚠️ ВАЖНО: Указывайте домен БЕЗ https://
# ✅ Правильно: DOMAIN=example.com
# ❌ Неправильно: DOMAIN=https://example.com

# Обязательно измените:
DOMAIN=yourdomain.com          # ← БЕЗ https://
DB_PASSWORD=strong_password_here
LETSENCRYPT_EMAIL=your@email.com
```

### **4. Проверяем настройки домена:**

```bash
# Делаем скрипты исполняемыми
chmod +x scripts/*.sh

# Проверяем что домен настроен правильно
./scripts/check-domain.sh

# Если есть ошибки - исправляем в .env.prod
```

### **5. Развертываем приложение:**

```bash
# Запускаем развертывание
./scripts/deploy.sh

# Настраиваем SSL сертификат
./scripts/setup-ssl.sh

# Настраиваем резервное копирование
./scripts/setup-backup.sh
```

### **6. Проверяем работу:**

```bash
# Проверяем статус
./scripts/monitor.sh

# Открываем сайт в браузере
# https://yourdomain.com
```

## 🔧 Основные команды

```bash
# Просмотр статуса
docker-compose -f docker-compose.prod.yml ps

# Просмотр логов
./scripts/logs.sh [service]

# Обновление приложения
./scripts/update-app.sh

# Мониторинг системы
./scripts/monitor.sh

# Создание бэкапа
./scripts/backup-database.sh
```

## 🆘 Если что-то пошло не так

```bash
# Перезапуск всех сервисов
docker-compose -f docker-compose.prod.yml restart

# Просмотр логов ошибок
./scripts/logs.sh error

# Проверка дискового пространства
df -h

# Проверка DNS
nslookup yourdomain.com
```

## 📞 Поддержка

Если возникли проблемы, проверьте:

1. DNS настроен правильно
2. Файрвол разрешает порты 80 и 443
3. Домен указан правильно во всех конфигурациях
4. SSL сертификат получен успешно

**🎉 Готово! Ваш сайт работает на https://yourdomain.com**
