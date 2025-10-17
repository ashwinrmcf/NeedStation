import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../store/CartContext';
import { useBookingModal } from '../BookingModal/BookingModalProvider';
import { useAuth } from '../../store/AuthContext';
import styles from './GenericServiceOptions.module.css';
import { 
  Heart, 
  Stethoscope, 
  Home, 
  Bed, 
  Activity, 
  Dumbbell,
  Shield, 
  Baby, 
  Accessibility,
  TestTube,
  Droplet,
  ClipboardCheck,
  Scissors,
  Search,
  Trophy,
  Users,
  Star,
  Bath,
  Brain,
  Clock,
  AlertCircle,
  Bandage
} from 'lucide-react';

const GenericServiceOptions = ({ 
  serviceName, 
  serviceDescription, 
  serviceHighlight, 
  services, 
  trustIndicators, 
  detailedInfo 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animatedStats, setAnimatedStats] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [showAllCartItems, setShowAllCartItems] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [bottomSheetService, setBottomSheetService] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const { openBookingModal } = useBookingModal();
  const { addToCart: addToGlobalCart, isInCart, cartItems: globalCartItems, removeFromCart: removeFromGlobalCart, updateQuantity: updateGlobalQuantity, cartTotal } = useCart();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Toggle card expansion for mobile
  const toggleCardExpansion = (serviceId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedCards(newExpanded);
  };
  
  // Bottom sheet functions
  const openBottomSheet = (service) => {
    setBottomSheetService(service);
    setIsBottomSheetOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeBottomSheet = () => {
    setBottomSheetService(null);
    setIsBottomSheetOpen(false);
    document.body.style.overflow = 'auto';
  };
  
  const handleCardClick = (service) => {
    if (isMobile) {
      openBottomSheet(service);
    }
  };

  // Icon mapping for services
  const serviceIconMap = {
    'elderly-care': Heart,
    'nursing-care': Stethoscope,
    'caretaker-at-home': Home,
    'bedridden-patient-care': Bed,
    'parkinsons-care': Activity,
    'physiotherapy': Dumbbell,
    'security-guard': Shield,
    'mother-baby-care': Baby,
    'paralysis-care': Accessibility,
    'pathology-care': TestTube,
    'diabetes-management': Droplet,
    'health-check-up': ClipboardCheck,
    'post-surgery-care': Scissors
  };

  // Icon mapping for trust indicators and service cards
  const iconComponentMap = {
    'Trophy': Trophy,
    'Users': Users,
    'Star': Star,
    'Bath': Bath,
    'Brain': Brain,
    'Clock': Clock,
    'AlertCircle': AlertCircle,
    'Bandage': Bandage,
    'Stethoscope': Stethoscope,
    'Baby': Baby,
    'Heart': Heart,
    'Home': Home,
    'Bed': Bed,
    'Activity': Activity,
    'Dumbbell': Dumbbell,
    'Shield': Shield,
    'Accessibility': Accessibility,
    'TestTube': TestTube,
    'Droplet': Droplet,
    'ClipboardCheck': ClipboardCheck,
    'Scissors': Scissors
  };

  // Helper function to render icon
  const renderIcon = (iconName, size = 20, className = '') => {
    const IconComponent = iconComponentMap[iconName];
    return IconComponent ? (
      <IconComponent size={size} className={className} strokeWidth={2} />
    ) : null;
  };

  // All 13 services for left navigation
  const allServices = [
    { id: 'elderly-care', name: 'Elderly Care', link: '/services/elderly-care' },
    { id: 'nursing-care', name: 'Nursing Care', link: '/services/nursing-care' },
    { id: 'caretaker-at-home', name: 'Caretaker at Home', link: '/services/caretaker-at-home' },
    { id: 'bedridden-patient-care', name: 'Bedridden Patient Care', link: '/services/bedridden-patient-care' },
    { id: 'parkinsons-care', name: 'Parkinsons Care', link: '/services/parkinsons-care' },
    { id: 'physiotherapy', name: 'Physiotherapy', link: '/services/physiotherapy' },
    { id: 'security-guard', name: 'Home Security Guard', link: '/services/security-guard' },
    { id: 'mother-baby-care', name: 'Mother and Baby Care', link: '/services/mother-baby-care' },
    { id: 'paralysis-care', name: 'Paralysis Care', link: '/services/paralysis-care' },
    { id: 'pathology-care', name: 'Pathology Care', link: '/services/pathology-care' },
    { id: 'diabetes-management', name: 'Diabetes Management', link: '/services/diabetes-management' },
    { id: 'health-check-up', name: 'Health Check Up Services', link: '/services/health-check-up-services' },
    { id: 'post-surgery-care', name: 'Post Surgery Care', link: '/services/post-surgery-care' }
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
    if (e) e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      // Redirect to login page if not logged in
      navigate('/login');
      return;
    }
    
    // Open booking modal if user is logged in
    openBookingModal(serviceName);
  };

  const handleAddToCart = (service) => {
    // Use the service's existing unique ID but prefix it with category to avoid conflicts across pages
    // This preserves the service's individual identity while ensuring global uniqueness
    const serviceId = `${serviceName.toLowerCase().replace(/\s+/g, '-')}-${service.id}`;
    
    const cartService = {
      id: serviceId,
      name: service.title,
      category: serviceName,
      price: parseInt(service.price.replace(/[₹,]/g, '')),
      originalPrice: service.originalPrice ? parseInt(service.originalPrice.replace(/[₹,]/g, '')) : null,
      duration: service.duration || '1 hour',
      rating: service.rating,
      image: service.imgUrl,
      description: service.subtitle,
      originalServiceId: service.id // Keep original ID for reference
    };
    
    console.log('🛒 Adding to cart - Service:', service.title, 'Original ID:', service.id, 'Cart ID:', serviceId, 'Category:', serviceName);
    addToGlobalCart(cartService);
  };

  const handleIncreaseQuantity = (itemId) => {
    const item = globalCartItems.find(item => item.id === itemId);
    if (item) {
      updateGlobalQuantity(itemId, item.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (itemId) => {
    const item = globalCartItems.find(item => item.id === itemId);
    if (item) {
      if (item.quantity > 1) {
        updateGlobalQuantity(itemId, item.quantity - 1);
      } else {
        // If quantity is 1, remove the item entirely
        removeFromGlobalCart(itemId);
      }
    }
  };

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const filteredAllServices = allServices.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mobile Service Card Component - Simplified Urban Company Style
  const MobileServiceCard = ({ service }) => {
    return (
      <div 
        className={`${styles.serviceCard} ${styles.mobileCard} relative overflow-hidden cursor-pointer`}
        onClick={() => handleCardClick(service)}
      >
        {/* Service Image */}
        <div className="w-full h-48 overflow-hidden">
          <img
            src={service.imgUrl}
            alt={service.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Service Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg leading-tight mb-2" style={{ color: 'var(--text-primary)' }}>
            {service.title}
          </h3>
          
          <div className="flex items-center gap-2 text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            <span className="flex items-center gap-1">
              ⭐ {service.rating}
            </span>
            <span>•</span>
            <span>45 mins</span>
          </div>
          
          <div className="font-bold text-xl" style={{ color: '#00c8ff' }}>
            {service.price}
          </div>
        </div>
      </div>
    );
  };

  // Desktop Service Card Component (unchanged)
  const DesktopServiceCard = ({ service }) => (
    <div 
      className={`${styles.serviceCard} relative flex flex-row overflow-hidden`}
    >
      {/* Image Section - Increased height */}
      <div className="imageSection relative overflow-hidden w-40 h-48 flex-shrink-0">
        <img
          src={service.imgUrl}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        
        {/* Rating Badge */}
        <div className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 shadow-sm" style={{
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)'
        }}>
          ⭐ {service.rating}
        </div>
      </div>

      {/* Content Section - Professional business layout */}
      <div className="contentSection p-6 flex flex-col flex-grow">
        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            {service.title}
          </h3>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            {service.subtitle}
          </p>
          
          {/* Service Features */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{service.urgency || 'PREMIUM SERVICE'}</h4>
              <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ 
                backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                color: '#22c55e' 
              }}>
                {service.discount || 'PREMIUM'}
              </span>
            </div>
            
            {/* Service Features */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {service.features && service.features.slice(0, 4).map((feature, idx) => (
                <div key={idx} className="text-xs flex items-start gap-1" style={{ color: 'var(--text-secondary)' }}>
                  <span className="mt-0.5">•</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            {/* Why Choose This Service */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Why Choose This?</span>
                <span className="text-xs px-2 py-1 rounded" style={{ 
                  backgroundColor: 'var(--accent-secondary)', 
                  color: 'white' 
                }}>
                  ⭐ {service.rating || '4.8'}/5
                </span>
              </div>
              <div className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                <div>• {service.guarantee || 'Certified & Background Verified'}</div>
                <div>• {service.availability || 'Quick Response Time'}</div>
                <div>• "{service.testimonial || 'Excellent service quality!'}"</div>
              </div>
            </div>
          </div>
        </div>

        {/* Price and Actions Row */}
        <div className="flex items-center justify-between mt-auto">
          {/* Price Section - Moved more to the left */}
          <div className="flex items-baseline gap-2 mr-6">
            <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {service.price}
            </span>
            <span className="text-sm line-through" style={{ color: 'var(--text-muted)' }}>
              {service.originalPrice}
            </span>
          </div>

          {/* Flat Rectangular Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={() => handleAddToCart(service)}
              className="px-6 py-3 font-semibold border-2 transition-all duration-200 hover:bg-teal-500 hover:text-white"
              style={{
                borderColor: 'var(--accent-secondary)',
                color: 'var(--accent-secondary)',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '6px'
              }}
            >
              Add to Cart
            </button>
            
            <button 
              onClick={handleBookNow}
              className="px-6 py-3 font-semibold text-white transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: 'var(--accent-secondary)',
                borderRadius: '6px',
                border: 'none'
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Conditional Service Card Component
  const ServiceCard = ({ service }) => {
    return isMobile ? <MobileServiceCard service={service} /> : <DesktopServiceCard service={service} />;
  };

  return (
    <section className="py-8 pt-20" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
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
                <span style={{ color: 'var(--accent-secondary)' }}>
                  {renderIcon(indicator.icon, 24)}
                </span>
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {animatedStats[indicator.key] || 0}{indicator.suffix} {indicator.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Three Column Layout */}
        <div className={styles.threeColumnLayout}>
          {/* Left Navigation Panel */}
          <div className={styles.leftPanel}>
            <div className={styles.stickyContainer}>
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
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-secondary)' }}>
                    <Search size={20} strokeWidth={2} />
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
                      {(() => {
                        const IconComponent = serviceIconMap[service.id];
                        return IconComponent ? (
                          <IconComponent 
                            size={20} 
                            className="flex-shrink-0"
                            strokeWidth={2}
                          />
                        ) : null;
                      })()}
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
          <div className={styles.centerPanel}>
            {/* Services Grid - Single Column with increased size */}
            <div className={styles.serviceGrid}>
              {filteredServices.map((service, index) => (
                <div key={service.id} className={styles.serviceCardWrapper}>
                  <ServiceCard service={service} index={index} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Cart Panel */}
          <div className={styles.rightPanel}>
            <div className={styles.stickyContainer}>
              <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Service Cart</h3>
                  <span className="bg-teal-500 text-white text-sm px-2 py-1 rounded-full">
                    {globalCartItems.length}
                  </span>
                </div>

                {globalCartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🛒</div>
                    <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Your cart is empty</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Add services to get started</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                      {globalCartItems.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-primary)' }}>
                          <img src={item.image || item.imgUrl} alt={item.name || item.title} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{item.name || item.title}</h4>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>₹{typeof item.price === 'number' ? item.price.toLocaleString() : item.price}</p>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 mt-1">
                              <button 
                                onClick={() => handleDecreaseQuantity(item.id)}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                                style={{ 
                                  backgroundColor: 'var(--accent-secondary)', 
                                  color: 'white' 
                                }}
                              >
                                -
                              </button>
                              <span className="text-xs font-medium px-2" style={{ color: 'var(--text-primary)' }}>
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => handleIncreaseQuantity(item.id)}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                                style={{ 
                                  backgroundColor: 'var(--accent-secondary)', 
                                  color: 'white' 
                                }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFromGlobalCart(item.id)}
                            className="text-red-500 hover:text-red-700 text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      
                      {globalCartItems.length > 2 && (
                        <div className="text-center py-2">
                          <button 
                            onClick={() => setIsCartModalOpen(true)}
                            className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                            style={{ 
                              color: 'var(--accent-secondary)', 
                              backgroundColor: 'var(--bg-primary)',
                              border: '1px solid var(--accent-secondary)'
                            }}
                          >
                            ... show more ({globalCartItems.length - 2} more items)
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Total:</span>
                        <span className="text-xl font-bold" style={{ color: 'var(--accent-secondary)' }}>
                          ₹{cartTotal.toLocaleString()}
                        </span>
                      </div>
                      
                      <button 
                        onClick={handleBookNow}
                        className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        Book All Services
                      </button>
                    </div>
                  </>
                )}

                {/* Quick Booking Guide */}
                <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-primary)' }}>
                  <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Quick Booking Guide:</h4>
                  <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🚀</span>
                      <span><strong>Single Service:</strong> Click "Book Now"</span>
                    </div>
                    <div className="text-xs ml-6 opacity-75">→ Direct to booking form</div>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-lg">🛒</span>
                      <span><strong>Multiple Services:</strong> Click "Add to Cart"</span>
                    </div>
                    <div className="text-xs ml-6 opacity-75">→ Continue shopping, checkout together</div>
                    
                    <div className="flex items-center gap-2 mt-3 p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-tertiary)', color: 'white' }}>
                      <span className="text-lg">💡</span>
                      <span className="text-xs"><strong>Tip:</strong> Services for better care!</span>
                    </div>
                  </div>
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
                  </div>
                </div>

                {/* Customer Reviews */}
                <div className="mt-6 space-y-4">
                  <h4 className="font-semibold text-center" style={{ color: 'var(--text-primary)' }}>Customer Reviews</h4>
                  
                  <div className="rounded-xl p-4 shadow-sm border text-center" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                    <div className="text-2xl mb-2">💬</div>
                    <p className="italic text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>"The service was amazing."</p>
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

      {/* Cart Modal for showing all items */}
      {isCartModalOpen && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-[9999] p-4" onClick={() => setIsCartModalOpen(false)}>
          <div 
            className="rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border-2" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              backgroundColor: 'var(--bg-surface)', 
              borderColor: 'var(--accent-secondary)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                  <span className="text-white text-xl">🛒</span>
                </div>
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Your Cart</h3>
              </div>
              <button 
                onClick={() => setIsCartModalOpen(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-200 hover:scale-110"
                style={{ 
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)'
                }}
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              {globalCartItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg" 
                  style={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    borderColor: 'var(--border-color)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="relative">
                    <img src={item.image || item.imgUrl} alt={item.name || item.title} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{item.name || item.title}</h4>
                    <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>₹{typeof item.price === 'number' ? item.price.toLocaleString() : item.price} per service</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Quantity:</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDecreaseQuantity(item.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 hover:scale-110"
                          style={{ 
                            backgroundColor: 'var(--accent-secondary)', 
                            color: 'white',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          -
                        </button>
                        <span className="text-lg font-bold px-3 py-1 rounded-lg" style={{ 
                          color: 'var(--text-primary)',
                          backgroundColor: 'var(--bg-surface)',
                          border: '2px solid var(--border-color)',
                          minWidth: '40px',
                          textAlign: 'center'
                        }}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleIncreaseQuantity(item.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 hover:scale-110"
                          style={{ 
                            backgroundColor: 'var(--accent-secondary)', 
                            color: 'white',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold mb-2" style={{ color: 'var(--accent-secondary)' }}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button 
                      onClick={() => removeFromGlobalCart(item.id)}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-200 hover:scale-110"
                      style={{
                        color: '#ef4444',
                        backgroundColor: 'var(--bg-surface)',
                        border: '2px solid #ef4444'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t-2" style={{ borderColor: 'var(--accent-secondary)' }}>
              {/* Summary Section */}
              <div className="bg-gradient-to-r p-6 rounded-2xl mb-6" style={{ 
                background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-primary) 100%)',
                border: '2px solid var(--border-color)'
              }}>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Services: {globalCartItems.length}</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Items: {globalCartItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Grand Total</p>
                    <p className="text-3xl font-bold" style={{ color: 'var(--accent-secondary)' }}>
                      ₹{cartTotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsCartModalOpen(false)}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 border-2"
                  style={{
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  Continue Shopping
                </button>
                <button 
                  onClick={() => {
                    setIsCartModalOpen(false);
                    handleBookNow();
                  }}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold text-lg text-white transition-all duration-300 hover:scale-105 shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent-tertiary) 100%)',
                    boxShadow: '0 10px 25px rgba(0, 224, 184, 0.3)'
                  }}
                >
                  Book All Services 🚀
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom Sheet Modal - Mobile Only */}
      {isBottomSheetOpen && bottomSheetService && (
        <div className={styles.bottomSheetOverlay} onClick={closeBottomSheet}>
          <div 
            className={styles.bottomSheet} 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              className={styles.bottomSheetClose}
              onClick={closeBottomSheet}
              aria-label="Close"
            >
              ✕
            </button>
            
            {/* Handle Bar */}
            <div className={styles.bottomSheetHandle}></div>
            
            {/* Service Image */}
            <div className={styles.bottomSheetImage}>
              <img src={bottomSheetService.imgUrl} alt={bottomSheetService.title} />
            </div>
            
            {/* Service Info */}
            <div className={styles.bottomSheetContent}>
              <h3 className={styles.bottomSheetTitle}>{bottomSheetService.title}</h3>
              
              <div className={styles.bottomSheetMeta}>
                <span className={styles.bottomSheetRating}>⭐ {bottomSheetService.rating} (1.2K reviews)</span>
                <span className={styles.bottomSheetDuration}>• 45 mins</span>
              </div>
              
              <div className={styles.bottomSheetPrice}>
                <span className={styles.priceLabel}>Starting from</span>
                <span className={styles.priceValue}>{bottomSheetService.price}</span>
              </div>
              
              <div className={styles.bottomSheetDescription}>
                <h4>About this service</h4>
                <p>{bottomSheetService.subtitle}</p>
              </div>
              
              <div className={styles.bottomSheetFeatures}>
                <h4>What's included</h4>
                <ul>
                  {bottomSheetService.features?.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  )) || (
                    <>
                      <li>✓ Professional service delivery</li>
                      <li>✓ Experienced professionals</li>
                      <li>✓ Quality assurance</li>
                      <li>✓ Flexible scheduling</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className={styles.bottomSheetDetails}>
                <div className={styles.detailItem}>
                  <span>⏱️ Duration</span>
                  <span>45 mins</span>
                </div>
                <div className={styles.detailItem}>
                  <span>🕐 Availability</span>
                  <span>{bottomSheetService.availability || '24/7'}</span>
                </div>
              </div>
            </div>
            
            {/* Fixed Action Buttons */}
            <div className={styles.bottomSheetActions}>
              <button 
                className={styles.addToCartBtn}
                onClick={() => {
                  handleAddToCart(bottomSheetService);
                  closeBottomSheet();
                }}
              >
                Add to Cart
              </button>
              <button 
                className={styles.bookNowBtn}
                onClick={() => {
                  closeBottomSheet();
                  handleBookNow();
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Fixed Checkout Bar - Mobile Only */}
      {isMobile && globalCartItems.length > 0 && (
        <div className={styles.fixedCheckoutBar}>
          <div className={styles.checkoutBarContent}>
            <div className={styles.cartInfo}>
              <span className={styles.cartCount}>{globalCartItems.length} item{globalCartItems.length > 1 ? 's' : ''}</span>
              <span className={styles.cartTotal}>View Cart</span>
            </div>
            <button 
              className={styles.checkoutBtn}
              onClick={() => navigate('/cart')}
            >
              Checkout →
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default GenericServiceOptions;
