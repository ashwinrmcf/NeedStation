import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "../LoginPage/Login.module.css";
import axios from "axios";
import { CheckCircle, Loader2, RefreshCw } from "lucide-react";

const WorkerLogin = () => {
  const [formData, setFormData] = useState({ phone: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [workerId, setWorkerId] = useState(null);
  const [nameVerification, setNameVerification] = useState(false);
  const [workerName, setWorkerName] = useState("");
  const [nameError, setNameError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Reset OTP verification if phone number changes
    if (name === 'phone' && (otpSent || otpVerified)) {
      setOtpSent(false);
      setOtpVerified(false);
      setOtpCode('');
      setOtpError('');
    }
  };
  
  const generateOtp = async () => {
    // Validation
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      setOtpError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setOtpLoading(true);
    setOtpError('');
    
    try {
      // First, check if worker exists with this phone number
      const workerCheckResponse = await axios.get(
        `http://localhost:8080/api/worker/check-phone/${formData.phone}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (workerCheckResponse.data && workerCheckResponse.data.exists) {
        setWorkerId(workerCheckResponse.data.workerId);
        
        // Generate OTP using the free OTP API only if worker exists
        const otpResponse = await axios.post(
          'http://localhost:3001/generate-otp',
          {
            phoneNumber: `+91${formData.phone}`
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (otpResponse.data && otpResponse.data.success) {
          setOtpSent(true);
          console.log('OTP sent successfully via Free OTP API');
        } else {
          setOtpError("Failed to send verification code. Please try again.");
        }
      } else {
        setOtpError("Phone number not registered. Please register as a helper first.");
      }
    } catch (error) {
      console.error('Error generating OTP:', error);
      if (error.response && error.response.status === 409 && error.response.data && error.response.data.workerId) {
        // This means the worker already exists, which is good for login
        setWorkerId(error.response.data.workerId);
        
        // Now send the OTP using the resend endpoint
        try {
          const resendResponse = await axios.post(
            'http://localhost:8080/api/workers/resend-otp',
            { workerId: error.response.data.workerId },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (resendResponse.data && resendResponse.data.sent) {
            setOtpSent(true);
            console.log('OTP resent successfully');
            alert('OTP sent! Please check your phone for the verification code.');
          } else {
            setOtpError('Failed to send OTP. Please try again.');
          }
        } catch (resendError) {
          console.error('Error resending OTP:', resendError);
          setOtpError('Failed to send OTP. Please try again.');
        }
      } else if (error.response && error.response.data && error.response.data.error) {
        setOtpError(error.response.data.error);
      } else {
        setOtpError('Failed to send OTP. Please try again.');
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otpCode || otpCode.length < 6) {
      setOtpError('Please enter a valid OTP code');
      return;
    }
    
    setOtpLoading(true);
    setOtpError('');
    
    try {
      // Use the new Free OTP API endpoint for verification
      const verifyResponse = await axios.post(
        'http://localhost:8080/api/workers/verify-otp',
        { 
          workerId: workerId,
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
        console.log('OTP verified successfully via Free OTP API');
        // Show name verification step after OTP verification
        setNameVerification(true);
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

  // Verify worker name as security question
  const verifyWorkerName = async () => {
    if (!workerName.trim()) {
      setNameError('Please enter your full name');
      return;
    }
    
    setLoading(true);
    setNameError('');
    
    try {
      // Verify name matches the registered worker for this specific phone number
      const nameResponse = await axios.post(
        'http://localhost:8080/api/worker/verify-name',
        {
          phone: formData.phone,
          fullName: workerName.trim()
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (nameResponse.data && nameResponse.data.verified) {
        // Name verified, proceed with login
        handleLoginAfterVerification();
      } else {
        setNameError('Name does not match our records. Please check and try again.');
      }
    } catch (error) {
      console.error('Error verifying name:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setNameError(error.response.data.error);
      } else {
        setNameError('Failed to verify name. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // This is called after successful name verification
  const handleLoginAfterVerification = async () => {
    try {
      setLoading(true);
      setMessage("");
      
      // Connect to the new worker authentication endpoint with explicit CORS headers
      const response = await axios.post(
        "http://localhost:8080/api/worker/login", 
        {
          workerId: workerId,
          phone: formData.phone,
          verified: true // Add this flag to indicate OTP verification happened
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log("Login response:", response.data);
      
      // If we get here, login was successful
      const { workerId: respWorkerId, fullName, phone, email } = response.data;
      
      // Store worker info in localStorage
      localStorage.setItem("workerId", respWorkerId);
      localStorage.setItem("workerName", fullName);
      localStorage.setItem("workerPhone", phone);
      localStorage.setItem("workerEmail", email);
      localStorage.setItem("workerProfileImage", ""); // Not provided in response
      localStorage.setItem("workerLoggedIn", "true");
      
      // Show brief success message and redirect immediately
      setMessage("Login successful!");
      
      // Redirect to the enhanced dashboard
      navigate("/helper/overview");
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response && error.response.data) {
        // Show server error message if available
        setMessage(`Login failed: ${error.response.data.message || "Check your credentials."}`);
        console.log("Error details:", error.response.data);
      } else {
        setMessage(`An error occurred: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // This starts the login process - first checking the phone and then initiating OTP
  const handleLogin = () => {
    // Validation
    if (!formData.phone) {
      setMessage("Please enter your mobile number");
      return;
    }
    
    // Phone validation
    if (!/^\d{10}$/.test(formData.phone)) {
      setMessage("Please enter a valid 10-digit mobile number");
      return;
    }
    
    // Generate OTP to start the login process
    generateOtp();
  };

  return (
    <>
      <div className={styles["header-container"]}>
        <Link to="/">
          <div className={styles["logo"]}>
            Need<span>Station</span>
          </div>
        </Link>
        <Link to="/helper-registration">
          <div className={styles["account-text"]}>
            Not registered yet?{" "}
            <span className={styles["login-link"]}>Register as Helper</span>
          </div>
        </Link>
      </div>

      <div className={`${styles["form-container"]} signup-form-spacing`}>
        <h2>Helper Login</h2>
        <div className={styles["input-group"]}>
          <input
            type="tel"
            name="phone"
            className={`${styles["input-box"]} ${otpVerified ? styles["input-verified"] : ""}`}
            placeholder="Mobile Number"
            value={formData.phone}
            onChange={handleChange}
            maxLength={10}
            disabled={otpVerified || otpSent}
          />
          {!otpSent && !otpVerified && (
            <button 
              type="button" 
              className={styles["verify-btn"]}
              onClick={generateOtp}
              disabled={!formData.phone || formData.phone.length !== 10 || otpLoading}
            >
              {otpLoading ? (
                <span className={styles["btn-loading"]}>
                  <Loader2 className={styles["spin-icon"]} size={16} />
                  Sending...
                </span>
              ) : (
                'Verify'
              )}
            </button>
          )}
          {otpVerified && (
            <div className={styles["verified-indicator"]}>
              <CheckCircle size={20} className={styles["verified-icon"]} />
              Verified
            </div>
          )}
        </div>
        
        {/* OTP verification section */}
        {otpSent && !otpVerified && (
          <div className={styles["otp-container"]}>
            <p className={styles["otp-instruction"]}>Enter the verification code sent to your phone</p>
            <div className={styles["otp-input-group"]}>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className={styles["input-box"]}
              />
              <button
                type="button"
                onClick={verifyOtp}
                disabled={!otpCode || otpCode.length !== 6 || otpLoading}
                className={styles["verify-btn"]}
              >
                {otpLoading ? (
                  <span className={styles["btn-loading"]}>
                    <Loader2 className={styles["spin-icon"]} size={16} />
                    Verifying...
                  </span>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
            <div className={styles["otp-actions"]}>
              <button
                type="button"
                onClick={generateOtp}
                disabled={otpLoading}
                className={styles["resend-btn"]}
              >
                <RefreshCw size={14} className={styles["resend-icon"]} />
                Resend code
              </button>
              {otpError && <p className={styles["error-message"]}>{otpError}</p>}
            </div>
          </div>
        )}

        {/* Name verification section */}
        {nameVerification && otpVerified && (
          <div className={styles["name-container"]}>
            <p className={styles["name-instruction"]}>For security, please enter your full name as registered</p>
            <div className={styles["name-input-group"]}>
              <input
                type="text"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                placeholder="Enter your full name"
                className={styles["input-box"]}
              />
              <button
                type="button"
                onClick={verifyWorkerName}
                disabled={!workerName.trim() || loading}
                className={styles["verify-btn"]}
              >
                {loading ? (
                  <span className={styles["btn-loading"]}>
                    <Loader2 className={styles["spin-icon"]} size={16} />
                    Verifying...
                  </span>
                ) : (
                  'Verify Name'
                )}
              </button>
            </div>
            {nameError && <p className={styles["error-message"]}>{nameError}</p>}
          </div>
        )}
        <button 
          className={styles["continue-btn"]} 
          onClick={handleLogin}
          disabled={loading || (otpSent && !otpVerified)}
        >
          {loading ? "Logging in..." : otpVerified ? "Continue" : "Send verification code"}
        </button>
        
        {message && <div className={styles["message"]}>{message}</div>}

        <div className={styles["register-link"]}>
          Don't have an account? <Link to="/helper-registration">Register here</Link>
        </div>

      </div>
    </>
  );
};

export default WorkerLogin;
