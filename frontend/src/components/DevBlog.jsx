import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { devblogPosts } from '../data/devblog';
import FadeInSection from './FadeInSections';
import './css/devblog.css';

export const DevBlog = forwardRef(function DevBlog(_props, ref) {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const posts = useMemo(() => devblogPosts, []);
  const showCarousel = posts.length > 3;
  const slidesToShow = 3;
  const totalSlides = Math.ceil(posts.length / slidesToShow);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, totalSlides]);

  useEffect(() => {
    if (!isAutoPlay || !showCarousel) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, showCarousel, nextSlide]);

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleArticleClick = (post) => {
    // Open article in new tab
    const articleUrl = `/article/${post.id}`;
    window.open(articleUrl, '_blank', 'noopener,noreferrer');
  };

  const getVisiblePosts = () => {
    if (!showCarousel) return posts;
    const start = currentSlide * slidesToShow;
    return posts.slice(start, start + slidesToShow);
  };

  return (
    <section ref={ref} className="devblog-section">
      <div className="devblog-header">
        <h2 className="devblog-title">{t('devblog-title', 'ДЕВБЛОГ')}</h2>
        <p className="devblog-subtitle">{t('devblog-subtitle', 'Наши заметки о разработке, архитектуре и дизайне')}</p>
      </div>

      <div className="devblog-container">
        {showCarousel && (
          <div className="devblog-carousel-controls">
            <button 
              className="devblog-nav-btn prev" 
              onClick={prevSlide}
              disabled={isTransitioning}
              aria-label="Previous articles"
            >
              ‹
            </button>
            <button 
              className="devblog-nav-btn next" 
              onClick={nextSlide}
              disabled={isTransitioning}
              aria-label="Next articles"
            >
              ›
            </button>
          </div>
        )}

        <div className={`devblog-grid ${showCarousel ? 'carousel' : ''}`}>
          {getVisiblePosts().map((post, index) => (
            <FadeInSection key={`${post.id}-${currentSlide}`} animation={index % 2 === 0 ? 'fade-up' : 'fade-right'} delay={index % 3 === 0 ? 'delay-200' : 'delay-100'}>
              <article className={`devblog-card ${isTransitioning ? 'transitioning' : ''}`} onClick={() => handleArticleClick(post)}>
                <div className="devblog-card-media">
                  <img src={post.cover} alt={post.title} loading="lazy" />
                  <div className="devblog-chip">{post.tag}</div>
                </div>
                <div className="devblog-card-body">
                  <h3 className="devblog-card-title">{post.title}</h3>
                  <p className="devblog-card-excerpt">{post.excerpt}</p>
                  <div className="devblog-card-meta">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <button className="devblog-read-btn" type="button">
                    {t('devblog-read', 'Читать')}
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </article>
            </FadeInSection>
          ))}
        </div>

        {showCarousel && (
          <div className="devblog-dots">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`devblog-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
});


