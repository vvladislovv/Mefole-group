import './css/projects.css';
import { useTranslation } from 'react-i18next';
import { categoryKeys } from '../data/portfolio';
export const Projects = ({sectionRefs, currentCategory, setCurrentCategory}) => {
    const {t} = useTranslation();
    const handleScroll = (key, categoryKey) => {
        sectionRefs[key]?.current?.scrollIntoView({ behavior: "smooth" });
        setCurrentCategory(categoryKey);
    };
    return (
        <div className='services-wrapper'>
            <div className='services'>  
                <div className='services-items'>
                    {categoryKeys.slice(1).map((categoryKey) => (
                        <button key={categoryKey} className='services-item' onClick={() => handleScroll("portfolio", categoryKey)}>
                            {t(categoryKey)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}