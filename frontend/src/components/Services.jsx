import { forwardRef, useState, useEffect } from 'react';
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
            <h3 className="services-title">{t('services-title')}</h3>
            
            <div className="services-grid">
                {services.map((service, index) => (
                    <FadeInSection 
                        key={service.id}
                        animation="fade-up" 
                        delay={`delay-${(index + 1) * 100}`}
                        threshold={0.2}
                    >
                        <div
                            className="services-card"
                            onClick={() => handleServiceClick(service)}
                        >
                            <div className="service-icon">{service.icon}</div>
                            <h4 className="service-title">{t(service.title)}</h4>
                            {!isMobile && <p className="service-description">{t(service.shortDescription)}</p>}
                            {isMobile && (
                                <button 
                                    className="service-details-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedService(service);
                                    }}
                                >
                                    {t('service-more-details')}
                                </button>
                            )}
                            <div className="service-overlay">
                                <span className="service-view-text">{t('service-more-details')}</span>
                            </div>
                        </div>
                    </FadeInSection>
                ))}
            </div>

            <div className='form-button'>
                <button onClick={() => setIsModalOpen(true)}>{t('send-form')}</button>
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
