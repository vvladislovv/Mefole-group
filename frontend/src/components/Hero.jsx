import './css/hero.css';
import { useState, useEffect } from 'react';
import { Graphic } from './Graphic';

import { Services } from './Services';
import { Reviews } from './Reviews';
import { Portfolio } from './Portfolio';
import { Team } from './Team';
import { Contacts } from './Contacts';
import { Footer } from './Footer';
import FadeInSection from './FadeInSections';
import { useTranslation } from 'react-i18next';
import ReactDOM from 'react-dom';
import Modal from './ModalForm';
import { services } from '../data/services';
export const Hero = ({ sectionRefs }) => {
    const { t, i18n} = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className='heroContainer'>
            <FadeInSection animation="fade-scale" duration={1.2}>
                <span className='heroTitle'>MEFOLE <br></br> GROUP</span>
                <div className="contact-banner" onClick={() => setIsModalOpen(true)}>
                    <div className="contact-banner-content">
                        <span className="contact-banner-title">{t('contact-us-banner')}</span>
                        <span className="contact-banner-subtitle">{t('contact-us-subtitle')}</span>
                    </div>
                    <div className="contact-banner-arrow">→</div>
                </div>
                <h3 className='heroSubline'>{t('hero-description')} </h3>
            </FadeInSection>

            <FadeInSection animation="fade-left" delay="delay-100">
                <Graphic ref={sectionRefs["graphic"]}/>
            </FadeInSection>
            <FadeInSection animation="fade-right" delay="delay-200">
                <Services ref={sectionRefs["services"]}/>
            </FadeInSection>
            <FadeInSection animation="fade-up" delay="delay-100">
                <Reviews ref={sectionRefs["reviews"]}/>
            </FadeInSection>
            <FadeInSection animation="fade-scale" delay="delay-300">
                <Portfolio ref={sectionRefs["portfolio"]}/>
            </FadeInSection>
            <FadeInSection animation="fade-up" delay="delay-200">
                <Team ref={sectionRefs["team"]}/>
            </FadeInSection>
            <FadeInSection animation="fade-up" delay="delay-100">
                 <Contacts ref={sectionRefs["contacts"]}/>
            </FadeInSection>
            <Footer sectionRefs={sectionRefs} />
            {isModalOpen && ReactDOM.createPortal(
                <Modal onClose={() => setIsModalOpen(false)} selectedServiceId={services[0]["id"]} />,
                document.body
            )}
        </div>
    )
}