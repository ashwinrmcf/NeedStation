import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Calendar, Camera, Loader2, User, CheckCircle, RefreshCw
} from 'lucide-react';
import Translator from '../../components/Translator';

export default function Step1BasicInfo({ data, updateForm, next, workerId, updateWorkerId, onNavigationAttempt, clearRegistrationData }) {
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureURL, setProfilePictureURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [verifiedWorkerId, setVerifiedWorkerId] = useState(null);

  // Restore form state when component mounts or data changes
  useEffect(() => {
    // Restore saved state from session
    const savedOtpVerified = sessionStorage.getItem('otpVerified');
    const savedWorkerId = sessionStorage.getItem('sessionWorkerId');
    
    if (savedOtpVerified === 'true') {
      setOtpVerified(true);
      setOtpSent(true);
    }
    
    if (savedWorkerId) {
      setVerifiedWorkerId(Number(savedWorkerId));
    }
  }, [data]);

  useEffect(() => {
    // Clean up any existing blob URLs first
    if (profilePictureURL && profilePictureURL.startsWith('blob:')) {
      URL.revokeObjectURL(profilePictureURL);
    }
    
    // If we have a profilePicture file in form data, create new blob URL
    if (data.profilePicture && data.profilePicture instanceof File) {
      const localUrl = URL.createObjectURL(data.profilePicture);
      setProfilePictureURL(localUrl);
      // Store in localStorage for Step 6 preview
      localStorage.setItem('tempProfileImageUrl', localUrl);
      console.log('Profile image restored and stored in localStorage:', localUrl);
    } else if (typeof data.profilePicture === 'string') {
      // If it's already a URL string, use it directly
      setProfilePictureURL(data.profilePicture);
      // Store in localStorage for Step 6 preview
      localStorage.setItem('tempProfileImageUrl', data.profilePicture);
      console.log('Profile image URL stored in localStorage:', data.profilePicture);
    } else {
      // No profile picture, clear the preview and localStorage
      setProfilePictureURL(null);
      localStorage.removeItem('tempProfileImageUrl');
    }
  }, [data.profilePicture]);

  // Cleanup blob URLs on component unmount
  useEffect(() => {
    return () => {
      if (profilePictureURL && profilePictureURL.startsWith('blob:')) {
        URL.revokeObjectURL(profilePictureURL);
      }
    };
  }, [profilePictureURL]);

  // Backend API URL - update this to your actual backend URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Updating field:", name, "to value:", value); // Debug log
    updateForm({
      [name]: value,
    });
    
    // Reset OTP verification if phone number changes
    if (name === 'phone' && (otpSent || otpVerified)) {
      setOtpSent(false);
      setOtpVerified(false);
      setOtpCode('');
      setOtpError('');
    }
  };
  
  // Function to generate OTP using the Free OTP API
  const generateOtp = async () => {
    const { phone } = data;
    
    if (!phone || phone.length !== 10) {
      setOtpError('Please enter a valid 10-digit phone number');
      return;
    }
    
    setOtpLoading(true);
    setOtpError('');
    
    try {
      // First register the worker to get a worker ID
      if (!workerId && !verifiedWorkerId) {
        // Create worker data for registration
        const workerData = {
          fullName: data.fullName || "Temporary Name",  // Can be updated later
          gender: data.gender || "Other",
          dob: data.dob || "2000-01-01",
          phone: phone,
          email: data.email || "",
          whatsappNumber: data.whatsappNumber || ""
        };

        try {
          // Register the worker first using the JSON endpoint
          const registerResponse = await axios.post(`${API_URL}/workers/register/step1-json`, workerData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (registerResponse.data && registerResponse.data.workerId) {
            // Save the worker ID for OTP verification
            const newWorkerId = registerResponse.data.workerId;
            setVerifiedWorkerId(newWorkerId);
            sessionStorage.setItem('sessionWorkerId', newWorkerId);
            if (updateWorkerId) {
              updateWorkerId(newWorkerId);
            }
            
            setOtpSent(true);
            console.log('OTP sent successfully during registration');
            alert('OTP sent! Please check your phone for the verification code.');
          } else {
            setOtpError('Failed to register. Please check your information.');
          }
        } catch (registerError) {
          // Handle 409 Conflict error - Worker already exists with this phone number
          if (registerError.response && registerError.response.status === 409 && 
              registerError.response.data && registerError.response.data.workerId) {
            
            // Worker already exists, capture the existing workerId
            const existingWorkerId = registerError.response.data.workerId;
            setVerifiedWorkerId(existingWorkerId);
            sessionStorage.setItem('sessionWorkerId', existingWorkerId);
            if (updateWorkerId) {
              updateWorkerId(existingWorkerId);
            }
            
            // Now send OTP to the existing worker using resend endpoint
            const resendResponse = await axios.post(
              `${API_URL}/workers/resend-otp`,
              { workerId: existingWorkerId },
              { headers: { 'Content-Type': 'application/json' } }
            );
            
            if (resendResponse.data && resendResponse.data.sent) {
              setOtpSent(true);
              console.log('OTP sent to existing worker');
              alert('This phone number is already registered. OTP sent for verification!');
            } else {
              setOtpError('Failed to send OTP to existing account. Please try again.');
            }
          } else {
            // For other registration errors
            console.error('Registration error:', registerError);
            if (registerError.response && registerError.response.data && registerError.response.data.error) {
              setOtpError(registerError.response.data.error);
            } else {
              setOtpError('Failed to register. Please check your information and try again.');
            }
          }
        }
      } else {
        // If we already have a worker ID, resend the OTP
        const existingId = verifiedWorkerId || workerId;
        const resendResponse = await axios.post(`${API_URL}/workers/resend-otp`, {
          workerId: existingId
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (resendResponse.data && resendResponse.data.sent) {
          setOtpSent(true);
          console.log('OTP resent successfully');
          alert('OTP sent! Please check your phone for the verification code.');
        } else {
          setOtpError('Failed to send OTP. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error generating OTP:', error);
      // Only get here for errors not caught in the inner try/catch
      if (error.response && error.response.data && error.response.data.error) {
        setOtpError(error.response.data.error);
      } else {
        setOtpError('Failed to send OTP. Please try again.');
      }
    } finally {
      setOtpLoading(false);
    }
  };
  
  // Function to verify OTP using the Free OTP API
  const verifyOtp = async () => {
    if (!otpCode || otpCode.length < 6) {
      setOtpError('Please enter a valid OTP code');
      return;
    }
    
    setOtpLoading(true);
    setOtpError('');
    
    try {
      const verifyResponse = await axios.post(
        `${API_URL}/workers/verify-otp`,
        { 
          workerId: verifiedWorkerId || workerId,
          otp: otpCode 
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (verifyResponse.data && verifyResponse.data.verified) {
        setOtpVerified(true);
        setOtpError('');
        // Save verification status to session storage
        sessionStorage.setItem('otpVerified', 'true');
        // Update form data with verification status
        updateForm({ otpVerified: true });
        console.log('OTP verified successfully');
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setOtpError(error.response.data.error);
      } else {
        setOtpError('Failed to verify OTP. Please try again.');
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const compressImage = (file, maxSizeKB = 500) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 400px width/height for smaller file)
        let { width, height } = img;
        const maxDimension = 400;
        
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        // Try different quality levels until under size limit
        let quality = 0.8;
        const tryCompress = () => {
          canvas.toBlob((blob) => {
            if (blob.size <= maxSizeKB * 1024 || quality <= 0.1) {
              resolve(blob);
            } else {
              quality -= 0.1;
              tryCompress();
            }
          }, 'image/jpeg', quality);
        };
        
        tryCompress();
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleProfilePictureChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (2MB = 2 * 1024 * 1024 bytes)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('Image size must be less than 2MB. Please choose a smaller image.');
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP).');
        e.target.value = ''; // Clear the input
        return;
      }
      
      try {
        // Compress image to under 100KB
        const compressedBlob = await compressImage(file, 100);
        const compressedFile = new File([compressedBlob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        
        // Clean up any existing blob URL before creating new one
        if (profilePictureURL && profilePictureURL.startsWith('blob:')) {
          URL.revokeObjectURL(profilePictureURL);
        }
        
        setProfilePicture(compressedFile);
        const localUrl = URL.createObjectURL(compressedFile);
        setProfilePictureURL(localUrl);
        
        // Store the image URL in localStorage for Step 6 preview
        localStorage.setItem('tempProfileImageUrl', localUrl);
        console.log('Profile image stored in localStorage for Step 6 preview:', localUrl);
        
        // Also update parent form data with the compressed file
        updateForm({
          profilePicture: compressedFile
        });
        
        console.log(`Image compressed from ${(file.size/1024).toFixed(1)}KB to ${(compressedFile.size/1024).toFixed(1)}KB`);
      } catch (error) {
        console.error('Error compressing image:', error);
        alert('Error processing image. Please try a different image.');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, gender, dob, phone, email, whatsappNumber } = data;

    console.log("Form data at submit:", data); // Debug log
    if (!fullName || fullName.trim() === "") {
      alert("Please enter your full name.");
      return;
    }
    if (!gender || !dob || !phone) {
      alert("Please fill all required fields before continuing");
      return;
    }
    
    // Check if phone verification is complete
    if (!otpVerified) {
      alert("Please verify your phone number before continuing.");
      return;
    }

    // Check if step1 is already completed to avoid duplicate submissions
    const step1Completed = sessionStorage.getItem('step1Completed');
    if (step1Completed === 'true') {
      console.log("Step 1 already completed, moving to next step");
      next();
      return;
    }
    
    // If phone is verified but we have a profile picture, we still need to upload it
    if (otpVerified && verifiedWorkerId && !profilePicture) {
      console.log("Phone already verified and no profile picture, skipping API call");
      sessionStorage.setItem('step1Completed', 'true');
      next();
      return;
    }
    
    // Update the form with profile picture before sending to server
    updateForm({ 
      profilePicture,
      otpVerified: otpVerified // Add verification status to form data
    });
    
    // Create FormData object
    const formData = new FormData();
    
    // Add profile picture - debug logging
    if (profilePicture) {
      console.log("=== FRONTEND PROFILE PICTURE DEBUG ===");
      console.log("Profile picture exists:", !!profilePicture);
      console.log("Profile picture type:", profilePicture.type);
      console.log("Profile picture size:", profilePicture.size);
      console.log("Profile picture name:", profilePicture.name);
      formData.append("profilePicture", profilePicture);
      console.log("Profile picture appended to FormData");
    } else {
      console.log("WARNING: No profile picture to upload");
    }
    
    // Create DTO for worker registration with explicit non-null values
    const workerData = {
      fullName: fullName || "",      // Ensure non-null values
      gender: gender || "",
      dob: dob || "2000-01-01",      // Default date if empty
      phone: phone || "",
      email: email || "",
      whatsappNumber: whatsappNumber || "",
      otpVerified: otpVerified      // Set based on actual verification status
    };
    
    console.log("Sending worker data:", workerData);
    
    // Append worker data as a plain JSON string
    formData.append("data", JSON.stringify(workerData));
    
    setLoading(true);
    
    try {
      // Create endpoint URL
      let url = `${API_URL}/workers/register/step1`;
      
      // Add workerId parameter if it exists
      if (verifiedWorkerId) {
        url += `?workerId=${verifiedWorkerId}`;
      }
      
      setLoading(true);
      console.log("Sending request to URL:", url);
      // Ensure proper multipart/form-data content type
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update workerId if it's a new registration
      // Update parent component with workerId
      if (response.data.workerId) {
        const newWorkerId = response.data.workerId;
        console.log("Step 1 completed with workerId:", newWorkerId);
        
        // Update parent component
        updateWorkerId(newWorkerId);
        
        // Also store in sessionStorage for Step 2 fallback
        sessionStorage.setItem('sessionWorkerId', newWorkerId);
        localStorage.setItem('workerId', newWorkerId);
      }
      
      // Mark step 1 as completed
      sessionStorage.setItem('step1Completed', 'true');
      
      // Continue to next step
      next();
    } catch (err) {
      console.error("Error saving basic information:", err);
      console.error("Full error response:", err.response);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      
      let errorMsg = "Failed to save information. Please try again.";
      
      // Try to extract more specific error message
      if (err.response && err.response.data) {
        if (err.response.data.error) {
          errorMsg = err.response.data.error;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        }
      }
      
      // Add status code to error message for debugging
      if (err.response?.status) {
        errorMsg += ` (Status: ${err.response.status})`;
      }
      
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // No cleanup effect needed anymore

  return (
    <form onSubmit={handleSubmit} className="min-h-screen md:w-full lg:w-full text-white flex flex-col items-center p-4">
      <div className="w-full max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Register as a <span className="text-teal-400">worker</span>
        </h1>
        {/* Translation is now handled globally */}
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md inline-flex items-center mt-6 mb-10">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Few more steps to see your earnings!
        </div>

        <h2 className="text-3xl font-bold mb-0">Tell us about yourself!</h2>
        
        {/* Already registered link */}
        <div className="mt-4 text-center">
          <Link 
            to="/worker-login" 
            className="font-medium transition-colors hover:text-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400"
            style={{ color: '#00E0B8' }}
          >
            Already registered? Login
          </Link>
        </div>
      </div>

      <div className="w-full max-w-lg mx-auto space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-lg font-medium mb-2">
            What's your name?
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={data.fullName || ""}
            onChange={handleInputChange}
            placeholder="Enter name"
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md"
            required
          />
          <p className="text-sm text-yellow-500 mt-1">
            Special characters like !@#$%^&*()_+=~. are not allowed
          </p>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-lg font-medium mb-2">Gender</label>
          <div className="grid grid-cols-3 gap-3 sm:gap-4" style={{ alignItems: 'start' }}>
            {['Male', 'Female', 'Other'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleInputChange({ target: { name: 'gender', value: option } })}
                className={`flex items-center justify-center rounded-md cursor-pointer transition text-xs sm:text-base ${
                  data.gender === option
                    ? 'bg-teal-500 text-white border-2 border-teal-600'
                    : 'border-2 border-gray-700 text-gray-300 hover:bg-gray-800'
                }`}
                style={{ 
                  height: '48px',
                  lineHeight: '48px',
                  padding: '0 4px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 0,
                  verticalAlign: 'top'
                }}
              >
                <span style={{ lineHeight: 'normal' }}>{option}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dob" className="block text-lg font-medium mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={data.dob || ''}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md"
            required
          />
        </div>

        {/* Profile Picture (optional) */}
        <div>
          <label className="block text-lg font-medium mb-2">Profile Picture (optional)</label>
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              {profilePictureURL ? (
                <img
                  src={profilePictureURL}
                  alt="Profile Preview"
                  className="w-full h-full rounded-full object-cover border-2 border-teal-500"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-600">
                  <User size={48} className="text-gray-500" />
                </div>
              )}
              <label htmlFor="profile-picture" className="absolute bottom-0 right-0 bg-teal-500 text-white p-2 rounded-full cursor-pointer hover:bg-teal-600">
                <Camera size={20} />
              </label>
              <input
                type="file"
                id="profile-picture"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePictureChange}
              />
            </div>
            <label htmlFor="profile-picture" className="text-teal-400 cursor-pointer hover:text-teal-300">
              {profilePictureURL ? "Change photo" : "Upload photo"}
            </label>
            <p className="text-xs text-gray-400 mt-2">Max size: 2MB (Auto-compressed to 100KB)</p>
          </div>
        </div>

        {/* Email and WhatsApp (Optional) */}
        <div>
          <label htmlFor="email" className="block text-lg font-medium mb-2">Email (Optional)</label>
          <input
            type="email"
            id="email"
            name="email"
            value={data.email || ''}
            onChange={handleInputChange}
            placeholder="Email address"
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="whatsappNumber" className="block text-lg font-medium mb-2">WhatsApp Number (Optional)</label>
          <input
            type="tel"
            id="whatsappNumber"
            name="whatsappNumber"
            value={data.whatsappNumber || ''}
            onChange={handleInputChange}
            placeholder="WhatsApp number"
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md"
          />
        </div>

        {/* Contact Number with OTP verification */}
        <div>
          <label htmlFor="phone" className="block text-lg font-medium mb-2">Contact Number</label>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={data.phone || ''}
              onChange={handleInputChange}
              pattern="[0-9]{10}"
              placeholder="10-digit number"
              className="w-full sm:flex-1 p-3 bg-gray-900 border border-gray-700 rounded-md min-h-[48px]"
              required
              disabled={otpVerified}
            />
            {!otpSent && !otpVerified && (
              <button 
                type="button" 
                onClick={generateOtp}
                disabled={!data.phone || data.phone.length !== 10 || otpLoading}
                className={`w-full sm:w-auto px-6 py-3 rounded-md font-medium transition-colors whitespace-nowrap min-h-[48px] ${!data.phone || data.phone.length !== 10 || otpLoading ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600 text-white'}`}
              >
                {otpLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Sending...
                  </span>
                ) : (
                  'Verify'
                )}
              </button>
            )}
            {otpVerified && (
              <div className="flex items-center text-green-500 justify-center sm:justify-start">
                <CheckCircle size={20} className="mr-2" />
                <span className="whitespace-nowrap">Verified</span>
              </div>
            )}
          </div>
          
          {/* OTP verification section */}
          {otpSent && !otpVerified && (
            <div className="mt-4 p-4 border border-gray-700 rounded-md bg-gray-800">
              <p className="text-sm mb-3">Enter the verification code sent to your phone</p>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md"
                />
                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={!otpCode || otpCode.length !== 6 || otpLoading}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${!otpCode || otpCode.length !== 6 || otpLoading ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                >
                  {otpLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Verifying...
                    </span>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
              <div className="flex justify-between mt-3">
                <button
                  type="button"
                  onClick={generateOtp}
                  disabled={otpLoading}
                  className="text-blue-400 text-sm flex items-center hover:text-blue-300"
                >
                  <RefreshCw size={14} className="mr-1" />
                  Resend code
                </button>
                {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
              </div>
            </div>
          )}
          
          {/* Change mobile number option */}
          {otpVerified && (
            <div className="mt-4 p-4 border border-green-700 rounded-md bg-green-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={20} />
                  <span className="text-green-400 font-medium">Mobile verified: {data.phone}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOtpVerified(false);
                    setOtpSent(false);
                    setOtpCode('');
                    sessionStorage.removeItem('otpVerified');
                    sessionStorage.removeItem('mobileVerified');
                    updateForm({ otpVerified: false, otpSent: false });
                  }}
                  className="text-blue-400 text-sm hover:text-blue-300 flex items-center"
                >
                  <RefreshCw size={14} className="mr-1" />
                  Change Number
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mb-8 space-y-4">
          <button
            type="submit"
            className="w-full p-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-md transition-colors"
            disabled={loading || !otpVerified}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" size={20} />
                Processing...
              </span>
            ) : (
              "Continue"
            )}
          </button>
          
          {/* Navigation warning for home page */}
          <div className="text-center block md:hidden mt-6">
            <button
              type="button"
              onClick={() => onNavigationAttempt && onNavigationAttempt('/worker-login')}
              className="font-medium transition-colors hover:text-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400"
              style={{ color: '#00E0B8' }}
            >
              Already registered? Login
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}