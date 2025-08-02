# 🌐 Руководство по настройке домена

## 📋 Где указывать домен с `https://`, а где без

### **✅ С `https://` (полный URL):**

#### **1. Backend настройки (`backend/src/.env.prod`):**
```env
# ✅ С https:// - для CORS и внешних ссылок
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

#### **2. Frontend API настройки (`frontend/src/settings.prod.js`):**
```javascript
// ✅ С https:// - для API запросов
export const BASE_URL = "https://yourdomain.com/api"
```

#### **3. Nginx CORS headers (`nginx/conf.d/default.conf`):**
```nginx
# ✅ С https:// - для CORS политики
add_header Access-Control-Allow-Origin "https://yourdomain.com" always;
```

---

### **❌ БЕЗ `https://` (только домен):**

#### **1. Основной .env файл (`.env.prod`):**
```env
# ❌ БЕЗ https:// - только домен
DOMAIN=yourdomain.com
LETSENCRYPT_EMAIL=admin@yourdomain.com
```

#### **2. Nginx server_name (`nginx/conf.d/default.conf`):**
```nginx
# ❌ БЕЗ https:// - только домен
server_name yourdomain.com www.yourdomain.com;
```

#### **3. SSL сертификаты (`nginx/conf.d/default.conf`):**
```nginx
# ❌ БЕЗ https:// - только домен
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
```

---

## 🔧 Автоматическая замена доменов

### **Используйте скрипт для замены всех вхождений:**

```bash
# Замените YOUR_DOMAIN на ваш реальный домен
DOMAIN="yourdomain.com"

# Автоматическая замена во всех файлах
sed -i "s/yourdomain.com/$DOMAIN/g" nginx/conf.d/default.conf
sed -i "s/yourdomain.com/$DOMAIN/g" backend/src/.env.prod
sed -i "s/yourdomain.com/$DOMAIN/g" frontend/src/settings.prod.js
sed -i "s/yourdomain.com/$DOMAIN/g" .env.prod
```

### **Или используйте готовый скрипт развертывания:**
```bash
# Скрипт deploy.sh автоматически заменит домены
./scripts/deploy.sh
```

---

## 📝 Пример правильной настройки

### **Для домена `example.com`:**

#### **`.env.prod`:**
```env
DOMAIN=example.com
LETSENCRYPT_EMAIL=admin@example.com
```

#### **`backend/src/.env.prod`:**
```env
FRONTEND_URL=https://example.com
BACKEND_URL=https://example.com
ALLOWED_ORIGINS=https://example.com,https://www.example.com
```

#### **`frontend/src/settings.prod.js`:**
```javascript
export const BASE_URL = "https://example.com/api"
```

#### **`nginx/conf.d/default.conf`:**
```nginx
server_name example.com www.example.com;
ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
add_header Access-Control-Allow-Origin "https://example.com" always;
```

---

## 🚀 Быстрая настройка

### **1. Установите ваш домен в одном месте:**
```bash
# Отредактируйте .env.prod
nano .env.prod

# Укажите только домен без https://
DOMAIN=yourdomain.com
```

### **2. Запустите автоматическую замену:**
```bash
# Скрипт автоматически заменит домены везде где нужно
./scripts/deploy.sh
```

### **3. Проверьте результат:**
```bash
# Проверьте что домены заменились правильно
grep -r "yourdomain.com" nginx/conf.d/default.conf
grep -r "yourdomain.com" backend/src/.env.prod
grep -r "yourdomain.com" frontend/src/settings.prod.js
```

---

## ⚠️ Важные моменты

### **1. Поддомены:**
Если используете `www`, добавьте оба варианта:
```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### **2. Локальная разработка:**
Для разработки используйте `http://localhost`:
```javascript
// development
export const BASE_URL = "http://localhost:8001"

// production  
export const BASE_URL = "https://yourdomain.com/api"
```

### **3. CORS настройки:**
Обязательно указывайте полный URL с `https://` для CORS:
```env
ALLOWED_ORIGINS=https://yourdomain.com
```

### **4. SSL сертификаты:**
Указывайте только домен без протокола:
```nginx
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
```

---

## 🔍 Проверка настроек

### **После настройки проверьте:**

```bash
# 1. Проверьте DNS
nslookup yourdomain.com

# 2. Проверьте HTTP редирект на HTTPS
curl -I http://yourdomain.com

# 3. Проверьте HTTPS доступность
curl -I https://yourdomain.com

# 4. Проверьте API
curl https://yourdomain.com/api/healthz

# 5. Проверьте SSL рейтинг
# https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com
```

---

## 📋 Чек-лист настройки домена

- [ ] **`.env.prod`** - домен БЕЗ `https://`
- [ ] **`backend/src/.env.prod`** - URL С `https://`
- [ ] **`frontend/src/settings.prod.js`** - API URL С `https://`
- [ ] **`nginx/conf.d/default.conf`** - server_name БЕЗ `https://`
- [ ] **`nginx/conf.d/default.conf`** - CORS headers С `https://`
- [ ] DNS настроен и указывает на сервер
- [ ] SSL сертификат получен
- [ ] Редирект с HTTP на HTTPS работает

**🎉 После правильной настройки ваш сайт будет доступен по `https://yourdomain.com`!**