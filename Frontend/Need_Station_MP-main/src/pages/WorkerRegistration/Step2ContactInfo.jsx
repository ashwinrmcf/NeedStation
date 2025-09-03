import { useState, useEffect } from 'react';
import { MapPin, CheckCircle, HelpCircle } from 'lucide-react';
import axios from 'axios';

export default function LocationDetailsForm({ data, updateForm, next, prev, workerId }) {
  // Initialize form with data from parent component or default values
  const [formData, setFormData] = useState({
    permanentAddress: data.permanentAddress || '',
    currentAddress: data.currentAddress || '',
    city: data.city || '',
    pincode: data.pincode || '',
    serviceAreas: data.serviceAreas ? data.serviceAreas.split(',') : [],
    openToTravel: data.openToTravel || false
  });
  
  // Update form data when parent data changes (for navigation back/forth)
  useEffect(() => {
    setFormData(prev => {
      const newData = {
        permanentAddress: data.permanentAddress || '',
        currentAddress: data.currentAddress || '',
        city: data.city || '',
        pincode: data.pincode || '',
        serviceAreas: data.serviceAreas ? data.serviceAreas.split(',') : [],
        openToTravel: data.openToTravel || false
      };
      
      // Only update if data has actually changed to prevent infinite loops
      if (JSON.stringify(prev) !== JSON.stringify(newData)) {
        return newData;
      }
      return prev;
    });
  }, [data]);
  
  // Check for workerId in useEffect to avoid state updates during render
  useEffect(() => {
    if (!workerId) {
      console.error("Worker ID is required for this step");
    }
  }, [workerId]);

  const [availableAreas] = useState([
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: newValue
      };
      
      // Update parent form data immediately
      updateForm({
        [name]: newValue
      });
      
      return updatedData;
    });
  };

  const handleAreaSelect = (area) => {
    setFormData(prev => {
      let updatedAreas;
      
      if (prev.serviceAreas.includes(area)) {
        updatedAreas = prev.serviceAreas.filter(a => a !== area);
      } else {
        updatedAreas = [...prev.serviceAreas, area];
      }
      
      // Update parent form data immediately
      updateForm({
        serviceAreas: updatedAreas.join(',')
      });
      
      return {
        ...prev,
        serviceAreas: updatedAreas
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.permanentAddress || !formData.city || !formData.pincode) {
      alert("Please fill in all required fields");
      return;
    }
    
    try {
      // Prepare data for backend
      const workerData = {
        permanentAddress: formData.permanentAddress,
        currentAddress: formData.currentAddress,
        city: formData.city,
        pincode: formData.pincode,
        serviceAreas: formData.serviceAreas.join(','),
        openToTravel: formData.openToTravel
      };
      
      // API URL
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      
      // Send data to backend
      const response = await axios.post(
        `${API_URL}/worker/register/step2?workerId=${workerId}`,
        workerData
      );
      
      console.log("Step 2 saved successfully:", response.data);
      
      // Proceed to next step
      next();
    } catch (error) {
      console.error("Error saving contact information:", error);
      alert(error.response?.data?.error || "Failed to save your information. Please try again.");
    }
  };

  return (
    <div className="min-h-screen  text-white">
  
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Register as a <span className="text-teal-400">worker</span>
        </h2>

        {/* Progress Indicator */}
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md my-6 flex items-center">
          <HelpCircle className="mr-2 h-5 w-5" />
          <p className="text-sm md:text-base">Few more steps to see your earnings!</p>
        </div>

        <h3 className="text-2xl font-bold text-center mb-8">
          <span className="text-teal-400">Location</span> Details
        </h3>

        <div className="space-y-6">
          {/* Permanent Address */}
          <div>
            <label htmlFor="permanentAddress" className="block mb-2">Permanent Address <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="permanentAddress"
              name="permanentAddress"
              value={formData.permanentAddress}
              onChange={handleChange}
              placeholder="Enter your permanent address"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>
          
          {/* Current Address */}
          <div>
            <label htmlFor="currentAddress" className="block mb-2">Current Address (if different)</label>
            <input
              type="text"
              id="currentAddress"
              name="currentAddress"
              value={formData.currentAddress}
              onChange={handleChange}
              placeholder="Enter your current address"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* City & Pincode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block mb-2">City <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
            </div>
            <div>
              <label htmlFor="pincode" className="block mb-2">Pincode <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
            </div>
          </div>

          {/* Service Areas */}
          <div>
            <label className="block mb-2">Areas/Cities you can serve</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {availableAreas.map((area) => (
                <div 
                  key={area}
                  onClick={() => handleAreaSelect(area)}
                  className={`
                    p-2 border rounded-md cursor-pointer flex items-center justify-center text-center
                    ${formData.serviceAreas.includes(area) 
                      ? 'bg-teal-400 text-gray-900 border-teal-400' 
                      : 'bg-gray-800 border-gray-700 hover:border-teal-400'
                    }
                  `}
                >
                  {area}
                  {formData.serviceAreas.includes(area) && (
                    <CheckCircle className="ml-1 h-4 w-4" />
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">Select all areas where you can provide services</p>
          </div>

          {/* Open to Travel */}
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="openToTravel"
                checked={formData.openToTravel}
                onChange={handleChange}
                className="w-5 h-5 accent-teal-400"
              />
              <span>Are you open to travel?</span>
            </label>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <button onClick={prev}
              type="button"
              className="bg-transparent border border-gray-600 text-white rounded-md px-6 py-3 hover:bg-gray-800"
            >
              Back
            </button>
            <button onClick={handleSubmit}
              type="button"
              className="bg-teal-400 text-gray-900 rounded-md px-6 py-3 hover:bg-teal-500"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}