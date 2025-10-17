import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import './css/serviceModal.css';
import Modal from './ModalForm';

const ServiceModal = React.memo(function ServiceModal({ service, onClose }) {
  const { t } = useTranslation();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Сохраняем текущую позицию скролла
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    
    // Анимация появления
    setTimeout(() => setIsVisible(true), 10);
    
    return () => {
      // Восстанавливаем скролл и позицию
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleOrder = useCallback(() => {
    setIsOrderModalOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  }, [onClose]);

  const tabs = [
    { id: 'overview', label: 'service-overview', icon: '📄' },
    { id: 'features', label: 'service-features', icon: '⭐' },
    { id: 'process', label: 'service-process', icon: '⚙️' }
  ];

  return (
    <div className={`service-modal-overlay ${isVisible ? 'visible' : ''}`} onClick={handleClose}>
      <div className={`service-modal-content ${isVisible ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="service-modal-close" onClick={handleClose}>
          <span>&times;</span>
        </button>
        
        {/* Заголовок с иконкой и градиентом */}
        <div className="service-modal-header">
          <div className="service-modal-icon-container">
            <div className="service-modal-icon">
              {service.icon}
            </div>
            <div className="service-modal-icon-glow"></div>
          </div>
          <div className="service-modal-info">
            <h2 className="service-modal-title">{t(service.title)}</h2>
            <p className="service-modal-subtitle">{t(service.shortDescription)}</p>
            <div className="service-modal-category">
              <span className="category-badge">{t(`category-${service.category}`)}</span>
            </div>
          </div>
        </div>

        {/* Навигация по вкладкам */}
        <div className="service-modal-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`service-modal-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{t(tab.label)}</span>
            </button>
          ))}
        </div>

        {/* Контент вкладок */}
        <div className="service-modal-body">
          {activeTab === 'overview' && (
            <div className="service-modal-tab-content">
              <div className="service-modal-description">
                <h3>{t('service-description-title')}</h3>
                <p>{t(service.description)}</p>
                {service.detailedDescription && (
                  <div className="detailed-description">
                    <h4>{t('service-detailed-description')}</h4>
                    <p>{t(service.detailedDescription)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="service-modal-tab-content">
              <div className="service-modal-features">
                <h3>{t('service-includes-title')}</h3>
                <div className="features-grid">
                  {service.includes.map((include, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-icon">✓</div>
                      <span className="feature-text">{t(include)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'process' && (
            <div className="service-modal-tab-content">
              <div className="service-modal-timeline">
                <h3>{t('service-stages-title')}</h3>
                <div className="timeline-steps">
                  {service.stages.map((stage, index) => (
                    <div key={index} className="timeline-step">
                      <div className="step-number">{index + 1}</div>
                      <div className="step-content">
                        <h4>{t(stage.title)}</h4>
                        <p>{t(stage.description)}</p>
                      </div>
                      {index < service.stages.length - 1 && <div className="timeline-line"></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="service-modal-footer">
          <div className="service-modal-cta">
            <div className="cta-text">
              <h4>{t('service-ready-to-start')}</h4>
              <p>{t('service-contact-us-now')}</p>
            </div>
            <button className="service-modal-order-btn" onClick={handleOrder}>
              <span>{t('order-service')}</span>
              <div className="btn-glow"></div>
            </button>
          </div>
        </div>

        {isOrderModalOpen && ReactDOM.createPortal(
          <Modal 
            onClose={() => setIsOrderModalOpen(false)} 
            selectedServiceId={service.id}
          />,
          document.body
        )}
      </div>
    </div>
  );
});

export default ServiceModal;