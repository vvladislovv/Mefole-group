import { forwardRef, useCallback, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { services } from '../data/services';
import './css/services.css';
import FadeInSection from './FadeInSections';
import Modal from './ModalForm';
import ServiceModal from './ServiceModal';

export const Services = forwardRef((props, ref) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    // const [isMobile, setIsMobile] = useState(false); // Removed unused variable
    const [hoveredCard, setHoveredCard] = useState(null);

    // Mobile check removed as it was unused

    const handleServiceClick = useCallback((service) => {
        setSelectedService(service);
    }, []);

    const handleModalOpen = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleServiceClose = useCallback(() => {
        setSelectedService(null);
    }, []);

    // Memoized service cards
    const serviceCards = useMemo(() => {
        return services.map((service, index) => (
            <FadeInSection 
                key={service.id}
                animation="fade-up" 
                delay={`delay-${(index + 1) * 100}`}
                threshold={0.2}
            >
                <div
                    className={`services-card ${hoveredCard === service.id ? 'hovered' : ''}`}
                    onClick={() => handleServiceClick(service)}
                    onMouseEnter={() => setHoveredCard(service.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                >
                    <div className="service-card-inner">
                        <div className="service-icon-container">
                            <div className="service-icon">{service.icon}</div>
                            <div className="service-icon-bg"></div>
                        </div>
                        
                        <div className="service-content">
                            <h4 className="service-title">{t(service.title)}</h4>
                            <p className="service-description">{t(service.shortDescription)}</p>
                            
                            <div className="service-features">
                                {service.includes.slice(0, 3).map((feature, idx) => (
                                    <span key={idx} className="service-feature">
                                        {t(feature)}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        <div className="service-action">
                            <button className="service-learn-more">
                                {t('service-more-details')}
                                <span className="service-arrow">→</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="service-glow"></div>
                </div>
            </FadeInSection>
        ));
    }, [hoveredCard, handleServiceClick, t]);

    return (
        <div ref={ref} className="services-container">
            <div className="services-header">
                <h3 className="services-title">{t('services-title')}</h3>
                <p className="services-subtitle">{t('services-subtitle')}</p>
            </div>
            
            <div className="services-grid">
                {serviceCards}
            </div>

            <div className='form-button'>
                <button onClick={handleModalOpen}>
                    <span>{t('send-form')}</span>
                    <div className="button-glow"></div>
                </button>
            </div>

            {isModalOpen && ReactDOM.createPortal(
                <Modal onClose={handleModalClose} />,
                document.body
            )}
            
            {selectedService && ReactDOM.createPortal(
                <ServiceModal 
                    service={selectedService} 
                    onClose={handleServiceClose} 
                />,
                document.body
            )}
        </div>
    );
});
