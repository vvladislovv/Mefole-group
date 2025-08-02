// Маппинг между ключами переводов и названиями сервисов в базе данных
export const serviceMapping = {
  "web-development": "Веб-разработка",
  "telegram-bots-automation": "Telegram-боты и автоматизация", 
  "ui-ux-graphic-design": "UI/UX и графический дизайн",
  "hosting-maintenance": "Хостинг и поддержка",
  "marketing-ads": "Маркетинг и реклама",
  "mobile-app-development": "Разработка мобильных приложений"
};

// Функция для получения названия сервиса для отправки в API
export const getServiceNameForAPI = (serviceKey) => {
  return serviceMapping[serviceKey] || serviceKey;
};