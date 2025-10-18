// Утилиты для работы с куки

export const clearCookieConsent = () => {
  try {
    localStorage.removeItem('cookieConsent');
    console.log('Cookie consent cleared. Refresh the page to see the notification.');
  } catch (error) {
    console.error('Error clearing cookie consent:', error);
  }
};

export const setCookieConsent = (value) => {
  try {
    localStorage.setItem('cookieConsent', value);
    console.log(`Cookie consent set to: ${value}`);
  } catch (error) {
    console.error('Error setting cookie consent:', error);
  }
};

export const getCookieConsent = () => {
  try {
    return localStorage.getItem('cookieConsent');
  } catch (error) {
    console.error('Error getting cookie consent:', error);
    return null;
  }
};

// Функция для тестирования - добавляем в window для доступа из консоли
if (typeof window !== 'undefined') {
  window.clearCookieConsent = clearCookieConsent;
  window.setCookieConsent = setCookieConsent;
  window.getCookieConsent = getCookieConsent;
}
