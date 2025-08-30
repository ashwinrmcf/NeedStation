import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "../LoginPage/Login.module.css";
import axios from "axios";
import { CheckCircle, Loader2, RefreshCw } from "lucide-react";

const HindiWorkerLogin = () => {
  const [formData, setFormData] = useState({ email: "", phone: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [workerId, setWorkerId] = useState(null);
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
      setOtpError('कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें');
      return;
    }
    
    setOtpLoading(true);
    setOtpError('');
    
    try {
      // First try to find the worker by phone number using a temporary registration
      // This will return the workerId if found or create a new registration if not
      const registerRequest = {
        fullName: "",  // These will be populated later
        gender: "Other",
        dob: "2000-01-01",
        phone: formData.phone,
        email: "",
        whatsappNumber: formData.phone
      };
      
      // Use the new Free OTP API endpoints
      const response = await axios.post(
        'http://localhost:8080/api/workers/register/step1',
        registerRequest,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Check if we got a workerId
      if (response.data && response.data.workerId) {
        // Save the worker ID for OTP verification
        const foundWorkerId = response.data.workerId;
        setWorkerId(foundWorkerId);
        
        // OTP is sent automatically during registration
        setOtpSent(true);
        console.log('OTP sent successfully via Free OTP API');
        alert('OTP भेजा गया! कृपया वेरिफिकेशन कोड के लिए अपना फोन चेक करें।');
      } else {
        setOtpError('आपका खाता नहीं मिला या पंजीकृत नहीं हो सका। कृपया फिर से कोशिश करें।');
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
            alert('OTP भेजा गया! कृपया वेरिफिकेशन कोड के लिए अपना फोन चेक करें।');
          } else {
            setOtpError('OTP भेजने में असफल। कृपया फिर से कोशिश करें।');
          }
        } catch (resendError) {
          console.error('Error resending OTP:', resendError);
          setOtpError('OTP भेजने में असफल। कृपया फिर से कोशिश करें।');
        }
      } else if (error.response && error.response.data && error.response.data.error) {
        setOtpError(error.response.data.error);
      } else {
        setOtpError('OTP भेजने में असफल। कृपया फिर से कोशिश करें।');
      }
    } finally {
      setOtpLoading(false);
    }
  };
  
  const verifyOtp = async () => {
    if (!otpCode || otpCode.length < 6) {
      setOtpError('कृपया एक वैध OTP कोड दर्ज करें');
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
        // Automatically proceed with login after verification
        handleLoginAfterVerification();
      } else {
        setOtpError('गलत OTP। कृपया फिर से कोशिश करें।');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setOtpError(error.response.data.error);
      } else {
        setOtpError('OTP वेरिफाई करने में असफल। कृपया फिर से कोशिश करें।');
      }
    } finally {
      setOtpLoading(false);
    }
  };

  // This is called after successful OTP verification
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
      setMessage("लॉगिन सफल!");
      
      // Redirect to the enhanced dashboard
      navigate("/helper/overview");
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response && error.response.data) {
        // Show server error message if available
        setMessage(`लॉगिन असफल: ${error.response.data.message || "अपनी जानकारी जांचें।"}`);
        console.log("Error details:", error.response.data);
      } else {
        setMessage(`एक त्रुटि हुई: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // This starts the login process - first checking the phone and then initiating OTP
  const handleLogin = () => {
    // Validation
    if (!formData.phone) {
      setMessage("कृपया अपना मोबाइल नंबर दर्ज करें");
      return;
    }
    
    // Phone validation
    if (!/^\d{10}$/.test(formData.phone)) {
      setMessage("कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें");
      return;
    }
    
    // Generate OTP to start the login process
    generateOtp();
  };

  return (
    <>
      <div className={styles["header-container"]}>
        <Link to="/hi">
          <div className={styles["logo"]}>
            Need<span>Station</span>
          </div>
        </Link>
        <Link to="/hi/worker-registration">
          <div className={styles["account-text"]}>
            अभी तक पंजीकृत नहीं हैं?{" "}
            <span className={styles["login-link"]}>हेल्पर के रूप में पंजीकरण करें</span>
          </div>
        </Link>
      </div>

      <div className={`${styles["form-container"]} signup-form-spacing`}>
        <h2>हेल्पर लॉगिन</h2>
        {/* Email is now optional for login since we're using OTP */}
        <input
          type="email"
          name="email"
          className={styles["input-box"]}
          placeholder="ईमेल पता (वैकल्पिक)"
          value={formData.email}
          onChange={handleChange}
        />
        <div className={styles["input-group"]}>
          <input
            type="tel"
            name="phone"
            className={`${styles["input-box"]} ${otpVerified ? styles["input-verified"] : ""}`}
            placeholder="मोबाइल नंबर"
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
                  भेजा जा रहा है...
                </span>
              ) : (
                'वेरिफाई करें'
              )}
            </button>
          )}
          {otpVerified && (
            <div className={styles["verified-indicator"]}>
              <CheckCircle size={20} className={styles["verified-icon"]} />
              वेरिफाई हो गया
            </div>
          )}
        </div>
        
        {/* OTP verification section */}
        {otpSent && !otpVerified && (
          <div className={styles["otp-container"]}>
            <p className={styles["otp-instruction"]}>अपने फोन पर भेजा गया वेरिफिकेशन कोड दर्ज करें</p>
            <div className={styles["otp-input-group"]}>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="6-अंकीय कोड दर्ज करें"
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
                    वेरिफाई हो रहा है...
                  </span>
                ) : (
                  'सबमिट करें'
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
                कोड फिर से भेजें
              </button>
              {otpError && <p className={styles["error-message"]}>{otpError}</p>}
            </div>
          </div>
        )}
        <button 
          className={styles["continue-btn"]} 
          onClick={handleLogin}
          disabled={loading || (otpSent && !otpVerified)}
        >
          {loading ? "लॉगिन हो रहा है..." : otpVerified ? "जारी रखें" : "वेरिफिकेशन कोड भेजें"}
        </button>
        
        {message && <div className={styles["message"]}>{message}</div>}

        <div className={styles["register-link"]}>
          खाता नहीं है? <Link to="/hi/helper-registration">यहाँ पंजीकरण करें</Link>
        </div>

        <div className={styles["separator"]}>
          <span className={styles["line"]}>
            <hr />
          </span>
          या
          <span className={styles["line"]}>
            <hr />
          </span>
        </div>
        <button className={`${styles["social-btn"]} ${styles["google-btn"]}`}>
          Google के साथ जारी रखें
        </button>
      </div>
    </>
  );
};

export default HindiWorkerLogin;
