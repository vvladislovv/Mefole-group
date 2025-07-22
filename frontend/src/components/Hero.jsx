import './css/hero.css';
import { useState, useEffect } from 'react';
import { Graphic } from './Graphic';
import { Projects } from './Projects';
import { Services } from './Services';
import { Reviews } from './Reviews';
import { Portfolio } from './Portfolio';
import { Team } from './Team';
import { Contacts } from './Contacts';
import { Footer } from './Footer';
import FadeInSection from './FadeInSections';
import { useTranslation } from 'react-i18next';
import { categoryKeys } from '../data/portfolio';
export const Hero = ({ sectionRefs }) => {
    const { t, i18n} = useTranslation();
    const [currentCategory, setCurrentCategory] = useState(categoryKeys[0]);
    useEffect(() => {
        setCurrentCategory(categoryKeys[0]);
    }, [i18n.language]);

    return (
        <div className='heroContainer'>
            <FadeInSection animation="fade-scale" duration={1.2}>
                <span className='heroTitle'>MEFOLE <br></br> GROUP</span>
                <h3 className='heroSubline'>{t('hero-description')} </h3>
            </FadeInSection>
            <FadeInSection animation="fade-up" delay="delay-200">
                <Projects sectionRefs={sectionRefs} currentCategory={currentCategory} setCurrentCategory={setCurrentCategory}/>
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
                <Portfolio ref={sectionRefs["portfolio"]}  currentCategory={currentCategory} setCurrentCategory={setCurrentCategory}/>
            </FadeInSection>
            <FadeInSection animation="fade-up" delay="delay-200">
                <Team ref={sectionRefs["team"]}/>
            </FadeInSection>
            <FadeInSection animation="fade-up" delay="delay-100">
                 <Contacts ref={sectionRefs["contacts"]}/>
            </FadeInSection>
            <Footer sectionRefs={sectionRefs} />
        </div>
    )
}