import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";  // Added useLocation to access route state
import styles from "./BasicNeedsServiceUserDescription.module.css";
import ScrollToTop from "../../hooks/ScrollToTop";
import MapPicker from "../../components/Map/MapPicker.jsx";
import { FaMapMarkerAlt, FaPhone, FaClock, FaClipboardList, FaCheckCircle, FaStar } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { MdAccessTime, MdContactPhone } from "react-icons/md";

const BasicNeedsServiceUserDescription = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [formData, setFormData] = useState({
    address: "",
    contactNumber: "",
    alternateContact: "",
    preferredDate: "",
    preferredTime: "",
    workDetails: "",
    urgency: "normal"
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract service information from the location state
  const serviceInfo = location.state || {};
  const { service, description, serviceType } = serviceInfo;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSubmitMessage("");
  };

  const submitLocationToDatabase = async () => {
    if (!selectedLocation) {
      setSubmitMessage("❗ Please select a location first");
      return;
    }

    const username = localStorage.getItem("username");  // ✅ Correct way to get email

    if (!username) {
      setSubmitMessage("❗ User email not found. Please login again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/api/user/update-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,                 // ✅ Correct email coming from localStorage
          address: selectedLocation.address,
          lat: selectedLocation.lat,
          lng: selectedLocation.lng
        }),
      });

      if (response.ok) {
        setSubmitMessage("✅ Location successfully saved!"); // ✅ navigate only after success
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
        <Link to="/">
          <div className={styles["logo"]}>
            Need<span style={{ color: "#5CE1E6" }}>Station</span>
          </div>
        </Link>
        <div className={styles["progress-bar"]}>
          <div className={`${styles["step"]} ${styles["active"]}`}>
            <div className={styles["circle"]}></div>
          </div>{" "}
          <div className={styles["line1"]}></div>{" "}
          <span className={styles["describe-task"]}>Describe your Task</span>
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
            <MapPicker onLocationSelect={handleLocationSelect} />
            
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
            
            {/* Location submit button positioned at bottom right */}
            <button 
              onClick={submitLocationToDatabase}
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
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Area pincode"
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
                placeholder="+91 9876543210"
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
                placeholder="+91 9876543210"
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

        {/* Booking Slot */}
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
                min={new Date().toISOString().split('T')[0]}
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
          <div style={{ marginTop: "25px" }}>
            <label style={{ 
              color: "#5CE1E6", 
              fontSize: "16px", 
              fontWeight: "600", 
              display: "block", 
              marginBottom: "15px",
              textShadow: "0 0 10px rgba(92, 225, 230, 0.3)"
            }}>
              Urgency Level
            </label>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              {["normal", "urgent", "emergency"].map((level) => (
                <label key={level} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  cursor: "pointer", 
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: `2px solid ${formData.urgency === level ? "#5CE1E6" : "rgba(92, 225, 230, 0.2)"}`,
                  backgroundColor: formData.urgency === level ? "rgba(92, 225, 230, 0.1)" : "rgba(26, 26, 26, 0.5)",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                  boxShadow: formData.urgency === level ? "0 0 20px rgba(92, 225, 230, 0.3)" : "none"
                }}>
                  <input
                    type="radio"
                    name="urgency"
                    value={level}
                    checked={formData.urgency === level}
                    onChange={handleInputChange}
                    style={{ 
                      marginRight: "12px", 
                      accentColor: "#5CE1E6",
                      width: "18px",
                      height: "18px"
                    }}
                  />
                  <span style={{ 
                    textTransform: "capitalize", 
                    fontSize: "16px",
                    fontWeight: "600",
                    color: formData.urgency === level ? "#5CE1E6" : "white"
                  }}>
                    {level}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Work Details */}
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
            Work Details
          </h1>
          <div style={{ marginTop: "20px" }}>
            <label style={{ 
              color: "#5CE1E6", 
              fontSize: "16px", 
              fontWeight: "600", 
              display: "block", 
              marginBottom: "12px",
              textShadow: "0 0 10px rgba(92, 225, 230, 0.3)"
            }}>
              Describe your requirements (Optional)
            </label>
            <textarea
              name="workDetails"
              value={formData.workDetails}
              onChange={handleInputChange}
              placeholder={service 
                ? `I need a professional ${service} service. Please provide details about the work required, any specific instructions, materials needed, etc.` 
                : "Please describe the work you need done, any specific requirements, materials needed, and any other important details..."}
              style={{
                width: "100%",
                height: "160px",
                padding: "20px",
                fontSize: "16px",
                border: "2px solid rgba(92, 225, 230, 0.2)",
                borderRadius: "15px",
                backgroundColor: "rgba(26, 26, 26, 0.8)",
                color: "white",
                outline: "none",
                transition: "all 0.3s ease",
                resize: "vertical",
                fontFamily: "inherit",
                backdropFilter: "blur(10px)",
                boxShadow: "inset 0 2px 10px rgba(0,0,0,0.3)",
                lineHeight: "1.6"
              }}
              className={styles["work-details-textarea"]}
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
            <div style={{ 
              display: "flex", 
              justifyContent: "flex-end", 
              alignItems: "center", 
              marginTop: "15px",
              fontSize: "14px",
              color: "#888"
            }}>
              <span style={{ 
                color: formData.workDetails.length > 450 ? "#ff5c5c" : "#5CE1E6",
                fontWeight: "600"
              }}>
                {formData.workDetails.length}/500
              </span>
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
        <Link 
          to="/available-helpers"
          state={{ 
            service: service || serviceType || 'General Service',
            description: description,
            serviceType: serviceType,
            bookingDetails: {
              ...formData,
              selectedLocation: selectedLocation
            }
          }}
          style={{ textDecoration: "none" }}
        >
          <button 
            className={styles["button"]}
            disabled={!formData.address || !formData.contactNumber || !formData.preferredDate || !formData.preferredTime}
            style={{
              background: (!formData.address || !formData.contactNumber || !formData.preferredDate || !formData.preferredTime) 
                ? "linear-gradient(135deg, #666, #888)" 
                : "linear-gradient(135deg, #5CE1E6, #00d4ff)",
              color: (!formData.address || !formData.contactNumber || !formData.preferredDate || !formData.preferredTime) 
                ? "#ccc" 
                : "#000",
              border: "none",
              borderRadius: "15px",
              padding: "18px 40px",
              fontSize: "18px",
              fontWeight: "700",
              cursor: (!formData.address || !formData.contactNumber || !formData.preferredDate || !formData.preferredTime) ? 'not-allowed' : 'pointer',
              transition: "all 0.3s ease",
              boxShadow: (!formData.address || !formData.contactNumber || !formData.preferredDate || !formData.preferredTime) 
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
        </Link>
      </div>
    </>
  );
};

export default BasicNeedsServiceUserDescription;
