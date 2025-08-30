import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../LoginPage/Login.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from "../../store/AuthContext.jsx";

const HindiSignup = () => {
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = '';

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
        feedback = 'बहुत कमज़ोर';
        break;
      case 2:
        feedback = 'कमज़ोर';
        break;
      case 3:
        feedback = 'ठीक';
        break;
      case 4:
        feedback = 'अच्छा';
        break;
      case 5:
        feedback = 'मज़बूत';
        break;
      default:
        feedback = 'बहुत कमज़ोर';
    }

    return { score, feedback };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Password strength checking
    if (name === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }
    
    setFormData({ ...formData, [name]: value });
  };

  // Step 1: Send OTP
  const handleStep1 = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setMessage('कृपया सभी फ़ील्ड भरें');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup/step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage('आपके ईमेल पर OTP भेजा गया!');
        setStep(2);
      } else {
        setMessage(data.message || 'OTP भेजने में असफल।');
      }
    } catch (error) {
      setMessage('एक त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!formData.otp) {
      setMessage('कृपया OTP दर्ज करें');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp
        }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage('ईमेल सत्यापित! कृपया अपना पासवर्ड सेट करें।');
        setStep(3);
      } else {
        setMessage(data.message || 'गलत OTP।');
      }
    } catch (error) {
      setMessage('एक त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Complete signup (works for both regular and Google users)
  const handleStep2 = async () => {
    if (!formData.password || !formData.confirmPassword) {
      setMessage('कृपया सभी फ़ील्ड भरें');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('पासवर्ड मेल नहीं खाते');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup/step2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          firstName: formData.firstName,
          lastName: formData.lastName
        }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage('खाता सफलतापूर्वक बनाया गया!');
        setTimeout(() => navigate('/hi/login'), 2000);
      } else {
        setMessage(data.message || 'साइनअप असफल।');
      }
    } catch (error) {
      setMessage('एक त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage('आपके ईमेल पर OTP दोबारा भेजा गया!');
      } else {
        setMessage(data.message || 'OTP दोबारा भेजने में असफल।');
      }
    } catch (error) {
      setMessage('एक त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8080/api/auth/google/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: credentialResponse.credential
        }),
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        // Store Google user data temporarily and move to password setup
        setFormData({
          ...formData,
          firstName: data.user.firstName || data.user.name.split(' ')[0] || '',
          lastName: data.user.lastName || data.user.name.split(' ').slice(1).join(' ') || '',
          email: data.user.email
        });
        setMessage("Google खाता सत्यापित! साइनअप पूरा करने के लिए कृपया पासवर्ड सेट करें।");
        setStep(3); // Go directly to password setup step
      } else {
        setMessage(data.message || "Google साइनअप असफल।");
      }
    } catch (error) {
      console.error("Google signup error:", error);
      setMessage("Google साइनअप त्रुटि। कृपया पुनः प्रयास करें।");
    } finally {
      setIsLoading(false);
    }
  };

  // Make handleGoogleSignup available globally for the data-callback
  useEffect(() => {
    window.handleGoogleSignup = handleGoogleSignup;
    return () => {
      delete window.handleGoogleSignup;
    };
  }, []);

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
          callback: handleGoogleSignup,
          auto_select: false,
          cancel_on_tap_outside: true
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Step 1: User Details
  const renderStep1 = () => (
    <div className={`${styles['form-container']} signup-form-spacing`}>
      <h2>साइन अप</h2>
      <input
        type="text"
        name="firstName"
        className={styles['input-box']}
        placeholder="पहला नाम"
        value={formData.firstName}
        onChange={handleChange}
        disabled={isLoading}
      />
      <input
        type="text"
        name="lastName"
        className={styles['input-box']}
        placeholder="अंतिम नाम"
        value={formData.lastName}
        onChange={handleChange}
        disabled={isLoading}
      />
      <input
        type="email"
        name="email"
        className={styles['input-box']}
        placeholder="ईमेल"
        value={formData.email}
        onChange={handleChange}
        disabled={isLoading}
      />
      <button 
        className={styles['continue-btn']} 
        onClick={handleStep1}
        disabled={isLoading}
      >
        {isLoading ? 'भेजा जा रहा है...' : 'जारी रखें'}
      </button>
      {message && <p>{message}</p>}

      <div className={styles['separator']}>
        <span className={styles['line']}><hr /></span>
        या
        <span className={styles['line']}><hr /></span>
      </div>
      <div 
        id="g_id_onload"
        data-client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}
        data-context="signup"
        data-ux_mode="popup"
        data-callback="handleGoogleSignup"
        data-auto_prompt="false">
      </div>
      
      <div 
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signup_with"
        data-size="large"
        data-logo_alignment="left">
      </div>
      
      <div className={styles['terms']}>
        खाता बनाकर, आप हमारी <Link to="/hi/terms-and-services">सेवा की शर्तों</Link> और <Link to="/hi/privacy-policy">गोपनीयता नीति</Link> से सहमत हैं।
      </div>
    </div>
  );

  // Step 2: OTP Verification
  const renderStep2 = () => (
    <div className={`${styles['form-container']} signup-form-spacing`}>
      <h2>अपना ईमेल सत्यापित करें</h2>
      <p style={{ color: '#888', marginBottom: '20px', textAlign: 'center' }}>
        हमने {formData.email} पर एक सत्यापन कोड भेजा है
      </p>
      <input
        type="text"
        name="otp"
        className={styles['input-box']}
        placeholder="6-अंकीय कोड दर्ज करें"
        value={formData.otp}
        onChange={handleChange}
        maxLength="6"
        disabled={isLoading}
      />
      <button 
        className={styles['continue-btn']} 
        onClick={handleVerifyOtp}
        disabled={isLoading}
      >
        {isLoading ? 'सत्यापित कर रहे हैं...' : 'सत्यापित करें'}
      </button>
      {message && <p>{message}</p>}
      
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <button 
          onClick={handleResendOtp}
          disabled={isLoading}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#00d4aa', 
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          कोड दोबारा भेजें
        </button>
      </div>
    </div>
  );

  // Password strength indicator component
  const getPasswordStrengthColor = (score) => {
    switch (score) {
      case 0:
      case 1:
        return '#ff4757';
      case 2:
        return '#ff6b35';
      case 3:
        return '#f39c12';
      case 4:
        return '#2ed573';
      case 5:
        return '#20bf6b';
      default:
        return '#ddd';
    }
  };

  // Step 3: Password Setup
  const renderStep3 = () => (
    <div className={`${styles['form-container']} signup-form-spacing`}>
      <h2>अपना पासवर्ड सेट करें</h2>
      <p style={{ color: '#888', marginBottom: '20px', textAlign: 'center' }}>
        अपने खाते के लिए एक सुरक्षित पासवर्ड बनाएं
      </p>
      <div style={{ position: 'relative' }}>
        <input
          type="password"
          name="password"
          className={styles['input-box']}
          placeholder="पासवर्ड"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
        />
        {formData.password && (
          <div style={{ 
            marginTop: '8px', 
            display: 'flex', 
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{ 
              display: 'flex', 
              gap: '3px', 
              width: '100%'
            }}>
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  style={{
                    height: '4px',
                    flex: 1,
                    backgroundColor: level <= passwordStrength.score 
                      ? getPasswordStrengthColor(passwordStrength.score) 
                      : '#ddd',
                    borderRadius: '2px',
                    transition: 'background-color 0.3s'
                  }}
                />
              ))}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11px'
            }}>
              <span style={{ 
                color: getPasswordStrengthColor(passwordStrength.score),
                fontWeight: '500'
              }}>
                {passwordStrength.feedback}
              </span>
            </div>
          </div>
        )}
        {formData.password && (
          <div style={{ 
            fontSize: '11px', 
            color: '#666', 
            marginTop: '5px' 
          }}>
            पासवर्ड में होना चाहिए: बड़े अक्षर, छोटे अक्षर, संख्याएं, और विशेष वर्ण
          </div>
        )}
      </div>
      <input
        type="password"
        name="confirmPassword"
        className={styles['input-box']}
        placeholder="पासवर्ड की पुष्टि करें"
        value={formData.confirmPassword}
        onChange={handleChange}
        disabled={isLoading}
      />
      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
        <div style={{ 
          fontSize: '12px', 
          color: '#ff4757', 
          marginTop: '5px' 
        }}>
          पासवर्ड मेल नहीं खाते
        </div>
      )}
      <button 
        className={styles['continue-btn']} 
        onClick={handleStep2}
        disabled={isLoading}
      >
        {isLoading ? 'खाता बनाया जा रहा है...' : 'खाता बनाएं'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );

  return (
    <>
      <div className={styles['header-container']}>
        <Link to="/hi">
          <div className={styles['logo']}>Need<span>Station</span></div>
        </Link>
        <Link to="/hi/login">
          <div className={styles['account-text']}>
            पहले से खाता है? <span className={styles['login-link']}>लॉग इन करें</span>
          </div>
        </Link>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </>
  );
};

export default HindiSignup;
