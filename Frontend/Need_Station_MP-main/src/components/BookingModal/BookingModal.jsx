import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, MapPin, Clock, User, Phone, Calendar } from 'lucide-react';
import { getServiceConfiguration } from '../../data/ServiceConfigurations';
import styles from './BookingModal.module.css';

const BookingModal = ({ isOpen, onClose, serviceName, onBookingComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    fullName: '',
    phone: '',
    location: '',
    
    // Step 2: Service Details (dynamic based on service)
    serviceDetails: {},
    
    // Step 3: Scheduling
    preferredDate: '',
    preferredTime: '',
    urgency: 'normal'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get service configuration for dynamic fields
  const serviceConfig = getServiceConfiguration(serviceName?.toUpperCase().replace(/\s+/g, '_') || '');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setFormData({
        fullName: '',
        phone: '',
        location: '',
        serviceDetails: {},
        preferredDate: '',
        preferredTime: '',
        urgency: 'normal'
      });
      setErrors({});
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
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

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
        newErrors.phone = 'Enter valid 10-digit mobile number';
      }
      if (!formData.location.trim()) newErrors.location = 'Location is required';
    }

    if (step === 3) {
      if (!formData.preferredDate) newErrors.preferredDate = 'Please select a date';
      if (!formData.preferredTime) newErrors.preferredTime = 'Please select a time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
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
              <h3 className={styles.stepTitle}>Basic Information</h3>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className={`${styles.formInput} ${errors.fullName ? styles.error : ''}`}
                />
                {errors.fullName && (
                  <p className={styles.errorMessage}>{errors.fullName}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className={`${styles.formInput} ${errors.phone ? styles.error : ''}`}
                />
                {errors.phone && (
                  <p className={styles.errorMessage}>{errors.phone}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter your address"
                  className={`${styles.formInput} ${errors.location ? styles.error : ''}`}
                />
                {errors.location && (
                  <p className={styles.errorMessage}>{errors.location}</p>
                )}
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
                                {option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
