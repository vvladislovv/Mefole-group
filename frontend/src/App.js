import { lazy, Suspense, useRef } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { ClientFormSection } from "./components/ClientFormSection";
import { Contacts } from "./components/Contacts";
import CookieNotification from "./components/CookieNotification";
// import { DevBlog } from "./components/DevBlog";
import FadeInSection from "./components/FadeInSections";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { Portfolio } from "./components/Portfolio";
import { Reviews } from "./components/Reviews";
import { SEOHelmet } from "./components/SEOHelmet";
import { Services } from "./components/Services";
import "./i18n";
import "./utils/cookieUtils";

// Lazy load non-critical pages
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const PortfolioProject = lazy(() => import("./pages/PortfolioProject"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
function App() {
  const projectsRef = useRef(null);
  const servicesRef = useRef(null);
  const reviewsRef = useRef(null);
  const portfolioRef = useRef(null);
  const contactsRef = useRef(null);
  const formRef = useRef(null);

  const sectionRefs = {
    projects: projectsRef,
    services: servicesRef,
    reviews: reviewsRef,
    portfolio: portfolioRef,
    contacts: contactsRef,
    form: formRef,
  };

  const MainPage = () => (
    <div className="app-container">
      <SEOHelmet />
      <Navbar sectionRefs={sectionRefs} />
      <Hero sectionRefs={sectionRefs} />
      
      <FadeInSection animation="fade-up" delay="delay-100">
        <ClientFormSection ref={formRef} />
      </FadeInSection>
      
      <FadeInSection animation="fade-right" delay="delay-200">
        <Services ref={servicesRef} />
      </FadeInSection>
      
      <FadeInSection animation="fade-up" delay="delay-100">
        <Reviews ref={reviewsRef} />
      </FadeInSection>
      
      {/* DevBlog отключен */}
      
      <FadeInSection animation="fade-scale" delay="delay-300">
        <Portfolio ref={portfolioRef} />
      </FadeInSection>
      
      
      <FadeInSection animation="fade-up" delay="delay-100">
        <Contacts ref={contactsRef} />
      </FadeInSection>
      
      <Footer sectionRefs={sectionRefs} />
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route 
          path="/article/:id" 
          element={
            <Suspense fallback={<div className="loading-spinner">Загрузка...</div>}>
              <ArticlePage />
            </Suspense>
          } 
        />
        <Route 
          path="/portfolio/:id" 
          element={
            <Suspense fallback={<div className="loading-spinner">Загрузка...</div>}>
              <PortfolioProject />
            </Suspense>
          } 
        />
        <Route 
          path="/privacy-policy" 
          element={
            <Suspense fallback={<div className="loading-spinner">Загрузка...</div>}>
              <PrivacyPolicy />
            </Suspense>
          } 
        />
        <Route 
          path="/terms-of-service" 
          element={
            <Suspense fallback={<div className="loading-spinner">Загрузка...</div>}>
              <TermsOfService />
            </Suspense>
          } 
        />
      </Routes>
      <CookieNotification />
    </Router>
  );
}

export default App;
