import { Link, NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; 
import styles from "./Header.module.css";
import TaskerDropdown from "../TaskerDropdown/TaskerDropdown.jsx";
import ThemeToggle from "../ThemeToggle/ThemeToggle.jsx";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../../store/AuthContext.jsx";
import PortalModal from "../common/PortalModal.jsx";

const Header = () => {
  const { user, logout } = useAuth();
  console.log("AuthContext user:", user);

  const [isTaskerDropdownOpen, setTaskerDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const taskerButtonRef = useRef(null);
  
  // Check current language on mount and when localStorage changes
  useEffect(() => {
    const checkLanguage = () => {
      const lang = localStorage.getItem('needstation-language') || 'en';
      setCurrentLanguage(lang);
    };
    
    // Check on mount
    checkLanguage();
    
    // Listen for storage changes (in case language is changed)
    window.addEventListener('storage', checkLanguage);
    
    return () => {
      window.removeEventListener('storage', checkLanguage);
    };
  }, []);


  const initiateLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogout = () => {
    logout();
  };

  const location = useLocation();


  return (
    <>
      <div className={styles.headerContainer}>
        <header className={styles.header}>
          <Link to="/">
            <div className={styles.logo} data-no-translate="true">
              <span className={styles.needText} data-no-translate="true">Need</span><span className={styles.stationText} data-no-translate="true">Station</span>
            </div>
          </Link>
          <nav className={styles.navLinks}>
            <NavLink to="/" className={({isActive}) => isActive ? styles.active : undefined}>Home</NavLink>
            <NavLink to="/services" className={({isActive}) => isActive ? styles.active : undefined}>Services</NavLink>
            <NavLink to="/language-settings" className={({isActive}) => isActive ? styles.active : undefined}>Languages</NavLink>
            <NavLink to="/about-us" className={({isActive}) => isActive ? styles.active : undefined}>About Us</NavLink>
          </nav>
          <div className={styles.authButtons}>
            <ThemeToggle />
            {user ? (
              <>
                <span className={styles.greeting}>Hello, {user.username}</span>
                <button className={styles.logout} onClick={initiateLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className={styles.login}>Log in</button>
                </Link>
                <Link to="/signup">
                  <button className={styles.signup}>Sign up</button>
                </Link>
                <div 
                  className={styles.taskerContainer}
                  onMouseEnter={() => setTaskerDropdownOpen(true)}
                  onMouseLeave={() => setTaskerDropdownOpen(false)}
                  onClick={() => currentLanguage === 'hi' && setTaskerDropdownOpen(!isTaskerDropdownOpen)}
                  ref={taskerButtonRef}
                  data-language={currentLanguage}
                >
                  <button className={styles.becomeTasker}>
                    Become a Tasker
                  </button>
                  <AnimatePresence>
                    {isTaskerDropdownOpen && <TaskerDropdown isVisible={true} />}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </header>
      </div>

      {/* Logout Confirmation Modal */}
      <PortalModal
        isOpen={showLogoutConfirmation}
        onClose={() => setShowLogoutConfirmation(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out? You will be logged out from your account."
        confirmText="Yes, log out"
        cancelText="Stay logged in"
      />
    </>
  );
};

export default Header;
