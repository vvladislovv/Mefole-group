import { forwardRef, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { categoryKeys, works } from '../data/portfolio';
import './css/portfolio.css';
import PortfolioModal from './PortfolioModal';

export const Portfolio = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [selectedWork, setSelectedWork] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(categoryKeys[0]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const containerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Intersection Observer для анимации появления
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Фильтруем работы по категории
  const filteredWorks = works.filter(work => {
    const showAll = currentCategory === categoryKeys[0];
    return showAll || currentCategory === work.categoryKey;
  });

  // Пагинация: на мобильных – 3 карточки, на остальных – 6 карточек на страницу
  const worksPerPage = isMobile ? 3 : 6;
  const totalPages = Math.ceil(filteredWorks.length / worksPerPage);
  
  const getCurrentWorks = () => {
    const startIndex = currentPage * worksPerPage;
    return filteredWorks.slice(startIndex, startIndex + worksPerPage);
  };

  // Сброс страницы при смене категории
  useEffect(() => {
    setCurrentPage(0);
  }, [currentCategory]);

  // Функция для отображения точек (максимум 3)
  const getVisibleDots = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }
    
    if (currentPage === 0) {
      return [0, 1, 2];
    } else if (currentPage === totalPages - 1) {
      return [totalPages - 3, totalPages - 2, totalPages - 1];
    } else {
      return [currentPage - 1, currentPage, currentPage + 1];
    }
  };

  const handleCategoryChange = (categoryKey) => {
    setCurrentCategory(categoryKey);
  };

  const handleCardHover = (cardId) => {
    setHoveredCard(cardId);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  return (
    <div ref={ref} className="portfolio-container" id="portfolio">
      <div ref={containerRef} className={`portfolio-content ${isVisible ? 'visible' : ''}`}>
        <div className="portfolio-header">
          <span className="portfolio-title">
            <span className="title-text">{t('portfolio-title')}</span>
          </span>
          <p className="portfolio-subtitle">
            {t('portfolio-subtitle')}
          </p>
        </div>

        <div className="category-bar">
          {categoryKeys.map((categoryKey, index) => (
            <button
              key={index}
              onClick={() => handleCategoryChange(categoryKey)}
              className={`category-item ${currentCategory === categoryKey ? 'selected' : ''}`}
            >
              <span className="category-text">{t(categoryKey)}</span>
              <div className="category-indicator"></div>
            </button>
          ))}
        </div>

        <div className="works-grid">
          {getCurrentWorks().map((work, index) => {
            const i18nData = t(`works.${work.id}`, { returnObjects: true });
            const hasI18nObj = typeof i18nData === 'object';
            const name = hasI18nObj ? i18nData.name : (work.name || '');
            const titleText = hasI18nObj ? i18nData.title : (work.title || '');
            const durationText = hasI18nObj ? i18nData.duration : (work.duration || '');
            const isHovered = hoveredCard === work.id;
            
            return (
              <div 
                key={work.id} 
                className={`works-card ${isHovered ? 'hovered' : ''}`}
                onClick={() => setSelectedWork(work)}
                onMouseEnter={() => handleCardHover(work.id)}
                onMouseLeave={handleCardLeave}
              >
                <div className="card-image-container">
                  <img src={work.photo} alt={t('portfolio-card-alt', { defaultValue: 'Portfolio project' })} />
                  <div className="card-badge">
                    <span className="badge-text">{t(work.categoryKey)}</span>
                  </div>
                </div>
                
                <div className="works-description">
                  <div className="description-header">
                    <span className="works-name">{name}</span>
                    <div className="works-stats">
                      <span className="stat-item">
                        <span className="stat-icon">⏰</span>
                        {durationText}
                      </span>
                    </div>
                  </div>
                  
                  <p className="works-title">{titleText}</p>
                  
                  <div className="technologies-preview">
                    {work.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span key={techIndex} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                    {work.technologies.length > 3 && (
                      <span className="tech-tag more">
                        +{work.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  
                  {work.websiteUrl ? (
                    <a
                      href={work.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="visit-website-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="btn-text">{t('portfolio-visit-site')}</span>
                    </a>
                  ) : (
                    <button 
                      className="visit-website-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWork(work);
                      }}
                    >
                      <span className="btn-text">{t('portfolio-visit-site')}</span>
                    </button>
                  )}
                  
                  <button 
                    className="works-details-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWork(work);
                    }}
                  >
                    <span>{t('portfolio-view-project')}</span>
                    <div className="btn-arrow">→</div>
                  </button>
                </div>
                
                
                <div className="card-glow"></div>
              </div>
            );
          })}
        </div>

        {/* Пагинация (мобильные и десктоп/планшет) */}
        {totalPages > 1 && (
          <div className="portfolio-pagination">
            <button 
              className="portfolio-nav-btn"
              onClick={() => {
                const newPage = Math.max(0, currentPage - 1);
                setCurrentPage(newPage);
              }}
              disabled={currentPage === 0}
            >
              <img src="/arrow-left.png" alt={t('portfolio-prev-page')} />
            </button>
            
            <div className="portfolio-page-indicators">
              {getVisibleDots().map((pageIndex) => (
                <button
                  key={pageIndex}
                  className={`portfolio-page-dot ${pageIndex === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageIndex)}
                />
              ))}
            </div>
            
            <button 
              className="portfolio-nav-btn"
              onClick={() => {
                const newPage = Math.min(totalPages - 1, currentPage + 1);
                setCurrentPage(newPage);
              }}
              disabled={currentPage === totalPages - 1}
            >
              <img src="/arrow-right.png" alt={t('portfolio-next-page')} />
            </button>
          </div>
        )}
      </div>
      
      {selectedWork && ReactDOM.createPortal(
        <PortfolioModal 
          work={selectedWork} 
          onClose={() => setSelectedWork(null)} 
        />,
        document.body
      )}
    </div>
  );
});
