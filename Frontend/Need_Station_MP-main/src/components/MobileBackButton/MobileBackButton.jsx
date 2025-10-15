import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from './MobileBackButton.module.css';

const MobileBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on home page
  if (location.pathname === '/' || location.pathname === '/home') {
    return null;
  }

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button 
      className={styles.mobileBackButton}
      onClick={handleBack}
      aria-label="Go back"
    >
      <ArrowLeft size={24} />
    </button>
  );
};

export default MobileBackButton;
