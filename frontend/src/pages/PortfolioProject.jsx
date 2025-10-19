import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { SEOHelmet } from '../components/SEOHelmet';
import './css/legal-pages.css';

const PortfolioProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Данные проектов (в реальном приложении это будет API запрос)
  const projectsData = useMemo(() => ({
    1: {
      id: 1,
      title: "E-commerce Platform",
      description: "Modern e-commerce solution with advanced features",
      category: "Web Development",
      technologies: ["React", "Node.js", "MongoDB"],
      image: "/portfolio/images/web-development/covers/ecommerce.jpg",
      websiteUrl: "https://example-ecommerce.com"
    },
    2: {
      id: 2,
      title: "Mobile Banking App",
      description: "Secure mobile banking application for iOS and Android",
      category: "Mobile Apps",
      technologies: ["React Native", "Node.js", "PostgreSQL"],
      image: "/portfolio/images/mobile-apps/covers/banking.jpg",
      websiteUrl: "https://example-banking.com"
    },
    // Добавьте больше проектов по необходимости
  }), []);

  useEffect(() => {
    // Прокрутка к началу страницы
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    // Симуляция загрузки данных
    const timer = setTimeout(() => {
      const projectData = projectsData[id];
      if (projectData) {
        setProject(projectData);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id, projectsData]);

  const handleBack = () => {
    navigate('/');
  };

  const handleVisitProject = () => {
    if (project?.websiteUrl) {
      window.open(project.websiteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="legal-page-container">
        <div className="legal-page-content">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div style={{ fontSize: '24px', color: 'var(--color-green)' }}>Загрузка...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="legal-page-container">
        <div className="legal-page-content">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1 style={{ color: 'var(--color-green)', marginBottom: '20px' }}>Проект не найден</h1>
            <p style={{ marginBottom: '30px' }}>Запрашиваемый проект не существует или был удален.</p>
            <button onClick={handleBack} className="back-button">
              ← Вернуться на главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="legal-page-container">
      <SEOHelmet 
        title={`${project.title} - Портфолио - ${t('brand-name')}`}
        description={project.description}
      />
      
      <button onClick={handleBack} className="back-button">
        ← Назад на главную
      </button>
      
      <div className="legal-page-content">
        <div className="legal-page-header">
          <h1 className="legal-page-title">{project.title}</h1>
          <p className="legal-page-subtitle">{project.category}</p>
        </div>

        <div className="legal-page-body">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <img 
              src={project.image} 
              alt={project.title}
              style={{
                width: '100%',
                maxWidth: '600px',
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
            />
          </div>

          <section className="legal-section">
            <h2>Описание проекта</h2>
            <p>{project.description}</p>
          </section>

          <section className="legal-section">
            <h2>Технологии</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {project.technologies.map((tech, index) => (
                <span 
                  key={index}
                  style={{
                    background: 'var(--gradient-primary)',
                    color: '#000',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {project.websiteUrl && (
            <section className="legal-section">
              <h2>Ссылки</h2>
              <button 
                onClick={handleVisitProject}
                style={{
                  background: 'var(--gradient-primary)',
                  color: '#000',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Посетить проект →
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioProject;

