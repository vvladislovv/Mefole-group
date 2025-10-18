import { useEffect, useState } from 'react';

const COOKIE_CONSENT_KEY = 'cookieConsent';

export const useCookieConsent = () => {
  const [consent, setConsent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем localStorage при загрузке
    const checkConsent = () => {
      try {
        const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
        console.log('Cookie consent check:', storedConsent); // Для отладки
        
        if (storedConsent === 'accepted' || storedConsent === 'declined') {
          setConsent(storedConsent);
          console.log('Cookie consent found:', storedConsent);
        } else {
          setConsent(null);
          console.log('No cookie consent found, showing notification');
        }
      } catch (error) {
        console.warn('Error reading cookie consent from localStorage:', error);
        setConsent(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkConsent();
  }, []);

  const acceptCookies = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
      setConsent('accepted');
      console.log('Cookie consent accepted and saved to localStorage');
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  };

  const declineCookies = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
      setConsent('declined');
      console.log('Cookie consent declined and saved to localStorage');
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  };

  const resetConsent = () => {
    try {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      setConsent(null);
    } catch (error) {
      console.error('Error removing cookie consent:', error);
    }
  };

  const hasConsent = consent === 'accepted';
  const hasDeclined = consent === 'declined';
  const needsConsent = consent === null;

  return {
    consent,
    isLoading,
    hasConsent,
    hasDeclined,
    needsConsent,
    acceptCookies,
    declineCookies,
    resetConsent
  };
};
