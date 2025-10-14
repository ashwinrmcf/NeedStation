import React, { createContext, useContext, useState, useEffect } from 'react';
import BookingModal from './BookingModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

const BookingModalContext = createContext();

export const useBookingModal = () => {
  const context = useContext(BookingModalContext);
  if (!context) {
    throw new Error('useBookingModal must be used within a BookingModalProvider');
  }
  return context;
};

export const BookingModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [userProfileData, setUserProfileData] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch user profile data when user is available
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && user.id) {
        try {
          const response = await fetch(`http://localhost:8080/api/user/profile/${user.id}`);
          if (response.ok) {
            const profileData = await response.json();
            setUserProfileData(profileData);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  // Create user profile with phone verification status
  const userProfile = user ? {
    ...user,
    id: user.id || user.userId || userProfileData?.id || (localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')) : null),
    userId: user.id || user.userId || userProfileData?.id || (localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')) : null),
    phone: userProfileData?.contactNumber || user.phone,
    mobile: userProfileData?.contactNumber || user.phone,
    phoneVerified: localStorage.getItem('mobileVerified') === 'true' || localStorage.getItem('phoneVerified') === 'true'
  } : null;
  
  // Debug log
  console.log('🔍 BookingModalProvider - user:', user);
  console.log('🔍 BookingModalProvider - userProfile:', userProfile);
  console.log('🔍 BookingModalProvider - localStorage userId:', localStorage.getItem('userId'));

  const openBookingModal = (serviceName) => {
    setCurrentService(serviceName);
    setIsModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsModalOpen(false);
    setCurrentService(null);
  };

  const handleBookingComplete = (bookingData) => {
    console.log('Booking completed:', bookingData);
    
    // Store booking data in localStorage for persistence
    localStorage.setItem('needstation_latest_booking', JSON.stringify(bookingData));
    
    // Navigate to available helpers or confirmation page
    navigate('/available-helpers', {
      state: {
        service: bookingData.serviceName,
        bookingDetails: bookingData,
        fromModal: true
      }
    });
    
    // Show success notification (you can integrate with your notification system)
    // toast.success(`Booking confirmed! ID: ${bookingData.bookingId}`);
  };

  const contextValue = {
    isModalOpen,
    currentService,
    openBookingModal,
    closeBookingModal,
    handleBookingComplete
  };

  return (
    <BookingModalContext.Provider value={contextValue}>
      {children}
      <BookingModal
        isOpen={isModalOpen}
        onClose={closeBookingModal}
        serviceName={currentService}
        onBookingComplete={handleBookingComplete}
        userProfile={userProfile}
      />
    </BookingModalContext.Provider>
  );
};
