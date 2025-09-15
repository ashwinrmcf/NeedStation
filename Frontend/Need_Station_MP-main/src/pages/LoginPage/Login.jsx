import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../store/AuthContext.jsx";

const Login = () => {
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
  const redirectPath = location.state?.redirectAfterLogin || "/";
  const serviceData = location.state?.serviceData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVerify = async () => {
    if (!formData.emailOrContact) {
      setMessage('Please enter your email or phone number');
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
        setMessage(`OTP sent to your ${contactType}!`);
        setShowOtpField(true);
      } else {
        setMessage(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogin = async () => {
    if (!formData.otp) {
      setMessage('Please enter the OTP');
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
      
      if (response.ok && data.success) {
        setMessage("Login successful!");
        // Use first name for greeting, fallback to username or email
        const displayName = data.user.firstName || data.user.username || data.user.email?.split("@")[0] || "User";
        login(displayName);
        
        // Store user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("workerId", data.user.id);
        localStorage.setItem("username", displayName);
        localStorage.setItem("userEmail", data.user.email || '');
        localStorage.setItem("userPhone", data.user.phone || '');
        
        // If we came from a service page, redirect to user-details with the service data
        if (redirectPath === '/user-details' && serviceData) {
          navigate(redirectPath, { state: serviceData });
        } else {
          navigate("/");
        }
      } else {
        setMessage(data.message || "Invalid OTP or login failed.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
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
      if (response.ok && data.success) {
        setMessage("Google login successful!");
        const displayName = `${data.user.firstName} ${data.user.lastName}`.trim();
        login(displayName);
        localStorage.setItem("username", displayName);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("authToken", data.token);
        
        // If we came from a service page, redirect to user-details with the service data
        if (redirectPath === '/user-details' && serviceData) {
          navigate(redirectPath, { state: serviceData });
        } else {
          navigate("/");
        }
      } else {
        setMessage(data.message || "Google login failed.");
      }
    } catch (error) {
      setMessage("Google login error. Please try again.");
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
                size: 'large',
                logo_alignment: 'left',
                width: 400
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
        <Link to="/">
          <div className={styles["logo"]}>
            Need<span>Station</span>
          </div>
        </Link>
        <Link to="/signup">
          <div className={styles["account-text"]}>
            Don't have an account?{" "}
            <span className={styles["login-link"]}>Sign Up</span>
          </div>
        </Link>
      </div>

      <div className={`${styles["form-container"]} signup-form-spacing`}>
        <h2>Login</h2>
        
        {/* Contact Type Toggle */}
        <div className={styles["toggle-container"]}>
          <button
            type="button"
            className={`${styles["toggle-btn"]} ${contactType === "email" ? styles["active"] : ""}`}
            onClick={() => setContactType("email")}
          >
            Email
          </button>
          <button
            type="button"
            className={`${styles["toggle-btn"]} ${contactType === "phone" ? styles["active"] : ""}`}
            onClick={() => setContactType("phone")}
          >
            Phone
          </button>
        </div>
        
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <input
            type="text"
            name="emailOrContact"
            className={styles["input-box"]}
            placeholder={contactType === "email" ? "Email" : "Phone Number"}
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
              {isVerifying ? 'Sending...' : 'Verify'}
            </button>
          )}
        </div>
        
        {showOtpField && (
          <div>
            <input
              type="text"
              name="otp"
              className={styles["input-box"]}
              placeholder="Enter OTP"
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
                {isVerifying ? 'Resending...' : 'Resend OTP'}
              </button>
            </div>
          </div>
        )}
        
        <button 
          className={styles["continue-btn"]} 
          onClick={showOtpField ? handleLogin : handleVerify} 
          disabled={isLoading || isVerifying || (!showOtpField && !formData.emailOrContact) || (showOtpField && !formData.otp)}
        >
          {isLoading ? 'Logging in...' : isVerifying ? 'Sending OTP...' : showOtpField ? 'Login' : 'Send OTP'}
        </button>
        {message && <p>{message}</p>}
        <div className={styles["separator"]}>
          <span className={styles["line"]}>
            <hr />
          </span>
          or
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
          By logging in, you agree to our <Link to="/terms-and-services">Terms of Service</Link> and <Link to="/privacy-policy">Privacy Policy</Link>.
        </div>
        
        {/* <button className={`${styles["social-btn"]} ${styles["facebook-btn"]}`}>
          Continue with Facebook
        </button> */}
      </div>
    </>
  );
};

export default Login;
