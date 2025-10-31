import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../LoginPage/Login.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from "../../../store/AuthContext.jsx";

const HindiSignup = () => {
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    otp: ''
  });
  const [contactType, setContactType] = useState('email'); // 'email' or 'phone'
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleStep1 = async () => {
    const contactValue = contactType === 'email' ? formData.email : formData.phone;
    if (!formData.fullName || !contactValue) {
      setMessage('कृपया सभी फ़ील्ड भरें');
      return;
    }

    // Split full name into first and last name for backend compatibility
    const nameParts = formData.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup/step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: contactType === 'email' ? formData.email : null,
          phone: contactType === 'phone' ? formData.phone : null,
          contactType: contactType
        }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage(`आपके ${contactType === 'email' ? 'ईमेल' : 'फोन'} पर OTP भेजा गया!`);
        setStep(2);
      } else {
        setMessage(data.message || 'OTP भेजने में विफल।');
      }
    } catch (error) {
      setMessage('एक त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP and create account directly
  const handleVerifyOtp = async () => {
    if (!formData.otp) {
      setMessage('कृपया OTP दर्ज करें');
      return;
    }

    // Split full name into first and last name for backend compatibility
    const nameParts = formData.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    setIsLoading(true);
    try {
      // First verify the OTP
      const verifyResponse = await fetch('http://localhost:8080/api/auth/signup/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: contactType === 'email' ? formData.email : null,
          phone: contactType === 'phone' ? formData.phone : null,
          otp: formData.otp,
          contactType: contactType
        }),
      });
      const verifyData = await verifyResponse.json();
      
      if (!verifyResponse.ok || !verifyData.success) {
        setMessage(verifyData.message || 'अमान्य OTP।');
        setIsLoading(false);
        return;
      }

      // If OTP is valid, create account directly with a default password
      const createAccountResponse = await fetch('http://localhost:8080/api/auth/signup/step2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: contactType === 'email' ? formData.email : null,
          phone: contactType === 'phone' ? formData.phone : null,
          password: 'tempPassword123!', // Temporary password - user can change later
          confirmPassword: 'tempPassword123!',
          contactType: contactType
        }),
      });
      const createData = await createAccountResponse.json();
      
      if (createAccountResponse.ok && createData.success) {
        // Auto-login after successful signup
        const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: contactType === 'email' ? formData.email : formData.phone,
            password: 'tempPassword123!'
          }),
        });
        
        const loginData = await loginResponse.json();
        
        if (loginResponse.ok && loginData.success) {
          // Store login data
          localStorage.setItem('token', loginData.token);
          localStorage.setItem('userId', loginData.user.id);
          localStorage.setItem('workerId', loginData.user.id);
          localStorage.setItem('username', loginData.user.username);
          localStorage.setItem('userEmail', loginData.user.email || '');
          localStorage.setItem('userPhone', loginData.user.phone || '');
          
          setMessage('खाता बनाया गया और लॉगिन सफल! डैशबोर्ड पर रीडायरेक्ट किया जा रहा है...');
          setTimeout(() => navigate('/hi'), 2000);
        } else {
          setMessage('खाता सफलतापूर्वक बनाया गया! कृपया मैन्युअल रूप से लॉगिन करें।');
          setTimeout(() => navigate('/hi/login'), 2000);
        }
      } else {
        setMessage(createData.message || 'खाता बनाने में विफल।');
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
        body: JSON.stringify({ 
          email: contactType === 'email' ? formData.email : null,
          phone: contactType === 'phone' ? formData.phone : null,
          contactType: contactType 
        }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage(`आपके ${contactType === 'email' ? 'ईमेल' : 'फोन'} पर OTP पुनः भेजा गया!`);
      } else {
        setMessage(data.message || 'OTP पुनः भेजने में विफल।');
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
        // Store login data from Google signup response
        if (data.token && data.user) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.user.id);
          localStorage.setItem('workerId', data.user.id);
          localStorage.setItem('username', data.user.username);
          localStorage.setItem('userEmail', data.user.email || '');
          localStorage.setItem('userPhone', data.user.phone || '');
          
          setMessage("Google खाता बनाया गया और लॉगिन सफल! डैशबोर्ड पर रीडायरेक्ट किया जा रहा है...");
          setTimeout(() => navigate('/hi'), 2000);
        } else {
          setMessage("Google खाता सफलतापूर्वक बनाया गया! लॉगिन पर रीडायरेक्ट किया जा रहा है...");
          setTimeout(() => navigate('/hi/login'), 2000);
        }
      } else {
        setMessage(data.message || "Google साइनअप विफल।");
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
          client_id: "371371610049-bh10hbvhbtij5qa8r3f0srjdeseisqr0.apps.googleusercontent.com",
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
      <h2>साइन अप करें</h2>
      <input
        type="text"
        name="fullName"
        className={styles['input-box']}
        placeholder="पूरा नाम"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        disabled={isLoading}
      />
      
      {/* Contact Type Toggle */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ 
          display: 'flex', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '8px', 
          padding: '4px',
          marginBottom: '10px'
        }}>
          <button
            type="button"
            onClick={() => setContactType('email')}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: contactType === 'email' ? '#26D0CE' : 'transparent',
              color: contactType === 'email' ? 'white' : '#666',
              fontWeight: contactType === 'email' ? '500' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            ईमेल
          </button>
          <button
            type="button"
            onClick={() => setContactType('phone')}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: contactType === 'phone' ? '#26D0CE' : 'transparent',
              color: contactType === 'phone' ? 'white' : '#666',
              fontWeight: contactType === 'phone' ? '500' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            फोन
          </button>
        </div>
        
        {contactType === 'email' ? (
          <input
            type="email"
            name="email"
            className={styles['input-box']}
            placeholder="ईमेल"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
            disabled={isLoading}
          />
        ) : (
          <input
            type="tel"
            name="phone"
            className={styles['input-box']}
            placeholder="फोन नंबर (10 अंक)"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
            disabled={isLoading}
            maxLength="10"
          />
        )}
      </div>
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
        data-client_id="371371610049-bh10hbvhbtij5qa8r3f0srjdeseisqr0.apps.googleusercontent.com"
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
        data-size="medium"
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
      <h2>अपना {contactType === 'email' ? 'ईमेल' : 'फोन'} सत्यापित करें</h2>
      <p style={{ color: '#888', marginBottom: '20px', textAlign: 'center' }}>
        हमने {contactType === 'email' ? formData.email : formData.phone} पर एक सत्यापन कोड भेजा है
      </p>
      <input
        type="text"
        name="otp"
        className={styles['input-box']}
        placeholder="6-अंकीय कोड दर्ज करें"
        value={formData.otp}
        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        maxLength="6"
        disabled={isLoading}
      />
      <button 
        className={styles['continue-btn']} 
        onClick={handleVerifyOtp}
        disabled={isLoading}
      >
        {isLoading ? 'सत्यापित किया जा रहा है...' : 'सत्यापित करें'}
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
          कोड पुनः भेजें
        </button>
      </div>
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
    </>
  );
};

export default HindiSignup;
