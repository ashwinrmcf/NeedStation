import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import axios from 'axios';
import { 
  Heart, Shield, Clock, MapPin, Phone, Calendar, User, Star, 
  CheckCircle, AlertCircle, Trash2, Plus, Minus, ArrowLeft, 
  CreditCard, Smartphone, Wallet, Gift, Info, ChevronDown,
  Activity, Stethoscope, Pill, UserCheck, Home, Zap, X, Loader2, Package
} from 'lucide-react';
import styles from './Cart.module.css';

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successBookingData, setSuccessBookingData] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
  
  // Check for booking success from location state
  useEffect(() => {
    if (location.state?.bookingSuccess && location.state?.bookingData) {
      setShowSuccessMessage(true);
      setSuccessBookingData(location.state.bookingData);
      
      // Clear the state
      window.history.replaceState({}, document.title);
      
      // Auto-hide after 10 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 10000);
    }
  }, [location.state]);
  
  // Fetch user's bookings
  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        setLoadingBookings(true);
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          console.log('No userId found');
          return;
        }
        
        const response = await axios.get(`${API_URL}/bookings/user/${userId}`);
        if (response.data.success) {
          setUserBookings(response.data.bookings || []);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoadingBookings(false);
      }
    };
    
    fetchUserBookings();
  }, [successBookingData]); // Refetch when new booking is created
  
  // If cart is empty, show sample items for demo purposes
  const displayItems = cartItems.length > 0 ? cartItems : [
    {
      id: '1',
      name: 'Senior Care Specialist',
      category: 'Elder Care',
      specialist: 'Certified Geriatric Nurse',
      description: 'Comprehensive elderly care including medication management, vital monitoring, and companionship',
      price: 2499,
      originalPrice: 2999,
      quantity: 1,
      duration: '6 hours daily',
      rating: 4.9,
      reviews: 342,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400',
      urgency: 'normal',
      scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      scheduledTime: 'morning',
      caregiverPreference: 'female',
      specialRequirements: 'Diabetes management experience required',
      features: ['Medication Management', 'Vital Signs Monitoring', 'Companionship', 'Light Housekeeping'],
      nextAvailable: 'Today 2:00 PM'
    },
    {
      id: '2',
      name: 'Physiotherapy Session',
      category: 'Rehabilitation',
      specialist: 'Licensed Physiotherapist',
      description: 'Specialized orthopedic physiotherapy for post-surgery recovery and mobility improvement',
      price: 1299,
      originalPrice: 1599,
      quantity: 2,
      duration: '60 min/session',
      rating: 4.8,
      reviews: 198,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      urgency: 'urgent',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: 'afternoon',
      therapyType: 'orthopedic',
      specialRequirements: 'Post knee surgery rehabilitation',
      features: ['Joint Mobility', 'Pain Management', 'Strength Training', 'Recovery Exercises'],
      nextAvailable: 'Today 4:00 PM'
    },
    {
      id: '3',
      name: 'Home Health Checkup',
      category: 'Preventive Care',
      specialist: 'Registered Nurse',
      description: 'Comprehensive health assessment and vital signs monitoring at home',
      price: 899,
      originalPrice: 1199,
      quantity: 1,
      duration: '90 minutes',
      rating: 4.7,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400',
      urgency: 'normal',
      scheduledDate: '',
      scheduledTime: '',
      features: ['Blood Pressure Check', 'Blood Sugar Test', 'Heart Rate Monitor', 'Health Report'],
      nextAvailable: 'Tomorrow 10:00 AM'
    }
  ];

  const [addOns, setAddOns] = useState([
    {
      id: '1',
      name: '24/7 Emergency Support',
      description: 'Round-the-clock emergency response with medical alert system',
      price: 799,
      selected: true,
      icon: <Zap className="w-5 h-5" />,
      popular: true,
      category: 'Safety'
    },
    {
      id: '2',
      name: 'Digital Health Tracking',
      description: 'IoT-enabled health monitoring with real-time alerts and reports',
      price: 599,
      selected: false,
      icon: <Activity className="w-5 h-5" />,
      popular: true,
      category: 'Technology'
    },
    {
      id: '3',
      name: 'Medication Management Pro',
      description: 'Smart pill dispenser with automated reminders and tracking',
      price: 399,
      selected: false,
      icon: <Pill className="w-5 h-5" />,
      popular: false,
      category: 'Medication'
    },
    {
      id: '4',
      name: 'Family Connect Plus',
      description: 'Live updates, video calls, and progress sharing with family members',
      price: 299,
      selected: true,
      icon: <UserCheck className="w-5 h-5" />,
      popular: false,
      category: 'Communication'
    },
    {
      id: '5',
      name: 'Premium Care Package',
      description: 'Extended service hours with specialized equipment and supplies',
      price: 999,
      selected: false,
      icon: <Stethoscope className="w-5 h-5" />,
      popular: true,
      category: 'Premium'
    }
  ]);

  const [selectedTip, setSelectedTip] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [insuranceInfo, setInsuranceInfo] = useState({
    hasInsurance: false,
    provider: '',
    policyNumber: ''
  });
  const [showAddOns, setShowAddOns] = useState(true);
  const [showPromoSuggestions, setShowPromoSuggestions] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [address, setAddress] = useState({
    fullName: '',
    mobile: '',
    flatNo: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    type: 'home',
    saveAddress: false,
  });

  const [discount, setDiscount] = useState(0);

  const handleUpdateQuantity = (id, quantity) => {
    updateQuantity(id, quantity);
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const handleToggleAddOn = (id) => {
    setAddOns(addOns =>
      addOns.map(addOn =>
        addOn.id === id ? { ...addOn, selected: !addOn.selected } : addOn
      )
    );
  };

  const handlePromoApply = (code) => {
    const promoCodes = {
      'WELLNESS25': { discount: 750, message: 'Wellness package discount applied!', type: 'percentage' },
      'SENIOR30': { discount: 900, message: 'Senior citizen special discount applied!', type: 'fixed' },
      'FIRSTCARE': { discount: 500, message: 'First-time customer discount applied!', type: 'fixed' },
      'FAMILY20': { discount: 600, message: 'Family care bundle discount applied!', type: 'fixed' },
      'URGENT15': { discount: 400, message: 'Urgent care discount applied!', type: 'fixed' },
      'HEALTH50': { discount: 1200, message: 'Premium health package discount applied!', type: 'fixed' }
    };
    
    const promo = promoCodes[code.toUpperCase()];
    if (promo) {
      setDiscount(promo.discount);
      // Show success toast
    } else {
      setDiscount(0);
      // Show error toast
    }
  };

  const handleUpdateSchedule = (id, field, value) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Enhanced calculations
  const subtotal = displayItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const addOnTotal = addOns.filter(addOn => addOn.selected).reduce((sum, addOn) => sum + addOn.price, 0);
  const totalSavings = displayItems.reduce((sum, item) => {
    const originalPrice = item.originalPrice || item.price;
    return sum + ((originalPrice - item.price) * (item.quantity || 1));
  }, 0);
  const convenienceFee = 99; // Platform fee
  const taxes = Math.round((subtotal + addOnTotal + convenienceFee) * 0.18); // 18% GST
  
  // Dynamic pricing based on urgency and time
  const hasUrgentItems = displayItems.some(item => item.urgency === 'urgent');
  const emergencyFee = hasUrgentItems ? 299 : 0;
  const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
  const weekendSurcharge = isWeekend ? 199 : 0;
  
  const beforeDiscount = subtotal + addOnTotal + convenienceFee + taxes + emergencyFee + weekendSurcharge + selectedTip;
  const finalTotal = beforeDiscount - discount;
  
  // Insurance coverage calculation
  const insuranceCoverage = insuranceInfo.hasInsurance ? Math.min(subtotal * 0.6, 2000) : 0;
  const outOfPocket = finalTotal - insuranceCoverage;

  return (
    <div className={styles.container}>
      {/* Success Message Banner */}
      <AnimatePresence>
        {showSuccessMessage && successBookingData && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className={styles.successBanner}
          >
            <div className={styles.successContent}>
              <div className={styles.successIcon}>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div className={styles.successText}>
                <h3>🎉 Booking Confirmed Successfully!</h3>
                <p>
                  <strong>Booking #{successBookingData.bookingNumber}</strong> - {successBookingData.serviceName}
                </p>
                <p className={styles.successSubtext}>
                  We're finding the best workers near you! You'll be notified once a worker accepts your booking.
                </p>
              </div>
              <button 
                onClick={() => setShowSuccessMessage(false)}
                className={styles.closeSuccess}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Modern Header */}
      <motion.header 
        className={styles.modernHeader}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <button 
              onClick={() => navigate(-1)}
              className={styles.backButton}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Link to="/" className={styles.modernLogo}>
              <div className={styles.logoIcon}>
                <Heart className="w-8 h-8" />
              </div>
              <div className={styles.logoText}>
                <span className={styles.logoMain}>Need</span>
                <span className={styles.logoAccent}>Station</span>
              </div>
            </Link>
          </div>
          
          <div className={styles.headerCenter}>
            <div className={styles.progressSteps}>
              {['Services', 'Review', 'Payment', 'Confirmation'].map((step, index) => (
                <div key={step} className={`${styles.progressStep} ${
                  index <= 1 ? styles.completed : index === 2 ? styles.active : ''
                }`}>
                  <div className={styles.stepNumber}>{index + 1}</div>
                  <span className={styles.stepLabel}>{step}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.headerRight}>
            <div className={styles.cartSummary}>
              <span className={styles.itemCount}>{displayItems.length} items</span>
              <span className={styles.totalAmount}>₹{finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Background */}
      <div className={styles.backgroundPattern}>
        <div className={styles.gridPattern}></div>
        <div className={styles.gradientOverlay}></div>
        <motion.div 
          className={styles.floatingElement1}
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className={styles.floatingElement2}
          animate={{ 
            y: [0, 15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className={styles.content}>
        <div style={{ height: '150px' }}></div> {/* Spacer div */}
        <div className={styles.maxWidth}>
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={styles.heroSection}
          >
            <div className={styles.heroContent}>
              <div className={styles.heroLeft}>
                <motion.h1 
                  className={styles.heroTitle}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  Your Healthcare Journey
                </motion.h1>
                <motion.p 
                  className={styles.heroSubtitle}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Professional care services tailored for your health and wellness needs
                </motion.p>
                
                <motion.div 
                  className={styles.heroStats}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <div className={styles.heroStat}>
                    <div className={styles.statNumber}>{displayItems.length}</div>
                    <div className={styles.statLabel}>Services</div>
                  </div>
                  <div className={styles.heroStat}>
                    <div className={styles.statNumber}>4.9★</div>
                    <div className={styles.statLabel}>Rating</div>
                  </div>
                  <div className={styles.heroStat}>
                    <div className={styles.statNumber}>24/7</div>
                    <div className={styles.statLabel}>Support</div>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                className={styles.heroRight}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className={styles.savingsHighlight}>
                  <div className={styles.savingsIcon}>
                    <Gift className="w-8 h-8" />
                  </div>
                  <div className={styles.savingsContent}>
                    <div className={styles.savingsAmount}>₹{totalSavings.toLocaleString()}</div>
                    <div className={styles.savingsText}>Total Savings</div>
                  </div>
                </div>
                
                {hasUrgentItems && (
                  <div className={styles.urgentAlert}>
                    <AlertCircle className="w-5 h-5" />
                    <span>Urgent care needed - Priority booking</span>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>

          <div className={styles.modernGrid}>
            {/* Main Content */}
            <div className={styles.mainContent}>
              {/* Pending Bookings Section */}
              {userBookings.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className={styles.pendingBookingsSection}
                  style={{ marginBottom: '2rem' }}
                >
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                      <Package className="w-6 h-6" />
                      Your Bookings
                    </h2>
                    <span className={styles.bookingCount}>{userBookings.length} booking(s)</span>
                  </div>
                  
                  <div className={styles.bookingsGrid}>
                    {loadingBookings ? (
                      <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <Loader2 className="w-8 h-8 animate-spin" style={{ margin: '0 auto' }} />
                        <p>Loading bookings...</p>
                      </div>
                    ) : (
                      userBookings.map((booking, index) => (
                        <PendingBookingCard key={booking.id} booking={booking} index={index} />
                      ))
                    )}
                  </div>
                </motion.section>
              )}
              
              {/* Services Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className={styles.servicesSection}
              >
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <Stethoscope className="w-6 h-6" />
                    Your Selected Services
                  </h2>
                  <div className={styles.sectionMeta}>
                    <span className={styles.serviceCount}>{displayItems.length} services</span>
                    <span className={styles.totalValue}>₹{subtotal.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className={styles.servicesGrid}>
                  <AnimatePresence>
                    {displayItems.map((item, index) => (
                      <ModernCartItem
                        key={item.id}
                        item={item}
                        index={index}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                        expanded={expandedItem === item.id}
                        onToggleExpand={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.section>

              {/* Enhanced Add-ons */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className={styles.addOnsSection}
              >
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionTitleGroup}>
                    <h2 className={styles.sectionTitle}>
                      <Shield className="w-6 h-6" />
                      Enhanced Care Options
                    </h2>
                    <p className={styles.sectionDescription}>
                      Upgrade your care experience with our premium add-on services
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowAddOns(!showAddOns)}
                    className={styles.toggleButton}
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      showAddOns ? 'rotate-180' : ''
                    }`} />
                  </button>
                </div>
                
                <AnimatePresence>
                  {showAddOns && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className={styles.addOnsGrid}
                    >
                      {addOns.map((addOn, index) => (
                        <PremiumAddOnCard
                          key={addOn.id}
                          addOn={addOn}
                          index={index}
                          onToggle={handleToggleAddOn}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>

              {/* Appreciation & Insurance */}
              <div className={styles.bottomSections}>
                <PremiumTipSection selectedTip={selectedTip} onTipChange={setSelectedTip} />
                <InsuranceSection insuranceInfo={insuranceInfo} setInsuranceInfo={setInsuranceInfo} />
              </div>
            </div>

            {/* Sidebar - Summary & Checkout */}
            <div className={styles.sidebar}>
              <div className={styles.stickyContainer}>
                <PremiumSummary
                  subtotal={subtotal}
                  addOnTotal={addOnTotal}
                  convenienceFee={convenienceFee}
                  emergencyFee={emergencyFee}
                  weekendSurcharge={weekendSurcharge}
                  taxes={taxes}
                  discount={discount}
                  tip={selectedTip}
                  beforeDiscount={beforeDiscount}
                  finalTotal={finalTotal}
                  totalSavings={totalSavings}
                  insuranceCoverage={insuranceCoverage}
                  outOfPocket={outOfPocket}
                  onPromoApply={handlePromoApply}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
                
                <TrustBadges />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Cart Item Component
const ModernCartItem = ({ item, index, onUpdateQuantity, onRemove, expanded, onToggleExpand }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={styles.modernCartItem}
    >
      <div className={styles.itemCard}>
        <div className={styles.itemImageContainer}>
          <img src={item.image} alt={item.name} className={styles.itemImage} />
          {item.urgency === 'urgent' && (
            <div className={styles.urgencyBadge}>
              <AlertCircle className="w-4 h-4" />
              <span>Urgent</span>
            </div>
          )}
        </div>
        
        <div className={styles.itemContent}>
          <div className={styles.itemHeader}>
            <div className={styles.itemTitleGroup}>
              <h3 className={styles.itemTitle}>{item.name}</h3>
              <span className={styles.itemCategory}>{item.category}</span>
              <p className={styles.itemSpecialist}>{item.specialist}</p>
            </div>
            
            <div className={styles.itemRating}>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{item.rating}</span>
              <span className={styles.reviewCount}>({item.reviews})</span>
            </div>
          </div>
          
          <p className={styles.itemDescription}>{item.description}</p>
          
          <div className={styles.itemMeta}>
            <div className={styles.metaItem}>
              <Clock className="w-4 h-4" />
              <span>{item.duration}</span>
            </div>
            <div className={styles.metaItem}>
              <Calendar className="w-4 h-4" />
              <span>{item.nextAvailable}</span>
            </div>
          </div>
          
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={styles.expandedContent}
            >
              <div className={styles.featuresList}>
                <h4>Included Services:</h4>
                <div className={styles.features}>
                  {item.features?.map((feature, idx) => (
                    <span key={idx} className={styles.featureTag}>
                      <CheckCircle className="w-3 h-3" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              {item.specialRequirements && (
                <div className={styles.requirements}>
                  <h4>Special Requirements:</h4>
                  <p>{item.specialRequirements}</p>
                </div>
              )}
            </motion.div>
          )}
          
          <div className={styles.itemActions}>
            <div className={styles.quantitySection}>
              <label>Quantity:</label>
              <div className={styles.quantityControls}>
                <button 
                  onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className={styles.quantityBtn}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className={styles.quantity}>{item.quantity}</span>
                <button 
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className={styles.quantityBtn}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className={styles.actionButtons}>
              <button onClick={onToggleExpand} className={styles.detailsBtn}>
                {expanded ? 'Less Details' : 'More Details'}
              </button>
              <button onClick={() => onRemove(item.id)} className={styles.removeBtn}>
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        </div>
        
        <div className={styles.itemPricing}>
          {item.originalPrice > item.price && (
            <span className={styles.originalPrice}>₹{(item.originalPrice * item.quantity).toLocaleString()}</span>
          )}
          <span className={styles.currentPrice}>₹{(item.price * item.quantity).toLocaleString()}</span>
          {item.originalPrice > item.price && (
            <span className={styles.savings}>
              Save ₹{((item.originalPrice - item.price) * item.quantity).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Premium Add-on Card Component
const PremiumAddOnCard = ({ addOn, index, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`${styles.addOnCard} ${addOn.selected ? styles.selected : ''}`}
      onClick={() => onToggle(addOn.id)}
    >
      <div className={styles.addOnHeader}>
        <div className={styles.addOnIcon}>
          {addOn.icon}
        </div>
        <div className={styles.addOnBadges}>
          {addOn.popular && <span className={styles.popularBadge}>Popular</span>}
          <span className={styles.categoryBadge}>{addOn.category}</span>
        </div>
      </div>
      
      <div className={styles.addOnContent}>
        <h4 className={styles.addOnTitle}>{addOn.name}</h4>
        <p className={styles.addOnDescription}>{addOn.description}</p>
      </div>
      
      <div className={styles.addOnFooter}>
        <span className={styles.addOnPrice}>₹{addOn.price.toLocaleString()}</span>
        <div className={styles.addOnToggle}>
          {addOn.selected ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Premium Tip Section
const PremiumTipSection = ({ selectedTip, onTipChange }) => {
  const tipOptions = [0, 100, 200, 300, 500];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.tipSection}
    >
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>
          <Heart className="w-5 h-5" />
          Show Appreciation
        </h3>
        <p className={styles.sectionDescription}>
          Support our healthcare professionals with a tip
        </p>
      </div>
      
      <div className={styles.tipOptions}>
        {tipOptions.map(tip => (
          <button
            key={tip}
            onClick={() => onTipChange(tip)}
            className={`${styles.tipOption} ${selectedTip === tip ? styles.selected : ''}`}
          >
            {tip === 0 ? 'No Tip' : `₹${tip}`}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// Insurance Section
const InsuranceSection = ({ insuranceInfo, setInsuranceInfo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.insuranceSection}
    >
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>
          <Shield className="w-5 h-5" />
          Insurance Coverage
        </h3>
      </div>
      
      <div className={styles.insuranceToggle}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={insuranceInfo.hasInsurance}
            onChange={(e) => setInsuranceInfo(prev => ({ ...prev, hasInsurance: e.target.checked }))}
          />
          <span>I have health insurance</span>
        </label>
      </div>
      
      {insuranceInfo.hasInsurance && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={styles.insuranceForm}
        >
          <input
            type="text"
            placeholder="Insurance Provider"
            value={insuranceInfo.provider}
            onChange={(e) => setInsuranceInfo(prev => ({ ...prev, provider: e.target.value }))}
            className={styles.insuranceInput}
          />
          <input
            type="text"
            placeholder="Policy Number"
            value={insuranceInfo.policyNumber}
            onChange={(e) => setInsuranceInfo(prev => ({ ...prev, policyNumber: e.target.value }))}
            className={styles.insuranceInput}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

// Premium Summary Component
const PremiumSummary = ({ 
  subtotal, addOnTotal, convenienceFee, emergencyFee, weekendSurcharge, 
  taxes, discount, tip, beforeDiscount, finalTotal, totalSavings, 
  insuranceCoverage, outOfPocket, onPromoApply, isProcessing, setIsProcessing 
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to payment
    }, 2000);
  };
  
  return (
    <div className={styles.premiumSummary}>
      <div className={styles.summaryHeader}>
        <h3 className={styles.summaryTitle}>Booking Summary</h3>
        {totalSavings > 0 && (
          <div className={styles.savingsBadge}>
            You save ₹{totalSavings.toLocaleString()}!
          </div>
        )}
      </div>
      
      <div className={styles.summaryContent}>
        <div className={styles.mainTotal}>
          <span>Total Amount</span>
          <span className={styles.totalAmount}>₹{finalTotal.toLocaleString()}</span>
        </div>
        
        {insuranceCoverage > 0 && (
          <div className={styles.insuranceRow}>
            <span>Insurance Coverage</span>
            <span className={styles.coverage}>-₹{insuranceCoverage.toLocaleString()}</span>
          </div>
        )}
        
        <div className={styles.outOfPocket}>
          <span>Your Payment</span>
          <span className={styles.finalAmount}>₹{outOfPocket.toLocaleString()}</span>
        </div>
        
        <button 
          onClick={() => setShowBreakdown(!showBreakdown)}
          className={styles.breakdownToggle}
        >
          {showBreakdown ? 'Hide' : 'Show'} breakdown
          <ChevronDown className={`w-4 h-4 transition-transform ${
            showBreakdown ? 'rotate-180' : ''
          }`} />
        </button>
        
        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={styles.breakdown}
            >
              <div className={styles.breakdownItem}>
                <span>Services</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {addOnTotal > 0 && (
                <div className={styles.breakdownItem}>
                  <span>Add-ons</span>
                  <span>₹{addOnTotal.toLocaleString()}</span>
                </div>
              )}
              <div className={styles.breakdownItem}>
                <span>Platform Fee</span>
                <span>₹{convenienceFee}</span>
              </div>
              {emergencyFee > 0 && (
                <div className={styles.breakdownItem}>
                  <span>Emergency Fee</span>
                  <span>₹{emergencyFee}</span>
                </div>
              )}
              {weekendSurcharge > 0 && (
                <div className={styles.breakdownItem}>
                  <span>Weekend Surcharge</span>
                  <span>₹{weekendSurcharge}</span>
                </div>
              )}
              <div className={styles.breakdownItem}>
                <span>GST (18%)</span>
                <span>₹{taxes.toLocaleString()}</span>
              </div>
              {tip > 0 && (
                <div className={styles.breakdownItem}>
                  <span>Tip</span>
                  <span>₹{tip}</span>
                </div>
              )}
              {discount > 0 && (
                <div className={styles.breakdownItem}>
                  <span>Discount</span>
                  <span className={styles.discount}>-₹{discount.toLocaleString()}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className={styles.promoSection}>
        <div className={styles.promoInput}>
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <button onClick={() => onPromoApply(promoCode)}>
            Apply
          </button>
        </div>
      </div>
      
      <button 
        onClick={handleCheckout}
        disabled={isProcessing}
        className={styles.checkoutButton}
      >
        {isProcessing ? (
          <div className={styles.processing}>
            <div className={styles.spinner}></div>
            Processing...
          </div>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Secure Checkout - ₹{outOfPocket.toLocaleString()}
          </>
        )}
      </button>
    </div>
  );
};

// Trust Badges Component
const TrustBadges = () => {
  return (
    <div className={styles.trustBadges}>
      <h4 className={styles.trustTitle}>Why Choose NeedStation?</h4>
      <div className={styles.trustGrid}>
        <div className={styles.trustBadge}>
          <Shield className="w-6 h-6" />
          <div>
            <h5>Verified Professionals</h5>
            <p>Background checked & certified</p>
          </div>
        </div>
        <div className={styles.trustBadge}>
          <Heart className="w-6 h-6" />
          <div>
            <h5>Compassionate Care</h5>
            <p>Trained in empathy & care</p>
          </div>
        </div>
        <div className={styles.trustBadge}>
          <Clock className="w-6 h-6" />
          <div>
            <h5>24/7 Support</h5>
            <p>Always here when you need us</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Original Cart Item Component (keeping for compatibility)
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.cartItem}
    >
      <div className={styles.itemImage}>
        <img src={item.image} alt={item.name} />
        {item.urgency === 'urgent' && (
          <div className={styles.urgencyBadge}>
            <AlertCircle size={14} />
            Urgent
          </div>
        )}
      </div>
      
      <div className={styles.itemDetails}>
        <div className={styles.itemHeader}>
          <div>
            <h3 className={styles.itemName}>{item.name}</h3>
            <span className={styles.itemCategory}>{item.category}</span>
          </div>
          <div className={styles.itemRating}>
            <Star className={styles.starIcon} fill="#fbbf24" />
            <span>{item.rating}</span>
            <span className={styles.reviewCount}>({item.reviews})</span>
          </div>
        </div>
        
        <p className={styles.itemDescription}>{item.description}</p>
        
        <div className={styles.itemMeta}>
          <div className={styles.metaItem}>
            <Clock size={14} />
            <span>{item.duration}</span>
          </div>
          {item.caregiverPreference && (
            <div className={styles.metaItem}>
              <User size={14} />
              <span>{item.caregiverPreference} caregiver</span>
            </div>
          )}
        </div>
        
        <div className={styles.itemActions}>
          <div className={styles.quantityControls}>
            <button 
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className={styles.quantityBtn}
            >
              <Minus size={14} />
            </button>
            <span className={styles.quantity}>{item.quantity}</span>
            <button 
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className={styles.quantityBtn}
            >
              <Plus size={14} />
            </button>
          </div>
          
          <button 
            onClick={() => onRemove(item.id)}
            className={styles.removeBtn}
          >
            <Trash2 size={16} />
            Remove
          </button>
        </div>
      </div>
      
      <div className={styles.itemPricing}>
        {item.originalPrice > item.price && (
          <span className={styles.originalPrice}>₹{item.originalPrice * item.quantity}</span>
        )}
        <span className={styles.itemPrice}>₹{item.price * item.quantity}</span>
        {item.originalPrice > item.price && (
          <span className={styles.savings}>
            Save ₹{(item.originalPrice - item.price) * item.quantity}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// Add-on Section Component
const AddOnSection = ({ addOns, onToggleAddOn }) => {
  const popularAddOns = addOns.filter(addOn => addOn.popular);
  const regularAddOns = addOns.filter(addOn => !addOn.popular);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={styles.addOnSection}
    >
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Healthcare Add-ons</h2>
        <p className={styles.sectionSubtitle}>Enhance your care experience</p>
      </div>
      
      {popularAddOns.length > 0 && (
        <div className={styles.popularAddOns}>
          <h3 className={styles.popularTitle}>🔥 Most Popular</h3>
          <div className={styles.addOnGrid}>
            {popularAddOns.map((addOn) => (
              <AddOnCard key={addOn.id} addOn={addOn} onToggle={onToggleAddOn} />
            ))}
          </div>
        </div>
      )}
      
      <div className={styles.regularAddOns}>
        <div className={styles.addOnGrid}>
          {regularAddOns.map((addOn) => (
            <AddOnCard key={addOn.id} addOn={addOn} onToggle={onToggleAddOn} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Add-on Card Component
const AddOnCard = ({ addOn, onToggle }) => {
  return (
    <div className={`${styles.addOnCard} ${addOn.selected ? styles.selected : ''}`}>
      <div className={styles.addOnHeader}>
        <span className={styles.addOnIcon}>{addOn.icon}</span>
        {addOn.popular && <span className={styles.popularBadge}>Popular</span>}
      </div>
      
      <div className={styles.addOnContent}>
        <h4 className={styles.addOnName}>{addOn.name}</h4>
        <p className={styles.addOnDescription}>{addOn.description}</p>
      </div>
      
      <div className={styles.addOnFooter}>
        <span className={styles.addOnPrice}>₹{addOn.price}</span>
        <button
          onClick={() => onToggle(addOn.id)}
          className={`${styles.addOnToggle} ${addOn.selected ? styles.selected : ''}`}
        >
          {addOn.selected ? 'Added' : 'Add'}
        </button>
      </div>
    </div>
  );
};

// Tip Section Component
const TipSection = ({ selectedTip, onTipChange }) => {
  const tipOptions = [0, 50, 100, 150];

  return (
    <div className={styles.tipSection}>
      <h2 className={styles.sectionTitle}>Tip Your Tasker</h2>
      <div className={styles.tipOptions}>
        {tipOptions.map((tip) => (
          <button
            key={tip}
            onClick={() => onTipChange(tip)}
            className={`${styles.tipBtn} ${selectedTip === tip ? styles.tipBtnActive : ''}`}
          >
            {tip === 0 ? 'No Tip' : `₹${tip}`}
          </button>
        ))}
      </div>
    </div>
  );
};

// Address Section Component
const AddressSection = ({ address, onAddressChange }) => {
  const handleInputChange = (field, value) => {
    onAddressChange({ ...address, [field]: value });
  };

  return (
    <div className={styles.addressSection}>
      <h2 className={styles.sectionTitle}>Delivery Address</h2>
      <div className={styles.addressForm}>
        <div className={styles.formRow}>
          <input
            type="text"
            placeholder="Full Name"
            value={address.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className={styles.formInput}
          />
          <input
            type="text"
            placeholder="Mobile Number"
            value={address.mobile}
            onChange={(e) => handleInputChange('mobile', e.target.value)}
            className={styles.formInput}
          />
        </div>
        <input
          type="text"
          placeholder="Flat No, Building Name"
          value={address.flatNo}
          onChange={(e) => handleInputChange('flatNo', e.target.value)}
          className={styles.formInput}
        />
        <input
          type="text"
          placeholder="Street, Area"
          value={address.street}
          onChange={(e) => handleInputChange('street', e.target.value)}
          className={styles.formInput}
        />
        <div className={styles.formRow}>
          <input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={styles.formInput}
          />
          <input
            type="text"
            placeholder="State"
            value={address.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className={styles.formInput}
          />
          <input
            type="text"
            placeholder="Pincode"
            value={address.pincode}
            onChange={(e) => handleInputChange('pincode', e.target.value)}
            className={styles.formInput}
          />
        </div>
      </div>
    </div>
  );
};

// Price Summary Component
const PriceSummary = ({ subtotal, addOnTotal, discount, taxes, tip, emergencyFee, finalTotal, totalSavings, onPromoApply }) => {
  const [promoCode, setPromoCode] = useState('');
  const [showPromoSuggestions, setShowPromoSuggestions] = useState(false);
  
  const promoSuggestions = ['HEALTH10', 'SENIOR20', 'NEWUSER', 'FAMILY15'];

  return (
    <div className={styles.priceSummary}>
      <div className={styles.summaryHeader}>
        <h2 className={styles.sectionTitle}>Booking Summary</h2>
        {totalSavings > 0 && (
          <div className={styles.totalSavings}>
            <span>You're saving ₹{totalSavings}!</span>
          </div>
        )}
      </div>
      
      <div className={styles.summaryDetails}>
        <div className={styles.summaryRow}>
          <span>Services Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        
        {addOnTotal > 0 && (
          <div className={styles.summaryRow}>
            <span>Add-ons</span>
            <span>₹{addOnTotal}</span>
          </div>
        )}
        
        {emergencyFee > 0 && (
          <div className={styles.summaryRow}>
            <span>Emergency Service Fee</span>
            <span>₹{emergencyFee}</span>
          </div>
        )}
        
        <div className={styles.summaryRow}>
          <span>GST (18%)</span>
          <span>₹{taxes}</span>
        </div>
        
        {tip > 0 && (
          <div className={styles.summaryRow}>
            <span>Appreciation Tip</span>
            <span>₹{tip}</span>
          </div>
        )}
        
        {discount > 0 && (
          <div className={styles.summaryRow}>
            <span>Promo Discount</span>
            <span className={styles.discount}>-₹{discount}</span>
          </div>
        )}
        
        <div className={styles.summaryDivider}></div>
        
        <div className={styles.summaryTotal}>
          <span>Total Amount</span>
          <span>₹{finalTotal}</span>
        </div>
      </div>
      
      <div className={styles.promoSection}>
        <div className={styles.promoInputContainer}>
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            onFocus={() => setShowPromoSuggestions(true)}
            className={styles.promoInput}
          />
          <button 
            onClick={() => onPromoApply(promoCode)}
            className={styles.promoBtn}
          >
            Apply
          </button>
        </div>
        
        {showPromoSuggestions && (
          <div className={styles.promoSuggestions}>
            <p className={styles.promoSuggestionsTitle}>Try these codes:</p>
            <div className={styles.promoTags}>
              {promoSuggestions.map(code => (
                <button
                  key={code}
                  onClick={() => {
                    setPromoCode(code);
                    setShowPromoSuggestions(false);
                  }}
                  className={styles.promoTag}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button className={styles.checkoutBtn}>
        <Shield className={styles.checkoutIcon} />
        Secure Checkout - ₹{finalTotal}
      </button>
      
      <div className={styles.paymentMethods}>
        <span>We accept:</span>
        <div className={styles.paymentIcons}>
          <span>💳</span>
          <span>🏦</span>
          <span>📱</span>
          <span>💰</span>
        </div>
      </div>
    </div>
  );
};

// Trust Indicators Component
const TrustIndicators = () => {
  return (
    <div className={styles.trustIndicators}>
      <h3 className={styles.trustTitle}>Why Choose NeedStation?</h3>
      <div className={styles.trustGrid}>
        <div className={styles.trustItem}>
          <div className={styles.trustIcon}>
            <Shield className={styles.trustIconSvg} />
          </div>
          <div className={styles.trustContent}>
            <h4>Verified Professionals</h4>
            <p>Background checked & certified healthcare providers</p>
          </div>
        </div>
        
        <div className={styles.trustItem}>
          <div className={styles.trustIcon}>
            <Heart className={styles.trustIconSvg} />
          </div>
          <div className={styles.trustContent}>
            <h4>Compassionate Care</h4>
            <p>Trained in empathy and patient-centered approach</p>
          </div>
        </div>
        
        <div className={styles.trustItem}>
          <div className={styles.trustIcon}>
            <Clock className={styles.trustIconSvg} />
          </div>
          <div className={styles.trustContent}>
            <h4>24/7 Support</h4>
            <p>Round-the-clock assistance and emergency response</p>
          </div>
        </div>
        
        <div className={styles.trustItem}>
          <div className={styles.trustIcon}>
            <CheckCircle className={styles.trustIconSvg} />
          </div>
          <div className={styles.trustContent}>
            <h4>Quality Assured</h4>
            <p>Regular monitoring and quality checks</p>
          </div>
        </div>
      </div>
      
      <div className={styles.trustStats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>10,000+</span>
          <span className={styles.statLabel}>Happy Families</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>4.9★</span>
          <span className={styles.statLabel}>Average Rating</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>500+</span>
          <span className={styles.statLabel}>Certified Professionals</span>
        </div>
      </div>
    </div>
  );
};

// Pending Booking Card Component
const PendingBookingCard = ({ booking, index }) => {
  const navigate = useNavigate();
  
  const getStatusColor = (status) => {
    const colors = {
      'PENDING_WORKER_ASSIGNMENT': 'bg-yellow-500',
      'CONFIRMED': 'bg-blue-500',
      'QUOTATION_PROVIDED': 'bg-green-500',
      'PAYMENT_PENDING': 'bg-orange-500',
      'PAYMENT_COMPLETED': 'bg-green-600',
      'ASSIGNED': 'bg-green-500',
      'IN_PROGRESS': 'bg-purple-500',
      'COMPLETED': 'bg-gray-500',
      'CANCELLED': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };
  
  const getStatusText = (status) => {
    const texts = {
      'PENDING_WORKER_ASSIGNMENT': 'Finding Worker',
      'CONFIRMED': 'Worker Confirmed',
      'QUOTATION_PROVIDED': 'Quotation Received',
      'PAYMENT_PENDING': 'Payment Pending',
      'PAYMENT_COMPLETED': 'Payment Completed',
      'ASSIGNED': 'Assigned',
      'IN_PROGRESS': 'In Progress',
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled'
    };
    return texts[status] || status;
  };
  
  const handlePayment = () => {
    // Navigate to payment page with booking details
    navigate('/payment', { state: { booking } });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={styles.bookingCard}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            {booking.serviceName}
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
            Booking #{booking.bookingNumber}
          </p>
        </div>
        <span 
          className={`${getStatusColor(booking.status)}`}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: 'white'
          }}
        >
          {getStatusText(booking.status)}
        </span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.7)' }} />
          <span style={{ fontSize: '0.875rem' }}>{booking.preferredDate}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.7)' }} />
          <span style={{ fontSize: '0.875rem' }}>{booking.preferredTimeSlot || booking.preferredTime}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.7)' }} />
          <span style={{ fontSize: '0.875rem' }}>{booking.city}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CreditCard className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.7)' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>₹{booking.totalAmount}</span>
        </div>
      </div>
      
      {booking.status === 'PENDING_WORKER_ASSIGNMENT' && (
        <div 
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#3b82f6' }} />
          <span style={{ fontSize: '0.875rem', color: '#3b82f6' }}>
            We're finding the best worker near you...
          </span>
        </div>
      )}
      
      {booking.status === 'CONFIRMED' && (
        <div 
          style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <CheckCircle className="w-4 h-4" style={{ color: '#22c55e' }} />
          <span style={{ fontSize: '0.875rem', color: '#22c55e' }}>
            Worker confirmed! Awaiting quotation...
          </span>
        </div>
      )}
      
      {(booking.status === 'QUOTATION_PROVIDED' || booking.status === 'PAYMENT_PENDING') && booking.quotation && (
        <div style={{ marginTop: '1rem' }}>
          {/* Quotation Details */}
          <div 
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#10b981' }}>
                💰 Quotation Received
              </h4>
              {booking.assignedWorkerName && (
                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                  by {booking.assignedWorkerName}
                </span>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>Service Charge:</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>₹{booking.quotation.serviceCharge || booking.totalAmount}</span>
              </div>
              {booking.quotation.additionalCharges && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>Additional Charges:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>₹{booking.quotation.additionalCharges}</span>
                </div>
              )}
              {booking.quotation.discount && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#10b981' }}>Discount:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#10b981' }}>-₹{booking.quotation.discount}</span>
                </div>
              )}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '600' }}>Total Amount:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10b981' }}>
                    ₹{booking.quotation.totalAmount || booking.totalAmount}
                  </span>
                </div>
              </div>
              {booking.quotation.notes && (
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                  Note: {booking.quotation.notes}
                </p>
              )}
            </div>
          </div>
          
          {/* Payment Button */}
          {booking.status === 'QUOTATION_PROVIDED' && (
            <button
              onClick={handlePayment}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '1rem',
                borderRadius: '12px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              <CreditCard className="w-5 h-5" />
              Proceed to Payment
            </button>
          )}
          
          {booking.status === 'PAYMENT_PENDING' && (
            <div 
              style={{
                background: 'rgba(249, 115, 22, 0.1)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                borderRadius: '8px',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <AlertCircle className="w-4 h-4" style={{ color: '#f97316' }} />
              <span style={{ fontSize: '0.875rem', color: '#f97316' }}>
                Payment pending. Please complete payment to proceed.
              </span>
            </div>
          )}
        </div>
      )}
      
      {booking.status === 'PAYMENT_COMPLETED' && (
        <div 
          style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1rem'
          }}
        >
          <CheckCircle className="w-4 h-4" style={{ color: '#22c55e' }} />
          <span style={{ fontSize: '0.875rem', color: '#22c55e' }}>
            Payment completed! Check your dashboard for service details.
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;
