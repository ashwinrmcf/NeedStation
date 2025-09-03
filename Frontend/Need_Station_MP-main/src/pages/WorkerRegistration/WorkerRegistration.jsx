// src/pages/worker/WorkerRegistration.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Step1BasicInfo from './Step1BasicInfo';
import Step2ContactInfo from './Step2ContactInfo';
import Step3Address from './Step3Address';
import Step4WorkInfo from './Step4WorkInfo';
import Step5PaymentInfo from './Step5PaymentInfo';
import Step6Review from './Step6Review';
import axios from 'axios';

const WorkerRegistration = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [workerId, setWorkerId] = useState(null);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Session-based data management
  useEffect(() => {
    const isReload = performance.navigation?.type === 1 || performance.getEntriesByType('navigation')[0]?.type === 'reload';
    const isDirectNavigation = location.state?.fromHeader || !location.state;
    const otpVerified = sessionStorage.getItem('otpVerified') === 'true';
    const currentStep = parseInt(sessionStorage.getItem('currentStep') || '1');
    
    // Handle fresh navigation from header or direct URL access
    if (isDirectNavigation && !isReload) {
      console.log('Fresh navigation detected - starting new registration session');
      clearRegistrationData();
      setStep(1);
      return;
    }
    
    // Handle page reload - always clear data and start fresh
    if (isReload) {
      console.log('Page reload detected - clearing all registration data');
      clearRegistrationData();
      setStep(1);
      return;
    }
    
    // Restore session data if OTP is verified and it's not a fresh navigation
    if (otpVerified && !isDirectNavigation) {
      const savedWorkerId = localStorage.getItem('workerId');
      const savedFormData = localStorage.getItem('workerFormData');
      const savedStep = sessionStorage.getItem('currentStep');
      
      if (savedWorkerId) {
        setWorkerId(Number(savedWorkerId));
      }
      
      if (savedFormData) {
        try {
          const parsedData = JSON.parse(savedFormData);
          setFormData(prev => ({ ...prev, ...parsedData }));
        } catch (e) {
          console.error('Error parsing saved form data:', e);
        }
      }
      
      if (savedStep && parseInt(savedStep) !== step) {
        setStep(parseInt(savedStep));
      }
    }
  }, [location]);
  
  // Handle beforeunload event for page refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Only show warning if user has entered data or is in the middle of registration
      const hasFormData = localStorage.getItem('workerFormData');
      const hasWorkerId = localStorage.getItem('workerId');
      const otpVerified = sessionStorage.getItem('otpVerified') === 'true';
      
      if ((step >= 1 && step <= 6) && (hasFormData || hasWorkerId || otpVerified)) {
        e.preventDefault();
        e.returnValue = 'All registration data will be lost. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [step]);
  
  // Clear all registration data
  const clearRegistrationData = () => {
    localStorage.removeItem('workerId');
    localStorage.removeItem('workerFormData');
    sessionStorage.removeItem('otpVerified');
    sessionStorage.removeItem('currentStep');
    sessionStorage.removeItem('mobileVerified');
    
    // Clear Step 4 image localStorage items
    localStorage.removeItem('tempIdProofUrl');
    localStorage.removeItem('tempSelfieUrl');
    localStorage.removeItem('tempCertificateUrls');
    
    setWorkerId(null);
    setFormData({
      fullName: "", dob: "", gender: "", phone: "", email: "",
      whatsappNumber: "", profilePicture: null, otpId: "", otpSent: false, otpVerified: false,
      familyPhone: "", address: "", currentAddress: "", aadhaar: "", verification: "",
      category: "", experience: "", emergencyContact: "", bankAccount: "", ifsc: "", upi: ""
    });
  };
  
  // Handle navigation attempts
  const handleNavigationAttempt = (path) => {
    if (step >= 1 && step <= 6) {
      setPendingNavigation(path);
      setShowWarningDialog(true);
    } else {
      navigate(path);
    }
  };
  
  // Confirm navigation with data loss
  const confirmNavigation = async () => {
    // Delete worker data from database if workerId exists
    if (workerId) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
        await axios.delete(`${API_URL}/worker/delete/${workerId}`);
        console.log('Worker data deleted from database:', workerId);
      } catch (error) {
        console.error('Error deleting worker data from database:', error);
        // Continue with frontend cleanup even if backend deletion fails
      }
    }
    
    clearRegistrationData();
    setShowWarningDialog(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
    setPendingNavigation(null);
  };
  
  // Cancel navigation
  const cancelNavigation = () => {
    setShowWarningDialog(false);
    setPendingNavigation(null);
  };

  // State to store the local image preview URL
  const [localProfileImageUrl, setLocalProfileImageUrl] = useState(null);

  const [formData, setFormData] = useState({
    // Basic info
    fullName: "", 
    dob: "", 
    gender: "", 
    phone: "", 
    email: "",
    whatsappNumber: "",
    profilePicture: null,
    otpId: "",
    otpSent: false,
    otpVerified: false,

    // Additional fields for other steps
    familyPhone: "",
    address: "", 
    currentAddress: "", 
    aadhaar: "", 
    verification: "",
    category: "", 
    experience: "", 
    emergencyContact: "",
    bankAccount: "", 
    ifsc: "", 
    upi: ""
  });

  const next = () => {
    const newStep = step + 1;
    setStep(newStep);
    sessionStorage.setItem('currentStep', newStep.toString());
    // Scroll to top when moving to next step
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const prev = () => {
    const newStep = step - 1;
    setStep(newStep);
    sessionStorage.setItem('currentStep', newStep.toString());
    // Scroll to top when moving to previous step
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateForm = (data) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    
    // Save to localStorage for session persistence
    localStorage.setItem('workerFormData', JSON.stringify(updatedData));
    
    // Mark OTP as verified if it's being set
    if (data.otpVerified === true) {
      sessionStorage.setItem('otpVerified', 'true');
      sessionStorage.setItem('mobileVerified', 'true');
    }
  };

  // Function to fetch worker data from backend
  const fetchWorkerData = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/worker/details/${id}`);
      if (response.data) {
        // Update form data with fetched worker data
        const worker = response.data;

        // Map backend data to form data structure
        const mappedData = {
          // Basic info
          fullName: worker.fullName || "",
          dob: worker.dob || "",
          gender: worker.gender || "",
          phone: worker.phone || "",
          email: worker.email || "",
          whatsappNumber: worker.whatsappNumber || "",

          // Contact info
          permanentAddress: worker.permanentAddress || "",
          currentAddress: worker.currentAddress || "",
          city: worker.city || "",
          pincode: worker.pincode || "",
          serviceAreas: worker.serviceAreas || "",
          openToTravel: worker.openToTravel || false,

          // Work info from JSON strings
          services: worker.services ? JSON.parse(worker.services) : {},
          experience: worker.experience || "",
          workType: worker.workType || "",
          availability: worker.availability ? JSON.parse(worker.availability) : {},
          languages: worker.languages ? JSON.parse(worker.languages) : {},

          // Verification
          aadharNumber: worker.aadharNumber || "",
          policeVerificationStatus: worker.policeVerificationStatus || "",
          idProofUrl: worker.idProofUrl || "",
          selfieWithIdUrl: worker.selfieWithIdUrl || "",
          certificateUrls: worker.certificateUrls ? JSON.parse(worker.certificateUrls) : {},

          // Payment
          paymentMode: worker.paymentMode || "",
          upiId: worker.upiId || "",
          bankName: worker.bankName || "",
          accountNumber: worker.accountNumber || "",
          ifscCode: worker.ifscCode || "",
          panCard: worker.panCard || "",

          // Emergency
          emergencyContactName: worker.emergencyContactName || "",
          emergencyContactNumber: worker.emergencyContactNumber || ""
        };

        setFormData(mappedData);
      }
    } catch (err) {
      console.error("Error fetching worker data:", err);
      // Check if error is due to worker not found
      if (err.response && err.response.status === 404 || err.message.includes("not found")) {
        console.log("Worker ID not found in database. Starting fresh registration.");
        // Clear invalid worker ID from localStorage
        localStorage.removeItem('workerId');
        // Reset workerId state
        setWorkerId(null);
        // Show friendly message
        setError("Starting a new registration. Your previous session was not found.");
      } else {
        setError("Failed to load your registration data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Update workerId when receiving it from a step
  const updateWorkerId = (id) => {
    setWorkerId(id);
    localStorage.setItem('workerId', id);
  };

  // Navigation hook for redirects (already declared above)
  
  // Final submission handler
  const handleFinalSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Make API call to finalize registration
      const response = await axios.post(`http://localhost:8080/api/worker/register/submit?workerId=${workerId}`);

      // Handle successful registration
      if (response.data) {
        // Redirect to worker dashboard
        navigate('/worker-dashboard');
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Component mapping with props
  const steps = [
    <Step1BasicInfo 
      data={formData} 
      updateForm={updateForm} 
      next={next} 
      workerId={workerId} 
      updateWorkerId={updateWorkerId}
      onNavigationAttempt={handleNavigationAttempt}
      clearRegistrationData={clearRegistrationData}
    />,
    <Step2ContactInfo 
      data={formData} 
      updateForm={updateForm} 
      next={next} 
      prev={prev} 
      workerId={workerId} 
    />,
    <Step3Address 
      data={formData} 
      updateForm={updateForm} 
      next={next} 
      prev={prev} 
      workerId={workerId} 
    />,
    <Step4WorkInfo 
      data={formData} 
      updateForm={updateForm} 
      next={next} 
      prev={prev} 
      workerId={workerId} 
    />,
    <Step5PaymentInfo 
      data={formData} 
      updateForm={updateForm} 
      next={next} 
      prev={prev} 
      workerId={workerId} 
    />,
    <Step6Review 
      data={formData} 
      prev={prev} 
      onSubmit={handleFinalSubmit} 
      loading={loading} 
      error={error} 
      workerId={workerId} 
    />
  ];

  // Display progress indicator with glowing effect
  const renderProgressBar = () => {
    return (
      <div className="mb-2">
        <div className="flex justify-between items-center">
          {['Basic Info', 'Address', 'Work', 'Verification', 'Payment', 'Review'].map((label, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="relative">
                {/* Glow effect div positioned absolutely */}
                <div className={`absolute inset-0 rounded-full blur-sm
                  ${step > idx + 1 ? 'bg-green-500/60' : 
                    step === idx + 1 ? 'bg-teal-500/60' : 'bg-transparent'}
                  transition-all duration-300`}></div>
                  
                {/* Main circle indicator */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center relative
                  ${step > idx + 1 ? 'bg-green-500 ring-2 ring-green-400' : 
                    step === idx + 1 ? 'bg-teal-500 ring-2 ring-teal-400' : 'bg-gray-700'}
                  transition-all duration-300`}>
                  {step > idx + 1 ? (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-white text-sm">{idx + 1}</span>
                  )}
                </div>
              </div>
              <span className={`text-xs mt-2 ${step === idx + 1 ? 'text-teal-500 font-semibold' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-700 h-1 mt-4 rounded-full overflow-hidden">
          <div 
            className="bg-teal-500 h-1 rounded-full shadow-lg shadow-teal-500/70" 
            style={{ width: `${((step - 1) / 5) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-white p-4 form-content-spacing">
      <div className="max-w-4xl mx-auto">
        {/* Warning Dialog */}
        {showWarningDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md mx-4">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-500 rounded-full p-2 mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Warning</h3>
              </div>
              <p className="text-gray-300 mb-6">
                All registration data will be lost and mobile verification will be removed. 
                All fields will be empty for this session. Are you sure you want to continue?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={confirmNavigation}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Yes, Continue
                </button>
                <button
                  onClick={cancelNavigation}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Show progress bar for all steps except final success page */}
        {step <= 6 && renderProgressBar()}
        
        {/* Current step component */}
        {steps[step - 1]}
      </div>
    </div>
  );
};

export default WorkerRegistration;