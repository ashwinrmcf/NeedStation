import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../BasicNeeds/BasicNeedsServiceUserDescription.module.css";
import { FaShieldAlt, FaBuilding, FaClock, FaUsers, FaClipboardList, FaStar } from "react-icons/fa";

const SecurityUniqueDetails = ({ onDataChange, initialData = {} }) => {
  const [formData, setFormData] = useState({
    guardType: "",
    locationType: "",
    shiftDuration: "",
    numberOfGuards: "",
    specialInstructions: "",
    ...initialData
  });
  const [commonData, setCommonData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Local storage key for persistence
  const FORM_DATA_KEY = 'needstation_security_unique_data';

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
  }, [location.state]);

  // Notify parent component when data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    setFormData(updatedFormData);
    
    // Save to localStorage
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(updatedFormData));
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
          // Security-specific data
          guardType: formData.guardType,
          locationType: formData.locationType,
          shiftDuration: formData.shiftDuration,
          numberOfGuards: formData.numberOfGuards,
          specialInstructions: formData.specialInstructions,
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
              service: 'Home Security Guard',
              serviceType: 'Security Service',
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
      {/* Type of Guard Needed */}
      <div className={styles["box"]} style={{
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
          <FaShieldAlt style={{ color: "#5CE1E6", marginRight: "15px", fontSize: "28px" }} />
          Security Requirements
        </h1>
        <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
          <div>
            <label style={{ 
              color: "#5CE1E6", 
              fontSize: "16px", 
              fontWeight: "600", 
              display: "block", 
              marginBottom: "12px",
              textShadow: "0 0 10px rgba(92, 225, 230, 0.3)"
            }}>
              Type of Guard Needed *
            </label>
            <select
              name="guardType"
              value={formData.guardType}
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
              <option value="">Select guard type</option>
              <option value="armed">Armed Security Guard</option>
              <option value="unarmed">Unarmed Security Guard</option>
            </select>
          </div>
          <div>
            <label style={{ 
              color: "#5CE1E6", 
              fontSize: "16px", 
              fontWeight: "600", 
              display: "block", 
              marginBottom: "12px",
              textShadow: "0 0 10px rgba(92, 225, 230, 0.3)"
            }}>
              Location Type *
            </label>
            <select
              name="locationType"
              value={formData.locationType}
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
              <option value="">Select location type</option>
              <option value="home">Home</option>
              <option value="society">Society/Residential Complex</option>
              <option value="school">School</option>
              <option value="hospital">Hospital</option>
              <option value="business">Business/Office</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shift Duration and Number of Guards */}
      <div className={styles["box"]} style={{
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
          <FaClock style={{ color: "#5CE1E6", marginRight: "15px", fontSize: "28px" }} />
          Shift Details
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
          <div>
            <label style={{ 
              color: "#5CE1E6", 
              fontSize: "16px", 
              fontWeight: "600", 
              display: "block", 
              marginBottom: "12px",
              textShadow: "0 0 10px rgba(92, 225, 230, 0.3)"
            }}>
              Shift Duration *
            </label>
            <select
              name="shiftDuration"
              value={formData.shiftDuration}
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
              <option value="">Select shift duration</option>
              <option value="day">Day Shift (6 AM - 6 PM)</option>
              <option value="night">Night Shift (6 PM - 6 AM)</option>
              <option value="12hrs">12 Hours</option>
              <option value="24hrs">24 Hours</option>
            </select>
          </div>
          <div>
            <label style={{ 
              color: "#5CE1E6", 
              fontSize: "16px", 
              fontWeight: "600", 
              display: "block", 
              marginBottom: "12px",
              textShadow: "0 0 10px rgba(92, 225, 230, 0.3)"
            }}>
              Number of Guards Required *
            </label>
            <select
              name="numberOfGuards"
              value={formData.numberOfGuards}
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
              <option value="">Select number of guards</option>
              <option value="1">1 Guard</option>
              <option value="2">2 Guards</option>
              <option value="3">3 Guards</option>
              <option value="4">4 Guards</option>
              <option value="5+">5+ Guards</option>
            </select>
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      <div className={styles["box"]} style={{
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
          <FaClipboardList style={{ color: "#5CE1E6", marginRight: "15px", fontSize: "28px" }} />
          Special Instructions
        </h1>
        <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
          <div>
            <label style={{ 
              color: "#5CE1E6", 
              fontSize: "16px", 
              fontWeight: "600", 
              display: "block", 
              marginBottom: "12px",
              textShadow: "0 0 10px rgba(92, 225, 230, 0.3)"
            }}>
              Any Special Instructions (VIP escort, event duty, CCTV monitoring)
            </label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              placeholder="Enter any special requirements, duties, or instructions for the security guard..."
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
        </div>
      </div>

      {/* See Taskers Button */}
      <div className={styles["button-container"]} style={{
        padding: "40px 20px 60px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)"
      }}>
        <button 
          className={styles["button"]}
          disabled={!formData.guardType || !formData.locationType || !formData.shiftDuration || !formData.numberOfGuards || isSubmitting}
          onClick={async (e) => {
            e.preventDefault();
            
            // Validate required fields
            if (!formData.guardType || !formData.locationType || !formData.shiftDuration || !formData.numberOfGuards) {
              alert("Please fill in all required security details");
              return;
            }
            
            // Submit form data to backend
            await submitFormToDatabase();
          }}
          style={{
            background: (!formData.guardType || !formData.locationType || !formData.shiftDuration || !formData.numberOfGuards || isSubmitting) 
              ? "linear-gradient(135deg, #666, #888)" 
              : "linear-gradient(135deg, #5CE1E6, #00d4ff)",
            color: (!formData.guardType || !formData.locationType || !formData.shiftDuration || !formData.numberOfGuards || isSubmitting) 
              ? "#ccc" 
              : "#000",
            border: "none",
            borderRadius: "15px",
            padding: "18px 40px",
            fontSize: "18px",
            fontWeight: "700",
            cursor: (!formData.guardType || !formData.locationType || !formData.shiftDuration || !formData.numberOfGuards || isSubmitting) ? 'not-allowed' : 'pointer',
            transition: "all 0.3s ease",
            boxShadow: (!formData.guardType || !formData.locationType || !formData.shiftDuration || !formData.numberOfGuards || isSubmitting) 
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

export default SecurityUniqueDetails;