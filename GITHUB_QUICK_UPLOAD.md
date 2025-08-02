# 📤 Быстрая загрузка на GitHub

## 🚀 За 3 шага

### **1. Создайте репозиторий на GitHub:**
- Перейдите на [github.com](https://github.com)
- Нажмите "New repository"
- Название: `mefole-group-website`
- **НЕ** добавляйте README, .gitignore, license
- Нажмите "Create repository"

### **2. Запустите скрипт загрузки:**
```bash
./scripts/upload-to-github.sh
```

### **3. Введите данные:**
- GitHub username
- Название репозитория (или Enter для `mefole-group-website`)

## ✅ Готово!

Ваш проект будет доступен по адресу:
```
https://github.com/YOUR_USERNAME/mefole-group-website
```

## 🔒 Безопасность

Секретные файлы (пароли, токены) **НЕ** загружаются благодаря `.gitignore`:
- `.env` файлы
- Логи и бэкапы
- Временные файлы

## 🔄 Обновление

```bash
git add .
git commit -m "Описание изменений"
git push origin main
```

**🎉 Готово к совместной разработке!**