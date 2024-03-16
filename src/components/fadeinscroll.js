import React, { useState, useEffect, useRef } from 'react';

function FadeInOnScroll({ children }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !isVisible) {
        setIsVisible(true);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, isVisible]);

  return (
    <div ref={ref} className={isVisible ? 'fade-in' : ''}>
      {children}
    </div>
  );
}
