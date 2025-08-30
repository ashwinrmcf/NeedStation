import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TaskerDropdownOverlay.css';

// A completely separate overlay component that renders directly in the body
const TaskerDropdownOverlay = ({ isVisible, onClose }) => {
  useEffect(() => {
    // Prevent scrolling when overlay is visible
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('overlay')) {
      onClose();
    }
  };

  return (
    <div className="overlay" onClick={handleOverlayClick}>
      <div className="overlay-dropdown">
        <div className="overlay-header">
          <span>हेल्पर पोर्टल</span>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        
        <div className="divider"></div>
        
        <Link to="/hi/worker-login" className="dropdown-link">
          हेल्पर के रूप में लॉग इन करें
        </Link>
        
        <Link to="/hi/helper-registration" className="dropdown-link">
          हेल्पर के रूप में पंजीकरण करें
        </Link>
        
        <Link to="/hi/worker-faq" className="dropdown-link highlighted">
          हेल्पर क्यों बनें?
        </Link>
      </div>
    </div>
  );
};

export default TaskerDropdownOverlay;
