import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './css/portfolioModal.css';

export default function PortfolioModal({ work, onClose }) {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Блокируем скролл для всех устройств
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    
    // Анимация появления
    setTimeout(() => setIsVisible(true), 50);

    // Обработчик клавиши Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    return () => {
      // Восстанавливаем скролл
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

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

  // Уникальная статистика для каждого проекта
  const getProjectStats = (workId) => {
    const statsMap = {
      1: { users: "15,000+", rating: 4.9, completion: "100%", team: "4 разработчика" },
      2: { users: "8,500+", rating: 4.7, completion: "100%", team: "3 разработчика" },
      3: { users: "22,000+", rating: 4.8, completion: "100%", team: "5 разработчиков" },
      4: { users: "3,200+", rating: 4.6, completion: "100%", team: "2 разработчика" },
      5: { users: "45,000+", rating: 4.9, completion: "100%", team: "6 разработчиков" },
      6: { users: "12,000+", rating: 4.7, completion: "100%", team: "3 разработчика" },
      7: { users: "28,000+", rating: 4.8, completion: "100%", team: "4 разработчика" },
      8: { users: "5,500+", rating: 4.5, completion: "100%", team: "2 разработчика" },
      9: { users: "18,000+", rating: 4.6, completion: "100%", team: "3 разработчика" }
    };
    return statsMap[workId] || { users: "5,000+", rating: 4.8, completion: "100%", team: "3 разработчика" };
  };

  const projectStats = work.stats || getProjectStats(work.id) || { users: "5,000+", rating: 4.8, completion: "100%", team: "3 разработчика" };

  // Функции для кнопок
  const handleVisitProject = () => {
    if (work.websiteUrl) {
      window.open(work.websiteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: t(`works.${work.id}.title`),
      text: t(`works.${work.id}.description`),
      url: work.websiteUrl || window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback для браузеров без поддержки Web Share API
        await navigator.clipboard.writeText(shareData.url);
        alert('Ссылка скопирована в буфер обмена!');
      }
    } catch (error) {
      console.error('Ошибка при попытке поделиться:', error);
      // Fallback - копируем URL в буфер обмена
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert('Ссылка скопирована в буфер обмена!');
      } catch (clipboardError) {
        console.error('Ошибка копирования в буфер обмена:', clipboardError);
      }
    }
  };

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('Closing modal...'); // Для отладки
    onClose();
  };

  return (
    <div className={`portfolio-modal-overlay ${isVisible ? 'visible' : ''}`} onClick={handleClose}>
      <div className={`portfolio-modal-content ${isVisible ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button 
          className="portfolio-modal-close" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked!');
            onClose();
          }}
          type="button"
          aria-label="Закрыть модальное окно"
        >
          <span className="close-icon">×</span>
        </button>
        
        <div className="portfolio-modal-header">
          <div className="header-content">
            <h2 className="portfolio-modal-title">{t(`works.${work.id}.title`, { defaultValue: work.title || '' })}</h2>
            <span className="portfolio-modal-category">{t(work.categoryKey)}</span>
            <div className="project-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`star ${i < Math.floor(projectStats.rating) ? 'filled' : ''}`}>★</span>
                ))}
              </div>
              <span className="rating-text">{projectStats.rating}/5</span>
            </div>
          </div>
        </div>


        {/* Статистика проекта */}
        <div className="project-stats">
          <div className="stat-item">
            <div className="stat-icon">👤</div>
            <div className="stat-content">
              <span className="stat-number">{projectStats.users}</span>
              <span className="stat-label">Пользователей</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <span className="stat-number">{projectStats.rating}</span>
              <span className="stat-label">Рейтинг</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <span className="stat-number">{projectStats.completion}</span>
              <span className="stat-label">Готовность</span>
            </div>
          </div>
        </div>

        {/* Табы навигации */}
        <div className="modal-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Обзор
          </button>
          <button 
            className={`tab-button ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Галерея
          </button>
          <button 
            className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Детали
          </button>
        </div>

        {/* Контент табов */}
        <div className="modal-tab-content">
          {activeTab === 'overview' && (
            <div className="tab-panel overview-panel">
              <div className="project-description">
                <h3>Описание проекта</h3>
                <p>{work.description || t(`works.${work.id}.description`, { defaultValue: '' })}</p>
              </div>
              
              <div className="project-features">
                <h3>Ключевые особенности</h3>
                <ul>
                  {(work.features || []).map((f, i) => (
                    <li key={i}>{typeof f === 'string' ? f : (f.text || '')}</li>
                  ))}
                </ul>
              </div>

              <div className="action-buttons">
                {work.websiteUrl && (
                  <button 
                    className="action-btn primary"
                    onClick={handleVisitProject}
                  >
                    <span>Посетить проект</span>
                    <span className="btn-icon">→</span>
                  </button>
                )}
                <button 
                  className="action-btn secondary"
                  onClick={handleShare}
                >
                  <span>Поделиться</span>
                  <span className="btn-icon">📤</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="tab-panel gallery-panel">
              <div className="portfolio-modal-gallery">
                <div className="portfolio-modal-image-container">
                  <img 
                    src={work.photos ? work.photos[currentImageIndex] : work.photo} 
                    alt={t(`works.${work.id}.title`)}
                    className="portfolio-modal-image"
                  />
                  {work.photos && work.photos.length > 1 && (
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
                {work.photos && work.photos.length > 1 && (
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
            </div>
          )}


          {activeTab === 'details' && (
            <div className="tab-panel details-panel">
              <div className="project-details">
                <div className="detail-section">
                  <h3>Информация о проекте</h3>
                  <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Клиент</span>
                  <span className="detail-value">{work.client || t(`works.${work.id}.client`, { defaultValue: '' })}</span>
                </div>
                    <div className="detail-item">
                      <span className="detail-label">Длительность</span>
                  <span className="detail-value">{work.duration || t(`works.${work.id}.duration`, { defaultValue: '' })}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Команда</span>
                      <span className="detail-value">{projectStats.team}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Статус</span>
                      <span className="detail-value status-completed">Завершен</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Технологии</h3>
                  <div className="technologies-grid">
                    {work.technologies.map((tech, index) => (
                      <div key={index} className="tech-item">
                        <span className="tech-name">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}