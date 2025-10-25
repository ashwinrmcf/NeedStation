import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, MapPin, Clock, User, Phone, Calendar, Shield } from 'lucide-react';
import { getServiceConfiguration } from '../../data/ServiceConfigurations';
import { getServiceConfiguration as getServiceConfigFromAPI, createBooking } from '../../services/bookingApi';
import LeafletMapPicker from '../Map/LeafletMapPicker';
import styles from './BookingModal.module.css';

const BookingModal = ({ isOpen, onClose, serviceName, onBookingComplete, userProfile }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Contact & Location Info
    phone: '',
    alternatePhone: '',
    latitude: null,
    longitude: null,
    address: '',
    pincode: '',
    landmark: '',
    
    // Step 2: Service Details (dynamic based on service)
    serviceDetails: {},
    
    // Step 3: Scheduling
    preferredDate: '',
    preferredTime: '',
    urgency: 'normal',
    preferredTimeSlot: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const [locationSaved, setLocationSaved] = useState(false);
  const [apiServiceConfig, setApiServiceConfig] = useState(null);
  const [selectedSubServices, setSelectedSubServices] = useState([]);

  // Get service configuration for dynamic fields (fallback to local config)
  // Remove apostrophes and special characters before converting to config key
  const serviceConfig = getServiceConfiguration(
    serviceName?.toUpperCase().replace(/[']/g, '').replace(/\s+/g, '_') || ''
  );

  // Fetch service configuration from API
  useEffect(() => {
    const fetchServiceConfig = async () => {
      if (isOpen && serviceName) {
        try {
          const serviceCodeMap = {
            'HOME SECURITY GUARD': 'HOME_SECURITY_GUARD',
            'ELDERLY CARE': 'ELDERLY_CARE',
            'NURSING CARE': 'NURSING_CARE',
            'PATHOLOGY CARE': 'PATHOLOGY_CARE',
            'DIABETES MANAGEMENT': 'DIABETES_MANAGEMENT',
            'HEALTH CHECK-UP SERVICES': 'HEALTH_CHECKUP_SERVICES',
            'PHYSIOTHERAPY': 'PHYSIOTHERAPY',
            'POST-SURGERY CARE': 'POST_SURGERY_CARE',
            'CARETAKER AT HOME': 'CARETAKER_AT_HOME',
            "PARKINSON'S CARE": 'PARKINSONS_CARE',
            'PARKINSONS CARE': 'PARKINSONS_CARE',
            'BEDRIDDEN PATIENT CARE': 'BEDRIDDEN_PATIENT_CARE',
            'MOTHER AND BABY CARE': 'MOTHER_AND_BABY_CARE',
            'PARALYSIS CARE': 'PARALYSIS_CARE'
          };
          
          const serviceCode = serviceCodeMap[serviceName.toUpperCase()] || serviceName.toUpperCase().replace(/[']/g, '').replace(/\s+/g, '_');
          console.log('🔍 Fetching service config for:', serviceCode);
          
          const config = await getServiceConfigFromAPI(serviceCode);
          console.log('✅ Service config loaded:', config);
          
          setApiServiceConfig(config);
        } catch (error) {
          console.error('❌ Error loading service config:', error);
          // Don't use fallback - let user know service is not available
          setApiServiceConfig(null);
        }
      }
    };
    
    fetchServiceConfig();
  }, [isOpen, serviceName]);

  // Auto-fill phone number and location data from database first, then fall back to profile
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedSubServices([]); // Reset subservices
      
      // Reset form first
      setErrors({});
      setOtpSent(false);
      setOtp('');
      setPhoneVerified(false); // Reset phone verification status
      
      // Scroll to top when modal opens
      setTimeout(() => {
        const modalContent = document.querySelector(`.${styles.modalContent}`);
        if (modalContent) {
          modalContent.scrollTo({ top: 0, behavior: 'auto' });
        }
      }, 100);
      
      // Load user data from database (priority: DB -> Profile)
      const loadUserData = async () => {
        console.log('🔍 userProfile object:', userProfile);
        console.log('🔍 userProfile.id:', userProfile?.id);
        console.log('🔍 userProfile.userId:', userProfile?.userId);
        console.log('🔍 localStorage userId:', localStorage.getItem('userId'));
        
        const userId = userProfile?.id || userProfile?.userId || localStorage.getItem('userId');
        console.log('🔍 Final userId to use:', userId);
        
        if (!userId || userId === 'undefined' || userId === 'null') {
          console.warn('⚠️ No valid userId found - skipping data load');
          // Set default form with just phone from profile
          setFormData({
            phone: userProfile?.phone || userProfile?.mobile || '',
            alternatePhone: '',
            latitude: null,
            longitude: null,
            address: '',
            pincode: '',
            landmark: '',
            serviceDetails: {},
            preferredDate: '',
            preferredTime: '',
            urgency: 'normal',
            preferredTimeSlot: ''
          });
          setPhoneVerified(userProfile?.phoneVerified || false);
          return;
        }
        
        try {
          // Fetch from database (single source of truth)
          const response = await fetch(`http://localhost:8080/api/user/profile/${userId}`);
            if (response.ok) {
              const dbData = await response.json();
              console.log('📦 Database data received:', JSON.stringify(dbData, null, 2));
              
              // Get all data from database only
              const phone = dbData.contactNumber || '';
              
              console.log('📞 Phone from DB:', phone);
              console.log('🔍 dbData.phoneVerified value:', dbData.phoneVerified);
              console.log('🔍 dbData.phoneVerified type:', typeof dbData.phoneVerified);
              
              // If phone exists in database, assume it's verified
              // This is because if user has a phone saved, they must have entered it before
              if (phone && phone.trim() !== '') {
                console.log('✅ Phone exists in DB - marking as verified');
                setPhoneVerified(true);
              } else {
                console.log('⚠️ No phone in DB - needs verification');
                setPhoneVerified(false);
              }
              
              // Check if we have saved location data in DB
              const hasLocationData = dbData.locationLat && dbData.locationLng;
              
              if (hasLocationData) {
                const savedLocation = {
                  lat: dbData.locationLat,
                  lng: dbData.locationLng,
                  address: dbData.locationAddress || dbData.address || `${dbData.locationLat}, ${dbData.locationLng}`
                };
                
                console.log('✅ Setting saved location from DB:', savedLocation);
                setSelectedLocation(savedLocation);
                
                // Autofill all fields from database
                setFormData({
                  phone: phone,
                  alternatePhone: dbData.alternateContact || '',
                  latitude: dbData.locationLat,
                  longitude: dbData.locationLng,
                  address: dbData.address || '',
                  pincode: dbData.pincode || '',
                  landmark: dbData.landmark || '',
                  serviceDetails: {},
                  preferredDate: '',
                  preferredTime: '',
                  urgency: 'normal',
                  preferredTimeSlot: ''
                });
                
                console.log('✅ Form autofilled with DB data');
              } else {
                console.log('ℹ️ No saved location found in DB');
                // No saved location, set form with phone and basic data from DB
                setFormData({
                  phone: phone,
                  alternatePhone: dbData.alternateContact || '',
                  latitude: null,
                  longitude: null,
                  address: dbData.address || '',
                  pincode: dbData.pincode || '',
                  landmark: dbData.landmark || '',
                  serviceDetails: {},
                  preferredDate: '',
                  preferredTime: '',
                  urgency: 'normal',
                  preferredTimeSlot: ''
                });
                setSelectedLocation(null);
              }
            } else {
              console.log('⚠️ Failed to fetch from DB');
              // If DB fetch fails, show empty form and require verification
              setFormData({
                phone: '',
                alternatePhone: '',
                latitude: null,
                longitude: null,
                address: '',
                pincode: '',
                landmark: '',
                serviceDetails: {},
                preferredDate: '',
                preferredTime: '',
                urgency: 'normal',
                preferredTimeSlot: ''
              });
              setSelectedLocation(null);
              setPhoneVerified(false);
            }
          } catch (error) {
            console.error('❌ Error loading user data:', error);
            // Set default form on error - require verification
            const phoneFromProfile = userProfile?.phone || userProfile?.mobile || '';
            setPhoneVerified(false); // Always require verification on error
            
            setFormData({
              phone: phoneFromProfile,
              alternatePhone: '',
              latitude: null,
              longitude: null,
              address: '',
              pincode: '',
              landmark: '',
              serviceDetails: {},
              preferredDate: '',
              preferredTime: '',
              urgency: 'normal',
              preferredTimeSlot: ''
            });
            setSelectedLocation(null);
          }
      };
      
      // Load user data
      loadUserData();
    }
  }, [isOpen, userProfile]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    // If phone number is being changed and it was previously verified
    if (field === 'phone' && phoneVerified && value !== formData.phone) {
      setPhoneVerified(false);
      setOtpSent(false);
      setOtp('');
      // Clear verification status from localStorage
      localStorage.removeItem('phoneVerified');
      localStorage.removeItem('mobileVerified');
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleServiceDetailChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      serviceDetails: {
        ...prev.serviceDetails,
        [field]: value
      }
    }));
  };

  // Handle location selection from map
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    // Don't auto-save, wait for user to click Save Location button
  };

  // Save selected location
  const saveLocation = async () => {
    if (selectedLocation) {
      // Update form data locally
      setFormData(prev => ({
        ...prev,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng
      }));
      
      // Clear location error if it exists
      if (errors.location) {
        setErrors(prev => ({ ...prev, location: '' }));
      }
      
      // Save to database if user is logged in
      if (userProfile?.username || userProfile?.email) {
        setIsSavingLocation(true);
        try {
          const locationData = {
            userId: userProfile?.id || userProfile?.userId || localStorage.getItem('userId'),
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
            address: formData.address || selectedLocation.address || `${selectedLocation.lat}, ${selectedLocation.lng}`
          };
          
          console.log('🔍 Frontend: Sending location data:', locationData);
          console.log('🔍 Frontend: userProfile:', userProfile);
          console.log('🔍 Frontend: selectedLocation:', selectedLocation);
          console.log('🔍 Frontend: formData.address:', formData.address);
          
          const response = await fetch('http://localhost:8080/api/user/update-location', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(locationData)
          });
          
          if (response.ok) {
            console.log('Location saved to database successfully');
            setLocationSaved(true);
            // Hide success message after 3 seconds
            setTimeout(() => setLocationSaved(false), 3000);
          } else {
            console.error('Failed to save location to database');
          }
        } catch (error) {
          console.error('Error saving location to database:', error);
        } finally {
          setIsSavingLocation(false);
        }
      }
    }
  };

  // Handle change number - reset verification status
  const handleChangeNumber = () => {
    setPhoneVerified(false);
    setOtpSent(false);
    setOtp('');
    setErrors(prev => ({ ...prev, phone: '', otp: '' }));
    
    // Clear verification status from localStorage
    localStorage.removeItem('phoneVerified');
    localStorage.removeItem('mobileVerified');
    
    // Focus on phone input
    const phoneInput = document.querySelector('input[type="tel"]');
    if (phoneInput) {
      phoneInput.focus();
    }
  };

  // Send OTP (static for now)
  const sendOtp = async () => {
    if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) {
      setErrors(prev => ({ ...prev, phone: 'Enter valid 10-digit mobile number' }));
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpSent(true);
      setErrors(prev => ({ ...prev, phone: '' }));
    } catch (error) {
      setErrors(prev => ({ ...prev, phone: 'Failed to send OTP. Please try again.' }));
    }
  };

  // Verify OTP (static: 123456)
  const verifyOtp = async () => {
    if (otp !== '123456') {
      setErrors(prev => ({ ...prev, otp: 'Invalid OTP. Please try again.' }));
      return;
    }
    
    setIsVerifyingOtp(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPhoneVerified(true);
      setErrors(prev => ({ ...prev, otp: '' }));
      
      // Save phone verification status to localStorage for future bookings
      localStorage.setItem('phoneVerified', 'true');
      localStorage.setItem('mobileVerified', 'true');
      
      // Update user phone in localStorage if it's different
      if (formData.phone && formData.phone !== userProfile?.phone) {
        localStorage.setItem('userPhone', formData.phone);
        // Update user object in localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, phone: formData.phone };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      // Save phone verification to database
      const userId = userProfile?.id || userProfile?.userId || localStorage.getItem('userId');
      if (userId && userId !== 'undefined' && userId !== 'null') {
        try {
          const response = await fetch(`http://localhost:8080/api/user/verify-phone`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: userId,
              phone: formData.phone,
              verified: true
            })
          });
          
          if (response.ok) {
            console.log('✅ Phone verification saved to database');
          } else {
            console.error('⚠️ Failed to save phone verification to database');
          }
        } catch (error) {
          console.error('❌ Error saving phone verification:', error);
        }
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, otp: 'Verification failed. Please try again.' }));
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
        newErrors.phone = 'Enter valid 10-digit mobile number';
      }
      if (!phoneVerified) newErrors.phone = 'Please verify your phone number';
      if (!formData.latitude || !formData.longitude) newErrors.location = 'Please select location on map';
      if (!formData.address.trim()) newErrors.address = 'Full address is required';
      if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
      if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
        newErrors.pincode = 'Enter valid 6-digit pincode';
      }
      if (formData.alternatePhone && !/^[6-9]\d{9}$/.test(formData.alternatePhone)) {
        newErrors.alternatePhone = 'Enter valid 10-digit alternate number';
      }
    }

    if (step === 3) {
      if (!formData.preferredDate) newErrors.preferredDate = 'Please select a date';
      if (!formData.preferredTime) newErrors.preferredTime = 'Please select a time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = async () => {
    if (validateStep(currentStep)) {
      // Save contact and location info to profile when moving from step 1
      if (currentStep === 1) {
        await saveContactAndLocationToProfile();
      }
      setCurrentStep(prev => Math.min(prev + 1, 3));
      
      // Scroll to top of modal content
      setTimeout(() => {
        const modalContent = document.querySelector(`.${styles.modalContent}`);
        if (modalContent) {
          modalContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };
  
  // Save contact and location information to user profile and database
  const saveContactAndLocationToProfile = async () => {
    const userId = userProfile?.id || userProfile?.userId || localStorage.getItem('userId');
    if (!userId || userId === 'undefined' || userId === 'null') {
      console.log('⚠️ No valid userId found, skipping save to database');
      return;
    }
    
    try {
      // Prepare data to save - store full address in 'address' field (which is address_line1 in DB)
      const profileUpdateData = {
        contactNumber: formData.phone,
        alternateContact: formData.alternatePhone,
        address: formData.address, // Full address stored in address field (address_line1 in DB)
        pincode: formData.pincode,
        landmark: formData.landmark,
        locationLat: formData.latitude,
        locationLng: formData.longitude,
        locationAddress: formData.address // Also store in locationAddress for reference
      };
      
      console.log('💾 Saving contact & location to database:', profileUpdateData);
      console.log('📍 Full address being saved:', formData.address);
      console.log('📍 Pincode being saved:', formData.pincode);
      console.log('📍 Landmark being saved:', formData.landmark);
      console.log('📍 Coordinates being saved:', { lat: formData.latitude, lng: formData.longitude });
      
      const response = await fetch(`http://localhost:8080/api/user/profile/${userId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileUpdateData)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Contact & location saved to database successfully');
        console.log('✅ Saved data:', result);
        
        // Update local storage to reflect saved data
        localStorage.setItem('lastSavedAddress', formData.address);
        localStorage.setItem('lastSavedPincode', formData.pincode);
        localStorage.setItem('lastSavedLandmark', formData.landmark);
        localStorage.setItem('lastSavedLat', formData.latitude);
        localStorage.setItem('lastSavedLng', formData.longitude);
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to save contact & location to database:', errorText);
      }
    } catch (error) {
      console.error('❌ Error saving contact & location to database:', error);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    
    // Scroll to top of modal content
    setTimeout(() => {
      const modalContent = document.querySelector(`.${styles.modalContent}`);
      if (modalContent) {
        modalContent.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      const userId = userProfile?.id || userProfile?.userId || localStorage.getItem('userId');
      
      // Get service ID from API config or use a mapping
      const serviceCodeMap = {
        'HOME SECURITY GUARD': 'HOME_SECURITY_GUARD',
        'ELDERLY CARE': 'ELDERLY_CARE',
        'NURSING CARE': 'NURSING_CARE',
        'PATHOLOGY CARE': 'PATHOLOGY_CARE',
        'DIABETES MANAGEMENT': 'DIABETES_MANAGEMENT',
        'HEALTH CHECK-UP SERVICES': 'HEALTH_CHECKUP_SERVICES',
        'PHYSIOTHERAPY': 'PHYSIOTHERAPY',
        'POST-SURGERY CARE': 'POST_SURGERY_CARE',
        'CARETAKER AT HOME': 'CARETAKER_AT_HOME',
        "PARKINSON'S CARE": 'PARKINSONS_CARE',
        'PARKINSONS CARE': 'PARKINSONS_CARE',
        'BEDRIDDEN PATIENT CARE': 'BEDRIDDEN_PATIENT_CARE',
        'MOTHER AND BABY CARE': 'MOTHER_AND_BABY_CARE',
        'PARALYSIS CARE': 'PARALYSIS_CARE'
      };
      
      const serviceCode = serviceCodeMap[serviceName?.toUpperCase()] || serviceName?.toUpperCase().replace(/[']/g, '').replace(/\s+/g, '_');
      
      // Check if service config is loaded
      if (!apiServiceConfig || !apiServiceConfig.service || !apiServiceConfig.service.id) {
        alert('Service configuration not found. Please try again or contact support.');
        setIsSubmitting(false);
        return;
      }
      
      // Prepare booking data for new API
      const bookingData = {
        userId: parseInt(userId),
        serviceId: apiServiceConfig.service.id,
        contactInfo: {
          phone: formData.phone,
          alternatePhone: formData.alternatePhone || null,
          fullAddress: formData.address,
          landmark: formData.landmark || null,
          city: 'Indore', // You can make this dynamic
          state: 'Madhya Pradesh',
          pincode: formData.pincode || null,
          locationLat: formData.latitude,
          locationLng: formData.longitude,
          locationAddress: selectedLocation?.address || formData.address
        },
        scheduling: {
          preferredDate: formData.preferredDate,
          preferredTimeSlot: formData.preferredTimeSlot || formData.preferredTime || 'Morning',
          urgency: formData.urgency?.toUpperCase() || 'NORMAL'
        },
        selectedSubServices: selectedSubServices, // Array of subservice IDs
        formalityData: formData.serviceDetails, // Dynamic formality fields
        specialInstructions: formData.specialInstructions || null
      };
      
      console.log('📤 Sending booking data:', bookingData);
      
      // Call new booking API
      const result = await createBooking(bookingData);
      
      console.log('✅ Booking created:', result);
      
      // Call parent callback with booking data
      onBookingComplete({
        ...result.booking,
        serviceName,
        bookingNumber: result.bookingNumber
      });
      
      // Close modal without showing alert
      onClose();
    } catch (error) {
      console.error('❌ Booking failed:', error);
      alert('Failed to create booking: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const steps = [
    { number: 1, title: 'Basic Info', icon: User },
    { number: 2, title: 'Service Details', icon: MapPin },
    { number: 3, title: 'Schedule', icon: Calendar }
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      {/* Modal */}
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <h2>Book {serviceName}</h2>
            <p>Quick & Easy Booking</p>
          </div>
          <button
            onClick={onClose}
            className={styles.closeButton}
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className={styles.stepIndicator}>
                  <div className={`${styles.stepCircle} ${
                    isActive ? styles.active : 
                    isCompleted ? styles.completed : styles.inactive
                  }`}>
                    {isCompleted ? '✓' : <Icon size={16} />}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`${styles.stepConnector} ${
                      isCompleted ? styles.completed : styles.inactive
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <p className={styles.progressText}>
            Step {currentStep} of 3: {steps[currentStep - 1].title}
          </p>
        </div>

        {/* Content */}
        <div className={styles.modalContent}>
          {currentStep === 1 && (
            <div>
              <h3 className={styles.stepTitle}>Contact & Location Information</h3>
              
              {/* Info Message */}
              <div className={styles.infoMessage}>
                ℹ️ Your contact details and address will be saved to your profile for future bookings
              </div>
              
              {/* Phone Number Section */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Phone Number *
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className={`${styles.formInput} ${errors.phone ? styles.error : ''}`}
                    disabled={false}
                    style={{ flex: 1 }}
                  />
                  {!phoneVerified && !otpSent && (
                    <button
                      type="button"
                      onClick={sendOtp}
                      className={styles.otpButton}
                      disabled={!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)}
                    >
                      Send OTP
                    </button>
                  )}
                  {phoneVerified && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <div className={styles.verifiedBadge}>
                        <Shield size={16} /> Verified
                      </div>
                      <button
                        type="button"
                        onClick={handleChangeNumber}
                        className={styles.changeNumberButton}
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>
                {errors.phone && (
                  <p className={styles.errorMessage}>{errors.phone}</p>
                )}
              </div>

              {/* OTP Verification */}
              {otpSent && !phoneVerified && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Enter OTP (Use: 123456) *
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className={`${styles.formInput} ${errors.otp ? styles.error : ''}`}
                      maxLength="6"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={verifyOtp}
                      className={styles.verifyButton}
                      disabled={isVerifyingOtp || otp.length !== 6}
                    >
                      {isVerifyingOtp ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                  {errors.otp && (
                    <p className={styles.errorMessage}>{errors.otp}</p>
                  )}
                  <p className={styles.otpHint}>OTP sent to {formData.phone}</p>
                </div>
              )}

              {/* Alternate Phone Number */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Alternate Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.alternatePhone}
                  onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                  placeholder="Enter alternate mobile number"
                  className={`${styles.formInput} ${errors.alternatePhone ? styles.error : ''}`}
                />
                {errors.alternatePhone && (
                  <p className={styles.errorMessage}>{errors.alternatePhone}</p>
                )}
              </div>

              {/* Map Location Picker */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Select Location on Map *
                </label>
                <div className={styles.mapContainer}>
                  <LeafletMapPicker 
                    onLocationSelect={handleLocationSelect}
                    initialPosition={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : null}
                    initialAddress={formData.address || ''}
                  />
                </div>
                
                {/* Save Location Button */}
                {selectedLocation && (
                  <div className={styles.locationActions}>
                    <div className={styles.locationPreview}>
                      <p className={styles.locationInfo}>
                        📍 Selected: {selectedLocation?.address || ''}
                      </p>
                      {formData.latitude && formData.longitude && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLocation(null);
                            setFormData(prev => ({
                              ...prev,
                              latitude: null,
                              longitude: null
                            }));
                            setLocationSaved(false);
                          }}
                          className={styles.changeLocationButton}
                        >
                          Change Location
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={saveLocation}
                      className={`${styles.saveLocationButton} ${
                        formData.latitude && formData.longitude ? styles.saved : ''
                      }`}
                      disabled={isSavingLocation || (formData.latitude && formData.longitude)}
                    >
                      {isSavingLocation ? (
                        <>
                          <div className={styles.spinner}></div> Saving...
                        </>
                      ) : formData.latitude && formData.longitude ? (
                        <>
                          <Shield size={16} /> Location Saved
                        </>
                      ) : (
                        <>
                          <MapPin size={16} /> Save Location
                        </>
                      )}
                    </button>
                    {locationSaved && (
                      <p className={styles.successMessage}>
                        ✓ Location saved to your account successfully!
                      </p>
                    )}
                  </div>
                )}
                
                {!selectedLocation && (
                  <p className={styles.mapHint}>
                    Click on the map to select your location
                  </p>
                )}
                
                {errors.location && (
                  <p className={styles.errorMessage}>{errors.location}</p>
                )}
              </div>

              {/* Address Fields */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Full Address *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="House/Flat No., Building Name, Street, Area, Locality"
                  className={`${styles.formTextarea} ${errors.address ? styles.error : ''}`}
                  rows="3"
                />
                {errors.address && (
                  <p className={styles.errorMessage}>{errors.address}</p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label className={styles.formLabel}>
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="Enter 6-digit pincode"
                    className={`${styles.formInput} ${errors.pincode ? styles.error : ''}`}
                    maxLength="6"
                  />
                  {errors.pincode && (
                    <p className={styles.errorMessage}>{errors.pincode}</p>
                  )}
                </div>

                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label className={styles.formLabel}>
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => handleInputChange('landmark', e.target.value)}
                    placeholder="Enter nearby landmark"
                    className={styles.formInput}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h3 className={styles.stepTitle}>Service Requirements</h3>
              
              {/* Subservice Selection */}
              {apiServiceConfig?.subServices && apiServiceConfig.subServices.length > 0 && (
                <div className={styles.subservicesSection}>
                  <h4 className={styles.sectionTitle}>
                    Select Additional Services (Optional)
                  </h4>
                  <p className={styles.sectionDescription}>
                    Choose any additional services you need. Prices will be added to your total.
                  </p>
                  
                  <div className={styles.subservicesList}>
                    {apiServiceConfig.subServices.map((subService) => (
                      <label 
                        key={subService.id} 
                        className={`${styles.subserviceCard} ${
                          selectedSubServices.includes(subService.id) ? styles.selected : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSubServices.includes(subService.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSubServices([...selectedSubServices, subService.id]);
                            } else {
                              setSelectedSubServices(selectedSubServices.filter(id => id !== subService.id));
                            }
                          }}
                          className={styles.subserviceCheckbox}
                        />
                        <div className={styles.subserviceInfo}>
                          <div className={styles.subserviceName}>{subService.subServiceName}</div>
                          {subService.description && (
                            <div className={styles.subserviceDescription}>{subService.description}</div>
                          )}
                        </div>
                        <div className={styles.subservicePrice}>
                          {subService.additionalPrice > 0 ? (
                            <span className={styles.priceTag}>+₹{subService.additionalPrice}</span>
                          ) : (
                            <span className={styles.freeTag}>Included</span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                  
                  {selectedSubServices.length > 0 && (
                    <div className={styles.selectedSummary}>
                      ✓ {selectedSubServices.length} additional service{selectedSubServices.length > 1 ? 's' : ''} selected
                    </div>
                  )}
                </div>
              )}
              
              {/* Dynamic service fields based on service configuration */}
              {Object.entries(serviceConfig).map(([sectionKey, sectionConfig]) => (
                <div key={sectionKey} className={styles.formGroup}>
                  <h4 className={styles.formLabel} style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600', textTransform: 'capitalize' }}>
                    {sectionKey.replace(/_/g, ' ')}
                  </h4>
                  
                  {Object.entries(sectionConfig).map(([fieldKey, fieldConfig]) => {
                    const fieldName = `${sectionKey}_${fieldKey}`;
                    
                    if (typeof fieldConfig === 'string' && fieldConfig.includes('/')) {
                      // Dropdown
                      const options = fieldConfig.split('/');
                      
                      // Special handling for therapy_type to add descriptions
                      const getOptionDisplay = (option, fieldKey) => {
                        if (fieldKey === 'therapy_type') {
                          const therapyDescriptions = {
                            'orthopedic': 'Orthopedic - Bone/Joint',
                            'neurological': 'Neurological - Brain/Nerve',
                            'pediatric': 'Pediatric - Child Care',
                            'geriatric': 'Geriatric - Elder Care',
                            'chest': 'Chest - Breathing/Lung'
                          };
                          return therapyDescriptions[option] || option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        }
                        return option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                      };
                      
                      return (
                        <div key={fieldName} className={styles.formGroup}>
                          <label className={styles.formLabel}>
                            {fieldKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </label>
                          <select
                            value={formData.serviceDetails[fieldName] || ''}
                            onChange={(e) => handleServiceDetailChange(fieldName, e.target.value)}
                            className={styles.formSelect}
                          >
                            <option value="">Select {fieldKey.replace(/_/g, ' ')}</option>
                            {options.map(option => (
                              <option key={option} value={option}>
                                {getOptionDisplay(option, fieldKey)}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    }
                    
                    // Regular input
                    return (
                      <div key={fieldName} className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          {fieldKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                        <input
                          type={fieldConfig === 'number' ? 'number' : 'text'}
                          value={formData.serviceDetails[fieldName] || ''}
                          onChange={(e) => handleServiceDetailChange(fieldName, e.target.value)}
                          placeholder={`Enter ${fieldKey.replace(/_/g, ' ')}`}
                          className={styles.formInput}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
              
              {Object.keys(serviceConfig).length === 0 && (
                <div className={styles.emptyState}>
                  <p>Service details will be collected after booking confirmation.</p>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h3 className={styles.stepTitle}>Schedule Service</h3>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Preferred Date *
                </label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  className={`${styles.formInput} ${errors.preferredDate ? styles.error : ''}`}
                />
                {errors.preferredDate && (
                  <p className={styles.errorMessage}>{errors.preferredDate}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Preferred Time *
                </label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                  className={`${styles.formSelect} ${errors.preferredTime ? styles.error : ''}`}
                >
                  <option value="">Select time slot</option>
                  <option value="morning">Morning (8 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                  <option value="evening">Evening (4 PM - 8 PM)</option>
                </select>
                {errors.preferredTime && (
                  <p className={styles.errorMessage}>{errors.preferredTime}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Urgency Level
                </label>
                <div className={styles.urgencyOptions}>
                  {[
                    { value: 'normal', label: 'Normal', desc: 'Within 1-4 days' },
                    { value: 'urgent', label: 'Urgent', desc: 'Same day or next day' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('urgency', option.value)}
                      className={`${styles.urgencyOption} ${
                        formData.urgency === option.value ? styles.selected : ''
                      }`}
                    >
                      <div className={styles.urgencyLabel}>{option.label}</div>
                      <div className={styles.urgencyDescription}>{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button
            onClick={currentStep === 1 ? onClose : prevStep}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            <ArrowLeft size={16} />
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>

          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              className={styles.primaryButton}
            >
              Continue
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={styles.primaryButton}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.loadingSpinner} />
                  Booking...
                </>
              ) : (
                <>
                  Confirm Booking
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
