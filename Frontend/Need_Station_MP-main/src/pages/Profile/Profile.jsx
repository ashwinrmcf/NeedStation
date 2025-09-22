import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import styles from './Profile.module.css';
import { 
  FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaEdit, FaSave, FaTimes,
  FaHeart, FaUserMd, FaCalendarAlt, FaShieldAlt, FaCamera, FaStar,
  FaHome, FaUsers, FaClock, FaCheckCircle
} from 'react-icons/fa';

// Import artwork images - Dark Theme
import artwork1 from '../../assets/images/Profile Artwork/1.png';
import artwork2 from '../../assets/images/Profile Artwork/2.png';
import artwork3 from '../../assets/images/Profile Artwork/3 (1).png';
import artwork4 from '../../assets/images/Profile Artwork/4.png';
import artwork5 from '../../assets/images/Profile Artwork/5.png';
import artwork6 from '../../assets/images/Profile Artwork/6.png';
import artwork7 from '../../assets/images/Profile Artwork/7.png';

// Import artwork images - Light Theme
import lightArtwork1 from '../../assets/images/Profile Artwork/Light Theme/1 (1).png';
import lightArtwork2 from '../../assets/images/Profile Artwork/Light Theme/2 (1).png';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    // Personal Information
    fullName: user?.username || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    
    // Address Information
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Healthcare Preferences
    preferredLanguage: 'English',
    emergencyContact: '',
    emergencyPhone: '',
    medicalConditions: '',
    allergies: '',
    
    // Service Preferences
    preferredServiceTime: 'morning',
    specialInstructions: '',
    
    // Profile Stats (read-only)
    memberSince: '2024',
    totalBookings: 0,
    favoriteServices: [],
    trustScore: 4.8
  });

  const [profileImage, setProfileImage] = useState(null);
  const [backgroundArtwork, setBackgroundArtwork] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('dark');

  // Dark theme artwork images array
  const darkArtworkImages = [
    artwork1,
    artwork2,
    artwork3,
    artwork4,
    artwork5,
    artwork6,
    artwork7
  ];

  // Light theme artwork images array
  const lightArtworkImages = [
    lightArtwork1,
    lightArtwork2
  ];

  // Detect current theme
  useEffect(() => {
    const detectTheme = () => {
      // Check for theme in localStorage, CSS variables, or body class
      const savedTheme = localStorage.getItem('theme');
      const bodyClass = document.body.className;
      const htmlClass = document.documentElement.className;
      
      if (savedTheme === 'light' || bodyClass.includes('light') || htmlClass.includes('light')) {
        setCurrentTheme('light');
      } else if (savedTheme === 'dark' || bodyClass.includes('dark') || htmlClass.includes('dark')) {
        setCurrentTheme('dark');
      } else {
        // Check CSS custom property or system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setCurrentTheme(prefersDark ? 'dark' : 'light');
      }
    };

    detectTheme();

    // Listen for theme changes
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Listen for localStorage changes
    window.addEventListener('storage', detectTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', detectTheme);
    };
  }, []);

  // Regional artwork based on user's location
  const regionalArtworks = {
    'Karnataka': {
      imageIndex: [0, 3, 6], // Specific images for Karnataka
      colors: ['#FFD700', '#FF6B35', '#8B4513', '#228B22'],
      overlayPattern: 'mysore-palace'
    },
    'Maharashtra': {
      imageIndex: [1, 4], // Warli and traditional art
      colors: ['#FF4500', '#32CD32', '#4169E1', '#FFD700'],
      overlayPattern: 'warli-art'
    },
    'Tamil Nadu': {
      imageIndex: [2, 5], // Temple and traditional patterns
      colors: ['#DC143C', '#FFD700', '#228B22', '#4169E1'],
      overlayPattern: 'tanjore-painting'
    },
    'West Bengal': {
      imageIndex: [0, 2, 4], // Cultural and heritage art
      colors: ['#FF1493', '#FFD700', '#32CD32', '#4169E1'],
      overlayPattern: 'bengali-alpona'
    },
    'Delhi': {
      imageIndex: [1, 3, 5], // Mughal and modern patterns
      colors: ['#DC143C', '#FFD700', '#228B22', '#4169E1'],
      overlayPattern: 'mughal-architecture'
    },
    'Gujarat': {
      imageIndex: [2, 6], // Mirror work and textile patterns
      colors: ['#FF6347', '#32CD32', '#4169E1', '#FFD700'],
      overlayPattern: 'gujarati-mirror'
    },
    'Rajasthan': {
      imageIndex: [0, 1, 6], // Royal and desert themes
      colors: ['#FF1493', '#FFD700', '#FF4500', '#4169E1'],
      overlayPattern: 'rajasthani-miniature'
    },
    'Kerala': {
      imageIndex: [3, 4, 5], // Mural and nature themes
      colors: ['#228B22', '#FFD700', '#DC143C', '#4169E1'],
      overlayPattern: 'kerala-mural'
    },
    'Punjab': {
      imageIndex: [0, 3, 6], // Golden and vibrant themes
      colors: ['#FFD700', '#FF4500', '#228B22', '#4169E1'],
      overlayPattern: 'punjabi-phulkari'
    },
    'Andhra Pradesh': {
      imageIndex: [1, 2, 5], // Kalamkari and traditional art
      colors: ['#4169E1', '#FFD700', '#DC143C', '#228B22'],
      overlayPattern: 'kalamkari-art'
    }
  };

  // Generate background artwork based on user's state/region and theme
  useEffect(() => {
    const userState = profileData.state || 'Karnataka'; // Default to Karnataka
    
    let selectedImageUrl;
    let selectedColors;
    let selectedPattern;

    if (currentTheme === 'light') {
      // For light theme, use only the 2 light theme images
      const randomLightIndex = Math.floor(Math.random() * lightArtworkImages.length);
      selectedImageUrl = lightArtworkImages[randomLightIndex];
      // Light theme colors - softer, brighter palette
      selectedColors = ['#4A90E2', '#50C878', '#FFB347', '#FF6B9D'];
      selectedPattern = 'light-theme-pattern';
    } else {
      // For dark theme, use regional artwork system
      const artwork = regionalArtworks[userState] || regionalArtworks['Karnataka'];
      const randomImageIndex = artwork.imageIndex[Math.floor(Math.random() * artwork.imageIndex.length)];
      selectedImageUrl = darkArtworkImages[randomImageIndex];
      selectedColors = artwork.colors.sort(() => 0.5 - Math.random()).slice(0, 3);
      selectedPattern = artwork.overlayPattern;
    }
    
    setBackgroundArtwork({
      imageUrl: selectedImageUrl,
      overlayPattern: selectedPattern,
      colors: selectedColors,
      state: userState,
      theme: currentTheme
    });
  }, [profileData.state, currentTheme]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
    // Show success message
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.profileContainer}>
      {/* Header Section */}
      <div className={styles.profileHeader}>
        <div 
          className={styles.headerBackground}
          style={{
            '--artwork-color-1': backgroundArtwork?.colors[0] || '#00E0B8',
            '--artwork-color-2': backgroundArtwork?.colors[1] || '#00B8A3',
            '--artwork-color-3': backgroundArtwork?.colors[2] || '#008B8B'
          }}
          data-pattern={backgroundArtwork?.overlayPattern}
          data-state={backgroundArtwork?.state}
          data-theme={backgroundArtwork?.theme}
        >
          {backgroundArtwork && (
            <div className={styles.artworkOverlay}>
              <div 
                className={styles.artworkImage}
                style={{
                  backgroundImage: `url(${backgroundArtwork.imageUrl})`
                }}
              ></div>
              <div className={styles.artworkPattern}></div>
            </div>
          )}
        </div>
        <div className={styles.profileHeaderContent}>
          <div className={styles.profileImageSection}>
            <div className={styles.profileImageWrapper}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" className={styles.profileImage} />
              ) : (
                <div className={styles.profileImagePlaceholder}>
                  <FaUser size={40} />
                </div>
              )}
              <label className={styles.imageUploadButton}>
                <FaCamera size={16} />
                <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
              </label>
            </div>
          </div>
          
          <div className={styles.profileInfo}>
            <h1 className={styles.profileName}>{profileData.fullName || 'Complete Your Profile'}</h1>
            <p className={styles.profileSubtitle}>Trusted Care Seeker</p>
            <div className={styles.profileStats}>
              <div className={styles.statItem}>
                <FaCalendarAlt className={styles.statIcon} />
                <span>Member since {profileData.memberSince}</span>
              </div>
              <div className={styles.statItem}>
                <FaStar className={styles.statIcon} />
                <span>{profileData.trustScore}/5 Trust Score</span>
              </div>
              <div className={styles.statItem}>
                <FaCheckCircle className={styles.statIcon} />
                <span>{profileData.totalBookings} Services Booked</span>
              </div>
            </div>
          </div>

          <div className={styles.profileActions}>
            {!isEditing ? (
              <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <div className={styles.editActions}>
                <button className={styles.saveButton} onClick={handleSave}>
                  <FaSave /> Save
                </button>
                <button className={styles.cancelButton} onClick={handleCancel}>
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.profileContent}>
        <div className={styles.contentGrid}>
          {/* Personal Information */}
          <div className={styles.profileSection}>
            <div className={styles.sectionHeader}>
              <FaUser className={styles.sectionIcon} />
              <h2>Personal Information</h2>
            </div>
            <div className={styles.sectionContent}>
              <div className={styles.inputGrid}>
                <div className={styles.inputGroup}>
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={styles.input}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={profileData.gender}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={styles.input}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>Preferred Language</label>
                  <select
                    name="preferredLanguage"
                    value={profileData.preferredLanguage}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={styles.input}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Marathi">Marathi</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className={styles.profileSection}>
            <div className={styles.sectionHeader}>
              <FaMapMarkerAlt className={styles.sectionIcon} />
              <h2>Address Information</h2>
            </div>
            <div className={styles.sectionContent}>
              <div className={styles.inputGrid}>
                <div className={styles.inputGroup} style={{gridColumn: '1 / -1'}}>
                  <label>Complete Address *</label>
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={styles.textarea}
                    placeholder="House/Flat No., Building Name, Street, Area"
                    rows="3"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={profileData.state}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>PIN Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={profileData.pincode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={styles.input}
                    placeholder="XXXXXX"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Healthcare Information */}
          <div className={styles.profileSection}>
            <div className={styles.sectionHeader}>
              <FaHeart className={styles.sectionIcon} />
              <h2>Healthcare Information</h2>
            </div>
            <div className={styles.sectionContent}>
              <div className={styles.inputGrid}>
                <div className={styles.inputGroup}>
                  <label>Emergency Contact Name</label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={profileData.emergencyContact}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={styles.input}
                    placeholder="Full Name"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Emergency Contact Phone</label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={profileData.emergencyPhone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={styles.input}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div className={styles.inputGroup} style={{gridColumn: '1 / -1'}}>
                  <label>Medical Conditions</label>
                  <textarea
                    name="medicalConditions"
                    value={profileData.medicalConditions}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={styles.textarea}
                    placeholder="Any chronic conditions, ongoing treatments, etc."
                    rows="3"
                  />
                </div>
                <div className={styles.inputGroup} style={{gridColumn: '1 / -1'}}>
                  <label>Allergies & Medications</label>
                  <textarea
                    name="allergies"
                    value={profileData.allergies}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={styles.textarea}
                    placeholder="Food allergies, drug allergies, current medications, etc."
                    rows="3"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Service Preferences */}
          <div className={styles.profileSection}>
            <div className={styles.sectionHeader}>
              <FaClock className={styles.sectionIcon} />
              <h2>Service Preferences</h2>
            </div>
            <div className={styles.sectionContent}>
              <div className={styles.inputGrid}>
                <div className={styles.inputGroup}>
                  <label>Preferred Service Time</label>
                  <select
                    name="preferredServiceTime"
                    value={profileData.preferredServiceTime}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={styles.input}
                  >
                    <option value="morning">Morning (6 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                    <option value="evening">Evening (6 PM - 10 PM)</option>
                    <option value="night">Night (10 PM - 6 AM)</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                <div className={styles.inputGroup} style={{gridColumn: '1 / -1'}}>
                  <label>Special Instructions</label>
                  <textarea
                    name="specialInstructions"
                    value={profileData.specialInstructions}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={styles.textarea}
                    placeholder="Any special requirements, accessibility needs, or instructions for service providers"
                    rows="3"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
