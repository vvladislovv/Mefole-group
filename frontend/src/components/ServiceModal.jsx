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
          <div className="service-modal-icon">
            {service.icon}
          </div>
          <div className="service-modal-info">
            <h2 className="service-modal-title">{t(service.title)}</h2>
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
              {service.includes.map((include, index) => (
                <li key={index}>{t(include)}</li>
              ))}
            </ul>
          </div>

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
                </div>
              ))}
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