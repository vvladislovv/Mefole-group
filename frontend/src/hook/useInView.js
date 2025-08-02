import { useEffect, useRef, useState } from "react";

export default function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        // Отключаем наблюдатель только после небольшой задержки
        // чтобы анимация успела запуститься
        setTimeout(() => {
          observer.disconnect();
        }, 100);
      }
    }, {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px 0px -50px 0px',
      ...options
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [options]);

  return [ref, inView];
}
