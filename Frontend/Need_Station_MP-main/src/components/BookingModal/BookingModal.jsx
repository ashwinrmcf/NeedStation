import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, MapPin, Clock, User, Phone, Calendar, Shield } from 'lucide-react';
import { getServiceConfiguration } from '../../data/ServiceConfigurations';
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

  // Get service configuration for dynamic fields
  const serviceConfig = getServiceConfiguration(serviceName?.toUpperCase().replace(/\s+/g, '_') || '');

  // Auto-fill phone number and location data from database first, then fall back to profile
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      
      // Reset form first
      setErrors({});
      setOtpSent(false);
      setOtp('');
      
      // Load user data from database (priority: DB -> Profile)
      const loadUserData = async () => {
        console.log('🔍 userProfile object:', userProfile);
        console.log('🔍 userProfile.id:', userProfile?.id);
        console.log('🔍 userProfile.userId:', userProfile?.userId);
        console.log('🔍 localStorage userId:', localStorage.getItem('userId'));
        
        const userId = userProfile?.id || userProfile?.userId || localStorage.getItem('userId');
        console.log('🔍 Final userId to use:', userId);
        
        if (!userId) {
          console.warn('⚠️ No userId found - skipping data load');
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
        
        if (userId) {
          try {
            // Fetch from database (single source of truth)
            const response = await fetch(`http://localhost:8080/api/user/profile/${userId}`);
            if (response.ok) {
              const dbData = await response.json();
              console.log('📦 Database data received:', JSON.stringify(dbData, null, 2));
              
              // Get all data from database only
              const phone = dbData.contactNumber || '';
              const isPhoneVerified = phone && dbData.phoneVerified;
              
              console.log('📞 Phone from DB:', phone);
              console.log('✅ Phone verified:', isPhoneVerified);
              
              setPhoneVerified(isPhoneVerified);
              
              // Check if we have saved location data in DB
              const hasLocationData = dbData.locationLat && dbData.locationLng;
              
              if (hasLocationData) {
                const savedLocation = {
                  lat: dbData.locationLat,
                  lng: dbData.locationLng
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
              // If DB fetch fails, show empty form
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
            }
          } catch (error) {
            console.error('❌ Error loading user data:', error);
            // Set default form on error with profile fallback
            const phoneFromProfile = userProfile?.phone || userProfile?.mobile || '';
            const isPhoneVerified = phoneFromProfile && userProfile?.phoneVerified;
            setPhoneVerified(isPhoneVerified);
            
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
        } else {
          console.log('⚠️ No userId found, using profile data only');
          // No userId, use profile data
          const phoneFromProfile = userProfile?.phone || userProfile?.mobile || '';
          const isPhoneVerified = phoneFromProfile && userProfile?.phoneVerified;
          setPhoneVerified(isPhoneVerified);
          
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
    }
  };
  
  // Save contact and location information to user profile and database
  const saveContactAndLocationToProfile = async () => {
    const userId = userProfile?.id || userProfile?.userId || localStorage.getItem('userId');
    if (!userId) {
      console.log('⚠️ No userId found, skipping save to database');
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
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call parent callback with booking data
      onBookingComplete({
        ...formData,
        serviceName,
        bookingId: `BK${Date.now()}`,
        status: 'confirmed'
      });
      
      onClose();
    } catch (error) {
      console.error('Booking failed:', error);
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
                {phoneVerified && formData.phone && (
                  <p className={styles.successMessage}>
                    ✓ Phone number auto-filled from database and verified
                  </p>
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
                  <LeafletMapPicker onLocationSelect={handleLocationSelect} />
                </div>
                
                {/* Save Location Button */}
                {selectedLocation && (
                  <div className={styles.locationActions}>
                    <div className={styles.locationPreview}>
                      <p className={styles.locationInfo}>
                        📍 Selected: {selectedLocation?.address || ''}
                      </p>
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
                  Full Address * (Saved to your profile)
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
                {formData.address && (
                  <p className={styles.successMessage}>
                    ✓ This address will be saved to your profile for future bookings
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label className={styles.formLabel}>
                    Pincode * (Saved to your profile)
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
                    Landmark (Optional, saved to your profile)
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
              
              {/* Dynamic service fields based on service configuration */}
              {Object.entries(serviceConfig).map(([sectionKey, sectionConfig]) => (
                <div key={sectionKey} className={styles.formGroup}>
                  <h4 className={styles.formLabel} style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>
                    {sectionKey.replace(/_/g, ' ')}
                  </h4>
                  
                  {Object.entries(sectionConfig).slice(0, 3).map(([fieldKey, fieldConfig]) => {
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
                  max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
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
                    { value: 'normal', label: 'Normal', desc: 'Within 24-48 hours' },
                    { value: 'urgent', label: 'Urgent', desc: 'Within 2-4 hours' }
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
