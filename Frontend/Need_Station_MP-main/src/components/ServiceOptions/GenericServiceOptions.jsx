import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useBookingModal } from '../BookingModal/BookingModalProvider';

const GenericServiceOptions = ({ 
  serviceName, 
  serviceDescription, 
  serviceHighlight, 
  services, 
  trustIndicators, 
  detailedInfo 
}) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animatedStats, setAnimatedStats] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const { openBookingModal } = useBookingModal();

  // All 13 services for left navigation
  const allServices = [
    { id: 'elderly-care', name: 'Elderly Care', icon: '👨‍⚕️', link: '/services/elderly-care' },
    { id: 'nursing-care', name: 'Nursing Care', icon: '🏥', link: '/services/nursing-care' },
    { id: 'caretaker-at-home', name: 'Caretaker at Home', icon: '👥', link: '/services/caretaker-at-home' },
    { id: 'bedridden-patient-care', name: 'Bedridden Patient Care', icon: '🏠', link: '/services/bedridden-patient-care' },
    { id: 'parkinsons-care', name: 'Parkinsons Care', icon: '⚕️', link: '/services/parkinsons-care' },
    { id: 'physiotherapy', name: 'Physiotherapy', icon: '💪', link: '/services/physiotherapy' },
    { id: 'security-guard', name: 'Home Security Guard', icon: '🔒', link: '/services/security-guard' },
    { id: 'mother-baby-care', name: 'Mother and Baby Care', icon: '👩‍👧‍👦', link: '/services/mother-baby-care' },
    { id: 'paralysis-care', name: 'Paralysis Care', icon: '🩺', link: '/services/paralysis-care' },
    { id: 'pathology-care', name: 'Pathology Care', icon: '🧪', link: '/services/pathology-care' },
    { id: 'diabetes-management', name: 'Diabetes Management', icon: '📊', link: '/services/diabetes-management' },
    { id: 'health-check-up', name: 'Health Check Up Services', icon: '✅', link: '/services/health-check-up-services' },
    { id: 'post-surgery-care', name: 'Post Surgery Care', icon: '🔄', link: '/services/post-surgery-care' }
  ];

  // Service categories for current page filtering
  const serviceCategories = [
    { id: 'all', name: 'All Services', icon: '🏠', count: services.length },
    { id: 'residential', name: 'Residential Security', icon: '🏡', count: services.filter(s => s.category === 'residential').length },
    { id: 'corporate', name: 'Corporate Security', icon: '🏢', count: services.filter(s => s.category === 'corporate').length },
    { id: 'personal', name: 'Personal Security', icon: '👤', count: services.filter(s => s.category === 'personal').length },
    { id: 'night', name: 'Night Watch', icon: '🌙', count: services.filter(s => s.category === 'night').length }
  ];

  // Animate numbers when component mounts
  useEffect(() => {
    const animateNumber = (target, key) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, 30);
    };

    // Animate trust indicators
    trustIndicators.forEach(indicator => {
      animateNumber(indicator.value, indicator.key);
    });
  }, [trustIndicators]);

  const handleBookNow = (e) => {
    e.preventDefault();
    openBookingModal(serviceName);
  };

  const addToCart = (service) => {
    const existingItem = cartItems.find(item => item.id === service.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === service.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...service, quantity: 1 }]);
    }
  };

  const removeFromCart = (serviceId) => {
    setCartItems(cartItems.filter(item => item.id !== serviceId));
  };

  const updateQuantity = (serviceId, quantity) => {
    if (quantity === 0) {
      removeFromCart(serviceId);
    } else {
      setCartItems(cartItems.map(item => 
        item.id === serviceId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseInt(item.price.replace(/[₹,]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const filteredAllServices = allServices.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ServiceCard = ({ service, index }) => (
    <div 
      className="relative rounded-xl border hover:shadow-md transition-all duration-200 overflow-hidden flex flex-row bg-white"
      style={{
        borderColor: '#e5e7eb'
      }}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden w-32 h-24 flex-shrink-0">
        <img
          src={service.imgUrl}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        
        {/* Rating Badge */}
        <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1 shadow-sm">
          ⭐ {service.rating}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title and Description */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold mb-1 text-gray-900">
            {service.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {service.subtitle}
          </p>
        </div>

        {/* Price and Actions Row */}
        <div className="flex items-center justify-between mt-auto">
          {/* Price Section */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              {service.price}
            </span>
            <span className="text-sm text-gray-500 line-through">
              {service.originalPrice}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedService(service)}
              className="px-3 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              View Details
            </button>
            
            <button 
              onClick={() => addToCart(service)}
              className="px-3 py-2 border border-teal-500 text-teal-600 text-sm font-medium rounded-lg hover:bg-teal-50 transition-colors duration-200"
            >
              Add to Cart
            </button>
            
            <button 
              onClick={handleBookNow}
              className="px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-8" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="text-center mb-12">
          <h2 className="text-6xl font-bold mb-6 leading-tight" style={{ color: 'var(--text-primary)' }}>
            <span style={{ background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{serviceName}</span> Services
          </h2>
          <p className="text-xl max-w-4xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {serviceDescription}
            <br />
            <span className="font-semibold" style={{ color: 'var(--accent-secondary)' }}>{serviceHighlight}</span>
          </p>
          
          {/* Animated Trust Indicators */}
          <div className="flex justify-center items-center gap-8 mt-8 flex-wrap">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="flex items-center gap-2 rounded-full px-4 py-2 shadow-lg" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                <span className="text-2xl">{indicator.icon}</span>
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {animatedStats[indicator.key] || 0}{indicator.suffix} {indicator.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Navigation Panel */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <div className="sticky top-6 space-y-6">
              {/* Search Container */}
              <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Search Services</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-4 pr-12 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl" style={{ color: 'var(--text-secondary)' }}>
                    🔍
                  </div>
                </div>
              </div>

              {/* All Services List */}
              <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>All Services</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto overflow-x-hidden">
                  {filteredAllServices.map((service) => (
                    <NavLink
                      key={service.id}
                      to={service.link}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:shadow-md hover:transform hover:scale-102 ${
                          isActive ? 'shadow-lg transform scale-105' : ''
                        }`
                      }
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? 'var(--accent-secondary)' : 'var(--bg-primary)',
                        color: isActive ? 'white' : 'var(--text-primary)',
                        border: `2px solid ${isActive ? 'var(--accent-secondary)' : 'var(--border-color)'}`,
                        textDecoration: 'none'
                      })}
                    >
                      <span className="text-xl flex-shrink-0">{service.icon}</span>
                      <span className="font-medium text-sm truncate">{service.name}</span>
                    </NavLink>
                  ))}
                </div>
                {filteredAllServices.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🔍</div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No services found</p>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Center Content Area */}
          <div className="flex-1">
            {/* Services Grid - Single Column */}
            <div className="space-y-6">
              {filteredServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>

          </div>

          {/* Right Cart Panel */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <div className="sticky top-6">
              <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Service Cart</h3>
                  <span className="bg-teal-500 text-white text-sm px-2 py-1 rounded-full">
                    {cartItems.length}
                  </span>
                </div>

                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🛒</div>
                    <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Your cart is empty</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Add services to get started</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-primary)' }}>
                          <img src={item.imgUrl} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{item.title}</h4>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.price}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold"
                            >
                              -
                            </button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-bold"
                            >
                              +
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Total:</span>
                        <span className="text-xl font-bold" style={{ color: 'var(--accent-secondary)' }}>
                          ₹{getTotalPrice().toLocaleString()}
                        </span>
                      </div>
                      
                      <button 
                        onClick={handleBookNow}
                        className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg mb-3"
                      >
                        Book All Services
                      </button>
                      
                      <button className="w-full border-2 border-teal-500 text-teal-600 font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:bg-teal-50">
                        Get Quote
                      </button>
                    </div>
                  </>
                )}

                {/* Quick Contact */}
                <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-primary)' }}>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Need Help?</h4>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Our experts are here to assist you</p>
                  <button className="w-full bg-green-500 text-white font-medium py-2 px-4 rounded-lg text-sm">
                    📞 Call Now
                  </button>
                </div>

                {/* CTA Section */}
                <div className="mt-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10 text-center">
                    <h4 className="text-lg font-bold mb-3">Still Not Sure?</h4>
                    <p className="text-sm mb-4 opacity-90">
                      Our care experts are here to help you find the perfect solution.
                    </p>
                    <div className="space-y-2">
                      <button className="w-full bg-white text-teal-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-all duration-300 text-sm">
                        📞 Get Free Consultation
                      </button>
                      <button className="w-full border-2 border-white text-white font-bold py-2 px-4 rounded-lg hover:bg-white hover:text-teal-600 transition-all duration-300 text-sm">
                        💬 Chat with Expert
                      </button>
                    </div>
                    <p className="text-xs mt-3 opacity-75">
                      ⚡ Response within 5 minutes • 🛡️ 100% Free
                    </p>
                  </div>
                </div>

                {/* Customer Reviews */}
                <div className="mt-6 space-y-4">
                  <h4 className="font-semibold text-center" style={{ color: 'var(--text-primary)' }}>Customer Reviews</h4>
                  
                  <div className="rounded-xl p-4 shadow-sm border text-center" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                    <div className="text-2xl mb-2">💬</div>
                    <p className="italic text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>"The service was amazing. Highly professional and caring!"</p>
                    <div className="flex justify-center text-yellow-400 mb-1 text-sm">⭐⭐⭐⭐⭐</div>
                    <p className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>- Priya S., Mumbai</p>
                  </div>

                  <div className="rounded-xl p-4 shadow-sm border text-center" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                    <div className="text-2xl mb-2">🏥</div>
                    <p className="italic text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>"Professional care that gave our family peace of mind."</p>
                    <div className="flex justify-center text-yellow-400 mb-1 text-sm">⭐⭐⭐⭐⭐</div>
                    <p className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>- Rajesh K., Delhi</p>
                  </div>

                  <div className="rounded-xl p-4 shadow-sm border text-center" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                    <div className="text-2xl mb-2">❤️</div>
                    <p className="italic text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>"Finally found reliable care. Highly recommend!"</p>
                    <div className="flex justify-center text-yellow-400 mb-1 text-sm">⭐⭐⭐⭐⭐</div>
                    <p className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>- Meera T., Bangalore</p>
                  </div>
                </div>

                {/* How It Works Section */}
                <div className="mt-6 rounded-2xl p-4 shadow-lg" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                  <h4 className="font-semibold text-center mb-4" style={{ color: 'var(--text-primary)' }}>How It Works</h4>
                  
                  <div className="space-y-3">
                    {/* Step 1 */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                        1
                      </div>
                      <div>
                        <h5 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Choose Service</h5>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Select from our services</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                        2
                      </div>
                      <div>
                        <h5 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Book Appointment</h5>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Schedule your time</p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                        3
                      </div>
                      <div>
                        <h5 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Professional Arrives</h5>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Verified expert arrives</p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                        4
                      </div>
                      <div>
                        <h5 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Quality Care</h5>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Receive professional care</p>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-lg">🛡️</span>
                        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Verified</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-lg">⏰</span>
                        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>24/7</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-lg">💯</span>
                        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Quality</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-lg">🏠</span>
                        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>At Home</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenericServiceOptions;
