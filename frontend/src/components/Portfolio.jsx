import './css/portfolio.css';
import { forwardRef, useState } from 'react';
import { works, categoryKeys } from '../data/portfolio';
import { useTranslation } from 'react-i18next';
import PortfolioModal from './PortfolioModal';
import ReactDOM from 'react-dom';

export const Portfolio = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [selectedWork, setSelectedWork] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(categoryKeys[0]);

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
        {works.map((work) => {
          const translated = t(`works.${work.id}`, { returnObjects: true });
          const showAll = currentCategory === categoryKeys[0]; // "category.all"
          const matchesCategory = currentCategory === work.categoryKey;

          if (showAll || matchesCategory) {
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
                </div>
                <div className="works-overlay">
                  <span className="works-view-text">{t('portfolio-view-project')}</span>
                </div>
              </div>
            );
          }

          return null;
        })}
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
