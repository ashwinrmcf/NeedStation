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
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [acceptedQuotations, setAcceptedQuotations] = useState([]);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  
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

  // Fetch user's bookings function (moved outside useEffect so it can be reused)
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

  // Fetch user's bookings on mount
  useEffect(() => {
    fetchUserBookings();
  }, [successBookingData, location.state]);

  // Promo codes
  const promoCodes = {
    'FIRST50': { discount: 50, type: 'percentage', message: '50% off on first booking!' },
    'HEALTH100': { discount: 100, type: 'fixed', message: '₹100 off applied!' },
    'CARE20': { discount: 20, type: 'percentage', message: '20% discount applied!' },
    'WELCOME': { discount: 150, type: 'fixed', message: 'Welcome discount of ₹150!' }
  };

  // Calculate totals
  const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate quotation subtotal from accepted quotations
  const quotationSubtotal = acceptedQuotations.reduce((sum, booking) => {
    return sum + (booking.quotationAmount || 0);
  }, 0);
  
  const subtotal = cartSubtotal + quotationSubtotal;
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

  // Handle cancel booking request
  const handleCancelRequest = (booking) => {
    setBookingToCancel(booking);
    setShowCancelConfirm(true);
  };

  // Confirm cancel booking
  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;

    setCancellingBookingId(bookingToCancel.id);
    try {
      const response = await axios.delete(
        `${API_URL}/bookings/${bookingToCancel.id}/cancel`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        // Refresh bookings list
        await fetchUserBookings();
        setShowCancelConfirm(false);
        setBookingToCancel(null);
        alert('Booking cancelled successfully!');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingBookingId(null);
    }
  };

  // Handle view quotation
  const handleViewQuotation = (booking) => {
    setSelectedQuotation(booking);
    setShowQuotationModal(true);
  };

  // Handle accept quotation
  const handleAcceptQuotation = (booking) => {
    // Add to accepted quotations if not already added
    if (!acceptedQuotations.find(q => q.id === booking.id)) {
      setAcceptedQuotations([...acceptedQuotations, booking]);
      setShowQuotationModal(false);
      alert(`Quotation of ₹${booking.quotationAmount?.toLocaleString()} accepted! Check the Price Summary.`);
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
          amount: total,
          // Payment breakdown
          subtotal: subtotal,
          platformFee: platformFee,
          gst: gst,
          discountAmount: discountAmount,
          promoCode: promoCode,
          // Accepted quotations (bookings to be paid)
          acceptedQuotations: acceptedQuotations.map(q => q.id)
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Clear cart and navigate to success page
        clearCart();
        navigate('/booking-success', { 
          state: { 
            bookingIds: result.bookingIds || acceptedQuotations.map(q => q.id),
            bookingId: result.bookingIds?.[0] || acceptedQuotations[0]?.id,
            amount: total,
            services: acceptedQuotations,
            paymentDetails: {
              subtotal: subtotal,
              platformFee: platformFee,
              gst: gst,
              discount: discountAmount,
              total: total
            }
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
                    <BookingCard 
                      key={booking.id} 
                      booking={booking} 
                      index={index}
                      onCancelRequest={handleCancelRequest}
                      onViewQuotation={handleViewQuotation}
                      cancellingBookingId={cancellingBookingId}
                      acceptedQuotations={acceptedQuotations}
                    />
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
            {/* Price Summary - Always visible */}
            <div className={styles.summaryCard}>
              <h3>Price Summary</h3>
              
              <div className={styles.summaryItems}>
                {/* Show breakdown only if there are accepted quotations or cart items */}
                {(acceptedQuotations.length > 0 || cartItems.length > 0) ? (
                  <>
                    {/* Show breakdown if there are accepted quotations */}
                    {acceptedQuotations.length > 0 && (
                      <>
                        {cartSubtotal > 0 && (
                          <div className={styles.summaryItem}>
                            <span>Cart Items</span>
                            <span>₹{cartSubtotal.toLocaleString()}</span>
                          </div>
                        )}
                        {acceptedQuotations.map((booking) => (
                          <div key={booking.id} className={styles.summaryItem} style={{ 
                            background: 'rgba(16, 185, 129, 0.05)',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            marginBottom: '0.5rem'
                          }}>
                            <span style={{ fontSize: '0.875rem' }}>
                              {booking.serviceName}
                              <br />
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                (Quotation)
                              </span>
                            </span>
                            <span style={{ color: '#10b981', fontWeight: '600' }}>
                              ₹{booking.quotationAmount?.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                    
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
                  </>
                ) : (
                  <>
                    <div className={styles.summaryItem}>
                      <span>Subtotal</span>
                      <span>₹0</span>
                    </div>
                    
                    <div className={styles.summaryItem}>
                      <span>Platform Fee</span>
                      <span>₹0</span>
                    </div>
                    
                    <div className={styles.summaryItem}>
                      <span>GST (18%)</span>
                      <span>₹0</span>
                    </div>
                  </>
                )}
              </div>

              <div className={styles.summaryTotal}>
                <span>Total Amount</span>
                <span>₹{(acceptedQuotations.length > 0 || cartItems.length > 0) ? total.toLocaleString() : '0'}</span>
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
                disabled={isProcessing || (acceptedQuotations.length === 0 && cartItems.length === 0)}
                className={styles.checkoutButton}
                style={{
                  opacity: (acceptedQuotations.length === 0 && cartItems.length === 0) ? 0.5 : 1,
                  cursor: (acceptedQuotations.length === 0 && cartItems.length === 0) ? 'not-allowed' : 'pointer'
                }}
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

      {/* Quotation Modal */}
      <QuotationModal
        isOpen={showQuotationModal}
        onClose={() => {
          setShowQuotationModal(false);
          setSelectedQuotation(null);
        }}
        booking={selectedQuotation}
        onAccept={handleAcceptQuotation}
        isAccepted={selectedQuotation && acceptedQuotations.find(q => q.id === selectedQuotation.id)}
      />

      {/* Cancel Confirmation Modal */}
      <CancelConfirmModal
        isOpen={showCancelConfirm}
        onClose={() => {
          setShowCancelConfirm(false);
          setBookingToCancel(null);
        }}
        onConfirm={confirmCancelBooking}
        booking={bookingToCancel}
        isCancelling={cancellingBookingId !== null}
      />
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
const BookingCard = ({ booking, index, onCancelRequest, onViewQuotation, cancellingBookingId, acceptedQuotations }) => {
  const isAccepted = acceptedQuotations && acceptedQuotations.find(q => q.id === booking.id);
  const [serviceImage, setServiceImage] = useState(null);
  
  // Random motivational messages for pending bookings
  const pendingMessages = [
    "Finding the perfect tasker for your needs. You'll be notified soon.",
    "Matching you with our top-rated taskers in your area.",
    "Searching for verified professionals near you. Hang tight!",
    "We're selecting the best tasker for your service.",
    "Connecting you with experienced taskers nearby.",
    "Finding a highly-rated tasker in your location.",
    "Reviewing available taskers to ensure the best match.",
    "Our team is finding the right professional for you.",
    "Matching your requirements with qualified taskers.",
    "Searching for the most suitable tasker in your area."
  ];
  
  // Use booking ID to consistently show the same message for each booking
  const messageIndex = booking.id % pendingMessages.length;
  const pendingMessage = pendingMessages[messageIndex];
  
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
      'ASSIGNED': '#3b82f6',
      'QUOTATION_PROVIDED': '#10b981',
      'PAYMENT_PENDING': '#f97316',
      'PAYMENT_COMPLETED': '#059669',
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
      'ASSIGNED': 'Worker Confirmed',
      'QUOTATION_PROVIDED': 'Quotation Received',
      'PAYMENT_PENDING': 'Payment Pending',
      'PAYMENT_COMPLETED': 'Payment Completed',
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
            justifyContent: 'space-between',
            gap: '0.75rem',
            color: '#2563eb',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
              <span style={{ fontWeight: '600' }}>Matching you with verified professionals...</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                {pendingMessage}
              </span>
            </div>
            <button
              onClick={() => onCancelRequest(booking)}
              disabled={cancellingBookingId === booking.id}
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.7rem',
                color: '#dc2626',
                background: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(220, 38, 38, 0.2)';
                e.target.style.borderColor = 'rgba(220, 38, 38, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(220, 38, 38, 0.1)';
                e.target.style.borderColor = 'rgba(220, 38, 38, 0.3)';
              }}
            >
              {cancellingBookingId === booking.id ? 'Cancelling...' : 'Cancel'}
            </button>
          </div>
        )}
        
        {(booking.status === 'CONFIRMED' || booking.status === 'ASSIGNED') && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.12) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginTop: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            color: '#059669',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle2 className="w-4 h-4" style={{ flexShrink: 0 }} />
              <span>
                {booking.quotationAmount 
                  ? 'Worker confirmed! Quotation received.' 
                  : 'Worker confirmed! Awaiting quotation...'}
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {booking.quotationAmount && (
                <button
                  onClick={() => onViewQuotation(booking)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: isAccepted 
                      ? '#6b7280' 
                      : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: isAccepted ? 'default' : 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    opacity: isAccepted ? 0.8 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isAccepted) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {isAccepted ? '✓ Quotation Accepted' : 'View Quotation'}
                </button>
              )}
              
              {/* Cancel button - only show if payment not completed */}
              {booking.status !== 'PAYMENT_COMPLETED' && booking.paymentStatus !== 'PAID' && (
                <button
                  onClick={() => onCancelRequest(booking)}
                  disabled={cancellingBookingId === booking.id}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.8rem',
                    color: '#dc2626',
                    background: 'rgba(220, 38, 38, 0.1)',
                    border: '1px solid rgba(220, 38, 38, 0.3)',
                    borderRadius: '6px',
                    cursor: cancellingBookingId === booking.id ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (cancellingBookingId !== booking.id) {
                      e.target.style.background = 'rgba(220, 38, 38, 0.2)';
                      e.target.style.borderColor = 'rgba(220, 38, 38, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(220, 38, 38, 0.1)';
                    e.target.style.borderColor = 'rgba(220, 38, 38, 0.3)';
                  }}
                >
                  {cancellingBookingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Cancel Confirmation Modal Component
const CancelConfirmModal = ({ isOpen, onClose, onConfirm, booking, isCancelling }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-primary)',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%',
        border: '1px solid rgba(220, 38, 38, 0.3)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Warning Icon */}
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'rgba(220, 38, 38, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <AlertCircle style={{ width: '32px', height: '32px', color: '#dc2626' }} />
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          textAlign: 'center',
          marginBottom: '0.75rem'
        }}>
          Cancel Booking?
        </h3>

        {/* Warning Message */}
        <p style={{
          fontSize: '0.95rem',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          marginBottom: '0.5rem',
          lineHeight: '1.5'
        }}>
          Are you sure you want to cancel this booking?
        </p>

        <p style={{
          fontSize: '0.875rem',
          color: '#dc2626',
          textAlign: 'center',
          marginBottom: '1.5rem',
          fontWeight: '500'
        }}>
          ⚠️ This action cannot be undone
        </p>

        {/* Booking Details */}
        {booking && (
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>{booking.serviceName}</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Booking #{booking.bookingNumber}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Amount: ₹{booking.totalAmount?.toLocaleString()}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.75rem'
        }}>
          <button
            onClick={onClose}
            disabled={isCancelling}
            style={{
              flex: 1,
              padding: '0.875rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            disabled={isCancelling}
            style={{
              flex: 1,
              padding: '0.875rem',
              borderRadius: '8px',
              border: 'none',
              background: isCancelling ? '#9ca3af' : '#dc2626',
              color: 'white',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: isCancelling ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: isCancelling ? 0.6 : 1
            }}
          >
            {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Quotation Modal Component
const QuotationModal = ({ isOpen, onClose, booking, onAccept, isAccepted }) => {
  if (!isOpen || !booking) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={{
          background: 'var(--bg-primary)',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '600px',
          width: '100%',
          border: '2px solid #10b981',
          boxShadow: '0 20px 60px rgba(16, 185, 129, 0.3)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '0.25rem'
              }}>
                Quotation Received
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Review the details below
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '0.5rem',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              transition: 'all 0.2s'
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Service Info */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {booking.serviceName}
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Booking #{booking.bookingNumber}
          </p>
        </div>

        {/* Quoted Amount */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.12) 100%)',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: '600' }}>
            Quoted Amount
          </p>
          <p style={{ fontSize: '3rem', fontWeight: '700', color: '#10b981', lineHeight: '1' }}>
            ₹{booking.quotationAmount?.toLocaleString()}
          </p>
        </div>

        {/* Quotation Details */}
        {booking.quotationDetails && (
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-color)'
          }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: '600' }}>
              📋 Quotation Details:
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>
              {booking.quotationDetails}
            </p>
          </div>
        )}

        {/* Timestamp */}
        {booking.quotationProvidedAt && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            <Clock className="w-4 h-4" />
            <span>Provided on {new Date(booking.quotationProvidedAt).toLocaleString()}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem'
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Close
          </button>
          <button
            onClick={() => onAccept(booking)}
            disabled={isAccepted}
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: '10px',
              border: 'none',
              background: isAccepted 
                ? '#6b7280' 
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isAccepted ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: isAccepted ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              if (!isAccepted) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <CheckCircle2 className="w-5 h-5" />
            {isAccepted ? '✓ Accepted' : 'Accept Quotation'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CartNew;
