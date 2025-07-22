import { useState, useEffect } from 'react';
import './css/serviceModal.css';
import { useTranslation } from 'react-i18next';
import Modal from './ModalForm';
import ReactDOM from 'react-dom';

export default function ServiceModal({ service, onClose }) {
  const { t } = useTranslation();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleOrder = () => {
    setIsOrderModalOpen(true);
  };

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="service-modal-close" onClick={onClose}>
          &times;
        </button>
        
        <div className="service-modal-header">
          <div className="service-modal-image">
            <img src={service.image} alt={t(service.title)} />
          </div>
          <div className="service-modal-info">
            <h2 className="service-modal-title">{t(service.title)}</h2>
            <div className="service-modal-price">
              {t('service-price', { price: service.price })}
            </div>
          </div>
        </div>

        <div className="service-modal-body">
          <div className="service-modal-description">
            <h3>{t('service-description-title')}</h3>
            <p>{t(service.description)}</p>
          </div>

          <div className="service-modal-features">
            <h3>{t('service-includes-title')}</h3>
            <ul>
              <li>{t('service-include-consultation')}</li>
              <li>{t('service-include-specification')}</li>
              <li>{t('service-include-design')}</li>
              <li>{t('service-include-programming')}</li>
              <li>{t('service-include-launch')}</li>
              <li>{t('service-include-support')}</li>
            </ul>
          </div>

          <div className="service-modal-timeline">
            <h3>{t('service-stages-title')}</h3>
            <div className="timeline-steps">
              <div className="timeline-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>{t('service-stage-analysis')}</h4>
                  <p>{t('service-stage-analysis-desc')}</p>
                </div>
              </div>
              <div className="timeline-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>{t('service-stage-design')}</h4>
                  <p>{t('service-stage-design-desc')}</p>
                </div>
              </div>
              <div className="timeline-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>{t('service-stage-development')}</h4>
                  <p>{t('service-stage-development-desc')}</p>
                </div>
              </div>
              <div className="timeline-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>{t('service-stage-testing')}</h4>
                  <p>{t('service-stage-testing-desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="service-modal-footer">
          <button className="service-modal-order-btn" onClick={handleOrder}>
            {t('order-service')}
          </button>
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
}