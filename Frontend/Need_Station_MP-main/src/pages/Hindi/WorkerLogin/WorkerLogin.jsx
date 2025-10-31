import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "../../LoginPage/Login.module.css";
import axios from "axios";
import { CheckCircle, Loader2, RefreshCw } from "lucide-react";

const HindiWorkerLogin = () => {
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
    
    if (name === 'phone' && (otpSent || otpVerified)) {
      setOtpSent(false);
      setOtpVerified(false);
      setOtpCode('');
      setOtpError('');
    }
  };
  
  const generateOtp = async () => {
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      setOtpError('कृपया एक मान्य 10-अंकीय मोबाइल नंबर दर्ज करें');
      return;
    }
    
    setOtpLoading(true);
    setOtpError('');
    
    try {
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
        setOtpSent(true);
        console.log('OTP sent successfully - Use 123456 for testing');
      } else {
        setOtpError("फोन नंबर पंजीकृत नहीं है। कृपया पहले सहायक के रूप में पंजीकरण करें।");
      }
    } catch (error) {
      console.error('Error checking phone number:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setOtpError(error.response.data.error);
      } else {
        setOtpError('फोन नंबर जांचने में विफल। कृपया पुनः प्रयास करें।');
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otpCode || otpCode.length < 6) {
      setOtpError('कृपया एक मान्य OTP कोड दर्ज करें');
      return;
    }
    
    setOtpLoading(true);
    setOtpError('');
    
    try {
      if (otpCode === '123456') {
        setOtpVerified(true);
        setOtpError('');
        console.log('OTP verified successfully - hardcoded for testing');
        setNameVerification(true);
      } else {
        setOtpError('अमान्य OTP। परीक्षण के लिए कृपया 123456 दर्ज करें।');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError('OTP सत्यापित करने में विफल। कृपया पुनः प्रयास करें।');
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyWorkerName = async () => {
    if (!workerName.trim()) {
      setNameError('कृपया अपना पहला नाम दर्ज करें');
      return;
    }
    
    setLoading(true);
    setNameError('');
    
    try {
      const firstNameOnly = workerName.trim().split(/\s+/)[0];
      
      const nameResponse = await axios.post(
        'http://localhost:8080/api/worker/verify-name',
        {
          phone: formData.phone,
          firstName: firstNameOnly
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (nameResponse.data && nameResponse.data.verified) {
        handleLoginAfterVerification();
      } else {
        setNameError('पहला नाम हमारे रिकॉर्ड से मेल नहीं खाता। कृपया जांचें और पुनः प्रयास करें।');
      }
    } catch (error) {
      console.error('Error verifying name:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setNameError(error.response.data.error);
      } else {
        setNameError('नाम सत्यापित करने में विफल। कृपया पुनः प्रयास करें।');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginAfterVerification = async () => {
    try {
      setLoading(true);
      setMessage("");
      
      const response = await axios.post(
        "http://localhost:8080/api/worker/login", 
        {
          workerId: workerId,
          phone: formData.phone,
          verified: true
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log("Login response:", response.data);
      
      const { workerId: respWorkerId, fullName, phone, email } = response.data;
      
      localStorage.setItem("workerId", respWorkerId);
      localStorage.setItem("workerName", fullName);
      localStorage.setItem("workerPhone", phone);
      localStorage.setItem("workerEmail", email);
      localStorage.setItem("workerProfileImage", "");
      localStorage.setItem("workerLoggedIn", "true");
      
      setMessage("लॉगिन सफल!");
      
      navigate("/helper/overview");
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response && error.response.data) {
        setMessage(`लॉगिन विफल: ${error.response.data.message || "अपनी साख जांचें।"}`);
        console.log("Error details:", error.response.data);
      } else {
        setMessage(`एक त्रुटि हुई: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogin = () => {
    if (!formData.phone) {
      setMessage("कृपया अपना मोबाइल नंबर दर्ज करें");
      return;
    }
    
    if (!/^\d{10}$/.test(formData.phone)) {
      setMessage("कृपया एक मान्य 10-अंकीय मोबाइल नंबर दर्ज करें");
      return;
    }
    
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
        <Link to="/helper-registration">
          <div className={styles["account-text"]}>
            अभी तक पंजीकृत नहीं हैं?{" "}
            <span className={styles["login-link"]}>सहायक के रूप में पंजीकरण करें</span>
          </div>
        </Link>
      </div>

      <div className={`${styles["form-container"]} signup-form-spacing`}>
        <h2>सहायक लॉगिन</h2>
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
                'सत्यापित करें'
              )}
            </button>
          )}
          {otpVerified && (
            <div className={styles["verified-indicator"]}>
              <CheckCircle size={20} className={styles["verified-icon"]} />
              सत्यापित
            </div>
          )}
        </div>
        
        {/* OTP verification section */}
        {otpSent && !otpVerified && (
          <div className={styles["otp-container"]}>
            <p className={styles["otp-instruction"]}>आपके फोन पर भेजा गया सत्यापन कोड दर्ज करें</p>
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
                disabled={!otpCode || otpCode.length < 6 || otpLoading}
                className={styles["verify-btn"]}
              >
                {otpLoading ? (
                  <span className={styles["btn-loading"]}>
                    <Loader2 className={styles["spin-icon"]} size={16} />
                    सत्यापित किया जा रहा है...
                  </span>
                ) : (
                  'जमा करें'
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
                कोड पुनः भेजें
              </button>
              {otpError && <p className={styles["error-message"]}>{otpError}</p>}
            </div>
          </div>
        )}

        {/* Name verification section */}
        {nameVerification && otpVerified && (
          <div className={styles["name-container"]}>
            <p className={styles["name-instruction"]}>सुरक्षा के लिए, कृपया अपना पहला नाम पंजीकृत के रूप में दर्ज करें</p>
            <div className={styles["name-input-group"]}>
              <input
                type="text"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                placeholder="अपना पहला नाम दर्ज करें"
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
                    सत्यापित किया जा रहा है...
                  </span>
                ) : (
                  'नाम सत्यापित करें'
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
          {loading ? "लॉगिन हो रहा है..." : otpVerified ? "जारी रखें" : "सत्यापन कोड भेजें"}
        </button>
        
        {message && <div className={styles["message"]}>{message}</div>}

        <div className={styles["register-link"]}>
          खाता नहीं है? <Link to="/helper-registration">यहां पंजीकरण करें</Link>
        </div>

      </div>
    </>
  );
};

export default HindiWorkerLogin;
