#!/bin/bash

# Скрипт для загрузки проекта на GitHub

set -e

echo "📤 Загрузка проекта Mefole Group Website на GitHub"
echo "=================================================="

# Проверяем что мы в правильной директории
if [ ! -f "README.md" ] || [ ! -f ".gitignore" ]; then
    echo "❌ Убедитесь что вы в корневой директории проекта"
    exit 1
fi

# Запрашиваем данные у пользователя
read -p "🔗 Введите ваш GitHub username: " GITHUB_USERNAME
read -p "📝 Введите название репозитория (по умолчанию: mefole-group-website): " REPO_NAME

# Устанавливаем значение по умолчанию
REPO_NAME=${REPO_NAME:-mefole-group-website}

echo ""
echo "📋 Настройки:"
echo "   GitHub username: $GITHUB_USERNAME"
echo "   Репозиторий: $REPO_NAME"
echo "   URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""

read -p "✅ Продолжить? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Отменено пользователем"
    exit 1
fi

# Проверяем что Git установлен
if ! command -v git &> /dev/null; then
    echo "❌ Git не установлен. Установите Git и попробуйте снова."
    exit 1
fi

# Инициализируем Git если нужно
if [ ! -d ".git" ]; then
    echo "🔧 Инициализируем Git репозиторий..."
    git init
    echo "✅ Git репозиторий инициализирован"
else
    echo "✅ Git репозиторий уже существует"
fi

# Добавляем все файлы
echo "📁 Добавляем файлы в Git..."
git add .

# Проверяем что есть изменения для коммита
if git diff --staged --quiet; then
    echo "⚠️  Нет изменений для коммита"
else
    # Делаем коммит
    echo "💾 Создаем коммит..."
    git commit -m "🎉 Initial commit: Mefole Group Website

✨ Features:
- React 18 frontend with responsive design
- FastAPI backend with PostgreSQL
- Telegram bot integration for orders
- Docker containerization
- Production-ready configuration
- SSL/HTTPS support
- Multi-language support (RU/EN)
- 9 portfolio projects showcase

🚀 Ready for production deployment!"

    echo "✅ Коммит создан"
fi

# Устанавливаем основную ветку
echo "🌿 Устанавливаем основную ветку..."
git branch -M main

# Добавляем remote origin
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo "🔗 Добавляем remote origin: $REPO_URL"

# Удаляем старый origin если есть
git remote remove origin 2>/dev/null || true

# Добавляем новый origin
git remote add origin $REPO_URL

# Загружаем на GitHub
echo "📤 Загружаем на GitHub..."
echo "⚠️  Вам может потребоваться ввести логин и пароль GitHub"

if git push -u origin main; then
    echo ""
    echo "🎉 Проект успешно загружен на GitHub!"
    echo ""
    echo "🌐 Ваш репозиторий доступен по адресу:"
    echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo ""
    echo "📋 Следующие шаги:"
    echo "   1. Перейдите в репозиторий на GitHub"
    echo "   2. Добавьте описание и теги в настройках"
    echo "   3. Настройте Issues и Projects если нужно"
    echo "   4. Поделитесь ссылкой с командой"
    echo ""
    echo "🔄 Для обновления репозитория используйте:"
    echo "   git add ."
    echo "   git commit -m 'Описание изменений'"
    echo "   git push origin main"
else
    echo ""
    echo "❌ Ошибка при загрузке на GitHub"
    echo ""
    echo "🔧 Возможные решения:"
    echo "   1. Убедитесь что репозиторий создан на GitHub"
    echo "   2. Проверьте правильность username и названия репозитория"
    echo "   3. Убедитесь что у вас есть права на запись в репозиторий"
    echo "   4. Попробуйте использовать Personal Access Token вместо пароля"
    echo ""
    echo "📚 Подробная инструкция: GITHUB_UPLOAD_GUIDE.md"
fi