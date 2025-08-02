# 🌐 Памятка по настройке домена

## 📋 Простое правило

### **В `.env.prod` - БЕЗ `https://`:**
```env
DOMAIN=example.com
```

### **Везде остальное - автоматически!**
Скрипт `deploy.sh` сам заменит домены в нужном формате:
- С `https://` где нужно (API, CORS)
- Без `https://` где нужно (nginx, SSL)

## 🚀 Быстрая настройка

```bash
# 1. Укажите домен БЕЗ https://
nano .env.prod
DOMAIN=yourdomain.com

# 2. Проверьте настройки
./scripts/check-domain.sh

# 3. Разверните
./scripts/deploy.sh
```

## ✅ Результат

После развертывания:
- **Сайт:** `https://yourdomain.com`
- **API:** `https://yourdomain.com/api/`
- **Docs:** `https://yourdomain.com/api/docs`

**Все настройки домена происходят автоматически!** 🎉