import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { reviews } from '../data/reviews'
import './css/reviews.css'

export const Reviews = React.memo(forwardRef((props, ref) => {
    const {t} = useTranslation();
    const scrollRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const [selected_review_id, select_review_id] = useState(reviews[0]?.id ?? null);
    const [currentPage, setCurrentPage] = useState(0);
    const cardsPerPage = 1;
    const reviewsPerPage = 4; // Максимум 4 отзыва на страницу
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const maxDots = 3;

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Простая функция скролла
    const scrollToCard = useCallback((cardIndex) => {
        const container = scrollRef.current;
        const cards = container?.querySelectorAll(".reviews-card");
        const card = cards?.[cardIndex];
        
        if (card && container) {
            const containerRect = container.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const offset = cardRect.left - containerRect.left - (container.offsetWidth / 2) + (card.offsetWidth / 2);
            
            container.scrollTo({
                left: container.scrollLeft + offset,
                behavior: "smooth"
            });
        }
    }, []);

    const scrollToPage = useCallback((pageIndex) => {
        const targetIndex = pageIndex * cardsPerPage;
        setCurrentPage(pageIndex);
        scrollToCard(targetIndex);
    }, [cardsPerPage, scrollToCard]);

    // Простые кнопки навигации
    const handlePrev = useCallback(() => {
        if (isMobile) {
            setCurrentPage(prev => Math.max(0, prev - 1));
        } else {
            setCurrentPage(prev => Math.max(0, prev - 1));
        }
    }, [isMobile]);

    const handleNext = useCallback(() => {
        if (isMobile) {
            setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
        } else {
            setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
        }
    }, [isMobile, totalPages]);

    // Логика для получения отзывов
    const getCurrentReviews = useMemo(() => {
        const startIndex = currentPage * reviewsPerPage;
        return reviews.slice(startIndex, startIndex + reviewsPerPage);
    }, [currentPage, reviewsPerPage]);

    const getVisibleDots = useMemo(() => {
        if (totalPages <= maxDots) {
            return Array.from({ length: totalPages }, (_, i) => i);
        }
        
        if (currentPage <= 1) {
            return [0, 1, 2];
        }
        
        if (currentPage >= totalPages - 2) {
            return [totalPages - 3, totalPages - 2, totalPages - 1];
        }
        
        return [currentPage - 1, currentPage, currentPage + 1];
    }, [totalPages, maxDots, currentPage]);
    return (
        <div ref={ref} className="reviews-container">
            <h3 className="reviews-title">{t('reviews-title')}</h3>
            
            <div className="reviews-grid">
                {getCurrentReviews.map(({id, photo, rating}, index) => (
                    <div key={`${currentPage}-${id}`} className="reviews-card">
                        <div className="review-content">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                <img
                                    key={i}
                                    src={i < rating ? "/icons/StarFilled.png" : "/icons/StarOutlined.png"}
                                    alt={t('star')}
                                    className="star-icon"
                                    loading="lazy"
                                    decoding="async"
                                />
                                ))}
                            </div>
                            <p className="reviews-text">
                                {t(`review-cards.${id}.text`)}
                            </p>
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
                    </div>
                ))}
            </div>
            
            {totalPages > 1 && (
                <div className="reviews-pagination">
                    <button 
                        className="reviews-nav-btn"
                        onClick={handlePrev}
                        disabled={currentPage === 0}
                    >
                        <img src="/arrow-left.png" alt={t('previous-page')} loading="lazy" />
                    </button>
                    
                    <div className="reviews-page-indicators">
                        {getVisibleDots.map((index) => (
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
                        disabled={currentPage === totalPages - 1}
                    >
                        <img src="/arrow-right.png" alt={t('next-page')} loading="lazy" />
                    </button>
                </div>
            )}
        </div>
    )
}));