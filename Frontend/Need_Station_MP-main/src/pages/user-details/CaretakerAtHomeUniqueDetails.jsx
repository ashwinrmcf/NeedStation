import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaStar, FaHome, FaClock, FaUserNurse, FaHeart, FaFileUpload, FaUsers } from "react-icons/fa";
import styles from "../BasicNeeds/BasicNeedsServiceUserDescription.module.css";

const CaretakerAtHomeUniqueDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  
  const FORM_DATA_KEY = 'needstation_caretaker_form_data';
  
  const [formData, setFormData] = useState({
    careType: '',
    patientCondition: '',
    careLevel: '',
    shiftType: '',
    caretakerGender: '',
    experienceRequired: '',
    specialSkills: [],
    specialInstructions: ''
  });

  const [commonData, setCommonData] = useState(null);

  useEffect(() => {
    const navCommonData = location.state?.commonData;
    const storedCommonData = JSON.parse(localStorage.getItem('needstation_common_form_data') || 'null');
    const storedLocationData = JSON.parse(localStorage.getItem('needstation_common_location_data') || 'null');
    
    if (navCommonData) {
      setCommonData(navCommonData);
    } else if (storedCommonData && storedLocationData) {
      setCommonData({
        formData: storedCommonData,
        selectedLocation: storedLocationData
      });
    }

    const savedFormData = localStorage.getItem(FORM_DATA_KEY);
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    setFormData(updatedFormData);
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(updatedFormData));
  };

  const handleCheckboxChange = (name, value) => {
    const updatedArray = formData[name].includes(value)
      ? formData[name].filter(item => item !== value)
      : [...formData[name], value];
    
    const updatedFormData = {
      ...formData,
      [name]: updatedArray
    };
    setFormData(updatedFormData);
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
          careType: formData.careType,
          patientCondition: formData.patientCondition,
          careLevel: formData.careLevel,
          shiftType: formData.shiftType,
          caretakerGender: formData.caretakerGender,
          experienceRequired: formData.experienceRequired,
          specialSkills: formData.specialSkills.join(', '),
          specialInstructions: formData.specialInstructions,
        }),
      });

      if (response.ok) {
        setSubmitMessage("✅ Form submitted successfully!");
        localStorage.removeItem('needstation_common_form_data');
        localStorage.removeItem('needstation_common_location_data');
        localStorage.removeItem(FORM_DATA_KEY);
        
        setTimeout(() => {
          navigate("/available-helpers", {
            state: { 
              service: "Caretaker at Home",
              serviceType: 'Healthcare Service',
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
      {/* Care Type */}
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
        <h1 style={{
          color: "#5CE1E6",
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "25px",
          display: "flex",
          alignItems: "center",
          textShadow: "0 0 20px rgba(92, 225, 230, 0.5)"
        }}>
          <FaHome style={{ marginRight: "15px", fontSize: "28px" }} />
          Type of Care
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          {['Elderly Care', 'Child Care', 'Patient Care', 'Companion Care'].map((care) => (
            <label key={care} style={{
              display: "flex",
              alignItems: "center",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              padding: "10px",
              borderRadius: "10px",
              transition: "all 0.3s ease",
              backgroundColor: formData.careType === care.toLowerCase() ? "rgba(92, 225, 230, 0.2)" : "transparent"
            }}>
              <input
                type="radio"
                name="careType"
                value={care.toLowerCase()}
                checked={formData.careType === care.toLowerCase()}
                onChange={handleInputChange}
                style={{ marginRight: "10px", accentColor: "#5CE1E6" }}
              />
              {care}
            </label>
          ))}
        </div>
      </div>

      {/* Patient Condition */}
      <div className={styles["box"]} style={{
        background: "linear-gradient(145deg, #1e1e1e, #2a2a2a)",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(92, 225, 230, 0.1)",
        border: "1px solid rgba(92, 225, 230, 0.2)",
        marginBottom: "30px"
      }}>
        <h1 style={{
          color: "#5CE1E6",
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "25px",
          display: "flex",
          alignItems: "center",
          textShadow: "0 0 20px rgba(92, 225, 230, 0.5)"
        }}>
          <FaHeart style={{ marginRight: "15px", fontSize: "28px" }} />
          Patient Condition
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          {['Healthy/Independent', 'Mild Assistance', 'Moderate Care', 'Intensive Care', 'Bedridden', 'Dementia/Alzheimer\'s'].map((condition) => (
            <label key={condition} style={{
              display: "flex",
              alignItems: "center",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              padding: "10px",
              borderRadius: "10px",
              transition: "all 0.3s ease",
              backgroundColor: formData.patientCondition === condition.toLowerCase() ? "rgba(92, 225, 230, 0.2)" : "transparent"
            }}>
              <input
                type="radio"
                name="patientCondition"
                value={condition.toLowerCase()}
                checked={formData.patientCondition === condition.toLowerCase()}
                onChange={handleInputChange}
                style={{ marginRight: "10px", accentColor: "#5CE1E6" }}
              />
              {condition}
            </label>
          ))}
        </div>
      </div>

      {/* Care Level */}
      <div className={styles["box"]} style={{
        background: "linear-gradient(145deg, #1e1e1e, #2a2a2a)",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(92, 225, 230, 0.1)",
        border: "1px solid rgba(92, 225, 230, 0.2)",
        marginBottom: "30px"
      }}>
        <h1 style={{
          color: "#5CE1E6",
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "25px",
          display: "flex",
          alignItems: "center",
          textShadow: "0 0 20px rgba(92, 225, 230, 0.5)"
        }}>
          <FaUserNurse style={{ marginRight: "15px", fontSize: "28px" }} />
          Care Level
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
          {['Basic', 'Skilled', 'Medical'].map((level) => (
            <label key={level} style={{
              display: "flex",
              alignItems: "center",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              padding: "10px",
              borderRadius: "10px",
              transition: "all 0.3s ease",
              backgroundColor: formData.careLevel === level.toLowerCase() ? "rgba(92, 225, 230, 0.2)" : "transparent"
            }}>
              <input
                type="radio"
                name="careLevel"
                value={level.toLowerCase()}
                checked={formData.careLevel === level.toLowerCase()}
                onChange={handleInputChange}
                style={{ marginRight: "10px", accentColor: "#5CE1E6" }}
              />
              {level}
            </label>
          ))}
        </div>
      </div>

      {/* Shift Type */}
      <div className={styles["box"]} style={{
        background: "linear-gradient(145deg, #1e1e1e, #2a2a2a)",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(92, 225, 230, 0.1)",
        border: "1px solid rgba(92, 225, 230, 0.2)",
        marginBottom: "30px"
      }}>
        <h1 style={{
          color: "#5CE1E6",
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "25px",
          display: "flex",
          alignItems: "center",
          textShadow: "0 0 20px rgba(92, 225, 230, 0.5)"
        }}>
          <FaClock style={{ marginRight: "15px", fontSize: "28px" }} />
          Shift Type
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
          {['Day Shift', 'Night Shift', '24/7 Live-in'].map((shift) => (
            <label key={shift} style={{
              display: "flex",
              alignItems: "center",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              padding: "10px",
              borderRadius: "10px",
              transition: "all 0.3s ease",
              backgroundColor: formData.shiftType === shift.toLowerCase() ? "rgba(92, 225, 230, 0.2)" : "transparent"
            }}>
              <input
                type="radio"
                name="shiftType"
                value={shift.toLowerCase()}
                checked={formData.shiftType === shift.toLowerCase()}
                onChange={handleInputChange}
                style={{ marginRight: "10px", accentColor: "#5CE1E6" }}
              />
              {shift}
            </label>
          ))}
        </div>
      </div>

      {/* Caretaker Gender Preference */}
      <div className={styles["box"]} style={{
        background: "linear-gradient(145deg, #1e1e1e, #2a2a2a)",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(92, 225, 230, 0.1)",
        border: "1px solid rgba(92, 225, 230, 0.2)",
        marginBottom: "30px"
      }}>
        <h1 style={{
          color: "#5CE1E6",
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "25px",
          display: "flex",
          alignItems: "center",
          textShadow: "0 0 20px rgba(92, 225, 230, 0.5)"
        }}>
          <FaUsers style={{ marginRight: "15px", fontSize: "28px" }} />
          Caretaker Gender Preference
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
          {['Male', 'Female', 'No Preference'].map((gender) => (
            <label key={gender} style={{
              display: "flex",
              alignItems: "center",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              padding: "10px",
              borderRadius: "10px",
              transition: "all 0.3s ease",
              backgroundColor: formData.caretakerGender === gender.toLowerCase() ? "rgba(92, 225, 230, 0.2)" : "transparent"
            }}>
              <input
                type="radio"
                name="caretakerGender"
                value={gender.toLowerCase()}
                checked={formData.caretakerGender === gender.toLowerCase()}
                onChange={handleInputChange}
                style={{ marginRight: "10px", accentColor: "#5CE1E6" }}
              />
              {gender}
            </label>
          ))}
        </div>
      </div>

      {/* Experience Required */}
      <div className={styles["box"]} style={{
        background: "linear-gradient(145deg, #1e1e1e, #2a2a2a)",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(92, 225, 230, 0.1)",
        border: "1px solid rgba(92, 225, 230, 0.2)",
        marginBottom: "30px"
      }}>
        <h1 style={{
          color: "#5CE1E6",
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "25px",
          display: "flex",
          alignItems: "center",
          textShadow: "0 0 20px rgba(92, 225, 230, 0.5)"
        }}>
          <FaUserNurse style={{ marginRight: "15px", fontSize: "28px" }} />
          Experience Required
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
          {['0-1 years', '2-5 years', '5+ years'].map((exp) => (
            <label key={exp} style={{
              display: "flex",
              alignItems: "center",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              padding: "10px",
              borderRadius: "10px",
              transition: "all 0.3s ease",
              backgroundColor: formData.experienceRequired === exp.toLowerCase() ? "rgba(92, 225, 230, 0.2)" : "transparent"
            }}>
              <input
                type="radio"
                name="experienceRequired"
                value={exp.toLowerCase()}
                checked={formData.experienceRequired === exp.toLowerCase()}
                onChange={handleInputChange}
                style={{ marginRight: "10px", accentColor: "#5CE1E6" }}
              />
              {exp}
            </label>
          ))}
        </div>
      </div>

      {/* Special Skills */}
      <div className={styles["box"]} style={{
        background: "linear-gradient(145deg, #1e1e1e, #2a2a2a)",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(92, 225, 230, 0.1)",
        border: "1px solid rgba(92, 225, 230, 0.2)",
        marginBottom: "30px"
      }}>
        <h1 style={{
          color: "#5CE1E6",
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "25px",
          display: "flex",
          alignItems: "center",
          textShadow: "0 0 20px rgba(92, 225, 230, 0.5)"
        }}>
          <FaHeart style={{ marginRight: "15px", fontSize: "28px" }} />
          Special Skills Required
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          {['First Aid', 'CPR Certified', 'Medication Management', 'Physiotherapy', 'Cooking', 'Driving'].map((skill) => (
            <label key={skill} style={{
              display: "flex",
              alignItems: "center",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              padding: "10px",
              borderRadius: "10px",
              transition: "all 0.3s ease",
              backgroundColor: formData.specialSkills.includes(skill.toLowerCase()) ? "rgba(92, 225, 230, 0.2)" : "transparent"
            }}>
              <input
                type="checkbox"
                checked={formData.specialSkills.includes(skill.toLowerCase())}
                onChange={() => handleCheckboxChange('specialSkills', skill.toLowerCase())}
                style={{ marginRight: "10px", accentColor: "#5CE1E6" }}
              />
              {skill}
            </label>
          ))}
        </div>
      </div>

      {/* Special Instructions */}
      <div className={styles["box"]} style={{
        background: "linear-gradient(145deg, #1e1e1e, #2a2a2a)",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(92, 225, 230, 0.1)",
        border: "1px solid rgba(92, 225, 230, 0.2)",
        marginBottom: "30px"
      }}>
        <h1 style={{
          color: "#5CE1E6",
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "25px",
          display: "flex",
          alignItems: "center",
          textShadow: "0 0 20px rgba(92, 225, 230, 0.5)"
        }}>
          <FaFileUpload style={{ marginRight: "15px", fontSize: "28px" }} />
          Special Instructions
        </h1>
        <textarea
          name="specialInstructions"
          value={formData.specialInstructions}
          onChange={handleInputChange}
          placeholder="Please provide any special instructions, patient preferences, daily routines, or specific requirements..."
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
            resize: "vertical"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#5CE1E6";
            e.target.style.boxShadow = "inset 0 2px 10px rgba(0,0,0,0.3), 0 0 20px rgba(92, 225, 230, 0.3)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(92, 225, 230, 0.2)";
            e.target.style.boxShadow = "inset 0 2px 10px rgba(0,0,0,0.3)";
          }}
        />
      </div>

      {/* See Taskers Button */}
      <div className={styles["button-container"]} style={{
        padding: "40px 20px 60px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)"
      }}>
        <button 
          className={styles["button"]}
          disabled={!formData.careType || !formData.patientCondition || !formData.careLevel || !formData.shiftType || !formData.caretakerGender || !formData.experienceRequired || isSubmitting}
          onClick={async (e) => {
            e.preventDefault();
            
            if (!formData.careType || !formData.patientCondition || !formData.careLevel || !formData.shiftType || !formData.caretakerGender || !formData.experienceRequired) {
              alert("Please fill in all required caretaker details");
              return;
            }
            
            await submitFormToDatabase();
          }}
          style={{
            background: (!formData.careType || !formData.patientCondition || !formData.careLevel || !formData.shiftType || !formData.caretakerGender || !formData.experienceRequired || isSubmitting) 
              ? "linear-gradient(135deg, #666, #888)" 
              : "linear-gradient(135deg, #5CE1E6, #00d4ff)",
            color: (!formData.careType || !formData.patientCondition || !formData.careLevel || !formData.shiftType || !formData.caretakerGender || !formData.experienceRequired || isSubmitting) 
              ? "#ccc" 
              : "#000",
            border: "none",
            borderRadius: "15px",
            padding: "18px 40px",
            fontSize: "18px",
            fontWeight: "700",
            cursor: (!formData.careType || !formData.patientCondition || !formData.careLevel || !formData.shiftType || !formData.caretakerGender || !formData.experienceRequired || isSubmitting) ? 'not-allowed' : 'pointer',
            transition: "all 0.3s ease",
            boxShadow: (!formData.careType || !formData.patientCondition || !formData.careLevel || !formData.shiftType || !formData.caretakerGender || !formData.experienceRequired || isSubmitting) 
              ? "none" 
              : "0 10px 30px rgba(92, 225, 230, 0.4), 0 0 0 1px rgba(92, 225, 230, 0.2)",
            textTransform: "uppercase",
            letterSpacing: "1px",
            minWidth: "250px"
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
          <FaStar style={{ marginRight: "10px" }} />
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

export default CaretakerAtHomeUniqueDetails;
