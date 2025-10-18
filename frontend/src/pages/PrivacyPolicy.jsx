import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SEOHelmet } from '../components/SEOHelmet';
import './css/legal-pages.css';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  // Прокрутка к началу страницы при загрузке
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className="legal-page-container">
      <SEOHelmet 
        title={`${t('privacy-policy-title')} - ${t('brand-name')}`}
        description={`${t('privacy-policy-title')} и ${t('privacy-policy-subtitle')} компании ${t('brand-name')}`}
      />
      
      <Link to="/" className="back-button">
        {t('back-to-main')}
      </Link>
      
      <div className="legal-page-content">
        <div className="legal-page-header">
          <h1 className="legal-page-title">{t('privacy-policy-title')}</h1>
          <p className="legal-page-subtitle">{t('privacy-policy-subtitle')}</p>
          <p className="legal-page-date">{t('last-updated')}</p>
        </div>

        <div className="legal-page-body">
          <section className="legal-section">
            <h2>1. {t('privacy-general-provisions')}</h2>
            <p>
              {t('privacy-general-provisions-text')}
            </p>
            <p>
              {t('privacy-general-provisions-text2')}
            </p>
          </section>

          <section className="legal-section">
            <h2>2. {t('privacy-definitions')}</h2>
            <ul>
              <li><strong>{t('privacy-definitions-text')}</strong></li>
              <li><strong>{t('privacy-definitions-text2')}</strong></li>
              <li><strong>{t('privacy-definitions-text3')}</strong></li>
              <li><strong>{t('privacy-definitions-text4')}</strong></li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. {t('privacy-subject')}</h2>
            <p>
              <strong>{t('privacy-subject-text')}</strong><br/>
              {t('privacy-subject-text2')}<br/>
              {t('email')} info@hacktaika.ru
            </p>
          </section>

          <section className="legal-section">
            <h2>4. {t('privacy-categories')}</h2>
            <p>{t('privacy-categories-text')}</p>
            <ul>
              <li>{t('privacy-categories-list1')}</li>
              <li>{t('privacy-categories-list2')}</li>
              <li>{t('privacy-categories-list3')}</li>
              <li>{t('privacy-categories-list4')}</li>
              <li>{t('privacy-categories-list5')}</li>
              <li>{t('privacy-categories-list6')}</li>
              <li>{t('privacy-categories-list7')}</li>
              <li>{t('privacy-categories-list8')}</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. {t('privacy-purposes')}</h2>
            <p>{t('privacy-purposes-text')}</p>
            <ul>
              <li>{t('privacy-purposes-list1')}</li>
              <li>{t('privacy-purposes-list2')}</li>
              <li>{t('privacy-purposes-list3')}</li>
              <li>{t('privacy-purposes-list4')}</li>
              <li>{t('privacy-purposes-list5')}</li>
              <li>{t('privacy-purposes-list6')}</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. {t('privacy-legal-basis')}</h2>
            <p>{t('privacy-legal-basis-text')}</p>
            <ul>
              <li>{t('privacy-legal-basis-list1')}</li>
              <li>{t('privacy-legal-basis-list2')}</li>
              <li>{t('privacy-legal-basis-list3')}</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. {t('privacy-methods')}</h2>
            <p>{t('privacy-methods-text')}</p>
          </section>

          <section className="legal-section">
            <h2>8. {t('privacy-terms')}</h2>
            <p>{t('privacy-terms-text')}</p>
          </section>

          <section className="legal-section">
            <h2>9. {t('privacy-transfer')}</h2>
            <p>{t('privacy-transfer-text')}</p>
            <ul>
              <li>{t('privacy-transfer-list1')}</li>
              <li>{t('privacy-transfer-list2')}</li>
              <li>{t('privacy-transfer-list3')}</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>10. {t('privacy-protection')}</h2>
            <p>{t('privacy-protection-text')}</p>
            <ul>
              <li>{t('privacy-protection-list1')}</li>
              <li>{t('privacy-protection-list2')}</li>
              <li>{t('privacy-protection-list3')}</li>
              <li>{t('privacy-protection-list4')}</li>
              <li>{t('privacy-protection-list5')}</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>11. {t('privacy-rights')}</h2>
            <p>{t('privacy-rights-text')}</p>
            <ul>
              <li>{t('privacy-rights-list1')}</li>
              <li>{t('privacy-rights-list2')}</li>
              <li>{t('privacy-rights-list3')}</li>
              <li>{t('privacy-rights-list4')}</li>
              <li>{t('privacy-rights-list5')}</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>12. {t('privacy-cookies')}</h2>
            <p>{t('privacy-cookies-text')}</p>
          </section>

          <section className="legal-section">
            <h2>13. {t('privacy-changes')}</h2>
            <p>{t('privacy-changes-text')}</p>
          </section>

          <section className="legal-section">
            <h2>14. {t('privacy-contact')}</h2>
            <p>
              {t('contact-info')}<br/>
              {t('email')} info@hacktaika.ru<br/>
              {t('phone')} +7 (993) 911-47-06
            </p>
          </section>

          <section className="legal-section">
            <h2>15. {t('privacy-final')}</h2>
            <p>
              {t('privacy-final-text')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;