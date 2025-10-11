import { Link, NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; 
import styles from "./Header.module.css";
import TaskerDropdown from "../TaskerDropdown/TaskerDropdown.jsx";
import ThemeToggle from "../ThemeToggle/ThemeToggle.jsx";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../../store/AuthContext.jsx";
import { useCart } from "../../store/CartContext.jsx";
import PortalModal from "../common/PortalModal.jsx";
import { FaBell, FaUser, FaCog, FaHistory, FaSignOutAlt, FaBars, FaTimes, FaHandsHelping, FaUserTie, FaShoppingCart } from "react-icons/fa";

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  console.log("AuthContext user:", user);

  const [isTaskerDropdownOpen, setTaskerDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWorkerDropdownOpen, setWorkerDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [userProfileData, setUserProfileData] = useState({
    fullName: user?.username || 'User',
    profileImageUrl: null
  });
  const taskerButtonRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const workerButtonRef = useRef(null);
  
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

  // Load user profile data (including profile image)
  useEffect(() => {
    const loadUserProfileData = async () => {
      console.log('🔍 Header: Loading profile data for user:', user);
      
      // Use the actual user ID from your database
      const userId = 11;
      
      try {
        // Try to get from localStorage first (for quick display)
        const cached = localStorage.getItem('userBasicInfo');
        if (cached) {
          const cachedData = JSON.parse(cached);
          console.log('📦 Header: Using cached data:', cachedData);
          setUserProfileData({
            fullName: cachedData.fullName || user?.username || 'User',
            profileImageUrl: cachedData.profileImageUrl
          });
        }
        
        // Then fetch fresh data from backend
        console.log(`🌐 Header: Fetching fresh data from /api/user/profile/${userId}/basic`);
        const response = await fetch(`http://localhost:8080/api/user/profile/${userId}/basic`);
        
        console.log('📡 Header: API Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Header: Loaded user profile data:', data);
          console.log('🖼️ Header: Profile image URL:', data.profileImageUrl);
          
          const profileData = {
            fullName: data.fullName || user?.username || 'User',
            profileImageUrl: data.profileImageUrl
          };
          
          setUserProfileData(profileData);
          console.log('💾 Header: Updated userProfileData:', profileData);
          
          // Cache the data
          localStorage.setItem('userBasicInfo', JSON.stringify(data));
        } else {
          const errorText = await response.text();
          console.error('❌ Header: API Error:', response.status, errorText);
        }
      } catch (error) {
        console.error('❌ Header: Network error:', error);
        // Fallback to user data from auth context
        setUserProfileData({
          fullName: user?.username || 'User',
          profileImageUrl: null
        });
      }
    };

    // Load profile data when component mounts or user changes
    if (user) {
      loadUserProfileData();
    }
  }, [user]);

  // Listen for profile updates from other components
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      console.log('Header: Profile updated event received:', event.detail);
      setUserProfileData({
        fullName: event.detail.fullName || user?.username || 'User',
        profileImageUrl: event.detail.profileImageUrl
      });
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [user]);

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

  // Handle window resize to close mobile dropdowns on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
        setWorkerDropdownOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const initiateLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogout = () => {
    logout();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
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
            <NavLink to="/services" className={({isActive}) => isActive ? styles.active : undefined}>Services</NavLink>
            <NavLink to="/language-settings" className={({isActive}) => isActive ? styles.active : undefined}>
              Languages
            </NavLink>
          </nav>
          <div className={styles.authButtons}>
            <ThemeToggle />
            {/* Services Icon - Only visible on mobile when not logged in */}
            {!user && (
              <Link to="/services" className={styles.servicesIconLink}>
                <button className={styles.servicesIcon} aria-label="Services">
                  <FaHandsHelping size={18} />
                </button>
              </Link>
            )}
            {/* Worker Dropdown - Only visible on mobile when not logged in */}
            {!user && (
              <div 
                className={styles.workerContainer}
                onMouseEnter={() => setWorkerDropdownOpen(true)}
                onMouseLeave={() => setWorkerDropdownOpen(false)}
                onClick={() => setWorkerDropdownOpen(!isWorkerDropdownOpen)}
                ref={workerButtonRef}
              >
                <button className={styles.workerIcon} aria-label="Worker Options">
                  <FaUserTie size={18} />
                </button>
                {isWorkerDropdownOpen && (
                  <div className={styles.workerDropdown}>
                    <Link to="/worker-login" className={styles.workerDropdownItem}>
                      Worker Login
                    </Link>
                    <Link to="/worker-registration" className={styles.workerDropdownItem}>
                      Become a Worker
                    </Link>
                  </div>
                )}
              </div>
            )}
            {/* Mobile Menu Button - Only visible on mobile */}
            <button 
              className={styles.mobileMenuButton}
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
            {user ? (
              <div className={styles.userProfileContainer}>
                {/* Cart Icon */}
                <Link to="/cart" className={styles.cartButton}>
                  <FaShoppingCart size={16} />
                  {cartCount > 0 && (
                    <div className={styles.cartBadge}>{cartCount}</div>
                  )}
                </Link>
                
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
                      {userProfileData.profileImageUrl ? (
                        <img 
                          src={userProfileData.profileImageUrl} 
                          alt="Profile" 
                          className={styles.profileImage}
                          onLoad={() => {
                            console.log('✅ Header: Profile image loaded successfully');
                          }}
                          onError={(e) => {
                            console.error('❌ Header: Profile image failed to load:', userProfileData.profileImageUrl);
                            // Fallback to letter avatar if image fails to load
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        console.log('🔍 Header: No profile image URL, showing letter avatar')
                      )}
                      <div 
                        className={styles.letterAvatar}
                        style={{ 
                          display: userProfileData.profileImageUrl ? 'none' : 'flex' 
                        }}
                      >
                        {userProfileData.fullName ? userProfileData.fullName.charAt(0).toUpperCase() : <FaUser size={12} />}
                      </div>
                    </div>
                    <span className={styles.userName}>{userProfileData.fullName}</span>
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

        {/* Mobile Menu Dropdown - Only visible on mobile */}
        {isMobileMenuOpen && (
          <>
            <div className={styles.mobileMenuOverlay} onClick={closeMobileMenu}></div>
            <div className={styles.mobileMenu}>
              <div className={styles.mobileNavLinks}>
                <NavLink 
                  to="/services" 
                  className={({isActive}) => isActive ? styles.active : undefined}
                  onClick={closeMobileMenu}
                >
                  Services
                </NavLink>
                <NavLink 
                  to="/language-settings" 
                  className={({isActive}) => isActive ? styles.active : undefined}
                  onClick={closeMobileMenu}
                >
                  Languages
                </NavLink>
              </div>
              
              {!user && (
                <div className={styles.mobileAuthButtons}>
                  <Link to="/login" onClick={closeMobileMenu}>
                    <button className={styles.login}>Log in</button>
                  </Link>
                  <Link to="/signup" onClick={closeMobileMenu}>
                    <button className={styles.signup}>Sign up</button>
                  </Link>
                  <div className={styles.mobileTaskerContainer}>
                    <button 
                      className={styles.becomeTasker}
                      onClick={() => {
                        closeMobileMenu();
                        // Handle become tasker action
                      }}
                    >
                      Become a Tasker
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
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
