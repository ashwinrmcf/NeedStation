import { useState, useEffect } from 'react';
import { Upload, AlertCircle, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function SkillVerificationPage({ data, updateForm, prev, next, workerId }) {
  // Check for workerId in useEffect to avoid state updates during render
  useEffect(() => {
    // Try to get workerId from sessionStorage if not provided as prop
    const sessionWorkerId = sessionStorage.getItem('sessionWorkerId');
    const localWorkerId = workerId || sessionWorkerId;
    
    if (!localWorkerId) {
      console.error("Worker ID is required for this step");
      console.log("Available workerId:", workerId);
      console.log("Session workerId:", sessionWorkerId);
    } else {
      console.log("Using workerId for Step 4:", localWorkerId);
    }
  }, [workerId]);

  // Initialize state with data from parent or defaults
  const [formData, setFormData] = useState({
    aadharNumber: data.aadharNumber || ''
  });
  
  // OTP verification states for Aadhaar only
  const [aadharOtpSent, setAadharOtpSent] = useState(false);
  const [aadharOtp, setAadharOtp] = useState('');
  const [aadharVerified, setAadharVerified] = useState(false);
  const [aadharOtpLoading, setAadharOtpLoading] = useState(false);

  // Restore Aadhaar verification status on component mount
  useEffect(() => {
    const savedAadharVerified = sessionStorage.getItem('aadharVerified');
    const savedAadharOtpSent = sessionStorage.getItem('aadharOtpSent');
    
    if (savedAadharVerified === 'true') {
      setAadharVerified(true);
    }
    if (savedAadharOtpSent === 'true') {
      setAadharOtpSent(true);
    }
  }, []);
  const [certificates, setCertificates] = useState([]);
  const [idProof, setIdProof] = useState(null);
  const [selfieWithId, setSelfieWithId] = useState(null);
  const [idProofPreview, setIdProofPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [certificatePreviews, setCertificatePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Restore image previews when component mounts or data changes
  useEffect(() => {
    // Check if we have a workerId (indicating an active session)
    // If no workerId, clear any stale localStorage items
    if (!workerId) {
      localStorage.removeItem('tempIdProofUrl');
      localStorage.removeItem('tempSelfieUrl');
      localStorage.removeItem('tempCertificateUrls');
      return;
    }
    
    // Restore ID proof preview only if workerId exists
    const savedIdProofUrl = localStorage.getItem('tempIdProofUrl');
    if (savedIdProofUrl) {
      setIdProofPreview(savedIdProofUrl);
    }
    
    // Restore selfie preview only if workerId exists
    const savedSelfieUrl = localStorage.getItem('tempSelfieUrl');
    if (savedSelfieUrl) {
      setSelfiePreview(savedSelfieUrl);
    }
    
    // Restore certificate previews only if workerId exists
    const savedCertUrls = localStorage.getItem('tempCertificateUrls');
    if (savedCertUrls) {
      try {
        const urls = JSON.parse(savedCertUrls);
        setCertificatePreviews(urls);
      } catch (e) {
        console.error('Error parsing certificate URLs:', e);
      }
    }
  }, [workerId]);

  const handleCertificateUpload = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setCertificates([...certificates, ...newFiles]);
      
      // Create preview URLs for new files
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      const updatedPreviews = [...certificatePreviews, ...newPreviews];
      setCertificatePreviews(updatedPreviews);
      localStorage.setItem('tempCertificateUrls', JSON.stringify(updatedPreviews));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update parent form data
    updateForm({
      [name]: value
    });
  };

  // Aadhaar OTP functions
  const sendAadharOtp = async () => {
    if (!formData.aadharNumber || formData.aadharNumber.length !== 12) {
      alert("Please enter a valid 12-digit Aadhaar number");
      return;
    }
    
    setAadharOtpLoading(true);
    try {
      // Simulate API call - replace with actual Aadhaar verification API
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAadharOtpSent(true);
      sessionStorage.setItem('aadharOtpSent', 'true');
      alert("OTP sent to your registered mobile number with Aadhaar");
    } catch (error) {
      alert("Failed to send OTP. Please try again.");
    } finally {
      setAadharOtpLoading(false);
    }
  };

  const verifyAadharOtp = async () => {
    if (!aadharOtp || aadharOtp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }
    
    setAadharOtpLoading(true);
    try {
      // Simulate API call - replace with actual verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (aadharOtp === "123456") { // Static OTP
        setAadharVerified(true);
        sessionStorage.setItem('aadharVerified', 'true');
        alert("Aadhaar verified successfully!");
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      alert("Verification failed. Please try again.");
    } finally {
      setAadharOtpLoading(false);
    }
  };

  const handleIdProofUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIdProof(file);
      const previewUrl = URL.createObjectURL(file);
      setIdProofPreview(previewUrl);
      localStorage.setItem('tempIdProofUrl', previewUrl);
    }
  };

  const handleSelfieUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelfieWithId(file);
      const previewUrl = URL.createObjectURL(file);
      setSelfiePreview(previewUrl);
      localStorage.setItem('tempSelfieUrl', previewUrl);
    }
  };

  const removeCertificate = (index) => {
    const updatedCertificates = [...certificates];
    updatedCertificates.splice(index, 1);
    setCertificates(updatedCertificates);
    
    // Also remove the corresponding preview
    const updatedPreviews = [...certificatePreviews];
    updatedPreviews.splice(index, 1);
    setCertificatePreviews(updatedPreviews);
    localStorage.setItem('tempCertificateUrls', JSON.stringify(updatedPreviews));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate required fields
    if (!formData.aadharNumber) {
      alert("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }
    
    // Validate OTP verification
    if (!aadharVerified) {
      alert("Please verify your Aadhaar number with OTP");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create FormData for file uploads
      const formPayload = new FormData();
      
      // Add data as JSON
      formPayload.append("data", new Blob([
        JSON.stringify({
          aadharNumber: formData.aadharNumber,
          aadharVerified: aadharVerified
        })
      ], { type: 'application/json' }));
      
      // Add ID proof if available
      if (idProof) {
        formPayload.append("idProof", idProof);
      }
      
      // Add selfie with ID if available
      if (selfieWithId) {
        formPayload.append("selfieWithId", selfieWithId);
      }
      
      // Add certificates if available
      if (certificates.length > 0) {
        certificates.forEach((cert, index) => {
          formPayload.append(`certificates`, cert);
        });
      }
      
      // Get workerId from prop or sessionStorage
      const sessionWorkerId = sessionStorage.getItem('sessionWorkerId');
      const currentWorkerId = workerId || sessionWorkerId;
      
      if (!currentWorkerId) {
        alert("Worker ID not found. Please restart the registration process.");
        setIsSubmitting(false);
        return;
      }
      
      // API URL
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      
      console.log("Sending Step 4 data with workerId:", currentWorkerId);
      
      // Send data to backend
      const response = await axios.post(
        `${API_URL}/workers/register/step4?workerId=${currentWorkerId}`,
        formPayload,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log("Step 4 saved successfully:", response.data);
      
      // Update parent form with any returned data
      if (response.data) {
        // If the backend returns URLs for the uploaded files
        if (response.data.idProofUrl) {
          updateForm({ idProofUrl: response.data.idProofUrl });
        }
        if (response.data.selfieWithIdUrl) {
          updateForm({ selfieWithIdUrl: response.data.selfieWithIdUrl });
        }
        if (response.data.certificateUrls) {
          updateForm({ certificateUrls: response.data.certificateUrls });
        }
      }
      
      // Proceed to next step
      next();
    } catch (error) {
      console.error("Error saving verification details:", error);
      alert(error.response?.data?.error || "Failed to save your information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen  text-white flex flex-col items-center p-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-cyan-400">Register as a worker</h1>

        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-8 flex items-center">
          <AlertCircle className="mr-2 flex-shrink-0" size={20} />
          <p>Few more steps to see your earnings!</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            <span className="text-cyan-400">Skill Verification</span> Details
          </h2>

          <div className="space-y-6">
            {/* Aadhaar Number with OTP Verification */}
            <div className="space-y-3 p-4 border border-gray-700 rounded-lg bg-gray-800/50">
              <label className="block text-lg font-medium">Aadhaar Number <span className="text-red-500">*</span></label>
              <div className="flex gap-3">
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your 12-digit Aadhaar number"
                  className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                  maxLength="12"
                  disabled={aadharVerified}
                  required
                />
                {!aadharVerified && (
                  <button
                    type="button"
                    onClick={sendAadharOtp}
                    disabled={aadharOtpLoading || formData.aadharNumber.length !== 12}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    {aadharOtpLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                )}
                {aadharVerified && (
                  <div className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Verified
                  </div>
                )}
              </div>
              
              {aadharOtpSent && !aadharVerified && (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={aadharOtp}
                    onChange={(e) => setAadharOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                    maxLength="6"
                  />
                  <button
                    type="button"
                    onClick={verifyAadharOtp}
                    disabled={aadharOtpLoading || aadharOtp.length !== 6}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    {aadharOtpLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              )}
              <p className="text-sm text-gray-400">Demo OTP: 123456</p>
            </div>

            {/* Certificates Upload */}
            <div className="space-y-2">
              <label className="block text-lg font-medium">Skills/Certificates (Optional)</label>
              <div className="border-2 border-dashed border-teal-600 rounded-md p-4 bg-gray-800">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="mb-2 text-cyan-400" size={24} />
                  <p className="text-center text-gray-300 mb-2">Upload images (JPG, PNG) or PDF files</p>
                  <input
                    type="file"
                    className="hidden"
                    id="certificateUpload"
                    multiple
                    onChange={handleCertificateUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <button
                    onClick={() => document.getElementById('certificateUpload').click()}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                  >
                    Browse Files
                  </button>
                </div>
              </div>

              {(certificates.length > 0 || certificatePreviews.length > 0) && (
                <div className="mt-2">
                  <p className="font-medium mb-1">Uploaded Certificates:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {certificates.length > 0 ? (
                      certificates.map((file, index) => (
                        <div key={index} className="bg-gray-800 rounded-md p-3">
                          {certificatePreviews[index] && (
                            <div className="mb-2">
                              <img 
                                src={certificatePreviews[index]} 
                                alt={`Certificate ${index + 1}`} 
                                className="w-20 h-20 object-cover rounded border border-teal-500"
                              />
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="truncate">{file.name}</span>
                            <button
                              onClick={() => removeCertificate(index)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      certificatePreviews.map((previewUrl, index) => (
                        <div key={index} className="bg-gray-800 rounded-md p-3">
                          <div className="mb-2">
                            <img 
                              src={previewUrl} 
                              alt={`Certificate ${index + 1}`} 
                              className="w-20 h-20 object-cover rounded border border-teal-500"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="truncate">Certificate {index + 1}</span>
                            <button
                              onClick={() => {
                                const updatedPreviews = certificatePreviews.filter((_, i) => i !== index);
                                setCertificatePreviews(updatedPreviews);
                                localStorage.setItem('tempCertificateUrls', JSON.stringify(updatedPreviews));
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ID Proof Upload */}
            <div className="space-y-2">
              <label className="block text-lg font-medium">ID Proof Upload <span className="text-gray-400 text-sm">(Aadhaar/PAN/Voter ID – for verification)</span></label>
              <div className="border-2 border-dashed border-teal-600 rounded-md p-4 bg-gray-800">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="mb-2 text-cyan-400" size={24} />
                  <p className="text-center text-gray-300 mb-2">Upload image (JPG, PNG) or PDF of your ID</p>
                  <input
                    type="file"
                    className="hidden"
                    id="idProofUpload"
                    onChange={handleIdProofUpload}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                  <button
                    onClick={() => document.getElementById('idProofUpload').click()}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                  >
                    Browse Files
                  </button>
                </div>
              </div>

              {(idProof || idProofPreview) && (
                <div className="mt-2">
                  {idProofPreview && (
                    <div className="mb-2">
                      <img 
                        src={idProofPreview} 
                        alt="ID Proof Preview" 
                        className="w-32 h-32 object-cover rounded border-2 border-teal-500"
                      />
                    </div>
                  )}
                  <div className="bg-gray-800 p-2 rounded flex justify-between items-center">
                    <span className="truncate">{idProof ? idProof.name : 'ID Proof uploaded'}</span>
                    <button
                      onClick={() => {
                        setIdProof(null);
                        setIdProofPreview(null);
                        localStorage.removeItem('tempIdProofUrl');
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Selfie with ID */}
            <div className="space-y-2">
              <label className="block text-lg font-medium">Selfie with ID <span className="text-gray-400 text-sm">(for additional verification)</span></label>
              <div className="border-2 border-dashed border-teal-600 rounded-md p-4 bg-gray-800">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="mb-2 text-cyan-400" size={24} />
                  <p className="text-center text-gray-300 mb-2">Upload selfie with ID (JPG, PNG, or PDF)</p>
                  <input
                    type="file"
                    className="hidden"
                    id="selfieUpload"
                    onChange={handleSelfieUpload}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                  <button
                    onClick={() => document.getElementById('selfieUpload').click()}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                  >
                    Browse Files
                  </button>
                </div>
              </div>

              {(selfieWithId || selfiePreview) && (
                <div className="mt-2">
                  {selfiePreview && (
                    <div className="mb-2">
                      <img 
                        src={selfiePreview} 
                        alt="Selfie Preview" 
                        className="w-32 h-32 object-cover rounded border-2 border-teal-500"
                      />
                    </div>
                  )}
                  <div className="bg-gray-800 p-2 rounded flex justify-between items-center">
                    <span className="truncate">{selfieWithId ? selfieWithId.name : 'Selfie uploaded'}</span>
                    <button
                      onClick={() => {
                        setSelfieWithId(null);
                        setSelfiePreview(null);
                        localStorage.removeItem('tempSelfieUrl');
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button onClick={prev} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-md flex items-center">
            <ChevronLeft className="mr-2" size={20} />
            Back
          </button>
          <button onClick={handleSubmit}
            type="button"
            className="bg-teal-500 text-white px-6 py-3 rounded-md flex items-center justify-center hover:bg-teal-600 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <span>Continue</span>
                <ChevronRight className="h-5 w-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}