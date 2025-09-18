import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaStar, FaVial, FaClock, FaFileUpload, FaEnvelope, FaUtensils } from "react-icons/fa";
import styles from "../BasicNeeds/BasicNeedsServiceUserDescription.module.css";

const PathologyCareUniqueDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  
  const FORM_DATA_KEY = 'needstation_pathology_form_data';
  
  const [formData, setFormData] = useState({
    testType: [],
    collectionTime: '',
    fastingRequired: '',
    prescription: '',
    reportDelivery: ''
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
    const currentArray = formData[name] || [];
    const updatedArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
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
          testType: formData.testType.join(', '),
          collectionTime: formData.collectionTime,
          fastingRequired: formData.fastingRequired,
          prescription: formData.prescription,
          reportDelivery: formData.reportDelivery,
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
              service: "Pathology Care",
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
      {/* Test Type Required */}
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
          <FaVial style={{ marginRight: "15px", fontSize: "28px" }} />
          Test Type Required
        </h1>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(2, 1fr)", 
          gap: "20px",
          alignItems: "start"
        }}>
          {['Blood', 'Urine', 'Imaging', 'Full Body', 'Specialized'].map((test) => (
            <label key={test} style={{
              display: "flex",
              alignItems: "center",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              padding: "15px 20px",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              backgroundColor: (formData.testType || []).includes(test.toLowerCase()) ? "rgba(92, 225, 230, 0.2)" : "rgba(255, 255, 255, 0.05)",
              border: (formData.testType || []).includes(test.toLowerCase()) ? "2px solid rgba(92, 225, 230, 0.5)" : "2px solid transparent",
              minHeight: "50px",
              justifyContent: "flex-start"
            }}>
              <input
                type="checkbox"
                checked={(formData.testType || []).includes(test.toLowerCase())}
                onChange={() => handleCheckboxChange('testType', test.toLowerCase())}
                style={{ 
                  marginRight: "15px", 
                  accentColor: "#5CE1E6",
                  width: "18px",
                  height: "18px"
                }}
              />
              <span style={{ fontWeight: "500" }}>{test}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Preferred Sample Collection Time */}
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
          Preferred Sample Collection Time
        </h1>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: "20px",
          alignItems: "start"
        }}>
          {['Morning', 'Afternoon', 'Evening'].map((time) => (
            <label key={time} style={{
              display: "flex",
              alignItems: "center",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              padding: "15px 20px",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              backgroundColor: formData.collectionTime === time.toLowerCase() ? "rgba(92, 225, 230, 0.2)" : "rgba(255, 255, 255, 0.05)",
              border: formData.collectionTime === time.toLowerCase() ? "2px solid rgba(92, 225, 230, 0.5)" : "2px solid transparent",
              minHeight: "50px",
              justifyContent: "flex-start"
            }}>
              <input
                type="radio"
                name="collectionTime"
                value={time.toLowerCase()}
                checked={formData.collectionTime === time.toLowerCase()}
                onChange={handleInputChange}
                style={{ 
                  marginRight: "15px", 
                  accentColor: "#5CE1E6",
                  width: "18px",
                  height: "18px"
                }}
              />
              <span style={{ fontWeight: "500" }}>{time}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fasting Required */}
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
          <FaUtensils style={{ marginRight: "15px", fontSize: "28px" }} />
          Fasting Required?
        </h1>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(2, 1fr)", 
          gap: "20px",
          alignItems: "start"
        }}>
          {['Yes', 'No'].map((option) => (
            <label key={option} style={{
              display: "flex",
              alignItems: "center",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              padding: "15px 20px",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              backgroundColor: formData.fastingRequired === option.toLowerCase() ? "rgba(92, 225, 230, 0.2)" : "rgba(255, 255, 255, 0.05)",
              border: formData.fastingRequired === option.toLowerCase() ? "2px solid rgba(92, 225, 230, 0.5)" : "2px solid transparent",
              minHeight: "50px",
              justifyContent: "flex-start"
            }}>
              <input
                type="radio"
                name="fastingRequired"
                value={option.toLowerCase()}
                checked={formData.fastingRequired === option.toLowerCase()}
                onChange={handleInputChange}
                style={{ 
                  marginRight: "15px", 
                  accentColor: "#5CE1E6",
                  width: "18px",
                  height: "18px"
                }}
              />
              <span style={{ fontWeight: "500" }}>{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Doctor's Test Prescription */}
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
          Doctor's Test Prescription
        </h1>
        <textarea
          name="prescription"
          value={formData.prescription}
          onChange={handleInputChange}
          placeholder="Please provide doctor's prescription or test requirements..."
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

      {/* Report Delivery Preference */}
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
          <FaEnvelope style={{ marginRight: "15px", fontSize: "28px" }} />
          Report Delivery Preference
        </h1>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: "20px",
          alignItems: "start"
        }}>
          {['Email', 'WhatsApp', 'Printed Copy'].map((delivery) => (
            <label key={delivery} style={{
              display: "flex",
              alignItems: "center",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              padding: "15px 20px",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              backgroundColor: formData.reportDelivery === delivery.toLowerCase() ? "rgba(92, 225, 230, 0.2)" : "rgba(255, 255, 255, 0.05)",
              border: formData.reportDelivery === delivery.toLowerCase() ? "2px solid rgba(92, 225, 230, 0.5)" : "2px solid transparent",
              minHeight: "50px",
              justifyContent: "flex-start"
            }}>
              <input
                type="radio"
                name="reportDelivery"
                value={delivery.toLowerCase()}
                checked={formData.reportDelivery === delivery.toLowerCase()}
                onChange={handleInputChange}
                style={{ 
                  marginRight: "15px", 
                  accentColor: "#5CE1E6",
                  width: "18px",
                  height: "18px"
                }}
              />
              <span style={{ fontWeight: "500" }}>{delivery}</span>
            </label>
          ))}
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
          disabled={formData.testType.length === 0 || !formData.collectionTime || !formData.fastingRequired || !formData.reportDelivery || isSubmitting}
          onClick={async (e) => {
            e.preventDefault();
            
            if (formData.testType.length === 0 || !formData.collectionTime || !formData.fastingRequired || !formData.reportDelivery) {
              alert("Please fill in all required pathology care details");
              return;
            }
            
            await submitFormToDatabase();
          }}
          style={{
            background: (formData.testType.length === 0 || !formData.collectionTime || !formData.fastingRequired || !formData.reportDelivery || isSubmitting) 
              ? "linear-gradient(135deg, #666, #888)" 
              : "linear-gradient(135deg, #5CE1E6, #00d4ff)",
            color: (formData.testType.length === 0 || !formData.collectionTime || !formData.fastingRequired || !formData.reportDelivery || isSubmitting) 
              ? "#ccc" 
              : "#000",
            border: "none",
            borderRadius: "15px",
            padding: "18px 40px",
            fontSize: "18px",
            fontWeight: "700",
            cursor: (formData.testType.length === 0 || !formData.collectionTime || !formData.fastingRequired || !formData.reportDelivery || isSubmitting) ? 'not-allowed' : 'pointer',
            transition: "all 0.3s ease",
            boxShadow: (formData.testType.length === 0 || !formData.collectionTime || !formData.fastingRequired || !formData.reportDelivery || isSubmitting) 
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
          {/* <FaStar style={{ marginRight: "10px" }} /> */}
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

export default PathologyCareUniqueDetails;
