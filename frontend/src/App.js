import './App.css';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { useRef } from 'react';
import "./i18n";
function App() {
  const projectsRef = useRef(null);
  const graphicRef = useRef(null);
  const servicesRef = useRef(null);
  const reviewsRef = useRef(null);
  const portfolioRef = useRef(null);
  const teamRef = useRef(null);
  const contactsRef = useRef(null);

  const sectionRefs = {
    "projects": projectsRef,
    "graphic": graphicRef,
    "services": servicesRef,
    "reviews": reviewsRef,
    "portfolio": portfolioRef,
    "team": teamRef,
    "contacts": contactsRef
  };

  return (
    <div style={{background: '#0b0b0b', maxWidth: '100vw', boxSizing: 'border-box'}}>
      <Navbar sectionRefs={sectionRefs} />
      <Hero sectionRefs={sectionRefs} />
      <img src="/vectors/1.png"  alt="вектор1" style={{position: 'absolute', left: 0, top: '230px'}}/>
      <img src="/vectors/2.png"  alt="вектор1" style={{position: 'absolute', right: 0, top: 0}}/>
      <img src="/vectors/7.png"  alt="вектор1" className='vectors' style={{position: 'absolute', right: 0, top: 682}}/>
      <img src="/vectors/8.png"  alt="вектор1" className='vectors'  style={{position: 'absolute', left: 0, top: 983}}/>
      <img src="/vectors/9.png"  alt="вектор1"  className='vectors' style={{position: 'absolute', right: 0, top: 1403}}/>
      <img src="/vectors/10.png"  alt="вектор1"  className='vectors' style={{position: 'absolute', left: 0, top: 1907}}/>
      <img src="/vectors/11.png"  alt="вектор1"  className='vectors' style={{position: 'absolute', right: 0, top: 2631}}/>
      <img src="/vectors/12.png"  alt="вектор1"  className='vectors' style={{position: 'absolute', left: 0, top: 2801}}/>
      <img src="/vectors/13.png"  alt="вектор1"  className='vectors' style={{position: 'absolute', left: 0, top: 4407}}/>
      <img src="/vectors/14.png"  alt="вектор1"  className='vectors' style={{position: 'absolute', right: 0, top: 4407}}/>
    </div>
  )
}

export default App;
