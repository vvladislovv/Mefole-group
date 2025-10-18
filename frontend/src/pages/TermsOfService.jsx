import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SEOHelmet } from '../components/SEOHelmet';
import './css/legal-pages.css';

const TermsOfService = () => {
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
        title={`${t('terms-of-service-title')} - ${t('brand-name')}`}
        description={`${t('terms-of-service-title')} сайта и услуг компании ${t('brand-name')}`}
      />
      
      <Link to="/" className="back-button">
        {t('back-to-main')}
      </Link>
      
      <div className="legal-page-content">
        <div className="legal-page-header">
          <h1 className="legal-page-title">{t('terms-of-service-title')}</h1>
          <p className="legal-page-subtitle">{t('terms-of-service-subtitle')}</p>
          <p className="legal-page-date">{t('last-updated')}</p>
        </div>

        <div className="legal-page-body">
          <section className="legal-section">
            <h2>1. {t('terms-general-provisions')}</h2>
            <p>
              {t('terms-general-provisions-text')}
            </p>
            <p>
              {t('terms-general-provisions-text2')}
            </p>
          </section>

          <section className="legal-section">
            <h2>2. {t('terms-definitions')}</h2>
            <ul>
              <li><strong>{t('terms-definitions-text')}</strong></li>
              <li><strong>{t('terms-definitions-text2')}</strong></li>
              <li><strong>{t('terms-definitions-text3')}</strong></li>
              <li><strong>{t('terms-definitions-text4')}</strong></li>
              <li><strong>{t('terms-definitions-text5')}</strong></li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. {t('terms-subject')}</h2>
            <p>
              {t('terms-subject-text')}
            </p>
          </section>

          <section className="legal-section">
            <h2>4. {t('terms-acceptance')}</h2>
            <p>{t('terms-acceptance-text')}</p>
            <ul>
              <li>{t('terms-acceptance-list1')}</li>
              <li>{t('terms-acceptance-list2')}</li>
              <li>{t('terms-acceptance-list3')}</li>
              <li>{t('terms-acceptance-list4')}</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. {t('terms-services')}</h2>
            <p>{t('terms-services-text')}</p>
            <ul>
              <li>{t('terms-services-list1')}</li>
              <li>{t('terms-services-list2')}</li>
              <li>{t('terms-services-list3')}</li>
              <li>{t('terms-services-list4')}</li>
              <li>{t('terms-services-list5')}</li>
              <li>{t('terms-services-list6')}</li>
              <li>{t('terms-services-list7')}</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. {t('terms-user-rights')}</h2>
            <h3>{t('terms-user-rights-title')}</h3>
            <ul>
              <li>{t('terms-user-rights-list1')}</li>
              <li>{t('terms-user-rights-list2')}</li>
              <li>{t('terms-user-rights-list3')}</li>
              <li>{t('terms-user-rights-list4')}</li>
            </ul>

            <h3>{t('terms-user-obligations-title')}</h3>
            <ul>
              <li>{t('terms-user-obligations-list1')}</li>
              <li>{t('terms-user-obligations-list2')}</li>
              <li>{t('terms-user-obligations-list3')}</li>
              <li>{t('terms-user-obligations-list4')}</li>
              <li>{t('terms-user-obligations-list5')}</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. {t('terms-company-rights')}</h2>
            <h3>{t('terms-company-rights-title')}</h3>
            <ul>
              <li>{t('terms-company-rights-list1')}</li>
              <li>{t('terms-company-rights-list2')}</li>
              <li>{t('terms-company-rights-list3')}</li>
              <li>{t('terms-company-rights-list4')}</li>
            </ul>

            <h3>{t('terms-company-obligations-title')}</h3>
            <ul>
              <li>{t('terms-company-obligations-list1')}</li>
              <li>{t('terms-company-obligations-list2')}</li>
              <li>{t('terms-company-obligations-list3')}</li>
              <li>{t('terms-company-obligations-list4')}</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>8. {t('terms-intellectual')}</h2>
            <p>
              {t('terms-intellectual-text')}
            </p>
            <p>
              {t('terms-intellectual-text2')}
            </p>
          </section>

          <section className="legal-section">
            <h2>9. {t('terms-procedure')}</h2>
            <ol>
              <li>{t('terms-procedure-list1')}</li>
              <li>{t('terms-procedure-list2')}</li>
              <li>{t('terms-procedure-list3')}</li>
              <li>{t('terms-procedure-list4')}</li>
              <li>{t('terms-procedure-list5')}</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2>10. {t('terms-payment')}</h2>
            <p>
              {t('terms-payment-text')}
            </p>
            <p>
              {t('terms-payment-text2')}
            </p>
          </section>

          <section className="legal-section">
            <h2>11. {t('terms-responsibility')}</h2>
            <h3>{t('terms-responsibility-company-title')}</h3>
            <p>{t('terms-responsibility-company-text')}</p>
            <ul>
              <li>{t('terms-responsibility-company-list1')}</li>
              <li>{t('terms-responsibility-company-list2')}</li>
              <li>{t('terms-responsibility-company-list3')}</li>
              <li>{t('terms-responsibility-company-list4')}</li>
            </ul>

            <h3>{t('terms-responsibility-user-title')}</h3>
            <p>{t('terms-responsibility-user-text')}</p>
            <ul>
              <li>{t('terms-responsibility-user-list1')}</li>
              <li>{t('terms-responsibility-user-list2')}</li>
              <li>{t('terms-responsibility-user-list3')}</li>
              <li>{t('terms-responsibility-user-list4')}</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>12. {t('terms-confidentiality')}</h2>
            <p>
              {t('terms-confidentiality-text')}
            </p>
          </section>

          <section className="legal-section">
            <h2>13. {t('terms-prohibited')}</h2>
            <p>{t('terms-prohibited-text')}</p>
            <ul>
              <li>{t('terms-prohibited-list1')}</li>
              <li>{t('terms-prohibited-list2')}</li>
              <li>{t('terms-prohibited-list3')}</li>
              <li>{t('terms-prohibited-list4')}</li>
              <li>{t('terms-prohibited-list5')}</li>
              <li>{t('terms-prohibited-list6')}</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>14. {t('terms-suspension')}</h2>
            <p>{t('terms-suspension-text')}</p>
            <ul>
              <li>{t('terms-suspension-list1')}</li>
              <li>{t('terms-suspension-list2')}</li>
              <li>{t('terms-suspension-list3')}</li>
              <li>{t('terms-suspension-list4')}</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>15. {t('terms-changes')}</h2>
            <p>
              {t('terms-changes-text')}
            </p>
          </section>

          <section className="legal-section">
            <h2>16. {t('terms-disputes')}</h2>
            <p>
              {t('terms-disputes-text')}
            </p>
          </section>

          <section className="legal-section">
            <h2>17. {t('privacy-contact')}</h2>
            <p>
              {t('contact-info-terms')}<br/>
              {t('email')} info@hacktaika.ru<br/>
              {t('phone')} +7 (993) 911-47-06
            </p>
          </section>

          <section className="legal-section">
            <h2>18. {t('terms-final')}</h2>
            <p>
              {t('terms-final-text')}
            </p>
            <p>
              {t('terms-final-text2')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;