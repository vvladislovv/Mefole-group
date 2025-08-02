#!/bin/bash

# Скрипт настройки резервного копирования

set -e

echo "💾 Настройка резервного копирования..."

# Загружаем переменные окружения
source .env.prod

# Создаем директории для бэкапов
mkdir -p backups/database
mkdir -p backups/uploads
mkdir -p backups/logs

# Создаем скрипт бэкапа базы данных
cat > scripts/backup-database.sh << 'EOF'
#!/bin/bash

# Скрипт резервного копирования базы данных

set -e

# Загружаем переменные окружения
source .env.prod

# Создаем имя файла с датой
BACKUP_FILE="backups/database/mefole_db_$(date +%Y%m%d_%H%M%S).sql"

echo "💾 Создаем резервную копию базы данных..."

# Создаем бэкап
docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE

# Сжимаем бэкап
gzip $BACKUP_FILE

echo "✅ Резервная копия создана: ${BACKUP_FILE}.gz"

# Удаляем старые бэкапы (старше 30 дней)
find backups/database -name "*.sql.gz" -mtime +30 -delete

echo "🧹 Старые бэкапы очищены"
EOF

chmod +x scripts/backup-database.sh

# Создаем скрипт восстановления базы данных
cat > scripts/restore-database.sh << 'EOF'
#!/bin/bash

# Скрипт восстановления базы данных

set -e

if [ -z "$1" ]; then
    echo "❌ Использование: $0 <путь_к_бэкапу>"
    echo "   Пример: $0 backups/database/mefole_db_20240802_120000.sql.gz"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Файл бэкапа не найден: $BACKUP_FILE"
    exit 1
fi

# Загружаем переменные окружения
source .env.prod

echo "🔄 Восстанавливаем базу данных из: $BACKUP_FILE"

# Распаковываем если нужно
if [[ $BACKUP_FILE == *.gz ]]; then
    TEMP_FILE=$(mktemp)
    gunzip -c $BACKUP_FILE > $TEMP_FILE
    BACKUP_FILE=$TEMP_FILE
fi

# Останавливаем backend для безопасности
docker-compose -f docker-compose.prod.yml stop backend

# Восстанавливаем базу данных
docker-compose -f docker-compose.prod.yml exec -T db psql -U $DB_USER -d $DB_NAME < $BACKUP_FILE

# Запускаем backend обратно
docker-compose -f docker-compose.prod.yml start backend

# Удаляем временный файл если создавали
if [ -n "$TEMP_FILE" ]; then
    rm -f $TEMP_FILE
fi

echo "✅ База данных восстановлена успешно!"
EOF

chmod +x scripts/restore-database.sh

# Создаем скрипт мониторинга
cat > scripts/monitor.sh << 'EOF'
#!/bin/bash

# Скрипт мониторинга системы

echo "📊 Статус системы Mefole Group Website"
echo "========================================"

# Статус контейнеров
echo ""
echo "🐳 Статус Docker контейнеров:"
docker-compose -f docker-compose.prod.yml ps

# Использование ресурсов
echo ""
echo "💻 Использование ресурсов:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

# Проверка доступности сайта
echo ""
echo "🌐 Проверка доступности:"
if curl -f -s https://$(grep DOMAIN .env.prod | cut -d'=' -f2)/health > /dev/null; then
    echo "✅ Сайт доступен"
else
    echo "❌ Сайт недоступен"
fi

# Размер логов
echo ""
echo "📝 Размер логов:"
du -sh logs/

# Размер бэкапов
echo ""
echo "💾 Размер бэкапов:"
du -sh backups/

# Свободное место на диске
echo ""
echo "💽 Свободное место на диске:"
df -h /

echo ""
echo "📋 Для просмотра логов используйте:"
echo "   docker-compose -f docker-compose.prod.yml logs [service_name]"
EOF

chmod +x scripts/monitor.sh

# Настраиваем cron для автоматических бэкапов
echo "⚙️ Настраиваем автоматические бэкапы..."

# Удаляем старые задания если есть
crontab -l 2>/dev/null | grep -v "backup-database.sh" | crontab -

# Добавляем новое задание (каждый день в 2:00)
(crontab -l 2>/dev/null; echo "0 2 * * * cd $(pwd) && ./scripts/backup-database.sh >> logs/backup.log 2>&1") | crontab -

echo ""
echo "🎉 Резервное копирование настроено!"
echo ""
echo "📋 Доступные команды:"
echo "   ./scripts/backup-database.sh     - Создать бэкап базы данных"
echo "   ./scripts/restore-database.sh    - Восстановить базу данных"
echo "   ./scripts/monitor.sh             - Мониторинг системы"
echo ""
echo "🔄 Автоматические бэкапы настроены на 2:00 каждый день"