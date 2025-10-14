import { useRef } from "react";
import "./App.css";
import { ClientFormSection } from "./components/ClientFormSection";
import { Contacts } from "./components/Contacts";
import FadeInSection from "./components/FadeInSections";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { Portfolio } from "./components/Portfolio";
import { Reviews } from "./components/Reviews";
import { SEOHelmet } from "./components/SEOHelmet";
import { Services } from "./components/Services";
import "./i18n";
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

  return (
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
      
      <FadeInSection animation="fade-scale" delay="delay-300">
        <Portfolio ref={portfolioRef} />
      </FadeInSection>
      
      
      <FadeInSection animation="fade-up" delay="delay-100">
        <Contacts ref={contactsRef} />
      </FadeInSection>
      
      <Footer sectionRefs={sectionRefs} />
    </div>
  );
}

export default App;
