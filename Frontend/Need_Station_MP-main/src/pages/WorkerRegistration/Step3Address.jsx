import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProfessionalDetailsPage({ data, updateForm, next, prev, workerId }) {
  // Check for workerId in useEffect to avoid state updates during render
  useEffect(() => {
    // Try to get workerId from sessionStorage if not provided as prop
    const sessionWorkerId = sessionStorage.getItem('sessionWorkerId');
    const localWorkerId = workerId || sessionWorkerId;
    
    if (!localWorkerId) {
      console.error("Worker ID is required for this step");
      console.log("Available workerId:", workerId);
      console.log("Session workerId:", sessionWorkerId);
      console.log("Using workerId for Step 3:", localWorkerId);
    }
  }, [workerId]);

  // State for form data - initialize with data from parent
  const [formData, setFormData] = useState({
    services: data.services || {
      elderlyCare: false,
      nursingCare: false,
      caretakerAtHome: false,
      bedriddenPatientCare: false,
      parkinsonsCare: false,
      physiotherapy: false,
      homeSecurityGuard: false,
      motherBabyCare: false,
      paralysisCare: false,
      pathologyCare: false,
      diabetesManagement: false,
      healthCheckUpServices: false,
      postSurgeryCare: false
    },
    experience: data.experience || '',
    workType: data.workType || '',
    availability: data.availability || {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    },
    timeSlots: data.timeSlots || {
      morning: false,
      afternoon: false,
      evening: false
    },
    languages: data.languages || {
      english: false,
      hindi: false,
      tamil: false,
      telugu: false,
      kannada: false,
      malayalam: false,
      bengali: false,
      marathi: false
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to get proper service labels
  const getServiceLabel = (service) => {
    const serviceLabels = {
      elderlyCare: 'Elderly Care',
      nursingCare: 'Nursing Care',
      caretakerAtHome: 'Caretaker at Home',
      bedriddenPatientCare: 'Bedridden Patient Care',
      parkinsonsCare: 'Parkinsons Care',
      physiotherapy: 'Physiotherapy',
      homeSecurityGuard: 'Home Security Guard',
      motherBabyCare: 'Mother and Baby Care',
      paralysisCare: 'Paralysis Care',
      pathologyCare: 'Pathology Care',
      diabetesManagement: 'Diabetes Management',
      healthCheckUpServices: 'Health Check Up Services',
      postSurgeryCare: 'Post Surgery Care'
    };
    return serviceLabels[service] || service;
  };

  // Update local state when parent data changes (for navigation)
  useEffect(() => {
    if (data.services || data.experience || data.workType || data.availability || data.languages) {
      setFormData({
        services: data.services || formData.services,
        experience: data.experience || formData.experience,
        workType: data.workType || formData.workType,
        availability: data.availability || formData.availability,
        timeSlots: data.timeSlots || formData.timeSlots,
        languages: data.languages || formData.languages
      });
    }
  }, [data]);

  // Handle checkbox changes
  const handleCheckboxChange = (category, item) => {
    const updatedCategory = {
      ...formData[category],
      [item]: !formData[category][item]
    };
    
    setFormData({
      ...formData,
      [category]: updatedCategory
    });
    
    // Also update parent form data
    updateForm({
      [category]: updatedCategory
    });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Also update parent form data
    updateForm({
      [name]: value
    });
  };

  // Handle radio button changes
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Also update parent form data
    updateForm({
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.experience || !formData.workType) {
      alert("Please select your experience level and work type");
      return;
    }
    
    try {
      // Get workerId from prop or sessionStorage
      const sessionWorkerId = sessionStorage.getItem('sessionWorkerId');
      const localStorageWorkerId = localStorage.getItem('workerId');
      const currentWorkerId = workerId || sessionWorkerId || localStorageWorkerId;
      
      // Comprehensive debugging
      console.log("=== STEP 3 WORKER ID DEBUG ===");
      console.log("workerId prop:", workerId);
      console.log("sessionWorkerId:", sessionWorkerId);
      console.log("localStorageWorkerId:", localStorageWorkerId);
      console.log("currentWorkerId:", currentWorkerId);
      console.log("All sessionStorage keys:", Object.keys(sessionStorage));
      console.log("All localStorage keys:", Object.keys(localStorage));
      
      if (!currentWorkerId || currentWorkerId === 'null' || currentWorkerId === 'undefined') {
        console.error("No valid worker ID found!");
        alert("Worker ID not found. Please restart the registration process from Step 1.");
        return;
      }
      
      // Prepare data for backend
      const workerData = {
        // Convert objects to JSON strings for backend storage
        services: JSON.stringify(formData.services),
        experience: formData.experience,
        workType: formData.workType,
        availability: JSON.stringify({
          ...formData.availability,
          ...formData.timeSlots
        }),
        languages: JSON.stringify(formData.languages)
      };
      
      // API URL
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      
      console.log("Sending Step 3 data with workerId:", currentWorkerId);
      console.log("API URL:", `${API_URL}/workers/register/step3?workerId=${currentWorkerId}`);
      
      // Send data to backend
      const response = await axios.post(
        `${API_URL}/workers/register/step3?workerId=${currentWorkerId}`,
        workerData
      );
      
      console.log("Step 3 saved successfully:", response.data);
      
      // Proceed to next step
      next();
    } catch (error) {
      console.error("Error saving professional details:", error);
      alert(error.response?.data?.error || "Failed to save your information. Please try again.");
    }
  };

  return (
    <div className="min-h-screen text-white p-4">
      {/* Progress Alert */}
      <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-8 flex items-center">
        <div className="text-yellow-600 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p>Few more steps to see your earnings!</p>
      </div>

      <h1 className="text-4xl font-bold text-center mb-8">
        <span className="text-teal-400">Professional</span> Details
      </h1>

      <div className="max-w-2xl mx-auto">
        {/* Services Offered */}
        <div className="mb-8 p-6 border border-gray-700 rounded-lg bg-gray-800/50">
          <h2 className="text-xl font-semibold mb-4 text-teal-400">Services Offered</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.keys(formData.services).map((service) => (
              <div key={service} className="flex items-center">
                <div className="relative">
                  <input
                    type="checkbox"
                    id={service}
                    checked={formData.services[service]}
                    onChange={() => handleCheckboxChange('services', service)}
                    className="opacity-0 absolute h-5 w-5 cursor-pointer"
                  />
                  <div className={`border-2 rounded-md w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${
                    formData.services[service] ? 'bg-teal-500 border-teal-500' : 'border-gray-500'
                  }`}>
                    {formData.services[service] && (
                      <svg className="fill-current w-3 h-3 text-white pointer-events-none" viewBox="0 0 20 20">
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                      </svg>
                    )}
                  </div>
                </div>
                <label htmlFor={service} className="capitalize select-none cursor-pointer font-normal">
                  {getServiceLabel(service)}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Years of Experience */}
        <div className="mb-8 p-6 border border-gray-700 rounded-lg bg-gray-800/50">
          <h2 className="text-xl font-semibold mb-4 text-teal-400">Years of Experience</h2>
          <select
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-800 text-white text-base rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            <option value="">Select experience</option>
            <option value="0-1">Less than 1 year</option>
            <option value="1-3">1–3 years</option>
            <option value="3-5">3–5 years</option>
            <option value="5-10">5–10 years</option>
            <option value="10+">More than 10 years</option>
          </select>
        </div>

        {/* Work Type Preference */}
        <div className="mb-8 p-6 border border-gray-700 rounded-lg bg-gray-800/50">
          <h2 className="text-xl font-semibold mb-4 text-teal-400">Work Type Preference</h2>
          <div className="flex flex-wrap gap-6">
            {['Full-time', 'Part-time', 'On-demand'].map((type) => (
              <div key={type} className="flex items-center">
                <div className="relative">
                  <input
                    type="radio"
                    id={type}
                    name="workType"
                    value={type}
                    checked={formData.workType === type}
                    onChange={handleRadioChange}
                    className="opacity-0 absolute h-5 w-5 cursor-pointer"
                  />
                  <div className={`border-2 rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${
                    formData.workType === type ? 'border-teal-500' : 'border-gray-500'
                  }`}>
                    {formData.workType === type && (
                      <div className="rounded-full w-3 h-3 bg-teal-500"></div>
                    )}
                  </div>
                </div>
                <label htmlFor={type} className="select-none cursor-pointer font-normal">{type}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="mb-8 p-6 border border-gray-700 rounded-lg bg-gray-800/50">
          <h2 className="text-xl font-semibold mb-4 text-teal-400">Availability</h2>
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-white">Days of the week</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.keys(formData.availability).map((day) => (
                <div key={day} className="flex items-center">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={day}
                      checked={formData.availability[day]}
                      onChange={() => handleCheckboxChange('availability', day)}
                      className="opacity-0 absolute h-5 w-5 cursor-pointer"
                    />
                    <div className={`border-2 rounded-md w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${
                      formData.availability[day] ? 'bg-teal-500 border-teal-500' : 'border-gray-500'
                    }`}>
                      {formData.availability[day] && (
                        <svg className="fill-current w-3 h-3 text-white pointer-events-none" viewBox="0 0 20 20">
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <label htmlFor={day} className="capitalize select-none cursor-pointer font-normal">
                    {day}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3 text-white">Time slots</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(formData.timeSlots).map((slot) => (
                <div key={slot} className="flex items-center">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={slot}
                      checked={formData.timeSlots[slot]}
                      onChange={() => handleCheckboxChange('timeSlots', slot)}
                      className="opacity-0 absolute h-5 w-5 cursor-pointer"
                    />
                    <div className={`border-2 rounded-md w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${
                      formData.timeSlots[slot] ? 'bg-teal-500 border-teal-500' : 'border-gray-500'
                    }`}>
                      {formData.timeSlots[slot] && (
                        <svg className="fill-current w-3 h-3 text-white pointer-events-none" viewBox="0 0 20 20">
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <label htmlFor={slot} className="capitalize select-none cursor-pointer font-normal">
                    {slot}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Languages Spoken */}
        <div className="mb-8 p-6 border border-gray-700 rounded-lg bg-gray-800/50">
          <h2 className="text-xl font-semibold mb-4 text-teal-400">Languages Spoken</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.keys(formData.languages).map((language) => (
              <div key={language} className="flex items-center">
                <div className="relative">
                  <input
                    type="checkbox"
                    id={language}
                    checked={formData.languages[language]}
                    onChange={() => handleCheckboxChange('languages', language)}
                    className="opacity-0 absolute h-5 w-5 cursor-pointer"
                  />
                  <div className={`border-2 rounded-md w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${
                    formData.languages[language] ? 'bg-teal-500 border-teal-500' : 'border-gray-500'
                  }`}>
                    {formData.languages[language] && (
                      <svg className="fill-current w-3 h-3 text-white pointer-events-none" viewBox="0 0 20 20">
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                      </svg>
                    )}
                  </div>
                </div>
                <label htmlFor={language} className="capitalize select-none cursor-pointer">
                  {language}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button onClick={prev}
            type="button"
            className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-8 rounded-md font-medium transition-colors duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          <button onClick={handleSubmit}
            type="button"
            className="bg-teal-500 hover:bg-teal-400 text-white py-3 px-8 rounded-md font-medium transition-colors duration-200 flex items-center"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}