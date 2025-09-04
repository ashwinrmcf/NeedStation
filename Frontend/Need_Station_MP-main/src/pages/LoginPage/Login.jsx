import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../store/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ emailOrContact: "", password: "" });
  const [contactType, setContactType] = useState("email"); // "email" or "phone"
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we have redirection info from service pages
  const redirectPath = location.state?.redirectAfterLogin || "/";
  const serviceData = location.state?.serviceData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    try {
      const loginData = {
        ...formData,
        contactType: contactType
      };
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        const displayName = data.displayName || data.username;
        login(displayName);
        localStorage.setItem("username", displayName);
        
        // If we came from a service page, redirect to user-details with the service data
        if (redirectPath === '/user-details' && serviceData) {
          navigate(redirectPath, { state: serviceData });
        } else {
          navigate("/");
        }
      } else {
        setMessage(data.message || "Login failed.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
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
                width: '100%'
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
        
        <input
          type="text"
          name="emailOrContact"
          className={styles["input-box"]}
          placeholder={contactType === "email" ? "Email" : "Phone Number"}
          value={formData.emailOrContact}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          className={styles["input-box"]}
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button className={styles["continue-btn"]} onClick={handleLogin}>
          Continue
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
