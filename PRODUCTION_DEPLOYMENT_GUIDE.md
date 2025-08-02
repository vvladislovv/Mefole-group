# 🚀 Руководство по развертыванию в продакшене

## 📋 Требования к серверу

### **Минимальные требования:**
- **ОС:** Ubuntu 22.04 LTS
- **RAM:** 4GB (рекомендуется 8GB)
- **CPU:** 2 ядра (рекомендуется 4)
- **Диск:** 50GB SSD (рекомендуется 100GB)
- **Сеть:** Статический IP адрес

### **Необходимое ПО:**
- Docker Engine 24.0+
- Docker Compose 2.0+
- Git
- Nginx (будет в контейнере)
- Certbot (для SSL)

## 🛠 Подготовка сервера

### **1. Обновление системы:**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git htop nano ufw
```

### **2. Установка Docker:**
```bash
# Удаляем старые версии
sudo apt remove docker docker-engine docker.io containerd runc

# Устанавливаем зависимости
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Добавляем GPG ключ Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Добавляем репозиторий Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Устанавливаем Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Добавляем пользователя в группу docker
sudo usermod -aG docker $USER
newgrp docker

# Проверяем установку
docker --version
docker compose version
```

### **3. Настройка файрвола:**
```bash
# Настраиваем UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Проверяем статус
sudo ufw status
```

### **4. Настройка DNS:**
Убедитесь что ваш домен указывает на IP сервера:
```bash
# Проверяем DNS
nslookup yourdomain.com
dig yourdomain.com
```

## 📦 Развертывание приложения

### **1. Клонирование репозитория:**
```bash
cd /opt
sudo git clone https://github.com/yourusername/mefole-group-website.git
sudo chown -R $USER:$USER mefole-group-website
cd mefole-group-website
```

### **2. Настройка конфигурации:**
```bash
# Копируем и настраиваем .env файл
cp .env.prod .env.prod.local
nano .env.prod.local
```

**Настройте следующие параметры:**
```env
# Database credentials
DB_USER=mefole_user
DB_PASSWORD=YOUR_STRONG_PASSWORD_HERE
DB_NAME=mefole_db

# Domain
DOMAIN=yourdomain.com

# Email for Let's Encrypt
LETSENCRYPT_EMAIL=admin@yourdomain.com
```

```bash
# Копируем и настраиваем backend .env
cp backend/src/.env.prod backend/src/.env.prod.local
nano backend/src/.env.prod.local
```

**Настройте backend .env:**
```env
# ===== Environment =====
ENVIRONMENT=production

# ===== Database =====
DATABASE_URL=postgresql+asyncpg://mefole_user:YOUR_STRONG_PASSWORD_HERE@db:5432/mefole_db

# ===== URLs =====
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://yourdomain.com

# ===== CORS =====
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# ===== Telegram Bot =====
TELEGRAM_BOT_TOKEN=7331834468:AAG8OW363QJgz_FH25uW78tGPv-vmkzUnoc

# ===== Security =====
SECRET_KEY=GENERATE_RANDOM_SECRET_KEY_HERE
```

```bash
# Настраиваем frontend settings
cp frontend/src/settings.prod.js frontend/src/settings.js
nano frontend/src/settings.js
```

**Настройте frontend settings:**
```javascript
export const BASE_URL = "https://yourdomain.com/api"
```

### **3. Обновление конфигураций:**
```bash
# Обновляем домен в nginx конфигурации
sed -i 's/yourdomain.com/YOUR_ACTUAL_DOMAIN/g' nginx/conf.d/default.conf

# Делаем скрипты исполняемыми
chmod +x scripts/*.sh
```

### **4. Первоначальное развертывание:**
```bash
# Запускаем скрипт развертывания
./scripts/deploy.sh
```

### **5. Настройка SSL сертификата:**
```bash
# Настраиваем SSL с Let's Encrypt
./scripts/setup-ssl.sh
```

### **6. Настройка резервного копирования:**
```bash
# Настраиваем автоматические бэкапы
./scripts/setup-backup.sh
```

## 🔧 Управление приложением

### **Основные команды:**

```bash
# Просмотр статуса сервисов
docker compose -f docker-compose.prod.yml ps

# Просмотр логов
docker compose -f docker-compose.prod.yml logs -f [service_name]

# Перезапуск сервиса
docker compose -f docker-compose.prod.yml restart [service_name]

# Остановка всех сервисов
docker compose -f docker-compose.prod.yml down

# Запуск всех сервисов
docker compose -f docker-compose.prod.yml up -d

# Обновление образов
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --force-recreate
```

### **Мониторинг:**
```bash
# Общий мониторинг системы
./scripts/monitor.sh

# Просмотр использования ресурсов
docker stats

# Проверка дискового пространства
df -h

# Просмотр логов nginx
tail -f logs/nginx/access.log
tail -f logs/nginx/error.log
```

### **Резервное копирование:**
```bash
# Создание бэкапа базы данных
./scripts/backup-database.sh

# Восстановление из бэкапа
./scripts/restore-database.sh backups/database/backup_file.sql.gz

# Просмотр всех бэкапов
ls -la backups/database/
```

## 🔒 Безопасность

### **1. Настройка SSH:**
```bash
# Отключаем вход по паролю (только ключи)
sudo nano /etc/ssh/sshd_config

# Добавляем/изменяем:
PasswordAuthentication no
PermitRootLogin no
Port 2222  # Изменяем стандартный порт

sudo systemctl restart ssh

# Обновляем файрвол
sudo ufw allow 2222/tcp
sudo ufw delete allow ssh
```

### **2. Настройка Fail2Ban:**
```bash
# Устанавливаем Fail2Ban
sudo apt install -y fail2ban

# Создаем конфигурацию
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = 2222

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
```

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### **3. Автоматические обновления:**
```bash
# Настраиваем автоматические обновления безопасности
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 📊 Мониторинг и логирование

### **1. Настройка логирования:**
```bash
# Настраиваем ротацию логов
sudo nano /etc/logrotate.d/mefole-website
```

```
/opt/mefole-group-website/logs/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        docker compose -f /opt/mefole-group-website/docker-compose.prod.yml restart nginx
    endscript
}
```

### **2. Мониторинг производительности:**
```bash
# Устанавливаем htop для мониторинга
sudo apt install -y htop iotop nethogs

# Мониторинг Docker контейнеров
docker stats --no-stream

# Мониторинг дискового пространства
watch -n 5 df -h
```

## 🚨 Устранение неполадок

### **Частые проблемы:**

#### **1. Сайт недоступен:**
```bash
# Проверяем статус контейнеров
docker compose -f docker-compose.prod.yml ps

# Проверяем логи nginx
docker compose -f docker-compose.prod.yml logs nginx

# Проверяем порты
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

#### **2. SSL сертификат не работает:**
```bash
# Проверяем сертификат
sudo certbot certificates

# Обновляем сертификат вручную
sudo certbot renew --dry-run

# Перезапускаем nginx
docker compose -f docker-compose.prod.yml restart nginx
```

#### **3. База данных недоступна:**
```bash
# Проверяем статус БД
docker compose -f docker-compose.prod.yml logs db

# Подключаемся к БД
docker compose -f docker-compose.prod.yml exec db psql -U mefole_user -d mefole_db

# Проверяем место на диске
df -h
```

#### **4. Высокая нагрузка:**
```bash
# Проверяем использование ресурсов
htop
docker stats

# Проверяем логи на ошибки
docker compose -f docker-compose.prod.yml logs --tail=100

# Масштабируем backend если нужно
docker compose -f docker-compose.prod.yml up -d --scale backend=2
```

## 📈 Оптимизация производительности

### **1. Настройка кэширования:**
- Redis для кэширования API ответов
- CDN для статических файлов
- Browser caching через nginx headers

### **2. Масштабирование:**
```bash
# Горизонтальное масштабирование backend
docker compose -f docker-compose.prod.yml up -d --scale backend=3

# Вертикальное масштабирование (увеличение ресурсов)
# Редактируем docker-compose.prod.yml и добавляем:
deploy:
  resources:
    limits:
      cpus: '2.0'
      memory: 2G
```

### **3. Мониторинг метрик:**
- Настройка Prometheus + Grafana
- Алерты в Telegram при проблемах
- Мониторинг времени ответа API

## 🔄 Обновление приложения

### **Процедура обновления:**
```bash
# 1. Создаем бэкап
./scripts/backup-database.sh

# 2. Получаем обновления
git pull origin main

# 3. Пересобираем образы
docker compose -f docker-compose.prod.yml build --no-cache

# 4. Обновляем сервисы с zero-downtime
docker compose -f docker-compose.prod.yml up -d --force-recreate

# 5. Проверяем что все работает
./scripts/monitor.sh
```

## 📞 Поддержка

### **Контакты для поддержки:**
- **Telegram:** @your_support_bot
- **Email:** support@yourdomain.com
- **Документация:** https://docs.yourdomain.com

### **Полезные ссылки:**
- **Мониторинг:** https://yourdomain.com/health
- **API документация:** https://yourdomain.com/api/docs
- **Админ панель:** https://yourdomain.com/api/admin

---

## ✅ Чек-лист развертывания

- [ ] Сервер подготовлен (Ubuntu 22.04, Docker, файрвол)
- [ ] DNS настроен и указывает на сервер
- [ ] Репозиторий склонирован
- [ ] Конфигурационные файлы настроены
- [ ] Приложение развернуто (`./scripts/deploy.sh`)
- [ ] SSL сертификат настроен (`./scripts/setup-ssl.sh`)
- [ ] Резервное копирование настроено (`./scripts/setup-backup.sh`)
- [ ] Мониторинг работает (`./scripts/monitor.sh`)
- [ ] Сайт доступен по HTTPS
- [ ] Telegram бот работает
- [ ] Админы добавлены и могут получать уведомления

**🎉 Поздравляем! Ваш сайт Mefole Group готов к работе в продакшене!**