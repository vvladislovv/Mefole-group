import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { reviews } from '../data/reviews';
import './css/reviews.css';
import FadeInSection from './FadeInSections';
export const Reviews = forwardRef((props, ref) => {
    const {t} = useTranslation();
    const scrollRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    
    // КОПИРУЕМ ЛОГИКУ ОТ КОМАНДЫ
    const [selected_review_id, select_review_id] = useState(reviews[0]?.id ?? null);
    const [currentPage, setCurrentPage] = useState(0);
    const cardsPerPage = 1;
    const totalPages = Math.ceil(reviews.length / cardsPerPage);
    const maxDots = 3;

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Центрирование первого элемента
    useEffect(() => {
        if (isMobile && scrollRef.current) {
            const firstCard = scrollRef.current.querySelector('.reviews-card');
            if (firstCard) {
                firstCard.style.display = 'flex';
                firstCard.style.visibility = 'visible';
                firstCard.style.opacity = '1';
            }
            
            // Плавный скролл без задержки
            requestAnimationFrame(() => {
                scrollToCard(0);
            });
        }
    }, [isMobile]);

    // Функция скролла с улучшенной плавностью
    const scrollToCard = (cardIndex) => {
        const container = scrollRef.current;
        const cards = container.querySelectorAll(".reviews-card");
        const card = cards[cardIndex];
        if (card && container) {
            const containerRect = container.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const offset = cardRect.left - containerRect.left - (container.offsetWidth / 2) + (card.offsetWidth / 2);
            
            // Плавный скролл с requestAnimationFrame для лучшей производительности
            container.scrollTo({
                left: container.scrollLeft + offset,
                behavior: "smooth"
            });
        }
    };

    const scrollToPage = (pageIndex) => {
        const targetIndex = pageIndex * cardsPerPage;
        setCurrentPage(pageIndex);
        // Небольшая задержка для обновления состояния перед скроллом
        requestAnimationFrame(() => {
            scrollToCard(targetIndex);
        });
    };

    // Улучшенные кнопки навигации
    const handlePrev = () => {
        if (isMobile) {
            select_review_id((prevId) => {
                const currentIndex = reviews.findIndex(r => r.id === prevId);
                const newIndex = Math.max(currentIndex - 1, 0);
                const newPage = Math.floor(newIndex / cardsPerPage);
                setCurrentPage(newPage);
                
                // Плавный скролл после обновления состояния
                requestAnimationFrame(() => {
                    scrollToCard(newIndex);
                });
                
                return reviews[newIndex].id;
            });
        } else {
            setCurrentPage(prev => Math.max(0, prev - 1));
        }
    };

    const handleNext = () => {
        if (isMobile) {
            select_review_id((prevId) => {
                const currentIndex = reviews.findIndex(r => r.id === prevId);
                const newIndex = Math.min(currentIndex + 1, reviews.length - 1);
                const newPage = Math.floor(newIndex / cardsPerPage);
                setCurrentPage(newPage);
                
                // Плавный скролл после обновления состояния
                requestAnimationFrame(() => {
                    scrollToCard(newIndex);
                });
                
                return reviews[newIndex].id;
            });
        } else {
            const reviewsPerPage = 4;
            const totalDesktopPages = Math.ceil(reviews.length / reviewsPerPage);
            setCurrentPage(prev => Math.min(totalDesktopPages - 1, prev + 1));
        }
    };

    // Логика для десктопа
    const getCurrentReviews = () => {
        if (isMobile) {
            return reviews;
        } else {
            const reviewsPerPage = 4;
            const startIndex = currentPage * reviewsPerPage;
            return reviews.slice(startIndex, startIndex + reviewsPerPage);
        }
    };

    const getVisibleDots = () => {
        const totalPagesToShow = isMobile ? totalPages : Math.ceil(reviews.length / 4);
        const maxDotsToShow = isMobile ? maxDots : totalPagesToShow;
        
        if (totalPagesToShow <= maxDotsToShow) {
            return Array.from({ length: totalPagesToShow }, (_, i) => i);
        }
        
        if (currentPage <= 1) {
            return [0, 1, 2];
        }
        
        if (currentPage >= totalPagesToShow - 2) {
            return [totalPagesToShow - 3, totalPagesToShow - 2, totalPagesToShow - 1];
        }
        
        return [currentPage - 1, currentPage, currentPage + 1];
    };
    return (
        <div ref={ref} className="reviews-container">
            <h3 className="reviews-title">{t('reviews-title')}</h3>
            
            {isMobile ? (
                // МОБИЛЬНАЯ ВЕРСИЯ - ТОЧНО КАК КОМАНДА
                <>
                    <div className="reviews-cards-wrapper">
                        <div className="reviews-cards" ref={scrollRef}>
                            {reviews.map(({id, photo, rating}, index) => (
                                <div
                                    key={id}
                                    className={`reviews-card ${id === selected_review_id ? "selected" : ""}`}
                                >
                                    <div className="stars">
                                        {[...Array(5)].map((_, i) => (
                                            <img
                                                key={i}
                                                src={i < rating ? "/icons/StarFilled.png" : "/icons/StarOutlined.png"}
                                                alt="Звезда"
                                                className="star-icon"
                                            />
                                        ))}
                                    </div>
                                    <div>
                                        <p className="reviews-text">
                                            {t(`review-cards.${id}.text`)}
                                        </p>
                                    </div>
                                    <div className='user-card'>
                                        <div className="user-avatar">
                                            {t(`review-cards.${id}.name`).charAt(0)}
                                        </div>
                                        <div className='user_info'>
                                            <span className='user_name'>{t(`review-cards.${String(id)}.name`)}</span>
                                            <span className="user_role">{t(`review-cards.${id}.position`)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handlePrev}
                        className="prev-button"
                        disabled={selected_review_id === reviews[0]?.id}
                    >
                        <img src="/arrow-left.png" alt="Стрелка влево" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="next-button"
                        disabled={selected_review_id === reviews[reviews.length - 1]?.id}
                    >
                        <img src="/arrow-right.png" alt="Стрелка вправо" />
                    </button>

                    <div className='scrolls'>
                        {getVisibleDots().map((i) => (
                            <div
                                key={i}
                                onClick={() => scrollToPage(i)}
                                className={`indicator-dot ${i === currentPage ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                </>
            ) : (
                // ДЕСКТОПНАЯ ВЕРСИЯ
                <>
                    <div className="reviews-grid">
                        {getCurrentReviews().map(({id, photo, rating}, index) => (
                            <FadeInSection 
                                key={`${currentPage}-${id}`}
                                animation={index % 2 === 0 ? "fade-left" : "fade-right"} 
                                delay={`delay-${(index + 1) * 100}`}
                                threshold={0.2}
                            >
                                <div className="reviews-card">
                                    <div className="stars">
                                        {[...Array(5)].map((_, i) => (
                                            <img
                                                key={i}
                                                src={i < rating ? "/icons/StarFilled.png" : "/icons/StarOutlined.png"}
                                                alt="Звезда"
                                                className="star-icon"
                                            />
                                        ))}
                                    </div>
                                    <div>
                                        <p className="reviews-text">
                                            {t(`review-cards.${id}.text`)}
                                        </p>
                                    </div>
                                    <div className='user-card'>
                                        <div className="user-avatar">
                                            {t(`review-cards.${id}.name`).charAt(0)}
                                        </div>
                                        <div className='user_info'>
                                            <span className='user_name'>{t(`review-cards.${String(id)}.name`)}</span>
                                            <span className="user_role">{t(`review-cards.${id}.position`)}</span>
                                        </div>
                                    </div>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                    
                    {Math.ceil(reviews.length / 4) > 1 && (
                        <div className="reviews-pagination">
                            <button 
                                className="reviews-nav-btn"
                                onClick={handlePrev}
                                disabled={currentPage === 0}
                            >
                                <img src="/arrow-left.png" alt="Предыдущая страница" />
                            </button>
                            
                            <div className="reviews-page-indicators">
                                {getVisibleDots().map((index) => (
                                    <button
                                        key={index}
                                        className={`reviews-page-dot ${index === currentPage ? 'active' : ''}`}
                                        onClick={() => scrollToPage(index)}
                                    />
                                ))}
                            </div>
                            
                            <button 
                                className="reviews-nav-btn"
                                onClick={handleNext}
                                disabled={currentPage === Math.ceil(reviews.length / 4) - 1}
                            >
                                <img src="/arrow-right.png" alt="Следующая страница" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
})