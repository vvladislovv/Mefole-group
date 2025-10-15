import { forwardRef, useEffect, useState } from 'react';
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
    const [isMobile, setIsMobile] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleServiceClick = (service) => {
        setSelectedService(service);
    };

    return (
        <div ref={ref} className="services-container">
            <div className="services-header">
                <h3 className="services-title">{t('services-title')}</h3>
                <p className="services-subtitle">{t('services-subtitle')}</p>
            </div>
            
            <div className="services-grid">
                {services.map((service, index) => (
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
                ))}
            </div>

            <div className='form-button'>
                <button onClick={() => setIsModalOpen(true)}>
                    <span>{t('send-form')}</span>
                    <div className="button-glow"></div>
                </button>
            </div>

            {isModalOpen && ReactDOM.createPortal(
                <Modal onClose={() => setIsModalOpen(false)} />,
                document.body
            )}
            
            {selectedService && ReactDOM.createPortal(
                <ServiceModal 
                    service={selectedService} 
                    onClose={() => setSelectedService(null)} 
                />,
                document.body
            )}
        </div>
    );
});
