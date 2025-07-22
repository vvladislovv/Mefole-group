import { useState, useEffect } from 'react';
import { services } from '../data/services';
import './css/modalForm.css';
import { BASE_URL } from '../settings';
import { useTranslation } from 'react-i18next';
export default function Modal({ onClose, selectedServiceId }) {
  const {t} = useTranslation();

  const [selectedId, setSelectedId] = useState(selectedServiceId);

  const [client_name, setClientName] = useState('');
  const [client_email, setClientEmail] = useState('');
  const [client_phone, setClientPhone] = useState('');
  const [technical_task, setTechnicalTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
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
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,}$/;
    if (!phoneRegex.test(client_phone)) {
      setErrorMessage('Пожалуйста, введите корректный номер телефона');
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    // Найдём выбранный сервис по ID
    const selectedService = services.find(service => service.id === selectedId);

    if (!selectedService) {
      setErrorMessage('Выбранный сервис не найден');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/client/create-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_name: selectedService["Название"],
          client_name,
          client_email,
          client_phone,
          technical_task
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка при отправке формы');
      }

      setSuccessMessage('Заявка успешно отправлена!');
      setClientName('');
      setClientEmail('');
      setClientPhone('');
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
                {service["Название"]}
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
