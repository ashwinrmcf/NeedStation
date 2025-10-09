import React from 'react';

const ServiceDetailsModal = ({ service, isOpen, onClose, onAddToCart, onBookNow }) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">{service.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Service Image */}
          <div className="mb-6">
            <img 
              src={service.imgUrl} 
              alt={service.title}
              className="w-full h-64 object-cover rounded-xl"
            />
          </div>

          {/* Service Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Service Details</h3>
              <p className="text-gray-600 mb-4">{service.subtitle}</p>
              <p className="text-gray-700 leading-relaxed">{service.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Pricing & Duration</h3>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Current Price:</span>
                  <span className="text-2xl font-bold text-teal-600">{service.price}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Original Price:</span>
                  <span className="text-gray-500 line-through">{service.originalPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration:</span>
                  <span className="text-gray-900">{service.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">What's Included</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Professional trained staff",
                "Quality equipment and tools", 
                "Flexible scheduling",
                "24/7 customer support",
                "Insurance coverage",
                "Follow-up service"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-teal-600 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Customer Reviews</h3>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-400">
                  ⭐⭐⭐⭐⭐
                </div>
                <span className="text-lg font-semibold">{service.rating}</span>
                <span className="text-gray-600">(245 reviews)</span>
              </div>
              
              <div className="space-y-3">
                <div className="border-l-4 border-teal-500 pl-4">
                  <p className="text-gray-700 italic">"Excellent service! Very professional and thorough. Highly recommend."</p>
                  <p className="text-sm text-gray-500 mt-1">- Priya S., Mumbai</p>
                </div>
                <div className="border-l-4 border-teal-500 pl-4">
                  <p className="text-gray-700 italic">"Great experience. The staff was punctual and did a fantastic job."</p>
                  <p className="text-sm text-gray-500 mt-1">- Rajesh K., Delhi</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Frequently Asked Questions</h3>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">How do I book this service?</h4>
                <p className="text-gray-600 text-sm">You can book by clicking the "Book Now" button or adding to cart and proceeding with checkout.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">What if I need to reschedule?</h4>
                <p className="text-gray-600 text-sm">You can reschedule up to 2 hours before the appointment time without any charges.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Is there a guarantee?</h4>
                <p className="text-gray-600 text-sm">Yes, we provide 100% satisfaction guarantee. If you're not satisfied, we'll make it right.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button 
              onClick={() => {
                onAddToCart(service);
                onClose();
              }}
              className="flex-1 px-6 py-3 border border-teal-500 text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition-colors duration-200"
            >
              Add to Cart
            </button>
            <button 
              onClick={() => {
                onBookNow();
                onClose();
              }}
              className="flex-1 px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsModal;
