import './css/reviews.css';
import { forwardRef, useState } from 'react';
import { reviews } from '../data/reviews';
import { useTranslation } from 'react-i18next';
import FadeInSection from './FadeInSections';
export const Reviews = forwardRef((props, ref) => {
    const {t} = useTranslation();
    const [currentPage, setCurrentPage] = useState(0);
    const reviewsPerPage = 4;
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    
    const getCurrentReviews = () => {
        const startIndex = currentPage * reviewsPerPage;
        return reviews.slice(startIndex, startIndex + reviewsPerPage);
    };
    return (
        <div ref={ref} className="reviews-container">
            <h3 className="reviews-title">{t('reviews-title')}</h3>
            <div className="reviews-grid">
                {getCurrentReviews().map(({id, photo, rating}, index) => (
                    <FadeInSection 
                        key={`${id}-${currentPage}`}
                        animation={index % 2 === 0 ? "fade-left" : "fade-right"} 
                        delay={`delay-${(index + 1) * 100}`}
                        threshold={0.2}
                    >
                        <div className="reviews-card">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <img
                                        key={i}
                                        src={i < rating ? "/icons/starFilled.png" : "/icons/starOutlined.png"}
                                        alt="Звезда"
                                        className="star-icon"
                                    />
                                ))}
                            </div>
                            <p className='reviews-text'>{t(`review-cards.${id}.text`)}</p>
                            <div className='user-card'>
                                <img src={photo} alt={t(`review-cards.${id}.name`)} />
                                <div className='user_info'>
                                    <span className='user_name'>{t(`review-cards.${String(id)}.name`)}</span>
                                    <span className="user_role">{t(`review-cards.${id}.position`)}</span>
                                </div>
                            </div>
                        </div>
                    </FadeInSection>
                ))}
            </div>
            
            {totalPages > 1 && (
                <div className="reviews-pagination">
                    <button 
                        className="reviews-nav-btn"
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                    >
                        <img src="/arrow-left.png" alt="Предыдущая страница" />
                    </button>
                    
                    <div className="reviews-page-indicators">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                className={`reviews-page-dot ${index === currentPage ? 'active' : ''}`}
                                onClick={() => setCurrentPage(index)}
                            />
                        ))}
                    </div>
                    
                    <button 
                        className="reviews-nav-btn"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={currentPage === totalPages - 1}
                    >
                        <img src="/arrow-right.png" alt="Следующая страница" />
                    </button>
                </div>
            )}
        </div>
    )
})