import { forwardRef, useEffect, useState } from 'react';
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Фильтруем работы по категории
  const filteredWorks = works.filter(work => {
    const showAll = currentCategory === categoryKeys[0];
    return showAll || currentCategory === work.categoryKey;
  });

  // Пагинация для мобильных
  const worksPerPage = isMobile ? 1 : filteredWorks.length;
  const totalPages = Math.ceil(filteredWorks.length / worksPerPage);
  
  const getCurrentWorks = () => {
    if (!isMobile) return filteredWorks;
    const startIndex = currentPage * worksPerPage;
    return filteredWorks.slice(startIndex, startIndex + worksPerPage);
  };

  // Сброс страницы при смене категории
  useEffect(() => {
    setCurrentPage(0);
  }, [currentCategory]);
  
  // Плавное обновление при изменении страницы
  useEffect(() => {
    // Принудительное обновление для предотвращения моргания
    if (isMobile) {
      const worksGrid = document.querySelector('.works-grid');
      if (worksGrid) {
        worksGrid.style.opacity = '0.8';
        setTimeout(() => {
          worksGrid.style.opacity = '1';
        }, 50);
      }
    }
  }, [currentPage, currentCategory, isMobile]);

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

  return (
    <div ref={ref} className="portfolio-container">
      <span className="portfolio-title">{t('portfolio-title')}</span>

      <div className="category-bar">
        {categoryKeys.map((categoryKey, index) => (
          <button
            key={index}
            onClick={() => setCurrentCategory(categoryKey)}
            className={`category-item ${currentCategory === categoryKey ? 'selected' : ''}`}
          >
            {t(categoryKey)}
          </button>
        ))}
      </div>

      <div className="works-grid">
        {getCurrentWorks().map((work) => {
          const translated = t(`works.${work.id}`, { returnObjects: true });
          return (
            <div 
              key={work.id} 
              className="works-card"
              onClick={() => setSelectedWork(work)}
            >
              <img src={work.photo} alt="Проект в портфолио" />
              <div className="works-description">
                <span className="works-name">{translated.name}</span>
                <span className="works-category">{t(work.categoryKey)}</span>
                {isMobile && (
                  <button 
                    className="works-details-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWork(work);
                    }}
                  >
                    {t('portfolio-view-project')}
                  </button>
                )}
              </div>
              <div className="works-overlay">
                <span className="works-view-text">{t('portfolio-view-project')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Пагинация для мобильных */}
      {isMobile && totalPages > 1 && (
        <div className="portfolio-pagination">
          <button 
            className="portfolio-nav-btn"
            onClick={() => {
              const newPage = Math.max(0, currentPage - 1);
              setCurrentPage(newPage);
            }}
            disabled={currentPage === 0}
          >
            <img src="/arrow-left.png" alt="Предыдущая страница" />
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
            <img src="/arrow-right.png" alt="Следующая страница" />
          </button>
        </div>
      )}
      
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
