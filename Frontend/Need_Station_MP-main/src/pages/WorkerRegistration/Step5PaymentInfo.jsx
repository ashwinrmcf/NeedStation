import { useState, useEffect } from 'react';
import { AlertCircle, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function PaymentInformationPage({ data, updateForm, prev, next, workerId }) {
  useEffect(() => {
    // Try to get workerId from sessionStorage if not provided as prop
    const sessionWorkerId = sessionStorage.getItem('sessionWorkerId');
    const localWorkerId = workerId || sessionWorkerId;
    
    if (!localWorkerId) {
      console.error("Worker ID is required for this step");
      console.log("Available workerId:", workerId);
      console.log("Session workerId:", sessionWorkerId);
    } else {
      console.log("Using workerId for Step 5:", localWorkerId);
    }
  }, [workerId]);
  
  // Initialize state with data from parent or defaults
  const [paymentMode, setPaymentMode] = useState(data.paymentMode || '');
  const [upiId, setUpiId] = useState(data.upiId || '');
  const [bankName, setBankName] = useState(data.bankName || '');
  const [accountNo, setAccountNo] = useState(data.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(data.ifscCode || '');
  const [panCard, setPanCard] = useState(data.panCard || '');
  const [emergencyContactName, setEmergencyContactName] = useState(data.emergencyContactName || '');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState(data.emergencyContactNumber || '');
  const [showBankDetails, setShowBankDetails] = useState(data.paymentMode === 'Bank Transfer');
  const [showUpiDetails, setShowUpiDetails] = useState(data.paymentMode === 'UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // PAN OTP verification states
  const [panOtpSent, setPanOtpSent] = useState(false);
  const [panOtp, setPanOtp] = useState('');
  const [panVerified, setPanVerified] = useState(false);
  const [panOtpLoading, setPanOtpLoading] = useState(false);

  // Restore PAN verification status on component mount
  useEffect(() => {
    const savedPanVerified = sessionStorage.getItem('panVerified');
    const savedPanOtpSent = sessionStorage.getItem('panOtpSent');
    
    if (savedPanVerified === 'true') {
      setPanVerified(true);
    }
    if (savedPanOtpSent === 'true') {
      setPanOtpSent(true);
    }
  }, []);

  const handlePaymentModeChange = (mode) => {
    setPaymentMode(mode);
    setShowBankDetails(mode === 'Bank Transfer');
    setShowUpiDetails(mode === 'UPI');
    
    // Update parent form data
    updateForm({
      paymentMode: mode
    });
  };
  
  const handleInputChange = (setter, field) => (e) => {
    setter(e.target.value);
    
    // Update parent form data
    updateForm({
      [field]: e.target.value
    });
  };

  // PAN OTP functions
  const sendPanOtp = async () => {
    if (!panCard || panCard.length !== 10) {
      alert("Please enter a valid 10-character PAN number");
      return;
    }
    
    setPanOtpLoading(true);
    try {
      // Simulate API call - replace with actual PAN verification API
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPanOtpSent(true);
      sessionStorage.setItem('panOtpSent', 'true');
      alert("OTP sent to your registered mobile number with PAN");
    } catch (error) {
      alert("Failed to send OTP. Please try again.");
    } finally {
      setPanOtpLoading(false);
    }
  };

  const verifyPanOtp = async () => {
    if (!panOtp || panOtp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }
    
    setPanOtpLoading(true);
    try {
      // Simulate API call - replace with actual verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (panOtp === "123456") { // Static OTP
        setPanVerified(true);
        sessionStorage.setItem('panVerified', 'true');
        alert("PAN verified successfully!");
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      alert("Verification failed. Please try again.");
    } finally {
      setPanOtpLoading(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validate required fields
    if (!paymentMode) {
      alert("Please select a payment mode");
      return;
    }
    
    if (paymentMode === 'UPI' && !upiId) {
      alert("Please enter your UPI ID");
      return;
    }
    
    if (paymentMode === 'Bank Transfer' && (!bankName || !accountNo || !ifscCode)) {
      alert("Please fill in all bank details");
      return;
    }
    
    // Validate PAN number and verification
    if (!panCard) {
      alert("Please enter your PAN number");
      return;
    }
    
    if (!panVerified) {
      alert("Please verify your PAN number with OTP");
      return;
    }
    
    // Emergency contact validation removed as requested
    
    setIsSubmitting(true);
    
    try {
      // Get workerId from prop or sessionStorage
      const sessionWorkerId = sessionStorage.getItem('sessionWorkerId');
      const currentWorkerId = workerId || sessionWorkerId;
      
      if (!currentWorkerId) {
        alert("Worker ID not found. Please restart the registration process.");
        setIsSubmitting(false);
        return;
      }
      
      // Prepare data for backend
      const workerData = {
        paymentMode,
        upiId: paymentMode === 'UPI' ? upiId : null,
        bankName: paymentMode === 'Bank Transfer' ? bankName : null,
        accountNumber: paymentMode === 'Bank Transfer' ? accountNo : null,
        ifscCode: paymentMode === 'Bank Transfer' ? ifscCode : null,
        panCard,
        emergencyContactName,
        emergencyContactNumber
      };
      
      // API URL
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      
      console.log("Sending Step 5 data with workerId:", currentWorkerId);
      
      // Send data to backend
      const response = await axios.post(
        `${API_URL}/workers/register/step5?workerId=${currentWorkerId}`,
        workerData
      );
      
      console.log("Step 5 saved successfully:", response.data);
      
      // Proceed to next step
      next();
    } catch (error) {
      console.error("Error saving payment information:", error);
      alert(error.response?.data?.error || "Failed to save your information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen  text-white flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-teal-400">Register as a worker</h1>
        
        {/* Alert Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-8">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
            <p className="text-yellow-700">Few more steps to see your earnings!</p>
          </div>
        </div>
        
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl">
            <span className="text-teal-400">Payment</span> Details
          </h2>
        </div>
        
        {/* Payment Form */}
        <div className="space-y-6">
          {/* Payment Mode */}
          <div>
            <label className="block text-lg mb-3">Preferred Payment Mode</label>
            <div className="flex flex-wrap gap-3">
              <button 
                className={`px-6 py-3 rounded border ${paymentMode === 'Bank Transfer' ? 'bg-teal-500 border-teal-400' : 'border-gray-600 bg-gray-800'}`}
                onClick={() => handlePaymentModeChange('Bank Transfer')}
              >
                Bank Transfer
              </button>
              <button 
                className={`px-6 py-3 rounded border ${paymentMode === 'UPI' ? 'bg-teal-500 border-teal-400' : 'border-gray-600 bg-gray-800'}`}
                onClick={() => handlePaymentModeChange('UPI')}
              >
                UPI
              </button>
            </div>
          </div>
          
          {/* UPI Details (conditional) */}
          {showUpiDetails && (
            <div>
              <label className="block text-lg mb-3">UPI ID</label>
              <input 
                type="text" 
                value={upiId}
                onChange={handleInputChange(setUpiId, 'upiId')}
                placeholder="Enter your UPI ID" 
                className="w-full p-4 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-teal-400"
              />
            </div>
          )}
          
          {/* Bank Details (conditional) */}
          {showBankDetails && (
            <div className="space-y-4">
              <div>
                <label className="block text-lg mb-2">Bank Name</label>
                <input 
                  type="text" 
                  value={bankName}
                  onChange={handleInputChange(setBankName, 'bankName')}
                  placeholder="Enter bank name" 
                  className="w-full p-4 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-teal-400"
                />
              </div>
              <div>
                <label className="block text-lg mb-2">Account Number</label>
                <input 
                  type="text" 
                  value={accountNo}
                  onChange={handleInputChange(setAccountNo, 'accountNumber')}
                  placeholder="Enter account number" 
                  className="w-full p-4 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-teal-400"
                />
              </div>
              <div>
                <label className="block text-lg mb-2">IFSC Code</label>
                <input 
                  type="text" 
                  value={ifscCode}
                  onChange={handleInputChange(setIfscCode, 'ifscCode')}
                  placeholder="Enter IFSC code" 
                  className="w-full p-4 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>
          )}
          
          {/* PAN Card with OTP Verification */}
          <div className="space-y-3 p-4 border border-gray-700 rounded-lg bg-gray-800/50">
            <label className="block text-lg font-medium">PAN Card Number <span className="text-red-500">*</span></label>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={panCard}
                onChange={handleInputChange(setPanCard, 'panCard')}
                placeholder="Enter your 10-character PAN number" 
                className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                maxLength="10"
                style={{ textTransform: 'uppercase' }}
                disabled={panVerified}
                required
              />
              {!panVerified && (
                <button
                  type="button"
                  onClick={sendPanOtp}
                  disabled={panOtpLoading || panCard.length !== 10}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {panOtpLoading ? 'Sending...' : 'Send OTP'}
                </button>
              )}
              {panVerified && (
                <div className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Verified
                </div>
              )}
            </div>
            
            {panOtpSent && !panVerified && (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={panOtp}
                  onChange={(e) => setPanOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                  maxLength="6"
                />
                <button
                  type="button"
                  onClick={verifyPanOtp}
                  disabled={panOtpLoading || panOtp.length !== 6}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {panOtpLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            )}
            <p className="text-sm text-gray-400">Demo OTP: 123456 | Required for tax compliance</p>
          </div>

          {/* Emergency Contact (optional) */}
          <div className="mt-8 pt-4 border-t border-gray-700">
            <h3 className="text-xl text-gray-300 mb-4">Emergency Contact <span className="text-gray-500 text-base">(Optional)</span></h3>
            <p className="text-sm text-gray-400 mb-4">This information helps ensure your safety. It's optional but recommended.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-lg mb-2">Emergency Contact Name</label>
                <input 
                  type="text" 
                  value={emergencyContactName}
                  onChange={handleInputChange(setEmergencyContactName, 'emergencyContactName')}
                  placeholder="Enter emergency contact name" 
                  className="w-full p-4 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-teal-400"
                />
              </div>
              <div>
                <label className="block text-lg mb-2">Emergency Contact Number</label>
                <input 
                  type="text" 
                  value={emergencyContactNumber}
                  onChange={handleInputChange(setEmergencyContactNumber, 'emergencyContactNumber')}
                  placeholder="Enter emergency contact number" 
                  className="w-full p-4 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
          <button onClick={prev} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-md flex items-center">
            <ChevronLeft className="mr-2" size={20} />
            Back
          </button>
          <button 
            onClick={handleSubmit}  
            className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-3 rounded-md flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Next'}
            {!isSubmitting && <ChevronRight className="ml-2" size={20} />}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}