import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './css/portfolioModal.css';

const PortfolioModal = React.memo(function PortfolioModal({ work, onClose }) {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('Closing modal...'); // Для отладки
    onClose();
  }, [onClose]);

  useEffect(() => {
    // Сохраняем текущую позицию скролла
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    
    // Анимация появления
    const timeoutId = setTimeout(() => setIsVisible(true), 50);

    // Обработчик клавиши Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    return () => {
      // Очищаем таймер
      clearTimeout(timeoutId);
      // Восстанавливаем скролл и позицию
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
      window.scrollTo(0, scrollY);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleClose]); // Добавляем handleClose в зависимости

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => 
      prev === work.photos.length - 1 ? 0 : prev + 1
    );
  }, [work.photos.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? work.photos.length - 1 : prev - 1
    );
  }, [work.photos.length]);

  // Уникальная статистика для каждого проекта
  const getProjectStats = (workId) => {
    const statsMap = {
      // Web Development Projects
      1: { users: "15,000+", rating: 4.9, teamSize: 4 },
      2: { users: "8,500+", rating: 4.7, teamSize: 3 },
      3: { users: "22,000+", rating: 4.8, teamSize: 5 },
      4: { users: "3,200+", rating: 4.6, teamSize: 2 },
      5: { users: "45,000+", rating: 4.9, teamSize: 6 },
      6: { users: "12,000+", rating: 4.7, teamSize: 3 },
      7: { users: "28,000+", rating: 4.8, teamSize: 4 },
      8: { users: "5,500+", rating: 4.5, teamSize: 2 },
      9: { users: "18,000+", rating: 4.6, teamSize: 3 },
      // Mobile Apps
      24: { downloads: "85k", rating: 4.8, users: "12,500+", teamSize: 3 },
      25: { downloads: "42k", rating: 4.6, users: "8,200+", teamSize: 2 },
      26: { downloads: "156k", rating: 4.7, users: "28,000+", teamSize: 4 },
      27: { downloads: "73k", rating: 4.5, users: "15,600+", teamSize: 3 },
      28: { downloads: "234k", rating: 4.9, users: "45,000+", teamSize: 5 },
      29: { downloads: "67k", rating: 4.4, users: "9,800+", teamSize: 3 },
      30: { downloads: "189k", rating: 4.6, users: "32,000+", teamSize: 4 },
      31: { downloads: "312k", rating: 4.8, users: "58,000+", teamSize: 6 },
      33: { downloads: "28k", rating: 4.3, users: "5,200+", teamSize: 2 },
      34: { downloads: "15k", rating: 4.2, users: "3,100+", teamSize: 2 }
    };
    return statsMap[workId] || { users: "5,000+", rating: 4.8, teamSize: 3 };
  };

  const projectStats = work.stats || getProjectStats(work.id) || { users: "5,000+", rating: 4.8, teamSize: 3 };

  // Функции для кнопок
  const handleVisitProject = useCallback(() => {
    if (work.websiteUrl) {
      window.open(work.websiteUrl, '_blank', 'noopener,noreferrer');
    }
  }, [work.websiteUrl]);

  const handleShare = useCallback(async () => {
    // Создаем ссылку на проект с доменом hacktaika.ru
    const projectUrl = `https://hacktaika.ru/portfolio/${work.id}`;
    const shareData = {
      title: t(`works.${work.id}.title`),
      text: t(`works.${work.id}.description`),
      url: projectUrl
    };

    // Функция для копирования в буфер обмена с fallback
    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        alert(t('portfolio-share-copied'));
      } catch (clipboardError) {
        console.error('Clipboard copy failed:', clipboardError);
        // Fallback - используем старый метод
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          alert(t('portfolio-share-copied'));
        } catch (execError) {
          console.error('ExecCommand copy failed:', execError);
          alert('Не удалось скопировать ссылку. Скопируйте вручную: ' + text);
        }
        document.body.removeChild(textArea);
      }
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback для браузеров без поддержки Web Share API
        await copyToClipboard(projectUrl);
      }
    } catch (error) {
      // Игнорируем ошибку отмены пользователем
      if (error.name === 'AbortError') {
        return; // Пользователь отменил, ничего не делаем
      }
      console.error('Share failed:', error);
      // Fallback - копируем URL в буфер обмена
      await copyToClipboard(projectUrl);
    }
  }, [work.id, t]);


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
          aria-label={t('close')}
        >
          <span className="close-icon">×</span>
        </button>
        
        <div className="portfolio-modal-header">
          <div className="header-top">
            <h2 className="portfolio-modal-title">{t(`works.${work.id}.title`, { defaultValue: work.title || '' })}</h2>
            <div className="project-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`star ${i < Math.floor(projectStats.rating) ? 'filled' : ''}`}>⭐</span>
                ))}
              </div>
              <span className="rating-text">{projectStats.rating}/5</span>
            </div>
          </div>
          <span className="portfolio-modal-category">{t(work.categoryKey)}</span>
        </div>


        {/* Project stats */}
        <div className="project-stats">
          <div className="stat-item">
            <div className="stat-icon">🚀</div>
            <div className="stat-content">
              <span className="stat-number">
                {work.categoryKey === 'category.mobile-apps' ? projectStats.downloads : projectStats.users}
              </span>
              <span className="stat-label">
                {work.categoryKey === 'category.mobile-apps' ? t('portfolio-downloads') : t('portfolio-users')}
              </span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">💎</div>
            <div className="stat-content">
              <span className="stat-number">{projectStats.rating}</span>
              <span className="stat-label">{t('portfolio-rating')}</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <span className="stat-number">{projectStats.teamSize}</span>
              <span className="stat-label">{t('portfolio-team')}</span>
            </div>
          </div>
        </div>

        {/* Табы навигации */}
        <div className="modal-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            {t('portfolio-tab-overview')}
          </button>
          <button 
            className={`tab-button ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            {t('portfolio-tab-gallery')}
          </button>
          <button 
            className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            {t('portfolio-tab-details')}
          </button>
        </div>

        {/* Контент табов */}
        <div className="modal-tab-content">
          {activeTab === 'overview' && (
            <div className="tab-panel overview-panel">
              <div className="project-description">
                <h3>{t('portfolio-project-description')}</h3>
                <p>{t(`works.${work.id}.description`, { defaultValue: work.description || '' })}</p>
              </div>
              
              <div className="project-features">
                <h3>{t('portfolio-key-features')}</h3>
                <ul>
                  {(work.features || []).map((f, i) => (
                    <li key={i}>{t(`works.${work.id}.features.${i}`, { defaultValue: typeof f === 'string' ? f : (f.text || '') })}</li>
                  ))}
                </ul>
              </div>

              <div className="action-buttons">
                {work.websiteUrl && (
                  <button 
                    className="action-btn primary"
                    onClick={handleVisitProject}
                  >
                    <span>{t('portfolio-visit-project')}</span>
                    <span className="btn-icon">→</span>
                  </button>
                )}
                <button 
                  className="action-btn secondary"
                  onClick={handleShare}
                  title={t('portfolio-share-text')}
                >
                  <span>{t('portfolio-share')}</span>
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
                    loading="lazy"
                    decoding="async"
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
                        loading="lazy"
                        decoding="async"
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
                  <h3>{t('portfolio-project-info')}</h3>
                  <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">{t('portfolio-client')}</span>
                  <span className="detail-value">{work.client || t(`works.${work.id}.client`, { defaultValue: '' })}</span>
                </div>
                    <div className="detail-item">
                      <span className="detail-label">{t('portfolio-duration')}</span>
                  <span className="detail-value">{t(`works.${work.id}.duration`, { defaultValue: work.duration || '' })}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">{t('portfolio-team')}</span>
                      <span className="detail-value">{projectStats.team ? `${projectStats.team.split(' ')[0]} ${t('developers')}` : ''}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">{t('portfolio-status')}</span>
                      <span className="detail-value status-completed">{t('portfolio-status-completed')}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>{t('portfolio-technologies')}</h3>
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
});

export default PortfolioModal;