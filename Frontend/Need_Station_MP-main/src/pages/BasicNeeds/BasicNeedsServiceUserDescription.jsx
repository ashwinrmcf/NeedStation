import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";  // Added useLocation to access route state
import styles from "./BasicNeedsServiceUserDescription.module.css";
import ScrollToTop from "../../hooks/ScrollToTop";
import LeafletMapPicker from "../../components/Map/LeafletMapPicker.jsx";
import { FaMapMarkerAlt, FaPhone, FaClock, FaClipboardList, FaCheckCircle, FaStar } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { MdAccessTime, MdContactPhone } from "react-icons/md";

const BasicNeedsServiceUserDescription = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [formData, setFormData] = useState({
    address: "",
    landmark: "",
    pincode: "",
    contactNumber: "",
    alternateContact: "",
  });
  const [dateError, setDateError] = useState("");

  // Local storage keys for persistence across reloads
  const FORM_DATA_KEY = 'needstation_form_data';
  const LOCATION_DATA_KEY = 'needstation_location_data';
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract service information from the location state
  const serviceInfo = location.state || {};
  const { service, description, serviceType } = serviceInfo;

  // Calculate date limits for booking (today to 3 days ahead)
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 3);
  
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  const minDateString = formatDateForInput(today);
  const maxDateString = formatDateForInput(maxDate);

  // Load data from localStorage on component mount and add beforeunload warning
  useEffect(() => {
    const savedFormData = localStorage.getItem(FORM_DATA_KEY);
    const savedLocationData = localStorage.getItem(LOCATION_DATA_KEY);
    
    if (savedFormData) {
      try {
        const parsedFormData = JSON.parse(savedFormData);
        setFormData(parsedFormData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
    
    if (savedLocationData) {
      try {
        const parsedLocationData = JSON.parse(savedLocationData);
        setSelectedLocation(parsedLocationData);
      } catch (error) {
        console.error('Error parsing saved location data:', error);
      }
    }
  }, []); // Remove dependencies to prevent infinite loop

  // Separate useEffect for beforeunload warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (formData.address || formData.contactNumber || selectedLocation) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to reload? This will clear your form data.';
        // Clear localStorage when user reloads
        localStorage.removeItem(FORM_DATA_KEY);
        localStorage.removeItem(LOCATION_DATA_KEY);
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formData, selectedLocation]);

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

  const validateDate = (value) => {
    if (!value) {
      setDateError("");
      return;
    }
    
    const selectedDate = new Date(value);
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 3);
    
    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    maxDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today || selectedDate > maxDate) {
      setDateError("Booking is only available for the next 3 days from today.");
    } else {
      setDateError("");
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSubmitMessage("");
    
    // Save location to localStorage
    localStorage.setItem(LOCATION_DATA_KEY, JSON.stringify(location));
  };

  const submitFormToDatabase = async () => {
    if (!selectedLocation) {
      setSubmitMessage("❗ Please select a location first");
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
          address: formData.address,
          landmark: formData.landmark,
          pincode: formData.pincode,
          contactNumber: formData.contactNumber,
          alternateContact: formData.alternateContact,
          locationLat: selectedLocation.lat,
          locationLng: selectedLocation.lng,
          locationAddress: selectedLocation.address,
        }),
      });

      if (response.ok) {
        setSubmitMessage("✅ Location saved successfully!"); 
        // Don't clear localStorage after successful save to maintain session persistence
        // localStorage.removeItem(FORM_DATA_KEY);
        // localStorage.removeItem(LOCATION_DATA_KEY);
      } else {
        const errorData = await response.json().catch(() => null);
        console.error("Server error:", errorData);
        setSubmitMessage(`❌ Failed to save location: ${errorData?.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error submitting location:", error);
      setSubmitMessage("❌ Error connecting to server. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <ScrollToTop />
      <div className={styles["header"]}>
        <Link 
          to="/"
          onClick={(e) => {
            // Check if there's unsaved data
            const hasUnsavedData = Object.values(formData).some(value => value.trim() !== '') || selectedLocation;
            
            if (hasUnsavedData) {
              const confirmNavigation = window.confirm(
                "You have unsaved changes. Are you sure you want to leave this page? Your data will be lost."
              );
              if (confirmNavigation) {
                // Clear localStorage when user confirms navigation back to services
                localStorage.removeItem(FORM_DATA_KEY);
                localStorage.removeItem(LOCATION_DATA_KEY);
              } else {
                e.preventDefault();
              }
            }
          }}
        >
          <div className={styles["logo"]}>
            Need<span style={{ color: "#5CE1E6" }}>Station</span>
          </div>
        </Link>
        <div className={styles["progress-bar"]}>
          <div className={`${styles["step"]} ${styles["active"]}`}>
            <div className={styles["circle"]}></div>
          </div>{" "}
          <div className={styles["line1"]}></div>{" "}
          <span className={styles["helper-list"]}>Describe your Task</span>
          <div className={styles["line1"]}></div>
          <div className={styles["step"]}>
            <div className={styles["circle"]}></div>
          </div>
          <div className={styles["line"]}></div>
          <div className={styles["step"]}>
            <div className={styles["circle"]}></div>
          </div>
          <div className={styles["line"]}></div>
          <div className={styles["step"]}>
            <div className={styles["circle"]}></div>
          </div>
        </div>
      </div>

      <div className={styles["task-section"]} style={{ 
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)",
        minHeight: "100vh",
        padding: "40px 20px"
      }}>
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
            <HiLocationMarker style={{ color: "#5CE1E6", marginRight: "15px", fontSize: "32px" }} />
            Your Task Location
          </h1>
          <div style={{ marginTop: "20px", position: "relative" }}>
            <LeafletMapPicker onLocationSelect={handleLocationSelect} />
            
            {/* Display location details including lat/long */}
            {selectedLocation && (
              <div style={{ color: "white", marginTop: "20px" }}>
                <div style={{ marginBottom: "8px" }}>
                  <strong>Selected Location:</strong> {selectedLocation.address}
                </div>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div>
                    <strong>Latitude:</strong> {selectedLocation.lat.toFixed(6)}
                  </div>
                  <div>
                    <strong>Longitude:</strong> {selectedLocation.lng.toFixed(6)}
                  </div>
                </div>
              </div>
            )}
            
            {/* Form submit button positioned at bottom right */}
            <button 
              onClick={submitFormToDatabase}
              disabled={isSubmitting || !selectedLocation}
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                backgroundColor: "#5CE1E6",
                color: "#000",
                border: "none",
                borderRadius: "5px",
                padding: "8px 15px",
                cursor: selectedLocation ? "pointer" : "not-allowed",
                opacity: selectedLocation ? 1 : 0.7,
                fontWeight: "bold",
                zIndex: 10
              }}
            >
              {isSubmitting ? "Saving..." : "Save Location"}
            </button>
            
            {submitMessage && (
              <div style={{ 
                color: submitMessage.includes("successfully") ? "#5CE1E6" : "#ff5c5c", 
                marginTop: "10px",
                fontSize: "14px" 
              }}>
                {submitMessage}
              </div>
            )}
          </div>
        </div>

        {/* Address Details */}
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
            <FaMapMarkerAlt style={{ color: "#5CE1E6", marginRight: "15px", fontSize: "28px" }} />
            Address Details
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
                Full Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your complete address"
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label style={{ 
                  color: "#5CE1E6", 
                  fontSize: "16px", 
                  fontWeight: "600", 
                  display: "block", 
                  marginBottom: "12px",
                  textShadow: "0 0 10px rgba(92, 225, 230, 0.3)"
                }}>
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  placeholder="Nearby landmark"
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
              <div>
                <label style={{ 
                  color: "#5CE1E6", 
                  fontSize: "16px", 
                  fontWeight: "600", 
                  display: "block", 
                  marginBottom: "12px",
                  textShadow: "0 0 10px rgba(92, 225, 230, 0.3)"
                }}>
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="Enter pincode"
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
            </div>
          </div>
        </div>

        {/* Contact Information */}
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
            <MdContactPhone style={{ color: "#5CE1E6", marginRight: "15px", fontSize: "28px" }} />
            Contact Information
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
                Primary Contact *
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="Enter contact number"
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
            <div>
              <label style={{ 
                color: "#5CE1E6", 
                fontSize: "16px", 
                fontWeight: "600", 
                display: "block", 
                marginBottom: "12px",
                textShadow: "0 0 10px rgba(92, 225, 230, 0.3)"
              }}>
                Alternate Contact
              </label>
              <input
                type="tel"
                name="alternateContact"
                value={formData.alternateContact}
                onChange={handleInputChange}
                placeholder="Enter contact number"
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
          </div>
        </div>

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
            <MdAccessTime style={{ color: "#5CE1E6", marginRight: "15px", fontSize: "28px" }} />
            Preferred Booking Slot
          </h1>
          {dateError && (
            <div style={{
              color: "#ff4757",
              fontSize: "16px",
              marginBottom: "20px",
              padding: "12px 16px",
              backgroundColor: "rgba(255, 71, 87, 0.1)",
              border: "1px solid rgba(255, 71, 87, 0.3)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              fontWeight: "500"
            }}>
              ⚠️ {dateError}
            </div>
          )}
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
                Preferred Date *
              </label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleInputChange}
                min={minDateString}
                max={maxDateString}
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
                  colorScheme: "dark",
                  backdropFilter: "blur(10px)",
                  boxShadow: "inset 0 2px 10px rgba(0,0,0,0.3)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#5CE1E6";
                  e.target.style.boxShadow = "inset 0 2px 10px rgba(0,0,0,0.3), 0 0 20px rgba(92, 225, 230, 0.3)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onBlur={(e) => {
                  validateDate(e.target.value);
                  e.target.style.borderColor = "rgba(92, 225, 230, 0.2)";
                  e.target.style.boxShadow = "inset 0 2px 10px rgba(0,0,0,0.3)";
                  e.target.style.transform = "translateY(0)";
                }}
              />
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
                Preferred Time *
              </label>
              <select
                name="preferredTime"
                value={formData.preferredTime}
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
                <option value="">Select time slot</option>
                <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
                <option value="afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
                <option value="evening">Evening (4:00 PM - 8:00 PM)</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      <div className={styles["button-container"]} style={{
        padding: "40px 20px 60px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)"
      }}>
          <button 
            className={styles["button"]}
            disabled={!formData.address || !formData.pincode || !formData.contactNumber || !formData.preferredDate || !formData.preferredTime}
            onClick={async (e) => {
              e.preventDefault();
              
              // Validate required fields
              if (!formData.address || !formData.pincode || !formData.contactNumber || !formData.preferredDate || !formData.preferredTime) {
                alert("Please fill in all required fields");
                return;
              }
              
              if (!selectedLocation) {
                alert("Please select a location on the map");
                return;
              }
              
              // Submit form data to backend first
              await submitFormToDatabase();
              
              // Then navigate to helpers page
              navigate("/available-helpers", {
                state: { 
                  service: service || serviceType || 'General Service',
                  description: description,
                  serviceType: serviceType,
                  bookingDetails: {
                    ...formData,
                    selectedLocation: selectedLocation
                  }
                }
              });
            }}
            style={{
              background: (!formData.address || !formData.pincode || !formData.contactNumber || !formData.preferredDate || !formData.preferredTime) 
                ? "linear-gradient(135deg, #666, #888)" 
                : "linear-gradient(135deg, #5CE1E6, #00d4ff)",
              color: (!formData.address || !formData.pincode || !formData.contactNumber || !formData.preferredDate || !formData.preferredTime) 
                ? "#ccc" 
                : "#000",
              border: "none",
              borderRadius: "15px",
              padding: "18px 40px",
              fontSize: "18px",
              fontWeight: "700",
              cursor: (!formData.address || !formData.pincode || !formData.contactNumber || !formData.preferredDate || !formData.preferredTime) ? 'not-allowed' : 'pointer',
              transition: "all 0.3s ease",
              boxShadow: (!formData.address || !formData.pincode || !formData.contactNumber || !formData.preferredDate || !formData.preferredTime) 
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
            See Taskers
          </button>
      </div>
    </>
  );
};

export default BasicNeedsServiceUserDescription;
