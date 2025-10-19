// Утилиты для тестирования cookie consent

export const testCookieConsent = () => {
  console.log('=== Cookie Consent Test ===');
  console.log('Current localStorage value:', localStorage.getItem('cookieConsent'));
  console.log('Type:', typeof localStorage.getItem('cookieConsent'));
  
  // Проверяем все возможные значения
  const values = ['accepted', 'declined', null, undefined, ''];
  values.forEach(value => {
    localStorage.setItem('cookieConsent', value);
    console.log(`Set to "${value}":`, localStorage.getItem('cookieConsent'));
  });
  
  // Очищаем для теста
  localStorage.removeItem('cookieConsent');
  console.log('After remove:', localStorage.getItem('cookieConsent'));
  console.log('=== End Test ===');
};

// Функция для сброса cookie consent (для тестирования)
export const resetCookieConsent = () => {
  localStorage.removeItem('cookieConsent');
  console.log('Cookie consent reset');
  window.location.reload();
};

// Функция для принудительного принятия (для тестирования)
export const forceAcceptCookies = () => {
  localStorage.setItem('cookieConsent', 'accepted');
  console.log('Cookie consent forced to accepted');
  window.location.reload();
};

// Функция для принудительного отклонения (для тестирования)
export const forceDeclineCookies = () => {
  localStorage.setItem('cookieConsent', 'declined');
  console.log('Cookie consent forced to declined');
  window.location.reload();
};

