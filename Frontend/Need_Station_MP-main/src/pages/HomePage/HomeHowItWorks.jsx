import styles from './HomeHowItWorks.module.css';
import image from '../../assets/images/HomeHowItWorksImage.jpeg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { useState, useEffect } from 'react';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const HomeHowItWorks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Initialize scroll animations
  useScrollAnimation();

  const steps = [
    { number: 1, text: "Choose a Tasker by price, skills, and reviews" },
    { number: 2, text: "Schedule a Tasker as early as today." },
    { number: 3, text: "Chat, pay, tip, and review all in one place." }
  ];

  // Auto-cycle through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000); // Change step every 3 seconds

    return () => clearInterval(interval);
  }, [steps.length]);

  // Handle Get Started button click
  const handleGetStarted = () => {
    if (user) {
      // If logged in, scroll to top of page
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // If not logged in, redirect to signup page
      navigate('/signup');
    }
  };

  return <>
    
<div className={`${styles["how-it-works-container"]} scroll-animate`}>
  <div className={`${styles["how-it-works-text"]} scroll-animate`}>
      <h2>How it works</h2>
      <div className={`${styles["steps"]}`}>
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`${styles["step"]} ${
                index === currentStep ? styles.active : 
                index === (currentStep - 1 + steps.length) % steps.length ? styles.prev :
                index === (currentStep + 1) % steps.length ? styles.next : ''
              } scroll-animate`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <span className={`${styles["step-number"]}`}>{step.number}</span>
              <p>{step.text}</p>
            </div>
          ))}
      </div>
      
      {/* Navigation dots */}
      <div className={`${styles["stepIndicators"]}`}>
        {steps.map((_, index) => (
          <div
            key={index}
            className={`${styles["stepDot"]} ${index === currentStep ? styles.active : ''}`}
            onClick={() => setCurrentStep(index)}
          />
        ))}
      </div>
      
      <button 
        className={`${styles["get-started"]}`}
        onClick={handleGetStarted}
      >
        Get Started
      </button>
  </div>
  <div className={`${styles["how-it-works-image"]} scroll-animate`}>
      <img src={image} alt="People discussing tasks" />
  </div>
</div>

  </>
}

export default HomeHowItWorks;