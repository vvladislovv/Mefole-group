import { useEffect, useRef, useState } from 'react';

const LazyComponent = ({ 
  children, 
  threshold = 0.1, 
  rootMargin = '50px',
  fallback = null,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasBeenVisible) {
          setIsVisible(true);
          setHasBeenVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, rootMargin, hasBeenVisible]);

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? children : (fallback || <div style={{ minHeight: '200px' }} />)}
    </div>
  );
};

export default LazyComponent;
