import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../LoginPage/Login.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../../store/AuthContext.jsx";

const HindiLogin = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ emailOrContact: "", otp: "" });
  const [contactType, setContactType] = useState("email"); // "email" or "phone"
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we have redirection info from service pages
  const redirectPath = location.state?.redirectAfterLogin || "/hi";
  const serviceData = location.state?.serviceData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVerify = async () => {
    if (!formData.emailOrContact) {
      setMessage('कृपया अपना ईमेल या फोन नंबर दर्ज करें');
      return;
    }

    setIsVerifying(true);
    try {
      // Send OTP to email/phone
      const response = await fetch("http://localhost:8080/api/auth/send-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: contactType === 'email' ? formData.emailOrContact : null,
          phone: contactType === 'phone' ? formData.emailOrContact : null,
          contactType: contactType
        }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage(`आपके ${contactType === 'email' ? 'ईमेल' : 'फोन'} पर OTP भेजा गया!`);
        setShowOtpField(true);
      } else {
        setMessage(data.message || "OTP भेजने में विफल।");
      }
    } catch (error) {
      setMessage("एक त्रुटि हुई। कृपया पुनः प्रयास करें।");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogin = async () => {
    if (!formData.otp) {
      setMessage('कृपया OTP दर्ज करें');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/verify-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: contactType === 'email' ? formData.emailOrContact : null,
          phone: contactType === 'phone' ? formData.emailOrContact : null,
          otp: formData.otp,
          contactType: contactType
        }),
      });
      const data = await response.json();
      
      console.log("🔍 Login response:", data);
      console.log("🔍 User data from backend:", data.user);
      
      if (response.ok && data.success) {
        setMessage("लॉगिन सफल!");
        // Use first name for greeting, fallback to username or email
        const displayName = data.user.firstName || data.user.username || data.user.email?.split("@")[0] || "User";
        
        console.log("🔍 Extracted data:", {
          displayName,
          userId: data.user.id,
          token: data.accessToken || data.token,
          email: data.user.email,
          phone: data.user.phone || data.user.contactNumber
        });
        
        // Store user data BEFORE calling login
        const token = data.accessToken || data.token; // Support both accessToken and token
        localStorage.setItem("token", token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("workerId", data.user.id);
        localStorage.setItem("username", displayName);
        localStorage.setItem("userEmail", data.user.email || '');
        localStorage.setItem("userPhone", data.user.phone || data.user.contactNumber || '');
        
        // Call login with additional user data
        login(displayName, {
          id: data.user.id,
          userId: data.user.id,
          email: data.user.email,
          phone: data.user.phone || data.user.contactNumber,
          token: token
        });
        
        // If we came from a service page, redirect to user-details with the service data
        if (redirectPath === '/user-details' && serviceData) {
          navigate(redirectPath, { state: serviceData });
        } else {
          navigate("/hi");
        }
      } else {
        setMessage(data.message || "अमान्य OTP या लॉगिन विफल।");
      }
    } catch (error) {
      setMessage("एक त्रुटि हुई। कृपया पुनः प्रयास करें।");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: credentialResponse.credential
        }),
      });
      
      const data = await response.json();
      
      console.log("🔍 Google login response:", data);
      console.log("🔍 Google user data:", data.user);
      
      if (response.ok && data.success) {
        setMessage("Google लॉगिन सफल!");
        const displayName = `${data.user.firstName} ${data.user.lastName}`.trim();
        
        // Store user data BEFORE calling login (same as manual login)
        const googleToken = data.accessToken || data.token; // Support both accessToken and token
        localStorage.setItem("token", googleToken);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("workerId", data.user.id);
        localStorage.setItem("username", displayName);
        localStorage.setItem("userEmail", data.user.email || '');
        localStorage.setItem("userPhone", data.user.phone || data.user.contactNumber || '');
        
        // Call login with additional user data (same as manual login)
        login(displayName, {
          id: data.user.id,
          userId: data.user.id,
          email: data.user.email,
          phone: data.user.phone || data.user.contactNumber,
          token: googleToken,
          firstName: data.user.firstName,
          lastName: data.user.lastName
        });
        
        console.log("✅ Google login data stored:", {
          userId: data.user.id,
          token: data.token,
          email: data.user.email
        });
        
        // If we came from a service page, redirect to user-details with the service data
        if (redirectPath === '/user-details' && serviceData) {
          navigate(redirectPath, { state: serviceData });
        } else {
          navigate("/hi");
        }
      } else {
        setMessage(data.message || "Google लॉगिन विफल।");
      }
    } catch (error) {
      setMessage("Google लॉगिन त्रुटि। कृपया पुनः प्रयास करें।");
    }
  };

  useEffect(() => {
    // Set up global callback function
    window.handleGoogleResponse = handleGoogleLogin;
    
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleLogin,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false
          });
          
          // Render the sign-in button
          setTimeout(() => {
            const buttonContainer = document.querySelector('.g_id_signin');
            if (buttonContainer) {
              window.google.accounts.id.renderButton(buttonContainer, {
                type: 'standard',
                shape: 'rectangular',
                theme: 'outline',
                text: 'continue_with',
                size: 'medium',
                logo_alignment: 'left'
              });
            }
          }, 100);
        } catch (error) {
          console.error('Google Sign-In initialization error:', error);
        }
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      // Clean up global callback
      delete window.handleGoogleResponse;
    };
  }, []);

  return (
    <>
      <div className={styles["header-container"]}>
        <Link to="/hi">
          <div className={styles["logo"]}>
            Need<span>Station</span>
          </div>
        </Link>
        <Link to="/hi/signup">
          <div className={styles["account-text"]}>
            खाता नहीं है?{" "}
            <span className={styles["login-link"]}>साइन अप करें</span>
          </div>
        </Link>
      </div>

      <div className={`${styles["form-container"]} signup-form-spacing`}>
        <h2>लॉगिन</h2>
        
        {/* Contact Type Toggle */}
        <div className={styles["toggle-container"]}>
          <button
            type="button"
            className={`${styles["toggle-btn"]} ${contactType === "email" ? styles["active"] : ""}`}
            onClick={() => setContactType("email")}
          >
            ईमेल
          </button>
          <button
            type="button"
            className={`${styles["toggle-btn"]} ${contactType === "phone" ? styles["active"] : ""}`}
            onClick={() => setContactType("phone")}
          >
            फोन
          </button>
        </div>
        
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <input
            type="text"
            name="emailOrContact"
            className={styles["input-box"]}
            placeholder={contactType === "email" ? "ईमेल" : "फोन नंबर"}
            value={formData.emailOrContact}
            onChange={handleChange}
            disabled={showOtpField}
            style={{ marginBottom: 0, paddingRight: showOtpField ? '15px' : '80px' }}
          />
          {!showOtpField && (
            <button 
              onClick={handleVerify}
              disabled={isVerifying || !formData.emailOrContact}
              style={{
                position: 'absolute',
                right: '8px',
                padding: '6px 12px',
                backgroundColor: '#26D0CE',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
                opacity: (!formData.emailOrContact || isVerifying) ? 0.6 : 1
              }}
            >
              {isVerifying ? 'भेजा जा रहा है...' : 'सत्यापित करें'}
            </button>
          )}
        </div>
        
        {showOtpField && (
          <div>
            <input
              type="text"
              name="otp"
              className={styles["input-box"]}
              placeholder="OTP दर्ज करें"
              value={formData.otp}
              onChange={handleChange}
              maxLength="6"
              disabled={isLoading}
            />
            <div style={{ textAlign: 'right', marginTop: '5px' }}>
              <button
                type="button"
                onClick={handleVerify}
                disabled={isVerifying}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#26D0CE',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  opacity: isVerifying ? 0.6 : 1
                }}
              >
                {isVerifying ? 'पुनः भेजा जा रहा है...' : 'OTP पुनः भेजें'}
              </button>
            </div>
          </div>
        )}
        
        <button 
          className={styles["continue-btn"]} 
          onClick={showOtpField ? handleLogin : handleVerify} 
          disabled={isLoading || isVerifying || (!showOtpField && !formData.emailOrContact) || (showOtpField && !formData.otp)}
        >
          {isLoading ? 'लॉगिन हो रहा है...' : isVerifying ? 'OTP भेजा जा रहा है...' : showOtpField ? 'लॉगिन' : 'OTP भेजें'}
        </button>
        {message && <p>{message}</p>}
        <div className={styles["separator"]}>
          <span className={styles["line"]}>
            <hr />
          </span>
          या
          <span className={styles["line"]}>
            <hr />
          </span>
        </div>
        <div 
          id="g_id_onload"
          data-client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
          data-context="signin"
          data-ux_mode="popup"
          data-callback="handleGoogleResponse"
          data-auto_prompt="false"
          data-use_fedcm_for_prompt="false">
        </div>
        
        <div 
          className="g_id_signin"
          data-type="standard"
          data-shape="rectangular"
          data-theme="outline"
          data-text="continue_with"
          data-size="large"
          data-logo_alignment="left">
        </div>
        
        <div className={styles['terms']}>
          लॉगिन करके, आप हमारी <Link to="/hi/terms-and-services">सेवा की शर्तों</Link> और <Link to="/hi/privacy-policy">गोपनीयता नीति</Link> से सहमत हैं।
        </div>
      </div>
    </>
  );
};

export default HindiLogin;
