import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle2, LogIn, UserPlus, Briefcase } from 'lucide-react';
import './tasker-fixed.css';

// Simple dropdown that appears in a fixed position to ensure visibility
const HindiTaskerDropdown = ({ isVisible }) => {
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Position the dropdown under the button when it becomes visible
  useEffect(() => {
    if (isVisible && dropdownRef.current) {
      const positionDropdown = () => {
        // Find the button
        const taskerButton = document.querySelector('.taskerContainer .becomeTasker');
        if (taskerButton && dropdownRef.current) {
          // Get button position
          const rect = taskerButton.getBoundingClientRect();
          
          // Calculate the center of the button and align dropdown with it
          const buttonCenter = rect.left + (rect.width / 2);
          
          // Position dropdown directly below the button
          dropdownRef.current.style.top = (rect.bottom + window.scrollY) + 'px';
          // Center the dropdown with the button, offset by 25px (arrow position)
          dropdownRef.current.style.left = (buttonCenter - 125 + 25) + 'px'; // 125 is half the dropdown width (250px/2)
          dropdownRef.current.style.right = 'auto'; // Clear any right positioning
        }
      };

      // Position immediately and on resize
      positionDropdown();
      window.addEventListener('resize', positionDropdown);
      
      // Clean up
      return () => {
        window.removeEventListener('resize', positionDropdown);
      };
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="hindiTaskerFixed" ref={dropdownRef}>
      <div className="dropdown-arrow"></div>
      <div className="dropdown-content">
        <div className="dropdown-header">
          <Briefcase size={20} />
          <span>हेल्पर पोर्टल</span>
        </div>
        
        <div className="dropdown-divider"></div>
        
        <Link to="/hi/worker-login" className="dropdown-item">
          <LogIn size={18} />
          <span>हेल्पर लॉगिन</span>
        </Link>
        
        <Link to="/hi/helper-registration" className="dropdown-item">
          <UserPlus size={18} />
          <span>हेल्पर रजिस्ट्रेशन</span>
        </Link>
        
        <Link to="/hi/worker-faq" className="dropdown-item highlighted">
          <UserCircle2 size={18} />
          <span>हेल्पर बनें क्यों?</span>
        </Link>
      </div>
    </div>
  );
};

export default HindiTaskerDropdown;
