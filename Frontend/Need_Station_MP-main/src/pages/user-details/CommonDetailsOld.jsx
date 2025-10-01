import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "../BasicNeeds/BasicNeedsServiceUserDescription.module.css";
import ScrollToTop from "../../hooks/ScrollToTop";
import LeafletMapPicker from "../../components/Map/LeafletMapPicker.jsx";
import { FaMapMarkerAlt, FaPhone, FaClock, FaClipboardList, FaCheckCircle, FaStar, FaUser, FaBirthdayCake } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { MdAccessTime, MdContactPhone } from "react-icons/md";

const CommonDetails = ({ onDataChange, initialData = {} }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    address: "",
    landmark: "",
    pincode: "",
    preferredDate: "",
    preferredTime: "",
    duration: "",
    ...initialData
  });
  const [dateError, setDateError] = useState("");

  // Local storage keys for persistence across reloads
  const FORM_DATA_KEY = 'needstation_common_form_data';
  const LOCATION_DATA_KEY = 'needstation_common_location_data';
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get service source from location state or localStorage
  const [serviceSource, setServiceSource] = useState(null);
  
  useEffect(() => {
    // Check if service source is passed via navigation state
    if (location.state?.service) {
      setServiceSource(location.state.service);
      localStorage.setItem('needstation_service_source', location.state.service);
    } else {
      // Try to get from localStorage
      const storedService = localStorage.getItem('needstation_service_source');
      if (storedService) {
        setServiceSource(storedService);
      }
    }
  }, [location.state]);
  
  // Service to route mapping
  const getServiceRoute = (service) => {
    const serviceRoutes = {
      'Home Security Guard': '/user-details/security-guard',
      'Parkinsons Care': '/user-details/parkinsons-care',
      'Bedridden Patient Care': '/user-details/bedridden-patient-care',
      'Mother and Baby Care': '/user-details/mother-baby-care',
      'Paralysis Care': '/user-details/paralysis-care',
      'Elderly Care': '/user-details/elderly-care',
      'Nursing Care': '/user-details/nursing-care',
      'Pathology Care': '/user-details/pathology-care',
      'Diabetes Management': '/user-details/diabetes-management',
      'Health Check Up Services': '/user-details/health-check-up-services',
      'Physiotherapy': '/user-details/physiotherapy',
      'Post Surgery Care': '/user-details/post-surgery-care',
      'Caretaker at Home': '/user-details/caretaker-at-home'
    };
    return serviceRoutes[service] || '/user-details/security-guard'; // Default fallback
  };
  
  // Calculate date limits for booking (today to 3 days ahead)
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 3);
  
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  const minDateString = formatDateForInput(today);
  const maxDateString = formatDateForInput(maxDate);

  // Load data from localStorage on component mount
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
  }, []);

  // Notify parent component when data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange({ formData, selectedLocation });
    }
  }, [formData, selectedLocation, onDataChange]);

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
    
    // Auto-fill address field with selected location address
    const updatedFormData = {
      ...formData,
      address: location.address || formData.address
    };
    setFormData(updatedFormData);
    // Save both form data and location data to localStorage
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(updatedFormData));
    localStorage.setItem('needstation_common_location_data', JSON.stringify(location));
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-4">
      <ScrollToTop />
      
      {/* Header */}
      <div className="w-full max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Service <span className="text-teal-400">Details</span>
        </h1>
        <h2 className="text-3xl font-bold mb-0">Tell us about your requirements!</h2>
      </div>

      <div className="w-full max-w-lg mx-auto space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-2xl font-bold mb-4 text-teal-400 flex items-center">
            <FaUser className="mr-3" />
            Personal Information
          </h3>
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
          <FaUser style={{ color: "#5CE1E6", marginRight: "15px", fontSize: "28px" }} />
          Personal Information
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
              Full Name of Person Receiving Service *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter full name"
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
            <div>
              <label style={{ 
                color: "#5CE1E6", 
                fontSize: "16px", 
                fontWeight: "600", 
                display: "block", 
                marginBottom: "12px",
                textShadow: "0 0 10px rgba(92, 225, 230, 0.3)"
              }}>
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Age"
                min="1"
                max="120"
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
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
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
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
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
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
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
              Contact Number *
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
        </div>
      </div>

      {/* Map and Address Section */}
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
          Service Location
        </h1>
        <div style={{ marginTop: "20px", position: "relative" }}>
          <LeafletMapPicker onLocationSelect={handleLocationSelect} />
          
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
          Full Address (with landmark, PIN code)
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

      {/* Preferred Service Date & Time */}
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
          Preferred Service Date & Time
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

      {/* Duration / Expected Period of Service */}
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
          Duration / Expected Period of Service
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
              Expected Duration *
            </label>
            <select
              name="duration"
              value={formData.duration}
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
              <option value="">Select duration</option>
              <option value="1-2 hours">1-2 hours</option>
              <option value="3-4 hours">3-4 hours</option>
              <option value="half-day">Half day (4-6 hours)</option>
              <option value="full-day">Full day (8+ hours)</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="ongoing">Ongoing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className={styles["button-container"]} style={{
        padding: "40px 20px 60px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)"
      }}>
        <button 
          className={styles["button"]}
          disabled={!formData.fullName || !formData.gender || !formData.contactNumber || !formData.address || !formData.pincode || !formData.preferredDate || !formData.preferredTime || !formData.duration || !selectedLocation}
          onClick={(e) => {
            e.preventDefault();
            
            // Validate required fields
            if (!formData.fullName || !formData.gender || !formData.contactNumber || !formData.address || !formData.pincode || !formData.preferredDate || !formData.preferredTime || !formData.duration) {
              alert("Please fill in all required fields");
              return;
            }
            
            if (!selectedLocation) {
              alert("Please select a location on the map");
              return;
            }
            
            // Navigate to appropriate service unique details page
            const targetRoute = getServiceRoute(serviceSource);
            navigate(targetRoute, {
              state: { 
                commonData: { formData, selectedLocation }
              }
            });
          }}
          style={{
            background: (!formData.fullName || !formData.gender || !formData.contactNumber || !formData.address || !formData.pincode || !formData.preferredDate || !formData.preferredTime || !formData.duration || !selectedLocation) 
              ? "linear-gradient(135deg, #666, #888)" 
              : "linear-gradient(135deg, #5CE1E6, #00d4ff)",
            color: (!formData.fullName || !formData.gender || !formData.contactNumber || !formData.address || !formData.pincode || !formData.preferredDate || !formData.preferredTime || !formData.duration || !selectedLocation) 
              ? "#ccc" 
              : "#000",
            border: "none",
            borderRadius: "15px",
            padding: "18px 40px",
            fontSize: "18px",
            fontWeight: "700",
            cursor: (!formData.fullName || !formData.gender || !formData.contactNumber || !formData.address || !formData.pincode || !formData.preferredDate || !formData.preferredTime || !formData.duration || !selectedLocation) ? 'not-allowed' : 'pointer',
            transition: "all 0.3s ease",
            boxShadow: (!formData.fullName || !formData.gender || !formData.contactNumber || !formData.address || !formData.pincode || !formData.preferredDate || !formData.preferredTime || !formData.duration || !selectedLocation) 
              ? "none" 
              : "0 10px 30px rgba(92, 225, 230, 0.4), 0 0 0 1px rgba(92, 225, 230, 0.2)",
            textTransform: "uppercase",
            letterSpacing: "1px",
            minWidth: "320px",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
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
          <FaCheckCircle style={{ marginRight: "10px" }} />
          Continue to Service Details
        </button>
      </div>
    </div>
  );
};

export default CommonDetails;