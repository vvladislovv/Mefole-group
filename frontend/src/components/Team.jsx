import './css/team.css';
import DividerLine from './DividerLine';
import { useState, forwardRef, useRef, useEffect } from 'react';
import { team } from '../data/team';
import { useTranslation } from 'react-i18next';
import FadeInSection from './FadeInSections';
export const Team = forwardRef((props, ref) => {
    const {t} = useTranslation();

    const scrollRef = useRef(null);
    const cardsPerPage = 1;

    // Блокировка прокрутки внутри карточек команды
    useEffect(() => {
        const preventScroll = (e) => {
            const target = e.target.closest('.team-card');
            if (target) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };

        const teamContainer = document.querySelector('.team-container');
        if (teamContainer) {
            teamContainer.addEventListener('wheel', preventScroll, { passive: false });
            teamContainer.addEventListener('touchmove', preventScroll, { passive: false });
        }

        return () => {
            if (teamContainer) {
                teamContainer.removeEventListener('wheel', preventScroll);
                teamContainer.removeEventListener('touchmove', preventScroll);
            }
        };
    }, []);

    const scrollToCard = (cardIndex) => {
        const container = scrollRef.current;
        const cards = container.querySelectorAll(".team-card");
        const card = cards[cardIndex];
        if (card && container) {
            const containerRect = container.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const offset = cardRect.left - containerRect.left - (container.offsetWidth / 2) + (card.offsetWidth / 2);
            container.scrollBy({ left: offset, behavior: "smooth" });
        }
    };

    const scrollToPage = (pageIndex) => {
        const targetIndex = pageIndex * cardsPerPage;
        scrollToCard(targetIndex);
        setCurrentPage(pageIndex);
    };

    const [selected_member_id, select_member_id] = useState(team[0]?.id ?? null);
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = Math.ceil(team.length / cardsPerPage);

    const handlePrev = () => {
        select_member_id((prevId) => {
            const currentIndex = team.findIndex(m => m.id === prevId);
            const newIndex = Math.max(currentIndex - 1, 0);
            scrollToCard(newIndex);
            setCurrentPage(Math.floor(newIndex / cardsPerPage));
            return team[newIndex].id;
        });
    };

    const handleNext = () => {
        select_member_id((prevId) => {
            const currentIndex = team.findIndex(m => m.id === prevId);
            const newIndex = Math.min(currentIndex + 1, team.length - 1);
            scrollToCard(newIndex);
            setCurrentPage(Math.floor(newIndex / cardsPerPage));
            return team[newIndex].id;
        });
    };

    return (
        <div ref={ref} className="team-container">
            <h3 className="team-title">{t('team-title')}</h3>
            <div className="team-cards-wrapper">
                <div className="team-cards" ref={scrollRef}>
                    {team.map(({id, image}, index) => {
                        const member = t(`team-cards.${id}`, { returnObjects: true });
                        return (
                            <FadeInSection 
                                key={id}
                                animation="fade-scale" 
                                delay={`delay-${(index + 1) * 150}`}
                                threshold={0.3}
                            >
                                <div
                                    className={`team-card ${id === selected_member_id ? "selected" : ""}`}
                                >
                                    <div className="team-member-info">
                                        <h2 className="team-member-name">{member.name}</h2>
                                        <p className="team-member-role">{member.role}</p>
                                        <p className="team-member-experience">{member.experience}</p>
                                    </div>
                                    {/* 
                                    <div className="team-info">
                                        <div className="team-avatar">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div className="team-description">
                                            {member.description?.map((characteristic, index) => (
                                                <p key={index}>{characteristic}</p>
                                            ))}
                                        </div>
                                    </div>
                                    */}
                                </div>
                            </FadeInSection>
                        )
                    })}
                </div>
            </div>

            <button
                onClick={handlePrev}
                className="prev-button"
                disabled={selected_member_id === team[0]?.id}
            >
                <img src="/arrow-left.png" alt="Стрелка влево" />
            </button>

            <button
                onClick={handleNext}
                className="next-button"
                disabled={selected_member_id === team[team.length - 1]?.id}
            >
                <img src="/arrow-right.png" alt="Стрелка вправо" />
            </button>

            <div className='scrolls'>
                {Array.from({ length: totalPages }).map((_, i) => (
                    <img
                        key={i}
                        src={i === currentPage ? "/vectors/circleFilled.png" : "/vectors/circle.png"}
                        alt="Пагинация"
                        onClick={() => scrollToPage(i)}
                        className="indicator-dot"
                    />
                ))}
            </div>
        </div>
    );
});
