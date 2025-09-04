import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../LoginPage/Login.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from "../../store/AuthContext.jsx";

const Signup = () => {
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [contactType, setContactType] = useState('email'); // 'email' or 'phone'
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
        feedback = 'Very Weak';
        break;
      case 2:
        feedback = 'Weak';
        break;
      case 3:
        feedback = 'Fair';
        break;
      case 4:
        feedback = 'Good';
        break;
      case 5:
        feedback = 'Strong';
        break;
      default:
        feedback = 'Very Weak';
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
    const contactValue = contactType === 'email' ? formData.email : formData.phone;
    if (!formData.firstName || !formData.lastName || !contactValue) {
      setMessage('Please fill in all fields');
      return;
    }

    if (contactType === 'phone' && !/^[6-9]\d{9}$/.test(formData.phone)) {
      setMessage('Please enter a valid 10-digit phone number');
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
          email: contactType === 'email' ? formData.email : null,
          phone: contactType === 'phone' ? formData.phone : null,
          contactType: contactType
        }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage(`OTP sent to your ${contactType}!`);
        setStep(2);
      } else {
        setMessage(data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!formData.otp) {
      setMessage('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: contactType === 'email' ? formData.email : null,
          phone: contactType === 'phone' ? formData.phone : null,
          otp: formData.otp,
          contactType: contactType
        }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage(`${contactType === 'email' ? 'Email' : 'Phone'} verified! Please set your password.`);
        setStep(3);
      } else {
        setMessage(data.message || 'Invalid OTP.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Complete signup (works for both regular and Google users)
  const handleStep2 = async () => {
    if (!formData.password || !formData.confirmPassword) {
      setMessage('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup/step2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: contactType === 'email' ? formData.email : null,
          phone: contactType === 'phone' ? formData.phone : null,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          firstName: formData.firstName,
          lastName: formData.lastName,
          contactType: contactType
        }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage('Account created successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage(data.message || 'Signup failed.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
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
        setMessage(`OTP resent to your ${contactType}!`);
      } else {
        setMessage(data.message || 'Failed to resend OTP.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
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
        setMessage("Google account verified! Please set a password to complete signup.");
        setStep(3); // Go directly to password setup step
      } else {
        setMessage(data.message || "Google signup failed.");
      }
    } catch (error) {
      console.error("Google signup error:", error);
      setMessage("Google signup error. Please try again.");
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
      <h2>Sign up</h2>
      <input
        type="text"
        name="firstName"
        className={styles['input-box']}
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        disabled={isLoading}
      />
      <input
        type="text"
        name="lastName"
        className={styles['input-box']}
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
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
            Email
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
            Phone
          </button>
        </div>
        
        {contactType === 'email' ? (
          <input
            type="email"
            name="email"
            className={styles['input-box']}
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
        ) : (
          <input
            type="tel"
            name="phone"
            className={styles['input-box']}
            placeholder="Phone Number (10 digits)"
            value={formData.phone}
            onChange={handleChange}
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
        {isLoading ? 'Sending...' : 'Continue'}
      </button>
      {message && <p>{message}</p>}

      <div className={styles['separator']}>
        <span className={styles['line']}><hr /></span>
        or
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
        By creating an account, you agree to our <Link to="/terms-and-services">Terms of Service</Link> and <Link to="/privacy-policy">Privacy Policy</Link>.
      </div>
    </div>
  );

  // Step 2: OTP Verification
  const renderStep2 = () => (
    <div className={`${styles['form-container']} signup-form-spacing`}>
      <h2>Verify your email</h2>
      <p style={{ color: '#888', marginBottom: '20px', textAlign: 'center' }}>
        We sent a verification code to {contactType === 'email' ? formData.email : formData.phone}
      </p>
      <input
        type="text"
        name="otp"
        className={styles['input-box']}
        placeholder="Enter 6-digit code"
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
        {isLoading ? 'Verifying...' : 'Verify'}
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
          Resend code
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
      <h2>Set your password</h2>
      <p style={{ color: '#888', marginBottom: '20px', textAlign: 'center' }}>
        Create a secure password for your account
      </p>
      <div style={{ position: 'relative' }}>
        <input
          type="password"
          name="password"
          className={styles['input-box']}
          placeholder="Password"
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
            Password should contain: uppercase, lowercase, numbers, and special characters
          </div>
        )}
      </div>
      <input
        type="password"
        name="confirmPassword"
        className={styles['input-box']}
        placeholder="Confirm Password"
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
          Passwords do not match
        </div>
      )}
      <button 
        className={styles['continue-btn']} 
        onClick={handleStep2}
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );

  return (
    <>
      <div className={styles['header-container']}>
        <Link to="/">
          <div className={styles['logo']}>Need<span>Station</span></div>
        </Link>
        <Link to="/login">
          <div className={styles['account-text']}>
            Already have an account? <span className={styles['login-link']}>Log in</span>
          </div>
        </Link>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </>
  );
};

export default Signup;
