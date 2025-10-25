// Booking API Service
// Handles all API calls related to bookings and services

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Get service configuration (service details + subservices + formalities)
 * @param {string} serviceCode - Service code (e.g., 'ELDERLY_CARE')
 * @returns {Promise} Service configuration
 */
export const getServiceConfiguration = async (serviceCode) => {
  try {
    console.log('🔍 Fetching service config from API:', `${API_BASE_URL}/services/${serviceCode}`);
    const response = await fetch(`${API_BASE_URL}/services/${serviceCode}`);
    console.log('📥 Response status:', response.status);
    
    const data = await response.json();
    console.log('📥 Response data:', data);
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch service configuration');
    }
    
    console.log('✅ Service config fetched successfully:', data.service);
    return data;
  } catch (error) {
    console.error('❌ Error fetching service configuration:', error);
    console.error('❌ Service code was:', serviceCode);
    throw error;
  }
};

/**
 * Get all active services
 * @returns {Promise} List of services
 */
export const getAllServices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/services`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch services');
    }
    
    return data.services;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

/**
 * Create a new booking
 * @param {Object} bookingData - Booking data
 * @returns {Promise} Created booking details
 */
export const createBooking = async (bookingData) => {
  try {
    console.log('📤 Sending booking request to:', `${API_BASE_URL}/bookings`);
    console.log('📦 Booking data:', JSON.stringify(bookingData, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    console.log('📥 Response status:', response.status);
    
    const data = await response.json();
    console.log('📥 Response data:', data);
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || `Server error: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    console.error('❌ Error details:', error.message);
    throw error;
  }
};

/**
 * Get user's bookings
 * @param {number} userId - User ID
 * @returns {Promise} List of bookings
 */
export const getUserBookings = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/user/${userId}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch bookings');
    }
    
    return data.bookings;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

/**
 * Get booking by ID
 * @param {number} bookingId - Booking ID
 * @returns {Promise} Booking details
 */
export const getBookingById = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch booking');
    }
    
    return data.booking;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

/**
 * Get booking by booking number
 * @param {string} bookingNumber - Booking number (e.g., 'BK20251016001')
 * @returns {Promise} Booking details
 */
export const getBookingByNumber = async (bookingNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/number/${bookingNumber}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch booking');
    }
    
    return data.booking;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

/**
 * Update booking status
 * @param {number} bookingId - Booking ID
 * @param {string} status - New status
 * @param {number} updatedBy - User ID who is updating
 * @returns {Promise} Updated booking
 */
export const updateBookingStatus = async (bookingId, status, updatedBy) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, updatedBy }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to update booking status');
    }
    
    return data.booking;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

/**
 * Assign worker to booking
 * @param {number} bookingId - Booking ID
 * @param {number} workerId - Worker ID
 * @param {number} updatedBy - User ID who is assigning
 * @returns {Promise} Updated booking
 */
export const assignWorker = async (bookingId, workerId, updatedBy) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/assign`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ workerId, updatedBy }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to assign worker');
    }
    
    return data.booking;
  } catch (error) {
    console.error('Error assigning worker:', error);
    throw error;
  }
};

/**
 * Rate a booking
 * @param {number} bookingId - Booking ID
 * @param {number} rating - Rating (1-5)
 * @param {string} feedback - Feedback text
 * @returns {Promise} Updated booking
 */
export const rateBooking = async (bookingId, rating, feedback) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating, feedback }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to submit rating');
    }
    
    return data.booking;
  } catch (error) {
    console.error('Error rating booking:', error);
    throw error;
  }
};
