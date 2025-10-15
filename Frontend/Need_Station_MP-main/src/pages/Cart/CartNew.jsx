import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import { useAuth } from '../../store/AuthContext';
import { 
  ArrowLeft, Trash2, Plus, Minus, MapPin, Clock, Calendar,
  ShieldCheck, Star, Tag, ChevronRight, AlertCircle, CheckCircle2,
  CreditCard, Wallet, Smartphone, Gift, Info, User, Phone, Home
} from 'lucide-react';
import styles from './CartNew.module.css';

const CartNew = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/services');
    }
  }, [cartItems, navigate]);

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

  if (cartItems.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className={styles.headerTitle}>
            <h1>Your Cart</h1>
            <p>{cartItems.length} {cartItems.length === 1 ? 'service' : 'services'}</p>
          </div>

          <div className={styles.headerActions}>
            <ShieldCheck className="w-5 h-5" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          {/* Cart Items */}
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

export default CartNew;
