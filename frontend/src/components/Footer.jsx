import { useTranslation } from "react-i18next";
import "./css/footer.css";
export const Footer = ({ sectionRefs }) => {
  const { t } = useTranslation();
  const handleScroll = (key) => {
    sectionRefs[key]?.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="footer-container">
      <span className="footer-title">{t('brand-name')}</span>
      <div className="footbar-wrapper">
        <div className="footbar">
          <div
            className="footbar-item"
            onClick={() => handleScroll("services")}
          >
            {t("services")}
          </div>
          <div className="footbar-item" onClick={() => handleScroll("reviews")}>
            {t("reviews")}
          </div>
          <div
            className="footbar-item"
            onClick={() => handleScroll("portfolio")}
          >
            {t("portfolio")}
          </div>
          <div className="footbar-item" onClick={() => handleScroll("contacts")}>
            {t("contacts")}
          </div>
          <div className="footbar-item" onClick={() => handleScroll("form")}>
            {t("blog")}
          </div>
        </div>
      </div>
      <div className="socials">
        <div className="socials-flex">
          <a
            href="https://t.me/+2mzMGCda9xU4OWFi"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/icons/telegram.png" alt="telegram" />
          </a>
        </div>
      </div>
      <p className="copyright">©{t('brand-name')} 2025. {t('all-rights-reserved')}</p>
    </div>
  );
};
