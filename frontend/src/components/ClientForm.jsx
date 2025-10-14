import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../api/client';
import './css/ClientForm.css';

export default function ClientForm({ onClose }) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Состояние формы
  const [formData, setFormData] = useState({
    // Блок 1: О проекте
    projectType: '',
    projectTypeOther: '',
    projectDescription: '',
    targetAudience: '',
    
    // Блок 2: Технические требования
    platform: '',
    integrations: [],
    integrationsOther: '',
    designRequirements: '',
    designRequirementsOther: '',
    
    // Блок 3: Бюджет и сроки
    budget: '',
    timeline: '',
    priorityFeatures: [],
    priorityFeaturesOther: '',
    
    // Контактная информация
    name: '',
    email: '',
    phone: '',
    company: '',
    telegram: ''
  });

  // Ошибки валидации
  const [errors, setErrors] = useState({});

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

  const projectTypes = [
    'Веб-сайт',
    'Мобильное приложение', 
    'Telegram-бот',
    'E-commerce платформа',
    'Корпоративный портал',
    'Лендинг страница',
    'CRM система',
    'API разработка',
    'Парсер данных',
    'Другое'
  ];

  const platforms = [
    'Веб (браузер)',
    'iOS',
    'Android', 
    'Кроссплатформенное',
    'Desktop приложение',
    'Telegram Mini App',
    'Не знаю'
  ];

  const integrationOptions = [
    'Платежные системы',
    'CRM системы',
    'Email рассылки',
    'Социальные сети',
    'Аналитика (Google Analytics, Яндекс.Метрика)',
    'Базы данных',
    'API сторонних сервисов',
    'SMS уведомления',
    'Другое'
  ];

  const designRequirementsOptions = [
    'Современный минималистичный дизайн',
    'Корпоративный стиль',
    'Креативный/нестандартный дизайн',
    'Адаптивный дизайн для всех устройств',
    'Дизайн в стиле существующего бренда',
    'Другое'
  ];

  const budgetRanges = [
    'До 100,000 ₽',
    '100,000 - 300,000 ₽', 
    '300,000 - 500,000 ₽',
    '500,000 - 1,000,000 ₽',
    'Свыше 1,000,000 ₽',
    'Обсуждается'
  ];

  const timelineOptions = [
    'До 1 месяца',
    '1-3 месяца',
    '3-6 месяцев', 
    '6-12 месяцев',
    'Свыше года',
    'Обсуждается'
  ];

  const priorityFeaturesOptions = [
    'Быстрая загрузка',
    'Мобильная адаптация',
    'SEO оптимизация',
    'Безопасность',
    'Масштабируемость',
    'Интеграции',
    'Админ панель',
    'Другое'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.projectType) newErrors.projectType = 'Выберите тип проекта';
      if (formData.projectType === 'Другое' && !formData.projectTypeOther.trim()) {
        newErrors.projectTypeOther = 'Укажите тип проекта';
      }
      if (!formData.projectDescription.trim()) {
        newErrors.projectDescription = 'Опишите ваш проект';
      }
      if (formData.projectDescription.trim().length < 10) {
        newErrors.projectDescription = 'Минимум 10 символов';
      }
      if (!formData.targetAudience.trim()) {
        newErrors.targetAudience = 'Опишите целевую аудиторию';
      }
    } else if (step === 2) {
      if (!formData.platform) newErrors.platform = 'Выберите платформу';
      if (formData.integrations.length === 0) {
        newErrors.integrations = 'Выберите хотя бы одну интеграцию';
      }
      if (formData.integrations.includes('Другое') && !formData.integrationsOther.trim()) {
        newErrors.integrationsOther = 'Укажите интеграции';
      }
      if (!formData.designRequirements) newErrors.designRequirements = 'Выберите требования к дизайну';
      if (formData.designRequirements === 'Другое' && !formData.designRequirementsOther.trim()) {
        newErrors.designRequirementsOther = 'Укажите требования к дизайну';
      }
    } else if (step === 3) {
      if (!formData.budget) newErrors.budget = 'Выберите бюджет';
      if (!formData.timeline) newErrors.timeline = 'Выберите сроки';
      if (formData.priorityFeatures.length === 0) {
        newErrors.priorityFeatures = 'Выберите приоритетные функции';
      }
      if (formData.priorityFeatures.includes('Другое') && !formData.priorityFeaturesOther.trim()) {
        newErrors.priorityFeaturesOther = 'Укажите приоритетные функции';
      }
      if (!formData.name.trim()) newErrors.name = 'Введите ваше имя';
      if (!formData.email.trim()) newErrors.email = 'Введите email';
      if (!formData.phone.trim()) newErrors.phone = 'Введите телефон';
      
      // Валидация email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = 'Неправильный формат email';
      }
      
      // Валидация телефона
      const phoneRegex = /^[+]?[0-9\s\-()]{7,}$/;
      if (formData.phone && !phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Неправильный формат телефона';
      }
      
      // Валидация Telegram username
      if (formData.telegram && formData.telegram.trim()) {
        const telegramRegex = /^@?[a-zA-Z0-9_]{5,32}$/;
        if (!telegramRegex.test(formData.telegram.trim())) {
          newErrors.telegram = 'Неправильный формат Telegram username (например: @username или username)';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Формируем техническое задание из ответов
      const technicalTask = `
ТИП ПРОЕКТА: ${formData.projectType}${formData.projectTypeOther ? ` (${formData.projectTypeOther})` : ''}

ОПИСАНИЕ ПРОЕКТА:
${formData.projectDescription}

ЦЕЛЕВАЯ АУДИТОРИЯ:
${formData.targetAudience}

ПЛАТФОРМА: ${formData.platform}

ИНТЕГРАЦИИ:
${formData.integrations.join(', ')}${formData.integrationsOther ? ` (${formData.integrationsOther})` : ''}

ТРЕБОВАНИЯ К ДИЗАЙНУ:
${formData.designRequirements}${formData.designRequirementsOther ? ` (${formData.designRequirementsOther})` : ''}

БЮДЖЕТ: ${formData.budget}

СРОКИ: ${formData.timeline}

ПРИОРИТЕТНЫЕ ФУНКЦИИ:
${formData.priorityFeatures.join(', ')}${formData.priorityFeaturesOther ? ` (${formData.priorityFeaturesOther})` : ''}

КОМПАНИЯ: ${formData.company || 'Не указана'}
      `.trim();

      await apiClient.createTask({
        service_name: 'Консультация по проекту',
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone,
        client_telegram: formData.telegram || '',
        technical_task: technicalTask
      });

      setSuccessMessage('Заявка успешно отправлена! Мы свяжемся с вами в течение 24 часов.');
      
      // Очищаем форму
      setFormData({
        projectType: '',
        projectTypeOther: '',
        projectDescription: '',
        targetAudience: '',
        platform: '',
        integrations: [],
        integrationsOther: '',
        designRequirements: '',
        designRequirementsOther: '',
        budget: '',
        timeline: '',
        priorityFeatures: [],
        priorityFeaturesOther: '',
        name: '',
        email: '',
        phone: '',
        company: '',
        telegram: ''
      });
      
    } catch (error) {
      setErrorMessage(error.message || 'Произошла ошибка при отправке заявки');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="form-step">
      <h3 className="step-title">{t('blog-step1-title')}</h3>
      <p className="step-subtitle">{t('blog-step1-subtitle')}</p>
      
      <div className="form-group">
        <label className="form-label">{t('blog-project-type')} *</label>
        <select
          value={formData.projectType}
          onChange={(e) => handleInputChange('projectType', e.target.value)}
          className={`form-select ${errors.projectType ? 'error' : ''}`}
        >
          <option value="">{t('blog-select-placeholder')}</option>
          {projectTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.projectType && <span className="error-message">{errors.projectType}</span>}
      </div>

      {formData.projectType === 'Другое' && (
        <div className="form-group">
          <input
            type="text"
            value={formData.projectTypeOther}
            onChange={(e) => handleInputChange('projectTypeOther', e.target.value)}
            placeholder="Укажите тип проекта"
            className={`form-input ${errors.projectTypeOther ? 'error' : ''}`}
          />
          {errors.projectTypeOther && <span className="error-message">{errors.projectTypeOther}</span>}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">{t('blog-project-description')} *</label>
        <textarea
          value={formData.projectDescription}
          onChange={(e) => handleInputChange('projectDescription', e.target.value)}
          placeholder={t('blog-textarea-placeholder')}
          rows="4"
          className={`form-textarea ${errors.projectDescription ? 'error' : ''}`}
        />
        {errors.projectDescription && <span className="error-message">{errors.projectDescription}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">{t('blog-target-audience')} *</label>
        <textarea
          value={formData.targetAudience}
          onChange={(e) => handleInputChange('targetAudience', e.target.value)}
          placeholder="Опишите вашу целевую аудиторию"
          rows="3"
          className={`form-textarea ${errors.targetAudience ? 'error' : ''}`}
        />
        {errors.targetAudience && <span className="error-message">{errors.targetAudience}</span>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-step">
      <h3 className="step-title">{t('blog-step2-title')}</h3>
      <p className="step-subtitle">{t('blog-step2-subtitle')}</p>
      
      <div className="form-group">
        <label className="form-label">{t('blog-platform')} *</label>
        <select
          value={formData.platform}
          onChange={(e) => handleInputChange('platform', e.target.value)}
          className={`form-select ${errors.platform ? 'error' : ''}`}
        >
          <option value="">{t('blog-select-placeholder')}</option>
          {platforms.map(platform => (
            <option key={platform} value={platform}>{platform}</option>
          ))}
        </select>
        {errors.platform && <span className="error-message">{errors.platform}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">{t('blog-integrations')} *</label>
        <div className="checkbox-group">
          {integrationOptions.map(option => (
            <label key={option} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.integrations.includes(option)}
                onChange={(e) => handleArrayChange('integrations', option, e.target.checked)}
              />
              <span className="checkbox-text">{option}</span>
            </label>
          ))}
        </div>
        {errors.integrations && <span className="error-message">{errors.integrations}</span>}
      </div>

      {formData.integrations.includes('Другое') && (
        <div className="form-group">
          <input
            type="text"
            value={formData.integrationsOther}
            onChange={(e) => handleInputChange('integrationsOther', e.target.value)}
            placeholder="Укажите другие интеграции"
            className={`form-input ${errors.integrationsOther ? 'error' : ''}`}
          />
          {errors.integrationsOther && <span className="error-message">{errors.integrationsOther}</span>}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">{t('blog-design-requirements')} *</label>
        <select
          value={formData.designRequirements}
          onChange={(e) => handleInputChange('designRequirements', e.target.value)}
          className={`form-select ${errors.designRequirements ? 'error' : ''}`}
        >
          <option value="">{t('blog-select-placeholder')}</option>
          {designRequirementsOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.designRequirements && <span className="error-message">{errors.designRequirements}</span>}
      </div>

      {formData.designRequirements === 'Другое' && (
        <div className="form-group">
          <input
            type="text"
            value={formData.designRequirementsOther}
            onChange={(e) => handleInputChange('designRequirementsOther', e.target.value)}
            placeholder="Укажите требования к дизайну"
            className={`form-input ${errors.designRequirementsOther ? 'error' : ''}`}
          />
          {errors.designRequirementsOther && <span className="error-message">{errors.designRequirementsOther}</span>}
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="form-step">
      <h3 className="step-title">{t('blog-step3-title')}</h3>
      <p className="step-subtitle">{t('blog-step3-subtitle')}</p>
      
      <div className="form-group">
        <label className="form-label">{t('blog-budget')} *</label>
        <select
          value={formData.budget}
          onChange={(e) => handleInputChange('budget', e.target.value)}
          className={`form-select ${errors.budget ? 'error' : ''}`}
        >
          <option value="">{t('blog-select-placeholder')}</option>
          {budgetRanges.map(range => (
            <option key={range} value={range}>{range}</option>
          ))}
        </select>
        {errors.budget && <span className="error-message">{errors.budget}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">{t('blog-timeline')} *</label>
        <select
          value={formData.timeline}
          onChange={(e) => handleInputChange('timeline', e.target.value)}
          className={`form-select ${errors.timeline ? 'error' : ''}`}
        >
          <option value="">{t('blog-select-placeholder')}</option>
          {timelineOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.timeline && <span className="error-message">{errors.timeline}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">{t('blog-priority-features')} *</label>
        <div className="checkbox-group">
          {priorityFeaturesOptions.map(option => (
            <label key={option} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.priorityFeatures.includes(option)}
                onChange={(e) => handleArrayChange('priorityFeatures', option, e.target.checked)}
              />
              <span className="checkbox-text">{option}</span>
            </label>
          ))}
        </div>
        {errors.priorityFeatures && <span className="error-message">{errors.priorityFeatures}</span>}
      </div>

      {formData.priorityFeatures.includes('Другое') && (
        <div className="form-group">
          <input
            type="text"
            value={formData.priorityFeaturesOther}
            onChange={(e) => handleInputChange('priorityFeaturesOther', e.target.value)}
            placeholder="Укажите другие приоритетные функции"
            className={`form-input ${errors.priorityFeaturesOther ? 'error' : ''}`}
          />
          {errors.priorityFeaturesOther && <span className="error-message">{errors.priorityFeaturesOther}</span>}
        </div>
      )}

      <h4 className="contact-section-title">{t('blog-step4-title')}</h4>
      <p className="contact-section-subtitle">{t('blog-step4-subtitle')}</p>

      <div className="form-group">
        <label className="form-label">{t('blog-name')} *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Ваше имя"
          className={`form-input ${errors.name ? 'error' : ''}`}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">{t('blog-email')} *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="your@email.com"
          className={`form-input ${errors.email ? 'error' : ''}`}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">{t('blog-phone')} *</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="+7 (999) 123-45-67"
          className={`form-input ${errors.phone ? 'error' : ''}`}
        />
        {errors.phone && <span className="error-message">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">{t('blog-company')}</label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => handleInputChange('company', e.target.value)}
          placeholder="Название компании (необязательно)"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Telegram username</label>
        <input
          type="text"
          value={formData.telegram}
          onChange={(e) => handleInputChange('telegram', e.target.value)}
          placeholder="@username или username (необязательно)"
          className={`form-input ${errors.telegram ? 'error' : ''}`}
        />
        {errors.telegram && <span className="error-message">{errors.telegram}</span>}
      </div>
    </div>
  );

  if (successMessage) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content success-content" onClick={(e) => e.stopPropagation()}>
          <div className="success-icon">✓</div>
          <h3 className="success-title">{t('blog-success-title')}</h3>
          <p className="success-message">{successMessage}</p>
          <button className="form-button" onClick={onClose}>
            {t('blog-new-request')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content client-form-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h3 className="modal-title">{t('blog-title')}</h3>
          <p className="form-subtitle">{t('blog-subtitle')}</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
          <div className="step-indicator">
            Шаг {currentStep} из 3
          </div>
        </div>

        <form className="client-form" onSubmit={handleSubmit}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div className="form-actions">
            {currentStep > 1 && (
              <button 
                type="button" 
                onClick={handlePrev}
                className="form-button secondary"
              >
                {t('blog-prev')}
              </button>
            )}
            
            {currentStep < 3 ? (
              <button 
                type="button" 
                onClick={handleNext}
                className="form-button primary"
              >
                {t('blog-next')}
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={loading}
                className="form-button primary"
              >
                {loading ? t('loading') : t('blog-submit')}
              </button>
            )}
          </div>
        </form>

        {successMessage && <p className="message success">{successMessage}</p>}
        {errorMessage && <p className="message error">{errorMessage}</p>}
        
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">
          &times;
        </button>
      </div>
    </div>
  );
}
