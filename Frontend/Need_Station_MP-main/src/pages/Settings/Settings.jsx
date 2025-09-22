import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import styles from './Settings.module.css';
import { 
  FaBell, FaShieldAlt, FaUser, FaLanguage, FaCreditCard, FaEye,
  FaToggleOn, FaToggleOff, FaSave, FaTrash, FaDownload, FaLock,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaCog, FaQuestionCircle,
  FaSignOutAlt, FaExclamationTriangle, FaCheckCircle, FaMoon, FaSun
} from 'react-icons/fa';

const Settings = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('notifications');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    bookingReminders: true,
    serviceUpdates: true,
    promotionalEmails: false,
    weeklyDigest: true,
    
    // Privacy Settings
    profileVisibility: 'private',
    shareDataForImprovement: true,
    allowLocationTracking: true,
    showOnlineStatus: false,
    
    // Account Settings
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30',
    
    // Language & Accessibility
    language: 'English',
    theme: 'system',
    fontSize: 'medium',
    highContrast: false,
    
    // Payment Settings
    defaultPaymentMethod: 'card',
    autoPayment: false,
    savePaymentInfo: true,
    
    // Service Preferences
    autoBookingConfirmation: true,
    allowSubstitutes: true,
    requireBackgroundCheck: true,
    preferredServiceTime: 'morning',
    emergencyContactNotification: true
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
    // Implement save logic
    // Show success message
  };

  const handleDeleteAccount = () => {
    console.log('Deleting account');
    // Implement account deletion
    setShowDeleteConfirm(false);
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const handleExportData = () => {
    console.log('Exporting user data');
    // Implement data export
  };

  const settingSections = [
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'privacy', label: 'Privacy & Security', icon: FaShieldAlt },
    { id: 'account', label: 'Account Security', icon: FaLock },
    { id: 'language', label: 'Language & Display', icon: FaLanguage },
    { id: 'payment', label: 'Payment Settings', icon: FaCreditCard },
    { id: 'services', label: 'Service Preferences', icon: FaCog },
    { id: 'support', label: 'Help & Support', icon: FaQuestionCircle }
  ];

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className={styles.toggleItem}>
      <div className={styles.toggleInfo}>
        <label className={styles.toggleLabel}>{label}</label>
        {description && <p className={styles.toggleDescription}>{description}</p>}
      </div>
      <button
        className={`${styles.toggleSwitch} ${checked ? styles.toggleOn : styles.toggleOff}`}
        onClick={() => onChange(!checked)}
      >
        {checked ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
      </button>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className={styles.settingsContent}>
      <h2>Notification Preferences</h2>
      <p className={styles.sectionDescription}>
        Choose how you want to be notified about your bookings and account activity.
      </p>
      
      <div className={styles.settingsGroup}>
        <h3>Communication Channels</h3>
        <ToggleSwitch
          checked={settings.emailNotifications}
          onChange={(value) => handleSettingChange('emailNotifications', value)}
          label="Email Notifications"
          description="Receive notifications via email"
        />
        <ToggleSwitch
          checked={settings.smsNotifications}
          onChange={(value) => handleSettingChange('smsNotifications', value)}
          label="SMS Notifications"
          description="Receive important updates via SMS"
        />
        <ToggleSwitch
          checked={settings.pushNotifications}
          onChange={(value) => handleSettingChange('pushNotifications', value)}
          label="Push Notifications"
          description="Receive notifications in your browser"
        />
      </div>

      <div className={styles.settingsGroup}>
        <h3>Notification Types</h3>
        <ToggleSwitch
          checked={settings.bookingReminders}
          onChange={(value) => handleSettingChange('bookingReminders', value)}
          label="Booking Reminders"
          description="Get reminded about upcoming appointments"
        />
        <ToggleSwitch
          checked={settings.serviceUpdates}
          onChange={(value) => handleSettingChange('serviceUpdates', value)}
          label="Service Updates"
          description="Updates about your booked services"
        />
        <ToggleSwitch
          checked={settings.promotionalEmails}
          onChange={(value) => handleSettingChange('promotionalEmails', value)}
          label="Promotional Emails"
          description="Receive offers and promotional content"
        />
        <ToggleSwitch
          checked={settings.weeklyDigest}
          onChange={(value) => handleSettingChange('weeklyDigest', value)}
          label="Weekly Digest"
          description="Summary of your activity and recommendations"
        />
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className={styles.settingsContent}>
      <h2>Privacy & Security</h2>
      <p className={styles.sectionDescription}>
        Control your privacy settings and data sharing preferences.
      </p>

      <div className={styles.settingsGroup}>
        <h3>Profile Privacy</h3>
        <div className={styles.selectGroup}>
          <label>Profile Visibility</label>
          <select
            value={settings.profileVisibility}
            onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
            className={styles.selectInput}
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
          </select>
        </div>
        
        <ToggleSwitch
          checked={settings.showOnlineStatus}
          onChange={(value) => handleSettingChange('showOnlineStatus', value)}
          label="Show Online Status"
          description="Let others see when you're online"
        />
      </div>

      <div className={styles.settingsGroup}>
        <h3>Data & Location</h3>
        <ToggleSwitch
          checked={settings.shareDataForImprovement}
          onChange={(value) => handleSettingChange('shareDataForImprovement', value)}
          label="Share Data for Service Improvement"
          description="Help us improve our services with anonymous usage data"
        />
        <ToggleSwitch
          checked={settings.allowLocationTracking}
          onChange={(value) => handleSettingChange('allowLocationTracking', value)}
          label="Location Tracking"
          description="Allow location access for better service matching"
        />
      </div>

      <div className={styles.settingsGroup}>
        <h3>Data Management</h3>
        <div className={styles.actionButtons}>
          <button className={styles.actionButton} onClick={handleExportData}>
            <FaDownload /> Export My Data
          </button>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className={styles.settingsContent}>
      <h2>Account Security</h2>
      <p className={styles.sectionDescription}>
        Manage your account security and authentication settings.
      </p>

      <div className={styles.settingsGroup}>
        <h3>Authentication</h3>
        <ToggleSwitch
          checked={settings.twoFactorAuth}
          onChange={(value) => handleSettingChange('twoFactorAuth', value)}
          label="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
        />
        <ToggleSwitch
          checked={settings.loginAlerts}
          onChange={(value) => handleSettingChange('loginAlerts', value)}
          label="Login Alerts"
          description="Get notified when someone logs into your account"
        />
        
        <div className={styles.selectGroup}>
          <label>Session Timeout</label>
          <select
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
            className={styles.selectInput}
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="never">Never</option>
          </select>
        </div>
      </div>

      <div className={styles.settingsGroup}>
        <h3>Account Actions</h3>
        <div className={styles.actionButtons}>
          <button className={styles.actionButton}>
            <FaLock /> Change Password
          </button>
          <button 
            className={`${styles.actionButton} ${styles.logoutButton}`}
            onClick={() => setShowLogoutConfirm(true)}
          >
            <FaSignOutAlt /> Logout All Devices
          </button>
          <button 
            className={`${styles.actionButton} ${styles.dangerButton}`}
            onClick={() => setShowDeleteConfirm(true)}
          >
            <FaTrash /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderLanguageSettings = () => (
    <div className={styles.settingsContent}>
      <h2>Language & Display</h2>
      <p className={styles.sectionDescription}>
        Customize your language and display preferences.
      </p>

      <div className={styles.settingsGroup}>
        <h3>Language</h3>
        <div className={styles.selectGroup}>
          <label>Preferred Language</label>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
            className={styles.selectInput}
          >
            <option value="English">English</option>
            <option value="Hindi">हिंदी (Hindi)</option>
            <option value="Tamil">தமிழ் (Tamil)</option>
            <option value="Bengali">বাংলা (Bengali)</option>
            <option value="Telugu">తెలుగు (Telugu)</option>
            <option value="Marathi">मराठी (Marathi)</option>
            <option value="Gujarati">ગુજરાતી (Gujarati)</option>
            <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
            <option value="Malayalam">മലയാളം (Malayalam)</option>
          </select>
        </div>
      </div>

      <div className={styles.settingsGroup}>
        <h3>Display</h3>
        <div className={styles.selectGroup}>
          <label>Theme</label>
          <select
            value={settings.theme}
            onChange={(e) => handleSettingChange('theme', e.target.value)}
            className={styles.selectInput}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System Default</option>
          </select>
        </div>

        <div className={styles.selectGroup}>
          <label>Font Size</label>
          <select
            value={settings.fontSize}
            onChange={(e) => handleSettingChange('fontSize', e.target.value)}
            className={styles.selectInput}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra Large</option>
          </select>
        </div>

        <ToggleSwitch
          checked={settings.highContrast}
          onChange={(value) => handleSettingChange('highContrast', value)}
          label="High Contrast Mode"
          description="Increase contrast for better visibility"
        />
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className={styles.settingsContent}>
      <h2>Payment Settings</h2>
      <p className={styles.sectionDescription}>
        Manage your payment methods and billing preferences.
      </p>

      <div className={styles.settingsGroup}>
        <h3>Payment Preferences</h3>
        <div className={styles.selectGroup}>
          <label>Default Payment Method</label>
          <select
            value={settings.defaultPaymentMethod}
            onChange={(e) => handleSettingChange('defaultPaymentMethod', e.target.value)}
            className={styles.selectInput}
          >
            <option value="card">Credit/Debit Card</option>
            <option value="upi">UPI</option>
            <option value="wallet">Digital Wallet</option>
            <option value="netbanking">Net Banking</option>
            <option value="cash">Cash on Service</option>
          </select>
        </div>

        <ToggleSwitch
          checked={settings.autoPayment}
          onChange={(value) => handleSettingChange('autoPayment', value)}
          label="Auto Payment"
          description="Automatically pay for confirmed bookings"
        />
        
        <ToggleSwitch
          checked={settings.savePaymentInfo}
          onChange={(value) => handleSettingChange('savePaymentInfo', value)}
          label="Save Payment Information"
          description="Securely save payment methods for faster checkout"
        />
      </div>

      <div className={styles.settingsGroup}>
        <h3>Billing</h3>
        <div className={styles.actionButtons}>
          <button className={styles.actionButton}>
            <FaCreditCard /> Manage Payment Methods
          </button>
          <button className={styles.actionButton}>
            <FaDownload /> Download Invoices
          </button>
        </div>
      </div>
    </div>
  );

  const renderServiceSettings = () => (
    <div className={styles.settingsContent}>
      <h2>Service Preferences</h2>
      <p className={styles.sectionDescription}>
        Customize your service booking and provider preferences.
      </p>

      <div className={styles.settingsGroup}>
        <h3>Booking Preferences</h3>
        <ToggleSwitch
          checked={settings.autoBookingConfirmation}
          onChange={(value) => handleSettingChange('autoBookingConfirmation', value)}
          label="Auto Booking Confirmation"
          description="Automatically confirm bookings when providers accept"
        />
        
        <ToggleSwitch
          checked={settings.allowSubstitutes}
          onChange={(value) => handleSettingChange('allowSubstitutes', value)}
          label="Allow Substitute Providers"
          description="Allow alternative providers if your preferred one is unavailable"
        />

        <ToggleSwitch
          checked={settings.requireBackgroundCheck}
          onChange={(value) => handleSettingChange('requireBackgroundCheck', value)}
          label="Require Background Check"
          description="Only show providers with verified background checks"
        />

        <div className={styles.selectGroup}>
          <label>Preferred Service Time</label>
          <select
            value={settings.preferredServiceTime}
            onChange={(e) => handleSettingChange('preferredServiceTime', e.target.value)}
            className={styles.selectInput}
          >
            <option value="morning">Morning (6 AM - 12 PM)</option>
            <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
            <option value="evening">Evening (6 PM - 10 PM)</option>
            <option value="night">Night (10 PM - 6 AM)</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
      </div>

      <div className={styles.settingsGroup}>
        <h3>Emergency Settings</h3>
        <ToggleSwitch
          checked={settings.emergencyContactNotification}
          onChange={(value) => handleSettingChange('emergencyContactNotification', value)}
          label="Emergency Contact Notifications"
          description="Notify emergency contacts about critical health services"
        />
      </div>
    </div>
  );

  const renderSupportSettings = () => (
    <div className={styles.settingsContent}>
      <h2>Help & Support</h2>
      <p className={styles.sectionDescription}>
        Get help and support for your NeedStation account.
      </p>

      <div className={styles.settingsGroup}>
        <h3>Support Resources</h3>
        <div className={styles.supportLinks}>
          <a href="/help" className={styles.supportLink}>
            <FaQuestionCircle /> Help Center
          </a>
          <a href="/contact" className={styles.supportLink}>
            <FaPhone /> Contact Support
          </a>
          <a href="/feedback" className={styles.supportLink}>
            <FaEnvelope /> Send Feedback
          </a>
          <a href="/terms" className={styles.supportLink}>
            <FaShieldAlt /> Terms of Service
          </a>
          <a href="/privacy" className={styles.supportLink}>
            <FaLock /> Privacy Policy
          </a>
        </div>
      </div>

      <div className={styles.settingsGroup}>
        <h3>App Information</h3>
        <div className={styles.appInfo}>
          <div className={styles.infoItem}>
            <span>Version:</span>
            <span>2.1.0</span>
          </div>
          <div className={styles.infoItem}>
            <span>Last Updated:</span>
            <span>January 2024</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'notifications': return renderNotificationSettings();
      case 'privacy': return renderPrivacySettings();
      case 'account': return renderAccountSettings();
      case 'language': return renderLanguageSettings();
      case 'payment': return renderPaymentSettings();
      case 'services': return renderServiceSettings();
      case 'support': return renderSupportSettings();
      default: return renderNotificationSettings();
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsLayout}>
        {/* Sidebar */}
        <div className={styles.settingsSidebar}>
          <div className={styles.sidebarHeader}>
            <h2>Settings</h2>
          </div>
          <nav className={styles.settingsNav}>
            {settingSections.map(section => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  className={`${styles.navItem} ${activeSection === section.id ? styles.activeNavItem : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <IconComponent className={styles.navIcon} />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className={styles.settingsMain}>
          {renderContent()}
          
          {/* Save Button */}
          <div className={styles.saveSection}>
            <button className={styles.saveButton} onClick={handleSaveSettings}>
              <FaSave /> Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmModal}>
            <div className={styles.modalHeader}>
              <FaExclamationTriangle className={styles.warningIcon} />
              <h3>Delete Account</h3>
            </div>
            <div className={styles.modalContent}>
              <p>Are you sure you want to delete your account? This action cannot be undone.</p>
              <p><strong>All your data, bookings, and preferences will be permanently deleted.</strong></p>
            </div>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.deleteButton}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmModal}>
            <div className={styles.modalHeader}>
              <FaSignOutAlt className={styles.logoutIcon} />
              <h3>Logout All Devices</h3>
            </div>
            <div className={styles.modalContent}>
              <p>This will log you out from all devices where you're currently signed in.</p>
            </div>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                Logout All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
