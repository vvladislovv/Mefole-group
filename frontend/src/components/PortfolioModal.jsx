import { useState, useEffect } from 'react';
import './css/portfolioModal.css';
import { useTranslation } from 'react-i18next';

export default function PortfolioModal({ work, onClose }) {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
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
          <h2 className="portfolio-modal-title">{t(work.title)}</h2>
          <span className="portfolio-modal-category">{work.category}</span>
        </div>

        <div className="portfolio-modal-media">
          {work.photos && work.photos.length > 0 && (
            <div className="portfolio-modal-gallery">
              <div className="portfolio-modal-image-container">
                <img 
                  src={work.photos[currentImageIndex]} 
                  alt={t(work.title)}
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
                      alt={`${t(work.title)} ${index + 1}`}
                      className={`portfolio-modal-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {work.video && (
            <div className="portfolio-modal-video">
              <video controls className="portfolio-modal-video-player">
                <source src={work.video} type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
            </div>
          )}
        </div>

        <div className="portfolio-modal-info">
          <div className="portfolio-modal-description">
            <h3>{t('portfolio-project-description')}</h3>
            <p>{t(work.description)}</p>
          </div>

          <div className="portfolio-modal-details">
            <div className="portfolio-modal-detail">
              <strong>{t('portfolio-client')}</strong>
              <span>{t(work.client)}</span>
            </div>
            <div className="portfolio-modal-detail">
              <strong>{t('portfolio-duration')}</strong>
              <span>{t(work.duration)}</span>
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