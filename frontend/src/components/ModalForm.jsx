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

  const sendTask = async (e) => {
    e.preventDefault();

    // Валидация обязательных полей
    if (!client_name.trim()) {
      setErrorMessage('Пожалуйста, введите ваше имя');
      return;
    }
    if (!client_email.trim()) {
      setErrorMessage('Пожалуйста, введите ваш email');
      return;
    }
    if (!client_phone.trim()) {
      setErrorMessage('Пожалуйста, введите ваш телефон');
      return;
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(client_email)) {
      setErrorMessage('Пожалуйста, введите корректный email');
      return;
    }

    // Валидация телефона (базовая)
    const phoneRegex = /^[+]?[0-9\s\-()]{7,}$/;
    if (!phoneRegex.test(client_phone)) {
      setErrorMessage('Пожалуйста, введите корректный номер телефона');
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    // Найдём выбранный сервис по ID (приводим к числу для сравнения)
    const selectedService = services.find(service => service.id === parseInt(selectedId));

    if (!selectedService) {
      console.error('Сервис не найден:', selectedId, 'Доступные сервисы:', services.map(s => ({id: s.id, title: s.title})));
      setErrorMessage('Выбранный сервис не найден');
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

      setSuccessMessage('Заявка успешно отправлена!');
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setClientTelegram('');
      setTechnicalTask('');
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
            onChange={(e) => setClientName(e.target.value)}
            type="text"
            value={client_name}
            placeholder={`${t('your-name')} *`}
            required
          />
          <input
            onChange={(e) => setClientEmail(e.target.value)}
            type="email"
            value={client_email}
            placeholder={`${t('your-email')} *`}
            required
          />
          <input
            onChange={(e) => setClientPhone(e.target.value)}
            type="tel"
            value={client_phone}
            placeholder={`${t('phone')} *`}
            required
          />
          <input
            onChange={(e) => setClientTelegram(e.target.value)}
            type="text"
            value={client_telegram}
            placeholder={`${t('telegram')} (${t('optional')})`}
          />

          <textarea
            onChange={(e) => setTechnicalTask(e.target.value)}
            value={technical_task}
            placeholder={t('brief')}
            rows="3"
          />

          <button type="submit" disabled={loading}>
            {loading ? t('loading') : t('send-form')}
          </button>
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
