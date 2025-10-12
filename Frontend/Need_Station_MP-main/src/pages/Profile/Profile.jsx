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
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [otpVerification, setOtpVerification] = useState({
    isRequired: false,
    type: '', // 'phone' or 'email'
    phoneNumber: '',
    email: '',
    otp: '',
    isVerifying: false,
    isVerified: false
  });
  
  // Track original values to detect changes
  const [originalData, setOriginalData] = useState({
    contactNumber: '',
    email: ''
  });
  const [profileData, setProfileData] = useState({
    // Personal Information
    fullName: user?.username || '',
    email: user?.email || '',
    contactNumber: '',
    dateOfBirth: '',
    gender: '',
    
    // Address Information
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Healthcare Preferences
    preferredLanguage: 'english',
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
    trustScore: 4.8,
    profileImageUrl: null
  });

  const [profileImage, setProfileImage] = useState(null);
  
  // Get user ID from auth context or localStorage with multiple fallbacks
  const getUserId = () => {
    // Try to get from user object first
    if (user?.id) return user.id;
    if (user?.userId) return user.userId;
    
    // Try localStorage
    const localUserId = localStorage.getItem('userId');
    if (localUserId) return localUserId;
    
    const localUserID = localStorage.getItem('userID');
    if (localUserID) return localUserID;
    
    // Try to parse from stored user object
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.id) return parsedUser.id;
        if (parsedUser.userId) return parsedUser.userId;
      }
    } catch (e) {
      console.error('Error parsing stored user:', e);
    }
    
    return null;
  };
  
  const userId = getUserId();
  
  // Debug: Log user data to understand structure
  useEffect(() => {
    console.log('🔍 Profile: User data from AuthContext:', user);
    console.log('🔍 Profile: Available localStorage keys:', Object.keys(localStorage));
    console.log('🔍 Profile: localStorage userId:', localStorage.getItem('userId'));
    console.log('🔍 Profile: localStorage user:', localStorage.getItem('user'));
    console.log('🔍 Profile: Detected userId:', userId);
    console.log('🔍 Profile: isAuthenticated:', isAuthenticated);
  }, [user, userId, isAuthenticated]);
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

  // Debug: Log imported images
  useEffect(() => {
    console.log('🖼️ Profile: Imported artwork images:', {
      lightArtwork1,
      lightArtwork2,
      darkArtworkCount: darkArtworkImages.length
    });
  }, []);

  // Detect current theme
  useEffect(() => {
    const detectTheme = () => {
      // Check for theme in localStorage, CSS variables, or body class
      const savedTheme = localStorage.getItem('theme');
      const bodyClass = document.body.className;
      const htmlClass = document.documentElement.className;
      
      console.log('🎨 Profile: Theme detection:', {
        savedTheme,
        bodyClass,
        htmlClass,
        systemPreference: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      });
      
      let detectedTheme = 'light'; // Default to light
      
      if (savedTheme === 'light' || bodyClass.includes('light') || htmlClass.includes('light')) {
        detectedTheme = 'light';
      } else if (savedTheme === 'dark' || bodyClass.includes('dark') || htmlClass.includes('dark')) {
        detectedTheme = 'dark';
      } else {
        // Check CSS custom property or system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        detectedTheme = prefersDark ? 'dark' : 'light';
      }
      
      console.log('🎨 Profile: Detected theme:', detectedTheme);
      setCurrentTheme(detectedTheme);
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
    
    console.log('🖼️ Profile: Generating artwork for:', {
      userState,
      currentTheme,
      lightArtworkImages: lightArtworkImages.length,
      darkArtworkImages: darkArtworkImages.length
    });
    
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
      
      console.log('🌞 Profile: Light theme artwork selected:', {
        randomLightIndex,
        selectedImageUrl,
        selectedColors,
        selectedPattern
      });
    } else {
      // For dark theme, use regional artwork system
      const artwork = regionalArtworks[userState] || regionalArtworks['Karnataka'];
      const randomImageIndex = artwork.imageIndex[Math.floor(Math.random() * artwork.imageIndex.length)];
      selectedImageUrl = darkArtworkImages[randomImageIndex];
      selectedColors = artwork.colors.sort(() => 0.5 - Math.random()).slice(0, 3);
      selectedPattern = artwork.overlayPattern;
      
      console.log('🌙 Profile: Dark theme artwork selected:', {
        randomImageIndex,
        selectedImageUrl,
        selectedColors,
        selectedPattern
      });
    }
    
    const artworkData = {
      imageUrl: selectedImageUrl,
      overlayPattern: selectedPattern,
      colors: selectedColors,
      state: userState,
      theme: currentTheme
    };
    
    console.log('🎨 Profile: Setting background artwork:', artworkData);
    setBackgroundArtwork(artworkData);
  }, [profileData.state, currentTheme]);

  // Load profile data from backend on component mount
  useEffect(() => {
    // Wait for auth to finish loading before checking userId
    if (!authLoading) {
      loadProfileData();
    }
  }, [userId, authLoading]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Wait for auth loading to complete
      if (authLoading) {
        console.log('⏳ Profile: Waiting for authentication to complete...');
        return;
      }
      
      // Check if userId is available
      if (!userId) {
        console.error('No user ID available. Please log in first.');
        console.log('🔍 Available localStorage data:', {
          userId: localStorage.getItem('userId'),
          userID: localStorage.getItem('userID'),
          user: localStorage.getItem('user'),
          username: localStorage.getItem('username'),
          userEmail: localStorage.getItem('userEmail'),
          isAuthenticated: isAuthenticated
        });
        setError('Please log in to view your profile.');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`http://localhost:8080/api/user/profile/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded profile data:', data);
        
        const loadedData = {
          fullName: data.fullName || '',
          email: data.email || '',
          contactNumber: data.contactNumber || '',
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender?.toLowerCase() || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
          preferredLanguage: data.preferredLanguage || 'english',
          emergencyContact: data.emergencyContact || '',
          emergencyPhone: data.emergencyPhone || '',
          medicalConditions: data.medicalConditions || '',
          allergies: data.allergies || '',
          preferredServiceTime: data.preferredServiceTime?.toLowerCase() || 'morning',
          specialInstructions: data.specialInstructions || '',
          memberSince: data.memberSince || '2024',
          totalBookings: data.totalBookings || 0,
          trustScore: data.trustScore || 4.8,
          profileImageUrl: data.profileImageUrl
        };
        
        setProfileData(loadedData);
        
        // Store original values for change detection
        setOriginalData({
          contactNumber: data.contactNumber || '',
          email: data.email || ''
        });

        // Set profile image if exists
        if (data.profileImageUrl) {
          setProfileImage(data.profileImageUrl);
        }
      } else {
        console.error('Failed to load profile data');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };
  
  // Check if phone number exists in database
  const checkPhoneNumberExists = async (phoneNumber) => {
    try {
      const response = await fetch(`http://localhost:8080/api/user/profile/check-phone/${encodeURIComponent(phoneNumber)}`);
      const result = await response.json();
      return result.exists;
    } catch (error) {
      console.error('Error checking phone number:', error);
      return false;
    }
  };
  
  // Check if email exists in database
  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`http://localhost:8080/api/user/profile/check-email/${encodeURIComponent(email)}`);
      const result = await response.json();
      return result.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };
  
  // Initiate phone verification with OTP
  const initiatePhoneVerification = async (phoneNumber) => {
    try {
      setOtpVerification(prev => ({ 
        ...prev, 
        isRequired: true, 
        type: 'phone',
        phoneNumber, 
        isVerifying: true 
      }));
      
      const response = await fetch('http://localhost:8080/api/user/profile/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setOtpVerification(prev => ({ ...prev, isVerifying: false }));
        alert('OTP sent to your phone number. Please verify to continue.');
      } else {
        throw new Error(result.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send OTP. Please try again.');
      setOtpVerification(prev => ({ ...prev, isRequired: false, isVerifying: false }));
    }
  };
  
  // Initiate email verification with OTP
  const initiateEmailVerification = async (email) => {
    try {
      setOtpVerification(prev => ({ 
        ...prev, 
        isRequired: true, 
        type: 'email',
        email, 
        isVerifying: true 
      }));
      
      const response = await fetch('http://localhost:8080/api/user/profile/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setOtpVerification(prev => ({ ...prev, isVerifying: false }));
        alert('OTP sent to your email address. Please verify to continue.');
      } else {
        throw new Error(result.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending email OTP:', error);
      setError('Failed to send email OTP. Please try again.');
      setOtpVerification(prev => ({ ...prev, isRequired: false, isVerifying: false }));
    }
  };
  
  // Verify OTP
  const verifyOtp = async () => {
    try {
      setOtpVerification(prev => ({ ...prev, isVerifying: true }));
      
      const endpoint = otpVerification.type === 'email' ? 
        'http://localhost:8080/api/user/profile/verify-email-otp' : 
        'http://localhost:8080/api/user/profile/verify-otp';
      
      const requestBody = otpVerification.type === 'email' ? 
        { email: otpVerification.email, otp: otpVerification.otp } :
        { phoneNumber: otpVerification.phoneNumber, otp: otpVerification.otp };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setOtpVerification(prev => ({ ...prev, isVerified: true, isVerifying: false, isRequired: false }));
        const verifiedType = otpVerification.type === 'email' ? 'Email' : 'Phone number';
        alert(`${verifiedType} verified successfully!`);
        // Continue with profile save
        handleSave();
      } else {
        throw new Error(result.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Invalid OTP. Please try again.');
      setOtpVerification(prev => ({ ...prev, isVerifying: false }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Debug: Log all available user data
      console.log('🔍 handleSave - Checking userId:', {
        userId,
        user,
        isAuthenticated,
        authLoading,
        localStorageUserId: localStorage.getItem('userId'),
        localStorageUser: localStorage.getItem('user')
      });
      
      // Check if userId is available
      if (!userId) {
        console.error('❌ No user ID available. Please log in first.');
        console.error('Available data:', {
          user,
          isAuthenticated,
          localStorage: {
            userId: localStorage.getItem('userId'),
            user: localStorage.getItem('user'),
            username: localStorage.getItem('username')
          }
        });
        setError('Please log in to save your profile. User ID not found.');
        setSaving(false);
        return;
      }
      
      console.log('✅ UserId found:', userId);
      
      // Check if phone number or email changed and requires verification
      const phoneChanged = originalData.contactNumber !== profileData.contactNumber && profileData.contactNumber;
      const emailChanged = originalData.email !== profileData.email && profileData.email;
      
      if (phoneChanged) {
        // Check if phone number exists in database
        const phoneExists = await checkPhoneNumberExists(profileData.contactNumber);
        if (phoneExists) {
          setError('This phone number is already registered with another account.');
          setSaving(false);
          return;
        }
        
        // Require OTP verification for phone number change
        if (!otpVerification.isVerified || otpVerification.type !== 'phone') {
          await initiatePhoneVerification(profileData.contactNumber);
          setSaving(false);
          return;
        }
      }
      
      if (emailChanged) {
        // Check if email exists in database
        const emailExists = await checkEmailExists(profileData.email);
        if (emailExists) {
          setError('This email address is already registered with another account.');
          setSaving(false);
          return;
        }
        
        // Require OTP verification for email change
        if (!otpVerification.isVerified || otpVerification.type !== 'email') {
          await initiateEmailVerification(profileData.email);
          setSaving(false);
          return;
        }
      }
      
      // Step 1: Upload image if selected
      if (selectedImage) {
        console.log('Uploading new profile image...');
        const imageFormData = new FormData();
        imageFormData.append('image', selectedImage);
        
        const imageResponse = await fetch(`http://localhost:8080/api/user/profile/${userId}/upload-image`, {
          method: 'POST',
          body: imageFormData
        });
        
        const imageResult = await imageResponse.json();
        
        if (!imageResult.success) {
          throw new Error('Image upload failed: ' + imageResult.message);
        }
        
        console.log('Image uploaded successfully:', imageResult.imageUrl);
        setProfileImage(imageResult.imageUrl);
      }
      
      // Step 2: Save form data
      console.log('Saving profile data...');
      const response = await fetch(`http://localhost:8080/api/user/profile/${userId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('Profile saved successfully');
        setIsEditing(false);
        setSelectedImage(null);
        
        // Update header display
        updateHeaderDisplay();
        
        // Show success message
        alert('✅ Profile saved successfully!');
        
        // Reload profile data to get latest from server
        await loadProfileData();
      } else {
        throw new Error(result.message);
      }
      
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('❌ Error saving profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedImage(null);
    // Reset profile image to original
    if (profileData.profileImageUrl) {
      setProfileImage(profileData.profileImageUrl);
    }
    // Reload original data
    loadProfileData();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Maximum 5MB allowed.');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Update header display
  const updateHeaderDisplay = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/user/profile/${userId}/basic`);
      if (response.ok) {
        const basicInfo = await response.json();
        
        // Update localStorage and trigger header refresh
        localStorage.setItem('userBasicInfo', JSON.stringify(basicInfo));
        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: basicInfo }));
      }
    } catch (error) {
      console.error('Error updating header:', error);
    }
  };

  // Show loading screen while auth or data is being loaded
  if (authLoading || loading) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>{authLoading ? 'Restoring your session...' : 'Loading your profile...'}</p>
        </div>
      </div>
    );
  }
  
  // Show OTP verification modal
  if (otpVerification.isRequired) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.otpModal}>
          <div className={styles.otpContent}>
            <h2>Verify {otpVerification.type === 'email' ? 'Email Address' : 'Phone Number'}</h2>
            <p>We've sent an OTP to {otpVerification.type === 'email' ? otpVerification.email : otpVerification.phoneNumber}</p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otpVerification.otp}
              onChange={(e) => setOtpVerification(prev => ({ ...prev, otp: e.target.value }))}
              className={styles.otpInput}
              maxLength={6}
            />
            {error && <div className={styles.errorMessage}>{error}</div>}
            <div className={styles.otpActions}>
              <button 
                onClick={verifyOtp} 
                disabled={otpVerification.isVerifying || !otpVerification.otp}
                className={styles.verifyButton}
              >
                {otpVerification.isVerifying ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button 
                onClick={() => setOtpVerification({ isRequired: false, type: '', phoneNumber: '', email: '', otp: '', isVerifying: false, isVerified: false })}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      {/* Error Display */}
      {error && (
        <div className={styles.errorBanner}>
          <span>{error}</span>
          <button onClick={() => setError(null)} className={styles.closeError}>×</button>
        </div>
      )}
      
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
                  backgroundImage: `url("${backgroundArtwork.imageUrl}")`,
                  // Fallback with decoded URL
                  '--fallback-image': `url("${decodeURIComponent(backgroundArtwork.imageUrl)}")`
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
                <button 
                  className={styles.saveButton} 
                  onClick={handleSave}
                  disabled={saving}
                  style={{ opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? '⏳ Saving...' : <><FaSave /> Save</>}
                </button>
                <button 
                  className={styles.cancelButton} 
                  onClick={handleCancel}
                  disabled={saving}
                  style={{ opacity: saving ? 0.7 : 1 }}
                >
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
                    name="contactNumber"
                    value={profileData.contactNumber}
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