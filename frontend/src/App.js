import { useRef } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { ClientFormSection } from "./components/ClientFormSection";
import { Contacts } from "./components/Contacts";
import { DevBlog } from "./components/DevBlog";
import FadeInSection from "./components/FadeInSections";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { Portfolio } from "./components/Portfolio";
import { Reviews } from "./components/Reviews";
import { SEOHelmet } from "./components/SEOHelmet";
import { Services } from "./components/Services";
import "./i18n";
import ArticlePage from "./pages/ArticlePage";
function App() {
  const projectsRef = useRef(null);
  const servicesRef = useRef(null);
  const reviewsRef = useRef(null);
  const portfolioRef = useRef(null);
  const contactsRef = useRef(null);
  const devblogRef = useRef(null);
  const formRef = useRef(null);

  const sectionRefs = {
    projects: projectsRef,
    services: servicesRef,
    reviews: reviewsRef,
    portfolio: portfolioRef,
    contacts: contactsRef,
    form: formRef,
    devblog: devblogRef,
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
      
      <FadeInSection animation="fade-scale" delay="delay-200">
        <DevBlog ref={devblogRef} />
      </FadeInSection>
      
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
        <Route path="/article/:id" element={<ArticlePage />} />
      </Routes>
    </Router>
  );
}

export default App;
