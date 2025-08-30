import { Link, NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../../store/AuthContext.jsx";
import HindiTaskerDropdown from "./HindiTaskerDropdown.jsx";
import HindiHeaderDropdown from "./HindiHeaderDropdown.jsx";
import styles from "../Header/Header.module.css";

// Hindi version of the Header component with pre-translated content
const HindiHeader = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isTaskerDropdownOpen, setTaskerDropdownOpen] = useState(false);
  const taskerButtonRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const location = useLocation();
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className={styles.headerContainer}>
        <header className={styles.header}>
          <Link to="/hi">
            <div className={styles.logo} data-no-translate="true">
              <span className={styles.needText} data-no-translate="true">Need</span>
              <span className={styles.stationText} data-no-translate="true">Station</span>
            </div>
          </Link>
          <nav className={styles.navLinks}>
            <NavLink to="/hi" className={({isActive}) => isActive ? styles.active : undefined}>होम</NavLink>
            <button 
              className={`${styles.dropdownToggle} ${location.pathname.includes('/hi/basic-needs') || 
                location.pathname.includes('/hi/maid-services') || 
                location.pathname.includes('/hi/elder-care') ? styles.active : ''}`} 
              onClick={toggleDropdown}
            >
              सेवाएं
            </button>
            <NavLink to="/hi/language-settings" className={({isActive}) => isActive ? styles.active : undefined}>भाषाएँ</NavLink>
            <NavLink to="/hi/about-us" className={({isActive}) => isActive ? styles.active : undefined}>हमारे बारे में</NavLink>
          </nav>
          <div className={styles.authButtons}>
            {user ? (
              <>
                <span className={styles.greeting}>नमस्ते, {user.username}</span>
                <button className={styles.logout} onClick={logout}>
                  लॉगआउट
                </button>
              </>
            ) : (
              <>
                <Link to="/hi/login">
                  <button className={styles.login}>लॉग इन</button>
                </Link>
                <Link to="/hi/signup">
                  <button className={styles.signup}>साइन अप</button>
                </Link>
                <div 
                  className={styles.taskerContainer}
                  onMouseEnter={() => setTaskerDropdownOpen(true)}
                  onMouseLeave={() => setTaskerDropdownOpen(false)}
                  onClick={() => setTaskerDropdownOpen(!isTaskerDropdownOpen)}
                  ref={taskerButtonRef}
                >
                  <button className={styles.becomeTasker}>
                    टास्कर बनें
                  </button>
                  <AnimatePresence>
                    {isTaskerDropdownOpen && <HindiTaskerDropdown isVisible={true} />}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </header>
        {isDropdownOpen && <HindiHeaderDropdown />}
      </div>
    </>
  );
};

export default HindiHeader;
