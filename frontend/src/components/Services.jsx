import './css/services.css';
import DividerLine from './DividerLine';
import { useState, forwardRef, useRef, useEffect } from 'react';
import { services } from '../data/services';
import Modal from './ModalForm';
import ServiceModal from './ServiceModal';
import ReactDOM from 'react-dom';
import { Trans, useTranslation } from 'react-i18next';
import FadeInSection from './FadeInSections';

export const Services = forwardRef((props, ref) => {
    const { t } = useTranslation();

    const scrollRef = useRef(null);
    const cardsPerPage = 1;
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Блокировка прокрутки внутри карточек услуг
    useEffect(() => {
        const preventScroll = (e) => {
            const target = e.target.closest('.services-card');
            if (target) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };

        const servicesContainer = document.querySelector('.services-container');
        if (servicesContainer) {
            servicesContainer.addEventListener('wheel', preventScroll, { passive: false });
            servicesContainer.addEventListener('touchmove', preventScroll, { passive: false });
        }

        return () => {
            if (servicesContainer) {
                servicesContainer.removeEventListener('wheel', preventScroll);
                servicesContainer.removeEventListener('touchmove', preventScroll);
            }
        };
    }, []);

    const scrollToCard = (cardIndex) => {
        const container = scrollRef.current;
        const cards = container.querySelectorAll('.services-card');
        const card = cards[cardIndex];
        if (card && container) {
            const containerRect = container.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const offset = cardRect.left - containerRect.left - (container.offsetWidth / 2) + (card.offsetWidth / 2);
            container.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    const scrollToPage = (pageIndex) => {
        const targetIndex = pageIndex * cardsPerPage;
        scrollToCard(targetIndex);
        const selectedCardId = services[targetIndex]?.id;
        if (selectedCardId !== undefined) {
            select_service_id(selectedCardId);
        }
        setCurrentPage(pageIndex);
    };

    const [selected_service_id, select_service_id] = useState(services[0]?.id ?? null);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedService, setSelectedService] = useState(null);
    const totalPages = Math.ceil(services.length / cardsPerPage);

    const handlePrev = () => {
        select_service_id((prev) => {
            const currentIndex = services.findIndex(s => s.id === prev);
            const newIndex = Math.max(currentIndex - 1, 0);
            scrollToCard(newIndex);
            setCurrentPage(Math.floor(newIndex / cardsPerPage));
            return services[newIndex].id;
        });
    };

    const handleNext = () => {
        select_service_id((prev) => {
            const currentIndex = services.findIndex(s => s.id === prev);
            const newIndex = Math.min(currentIndex + 1, services.length - 1);
            scrollToCard(newIndex);
            setCurrentPage(Math.floor(newIndex / cardsPerPage));
            return services[newIndex].id;
        });
    };

    return (
        <div ref={ref} className="services-container">
            <h3 className="services-title">{t('services-title')}</h3>
            <div className="services-cards-wrapper">
                <div className="services-cards" ref={scrollRef}>
                    {services.map((service, index) => (
                        <FadeInSection 
                            key={service.id}
                            animation="fade-up" 
                            delay={`delay-${(index + 1) * 100}`}
                            threshold={0.2}
                        >
                            <div
                                className={`services-card ${service.id === selected_service_id ? "selected" : ""}`}
                                onClick={() => setSelectedService(service)}
                            >
                                <p className="service_title clamp-3">{t(service.title)}</p>
                                <div className="service-info">
                                    <img src={service.image} alt={t(service.title)} className='service-img' />
                                    <div className='service-price-wrapper'>
                                        <div className="service-price">
                                            <DividerLine />
                                           <Trans
                                                i18nKey="service-price"
                                                values={{ price: service.price }}
                                            />
                                        </div>
                                    </div>
                                    <div className='service-description'>
                                        {t(service.description)}
                                    </div>
                                </div>
                                <div className="service-overlay">
                                    <span className="service-view-text">{t('service-more-details')}</span>
                                </div>
                            </div>
                        </FadeInSection>
                    ))}
                </div>
            </div>

            <button
                onClick={handlePrev}
                className="prev-button"
                disabled={selected_service_id === services[0]?.id}
            >
                <img src="/arrow-left.png" alt="Стрелка влево" />
            </button>

            <button
                onClick={handleNext}
                className="next-button"
                disabled={selected_service_id === services[services.length - 1]?.id}
            >
                <img src="/arrow-right.png" alt="Стрелка вправо" />
            </button>

            <div className='scrolls'>
                {Array.from({ length: totalPages }).map((_, i) => (
                    <img
                        key={i}
                        src={i === currentPage ? "/vectors/circleFilled.png" : "/vectors/circle.png"}
                        alt="Пагинация"
                        onClick={() => scrollToPage(i)}
                        className="indicator-dot"
                    />
                ))}
            </div>

            <div className='form-button'>
                <button onClick={() => setIsModalOpen(true)}>{t('send-form')}</button>
            </div>

            {isModalOpen && ReactDOM.createPortal(
                <Modal onClose={() => setIsModalOpen(false)} selectedServiceId={selected_service_id}/>,
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
