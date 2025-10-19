import { useCallback, useEffect, useRef, useState } from 'react';

// Hook for performance monitoring
export const usePerformance = () => {
  const performanceRef = useRef({
    startTime: performance.now(),
    measurements: []
  });

  const measure = useCallback((name, fn) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    performanceRef.current.measurements.push({
      name,
      duration: end - start,
      timestamp: Date.now()
    });
    
    return result;
  }, []);

  const getMetrics = useCallback(() => {
    return {
      totalTime: performance.now() - performanceRef.current.startTime,
      measurements: performanceRef.current.measurements
    };
  }, []);

  return { measure, getMetrics };
};

// Hook for debouncing
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for throttling
export const useThrottle = (value, limit) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    if (Date.now() - lastRan.current >= limit) {
      setThrottledValue(value);
      lastRan.current = Date.now();
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }, limit - (Date.now() - lastRan.current));

      return () => clearTimeout(timer);
    }
  }, [value, limit]);

  return throttledValue;
};

// Hook for intersection observer
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
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
  }, [options, hasIntersected]);

  return [elementRef, isIntersecting, hasIntersected];
};
