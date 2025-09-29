import React from 'react';
import { useBookingModal } from './BookingModalProvider';

const TestModal = () => {
  const { openBookingModal } = useBookingModal();

  const testServices = [
    "Parkinson's Care",
    "Elderly Care", 
    "Nursing Care",
    "Home Security Guard",
    "Health Check Up Services"
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Test Booking Modal</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testServices.map((service) => (
          <button
            key={service}
            onClick={() => openBookingModal(service)}
            className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book {service}
          </button>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">How to Test:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click any service button above</li>
          <li>Modal should open with 3-step booking flow</li>
          <li>Fill out Step 1: Basic Info (Name, Phone, Location)</li>
          <li>Step 2: Service Details (dynamic based on service)</li>
          <li>Step 3: Schedule (Date, Time, Urgency)</li>
          <li>Click "Confirm Booking" to complete</li>
        </ol>
      </div>
    </div>
  );
};

export default TestModal;
