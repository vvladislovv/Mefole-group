import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const SEOHelmet = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const isEnglish = i18n.language === "en";

    // Update document title
    document.title = isEnglish
      ? "ХакТайка - Website Development, Mobile Apps & Web Services"
      : "ХакТайка - Разработка сайтов, мобильных приложений и веб-сервисов";

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        isEnglish
          ? "ХакТайка - Professional website development, mobile applications, web services and IT solutions. We create modern digital products for your business."
          : "ХакТайка - профессиональная разработка сайтов, мобильных приложений, веб-сервисов и IT-решений. Создаем современные цифровые продукты для вашего бизнеса."
      );
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute(
        "content",
        isEnglish
          ? "website development, web development, mobile apps, IT services, programming, web design, ХакТайка, custom development, technical specification"
          : "разработка сайтов, создание сайтов, мобильные приложения, веб-разработка, IT-услуги, программирование, веб-дизайн, ХакТайка, разработка под ключ, техническое задание"
      );
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute(
        "content",
        isEnglish
          ? "ХакТайка - Website Development & Mobile Apps"
          : "ХакТайка - Разработка сайтов и мобильных приложений"
      );
    }

    const ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    if (ogDescription) {
      ogDescription.setAttribute(
        "content",
        isEnglish
          ? "Professional website development, mobile applications and web services. We create modern digital products for your business."
          : "Профессиональная разработка сайтов, мобильных приложений и веб-сервисов. Создаем современные цифровые продукты для вашего бизнеса."
      );
    }

    // Update html lang attribute
    document.documentElement.lang = isEnglish ? "en" : "ru";
  }, [i18n.language, t]);

  return null; // This component doesn't render anything
};
