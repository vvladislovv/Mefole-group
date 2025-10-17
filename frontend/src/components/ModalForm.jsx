import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../api/client';
import { getServiceNameForAPI } from '../data/serviceMapping';
import { services } from '../data/services';
import './css/modalForm.css';
export default function Modal({ onClose, selectedServiceId }) {
  const {t} = useTranslation();

  const [selectedId, setSelectedId] = useState(selectedServiceId);

  const [client_name, setClientName] = useState('');
  const [client_email, setClientEmail] = useState('');
  const [client_phone, setClientPhone] = useState('');
  const [client_telegram, setClientTelegram] = useState('');
  const [technical_task, setTechnicalTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isTouched, setIsTouched] = useState({});

  useEffect(() => {
    // Сохраняем текущую позицию скролла
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    
    return () => {
      // Восстанавливаем скролл и позицию
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
      window.scrollTo(0, scrollY);
    };
  }, []);

  const validateFields = (values) => {
    const errors = {};
    const nameValue = (values?.client_name ?? client_name).trim();
    const emailValue = (values?.client_email ?? client_email).trim();
    const phoneValue = (values?.client_phone ?? client_phone).trim();
    const telegramValue = (values?.client_telegram ?? client_telegram).trim();

    if (!nameValue) {
      errors.client_name = t('modal-validation-name-required');
    }

    if (!emailValue) {
      errors.client_email = t('modal-validation-email-required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailValue)) {
        errors.client_email = t('modal-validation-email-invalid');
      }
    }

    if (!phoneValue) {
      errors.client_phone = t('modal-validation-phone-required');
    } else {
      const phoneRegex = /^[+]?[0-9\s\-()]{7,}$/;
      if (!phoneRegex.test(phoneValue)) {
        errors.client_phone = t('modal-validation-phone-invalid');
      }
    }

    if (telegramValue) {
      const telegramRegex = /^@?[a-zA-Z0-9_]{5,32}$/;
      if (!telegramRegex.test(telegramValue)) {
        errors.client_telegram = t('modal-validation-telegram-invalid');
      }
    }

    return errors;
  };

  const isFormValid = () => Object.keys(validateFields()).length === 0;

  const handleBlur = (field) => {
    setIsTouched((prev) => ({ ...prev, [field]: true }));
    const errors = validateFields();
    setFieldErrors(errors);
  };

  const handleChangeAndValidate = (field, value) => {
    if (field === 'client_name') setClientName(value);
    if (field === 'client_email') setClientEmail(value);
    if (field === 'client_phone') setClientPhone(value);
    if (field === 'client_telegram') setClientTelegram(value);
    if (field === 'technical_task') setTechnicalTask(value);

    const nextValues = {
      client_name: field === 'client_name' ? value : client_name,
      client_email: field === 'client_email' ? value : client_email,
      client_phone: field === 'client_phone' ? value : client_phone,
      client_telegram: field === 'client_telegram' ? value : client_telegram,
      technical_task: field === 'technical_task' ? value : technical_task
    };
    const errors = validateFields(nextValues);
    setFieldErrors(errors);
  };

  const sendTask = async (e) => {
    e.preventDefault();
    const errors = validateFields();
    setFieldErrors(errors);
    setIsTouched({ client_name: true, client_email: true, client_phone: true, client_telegram: !!client_telegram });
    if (Object.keys(errors).length > 0) {
      setErrorMessage(t('modal-validation-check-fields'));
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    // Найдём выбранный сервис по ID (приводим к числу для сравнения)
    const selectedService = services.find(service => service.id === parseInt(selectedId));

    if (!selectedService) {
      console.error('Service not found:', selectedId, 'Available services:', services.map(s => ({id: s.id, title: s.title})));
      setErrorMessage(t('modal-validation-service-not-found'));
      setLoading(false);
      return;
    }

    try {
      await apiClient.createTask({
        service_name: getServiceNameForAPI(selectedService.title),
        client_name,
        client_email,
        client_phone,
        client_telegram,
        technical_task
      });

      setSuccessMessage(t('modal-success'));
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setClientTelegram('');
      setTechnicalTask('');
        setFieldErrors({});
        setIsTouched({});
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{t('form-title')}</h3>
        <div className="modal-title-divider" />

        <form className="modal-form" onSubmit={sendTask}>
          <select
            id="service-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="modal-select"
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {t(service.title)}
              </option>
            ))}
          </select>

          <input
            onChange={(e) => handleChangeAndValidate('client_name', e.target.value)}
            onBlur={() => handleBlur('client_name')}
            type="text"
            value={client_name}
            placeholder={`${t('your-name')} *`}
            className={`${isTouched.client_name && fieldErrors.client_name ? 'error' : ''} ${client_name && !fieldErrors.client_name ? 'valid' : ''}`}
            aria-invalid={Boolean(isTouched.client_name && fieldErrors.client_name)}
            aria-describedby={isTouched.client_name && fieldErrors.client_name ? 'error-client-name' : undefined}
            required
          />
          {isTouched.client_name && fieldErrors.client_name && (
            <span id="error-client-name" className="message error">{fieldErrors.client_name}</span>
          )}
          <input
            onChange={(e) => handleChangeAndValidate('client_email', e.target.value)}
            onBlur={() => handleBlur('client_email')}
            type="email"
            value={client_email}
            placeholder={`${t('your-email')} *`}
            className={`${isTouched.client_email && fieldErrors.client_email ? 'error' : ''} ${client_email && !fieldErrors.client_email ? 'valid' : ''}`}
            aria-invalid={Boolean(isTouched.client_email && fieldErrors.client_email)}
            aria-describedby={isTouched.client_email && fieldErrors.client_email ? 'error-client-email' : undefined}
            required
          />
          {isTouched.client_email && fieldErrors.client_email && (
            <span id="error-client-email" className="message error">{fieldErrors.client_email}</span>
          )}
          <input
            onChange={(e) => handleChangeAndValidate('client_phone', e.target.value)}
            onBlur={() => handleBlur('client_phone')}
            type="tel"
            value={client_phone}
            placeholder={`${t('phone')} *`}
            className={`${isTouched.client_phone && fieldErrors.client_phone ? 'error' : ''} ${client_phone && !fieldErrors.client_phone ? 'valid' : ''}`}
            aria-invalid={Boolean(isTouched.client_phone && fieldErrors.client_phone)}
            aria-describedby={isTouched.client_phone && fieldErrors.client_phone ? 'error-client-phone' : undefined}
            required
          />
          {isTouched.client_phone && fieldErrors.client_phone && (
            <span id="error-client-phone" className="message error">{fieldErrors.client_phone}</span>
          )}
          <input
            onChange={(e) => handleChangeAndValidate('client_telegram', e.target.value)}
            onBlur={() => handleBlur('client_telegram')}
            type="text"
            value={client_telegram}
            placeholder={`${t('telegram')} (${t('optional')})`}
            className={`${isTouched.client_telegram && fieldErrors.client_telegram ? 'error' : ''} ${client_telegram && !fieldErrors.client_telegram ? 'valid' : ''}`}
            aria-invalid={Boolean(isTouched.client_telegram && fieldErrors.client_telegram)}
            aria-describedby={isTouched.client_telegram && fieldErrors.client_telegram ? 'error-client-telegram' : undefined}
          />
          {isTouched.client_telegram && fieldErrors.client_telegram && (
            <span id="error-client-telegram" className="message error">{fieldErrors.client_telegram}</span>
          )}

          <textarea
            onChange={(e) => handleChangeAndValidate('technical_task', e.target.value)}
            value={technical_task}
            placeholder={t('brief')}
            rows="3"
            className={`${technical_task ? 'filled' : ''}`}
          />

          <button type="submit" disabled={loading || !isFormValid()}>
            {loading ? t('loading') : t('send-form')}
          </button>
        </form>

        {successMessage && <p className="message success">{successMessage}</p>}
        {errorMessage && <p className="message error">{errorMessage}</p>}
        <button className="modal-close" onClick={onClose} aria-label={t('close')}>
          &times;
        </button>
      </div>
    </div>
  );
}
