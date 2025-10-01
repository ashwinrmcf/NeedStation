import { useEffect } from 'react';

const useScrollAnimation = () => {
  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const initializeAnimations = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate');
              console.log('Animation triggered for:', entry.target); // Debug log
            }
          });
        },
        { 
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      // Observe all elements with scroll-animate class
      const elements = document.querySelectorAll('.scroll-animate');
      console.log('Found scroll-animate elements:', elements.length); // Debug log
      
      elements.forEach((el) => {
        observer.observe(el);
      });

      return () => {
        elements.forEach((el) => {
          observer.unobserve(el);
        });
        observer.disconnect();
      };
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeAnimations, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);
};

export default useScrollAnimation;
