import React from "react";
import useInView from "../hook/useInView";
import "./css/fadesection.css";

export default function FadeInSection({ 
  children, 
  animation = "fade-up", 
  delay = "", 
  threshold = 0.1,
  duration = 0.8 
}) {
  const [ref, inView] = useInView({ threshold });

  const animationClass = `fade-section ${animation} ${delay} ${inView ? "visible" : ""}`;

  return (
    <div
      ref={ref}
      className={animationClass}
      style={{
        transitionDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  );
}
