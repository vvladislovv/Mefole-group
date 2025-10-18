import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCookieConsent } from '../hooks/useCookieConsent';
import './css/CookieNotification.css';

const CookieNotification = () => {
  const { t } = useTranslation();
  const { needsConsent, acceptCookies, declineCookies, isLoading } = useCookieConsent();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isLoading && needsConsent) {
      // Показываем уведомление только если нужно согласие
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!isLoading && !needsConsent) {
      // Скрываем уведомление если согласие уже дано
      setIsVisible(false);
      setIsAnimating(false);
    }
  }, [isLoading, needsConsent]);


  const handleAccept = () => {
    setIsAnimating(false);
    setTimeout(() => {
      acceptCookies();
      setIsVisible(false);
    }, 300);
  };

  const handleDecline = () => {
    setIsAnimating(false);
    setTimeout(() => {
      declineCookies();
      setIsVisible(false);
    }, 300);
  };

  // Не показываем уведомление во время загрузки
  if (isLoading) {
    return null;
  }

  // Не показываем уведомление если согласие уже дано
  if (!needsConsent) {
    return null;
  }

  // Не показываем уведомление если оно не видимо
  if (!isVisible) {
    return null;
  }

  return (
    <div className={`cookie-notification ${isAnimating ? 'show' : 'hide'}`}>
      <div className="cookie-content">
        <div className="cookie-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
          </svg>
        </div>
        
        <div className="cookie-text">
          <h3 className="cookie-title">
            {t('cookie-title', 'Мы используем куки')}
          </h3>
          <p className="cookie-description">
            {t('cookie-description', 'Этот сайт использует куки для улучшения вашего опыта. Продолжая использовать сайт, вы соглашаетесь с нашей политикой использования куки.')}
          </p>
        </div>

        <div className="cookie-actions">
          <button 
            className="cookie-btn cookie-btn-decline" 
            onClick={handleDecline}
            aria-label={t('cookie-decline', 'Отклонить')}
          >
            {t('cookie-decline', 'Отклонить')}
          </button>
          <button 
            className="cookie-btn cookie-btn-accept" 
            onClick={handleAccept}
            aria-label={t('cookie-accept', 'Принять')}
          >
            {t('cookie-accept', 'Принять')}
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default CookieNotification;
