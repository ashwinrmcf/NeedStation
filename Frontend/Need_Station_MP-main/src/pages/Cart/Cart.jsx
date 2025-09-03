import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './Cart.module.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Home Deep Cleaning',
      description: 'Complete home cleaning with kitchen, bathroom & all rooms',
      price: 2499,
      quantity: 1,
      image: 'https://images.pexels.com/photos/4239034/pexels-photo-4239034.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '2',
      name: 'AC Repair & Service',
      description: 'AC deep cleaning, gas refill and general maintenance',
      price: 899,
      quantity: 2,
      image: 'https://images.pexels.com/photos/8005395/pexels-photo-8005395.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ]);

  const [addOns, setAddOns] = useState([
    {
      id: '1',
      name: 'Deep Cleaning Add-on',
      description: 'Extended cleaning for cabinets, ceiling fans & balcony',
      price: 599,
      selected: false,
    },
    {
      id: '2',
      name: 'Premium Supplies',
      description: 'Use of premium eco-friendly cleaning products',
      price: 299,
      selected: true,
    },
    {
      id: '3',
      name: 'Extra Hour Service',
      description: 'Additional hour of professional service',
      price: 399,
      selected: false,
    },
  ]);

  const [selectedTip, setSelectedTip] = useState(0);
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
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleToggleAddOn = (id) => {
    setAddOns(addOns =>
      addOns.map(addOn =>
        addOn.id === id ? { ...addOn, selected: !addOn.selected } : addOn
      )
    );
  };

  const handlePromoApply = (code) => {
    if (code.toUpperCase() === 'SAVE10') {
      setDiscount(250);
    } else {
      setDiscount(0);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) +
                   addOns.filter(addOn => addOn.selected).reduce((sum, addOn) => sum + addOn.price, 0);
  const taxes = Math.round(subtotal * 0.18); // 18% tax
  const total = subtotal + taxes + selectedTip - discount;

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <Link to="/">
          <div className={styles.logo}>
            Need<span style={{ color: "#5CE1E6" }}>Station</span>
          </div>
        </Link>
        <div className={styles["progress-bar"]}>
          <div className={`${styles["step"]} ${styles["completed"]}`}>
            <div className={styles["circle"]}></div>
          </div>
          <div className={styles["line"]}></div>
          <div className={`${styles["step"]} ${styles["completed"]}`}>
            <div className={styles["circle"]}></div>
          </div>
          <div className={styles["line1"]}></div>
          <span className={styles["helper-list"]}>Review Cart & Complete Order</span>
          <div className={styles["line1"]}></div>
          <div className={`${styles["step"]} ${styles["active"]}`}>
            <div className={styles["circle"]}></div>
          </div>
          <div className={styles["line"]}></div>
          <div className={styles["step"]}>
            <div className={styles["circle"]}></div>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className={styles.backgroundEffects}>
        <div className={styles.effect1} />
        <div className={styles.effect2} />
        <div className={styles.effect3} />
      </div>

      <div className={styles.content}>
        <div className={styles.maxWidth}>
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.pageTitle}
          >
            <h1 className={styles.title}>
              Your Cart
            </h1>
            <p className={styles.subtitle}>Review your services and complete your order</p>
          </motion.div>

          <div className={styles.mainGrid}>
            {/* Left Column - Cart Content */}
            <div className={styles.leftColumn}>
              {/* Cart Items */}
              <div>
                <h2 className={styles.sectionTitle}>Selected Services</h2>
                <div className={styles.cartItemsContainer}>
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              </div>

              {/* Scheduling & Work Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={styles.cartSection}
              >
                <h2 className={styles.sectionTitle}>Scheduling & Requirements</h2>
                
                {cartItems.map((item, index) => (
                  <div key={item.id} className={styles.scheduleCard}>
                    <h3 className={styles.serviceTitle}>{item.name}</h3>
                    
                    <div className={styles.scheduleGrid}>
                      <div>
                        <label className={styles.scheduleLabel}>Preferred Date *</label>
                        <input
                          type="date"
                          value={item.scheduledDate}
                          onChange={(e) => handleUpdateSchedule(item.id, 'date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                          className={styles.scheduleInput}
                        />
                      </div>
                      
                      <div>
                        <label className={styles.scheduleLabel}>Preferred Time *</label>
                        <select
                          value={item.scheduledTime}
                          onChange={(e) => handleUpdateSchedule(item.id, 'time', e.target.value)}
                          className={styles.scheduleSelect}
                        >
                          <option value="">Select time slot</option>
                          <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
                          <option value="afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
                          <option value="evening">Evening (4:00 PM - 8:00 PM)</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className={styles.workDetailsSection}>
                      <label className={styles.scheduleLabel}>Work Details (Optional)</label>
                      <textarea
                        value={item.workDetails || ''}
                        onChange={(e) => handleUpdateSchedule(item.id, 'workDetails', e.target.value)}
                        placeholder={`Describe specific requirements for ${item.name} service...`}
                        className={styles.workDetailsTextarea}
                        maxLength={500}
                      />
                      <div className={styles.charCount}>
                        {(item.workDetails || '').length}/500
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Add-ons */}
              <AddOnSection addOns={addOns} onToggleAddOn={handleToggleAddOn} />

              {/* Tip Section */}
              <TipSection selectedTip={selectedTip} onTipChange={setSelectedTip} />

              {/* Address Section */}
              <AddressSection address={address} onAddressChange={setAddress} />

              {/* Trust Indicators - Mobile */}
              <div className={styles.trustMobile}>
                <TrustIndicators />
              </div>
            </div>

            {/* Right Column - Price Summary */}
            <div className={styles.rightColumn}>
              <div className={styles.summaryContainer}>
                <PriceSummary
                  subtotal={subtotal}
                  discount={discount}
                  taxes={taxes}
                  tip={selectedTip}
                  total={total}
                  onPromoApply={handlePromoApply}
                />
                
                {/* Trust Indicators - Desktop */}
                <div className={styles.trustDesktop}>
                  <TrustIndicators />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cart Item Component
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.cartItem}
    >
      <div className={styles.itemImage}>
        <img src={item.image} alt={item.name} />
      </div>
      <div className={styles.itemDetails}>
        <h3 className={styles.itemName}>{item.name}</h3>
        <p className={styles.itemDescription}>{item.description}</p>
        <div className={styles.itemActions}>
          <div className={styles.quantityControls}>
            <button 
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className={styles.quantityBtn}
            >
              -
            </button>
            <span className={styles.quantity}>{item.quantity}</span>
            <button 
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className={styles.quantityBtn}
            >
              +
            </button>
          </div>
          <button 
            onClick={() => onRemove(item.id)}
            className={styles.removeBtn}
          >
            Remove
          </button>
        </div>
      </div>
      <div className={styles.itemPrice}>
        ₹{item.price * item.quantity}
      </div>
    </motion.div>
  );
};

// Add-on Section Component
const AddOnSection = ({ addOns, onToggleAddOn }) => {
  return (
    <div className={styles.addOnSection}>
      <h2 className={styles.sectionTitle}>Add-ons</h2>
      <div className={styles.addOnList}>
        {addOns.map((addOn) => (
          <div key={addOn.id} className={styles.addOnItem}>
            <div className={styles.addOnInfo}>
              <label className={styles.addOnLabel}>
                <input
                  type="checkbox"
                  checked={addOn.selected}
                  onChange={() => onToggleAddOn(addOn.id)}
                  className={styles.addOnCheckbox}
                />
                <div>
                  <h4 className={styles.addOnName}>{addOn.name}</h4>
                  <p className={styles.addOnDescription}>{addOn.description}</p>
                </div>
              </label>
            </div>
            <div className={styles.addOnPrice}>₹{addOn.price}</div>
          </div>
        ))}
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
const PriceSummary = ({ subtotal, discount, taxes, tip, total, onPromoApply }) => {
  const [promoCode, setPromoCode] = useState('');

  return (
    <div className={styles.priceSummary}>
      <h2 className={styles.sectionTitle}>Order Summary</h2>
      <div className={styles.summaryDetails}>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        {discount > 0 && (
          <div className={styles.summaryRow}>
            <span>Discount</span>
            <span className={styles.discount}>-₹{discount}</span>
          </div>
        )}
        <div className={styles.summaryRow}>
          <span>Taxes & Fees</span>
          <span>₹{taxes}</span>
        </div>
        {tip > 0 && (
          <div className={styles.summaryRow}>
            <span>Tip</span>
            <span>₹{tip}</span>
          </div>
        )}
        <div className={styles.summaryTotal}>
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>
      
      <div className={styles.promoSection}>
        <input
          type="text"
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className={styles.promoInput}
        />
        <button 
          onClick={() => onPromoApply(promoCode)}
          className={styles.promoBtn}
        >
          Apply
        </button>
      </div>

      <button className={styles.checkoutBtn}>
        Proceed to Payment
      </button>
    </div>
  );
};

// Trust Indicators Component
const TrustIndicators = () => {
  return (
    <div className={styles.trustIndicators}>
      <div className={styles.trustItem}>
        <span className={styles.trustIcon}>🔒</span>
        <span>Secure Payment</span>
      </div>
      <div className={styles.trustItem}>
        <span className={styles.trustIcon}>✅</span>
        <span>Verified Taskers</span>
      </div>
      <div className={styles.trustItem}>
        <span className={styles.trustIcon}>💯</span>
        <span>100% Satisfaction</span>
      </div>
    </div>
  );
};

export default Cart;
