import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import { useAuth } from '../../store/AuthContext';
import axios from 'axios';
import { 
  ArrowLeft, Trash2, Plus, Minus, MapPin, Clock, Calendar,
  ShieldCheck, Star, Tag, ChevronRight, AlertCircle, CheckCircle2,
  CreditCard, Wallet, Smartphone, Gift, Info, User, Phone, Home, Package, Loader2, X
} from 'lucide-react';
import styles from './CartNew.module.css';

const CartNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successBookingData, setSuccessBookingData] = useState(null);
  
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
        
        console.log('🔍 CartNew: Fetching bookings for userId:', userId);
        
        if (!userId) {
          console.log('❌ CartNew: No userId found in localStorage');
          return;
        }
        
        const url = `${API_URL}/bookings/user/${userId}`;
        console.log('📡 CartNew: Fetching from:', url);
        
        const response = await axios.get(url);
        console.log('📥 CartNew: Response:', response.data);
        
        if (response.data.success) {
          const bookings = response.data.bookings || [];
          console.log('✅ CartNew: Found', bookings.length, 'bookings');
          setUserBookings(bookings);
        } else {
          console.log('⚠️ CartNew: API returned success=false');
        }
      } catch (error) {
        console.error('❌ CartNew: Error fetching bookings:', error);
        console.error('❌ CartNew: Error details:', error.response?.data);
      } finally {
        setLoadingBookings(false);
      }
    };
    
    fetchUserBookings();
  }, [successBookingData, location.state, API_URL]);

  // Promo codes
  const promoCodes = {
    'FIRST50': { discount: 50, type: 'percentage', message: '50% off on first booking!' },
    'HEALTH100': { discount: 100, type: 'fixed', message: '₹100 off applied!' },
    'CARE20': { discount: 20, type: 'percentage', message: '20% discount applied!' },
    'WELCOME': { discount: 150, type: 'fixed', message: 'Welcome discount of ₹150!' }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const platformFee = 49;
  const gst = Math.round((subtotal + platformFee) * 0.18);
  
  let discountAmount = 0;
  if (discount > 0) {
    const promo = Object.values(promoCodes).find(p => p.discount === discount);
    if (promo) {
      discountAmount = promo.type === 'percentage' 
        ? Math.round(subtotal * (promo.discount / 100))
        : promo.discount;
    }
  }
  
  const total = subtotal + platformFee + gst - discountAmount;

  // Apply promo code
  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase();
    const promo = promoCodes[code];
    
    if (promo) {
      setDiscount(promo.discount);
      setPromoMessage(promo.message);
      setTimeout(() => setPromoMessage(''), 3000);
    } else {
      setPromoMessage('Invalid promo code');
      setTimeout(() => setPromoMessage(''), 3000);
    }
  };

  // Handle quantity update
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Razorpay payment
  const handlePayment = async () => {
    if (!user) {
      alert('Please login to continue with payment');
      navigate('/login');
      return;
    }

    // Check if user has an ID
    const userId = user.id || user.userId || user.user_id;
    if (!userId) {
      console.error('User object:', user);
      alert('User ID not found. Please login again.');
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Please check your connection.');
      setIsProcessing(false);
      return;
    }

    // Create order on backend
    try {
      const orderResponse = await fetch('http://localhost:8080/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          userId: userId
        })
      });

      const orderData = await orderResponse.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID', // Replace with your Razorpay key
        amount: total * 100, // Amount in paise
        currency: 'INR',
        name: 'NeedStation',
        description: 'Healthcare Services Payment',
        order_id: orderData.orderId,
        handler: function (response) {
          // Payment successful
          console.log('Payment successful:', response);
          
          // Verify payment on backend
          verifyPayment(response);
        },
        prefill: {
          name: user.name || user.username,
          email: user.email,
          contact: user.phone || user.mobile
        },
        theme: {
          color: '#5CE1E6'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      setIsProcessing(false);

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  // Verify payment
  const verifyPayment = async (paymentData) => {
    const userId = user.id || user.userId || user.user_id;
    
    try {
      const response = await fetch('http://localhost:8080/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
          cartItems: cartItems,
          userId: userId,
          amount: total
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Clear cart and navigate to success page
        clearCart();
        navigate('/booking-success', { 
          state: { 
            bookingId: result.bookingId,
            amount: total,
            services: cartItems
          }
        });
      } else {
        alert('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Payment verification failed. Please contact support.');
    }
  };

  return (
    <div className={styles.container}>
      {/* Success Message Banner */}
      <AnimatePresence>
        {showSuccessMessage && successBookingData && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            style={{
              position: 'fixed',
              top: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              padding: '1.5rem 2rem',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              maxWidth: '600px',
              width: '90%'
            }}
          >
            <CheckCircle2 className="w-8 h-8" style={{ color: 'white' }} />
            <div style={{ color: 'white' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                🎉 Booking Confirmed Successfully!
              </h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                <strong>Booking #{successBookingData.bookingNumber}</strong> - {successBookingData.serviceName}
              </p>
              <p style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.25rem' }}>
                We're finding the best workers near you! You'll be notified once a worker accepts your booking.
              </p>
            </div>
            <button 
              onClick={() => setShowSuccessMessage(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem',
                cursor: 'pointer',
                color: 'white'
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className={styles.headerTitle}>
            <h1>Your Cart & Bookings</h1>
            <p>{cartItems.length} cart items • {userBookings.length} bookings</p>
          </div>

          <div className={styles.headerActions}>
            <ShieldCheck className="w-5 h-5" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          {/* Pending Bookings Section */}
          {userBookings.length > 0 && (
            <section className={styles.cartSection} style={{ marginBottom: '2rem' }}>
              <div className={styles.sectionHeader}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Package className="w-6 h-6" />
                  Your Bookings
                </h2>
                <span style={{ 
                  background: '#5CE1E6', 
                  color: '#1A1D29', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '999px',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {userBookings.length} booking(s)
                </span>
              </div>

              <div className={styles.cartItems}>
                {loadingBookings ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <Loader2 className="w-8 h-8 animate-spin" style={{ margin: '0 auto' }} />
                    <p>Loading bookings...</p>
                  </div>
                ) : (
                  userBookings.map((booking, index) => (
                    <BookingCard key={booking.id} booking={booking} index={index} />
                  ))
                )}
              </div>
            </section>
          )}
          
          {/* Cart Items */}
          {cartItems.length > 0 && (
            <section className={styles.cartSection}>
            <div className={styles.sectionHeader}>
              <h2>Selected Services</h2>
              <button onClick={clearCart} className={styles.clearButton}>
                Clear All
              </button>
            </div>

            <div className={styles.cartItems}>
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    index={index}
                    onQuantityChange={handleQuantityChange}
                    onRemove={removeFromCart}
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>
          )}

          {/* Trust Indicators */}
          <section className={styles.trustSection}>
            <div className={styles.trustBadges}>
              <div className={styles.trustBadge}>
                <ShieldCheck className="w-5 h-5" />
                <div>
                  <h4>Verified Professionals</h4>
                  <p>Background checked & trained</p>
                </div>
              </div>
              <div className={styles.trustBadge}>
                <Star className="w-5 h-5" />
                <div>
                  <h4>4.8★ Average Rating</h4>
                  <p>Based on 10,000+ reviews</p>
                </div>
              </div>
              <div className={styles.trustBadge}>
                <CheckCircle2 className="w-5 h-5" />
                <div>
                  <h4>100% Satisfaction</h4>
                  <p>Money-back guarantee</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar - Summary */}
        <aside className={styles.sidebar}>
          <div className={styles.stickyContainer}>
            {/* Price Summary */}
            <div className={styles.summaryCard}>
              <h3>Price Summary</h3>
              
              <div className={styles.summaryItems}>
                <div className={styles.summaryItem}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className={styles.summaryItem}>
                  <span>Platform Fee</span>
                  <span>₹{platformFee}</span>
                </div>
                
                <div className={styles.summaryItem}>
                  <span>GST (18%)</span>
                  <span>₹{gst.toLocaleString()}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className={`${styles.summaryItem} ${styles.discount}`}>
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className={styles.summaryTotal}>
                <span>Total Amount</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              {/* Promo Code */}
              <div className={styles.promoSection}>
                {!showPromoInput ? (
                  <button 
                    onClick={() => setShowPromoInput(true)}
                    className={styles.promoButton}
                  >
                    <Tag className="w-4 h-4" />
                    Apply Promo Code
                  </button>
                ) : (
                  <div className={styles.promoInput}>
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className={styles.input}
                    />
                    <button onClick={handleApplyPromo} className={styles.applyButton}>
                      Apply
                    </button>
                  </div>
                )}
                
                {promoMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${styles.promoMessage} ${
                      promoMessage.includes('Invalid') ? styles.error : styles.success
                    }`}
                  >
                    {promoMessage}
                  </motion.div>
                )}
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={styles.checkoutButton}
              >
                {isProcessing ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Proceed to Payment</span>
                    <span>₹{total.toLocaleString()}</span>
                  </>
                )}
              </button>

              {/* Payment Methods */}
              <div className={styles.paymentMethods}>
                <p>We accept</p>
                <div className={styles.methodIcons}>
                  <CreditCard className="w-5 h-5" />
                  <Wallet className="w-5 h-5" />
                  <Smartphone className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Suggested Promo Codes */}
            <div className={styles.suggestedPromos}>
              <h4>Available Offers</h4>
              <div className={styles.promoList}>
                {Object.entries(promoCodes).map(([code, promo]) => (
                  <button
                    key={code}
                    onClick={() => {
                      setPromoCode(code);
                      setShowPromoInput(true);
                      handleApplyPromo();
                    }}
                    className={styles.promoCard}
                  >
                    <Gift className="w-4 h-4" />
                    <div>
                      <strong>{code}</strong>
                      <p>{promo.message}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

// Cart Item Component
const CartItem = ({ item, index, onQuantityChange, onRemove }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.1 }}
      className={styles.cartItem}
    >
      <div className={styles.itemImage}>
        {item.image ? (
          <img src={item.image} alt={item.name} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <Home className="w-8 h-8" />
          </div>
        )}
      </div>

      <div className={styles.itemDetails}>
        <div className={styles.itemHeader}>
          <div>
            <h3>{item.name}</h3>
            {item.category && <span className={styles.category}>{item.category}</span>}
          </div>
          
          {item.rating && (
            <div className={styles.rating}>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{item.rating}</span>
            </div>
          )}
        </div>

        {item.description && (
          <p className={styles.description}>{item.description}</p>
        )}

        <div className={styles.itemMeta}>
          {item.duration && (
            <div className={styles.metaItem}>
              <Clock className="w-4 h-4" />
              <span>{item.duration}</span>
            </div>
          )}
          
          {item.scheduledDate && (
            <div className={styles.metaItem}>
              <Calendar className="w-4 h-4" />
              <span>{new Date(item.scheduledDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {item.features && item.features.length > 0 && (
          <div className={styles.features}>
            {item.features.slice(0, 3).map((feature, idx) => (
              <span key={idx} className={styles.featureTag}>
                <CheckCircle2 className="w-3 h-3" />
                {feature}
              </span>
            ))}
            {item.features.length > 3 && (
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className={styles.moreFeatures}
              >
                +{item.features.length - 3} more
              </button>
            )}
          </div>
        )}

        <div className={styles.itemActions}>
          <div className={styles.quantityControl}>
            <button
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              className={styles.quantityButton}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className={styles.quantity}>{item.quantity}</span>
            <button
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              className={styles.quantityButton}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className={styles.removeButton}
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        </div>
      </div>

      <div className={styles.itemPrice}>
        {item.originalPrice && item.originalPrice > item.price && (
          <span className={styles.originalPrice}>
            ₹{(item.originalPrice * item.quantity).toLocaleString()}
          </span>
        )}
        <span className={styles.currentPrice}>
          ₹{(item.price * item.quantity).toLocaleString()}
        </span>
        {item.originalPrice && item.originalPrice > item.price && (
          <span className={styles.savings}>
            Save ₹{((item.originalPrice - item.price) * item.quantity).toLocaleString()}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// Service image mapping
const getServiceImage = (serviceName) => {
  const imageMap = {
    // Personal Care
    'Personal Care': () => import('../../assets/images/services/minicards/elder care/ec2 personal.jpg'),
    'Companion Care': () => import('../../assets/images/services/minicards/elder care/ec1 companion.jpg'),
    'Respite Care': () => import('../../assets/images/services/minicards/elder care/ec4 respite.jpg'),
    'Dementia Care': () => import('../../assets/images/services/minicards/elder care/ec3 dementia.jpg'),
    
    // Bedridden Patient Care
    'Complete Bed Care': () => import('../../assets/images/services/minicards/bedridden patient care/bpc1 complete bed care.jpg'),
    'Stroke Patient Care': () => import('../../assets/images/services/minicards/bedridden patient care/bpc2 stroke patient.jpg'),
    'Coma Care': () => import('../../assets/images/services/minicards/bedridden patient care/bpc3 coma.jpg'),
    'Palliative Care': () => import('../../assets/images/services/minicards/bedridden patient care/bpc4 palliativecare.jpg'),
    
    // Caretaker at Home
    'Live-in Caretaker': () => import('../../assets/images/services/minicards/caretaker at home/cah1 live in caretaker.jpg'),
    'Part-time Caretaker': () => import('../../assets/images/services/minicards/caretaker at home/cah2 part time caretaker.webp'),
    'Cook': () => import('../../assets/images/services/minicards/caretaker at home/cah3 cook.jpg'),
    'Nanny': () => import('../../assets/images/services/minicards/caretaker at home/cah4 nanny.jpg'),
    
    // Diabetes Care
    'Type 1 Diabetes': () => import('../../assets/images/services/minicards/diabetes care/dm type 1.webp'),
    'Type 2 Diabetes': () => import('../../assets/images/services/minicards/diabetes care/db2 type2.jpg'),
    'Gestational Diabetes': () => import('../../assets/images/services/minicards/diabetes care/dm3 gestational.jpg'),
    'Diabetes Complication': () => import('../../assets/images/services/minicards/diabetes care/dm4 complication.jpg'),
    
    // Health Checkup
    'Basic Health Checkup': () => import('../../assets/images/services/minicards/health check up services/hcs1 basic.jpg'),
    'Comprehensive Health Checkup': () => import('../../assets/images/services/minicards/health check up services/hcs2 comprehensive health checkup.jpg'),
    'Senior Citizen Health Checkup': () => import('../../assets/images/services/minicards/health check up services/hcs3 senior citizen.png'),
    'Women Health Checkup': () => import('../../assets/images/services/minicards/health check up services/hcs4 women health checkup.jpg'),
    
    // Mother and Baby Care
    'Newborn Care': () => import('../../assets/images/services/minicards/mother and baby care/mbc newborn care.jpg'),
    'Postnatal Care': () => import('../../assets/images/services/minicards/mother and baby care/mbc postnatal.jpg'),
    'Baby Massage and Care': () => import('../../assets/images/services/minicards/mother and baby care/mbc baby massage and care.jpg'),
    'Twins Baby Care': () => import('../../assets/images/services/minicards/mother and baby care/mbc twins baby care.jpg'),
    
    // Nursing Care
    'General Nursing': () => import('../../assets/images/services/minicards/nursing care/nc1 general nursing.jpg'),
    'ICU Trained Nurse': () => import('../../assets/images/services/minicards/nursing care/nc2 icu trained.jpeg'),
    'Wound Care': () => import('../../assets/images/services/minicards/nursing care/nc3 wound care.jpg'),
    'Pediatric Nursing': () => import('../../assets/images/services/minicards/nursing care/nc4 pediatric.jpg'),
    
    // Paralysis Care
    'Hemiplegia Care': () => import('../../assets/images/services/minicards/paralysis care/parac1 hemiplegia care.webp'),
    'Paraphlegia Care': () => import('../../assets/images/services/minicards/paralysis care/parac2 paraphlegia.jpg'),
    'Quadriplegia Care': () => import('../../assets/images/services/minicards/paralysis care/parac3 quadriplegia.jpg'),
    'Facial Paralysis Care': () => import('../../assets/images/services/minicards/paralysis care/parac4 facial paralysis.jpg'),
    
    // Parkinsons Care
    'Early Stage Parkinsons': () => import('../../assets/images/services/minicards/parkinsons cae/pc1 early stage.jfif'),
    'Advanced Stage Parkinsons': () => import('../../assets/images/services/minicards/parkinsons cae/pc2 advanced stage.jpg'),
    'Parkinsons Therapy Support': () => import('../../assets/images/services/minicards/parkinsons cae/pc3 therapy support.jpg'),
    
    // Pathology Care
    'Home Sample Collection': () => import('../../assets/images/services/minicards/pathology care/pathc1 home sample.jpg'),
    'Diagnostic Services': () => import('../../assets/images/services/minicards/pathology care/pathc2 diagnostic services.jpg'),
    'Regular Monitoring': () => import('../../assets/images/services/minicards/pathology care/pathc3 regular monitoring.webp'),
    'Corporate Health Package': () => import('../../assets/images/services/minicards/pathology care/pathc4 corporate health.jpg'),
    
    // Physiotherapy
    'Orthopedic Physiotherapy': () => import('../../assets/images/services/minicards/physiotherapy/p1 orthopedic.jpg'),
    'Neurological Physiotherapy': () => import('../../assets/images/services/minicards/physiotherapy/p2 neurological.jpg'),
    'Pediatric Physiotherapy': () => import('../../assets/images/services/minicards/physiotherapy/p3 pediatric.jpg'),
    'Geriatric Physiotherapy': () => import('../../assets/images/services/minicards/physiotherapy/p4 geriatric.jpg'),
    
    // Post Surgery Care
    'Cardiac Surgery Care': () => import('../../assets/images/services/minicards/post surgery care/ps1 cardiac surgery.jpg'),
    'Orthopedic Surgery Care': () => import('../../assets/images/services/minicards/post surgery care/ps2 orthopedic.jpg'),
    'Abdominal Surgery Care': () => import('../../assets/images/services/minicards/post surgery care/ps3 abdominal surgery care.jpg'),
    'Neuro Surgery Care': () => import('../../assets/images/services/minicards/post surgery care/ps4 neuro surgery care.webp'),
    
    // Security Guard
    'Home Security': () => import('../../assets/images/services/minicards/security guard/hsg home sec.jpg'),
    'Corporate Security': () => import('../../assets/images/services/minicards/security guard/hsg corporate security.jpg'),
    'Event Security': () => import('../../assets/images/services/minicards/security guard/hsg event security.jpg'),
    'Night Watchman': () => import('../../assets/images/services/minicards/security guard/hsg night watchman.jpg'),
  };
  
  return imageMap[serviceName] || null;
};

// Booking Card Component
const BookingCard = ({ booking, index }) => {
  const [serviceImage, setServiceImage] = useState(null);
  
  // Load service image based on service name
  useEffect(() => {
    const loadImage = async () => {
      const imageLoader = getServiceImage(booking.serviceName);
      if (imageLoader) {
        try {
          const module = await imageLoader();
          setServiceImage(module.default);
        } catch (error) {
          console.error('Error loading service image:', error);
        }
      }
    };
    
    loadImage();
  }, [booking.serviceName]);
  
  const getStatusColor = (status) => {
    const colors = {
      'PENDING_WORKER_ASSIGNMENT': '#f59e0b',
      'CONFIRMED': '#3b82f6',
      'QUOTATION_PROVIDED': '#10b981',
      'PAYMENT_PENDING': '#f97316',
      'PAYMENT_COMPLETED': '#059669',
      'ASSIGNED': '#10b981',
      'IN_PROGRESS': '#8b5cf6',
      'COMPLETED': '#6b7280',
      'CANCELLED': '#ef4444'
    };
    return colors[status] || '#6b7280';
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
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.1 }}
      className={styles.cartItem}
    >
      <div className={styles.itemImage}>
        {serviceImage ? (
          <img src={serviceImage} alt={booking.serviceName} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <Package className="w-8 h-8" />
          </div>
        )}
      </div>

      <div className={styles.itemDetails}>
        <div className={styles.itemHeader}>
          <div>
            <h3>{booking.serviceName}</h3>
            <span className={styles.category}>Booking #{booking.bookingNumber}</span>
          </div>
          
          <div style={{
            background: getStatusColor(booking.status),
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '999px',
            fontSize: '0.875rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {booking.status === 'PENDING_WORKER_ASSIGNMENT' && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            {getStatusText(booking.status)}
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: '#4b5563',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar className="w-4 h-4" style={{ color: '#6b7280', flexShrink: 0 }} />
            <span style={{ fontWeight: '500' }}>{booking.preferredDate}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock className="w-4 h-4" style={{ color: '#6b7280', flexShrink: 0 }} />
            <span style={{ fontWeight: '500' }}>{booking.preferredTimeSlot || booking.preferredTime}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin className="w-4 h-4" style={{ color: '#6b7280', flexShrink: 0 }} />
            <span style={{ fontWeight: '500' }}>{booking.city}</span>
          </div>
        </div>
        
        {booking.status === 'PENDING_WORKER_ASSIGNMENT' && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.12) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginTop: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#2563eb',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            <Loader2 className="w-4 h-4 animate-spin" style={{ flexShrink: 0 }} />
            <span>Finding the best worker near you...</span>
          </div>
        )}
        
        {booking.status === 'CONFIRMED' && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.12) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginTop: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#059669',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            <CheckCircle2 className="w-4 h-4" style={{ flexShrink: 0 }} />
            <span>Worker confirmed! Awaiting quotation...</span>
          </div>
        )}
      </div>

      <div className={styles.itemPrice}>
        <span className={styles.currentPrice}>
          ₹{booking.totalAmount?.toLocaleString()}
        </span>
        <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
          Total Amount
        </span>
      </div>
    </motion.div>
  );
};

export default CartNew;
