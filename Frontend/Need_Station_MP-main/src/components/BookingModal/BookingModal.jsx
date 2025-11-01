import React, { useState, useEffect, useMemo } from 'react';
import { X, ArrowLeft, ArrowRight, MapPin, Clock, User, Phone, Calendar, Shield } from 'lucide-react';
import { SERVICE_CONFIGURATIONS } from '../../data/ServiceConfigurations';
import { createBooking } from '../../services/bookingApi';
import LeafletMapPicker from '../Map/LeafletMapPicker';
import { getServiceId } from '../../utils/serviceIdMapping';
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

  // Get service configuration - memoized to prevent re-calculation
  const serviceConfig = useMemo(() => {
    if (!serviceName) {
      console.warn('⚠️ No serviceName provided to BookingModal');
      return {};
    }
    
    const serviceKey = serviceName.toUpperCase().replace(/[']/g, '').replace(/\s+/g, '_');
    console.log('✅ Loading config for:', serviceName, '→', serviceKey);
    
    const config = SERVICE_CONFIGURATIONS[serviceKey];
    if (!config) {
      console.error('❌ No configuration found for:', serviceKey);
      console.log('Available keys:', Object.keys(SERVICE_CONFIGURATIONS));
    } else {
      console.log('✅ Config loaded:', Object.keys(config));
    }
    
    return config || {};
  }, [serviceName]);

  // Auto-fill phone number and location data from database first, then fall back to profile
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      
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
      
      // Get service ID from mapping utility using the actual service name
      const serviceId = getServiceId(serviceName);
      
      if (!serviceId) {
        console.error('❌ Service ID not found for:', serviceName);
        alert(`Service "${serviceName}" is not configured. Please contact support.`);
        setIsSubmitting(false);
        return;
      }
      
      console.log('✅ Using service ID:', serviceId, 'for service:', serviceName);
      
      // Prepare booking data for new API
      const bookingData = {
        userId: parseInt(userId),
        serviceId: serviceId,
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
        selectedSubServices: [], // No subservices for now
        formalityData: formData.serviceDetails, // Service-specific fields from Step 2
        specialInstructions: formData.specialInstructions || null
      };
      
      console.log('📤 Sending booking data:', bookingData);
      
      // Call new booking API
      const result = await createBooking(bookingData);
      
      console.log('✅ Booking created:', result);
      
      // Call parent callback with booking data (this will handle redirect)
      onBookingComplete({
        ...result.booking,
        serviceName,
        bookingNumber: result.bookingNumber
      });
      
      // Close modal after a short delay to allow redirect to complete
      setTimeout(() => {
        onClose();
      }, 100);
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
              
              {/* COMPANION CARE */}
              {serviceName === 'Companion Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Health Status</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.health_status || ''} 
                      onChange={(e) => handleServiceDetailChange('health_status', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="good">Good - Independent</option>
                      <option value="fair">Fair - Needs Some Help</option>
                      <option value="poor">Poor - Needs Significant Help</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Interests & Activities</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List activities, hobbies, and interests"
                      value={formData.serviceDetails.interests_hobbies || ''} 
                      onChange={(e) => handleServiceDetailChange('interests_hobbies', e.target.value)} />
                    <small className={styles.helpText}>Information for engagement and therapeutic interaction</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Required Hours Per Day</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.companionship_hours || ''} 
                      onChange={(e) => handleServiceDetailChange('companionship_hours', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="4">4 Hours</option>
                      <option value="8">8 Hours</option>
                      <option value="12">12 Hours</option>
                      <option value="24">24 Hours</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Communication Capability</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.communication_ability || ''} 
                      onChange={(e) => handleServiceDetailChange('communication_ability', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="fully_verbal">Fully Verbal</option>
                      <option value="limited_verbal">Limited Verbal</option>
                      <option value="non_verbal">Non-Verbal</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Additional Care Requirements</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Specify any special needs or considerations"
                      value={formData.serviceDetails.special_requirements || ''} 
                      onChange={(e) => handleServiceDetailChange('special_requirements', e.target.value)} />
                    <small className={styles.helpText}>Any specific requirements for the companion caregiver</small>
                  </div>
                </>
              )}
              
              {/* PERSONAL CARE */}
              {serviceName === 'Personal Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mobility Level</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.mobility_level || ''} 
                      onChange={(e) => handleServiceDetailChange('mobility_level', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="fully_mobile">Fully Mobile</option>
                      <option value="limited_mobility">Limited Mobility</option>
                      <option value="wheelchair">Wheelchair Bound</option>
                      <option value="bedridden">Bedridden</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Care Activities Required</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List required care activities (bathing, dressing, grooming, etc.)"
                      value={formData.serviceDetails.care_activities || ''} 
                      onChange={(e) => handleServiceDetailChange('care_activities', e.target.value)} />
                    <small className={styles.helpText}>Specify daily personal care needs</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Required Hours Per Day</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.care_hours || ''} 
                      onChange={(e) => handleServiceDetailChange('care_hours', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="4">4 Hours</option>
                      <option value="8">8 Hours</option>
                      <option value="12">12 Hours</option>
                      <option value="24">24 Hours</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Medical Conditions</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List any medical conditions or health concerns"
                      value={formData.serviceDetails.medical_conditions || ''} 
                      onChange={(e) => handleServiceDetailChange('medical_conditions', e.target.value)} />
                    <small className={styles.helpText}>Important for caregiver awareness and safety</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Special Care Requirements</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Any special needs or preferences"
                      value={formData.serviceDetails.special_requirements || ''} 
                      onChange={(e) => handleServiceDetailChange('special_requirements', e.target.value)} />
                    <small className={styles.helpText}>Additional care instructions or preferences</small>
                  </div>
                </>
              )}
              
              {/* DEMENTIA CARE */}
              {serviceName === 'Dementia Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Dementia Stage</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.dementia_stage || ''} 
                      onChange={(e) => handleServiceDetailChange('dementia_stage', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="early">Early Stage - Mild Symptoms</option>
                      <option value="moderate">Moderate Stage - Increased Support Needed</option>
                      <option value="advanced">Advanced Stage - Full-Time Care Required</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Diagnosis Type</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.diagnosis_type || ''} 
                      onChange={(e) => handleServiceDetailChange('diagnosis_type', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="alzheimers">Alzheimer's Disease</option>
                      <option value="vascular">Vascular Dementia</option>
                      <option value="lewy_body">Lewy Body Dementia</option>
                      <option value="frontotemporal">Frontotemporal Dementia</option>
                      <option value="other">Other/Mixed</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Behavioral Symptoms</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe behavioral patterns, wandering, agitation, etc."
                      value={formData.serviceDetails.behavioral_symptoms || ''} 
                      onChange={(e) => handleServiceDetailChange('behavioral_symptoms', e.target.value)} />
                    <small className={styles.helpText}>Helps caregiver prepare for specific behaviors</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Supervision Level Required</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.supervision_level || ''} 
                      onChange={(e) => handleServiceDetailChange('supervision_level', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="periodic">Periodic Check-ins</option>
                      <option value="frequent">Frequent Monitoring</option>
                      <option value="constant">Constant Supervision (24/7)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Safety Concerns & Triggers</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List safety risks, triggers, or calming techniques"
                      value={formData.serviceDetails.safety_concerns || ''} 
                      onChange={(e) => handleServiceDetailChange('safety_concerns', e.target.value)} />
                    <small className={styles.helpText}>Critical information for patient safety and comfort</small>
                  </div>
                </>
              )}
              
              {/* RESPITE CARE */}
              {serviceName === 'Respite Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Care Duration Needed</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.care_duration || ''} 
                      onChange={(e) => handleServiceDetailChange('care_duration', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="few_hours">Few Hours (2-4 hours)</option>
                      <option value="half_day">Half Day (4-8 hours)</option>
                      <option value="full_day">Full Day (8-12 hours)</option>
                      <option value="overnight">Overnight (12-24 hours)</option>
                      <option value="multiple_days">Multiple Days</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Primary Caregiver Relationship</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.caregiver_relationship || ''} 
                      onChange={(e) => handleServiceDetailChange('caregiver_relationship', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="spouse">Spouse</option>
                      <option value="child">Adult Child</option>
                      <option value="sibling">Sibling</option>
                      <option value="other_family">Other Family Member</option>
                      <option value="friend">Friend/Neighbor</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient's Current Care Needs</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe daily care routine and needs"
                      value={formData.serviceDetails.care_needs || ''} 
                      onChange={(e) => handleServiceDetailChange('care_needs', e.target.value)} />
                    <small className={styles.helpText}>Help us understand the care routine to maintain</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Reason for Respite Care</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.respite_reason || ''} 
                      onChange={(e) => handleServiceDetailChange('respite_reason', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="personal_time">Personal Time/Rest</option>
                      <option value="work">Work Commitments</option>
                      <option value="travel">Travel/Vacation</option>
                      <option value="medical">Medical Appointment</option>
                      <option value="emergency">Emergency Situation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Special Instructions for Caregiver</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Important routines, preferences, or emergency contacts"
                      value={formData.serviceDetails.special_instructions || ''} 
                      onChange={(e) => handleServiceDetailChange('special_instructions', e.target.value)} />
                    <small className={styles.helpText}>Any specific care instructions or emergency information</small>
                  </div>
                </>
              )}
              
              {/* GENERAL NURSING */}
              {serviceName === 'General Nursing' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Primary Medical Condition</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.medical_condition || ''} 
                      onChange={(e) => handleServiceDetailChange('medical_condition', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="chronic_illness">Chronic Illness Management</option>
                      <option value="post_hospitalization">Post-Hospitalization Recovery</option>
                      <option value="elderly_care">Elderly General Care</option>
                      <option value="diabetes">Diabetes Management</option>
                      <option value="hypertension">Hypertension Monitoring</option>
                      <option value="other">Other Condition</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Required Nursing Services</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List required services (vital monitoring, medication, injections, etc.)"
                      value={formData.serviceDetails.required_services || ''} 
                      onChange={(e) => handleServiceDetailChange('required_services', e.target.value)} />
                    <small className={styles.helpText}>Specify daily nursing tasks needed</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Nursing Hours Required Per Day</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.nursing_hours || ''} 
                      onChange={(e) => handleServiceDetailChange('nursing_hours', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="4">4 Hours</option>
                      <option value="8">8 Hours</option>
                      <option value="12">12 Hours (Day/Night Shift)</option>
                      <option value="24">24 Hours (Full-Time)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Medications</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List all current medications and dosages"
                      value={formData.serviceDetails.current_medications || ''} 
                      onChange={(e) => handleServiceDetailChange('current_medications', e.target.value)} />
                    <small className={styles.helpText}>Important for medication administration and monitoring</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Special Medical Requirements</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Any allergies, dietary restrictions, or special care instructions"
                      value={formData.serviceDetails.special_requirements || ''} 
                      onChange={(e) => handleServiceDetailChange('special_requirements', e.target.value)} />
                    <small className={styles.helpText}>Critical information for safe nursing care</small>
                  </div>
                </>
              )}
              
              {/* ICU TRAINED NURSING */}
              {serviceName === 'ICU Trained Nursing' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Critical Condition Type</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.critical_condition || ''} 
                      onChange={(e) => handleServiceDetailChange('critical_condition', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="post_icu">Post-ICU Recovery</option>
                      <option value="respiratory">Respiratory Support Needed</option>
                      <option value="cardiac">Cardiac Monitoring Required</option>
                      <option value="neurological">Neurological Condition</option>
                      <option value="multi_organ">Multi-Organ Support</option>
                      <option value="other_critical">Other Critical Condition</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Medical Equipment Required</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List equipment needed (ventilator, oxygen, monitors, suction, etc.)"
                      value={formData.serviceDetails.medical_equipment || ''} 
                      onChange={(e) => handleServiceDetailChange('medical_equipment', e.target.value)} />
                    <small className={styles.helpText}>Specify all medical devices and monitoring equipment</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Level of Care Intensity</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.care_intensity || ''} 
                      onChange={(e) => handleServiceDetailChange('care_intensity', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="continuous_monitoring">Continuous Monitoring (24/7)</option>
                      <option value="frequent_intervention">Frequent Intervention Required</option>
                      <option value="stable_critical">Stable but Critical</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Recent Hospitalization Details</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Hospital name, discharge date, diagnosis, and doctor's instructions"
                      value={formData.serviceDetails.hospitalization_details || ''} 
                      onChange={(e) => handleServiceDetailChange('hospitalization_details', e.target.value)} />
                    <small className={styles.helpText}>Essential for continuity of critical care</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Emergency Contact & Doctor Details</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Primary doctor name, contact, and emergency contact person"
                      value={formData.serviceDetails.emergency_contacts || ''} 
                      onChange={(e) => handleServiceDetailChange('emergency_contacts', e.target.value)} />
                    <small className={styles.helpText}>Critical for emergency situations and medical coordination</small>
                  </div>
                </>
              )}
              
              {/* WOUND CARE NURSING */}
              {serviceName === 'Wound Care Nursing' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Type of Wound</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.wound_type || ''} 
                      onChange={(e) => handleServiceDetailChange('wound_type', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="surgical">Post-Surgical Wound</option>
                      <option value="diabetic">Diabetic Ulcer</option>
                      <option value="pressure">Pressure Sore/Bedsore</option>
                      <option value="burn">Burn Wound</option>
                      <option value="traumatic">Traumatic Injury</option>
                      <option value="chronic">Chronic Non-Healing Wound</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Wound Location & Size</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe wound location and approximate size"
                      value={formData.serviceDetails.wound_location || ''} 
                      onChange={(e) => handleServiceDetailChange('wound_location', e.target.value)} />
                    <small className={styles.helpText}>Helps nurse prepare appropriate dressing materials</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Wound Status</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.wound_status || ''} 
                      onChange={(e) => handleServiceDetailChange('wound_status', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="fresh">Fresh/New Wound</option>
                      <option value="healing">Healing Normally</option>
                      <option value="infected">Signs of Infection</option>
                      <option value="non_healing">Not Healing Properly</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Dressing Change Frequency</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.dressing_frequency || ''} 
                      onChange={(e) => handleServiceDetailChange('dressing_frequency', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="daily">Daily</option>
                      <option value="twice_daily">Twice Daily</option>
                      <option value="alternate">Alternate Days</option>
                      <option value="as_needed">As Needed/Per Doctor's Advice</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Doctor's Wound Care Instructions</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Specific dressing type, medications, cleaning solutions prescribed"
                      value={formData.serviceDetails.doctor_instructions || ''} 
                      onChange={(e) => handleServiceDetailChange('doctor_instructions', e.target.value)} />
                    <small className={styles.helpText}>Essential for proper wound care protocol</small>
                  </div>
                </>
              )}
              
              {/* PEDIATRIC NURSING */}
              {serviceName === 'Pediatric Nursing' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Child's Age</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.child_age_group || ''} 
                      onChange={(e) => handleServiceDetailChange('child_age_group', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="newborn">Newborn (0-3 months)</option>
                      <option value="infant">Infant (3-12 months)</option>
                      <option value="toddler">Toddler (1-3 years)</option>
                      <option value="preschool">Preschool (3-5 years)</option>
                      <option value="school_age">School Age (5-12 years)</option>
                      <option value="adolescent">Adolescent (12-18 years)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Child's Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.child_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('child_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Reason for Pediatric Nursing</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.care_reason || ''} 
                      onChange={(e) => handleServiceDetailChange('care_reason', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="newborn_care">Newborn Care & Monitoring</option>
                      <option value="illness_recovery">Illness Recovery</option>
                      <option value="chronic_condition">Chronic Condition Management</option>
                      <option value="post_surgery">Post-Surgery Care</option>
                      <option value="vaccination">Vaccination Support</option>
                      <option value="special_needs">Special Needs Care</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Child's Medical Condition</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe current health condition, diagnosis, or care needs"
                      value={formData.serviceDetails.medical_condition || ''} 
                      onChange={(e) => handleServiceDetailChange('medical_condition', e.target.value)} />
                    <small className={styles.helpText}>Important for appropriate pediatric care planning</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Required Nursing Services</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List services needed (feeding support, medication, vital monitoring, etc.)"
                      value={formData.serviceDetails.required_services || ''} 
                      onChange={(e) => handleServiceDetailChange('required_services', e.target.value)} />
                    <small className={styles.helpText}>Specify daily pediatric nursing tasks</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Nursing Hours Required Per Day</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.nursing_hours || ''} 
                      onChange={(e) => handleServiceDetailChange('nursing_hours', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="4">4 Hours</option>
                      <option value="8">8 Hours</option>
                      <option value="12">12 Hours</option>
                      <option value="24">24 Hours (Full-Time)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Allergies & Special Precautions</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List any allergies, dietary restrictions, or special care instructions"
                      value={formData.serviceDetails.allergies_precautions || ''} 
                      onChange={(e) => handleServiceDetailChange('allergies_precautions', e.target.value)} />
                    <small className={styles.helpText}>Critical for child's safety and well-being</small>
                  </div>
                </>
              )}
              
              {/* LIVE-IN CARETAKER */}
              {serviceName === 'Live-in Caretaker' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient/Person Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient/Person Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Primary Care Requirement</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.care_requirement || ''} 
                      onChange={(e) => handleServiceDetailChange('care_requirement', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="elderly_care">Elderly Care & Supervision</option>
                      <option value="patient_care">Patient Care & Recovery</option>
                      <option value="disability_care">Disability Support</option>
                      <option value="general_assistance">General Daily Assistance</option>
                      <option value="post_surgery">Post-Surgery Care</option>
                      <option value="chronic_illness">Chronic Illness Management</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mobility & Independence Level</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.mobility_level || ''} 
                      onChange={(e) => handleServiceDetailChange('mobility_level', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="fully_independent">Fully Independent</option>
                      <option value="partially_independent">Partially Independent</option>
                      <option value="limited_mobility">Limited Mobility</option>
                      <option value="wheelchair_bound">Wheelchair Bound</option>
                      <option value="bedridden">Bedridden</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Daily Care Tasks Required</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List tasks (bathing, feeding, medication, mobility assistance, etc.)"
                      value={formData.serviceDetails.daily_tasks || ''} 
                      onChange={(e) => handleServiceDetailChange('daily_tasks', e.target.value)} />
                    <small className={styles.helpText}>Specify all daily care activities needed</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Accommodation for Caretaker</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.accommodation || ''} 
                      onChange={(e) => handleServiceDetailChange('accommodation', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="separate_room">Separate Room Available</option>
                      <option value="shared_space">Shared Space</option>
                      <option value="patient_room">In Patient's Room</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Medical Conditions & Special Instructions</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List medical conditions, allergies, dietary needs, and special care instructions"
                      value={formData.serviceDetails.medical_conditions || ''} 
                      onChange={(e) => handleServiceDetailChange('medical_conditions', e.target.value)} />
                    <small className={styles.helpText}>Important for comprehensive 24/7 care planning</small>
                  </div>
                </>
              )}
              
              {/* PART-TIME CARETAKER */}
              {serviceName === 'Part-time Caretaker' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient/Person Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient/Person Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Required Hours Per Day</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.hours_per_day || ''} 
                      onChange={(e) => handleServiceDetailChange('hours_per_day', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="2">2 Hours</option>
                      <option value="4">4 Hours</option>
                      <option value="6">6 Hours</option>
                      <option value="8">8 Hours</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preferred Time Slot</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.preferred_time_slot || ''} 
                      onChange={(e) => handleServiceDetailChange('preferred_time_slot', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="morning">Morning (6 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                      <option value="evening">Evening (6 PM - 10 PM)</option>
                      <option value="flexible">Flexible Timing</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Specific Tasks Required</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List specific tasks (personal care, meal prep, medication, companionship, etc.)"
                      value={formData.serviceDetails.specific_tasks || ''} 
                      onChange={(e) => handleServiceDetailChange('specific_tasks', e.target.value)} />
                    <small className={styles.helpText}>Be specific about what needs to be done during the visit</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mobility & Care Level</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.care_level || ''} 
                      onChange={(e) => handleServiceDetailChange('care_level', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="minimal">Minimal Assistance Needed</option>
                      <option value="moderate">Moderate Assistance Required</option>
                      <option value="significant">Significant Care Required</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Additional Requirements</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Any medical conditions, dietary needs, or special instructions"
                      value={formData.serviceDetails.additional_requirements || ''} 
                      onChange={(e) => handleServiceDetailChange('additional_requirements', e.target.value)} />
                    <small className={styles.helpText}>Important information for the caretaker</small>
                  </div>
                </>
              )}
              
              {/* COOK-CUM-CARETAKER */}
              {serviceName === 'Cook-cum-Caretaker' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Number of People to Cook For</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.people_count || ''} 
                      onChange={(e) => handleServiceDetailChange('people_count', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                      <option value="4">4 People</option>
                      <option value="5+">5+ People</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Meal Requirements Per Day</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.meals_per_day || ''} 
                      onChange={(e) => handleServiceDetailChange('meals_per_day', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="breakfast_only">Breakfast Only</option>
                      <option value="lunch_dinner">Lunch & Dinner</option>
                      <option value="all_three">All Three Meals</option>
                      <option value="custom">Custom Schedule</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Cuisine Preference</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.cuisine_preference || ''} 
                      onChange={(e) => handleServiceDetailChange('cuisine_preference', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="north_indian">North Indian</option>
                      <option value="south_indian">South Indian</option>
                      <option value="gujarati">Gujarati</option>
                      <option value="bengali">Bengali</option>
                      <option value="multi_cuisine">Multi-Cuisine</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Dietary Restrictions</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List dietary needs (diabetic, low-salt, vegetarian, allergies, etc.)"
                      value={formData.serviceDetails.dietary_restrictions || ''} 
                      onChange={(e) => handleServiceDetailChange('dietary_restrictions', e.target.value)} />
                    <small className={styles.helpText}>Important for meal planning and patient health</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Care Duties Required</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List care tasks (feeding assistance, medication reminders, basic care, etc.)"
                      value={formData.serviceDetails.care_duties || ''} 
                      onChange={(e) => handleServiceDetailChange('care_duties', e.target.value)} />
                    <small className={styles.helpText}>Specify caretaking responsibilities beyond cooking</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Working Hours Required</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.working_hours || ''} 
                      onChange={(e) => handleServiceDetailChange('working_hours', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="4">4 Hours</option>
                      <option value="6">6 Hours</option>
                      <option value="8">8 Hours</option>
                      <option value="10">10 Hours</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Kitchen & Special Instructions</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Kitchen type, equipment available, food preferences, and any special instructions"
                      value={formData.serviceDetails.special_instructions || ''} 
                      onChange={(e) => handleServiceDetailChange('special_instructions', e.target.value)} />
                    <small className={styles.helpText}>Help us match the right cook-cum-caretaker</small>
                  </div>
                </>
              )}
              
              {/* BABY CARETAKER/NANNY */}
              {serviceName === 'Baby Caretaker/Nanny' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Child's Age</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.child_age_group || ''} 
                      onChange={(e) => handleServiceDetailChange('child_age_group', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="newborn">Newborn (0-3 months)</option>
                      <option value="infant">Infant (3-12 months)</option>
                      <option value="toddler">Toddler (1-3 years)</option>
                      <option value="preschool">Preschool (3-5 years)</option>
                      <option value="school_age">School Age (5-10 years)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Child's Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.child_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('child_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Type of Care Required</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.care_type || ''} 
                      onChange={(e) => handleServiceDetailChange('care_type', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="full_time">Full-Time Care (Live-in)</option>
                      <option value="day_care">Day Care (8-10 hours)</option>
                      <option value="part_time">Part-Time (4-6 hours)</option>
                      <option value="night_care">Night Care Only</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Primary Care Responsibilities</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List tasks (feeding, bathing, diaper change, playtime, sleep routine, etc.)"
                      value={formData.serviceDetails.care_responsibilities || ''} 
                      onChange={(e) => handleServiceDetailChange('care_responsibilities', e.target.value)} />
                    <small className={styles.helpText}>Specify daily childcare activities needed</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Educational Activities Required</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.educational_activities || ''} 
                      onChange={(e) => handleServiceDetailChange('educational_activities', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="basic_care_only">Basic Care Only</option>
                      <option value="age_appropriate">Age-Appropriate Activities</option>
                      <option value="educational_focus">Educational Focus & Learning</option>
                      <option value="montessori">Montessori/Structured Learning</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Child's Routine & Schedule</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe daily routine (feeding times, nap schedule, activities, etc.)"
                      value={formData.serviceDetails.daily_routine || ''} 
                      onChange={(e) => handleServiceDetailChange('daily_routine', e.target.value)} />
                    <small className={styles.helpText}>Helps nanny maintain consistency in care</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Special Requirements & Allergies</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List allergies, medical conditions, dietary needs, and special care instructions"
                      value={formData.serviceDetails.special_requirements || ''} 
                      onChange={(e) => handleServiceDetailChange('special_requirements', e.target.value)} />
                    <small className={styles.helpText}>Critical for child's safety and well-being</small>
                  </div>
                </>
              )}
              
              {/* COMPLETE BEDRIDDEN CARE */}
              {serviceName === 'Complete Bedridden Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Reason for Bedridden State</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.bedridden_reason || ''} 
                      onChange={(e) => handleServiceDetailChange('bedridden_reason', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="post_surgery">Post-Surgery Recovery</option>
                      <option value="chronic_illness">Chronic Illness</option>
                      <option value="paralysis">Paralysis</option>
                      <option value="severe_weakness">Severe Weakness/Frailty</option>
                      <option value="neurological">Neurological Condition</option>
                      <option value="other">Other Medical Condition</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Duration of Bedridden Condition</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.bedridden_duration || ''} 
                      onChange={(e) => handleServiceDetailChange('bedridden_duration', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="recent">Recent (Less than 1 month)</option>
                      <option value="1_3_months">1-3 Months</option>
                      <option value="3_6_months">3-6 Months</option>
                      <option value="long_term">Long-term (6+ months)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Required Care Services</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List needs (bathing, feeding, positioning, catheter care, wound care, etc.)"
                      value={formData.serviceDetails.required_services || ''} 
                      onChange={(e) => handleServiceDetailChange('required_services', e.target.value)} />
                    <small className={styles.helpText}>Specify all daily care activities needed</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Medical Equipment at Home</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List equipment (hospital bed, oxygen, suction, air mattress, etc.)"
                      value={formData.serviceDetails.medical_equipment || ''} 
                      onChange={(e) => handleServiceDetailChange('medical_equipment', e.target.value)} />
                    <small className={styles.helpText}>Helps caregiver prepare for equipment handling</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Medical Conditions & Special Care Needs</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List medical conditions, pressure sores, medications, dietary needs, and special instructions"
                      value={formData.serviceDetails.medical_conditions || ''} 
                      onChange={(e) => handleServiceDetailChange('medical_conditions', e.target.value)} />
                    <small className={styles.helpText}>Critical for comprehensive bedridden care</small>
                  </div>
                </>
              )}
              
              {/* STROKE PATIENT CARE */}
              {serviceName === 'Stroke Patient Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Type of Stroke</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.stroke_type || ''} 
                      onChange={(e) => handleServiceDetailChange('stroke_type', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="ischemic">Ischemic Stroke</option>
                      <option value="hemorrhagic">Hemorrhagic Stroke</option>
                      <option value="tia">TIA (Mini Stroke)</option>
                      <option value="unknown">Not Sure/Unknown</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Time Since Stroke</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.stroke_duration || ''} 
                      onChange={(e) => handleServiceDetailChange('stroke_duration', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="recent">Recent (Less than 1 month)</option>
                      <option value="1_3_months">1-3 Months</option>
                      <option value="3_6_months">3-6 Months</option>
                      <option value="6_12_months">6-12 Months</option>
                      <option value="over_year">Over 1 Year</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Affected Body Parts & Paralysis</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe affected areas (left/right side, arm, leg, face, speech, etc.)"
                      value={formData.serviceDetails.affected_areas || ''} 
                      onChange={(e) => handleServiceDetailChange('affected_areas', e.target.value)} />
                    <small className={styles.helpText}>Important for mobility and rehabilitation planning</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Therapy & Rehabilitation</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List ongoing therapies (physiotherapy, speech therapy, occupational therapy, etc.)"
                      value={formData.serviceDetails.current_therapy || ''} 
                      onChange={(e) => handleServiceDetailChange('current_therapy', e.target.value)} />
                    <small className={styles.helpText}>Helps coordinate care with existing treatment</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Care Needs & Special Requirements</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List care needs (mobility assistance, feeding, communication support, medications, etc.)"
                      value={formData.serviceDetails.care_needs || ''} 
                      onChange={(e) => handleServiceDetailChange('care_needs', e.target.value)} />
                    <small className={styles.helpText}>Critical for stroke recovery care planning</small>
                  </div>
                </>
              )}
              
              {/* COMA PATIENT CARE */}
              {serviceName === 'Coma Patient Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Cause of Coma</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.coma_cause || ''} 
                      onChange={(e) => handleServiceDetailChange('coma_cause', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="traumatic_injury">Traumatic Brain Injury</option>
                      <option value="stroke">Stroke</option>
                      <option value="infection">Brain Infection</option>
                      <option value="metabolic">Metabolic Disorder</option>
                      <option value="hypoxia">Oxygen Deprivation</option>
                      <option value="other">Other Medical Cause</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Duration in Coma</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.coma_duration || ''} 
                      onChange={(e) => handleServiceDetailChange('coma_duration', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="recent">Recent (Less than 1 week)</option>
                      <option value="1_4_weeks">1-4 Weeks</option>
                      <option value="1_3_months">1-3 Months</option>
                      <option value="long_term">Long-term (3+ months)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Medical Equipment & Life Support</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List equipment (ventilator, feeding tube, monitors, suction, oxygen, etc.)"
                      value={formData.serviceDetails.medical_equipment || ''} 
                      onChange={(e) => handleServiceDetailChange('medical_equipment', e.target.value)} />
                    <small className={styles.helpText}>Critical for specialized coma care setup</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Medical Status & Prognosis</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe consciousness level, responses, doctor's prognosis, and treatment plan"
                      value={formData.serviceDetails.medical_status || ''} 
                      onChange={(e) => handleServiceDetailChange('medical_status', e.target.value)} />
                    <small className={styles.helpText}>Helps caregiver understand patient condition</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Special Care Instructions & Family Support Needs</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List care protocols, medications, family training needs, and emergency contacts"
                      value={formData.serviceDetails.special_instructions || ''} 
                      onChange={(e) => handleServiceDetailChange('special_instructions', e.target.value)} />
                    <small className={styles.helpText}>Essential for comprehensive coma patient care</small>
                  </div>
                </>
              )}
              
              {/* PALLIATIVE CARE */}
              {serviceName === 'Palliative Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Primary Diagnosis</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.diagnosis || ''} 
                      onChange={(e) => handleServiceDetailChange('diagnosis', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="cancer">Cancer (Terminal Stage)</option>
                      <option value="organ_failure">Organ Failure</option>
                      <option value="neurological">Neurological Disease</option>
                      <option value="dementia">Advanced Dementia</option>
                      <option value="chronic_illness">Chronic Illness (End Stage)</option>
                      <option value="other">Other Terminal Condition</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Symptom Management Needs</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe symptoms (pain, nausea, breathing difficulty, anxiety, etc.)"
                      value={formData.serviceDetails.symptoms || ''} 
                      onChange={(e) => handleServiceDetailChange('symptoms', e.target.value)} />
                    <small className={styles.helpText}>Important for comfort care planning</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Pain Management & Medications</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List current pain medications, dosages, and effectiveness"
                      value={formData.serviceDetails.pain_management || ''} 
                      onChange={(e) => handleServiceDetailChange('pain_management', e.target.value)} />
                    <small className={styles.helpText}>Critical for maintaining patient comfort</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient & Family Wishes</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe care preferences, spiritual needs, and family support requirements"
                      value={formData.serviceDetails.care_wishes || ''} 
                      onChange={(e) => handleServiceDetailChange('care_wishes', e.target.value)} />
                    <small className={styles.helpText}>Ensures dignified and respectful end-of-life care</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Additional Support Needs</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List equipment needs, dietary requirements, and family counseling needs"
                      value={formData.serviceDetails.additional_needs || ''} 
                      onChange={(e) => handleServiceDetailChange('additional_needs', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive palliative care support</small>
                  </div>
                </>
              )}
              
              {/* EARLY STAGE CARE (Parkinson's) */}
              {serviceName === 'Early Stage Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Time Since Diagnosis</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.diagnosis_duration || ''} 
                      onChange={(e) => handleServiceDetailChange('diagnosis_duration', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="recent">Recently Diagnosed (Less than 6 months)</option>
                      <option value="6_12_months">6-12 Months</option>
                      <option value="1_2_years">1-2 Years</option>
                      <option value="2_5_years">2-5 Years</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Symptoms</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe symptoms (tremors, stiffness, balance issues, slowness of movement, etc.)"
                      value={formData.serviceDetails.current_symptoms || ''} 
                      onChange={(e) => handleServiceDetailChange('current_symptoms', e.target.value)} />
                    <small className={styles.helpText}>Helps tailor care to specific symptoms</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Medications</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List Parkinson's medications, dosages, and timing"
                      value={formData.serviceDetails.medications || ''} 
                      onChange={(e) => handleServiceDetailChange('medications', e.target.value)} />
                    <small className={styles.helpText}>Important for medication management support</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Daily Living Challenges</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe difficulties (dressing, eating, walking, writing, etc.)"
                      value={formData.serviceDetails.daily_challenges || ''} 
                      onChange={(e) => handleServiceDetailChange('daily_challenges', e.target.value)} />
                    <small className={styles.helpText}>Identifies areas needing support and adaptation</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Exercise & Lifestyle Support Needed</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List needs (exercise program, fall prevention, lifestyle modifications, etc.)"
                      value={formData.serviceDetails.lifestyle_support || ''} 
                      onChange={(e) => handleServiceDetailChange('lifestyle_support', e.target.value)} />
                    <small className={styles.helpText}>Essential for early-stage management</small>
                  </div>
                </>
              )}
              
              {/* ADVANCED STAGE CARE (Parkinson's) */}
              {serviceName === 'Advanced Stage Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mobility Status</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.mobility_status || ''} 
                      onChange={(e) => handleServiceDetailChange('mobility_status', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="walks_assistance">Walks with Assistance</option>
                      <option value="wheelchair">Wheelchair Dependent</option>
                      <option value="bedridden">Mostly Bedridden</option>
                      <option value="completely_bedridden">Completely Bedridden</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Advanced Symptoms & Complications</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe symptoms (severe tremors, freezing, dyskinesia, hallucinations, dementia, etc.)"
                      value={formData.serviceDetails.advanced_symptoms || ''} 
                      onChange={(e) => handleServiceDetailChange('advanced_symptoms', e.target.value)} />
                    <small className={styles.helpText}>Critical for advanced care planning</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Complete ADL Support Needs</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List all activities needing help (bathing, dressing, feeding, toileting, mobility, etc.)"
                      value={formData.serviceDetails.adl_support || ''} 
                      onChange={(e) => handleServiceDetailChange('adl_support', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive care requirement assessment</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Swallowing & Communication Issues</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe swallowing difficulties, speech problems, and communication needs"
                      value={formData.serviceDetails.swallowing_communication || ''} 
                      onChange={(e) => handleServiceDetailChange('swallowing_communication', e.target.value)} />
                    <small className={styles.helpText}>Important for feeding safety and interaction</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Medications & Special Care Instructions</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List medications, timing requirements, and special care protocols"
                      value={formData.serviceDetails.medications_instructions || ''} 
                      onChange={(e) => handleServiceDetailChange('medications_instructions', e.target.value)} />
                    <small className={styles.helpText}>Essential for advanced Parkinson's management</small>
                  </div>
                </>
              )}
              
              {/* THERAPY SUPPORT (Parkinson's) */}
              {serviceName === 'Therapy Support' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Therapy Types Needed</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.therapy_types || ''} 
                      onChange={(e) => handleServiceDetailChange('therapy_types', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="physical_only">Physical Therapy Only</option>
                      <option value="speech_only">Speech Therapy Only</option>
                      <option value="occupational_only">Occupational Therapy Only</option>
                      <option value="multi_therapy">Multiple Therapies</option>
                      <option value="all_therapies">All Therapies (Physical, Speech, Occupational)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Primary Therapy Goals</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe goals (improve mobility, reduce falls, speech clarity, daily task independence, etc.)"
                      value={formData.serviceDetails.therapy_goals || ''} 
                      onChange={(e) => handleServiceDetailChange('therapy_goals', e.target.value)} />
                    <small className={styles.helpText}>Helps therapist create targeted treatment plan</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Functional Limitations</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List limitations (balance, gait, speech, swallowing, fine motor skills, etc.)"
                      value={formData.serviceDetails.functional_limitations || ''} 
                      onChange={(e) => handleServiceDetailChange('functional_limitations', e.target.value)} />
                    <small className={styles.helpText}>Identifies areas for therapy focus</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Previous Therapy Experience</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe past therapies, what worked well, and current exercise routine"
                      value={formData.serviceDetails.previous_therapy || ''} 
                      onChange={(e) => handleServiceDetailChange('previous_therapy', e.target.value)} />
                    <small className={styles.helpText}>Builds on successful approaches</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Session Frequency & Special Needs</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Preferred frequency, time of day, equipment at home, and special requirements"
                      value={formData.serviceDetails.session_preferences || ''} 
                      onChange={(e) => handleServiceDetailChange('session_preferences', e.target.value)} />
                    <small className={styles.helpText}>Helps schedule effective therapy sessions</small>
                  </div>
                </>
              )}
              
              {/* FAMILY SUPPORT CARE (Parkinson's) */}
              {serviceName === 'Family Support Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Primary Caregiver Relationship</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.caregiver_relationship || ''} 
                      onChange={(e) => handleServiceDetailChange('caregiver_relationship', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="spouse">Spouse/Partner</option>
                      <option value="child">Adult Child</option>
                      <option value="sibling">Sibling</option>
                      <option value="other_family">Other Family Member</option>
                      <option value="multiple">Multiple Family Caregivers</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Family Training Needs</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List training needs (medication management, mobility assistance, symptom management, etc.)"
                      value={formData.serviceDetails.training_needs || ''} 
                      onChange={(e) => handleServiceDetailChange('training_needs', e.target.value)} />
                    <small className={styles.helpText}>Identifies specific areas for family education</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Caregiver Challenges & Concerns</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe challenges (stress, burnout, understanding disease, managing behaviors, etc.)"
                      value={formData.serviceDetails.caregiver_challenges || ''} 
                      onChange={(e) => handleServiceDetailChange('caregiver_challenges', e.target.value)} />
                    <small className={styles.helpText}>Helps provide targeted emotional and practical support</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Support Services Needed</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List needs (respite care, counseling, support groups, care planning, resource guidance, etc.)"
                      value={formData.serviceDetails.support_services || ''} 
                      onChange={(e) => handleServiceDetailChange('support_services', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive family support planning</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Stage & Future Planning</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe current disease stage and concerns about future care needs"
                      value={formData.serviceDetails.future_planning || ''} 
                      onChange={(e) => handleServiceDetailChange('future_planning', e.target.value)} />
                    <small className={styles.helpText}>Helps prepare family for progressive care needs</small>
                  </div>
                </>
              )}
              
              {/* ORTHOPEDIC PHYSIOTHERAPY */}
              {serviceName === 'Orthopedic Physiotherapy' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Primary Condition/Injury</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.primary_condition || ''} 
                      onChange={(e) => handleServiceDetailChange('primary_condition', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="joint_replacement">Joint Replacement (Knee/Hip)</option>
                      <option value="fracture">Fracture Recovery</option>
                      <option value="sports_injury">Sports Injury</option>
                      <option value="back_pain">Back Pain/Spine Issues</option>
                      <option value="neck_pain">Neck Pain/Cervical Issues</option>
                      <option value="arthritis">Arthritis</option>
                      <option value="ligament_injury">Ligament/Tendon Injury</option>
                      <option value="other">Other Orthopedic Condition</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Affected Body Part(s)</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Specify affected areas (knee, hip, shoulder, back, ankle, etc.)"
                      value={formData.serviceDetails.affected_parts || ''} 
                      onChange={(e) => handleServiceDetailChange('affected_parts', e.target.value)} />
                    <small className={styles.helpText}>Helps therapist prepare targeted treatment</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Surgery/Treatment Date (if applicable)</label>
                    <input type="text" className={styles.formInput} 
                      placeholder="e.g., 2 weeks ago, 1 month ago, or N/A"
                      value={formData.serviceDetails.surgery_date || ''} 
                      onChange={(e) => handleServiceDetailChange('surgery_date', e.target.value)} />
                    <small className={styles.helpText}>Important for post-surgical rehabilitation timeline</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Pain Level & Mobility</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe pain level (1-10), mobility limitations, and daily activity challenges"
                      value={formData.serviceDetails.pain_mobility || ''} 
                      onChange={(e) => handleServiceDetailChange('pain_mobility', e.target.value)} />
                    <small className={styles.helpText}>Baseline assessment for treatment planning</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Therapy Goals & Special Requirements</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List goals (pain reduction, mobility improvement, return to sports, etc.) and any special needs"
                      value={formData.serviceDetails.therapy_goals || ''} 
                      onChange={(e) => handleServiceDetailChange('therapy_goals', e.target.value)} />
                    <small className={styles.helpText}>Helps create personalized rehabilitation plan</small>
                  </div>
                </>
              )}
              
              {/* NEUROLOGICAL PHYSIOTHERAPY */}
              {serviceName === 'Neurological Physiotherapy' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Neurological Condition</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.neurological_condition || ''} 
                      onChange={(e) => handleServiceDetailChange('neurological_condition', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="stroke">Stroke Recovery</option>
                      <option value="paralysis">Paralysis (Hemiplegia/Paraplegia)</option>
                      <option value="parkinsons">Parkinson's Disease</option>
                      <option value="spinal_injury">Spinal Cord Injury</option>
                      <option value="multiple_sclerosis">Multiple Sclerosis</option>
                      <option value="cerebral_palsy">Cerebral Palsy</option>
                      <option value="neuropathy">Peripheral Neuropathy</option>
                      <option value="other">Other Neurological Condition</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Affected Body Parts & Paralysis Side</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe affected areas (left/right side, upper/lower limbs, etc.)"
                      value={formData.serviceDetails.affected_areas || ''} 
                      onChange={(e) => handleServiceDetailChange('affected_areas', e.target.value)} />
                    <small className={styles.helpText}>Important for targeted neuro-rehabilitation</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Mobility & Balance Status</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.mobility_status || ''} 
                      onChange={(e) => handleServiceDetailChange('mobility_status', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="bedridden">Bedridden</option>
                      <option value="wheelchair">Wheelchair Dependent</option>
                      <option value="walker">Walks with Walker/Support</option>
                      <option value="assisted">Walks with Assistance</option>
                      <option value="independent">Independent with Balance Issues</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Specific Challenges & Symptoms</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe challenges (muscle weakness, spasticity, tremors, coordination issues, etc.)"
                      value={formData.serviceDetails.challenges || ''} 
                      onChange={(e) => handleServiceDetailChange('challenges', e.target.value)} />
                    <small className={styles.helpText}>Helps design appropriate neuro-therapy program</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Rehabilitation Goals & Medical History</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List goals (walking, balance, independence) and relevant medical history"
                      value={formData.serviceDetails.goals_history || ''} 
                      onChange={(e) => handleServiceDetailChange('goals_history', e.target.value)} />
                    <small className={styles.helpText}>Essential for comprehensive neuro-rehabilitation plan</small>
                  </div>
                </>
              )}
              
              {/* PEDIATRIC PHYSIOTHERAPY */}
              {serviceName === 'Pediatric Physiotherapy' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Child's Age</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.child_age_group || ''} 
                      onChange={(e) => handleServiceDetailChange('child_age_group', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="newborn">Newborn (0-3 months)</option>
                      <option value="infant">Infant (3-12 months)</option>
                      <option value="toddler">Toddler (1-3 years)</option>
                      <option value="preschool">Preschool (3-5 years)</option>
                      <option value="school_age">School Age (5-12 years)</option>
                      <option value="adolescent">Adolescent (12-18 years)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Child's Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.child_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('child_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Primary Condition/Concern</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.primary_condition || ''} 
                      onChange={(e) => handleServiceDetailChange('primary_condition', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="developmental_delay">Developmental Delay</option>
                      <option value="cerebral_palsy">Cerebral Palsy</option>
                      <option value="birth_injury">Birth Injury/Trauma</option>
                      <option value="muscular_dystrophy">Muscular Dystrophy</option>
                      <option value="postural_issues">Postural/Alignment Issues</option>
                      <option value="genetic_disorder">Genetic Disorder</option>
                      <option value="sports_injury">Sports/Activity Injury</option>
                      <option value="other">Other Pediatric Condition</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Developmental Milestones Status</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe current abilities (sitting, crawling, walking, running, etc.) and delays"
                      value={formData.serviceDetails.milestones || ''} 
                      onChange={(e) => handleServiceDetailChange('milestones', e.target.value)} />
                    <small className={styles.helpText}>Helps assess developmental progress</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Physical Challenges & Limitations</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List challenges (muscle weakness, coordination, balance, posture, movement patterns, etc.)"
                      value={formData.serviceDetails.challenges || ''} 
                      onChange={(e) => handleServiceDetailChange('challenges', e.target.value)} />
                    <small className={styles.helpText}>Identifies areas needing therapeutic intervention</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Therapy Goals for Child</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe goals (walking independently, improving strength, better posture, etc.)"
                      value={formData.serviceDetails.therapy_goals || ''} 
                      onChange={(e) => handleServiceDetailChange('therapy_goals', e.target.value)} />
                    <small className={styles.helpText}>Helps create age-appropriate treatment plan</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Medical History & Special Needs</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List medical conditions, surgeries, medications, and special care requirements"
                      value={formData.serviceDetails.medical_history || ''} 
                      onChange={(e) => handleServiceDetailChange('medical_history', e.target.value)} />
                    <small className={styles.helpText}>Essential for safe pediatric physiotherapy</small>
                  </div>
                </>
              )}
              
              {/* CHEST PHYSIOTHERAPY */}
              {serviceName === 'Chest Physiotherapy' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Respiratory Condition</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.respiratory_condition || ''} 
                      onChange={(e) => handleServiceDetailChange('respiratory_condition', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="post_covid">Post-COVID Recovery</option>
                      <option value="copd">COPD (Chronic Obstructive Pulmonary Disease)</option>
                      <option value="asthma">Asthma</option>
                      <option value="pneumonia">Pneumonia Recovery</option>
                      <option value="bronchitis">Chronic Bronchitis</option>
                      <option value="lung_surgery">Post Lung Surgery</option>
                      <option value="cystic_fibrosis">Cystic Fibrosis</option>
                      <option value="other">Other Respiratory Condition</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Breathing Difficulties</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe symptoms (shortness of breath, wheezing, cough, mucus production, etc.)"
                      value={formData.serviceDetails.breathing_difficulties || ''} 
                      onChange={(e) => handleServiceDetailChange('breathing_difficulties', e.target.value)} />
                    <small className={styles.helpText}>Helps assess respiratory function</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Oxygen Support Status</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.oxygen_support || ''} 
                      onChange={(e) => handleServiceDetailChange('oxygen_support', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="no_oxygen">No Oxygen Support</option>
                      <option value="occasional">Occasional Oxygen Use</option>
                      <option value="continuous">Continuous Oxygen Support</option>
                      <option value="ventilator">Ventilator Support</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Activity Limitations & Daily Impact</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe how breathing affects daily activities (walking, stairs, talking, sleeping, etc.)"
                      value={formData.serviceDetails.activity_limitations || ''} 
                      onChange={(e) => handleServiceDetailChange('activity_limitations', e.target.value)} />
                    <small className={styles.helpText}>Identifies functional limitations</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Therapy Goals & Medical Information</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List goals (improve breathing, reduce cough, increase stamina) and relevant medical history"
                      value={formData.serviceDetails.therapy_goals || ''} 
                      onChange={(e) => handleServiceDetailChange('therapy_goals', e.target.value)} />
                    <small className={styles.helpText}>Essential for respiratory rehabilitation planning</small>
                  </div>
                </>
              )}
              
              {/* RESIDENTIAL SECURITY */}
              {serviceName === 'Residential Security' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Property Type</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.property_type || ''} 
                      onChange={(e) => handleServiceDetailChange('property_type', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="independent_house">Independent House/Villa</option>
                      <option value="apartment">Apartment/Flat</option>
                      <option value="gated_community">Gated Community</option>
                      <option value="farmhouse">Farmhouse</option>
                      <option value="bungalow">Bungalow</option>
                      <option value="other">Other Residential Property</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Property Size</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.property_size || ''} 
                      onChange={(e) => handleServiceDetailChange('property_size', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="small">Small (Up to 1000 sq ft)</option>
                      <option value="medium">Medium (1000-2500 sq ft)</option>
                      <option value="large">Large (2500-5000 sq ft)</option>
                      <option value="very_large">Very Large (5000+ sq ft)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Security Shift Required</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.shift_required || ''} 
                      onChange={(e) => handleServiceDetailChange('shift_required', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="day_shift">Day Shift (8 AM - 8 PM)</option>
                      <option value="night_shift">Night Shift (8 PM - 8 AM)</option>
                      <option value="24_hours">24 Hours (Full Day)</option>
                      <option value="custom">Custom Hours</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Number of Guards Needed</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.guards_needed || ''} 
                      onChange={(e) => handleServiceDetailChange('guards_needed', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="1">1 Guard</option>
                      <option value="2">2 Guards</option>
                      <option value="3">3 Guards</option>
                      <option value="4+">4+ Guards</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Security Concerns & Requirements</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe concerns (theft prevention, visitor control, perimeter security, etc.)"
                      value={formData.serviceDetails.security_concerns || ''} 
                      onChange={(e) => handleServiceDetailChange('security_concerns', e.target.value)} />
                    <small className={styles.helpText}>Helps us understand your security needs</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Existing Security Infrastructure</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List existing systems (CCTV, alarm, access control, gate, etc.)"
                      value={formData.serviceDetails.existing_infrastructure || ''} 
                      onChange={(e) => handleServiceDetailChange('existing_infrastructure', e.target.value)} />
                    <small className={styles.helpText}>Helps guard integrate with existing security</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Special Instructions & Duties</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List specific duties (gate control, visitor log, patrol routes, emergency contacts, etc.)"
                      value={formData.serviceDetails.special_instructions || ''} 
                      onChange={(e) => handleServiceDetailChange('special_instructions', e.target.value)} />
                    <small className={styles.helpText}>Clear instructions for guard responsibilities</small>
                  </div>
                </>
              )}
              
              {/* CORPORATE SECURITY */}
              {serviceName === 'Corporate Security' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Business Type</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.business_type || ''} 
                      onChange={(e) => handleServiceDetailChange('business_type', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="office">Office Building</option>
                      <option value="retail">Retail Store/Shop</option>
                      <option value="warehouse">Warehouse/Godown</option>
                      <option value="factory">Factory/Manufacturing</option>
                      <option value="construction">Construction Site</option>
                      <option value="showroom">Showroom</option>
                      <option value="other">Other Commercial Property</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Premises Size</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.premises_size || ''} 
                      onChange={(e) => handleServiceDetailChange('premises_size', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="small">Small (Single Floor/Shop)</option>
                      <option value="medium">Medium (Multi-Floor Building)</option>
                      <option value="large">Large (Complex/Campus)</option>
                      <option value="very_large">Very Large (Multiple Buildings)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Security Coverage Required</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.coverage_required || ''} 
                      onChange={(e) => handleServiceDetailChange('coverage_required', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="business_hours">Business Hours Only</option>
                      <option value="extended_hours">Extended Hours (12-16 hours)</option>
                      <option value="24_hours">24/7 Coverage</option>
                      <option value="custom">Custom Schedule</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Number of Security Personnel</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.personnel_count || ''} 
                      onChange={(e) => handleServiceDetailChange('personnel_count', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="1">1 Guard</option>
                      <option value="2">2 Guards</option>
                      <option value="3-5">3-5 Guards</option>
                      <option value="5+">5+ Guards (Security Team)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Primary Security Responsibilities</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List duties (access control, asset protection, employee safety, visitor management, etc.)"
                      value={formData.serviceDetails.responsibilities || ''} 
                      onChange={(e) => handleServiceDetailChange('responsibilities', e.target.value)} />
                    <small className={styles.helpText}>Define guard's role and responsibilities</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Security Systems & Equipment</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe existing systems (CCTV, biometric, alarm, access cards, etc.)"
                      value={formData.serviceDetails.security_systems || ''} 
                      onChange={(e) => handleServiceDetailChange('security_systems', e.target.value)} />
                    <small className={styles.helpText}>Helps guard operate security infrastructure</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Special Requirements & Protocols</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List protocols (emergency procedures, reporting structure, uniform requirements, etc.)"
                      value={formData.serviceDetails.special_requirements || ''} 
                      onChange={(e) => handleServiceDetailChange('special_requirements', e.target.value)} />
                    <small className={styles.helpText}>Corporate security standards and procedures</small>
                  </div>
                </>
              )}
              
              {/* PERSONAL SECURITY/BODYGUARD */}
              {serviceName === 'Personal Security/Bodyguard' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Protection Type Required</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.protection_type || ''} 
                      onChange={(e) => handleServiceDetailChange('protection_type', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="individual">Individual Protection</option>
                      <option value="family">Family Protection</option>
                      <option value="executive">Executive/VIP Protection</option>
                      <option value="celebrity">Celebrity Protection</option>
                      <option value="event">Event Security</option>
                      <option value="travel">Travel Security</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Number of People to Protect</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.people_count || ''} 
                      onChange={(e) => handleServiceDetailChange('people_count', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3-5">3-5 People (Family)</option>
                      <option value="5+">5+ People (Group)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Security Coverage Duration</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.coverage_duration || ''} 
                      onChange={(e) => handleServiceDetailChange('coverage_duration', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="specific_hours">Specific Hours Daily</option>
                      <option value="business_hours">Business/Work Hours</option>
                      <option value="24_hours">24/7 Protection</option>
                      <option value="event_based">Event/Occasion Based</option>
                      <option value="travel">During Travel Only</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Threat Level & Security Concerns</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.threat_level || ''} 
                      onChange={(e) => handleServiceDetailChange('threat_level', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="low">Low - General Safety</option>
                      <option value="medium">Medium - Precautionary</option>
                      <option value="high">High - Specific Threats</option>
                      <option value="very_high">Very High - Active Threats</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Specific Security Needs</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe needs (crowd management, stalker protection, privacy, armed/unarmed, etc.)"
                      value={formData.serviceDetails.security_needs || ''} 
                      onChange={(e) => handleServiceDetailChange('security_needs', e.target.value)} />
                    <small className={styles.helpText}>Helps assign appropriate bodyguard expertise</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Daily Routine & Locations</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe typical schedule, frequent locations, travel patterns, etc."
                      value={formData.serviceDetails.daily_routine || ''} 
                      onChange={(e) => handleServiceDetailChange('daily_routine', e.target.value)} />
                    <small className={styles.helpText}>Helps bodyguard plan security coverage</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Special Requirements & Preferences</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List requirements (armed guard, driving skills, language, discretion level, etc.)"
                      value={formData.serviceDetails.special_requirements || ''} 
                      onChange={(e) => handleServiceDetailChange('special_requirements', e.target.value)} />
                    <small className={styles.helpText}>Ensures right bodyguard match for your needs</small>
                  </div>
                </>
              )}
              
              {/* NIGHT WATCHMAN */}
              {serviceName === 'Night Watchman' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Property Type</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.property_type || ''} 
                      onChange={(e) => handleServiceDetailChange('property_type', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="residential">Residential Property</option>
                      <option value="commercial">Commercial Building</option>
                      <option value="industrial">Industrial/Warehouse</option>
                      <option value="construction">Construction Site</option>
                      <option value="agricultural">Agricultural/Farmland</option>
                      <option value="other">Other Property</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Night Shift Hours</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.shift_hours || ''} 
                      onChange={(e) => handleServiceDetailChange('shift_hours', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="8pm_6am">8 PM - 6 AM (10 hours)</option>
                      <option value="10pm_6am">10 PM - 6 AM (8 hours)</option>
                      <option value="12am_6am">12 AM - 6 AM (6 hours)</option>
                      <option value="custom">Custom Night Hours</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Property Size & Coverage Area</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.coverage_area || ''} 
                      onChange={(e) => handleServiceDetailChange('coverage_area', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="small">Small (Single Building/House)</option>
                      <option value="medium">Medium (Compound/Multiple Buildings)</option>
                      <option value="large">Large (Campus/Estate)</option>
                      <option value="very_large">Very Large (Multiple Acres)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Primary Night Duties</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List duties (perimeter patrol, gate monitoring, CCTV watch, alarm response, etc.)"
                      value={formData.serviceDetails.primary_duties || ''} 
                      onChange={(e) => handleServiceDetailChange('primary_duties', e.target.value)} />
                    <small className={styles.helpText}>Define watchman's responsibilities during night</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Security Concerns at Night</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe concerns (theft, trespassing, vandalism, animal intrusion, etc.)"
                      value={formData.serviceDetails.security_concerns || ''} 
                      onChange={(e) => handleServiceDetailChange('security_concerns', e.target.value)} />
                    <small className={styles.helpText}>Helps watchman focus on key security areas</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Facilities & Equipment Available</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List facilities (guard room, lighting, CCTV, alarm system, flashlight, etc.)"
                      value={formData.serviceDetails.facilities || ''} 
                      onChange={(e) => handleServiceDetailChange('facilities', e.target.value)} />
                    <small className={styles.helpText}>Helps watchman understand available resources</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Emergency Contacts & Protocols</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List emergency contacts, reporting procedures, and incident protocols"
                      value={formData.serviceDetails.emergency_protocols || ''} 
                      onChange={(e) => handleServiceDetailChange('emergency_protocols', e.target.value)} />
                    <small className={styles.helpText}>Critical for night emergency response</small>
                  </div>
                </>
              )}
              
              {/* NEWBORN CARE (0-3 months) */}
              {serviceName === 'Newborn Care (0-3 months)' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Baby's Age</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.baby_age || ''} 
                      onChange={(e) => handleServiceDetailChange('baby_age', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="0_1_week">0-1 Week Old</option>
                      <option value="1_2_weeks">1-2 Weeks Old</option>
                      <option value="2_4_weeks">2-4 Weeks Old</option>
                      <option value="1_2_months">1-2 Months Old</option>
                      <option value="2_3_months">2-3 Months Old</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Baby's Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.baby_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('baby_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Delivery Type</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.delivery_type || ''} 
                      onChange={(e) => handleServiceDetailChange('delivery_type', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="normal">Normal Delivery</option>
                      <option value="cesarean">C-Section</option>
                      <option value="premature">Premature Birth</option>
                      <option value="complicated">Complicated Delivery</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Feeding Method</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.feeding_method || ''} 
                      onChange={(e) => handleServiceDetailChange('feeding_method', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="breastfeeding">Breastfeeding Only</option>
                      <option value="formula">Formula Feeding Only</option>
                      <option value="mixed">Mixed (Breast + Formula)</option>
                      <option value="need_help">Need Guidance</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Specific Care Needs</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe needs (breastfeeding support, sleep training, umbilical care, bathing, etc.)"
                      value={formData.serviceDetails.care_needs || ''} 
                      onChange={(e) => handleServiceDetailChange('care_needs', e.target.value)} />
                    <small className={styles.helpText}>Helps specialist prepare for newborn care</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Health Concerns & Medical History</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List any health issues, jaundice, birth complications, or special medical needs"
                      value={formData.serviceDetails.health_concerns || ''} 
                      onChange={(e) => handleServiceDetailChange('health_concerns', e.target.value)} />
                    <small className={styles.helpText}>Important for safe newborn care</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mother's Support Needs</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe mother's needs (first-time mom, recovery support, emotional support, etc.)"
                      value={formData.serviceDetails.mother_support || ''} 
                      onChange={(e) => handleServiceDetailChange('mother_support', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive mother-baby care planning</small>
                  </div>
                </>
              )}
              
              {/* POSTNATAL MOTHER CARE */}
              {serviceName === 'Postnatal Mother Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Time Since Delivery</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.delivery_time || ''} 
                      onChange={(e) => handleServiceDetailChange('delivery_time', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="0_1_week">0-1 Week</option>
                      <option value="1_2_weeks">1-2 Weeks</option>
                      <option value="2_4_weeks">2-4 Weeks</option>
                      <option value="1_2_months">1-2 Months</option>
                      <option value="2_3_months">2-3 Months</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Type of Delivery</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.delivery_type || ''} 
                      onChange={(e) => handleServiceDetailChange('delivery_type', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="normal">Normal Delivery</option>
                      <option value="cesarean">C-Section</option>
                      <option value="complicated">Complicated Delivery</option>
                      <option value="multiple">Multiple Babies</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Recovery Challenges</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe challenges (pain, mobility, stitches, breastfeeding, fatigue, etc.)"
                      value={formData.serviceDetails.recovery_challenges || ''} 
                      onChange={(e) => handleServiceDetailChange('recovery_challenges', e.target.value)} />
                    <small className={styles.helpText}>Helps provide targeted recovery support</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Physical Support Needed</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List needs (mobility assistance, bathing, wound care, exercise guidance, etc.)"
                      value={formData.serviceDetails.physical_support || ''} 
                      onChange={(e) => handleServiceDetailChange('physical_support', e.target.value)} />
                    <small className={styles.helpText}>Physical recovery assistance planning</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Nutrition & Diet Requirements</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe dietary needs, restrictions, lactation diet, traditional foods, etc."
                      value={formData.serviceDetails.nutrition_needs || ''} 
                      onChange={(e) => handleServiceDetailChange('nutrition_needs', e.target.value)} />
                    <small className={styles.helpText}>Important for postnatal nutrition planning</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Emotional & Mental Health Support</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe emotional state, anxiety, baby blues, support system, etc."
                      value={formData.serviceDetails.emotional_support || ''} 
                      onChange={(e) => handleServiceDetailChange('emotional_support', e.target.value)} />
                    <small className={styles.helpText}>Holistic postnatal care includes mental wellness</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Additional Care Requirements</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List other needs (household help, baby care training, family support, etc.)"
                      value={formData.serviceDetails.additional_care || ''} 
                      onChange={(e) => handleServiceDetailChange('additional_care', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive postnatal support planning</small>
                  </div>
                </>
              )}
              
              {/* BABY MASSAGE & CARE */}
              {serviceName === 'Baby Massage & Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Baby's Age</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.baby_age || ''} 
                      onChange={(e) => handleServiceDetailChange('baby_age', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="0_3_months">0-3 Months</option>
                      <option value="3_6_months">3-6 Months</option>
                      <option value="6_12_months">6-12 Months</option>
                      <option value="1_2_years">1-2 Years</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Baby's Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.baby_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('baby_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Massage Preference</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.massage_preference || ''} 
                      onChange={(e) => handleServiceDetailChange('massage_preference', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="traditional">Traditional Indian Massage</option>
                      <option value="gentle">Gentle/Modern Massage</option>
                      <option value="therapeutic">Therapeutic Massage</option>
                      <option value="need_guidance">Need Expert Guidance</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Developmental Milestones Status</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe current milestones (rolling, sitting, crawling, walking, etc.)"
                      value={formData.serviceDetails.milestones || ''} 
                      onChange={(e) => handleServiceDetailChange('milestones', e.target.value)} />
                    <small className={styles.helpText}>Helps track baby's development progress</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Specific Care Activities Needed</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List activities (massage, bathing, play activities, tummy time, sensory development, etc.)"
                      value={formData.serviceDetails.care_activities || ''} 
                      onChange={(e) => handleServiceDetailChange('care_activities', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive baby care and development</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Health Concerns & Allergies</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List any skin sensitivities, allergies, medical conditions, or special care needs"
                      value={formData.serviceDetails.health_concerns || ''} 
                      onChange={(e) => handleServiceDetailChange('health_concerns', e.target.value)} />
                    <small className={styles.helpText}>Important for safe baby massage and care</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Parent Training & Support Needs</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe needs (learn massage techniques, developmental activities, immunization guidance, etc.)"
                      value={formData.serviceDetails.parent_training || ''} 
                      onChange={(e) => handleServiceDetailChange('parent_training', e.target.value)} />
                    <small className={styles.helpText}>Empowering parents with baby care skills</small>
                  </div>
                </>
              )}
              
              {/* TWINS/MULTIPLE BABIES CARE */}
              {serviceName === 'Twins/Multiple Babies Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Number of Babies</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.number_of_babies || ''} 
                      onChange={(e) => handleServiceDetailChange('number_of_babies', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="2">Twins (2 Babies)</option>
                      <option value="3">Triplets (3 Babies)</option>
                      <option value="4+">4+ Babies</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Babies' Age</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.babies_age || ''} 
                      onChange={(e) => handleServiceDetailChange('babies_age', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="0_1_month">0-1 Month</option>
                      <option value="1_3_months">1-3 Months</option>
                      <option value="3_6_months">3-6 Months</option>
                      <option value="6_12_months">6-12 Months</option>
                      <option value="1_2_years">1-2 Years</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Type of Multiple Birth</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.birth_type || ''} 
                      onChange={(e) => handleServiceDetailChange('birth_type', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="identical">Identical Twins/Multiples</option>
                      <option value="fraternal">Fraternal Twins/Multiples</option>
                      <option value="premature">Premature Birth</option>
                      <option value="not_sure">Not Sure</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Feeding Schedule & Challenges</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe feeding method, schedule coordination, challenges (breastfeeding, formula, tandem feeding, etc.)"
                      value={formData.serviceDetails.feeding_schedule || ''} 
                      onChange={(e) => handleServiceDetailChange('feeding_schedule', e.target.value)} />
                    <small className={styles.helpText}>Critical for managing multiple babies' feeding</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Sleep & Routine Management</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe sleep patterns, routine challenges, and schedule coordination needs"
                      value={formData.serviceDetails.sleep_routine || ''} 
                      onChange={(e) => handleServiceDetailChange('sleep_routine', e.target.value)} />
                    <small className={styles.helpText}>Helps establish coordinated care routine</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Individual Health Concerns</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List any health issues, developmental differences, or special needs for each baby"
                      value={formData.serviceDetails.health_concerns || ''} 
                      onChange={(e) => handleServiceDetailChange('health_concerns', e.target.value)} />
                    <small className={styles.helpText}>Important for individualized care within multiples</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Support Needs & Challenges</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe challenges (overwhelmed, need extra hands, mother's recovery, family support, etc.)"
                      value={formData.serviceDetails.support_needs || ''} 
                      onChange={(e) => handleServiceDetailChange('support_needs', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive support for multiple babies care</small>
                  </div>
                </>
              )}
              
              {/* HEMIPLEGIA CARE */}
              {serviceName === 'Hemiplegia Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Cause of Hemiplegia</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.cause || ''} 
                      onChange={(e) => handleServiceDetailChange('cause', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="stroke">Stroke (Ischemic/Hemorrhagic)</option>
                      <option value="brain_injury">Traumatic Brain Injury</option>
                      <option value="brain_tumor">Brain Tumor</option>
                      <option value="infection">Brain Infection</option>
                      <option value="other">Other Neurological Cause</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Affected Side & Severity</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.affected_side || ''} 
                      onChange={(e) => handleServiceDetailChange('affected_side', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="left_mild">Left Side - Mild Weakness</option>
                      <option value="left_moderate">Left Side - Moderate Paralysis</option>
                      <option value="left_severe">Left Side - Severe Paralysis</option>
                      <option value="right_mild">Right Side - Mild Weakness</option>
                      <option value="right_moderate">Right Side - Moderate Paralysis</option>
                      <option value="right_severe">Right Side - Severe Paralysis</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Mobility & Functional Status</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe mobility (bedridden, wheelchair, walker, walking with support, etc.) and daily activities"
                      value={formData.serviceDetails.mobility_status || ''} 
                      onChange={(e) => handleServiceDetailChange('mobility_status', e.target.value)} />
                    <small className={styles.helpText}>Helps assess care and rehabilitation needs</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Rehabilitation & Therapy Status</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe ongoing therapies (physiotherapy, occupational therapy, speech therapy, etc.)"
                      value={formData.serviceDetails.therapy_status || ''} 
                      onChange={(e) => handleServiceDetailChange('therapy_status', e.target.value)} />
                    <small className={styles.helpText}>Coordinates care with existing rehabilitation</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Care Needs & Special Requirements</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List needs (ADL assistance, mobility training, spasticity management, medications, etc.)"
                      value={formData.serviceDetails.care_needs || ''} 
                      onChange={(e) => handleServiceDetailChange('care_needs', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive hemiplegia care planning</small>
                  </div>
                </>
              )}
              
              {/* PARAPLEGIA CARE */}
              {serviceName === 'Paraplegia Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Cause of Paraplegia</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.cause || ''} 
                      onChange={(e) => handleServiceDetailChange('cause', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="spinal_injury">Spinal Cord Injury (Accident)</option>
                      <option value="spinal_disease">Spinal Disease/Tumor</option>
                      <option value="infection">Spinal Infection</option>
                      <option value="congenital">Congenital Condition</option>
                      <option value="other">Other Spinal Cause</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Level of Spinal Injury</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.injury_level || ''} 
                      onChange={(e) => handleServiceDetailChange('injury_level', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="thoracic">Thoracic (T1-T12)</option>
                      <option value="lumbar">Lumbar (L1-L5)</option>
                      <option value="sacral">Sacral (S1-S5)</option>
                      <option value="not_sure">Not Sure/Unknown</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Wheelchair & Mobility Equipment</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe wheelchair type, transfer equipment, and mobility aids available"
                      value={formData.serviceDetails.mobility_equipment || ''} 
                      onChange={(e) => handleServiceDetailChange('mobility_equipment', e.target.value)} />
                    <small className={styles.helpText}>Helps caregiver with equipment handling</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Bladder & Bowel Management</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe current management (catheter, bowel program, assistance needed, etc.)"
                      value={formData.serviceDetails.bladder_bowel || ''} 
                      onChange={(e) => handleServiceDetailChange('bladder_bowel', e.target.value)} />
                    <small className={styles.helpText}>Critical for paraplegia care management</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Care Needs & Special Requirements</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List needs (transfers, pressure sore prevention, exercises, medications, etc.)"
                      value={formData.serviceDetails.care_needs || ''} 
                      onChange={(e) => handleServiceDetailChange('care_needs', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive paraplegia care planning</small>
                  </div>
                </>
              )}
              
              {/* QUADRIPLEGIA CARE */}
              {serviceName === 'Quadriplegia Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Cause of Quadriplegia</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.cause || ''} 
                      onChange={(e) => handleServiceDetailChange('cause', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="spinal_injury">High Spinal Cord Injury (Cervical)</option>
                      <option value="stroke">Severe Stroke</option>
                      <option value="disease">Neurological Disease</option>
                      <option value="accident">Traumatic Accident</option>
                      <option value="other">Other Medical Cause</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Level of Dependency</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.dependency_level || ''} 
                      onChange={(e) => handleServiceDetailChange('dependency_level', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="complete">Complete Dependency (All ADLs)</option>
                      <option value="high">High Dependency (Most ADLs)</option>
                      <option value="partial">Partial Movement in Some Limbs</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Medical Equipment & Life Support</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List equipment (ventilator, suction, feeding tube, catheter, hospital bed, air mattress, etc.)"
                      value={formData.serviceDetails.medical_equipment || ''} 
                      onChange={(e) => handleServiceDetailChange('medical_equipment', e.target.value)} />
                    <small className={styles.helpText}>Critical for advanced care equipment handling</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Respiratory & Breathing Support</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe respiratory status (ventilator, oxygen, suction needs, breathing exercises, etc.)"
                      value={formData.serviceDetails.respiratory_support || ''} 
                      onChange={(e) => handleServiceDetailChange('respiratory_support', e.target.value)} />
                    <small className={styles.helpText}>Essential for respiratory care management</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Complete Care Requirements</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List all care needs (feeding, bathing, positioning, wound care, medications, therapy, etc.)"
                      value={formData.serviceDetails.care_requirements || ''} 
                      onChange={(e) => handleServiceDetailChange('care_requirements', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive quadriplegia care planning</small>
                  </div>
                </>
              )}
              
              {/* FACIAL PARALYSIS CARE */}
              {serviceName === 'Facial Paralysis Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Type of Facial Paralysis</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.paralysis_type || ''} 
                      onChange={(e) => handleServiceDetailChange('paralysis_type', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="bells_palsy">Bell's Palsy</option>
                      <option value="stroke">Stroke-Related</option>
                      <option value="ramsay_hunt">Ramsay Hunt Syndrome</option>
                      <option value="trauma">Facial Trauma/Injury</option>
                      <option value="tumor">Tumor/Surgery Related</option>
                      <option value="other">Other Facial Nerve Condition</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Affected Side & Severity</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.affected_side || ''} 
                      onChange={(e) => handleServiceDetailChange('affected_side', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="left_mild">Left Side - Mild</option>
                      <option value="left_moderate">Left Side - Moderate</option>
                      <option value="left_severe">Left Side - Severe/Complete</option>
                      <option value="right_mild">Right Side - Mild</option>
                      <option value="right_moderate">Right Side - Moderate</option>
                      <option value="right_severe">Right Side - Severe/Complete</option>
                      <option value="bilateral">Both Sides (Bilateral)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Symptoms & Challenges</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe symptoms (drooping, eye closure issues, drooling, speech difficulty, eating problems, etc.)"
                      value={formData.serviceDetails.symptoms || ''} 
                      onChange={(e) => handleServiceDetailChange('symptoms', e.target.value)} />
                    <small className={styles.helpText}>Helps tailor facial paralysis care</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Treatment & Therapy</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe treatments (medications, facial exercises, physiotherapy, speech therapy, etc.)"
                      value={formData.serviceDetails.current_treatment || ''} 
                      onChange={(e) => handleServiceDetailChange('current_treatment', e.target.value)} />
                    <small className={styles.helpText}>Coordinates care with existing treatment</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Care Needs & Recovery Goals</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List needs (facial exercises, eye care, speech support, eating assistance, emotional support, etc.)"
                      value={formData.serviceDetails.care_needs || ''} 
                      onChange={(e) => handleServiceDetailChange('care_needs', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive facial paralysis recovery planning</small>
                  </div>
                </>
              )}
              
              {/* HOME SAMPLE COLLECTION */}
              {serviceName === 'Home Sample Collection' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Type of Test Required</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.test_type || ''} 
                      onChange={(e) => handleServiceDetailChange('test_type', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="blood_test">Blood Test</option>
                      <option value="urine_test">Urine Test</option>
                      <option value="stool_test">Stool Test</option>
                      <option value="swab_test">Swab Collection (Throat/Nasal)</option>
                      <option value="multiple">Multiple Tests</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Specific Tests Prescribed</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List all tests prescribed by doctor (CBC, Lipid Profile, HbA1c, Thyroid, etc.)"
                      value={formData.serviceDetails.prescribed_tests || ''} 
                      onChange={(e) => handleServiceDetailChange('prescribed_tests', e.target.value)} />
                    <small className={styles.helpText}>Helps lab prepare necessary equipment</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Fasting Required?</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.fasting_required || ''} 
                      onChange={(e) => handleServiceDetailChange('fasting_required', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="yes">Yes - Fasting Required</option>
                      <option value="no">No - No Fasting Needed</option>
                      <option value="not_sure">Not Sure</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preferred Collection Time</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.preferred_time || ''} 
                      onChange={(e) => handleServiceDetailChange('preferred_time', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="early_morning">Early Morning (6-8 AM)</option>
                      <option value="morning">Morning (8-11 AM)</option>
                      <option value="afternoon">Afternoon (12-3 PM)</option>
                      <option value="evening">Evening (3-6 PM)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Number of People for Sample Collection</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.people_count || ''} 
                      onChange={(e) => handleServiceDetailChange('people_count', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                      <option value="4+">4+ People</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age & Special Considerations</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Mention age, if elderly/child, difficult veins, anxiety, special needs, etc."
                      value={formData.serviceDetails.patient_info || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_info', e.target.value)} />
                    <small className={styles.helpText}>Helps technician prepare appropriately</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Report Delivery Preference</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.report_delivery || ''} 
                      onChange={(e) => handleServiceDetailChange('report_delivery', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="email">Email Only</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="both">Email + WhatsApp</option>
                      <option value="physical">Physical Copy Also Needed</option>
                    </select>
                  </div>
                </>
              )}
              
              {/* DIAGNOSTIC SERVICES */}
              {serviceName === 'Diagnostic Services' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Type of Diagnostic Test</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.diagnostic_type || ''} 
                      onChange={(e) => handleServiceDetailChange('diagnostic_type', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="ecg">ECG (Electrocardiogram)</option>
                      <option value="echo">Echocardiogram</option>
                      <option value="xray">Portable X-Ray</option>
                      <option value="ultrasound">Ultrasound</option>
                      <option value="multiple">Multiple Diagnostics</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Reason for Test</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe symptoms or reason (chest pain, breathing issues, injury, routine checkup, etc.)"
                      value={formData.serviceDetails.test_reason || ''} 
                      onChange={(e) => handleServiceDetailChange('test_reason', e.target.value)} />
                    <small className={styles.helpText}>Helps technician prepare appropriate equipment</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mobility Status</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.mobility_status || ''} 
                      onChange={(e) => handleServiceDetailChange('mobility_status', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="mobile">Fully Mobile</option>
                      <option value="limited">Limited Mobility</option>
                      <option value="bedridden">Bedridden</option>
                      <option value="wheelchair">Wheelchair User</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Medical History & Current Medications</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List relevant medical conditions, current medications, allergies, pacemaker, etc."
                      value={formData.serviceDetails.medical_history || ''} 
                      onChange={(e) => handleServiceDetailChange('medical_history', e.target.value)} />
                    <small className={styles.helpText}>Important for safe diagnostic procedures</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preferred Test Time</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.preferred_time || ''} 
                      onChange={(e) => handleServiceDetailChange('preferred_time', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="morning">Morning (8-12 PM)</option>
                      <option value="afternoon">Afternoon (12-4 PM)</option>
                      <option value="evening">Evening (4-7 PM)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Special Requirements</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Any special needs (oxygen support, privacy, family present, report urgency, etc.)"
                      value={formData.serviceDetails.special_requirements || ''} 
                      onChange={(e) => handleServiceDetailChange('special_requirements', e.target.value)} />
                    <small className={styles.helpText}>Ensures smooth diagnostic procedure</small>
                  </div>
                </>
              )}
              
              {/* REGULAR MONITORING */}
              {serviceName === 'Regular Monitoring' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Condition Being Monitored</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.condition_monitored || ''} 
                      onChange={(e) => handleServiceDetailChange('condition_monitored', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="diabetes">Diabetes</option>
                      <option value="cardiac">Cardiac/Heart Condition</option>
                      <option value="thyroid">Thyroid Disorder</option>
                      <option value="kidney">Kidney Function</option>
                      <option value="liver">Liver Function</option>
                      <option value="vitamin">Vitamin Deficiency</option>
                      <option value="multiple">Multiple Conditions</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Monitoring Frequency Required</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.monitoring_frequency || ''} 
                      onChange={(e) => handleServiceDetailChange('monitoring_frequency', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly (Every 2 weeks)</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly (Every 3 months)</option>
                      <option value="custom">Custom Schedule</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Specific Tests Required</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List tests (HbA1c, Lipid Profile, Thyroid Panel, Kidney Function, etc.)"
                      value={formData.serviceDetails.required_tests || ''} 
                      onChange={(e) => handleServiceDetailChange('required_tests', e.target.value)} />
                    <small className={styles.helpText}>Regular monitoring test panel</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Medications</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List medications being taken for the condition"
                      value={formData.serviceDetails.current_medications || ''} 
                      onChange={(e) => handleServiceDetailChange('current_medications', e.target.value)} />
                    <small className={styles.helpText}>Helps track medication effectiveness</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Last Test Date & Results</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="When was the last test done and key results (if known)"
                      value={formData.serviceDetails.last_test_info || ''} 
                      onChange={(e) => handleServiceDetailChange('last_test_info', e.target.value)} />
                    <small className={styles.helpText}>Helps track health trends</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preferred Collection Day</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.preferred_day || ''} 
                      onChange={(e) => handleServiceDetailChange('preferred_day', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                      <option value="saturday">Saturday</option>
                      <option value="sunday">Sunday</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Doctor's Name & Contact (Optional)</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Doctor's name and contact for report sharing (if needed)"
                      value={formData.serviceDetails.doctor_info || ''} 
                      onChange={(e) => handleServiceDetailChange('doctor_info', e.target.value)} />
                    <small className={styles.helpText}>For coordinated care and report sharing</small>
                  </div>
                </>
              )}
              
              {/* CORPORATE HEALTH CHECKUPS */}
              {serviceName === 'Corporate Health Checkups' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Company/Organization Name</label>
                    <input type="text" className={styles.formInput} placeholder="Enter company name" 
                      value={formData.serviceDetails.company_name || ''} 
                      onChange={(e) => handleServiceDetailChange('company_name', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Number of Employees</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.employee_count || ''} 
                      onChange={(e) => handleServiceDetailChange('employee_count', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="1_10">1-10 Employees</option>
                      <option value="11_25">11-25 Employees</option>
                      <option value="26_50">26-50 Employees</option>
                      <option value="51_100">51-100 Employees</option>
                      <option value="100+">100+ Employees</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Type of Health Checkup</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.checkup_type || ''} 
                      onChange={(e) => handleServiceDetailChange('checkup_type', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="basic">Basic Health Screening</option>
                      <option value="comprehensive">Comprehensive Health Package</option>
                      <option value="executive">Executive Health Checkup</option>
                      <option value="pre_employment">Pre-Employment Screening</option>
                      <option value="annual">Annual Health Checkup</option>
                      <option value="custom">Custom Package</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preferred Location</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.location_preference || ''} 
                      onChange={(e) => handleServiceDetailChange('location_preference', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="office">At Office Premises</option>
                      <option value="lab">At Lab Facility</option>
                      <option value="both">Combination (Office + Lab)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Specific Tests/Packages Required</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List required tests or package details (CBC, Lipid Profile, Diabetes, etc.)"
                      value={formData.serviceDetails.required_packages || ''} 
                      onChange={(e) => handleServiceDetailChange('required_packages', e.target.value)} />
                    <small className={styles.helpText}>Helps customize corporate health package</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preferred Schedule</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Preferred dates, timings, and any scheduling constraints"
                      value={formData.serviceDetails.schedule_preference || ''} 
                      onChange={(e) => handleServiceDetailChange('schedule_preference', e.target.value)} />
                    <small className={styles.helpText}>Helps plan corporate health camp</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Additional Requirements</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Special needs (privacy, facilities, report format, billing, etc.)"
                      value={formData.serviceDetails.additional_requirements || ''} 
                      onChange={(e) => handleServiceDetailChange('additional_requirements', e.target.value)} />
                    <small className={styles.helpText}>Ensures smooth corporate health program</small>
                  </div>
                </>
              )}
              
              {/* TYPE 1 DIABETES CARE */}
              {serviceName === 'Type 1 Diabetes Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Time Since Diagnosis</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.diagnosis_duration || ''} 
                      onChange={(e) => handleServiceDetailChange('diagnosis_duration', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="recent">Recently Diagnosed (Less than 6 months)</option>
                      <option value="6_12_months">6-12 Months</option>
                      <option value="1_5_years">1-5 Years</option>
                      <option value="5_10_years">5-10 Years</option>
                      <option value="10+_years">10+ Years</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Insulin Regimen</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe insulin type, dosage, and timing (e.g., Rapid-acting 10 units before meals, Long-acting 20 units at bedtime)"
                      value={formData.serviceDetails.insulin_regimen || ''} 
                      onChange={(e) => handleServiceDetailChange('insulin_regimen', e.target.value)} />
                    <small className={styles.helpText}>Critical for insulin management support</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Blood Sugar Monitoring Method</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.monitoring_method || ''} 
                      onChange={(e) => handleServiceDetailChange('monitoring_method', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="glucometer">Glucometer (Finger Prick)</option>
                      <option value="cgm">CGM (Continuous Glucose Monitor)</option>
                      <option value="flash">Flash Glucose Monitor</option>
                      <option value="need_help">Need Help Setting Up</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Recent Blood Sugar Levels & HbA1c</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Recent fasting/post-meal levels and last HbA1c value (if known)"
                      value={formData.serviceDetails.recent_levels || ''} 
                      onChange={(e) => handleServiceDetailChange('recent_levels', e.target.value)} />
                    <small className={styles.helpText}>Helps assess current control</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Hypoglycemia Episodes & Management</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Frequency of low blood sugar episodes and how managed"
                      value={formData.serviceDetails.hypoglycemia_info || ''} 
                      onChange={(e) => handleServiceDetailChange('hypoglycemia_info', e.target.value)} />
                    <small className={styles.helpText}>Important for safety planning</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Care Needs & Support Required</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List needs (insulin administration, carb counting, monitoring support, lifestyle guidance, etc.)"
                      value={formData.serviceDetails.care_needs || ''} 
                      onChange={(e) => handleServiceDetailChange('care_needs', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive Type 1 diabetes care planning</small>
                  </div>
                </>
              )}
              
              {/* TYPE 2 DIABETES CARE */}
              {serviceName === 'Type 2 Diabetes Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Time Since Diagnosis</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.diagnosis_duration || ''} 
                      onChange={(e) => handleServiceDetailChange('diagnosis_duration', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="recent">Recently Diagnosed (Less than 6 months)</option>
                      <option value="6_12_months">6-12 Months</option>
                      <option value="1_5_years">1-5 Years</option>
                      <option value="5_10_years">5-10 Years</option>
                      <option value="10+_years">10+ Years</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Medications</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List all diabetes medications (Metformin, Glimepiride, etc.) with dosages"
                      value={formData.serviceDetails.current_medications || ''} 
                      onChange={(e) => handleServiceDetailChange('current_medications', e.target.value)} />
                    <small className={styles.helpText}>Important for medication management</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Recent Blood Sugar & HbA1c Levels</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Recent fasting/post-meal levels and last HbA1c value"
                      value={formData.serviceDetails.recent_levels || ''} 
                      onChange={(e) => handleServiceDetailChange('recent_levels', e.target.value)} />
                    <small className={styles.helpText}>Helps assess diabetes control</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Diet & Lifestyle Challenges</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe diet habits, exercise routine, weight management challenges, etc."
                      value={formData.serviceDetails.lifestyle_challenges || ''} 
                      onChange={(e) => handleServiceDetailChange('lifestyle_challenges', e.target.value)} />
                    <small className={styles.helpText}>Key for lifestyle modification planning</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Other Health Conditions</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List other conditions (hypertension, cholesterol, kidney issues, etc.)"
                      value={formData.serviceDetails.other_conditions || ''} 
                      onChange={(e) => handleServiceDetailChange('other_conditions', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive health management</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Care Goals & Support Needed</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List goals (weight loss, better control, diet planning, exercise guidance, etc.)"
                      value={formData.serviceDetails.care_goals || ''} 
                      onChange={(e) => handleServiceDetailChange('care_goals', e.target.value)} />
                    <small className={styles.helpText}>Personalized Type 2 diabetes management</small>
                  </div>
                </>
              )}
              
              {/* GESTATIONAL DIABETES CARE */}
              {serviceName === 'Gestational Diabetes Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mother's Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.mother_age || ''} 
                      onChange={(e) => handleServiceDetailChange('mother_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Pregnancy Week</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.pregnancy_week || ''} 
                      onChange={(e) => handleServiceDetailChange('pregnancy_week', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="first_trimester">First Trimester (1-12 weeks)</option>
                      <option value="second_trimester">Second Trimester (13-27 weeks)</option>
                      <option value="third_trimester">Third Trimester (28-40 weeks)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>When Was Gestational Diabetes Diagnosed?</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.diagnosis_timing || ''} 
                      onChange={(e) => handleServiceDetailChange('diagnosis_timing', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="recent">Recently (This Week)</option>
                      <option value="1_2_weeks">1-2 Weeks Ago</option>
                      <option value="3_4_weeks">3-4 Weeks Ago</option>
                      <option value="longer">More than a Month Ago</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Blood Sugar Levels & Management</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Recent glucose levels, if on insulin/medication, monitoring frequency"
                      value={formData.serviceDetails.sugar_management || ''} 
                      onChange={(e) => handleServiceDetailChange('sugar_management', e.target.value)} />
                    <small className={styles.helpText}>Critical for pregnancy diabetes control</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Pregnancy Complications or Concerns</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Any pregnancy complications, high-risk factors, or concerns"
                      value={formData.serviceDetails.pregnancy_concerns || ''} 
                      onChange={(e) => handleServiceDetailChange('pregnancy_concerns', e.target.value)} />
                    <small className={styles.helpText}>Ensures safe pregnancy management</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Diet & Lifestyle Current Status</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Current diet, exercise, weight gain, challenges in following diabetic diet"
                      value={formData.serviceDetails.lifestyle_status || ''} 
                      onChange={(e) => handleServiceDetailChange('lifestyle_status', e.target.value)} />
                    <small className={styles.helpText}>Pregnancy-safe lifestyle modifications</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Support Needs & Care Goals</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List needs (diet planning, monitoring support, insulin help, fetal monitoring, etc.)"
                      value={formData.serviceDetails.support_needs || ''} 
                      onChange={(e) => handleServiceDetailChange('support_needs', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive gestational diabetes care</small>
                  </div>
                </>
              )}
              
              {/* DIABETIC COMPLICATION CARE */}
              {serviceName === 'Diabetic Complication Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Type of Diabetes</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.diabetes_type || ''} 
                      onChange={(e) => handleServiceDetailChange('diabetes_type', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="type1">Type 1 Diabetes</option>
                      <option value="type2">Type 2 Diabetes</option>
                      <option value="not_sure">Not Sure</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Diabetic Complications Present</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List complications (diabetic foot, neuropathy, retinopathy, kidney disease, etc.)"
                      value={formData.serviceDetails.complications || ''} 
                      onChange={(e) => handleServiceDetailChange('complications', e.target.value)} />
                    <small className={styles.helpText}>Critical for complication management</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Foot Care Status & Issues</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe foot condition (ulcers, numbness, wounds, infections, etc.)"
                      value={formData.serviceDetails.foot_status || ''} 
                      onChange={(e) => handleServiceDetailChange('foot_status', e.target.value)} />
                    <small className={styles.helpText}>Diabetic foot care is critical</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Eye & Vision Problems</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Vision issues, retinopathy diagnosis, last eye exam, etc."
                      value={formData.serviceDetails.eye_status || ''} 
                      onChange={(e) => handleServiceDetailChange('eye_status', e.target.value)} />
                    <small className={styles.helpText}>Diabetic retinopathy monitoring</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Kidney Function & Other Complications</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Kidney function status, neuropathy, cardiovascular issues, etc."
                      value={formData.serviceDetails.other_complications || ''} 
                      onChange={(e) => handleServiceDetailChange('other_complications', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive complication assessment</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Care Needs & Prevention Goals</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List needs (wound care, foot care, monitoring, prevention strategies, etc.)"
                      value={formData.serviceDetails.care_needs || ''} 
                      onChange={(e) => handleServiceDetailChange('care_needs', e.target.value)} />
                    <small className={styles.helpText}>Preventing further diabetic complications</small>
                  </div>
                </>
              )}
              
              {/* BASIC HEALTH CHECKUP */}
              {serviceName === 'Basic Health Checkup' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Reason for Checkup</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.checkup_reason || ''} 
                      onChange={(e) => handleServiceDetailChange('checkup_reason', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="routine">Routine Health Screening</option>
                      <option value="symptoms">Experiencing Symptoms</option>
                      <option value="pre_employment">Pre-Employment</option>
                      <option value="annual">Annual Checkup</option>
                      <option value="follow_up">Follow-up Checkup</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Health Concerns</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe any symptoms or health concerns (fatigue, pain, weight changes, etc.)"
                      value={formData.serviceDetails.health_concerns || ''} 
                      onChange={(e) => handleServiceDetailChange('health_concerns', e.target.value)} />
                    <small className={styles.helpText}>Helps doctor focus examination</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Medical History</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List existing conditions, past surgeries, family history, etc."
                      value={formData.serviceDetails.medical_history || ''} 
                      onChange={(e) => handleServiceDetailChange('medical_history', e.target.value)} />
                    <small className={styles.helpText}>Important for comprehensive assessment</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Medications</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List all medications currently taking"
                      value={formData.serviceDetails.current_medications || ''} 
                      onChange={(e) => handleServiceDetailChange('current_medications', e.target.value)} />
                    <small className={styles.helpText}>Medication review during checkup</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Lifestyle & Habits</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe diet, exercise, smoking, alcohol, sleep patterns, etc."
                      value={formData.serviceDetails.lifestyle_habits || ''} 
                      onChange={(e) => handleServiceDetailChange('lifestyle_habits', e.target.value)} />
                    <small className={styles.helpText}>Lifestyle counseling and health planning</small>
                  </div>
                </>
              )}
              
              {/* COMPREHENSIVE HEALTH CHECKUP */}
              {serviceName === 'Comprehensive Health Checkup' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Specific Health Concerns or Risk Factors</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List concerns (family history of disease, lifestyle risks, symptoms, etc.)"
                      value={formData.serviceDetails.health_concerns || ''} 
                      onChange={(e) => handleServiceDetailChange('health_concerns', e.target.value)} />
                    <small className={styles.helpText}>Helps customize comprehensive screening</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Complete Medical History</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List all medical conditions, surgeries, hospitalizations, family medical history"
                      value={formData.serviceDetails.medical_history || ''} 
                      onChange={(e) => handleServiceDetailChange('medical_history', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive health evaluation</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Medications & Supplements</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List all medications, vitamins, and supplements"
                      value={formData.serviceDetails.medications || ''} 
                      onChange={(e) => handleServiceDetailChange('medications', e.target.value)} />
                    <small className={styles.helpText}>Complete medication review</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Lifestyle Assessment</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Diet, exercise, stress levels, sleep, smoking, alcohol consumption"
                      value={formData.serviceDetails.lifestyle || ''} 
                      onChange={(e) => handleServiceDetailChange('lifestyle', e.target.value)} />
                    <small className={styles.helpText}>Holistic health assessment</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Specific Tests or Screenings Requested</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Any specific tests you want included (cancer screening, cardiac tests, etc.)"
                      value={formData.serviceDetails.requested_tests || ''} 
                      onChange={(e) => handleServiceDetailChange('requested_tests', e.target.value)} />
                    <small className={styles.helpText}>Customized comprehensive package</small>
                  </div>
                </>
              )}
              
              {/* SENIOR CITIZEN CHECKUP */}
              {serviceName === 'Senior Citizen Checkup' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Senior Citizen Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Gender</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.patient_gender || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_gender', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mobility & Independence Level</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.mobility_level || ''} 
                      onChange={(e) => handleServiceDetailChange('mobility_level', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="independent">Fully Independent</option>
                      <option value="walker">Uses Walker/Cane</option>
                      <option value="assisted">Needs Assistance</option>
                      <option value="wheelchair">Wheelchair User</option>
                      <option value="bedridden">Bedridden</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Chronic Conditions & Medical History</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List conditions (diabetes, hypertension, arthritis, heart disease, etc.)"
                      value={formData.serviceDetails.chronic_conditions || ''} 
                      onChange={(e) => handleServiceDetailChange('chronic_conditions', e.target.value)} />
                    <small className={styles.helpText}>Important for geriatric assessment</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Medications</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List all medications with dosages"
                      value={formData.serviceDetails.current_medications || ''} 
                      onChange={(e) => handleServiceDetailChange('current_medications', e.target.value)} />
                    <small className={styles.helpText}>Medication review for elderly</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Cognitive & Memory Status</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Any memory issues, confusion, dementia, or cognitive concerns"
                      value={formData.serviceDetails.cognitive_status || ''} 
                      onChange={(e) => handleServiceDetailChange('cognitive_status', e.target.value)} />
                    <small className={styles.helpText}>Cognitive assessment planning</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Specific Geriatric Concerns</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Falls, vision/hearing issues, nutrition, bone health, balance problems, etc."
                      value={formData.serviceDetails.geriatric_concerns || ''} 
                      onChange={(e) => handleServiceDetailChange('geriatric_concerns', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive senior health evaluation</small>
                  </div>
                </>
              )}
              
              {/* WOMEN'S HEALTH CHECKUP */}
              {serviceName === "Women's Health Checkup" && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Marital Status</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.marital_status || ''} 
                      onChange={(e) => handleServiceDetailChange('marital_status', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Menstrual & Reproductive Status</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.reproductive_status || ''} 
                      onChange={(e) => handleServiceDetailChange('reproductive_status', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="regular_periods">Regular Menstrual Periods</option>
                      <option value="irregular_periods">Irregular Periods</option>
                      <option value="pregnant">Currently Pregnant</option>
                      <option value="postpartum">Postpartum</option>
                      <option value="menopause">Menopause</option>
                      <option value="post_menopause">Post-Menopause</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Gynecological Concerns</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Any concerns (irregular periods, pain, discharge, PCOS, fibroids, etc.)"
                      value={formData.serviceDetails.gynecological_concerns || ''} 
                      onChange={(e) => handleServiceDetailChange('gynecological_concerns', e.target.value)} />
                    <small className={styles.helpText}>Women's health specific assessment</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Pregnancy & Childbirth History</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Number of pregnancies, children, miscarriages, complications, etc."
                      value={formData.serviceDetails.pregnancy_history || ''} 
                      onChange={(e) => handleServiceDetailChange('pregnancy_history', e.target.value)} />
                    <small className={styles.helpText}>Reproductive health history</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Family History of Women's Health Issues</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Family history (breast cancer, ovarian cancer, PCOS, etc.)"
                      value={formData.serviceDetails.family_history || ''} 
                      onChange={(e) => handleServiceDetailChange('family_history', e.target.value)} />
                    <small className={styles.helpText}>Risk assessment for screening</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Specific Tests or Concerns</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Any specific tests needed (Pap smear, mammogram, hormonal tests, etc.)"
                      value={formData.serviceDetails.specific_tests || ''} 
                      onChange={(e) => handleServiceDetailChange('specific_tests', e.target.value)} />
                    <small className={styles.helpText}>Customized women's health package</small>
                  </div>
                </>
              )}
              
              {/* CARDIAC SURGERY CARE */}
              {serviceName === 'Cardiac Surgery Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Type of Cardiac Surgery</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.surgery_type || ''} 
                      onChange={(e) => handleServiceDetailChange('surgery_type', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="cabg">CABG (Bypass Surgery)</option>
                      <option value="valve_replacement">Valve Replacement</option>
                      <option value="angioplasty">Angioplasty/Stent</option>
                      <option value="pacemaker">Pacemaker Implantation</option>
                      <option value="other_cardiac">Other Cardiac Surgery</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Surgery Date</label>
                    <input type="text" className={styles.formInput} 
                      placeholder="e.g., 1 week ago, 2 weeks ago"
                      value={formData.serviceDetails.surgery_date || ''} 
                      onChange={(e) => handleServiceDetailChange('surgery_date', e.target.value)} />
                    <small className={styles.helpText}>Helps plan recovery stage care</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Recovery Status</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe recovery (wound healing, pain level, mobility, breathing, etc.)"
                      value={formData.serviceDetails.recovery_status || ''} 
                      onChange={(e) => handleServiceDetailChange('recovery_status', e.target.value)} />
                    <small className={styles.helpText}>Assesses current recovery progress</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Medications & Medical Equipment</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List medications, oxygen, monitors, or other equipment needed"
                      value={formData.serviceDetails.medications_equipment || ''} 
                      onChange={(e) => handleServiceDetailChange('medications_equipment', e.target.value)} />
                    <small className={styles.helpText}>Important for cardiac recovery care</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mobility & Activity Restrictions</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Doctor's restrictions on activity, lifting, stairs, etc."
                      value={formData.serviceDetails.activity_restrictions || ''} 
                      onChange={(e) => handleServiceDetailChange('activity_restrictions', e.target.value)} />
                    <small className={styles.helpText}>Ensures safe recovery activities</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Care Needs & Support Required</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List needs (wound care, medication help, mobility assistance, cardiac rehab, etc.)"
                      value={formData.serviceDetails.care_needs || ''} 
                      onChange={(e) => handleServiceDetailChange('care_needs', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive cardiac surgery recovery care</small>
                  </div>
                </>
              )}
              
              {/* ORTHOPEDIC SURGERY CARE */}
              {serviceName === 'Orthopedic Surgery Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Type of Orthopedic Surgery</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.surgery_type || ''} 
                      onChange={(e) => handleServiceDetailChange('surgery_type', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="knee_replacement">Knee Replacement</option>
                      <option value="hip_replacement">Hip Replacement</option>
                      <option value="spine_surgery">Spine Surgery</option>
                      <option value="fracture_surgery">Fracture Surgery</option>
                      <option value="arthroscopy">Arthroscopy</option>
                      <option value="other_orthopedic">Other Orthopedic Surgery</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Surgery Date & Affected Area</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="When was surgery and which body part (e.g., 2 weeks ago, right knee)"
                      value={formData.serviceDetails.surgery_details || ''} 
                      onChange={(e) => handleServiceDetailChange('surgery_details', e.target.value)} />
                    <small className={styles.helpText}>Recovery timeline and care planning</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Mobility Status</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.mobility_status || ''} 
                      onChange={(e) => handleServiceDetailChange('mobility_status', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="bedridden">Bedridden</option>
                      <option value="wheelchair">Wheelchair</option>
                      <option value="walker">Walker/Crutches</option>
                      <option value="limited_walking">Limited Walking</option>
                      <option value="improving">Improving Mobility</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Pain Management & Medications</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Current pain level, pain medications, and other prescriptions"
                      value={formData.serviceDetails.pain_medications || ''} 
                      onChange={(e) => handleServiceDetailChange('pain_medications', e.target.value)} />
                    <small className={styles.helpText}>Pain management support</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Physiotherapy & Rehabilitation Status</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Physiotherapy schedule, exercises prescribed, progress made"
                      value={formData.serviceDetails.physiotherapy_status || ''} 
                      onChange={(e) => handleServiceDetailChange('physiotherapy_status', e.target.value)} />
                    <small className={styles.helpText}>Coordinates with rehabilitation program</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Care Needs & Support Required</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List needs (wound care, mobility help, exercises, bathing, transfers, etc.)"
                      value={formData.serviceDetails.care_needs || ''} 
                      onChange={(e) => handleServiceDetailChange('care_needs', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive orthopedic recovery care</small>
                  </div>
                </>
              )}
              
              {/* ABDOMINAL SURGERY CARE */}
              {serviceName === 'Abdominal Surgery Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Type of Abdominal Surgery</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.surgery_type || ''} 
                      onChange={(e) => handleServiceDetailChange('surgery_type', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="laparoscopy">Laparoscopic Surgery</option>
                      <option value="appendectomy">Appendectomy</option>
                      <option value="hernia">Hernia Repair</option>
                      <option value="gallbladder">Gallbladder Surgery</option>
                      <option value="gastric">Gastric/Bariatric Surgery</option>
                      <option value="other_abdominal">Other Abdominal Surgery</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Surgery Date</label>
                    <input type="text" className={styles.formInput} 
                      placeholder="e.g., 3 days ago, 1 week ago"
                      value={formData.serviceDetails.surgery_date || ''} 
                      onChange={(e) => handleServiceDetailChange('surgery_date', e.target.value)} />
                    <small className={styles.helpText}>Recovery stage assessment</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Wound & Incision Status</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Describe incision healing, drainage, pain, any complications"
                      value={formData.serviceDetails.wound_status || ''} 
                      onChange={(e) => handleServiceDetailChange('wound_status', e.target.value)} />
                    <small className={styles.helpText}>Wound care planning</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Diet & Bowel Function</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Current diet restrictions, bowel movements, nausea, appetite"
                      value={formData.serviceDetails.diet_bowel || ''} 
                      onChange={(e) => handleServiceDetailChange('diet_bowel', e.target.value)} />
                    <small className={styles.helpText}>Important for abdominal surgery recovery</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Pain & Medications</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Pain level, pain medications, antibiotics, other prescriptions"
                      value={formData.serviceDetails.pain_medications || ''} 
                      onChange={(e) => handleServiceDetailChange('pain_medications', e.target.value)} />
                    <small className={styles.helpText}>Pain and medication management</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Care Needs & Support Required</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List needs (wound care, mobility help, diet support, medication assistance, etc.)"
                      value={formData.serviceDetails.care_needs || ''} 
                      onChange={(e) => handleServiceDetailChange('care_needs', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive abdominal surgery recovery care</small>
                  </div>
                </>
              )}
              
              {/* CANCER SURGERY CARE */}
              {serviceName === 'Cancer Surgery Care' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Patient Age (Years)</label>
                    <input type="number" className={styles.formInput} placeholder="Enter age" 
                      value={formData.serviceDetails.patient_age || ''} 
                      onChange={(e) => handleServiceDetailChange('patient_age', e.target.value)} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Type of Cancer Surgery</label>
                    <select className={styles.formSelect}
                      value={formData.serviceDetails.surgery_type || ''} 
                      onChange={(e) => handleServiceDetailChange('surgery_type', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="mastectomy">Mastectomy (Breast Cancer)</option>
                      <option value="lumpectomy">Lumpectomy</option>
                      <option value="prostate">Prostate Cancer Surgery</option>
                      <option value="colon">Colon Cancer Surgery</option>
                      <option value="lung">Lung Cancer Surgery</option>
                      <option value="other_cancer">Other Cancer Surgery</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Surgery Date & Treatment Plan</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="When was surgery, and any planned chemotherapy/radiation"
                      value={formData.serviceDetails.surgery_treatment || ''} 
                      onChange={(e) => handleServiceDetailChange('surgery_treatment', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive cancer care planning</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Recovery & Side Effects</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="Describe recovery status, side effects, pain, fatigue, nausea, etc."
                      value={formData.serviceDetails.recovery_sideeffects || ''} 
                      onChange={(e) => handleServiceDetailChange('recovery_sideeffects', e.target.value)} />
                    <small className={styles.helpText}>Manages post-operative symptoms</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Medications & Pain Management</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="List all medications, pain management, anti-nausea drugs, etc."
                      value={formData.serviceDetails.medications || ''} 
                      onChange={(e) => handleServiceDetailChange('medications', e.target.value)} />
                    <small className={styles.helpText}>Medication support and management</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Emotional & Psychological Support Needs</label>
                    <textarea className={styles.formTextarea} rows={2}
                      placeholder="Emotional state, anxiety, depression, support system, counseling needs"
                      value={formData.serviceDetails.emotional_support || ''} 
                      onChange={(e) => handleServiceDetailChange('emotional_support', e.target.value)} />
                    <small className={styles.helpText}>Holistic cancer recovery care</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Care Needs & Support Required</label>
                    <textarea className={styles.formTextarea} rows={3}
                      placeholder="List needs (wound care, mobility help, nutrition, emotional support, etc.)"
                      value={formData.serviceDetails.care_needs || ''} 
                      onChange={(e) => handleServiceDetailChange('care_needs', e.target.value)} />
                    <small className={styles.helpText}>Comprehensive cancer surgery recovery care</small>
                  </div>
                </>
              )}
              
              {/* Fallback for other services */}
              {!['Companion Care', 'Personal Care', 'Dementia Care', 'Respite Care', 'General Nursing', 'ICU Trained Nursing', 'Wound Care Nursing', 'Pediatric Nursing', 'Live-in Caretaker', 'Part-time Caretaker', 'Cook-cum-Caretaker', 'Baby Caretaker/Nanny', 'Complete Bedridden Care', 'Stroke Patient Care', 'Coma Patient Care', 'Palliative Care', 'Early Stage Care', 'Advanced Stage Care', 'Therapy Support', 'Family Support Care', 'Orthopedic Physiotherapy', 'Neurological Physiotherapy', 'Pediatric Physiotherapy', 'Chest Physiotherapy', 'Residential Security', 'Corporate Security', 'Personal Security/Bodyguard', 'Night Watchman', 'Newborn Care (0-3 months)', 'Postnatal Mother Care', 'Baby Massage & Care', 'Twins/Multiple Babies Care', 'Hemiplegia Care', 'Paraplegia Care', 'Quadriplegia Care', 'Facial Paralysis Care', 'Home Sample Collection', 'Diagnostic Services', 'Regular Monitoring', 'Corporate Health Checkups', 'Type 1 Diabetes Care', 'Type 2 Diabetes Care', 'Gestational Diabetes Care', 'Diabetic Complication Care', 'Basic Health Checkup', 'Comprehensive Health Checkup', 'Senior Citizen Checkup', "Women's Health Checkup", 'Cardiac Surgery Care', 'Orthopedic Surgery Care', 'Abdominal Surgery Care', 'Cancer Surgery Care'].includes(serviceName) && (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
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
