import './css/navbar.css';
import { languages } from '../data/languages';
import { useState } from 'react';
import { useTranslation } from "react-i18next";
export const Navbar = ({ sectionRefs }) => {
    const handleScroll = (key) => {
        sectionRefs[key]?.current?.scrollIntoView({ behavior: "smooth" });
    };
    // translator
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    const [showLanguages, setShowLanguages] = useState(false);
    return (
        <div className='nav-wrapper'>
            <div className="nav-container">
                <div className="nav">
                    <div className="nav-items">
                        <div className="nav-item" onClick={() => handleScroll("graphic")}>
                            {t('graphic')}
                        </div>
                        <div className="nav-item" onClick={() => handleScroll("services")}>
                            {t('services')}
                        </div>
                        <div className="nav-item" onClick={() => handleScroll("reviews")}>
                            {t('reviews')}
                        </div>
                        <div className="nav-item" onClick={() => handleScroll("portfolio")}>
                            {t('portfolio')}
                        </div>
                        <div className="nav-item" onClick={() => handleScroll("team")}>
                            {t('team')}
                        </div>
                        <div className="nav-item" onClick={() => handleScroll("contacts")}>
                            {t('contacts')}
                        </div>
                    </div>
                </div>
                <div className={`nav-translator ${showLanguages ? 'open' : ''}`} onClick={() => setShowLanguages(!showLanguages)}>
                    <div className='translator-icon'>
                        <img src="/icons/Translator.png"></img>
                        {showLanguages ? 
                        (
                            <svg className="dropdown-icon" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg" style={{transform: 'rotate(180deg)'}}>
                                <path d="M6 9L12 15L18 9" stroke="lightgrey" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        ) : 
                        (
                            <svg className='dropdown-icon' width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 9L12 15L18 9" stroke="lightgrey" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        )}

                    </div>
                    {showLanguages && (
                        <div className={`languages-dropdown ${showLanguages ? 'visible' : ''}`}>
                            {languages.map((language) => (
                                <div onClick={() => changeLanguage(language.id)} className='language' key={language.id}>{t(language.id)}</div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}