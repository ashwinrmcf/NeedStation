import React, { createContext, useContext, useState } from 'react';
import BookingModal from './BookingModal';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
      />
    </BookingModalContext.Provider>
  );
};
