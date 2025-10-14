import { useState, useEffect } from 'react';
import './css/portfolioModal.css';
import { useTranslation } from 'react-i18next';

export default function PortfolioModal({ work, onClose }) {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Блокируем скролл для всех устройств
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    
    return () => {
      // Восстанавливаем скролл
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    };
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === work.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? work.photos.length - 1 : prev - 1
    );
  };

  return (
    <div className="portfolio-modal-overlay" onClick={onClose}>
      <div className="portfolio-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="portfolio-modal-close" onClick={onClose}>
          &times;
        </button>
        
        <div className="portfolio-modal-header">
          <h2 className="portfolio-modal-title">{t(`works.${work.id}.title`)}</h2>
          <span className="portfolio-modal-category">{t(work.categoryKey)}</span>
        </div>

        <div className="portfolio-modal-media">
          {/* Для веб-проектов: заставка и видео */}
          {work.categoryKey === "category.web-development" && (
            <>
              {/* Заставка проекта */}
              {work.photo && (
                <div className="portfolio-modal-cover">
                  <img 
                    src={work.photo} 
                    alt={t(`works.${work.id}.title`)}
                    className="portfolio-modal-cover-image"
                  />
                </div>
              )}

              {/* Видео проекта */}
              {work.video && (
                <div className="portfolio-modal-video">
                  <h4>{t('portfolio-project-demo')}</h4>
                  <video 
                    controls 
                    className="portfolio-modal-video-player"
                    preload="metadata"
                  >
                    <source src={work.video} type="video/mp4" />
                    <p>{t('portfolio-video-not-supported')} <a href={work.video}>{t('portfolio-download-video')}</a></p>
                  </video>
                </div>
              )}
            </>
          )}

          {/* Для мобильных приложений и телеграм ботов: галерея скриншотов */}
          {(work.categoryKey === "category.mobile-apps" || work.categoryKey === "category.telegram-bots") && work.photos && work.photos.length > 0 && (
            <div className="portfolio-modal-gallery">
              <div className="portfolio-modal-image-container">
                <img 
                  src={work.photos[currentImageIndex]} 
                  alt={t(`works.${work.id}.title`)}
                  className="portfolio-modal-image"
                />
                {work.photos.length > 1 && (
                  <>
                    <button className="portfolio-modal-nav prev" onClick={prevImage}>
                      &#8249;
                    </button>
                    <button className="portfolio-modal-nav next" onClick={nextImage}>
                      &#8250;
                    </button>
                  </>
                )}
              </div>
              {work.photos.length > 1 && (
                <div className="portfolio-modal-thumbnails">
                  {work.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`${t(`works.${work.id}.title`)} ${index + 1}`}
                      className={`portfolio-modal-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="portfolio-modal-info">
          <div className="portfolio-modal-description">
            <h3>{t('portfolio-project-description')}</h3>
            <p>{t(`works.${work.id}.description`)}</p>
          </div>

          <div className="portfolio-modal-details">
            <div className="portfolio-modal-detail">
              <strong>{t('portfolio-client')}</strong>
              <span>{t(`works.${work.id}.client`)}</span>
            </div>
            <div className="portfolio-modal-detail">
              <strong>{t('portfolio-duration')}</strong>
              <span>{t(`works.${work.id}.duration`)}</span>
            </div>
            <div className="portfolio-modal-detail">
              <strong>{t('portfolio-technologies')}</strong>
              <div className="portfolio-modal-technologies">
                {work.technologies.map((tech, index) => (
                  <span key={index} className="portfolio-modal-tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}