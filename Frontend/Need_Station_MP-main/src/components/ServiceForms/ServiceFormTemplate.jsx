import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../pages/BasicNeeds/BasicNeedsServiceUserDescription.module.css";
import { getServiceUrlPath } from "../../data/ServiceConfigurations";
import { 
  FaUser, FaHeart, FaMedkit, FaCog, FaShieldAlt, 
  FaClock, FaUsers, FaClipboardList, FaStar,
  FaHome, FaBaby, FaWheelchair, FaStethoscope,
  FaPills, FaChartLine, FaUserMd
} from "react-icons/fa";

const ServiceFormTemplate = ({ 
  serviceConfig, 
  serviceName, 
  onDataChange, 
  initialData = {} 
}) => {
  const [formData, setFormData] = useState(initialData);
  const [commonData, setCommonData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Local storage key for persistence
  const FORM_DATA_KEY = `needstation_${serviceName.toLowerCase().replace(/\s+/g, '_')}_unique_data`;

  // Icon mapping for different field types
  const getIconForSection = (sectionKey) => {
    const iconMap = {
      patient_info: FaUser,
      patient_details: FaUser,
      care_requirements: FaHeart,
      nursing_requirements: FaStethoscope,
      medical_conditions: FaMedkit,
      medical_equipment: FaCog,
      preferences: FaStar,
      doctor_details: FaUserMd,
      household_info: FaHome,
      caretaker_duties: FaUsers,
      specific_requirements: FaClipboardList,
      patient_condition: FaWheelchair,
      care_intensity: FaHeart,
      support_equipment: FaCog,
      disease_stage: FaChartLine,
      current_management: FaPills,
      specific_challenges: FaMedkit,
      condition_details: FaMedkit,
      therapy_requirements: FaStethoscope,
      mobility_status: FaWheelchair,
      property_details: FaHome,
      security_requirements: FaShieldAlt,
      specific_duties: FaClipboardList,
      guard_specifications: FaUsers,
      baby_details: FaBaby,
      mother_details: FaUser,
      care_preferences: FaHeart,
      specific_needs: FaClipboardList,
      paralysis_type: FaWheelchair,
      functional_status: FaUser,
      rehabilitation_plan: FaStethoscope,
      test_requirements: FaMedkit,
      service_preferences: FaCog,
      diabetes_profile: FaChartLine,
      monitoring_needs: FaClock,
      complications: FaMedkit,
      lifestyle_factors: FaUser,
      patient_demographics: FaUser,
      checkup_preferences: FaHeart,
      medical_history: FaMedkit,
      surgery_details: FaUserMd,
      post_op_requirements: FaMedkit,
      recovery_status: FaChartLine,
      home_care_needs: FaHome
    };
    return iconMap[sectionKey] || FaClipboardList;
  };

  // Load data from localStorage and location state on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem(FORM_DATA_KEY);
    
    if (savedFormData) {
      try {
        const parsedFormData = JSON.parse(savedFormData);
        setFormData(parsedFormData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }

    // Get common data from navigation state
    if (location.state?.commonData) {
      setCommonData(location.state.commonData);
    }
  }, [location.state, FORM_DATA_KEY]);

  // Notify parent component when data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let updatedValue = value;
    if (type === 'checkbox') {
      // Handle checkbox arrays
      const currentValues = formData[name] || [];
      if (checked) {
        updatedValue = [...currentValues, value];
      } else {
        updatedValue = currentValues.filter(v => v !== value);
      }
    }
    
    const updatedFormData = {
      ...formData,
      [name]: updatedValue
    };
    setFormData(updatedFormData);
    
    // Save to localStorage
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(updatedFormData));
  };

  const renderField = (fieldKey, fieldConfig, sectionKey) => {
    const fieldName = `${sectionKey}_${fieldKey}`;
    const fieldValue = formData[fieldName] || '';

    // Handle different field types
    if (Array.isArray(fieldConfig)) {
      // Multiple choice checkboxes
      return (
        <div key={fieldName} style={{ marginBottom: "20px" }}>
          <label style={{ 
            color: "#5CE1E6", 
            fontSize: "16px", 
            fontWeight: "600", 
            display: "block", 
            marginBottom: "12px",
            textShadow: "0 0 10px rgba(92, 225, 230, 0.3)"
          }}>
            {fieldKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
            {fieldConfig.map((option) => (
              <label key={option} style={{ 
                display: "flex", 
                alignItems: "center", 
                color: "white", 
                fontSize: "14px",
                cursor: "pointer"
              }}>
                <input
                  type="checkbox"
                  name={fieldName}
                  value={option}
                  checked={(formData[fieldName] || []).includes(option)}
                  onChange={handleInputChange}
                  style={{ marginRight: "8px" }}
                />
                {option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </label>
            ))}
          </div>
        </div>
      );
    }

    if (typeof fieldConfig === 'string' && fieldConfig.includes('/')) {
      // Dropdown select
      const options = fieldConfig.split('/');
      return (
        <div key={fieldName} style={{ marginBottom: "20px" }}>
          <label style={{ 
            color: "#5CE1E6", 
            fontSize: "16px", 
            fontWeight: "600", 
            display: "block", 
            marginBottom: "12px",
            textShadow: "0 0 10px rgba(92, 225, 230, 0.3)"
          }}>
            {fieldKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </label>
          <select
            name={fieldName}
            value={fieldValue}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "18px 20px",
              fontSize: "16px",
              border: "2px solid rgba(92, 225, 230, 0.2)",
              borderRadius: "15px",
              backgroundColor: "rgba(26, 26, 26, 0.8)",
              color: "white",
              outline: "none",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
              boxShadow: "inset 0 2px 10px rgba(0,0,0,0.3)",
              cursor: "pointer"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#5CE1E6";
              e.target.style.boxShadow = "inset 0 2px 10px rgba(0,0,0,0.3), 0 0 20px rgba(92, 225, 230, 0.3)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(92, 225, 230, 0.2)";
              e.target.style.boxShadow = "inset 0 2px 10px rgba(0,0,0,0.3)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            <option value="">Select {fieldKey.replace(/_/g, ' ')}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
      );
    }

    // Handle different input types
    let inputType = "text";
    let placeholder = `Enter ${fieldKey.replace(/_/g, ' ')}`;
    
    if (fieldConfig === "number") {
      inputType = "number";
    } else if (fieldConfig === "date") {
      inputType = "date";
    } else if (fieldConfig === "phone") {
      inputType = "tel";
      placeholder = "Enter phone number";
    } else if (fieldConfig === "email") {
      inputType = "email";
      placeholder = "Enter email address";
    } else if (fieldConfig === "text" && fieldKey.toLowerCase().includes('instruction')) {
      // Multi-line text areas for instructions/descriptions
      return (
        <div key={fieldName} style={{ marginBottom: "20px" }}>
          <label style={{ 
            color: "#5CE1E6", 
            fontSize: "16px", 
            fontWeight: "600", 
            display: "block", 
            marginBottom: "12px",
            textShadow: "0 0 10px rgba(92, 225, 230, 0.3)"
          }}>
            {fieldKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </label>
          <textarea
            name={fieldName}
            value={fieldValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            rows="4"
            style={{
              width: "100%",
              padding: "18px 20px",
              fontSize: "16px",
              border: "2px solid rgba(92, 225, 230, 0.2)",
              borderRadius: "15px",
              backgroundColor: "rgba(26, 26, 26, 0.8)",
              color: "white",
              outline: "none",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
              boxShadow: "inset 0 2px 10px rgba(0,0,0,0.3)",
              resize: "vertical",
              fontFamily: "inherit"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#5CE1E6";
              e.target.style.boxShadow = "inset 0 2px 10px rgba(0,0,0,0.3), 0 0 20px rgba(92, 225, 230, 0.3)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(92, 225, 230, 0.2)";
              e.target.style.boxShadow = "inset 0 2px 10px rgba(0,0,0,0.3)";
              e.target.style.transform = "translateY(0)";
            }}
          />
        </div>
      );
    }

    // Regular input field
    return (
      <div key={fieldName} style={{ marginBottom: "20px" }}>
        <label style={{ 
          color: "#5CE1E6", 
          fontSize: "16px", 
          fontWeight: "600", 
          display: "block", 
          marginBottom: "12px",
          textShadow: "0 0 10px rgba(92, 225, 230, 0.3)"
        }}>
          {fieldKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </label>
        <input
          type={inputType}
          name={fieldName}
          value={fieldValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "18px 20px",
            fontSize: "16px",
            border: "2px solid rgba(92, 225, 230, 0.2)",
            borderRadius: "15px",
            backgroundColor: "rgba(26, 26, 26, 0.8)",
            color: "white",
            outline: "none",
            transition: "all 0.3s ease",
            backdropFilter: "blur(10px)",
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.3)"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#5CE1E6";
            e.target.style.boxShadow = "inset 0 2px 10px rgba(0,0,0,0.3), 0 0 20px rgba(92, 225, 230, 0.3)";
            e.target.style.transform = "translateY(-2px)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(92, 225, 230, 0.2)";
            e.target.style.boxShadow = "inset 0 2px 10px rgba(0,0,0,0.3)";
            e.target.style.transform = "translateY(0)";
          }}
        />
      </div>
    );
  };

  const renderSection = (sectionKey, sectionConfig) => {
    const IconComponent = getIconForSection(sectionKey);
    
    return (
      <div key={sectionKey} className={styles["box"]} style={{
        background: "linear-gradient(145deg, #1e1e1e, #2a2a2a)",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(92, 225, 230, 0.1)",
        border: "1px solid rgba(92, 225, 230, 0.2)",
        marginBottom: "30px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          height: "4px",
          background: "linear-gradient(90deg, #5CE1E6, #00d4ff, #5CE1E6)",
          borderRadius: "20px 20px 0 0"
        }}></div>
        <h1 style={{ 
          fontSize: "28px", 
          fontWeight: "700",
          background: "linear-gradient(135deg, #5CE1E6, #00d4ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "25px",
          display: "flex",
          alignItems: "center"
        }}>
          <IconComponent style={{ color: "#5CE1E6", marginRight: "15px", fontSize: "28px" }} />
          {sectionKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h1>
        <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
          {Object.entries(sectionConfig).map(([fieldKey, fieldConfig]) => 
            renderField(fieldKey, fieldConfig, sectionKey)
          )}
        </div>
      </div>
    );
  };

  const submitFormToDatabase = async () => {
    if (!commonData) {
      setSubmitMessage("❗ Common data not found. Please go back and fill the previous form.");
      return;
    }

    const userEmail = localStorage.getItem("userEmail");
    const username = localStorage.getItem("username");

    if (!userEmail && !username) {
      setSubmitMessage("❗ User not found. Please login again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/api/user/update-form-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIdentifier: userEmail || username,
          // Common data
          fullName: commonData.formData.fullName,
          age: commonData.formData.age,
          dateOfBirth: commonData.formData.dateOfBirth,
          gender: commonData.formData.gender,
          contactNumber: commonData.formData.contactNumber,
          address: commonData.formData.address,
          landmark: commonData.formData.landmark,
          pincode: commonData.formData.pincode,
          preferredDate: commonData.formData.preferredDate,
          preferredTime: commonData.formData.preferredTime,
          duration: commonData.formData.duration,
          locationLat: commonData.selectedLocation.lat,
          locationLng: commonData.selectedLocation.lng,
          locationAddress: commonData.selectedLocation.address,
          // Service-specific data
          ...formData,
        }),
      });

      if (response.ok) {
        setSubmitMessage("✅ Form submitted successfully!");
        // Clear localStorage after successful submission
        localStorage.removeItem('needstation_common_form_data');
        localStorage.removeItem('needstation_common_location_data');
        localStorage.removeItem(FORM_DATA_KEY);
        
        // Navigate to available helpers page
        setTimeout(() => {
          navigate("/available-helpers", {
            state: { 
              service: serviceName,
              serviceType: serviceName,
              serviceUrlPath: getServiceUrlPath(serviceName),
              bookingDetails: {
                ...commonData.formData,
                ...formData,
                selectedLocation: commonData.selectedLocation
              }
            }
          });
        }, 1000);
      } else {
        const errorData = await response.json().catch(() => null);
        console.error("Server error:", errorData);
        setSubmitMessage(`❌ Failed to submit form: ${errorData?.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage("❌ Error connecting to server. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    // This is a simplified validation - you can enhance it based on your requirements
    return Object.keys(serviceConfig).length > 0 && Object.keys(formData).length > 0;
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "20px",
      maxWidth: "800px",
      margin: "0 auto"
    }}>
      {/* Render all sections dynamically */}
      {Object.entries(serviceConfig).map(([sectionKey, sectionConfig]) => 
        renderSection(sectionKey, sectionConfig)
      )}

      {/* Submit Button */}
      <div className={styles["button-container"]} style={{
        padding: "40px 20px 60px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <button 
          className={styles["button"]}
          disabled={!isFormValid() || isSubmitting}
          onClick={async (e) => {
            e.preventDefault();
            
            if (!isFormValid()) {
              alert("Please fill in all required details");
              return;
            }
            
            await submitFormToDatabase();
          }}
          style={{
            background: (!isFormValid() || isSubmitting) 
              ? "linear-gradient(135deg, #666, #888)" 
              : "linear-gradient(135deg, #5CE1E6, #00d4ff)",
            color: (!isFormValid() || isSubmitting) 
              ? "#ccc" 
              : "#000",
            border: "none",
            borderRadius: "15px",
            padding: "18px 40px",
            fontSize: "18px",
            fontWeight: "700",
            cursor: (!isFormValid() || isSubmitting) ? 'not-allowed' : 'pointer',
            transition: "all 0.3s ease",
            boxShadow: (!isFormValid() || isSubmitting) 
              ? "none" 
              : "0 10px 30px rgba(92, 225, 230, 0.4), 0 0 0 1px rgba(92, 225, 230, 0.2)",
            textTransform: "uppercase",
            letterSpacing: "1px",
            minWidth: "270px"
          }}
          onMouseEnter={(e) => {
            if (!e.target.disabled) {
              e.target.style.transform = "translateY(-3px) scale(1.05)";
              e.target.style.boxShadow = "0 15px 40px rgba(92, 225, 230, 0.6), 0 0 0 1px rgba(92, 225, 230, 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            if (!e.target.disabled) {
              e.target.style.transform = "translateY(0) scale(1)";
              e.target.style.boxShadow = "0 10px 30px rgba(92, 225, 230, 0.4), 0 0 0 1px rgba(92, 225, 230, 0.2)";
            }
          }}
        >
          {isSubmitting ? "Submitting..." : "See Taskers"}
        </button>
      </div>

      {/* Submit Message */}
      {submitMessage && (
        <div style={{
          padding: "20px",
          textAlign: "center",
          color: submitMessage.includes("successfully") ? "#5CE1E6" : "#ff5c5c",
          fontSize: "16px",
          fontWeight: "600"
        }}>
          {submitMessage}
        </div>
      )}
    </div>
  );
};

export default ServiceFormTemplate;
