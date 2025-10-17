import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../api/client';
import './css/ClientForm.css';

const ClientForm = React.memo(function ClientForm({ onClose }) {
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

  const projectTypes = useMemo(() => [
    t('blog-project-types.0'),
    t('blog-project-types.1'), 
    t('blog-project-types.2'),
    t('blog-project-types.3'),
    t('blog-project-types.4'),
    t('blog-project-types.5'),
    t('blog-project-types.6'),
    t('blog-project-types.7'),
    t('blog-project-types.8'),
    t('blog-project-types.9')
  ], [t]);

  const platforms = useMemo(() => [
    t('blog-platforms.0'),
    t('blog-platforms.1'),
    t('blog-platforms.2'), 
    t('blog-platforms.3'),
    t('blog-platforms.4'),
    t('blog-platforms.5'),
    t('blog-platforms.6')
  ], [t]);

  const integrationOptions = useMemo(() => [
    t('blog-integration-options.0'),
    t('blog-integration-options.1'),
    t('blog-integration-options.2'),
    t('blog-integration-options.3'),
    t('blog-integration-options.4'),
    t('blog-integration-options.5'),
    t('blog-integration-options.6'),
    t('blog-integration-options.7'),
    t('blog-integration-options.8')
  ], [t]);

  const integrationKeys = useMemo(() => [
    'blog-integration-options.0',
    'blog-integration-options.1',
    'blog-integration-options.2',
    'blog-integration-options.3',
    'blog-integration-options.4',
    'blog-integration-options.5',
    'blog-integration-options.6',
    'blog-integration-options.7',
    'blog-integration-options.8'
  ], []);

  const designRequirementsOptions = useMemo(() => [
    t('blog-design-requirements-options.0'),
    t('blog-design-requirements-options.1'),
    t('blog-design-requirements-options.2'),
    t('blog-design-requirements-options.3'),
    t('blog-design-requirements-options.4'),
    t('blog-design-requirements-options.5')
  ], [t]);

  const budgetRanges = useMemo(() => [
    t('blog-budgets.0'),
    t('blog-budgets.1'), 
    t('blog-budgets.2'),
    t('blog-budgets.3'),
    t('blog-budgets.4'),
    t('blog-budgets.5')
  ], [t]);

  const timelineOptions = useMemo(() => [
    t('blog-timelines.0'),
    t('blog-timelines.1'),
    t('blog-timelines.2'), 
    t('blog-timelines.3'),
    t('blog-timelines.4'),
    t('blog-timelines.5')
  ], [t]);

  const priorityFeaturesOptions = useMemo(() => [
    t('blog-priority-features-options.0'),
    t('blog-priority-features-options.1'),
    t('blog-priority-features-options.2'),
    t('blog-priority-features-options.3'),
    t('blog-priority-features-options.4'),
    t('blog-priority-features-options.5'),
    t('blog-priority-features-options.6'),
    t('blog-priority-features-options.7')
  ], [t]);

  const priorityFeaturesKeys = useMemo(() => [
    'blog-priority-features-options.0',
    'blog-priority-features-options.1',
    'blog-priority-features-options.2',
    'blog-priority-features-options.3',
    'blog-priority-features-options.4',
    'blog-priority-features-options.5',
    'blog-priority-features-options.6',
    'blog-priority-features-options.7'
  ], []);

  const handleInputChange = useCallback((field, value) => {
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
  }, [errors]);

  const handleArrayChange = useCallback((field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  }, []);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.projectType) newErrors.projectType = t('validation.select-project-type');
      if (formData.projectType === t('blog-project-types.9') && !formData.projectTypeOther.trim()) {
        newErrors.projectTypeOther = t('validation.specify-project-type');
      }
      if (!formData.projectDescription.trim()) {
        newErrors.projectDescription = t('validation.describe-project');
      }
      if (formData.projectDescription.trim().length < 10) {
        newErrors.projectDescription = t('validation.min-10-chars');
      }
      if (!formData.targetAudience.trim()) {
        newErrors.targetAudience = t('validation.describe-target-audience');
      }
    } else if (step === 2) {
      if (!formData.platform) newErrors.platform = t('validation.select-platform');
      if (formData.integrations.length === 0) {
        newErrors.integrations = t('validation.select-integration');
      }
      if (formData.integrations.includes('blog-integration-options.8') && !formData.integrationsOther.trim()) {
        newErrors.integrationsOther = t('validation.specify-integrations');
      }
      if (!formData.designRequirements) newErrors.designRequirements = t('validation.select-design-requirements');
      if (formData.designRequirements === t('blog-design-requirements-options.5') && !formData.designRequirementsOther.trim()) {
        newErrors.designRequirementsOther = t('validation.specify-design-requirements');
      }
    } else if (step === 3) {
      if (!formData.budget) newErrors.budget = t('validation.select-budget');
      if (!formData.timeline) newErrors.timeline = t('validation.select-timeline');
      if (formData.priorityFeatures.includes('blog-priority-features-options.7') && !formData.priorityFeaturesOther.trim()) {
        newErrors.priorityFeaturesOther = t('validation.specify-priority-features');
      }
      if (!formData.name.trim()) newErrors.name = t('validation.enter-name');
      if (!formData.email.trim()) newErrors.email = t('validation.enter-email');
      if (!formData.phone.trim()) newErrors.phone = t('validation.enter-phone');
      
      // Валидация email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = t('validation.invalid-email');
      }
      
      // Валидация телефона
      const phoneRegex = /^[+]?[0-9\s\-()]{7,}$/;
      if (formData.phone && !phoneRegex.test(formData.phone)) {
        newErrors.phone = t('validation.invalid-phone');
      }
      
      // Валидация Telegram username
      if (formData.telegram && formData.telegram.trim()) {
        const telegramRegex = /^@?[a-zA-Z0-9_]{5,32}$/;
        if (!telegramRegex.test(formData.telegram.trim())) {
          newErrors.telegram = t('validation.invalid-telegram');
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

      setSuccessMessage(t('blog-success-message'));
      
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

      {formData.projectType === t('blog-project-types.9') && (
        <div className="form-group">
          <input
            type="text"
            value={formData.projectTypeOther}
            onChange={(e) => handleInputChange('projectTypeOther', e.target.value)}
            placeholder={t('blog-project-type-other')}
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
          placeholder={t('blog-target-audience-placeholder')}
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
          {integrationOptions.map((option, index) => (
            <label key={integrationKeys[index]} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.integrations.includes(integrationKeys[index])}
                onChange={(e) => handleArrayChange('integrations', integrationKeys[index], e.target.checked)}
              />
              <span className="checkbox-text">{option}</span>
            </label>
          ))}
        </div>
        {errors.integrations && <span className="error-message">{errors.integrations}</span>}
      </div>

      {formData.integrations.includes('blog-integration-options.8') && (
        <div className="form-group">
          <input
            type="text"
            value={formData.integrationsOther}
            onChange={(e) => handleInputChange('integrationsOther', e.target.value)}
            placeholder={t('blog-integrations-other')}
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

      {formData.designRequirements === t('blog-design-requirements-options.5') && (
        <div className="form-group">
          <input
            type="text"
            value={formData.designRequirementsOther}
            onChange={(e) => handleInputChange('designRequirementsOther', e.target.value)}
            placeholder={t('blog-design-requirements-placeholder')}
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
          {priorityFeaturesOptions.map((option, index) => (
            <label key={priorityFeaturesKeys[index]} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.priorityFeatures.includes(priorityFeaturesKeys[index])}
                onChange={(e) => handleArrayChange('priorityFeatures', priorityFeaturesKeys[index], e.target.checked)}
              />
              <span className="checkbox-text">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {formData.priorityFeatures.includes('blog-priority-features-options.7') && (
        <div className="form-group">
          <input
            type="text"
            value={formData.priorityFeaturesOther}
            onChange={(e) => handleInputChange('priorityFeaturesOther', e.target.value)}
            placeholder={t('blog-priority-features-other')}
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
          placeholder={t('blog-name')}
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
          placeholder={t('blog-company-placeholder')}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t('blog-telegram-username')}</label>
        <input
          type="text"
          value={formData.telegram}
          onChange={(e) => handleInputChange('telegram', e.target.value)}
          placeholder={t('blog-telegram-placeholder')}
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
{t('blog-step')} {currentStep} {t('blog-of')} 3
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
        
        <button className="modal-close" onClick={onClose} aria-label={t('close')}>
          &times;
        </button>
      </div>
    </div>
  );
});

export default ClientForm;
