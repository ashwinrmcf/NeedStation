import { Link, NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; 
import styles from "./Header.module.css";
import TaskerDropdown from "../TaskerDropdown/TaskerDropdown.jsx";
import ThemeToggle from "../ThemeToggle/ThemeToggle.jsx";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../../store/AuthContext.jsx";
import PortalModal from "../common/PortalModal.jsx";
import { FaBell, FaUser, FaCog, FaHistory, FaSignOutAlt } from "react-icons/fa";

const Header = () => {
  const { user, logout } = useAuth();
  console.log("AuthContext user:", user);

  const [isTaskerDropdownOpen, setTaskerDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const taskerButtonRef = useRef(null);
  const profileDropdownRef = useRef(null);
  
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

  // Handle click outside profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
              <div className={styles.userProfileContainer}>
                {/* Notification Bell */}
                <button className={styles.notificationButton}>
                  <FaBell size={16} />
                  <div className={styles.notificationDot}></div>
                </button>
                
                {/* User Profile Dropdown */}
                <div className={styles.userProfile} ref={profileDropdownRef}>
                  <button 
                    className={styles.userProfileButton}
                    onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
                  >
                    <div className={styles.userAvatar}>
                      {user.username ? user.username.charAt(0).toUpperCase() : <FaUser size={12} />}
                    </div>
                    <span className={styles.userName}>{user.username || 'User'}</span>
                  </button>
                  
                  {isProfileDropdownOpen && (
                    <div className={styles.userDropdown}>
                      <Link to="/profile" className={styles.profileLink}>
                        <FaUser size={14} style={{ marginRight: '8px' }} />
                        My Profile
                      </Link>
                      <Link to="/bookings" className={styles.profileLink}>
                        <FaHistory size={14} style={{ marginRight: '8px' }} />
                        My Bookings
                      </Link>
                      <Link to="/settings" className={styles.profileLink}>
                        <FaCog size={14} style={{ marginRight: '8px' }} />
                        Settings
                      </Link>
                      <button className={styles.logoutButton} onClick={initiateLogout}>
                        <FaSignOutAlt size={14} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
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
