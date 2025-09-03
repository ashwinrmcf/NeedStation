import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CartItem } from './components/CartItem';
import { AddOnSection } from './components/AddOnSection';
import { TipSection } from './components/TipSection';
import { AddressSection } from './components/AddressSection';
import { PriceSummary } from './components/PriceSummary';
import { TrustIndicators } from './components/TrustIndicators';
import { CartItem as CartItemType, AddOn, Address } from './types';

function App() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([
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

  const [addOns, setAddOns] = useState<AddOn[]>([
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
  const [address, setAddress] = useState<Address>({
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

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleToggleAddOn = (id: string) => {
    setAddOns(addOns =>
      addOns.map(addOn =>
        addOn.id === id ? { ...addOn, selected: !addOn.selected } : addOn
      )
    );
  };

  const handlePromoApply = (code: string) => {
    // Simulate promo code validation
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Your Cart
            </h1>
            <p className="text-gray-400">Review your services and complete your order</p>
          </motion.div>

          <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-8 lg:space-y-0">
            {/* Left Column - Cart Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Items */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Selected Services</h2>
                <div className="space-y-4">
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

              {/* Add-ons */}
              <AddOnSection addOns={addOns} onToggleAddOn={handleToggleAddOn} />

              {/* Tip Section */}
              <TipSection selectedTip={selectedTip} onTipChange={setSelectedTip} />

              {/* Address Section */}
              <AddressSection address={address} onAddressChange={setAddress} />

              {/* Trust Indicators - Mobile */}
              <div className="lg:hidden">
                <TrustIndicators />
              </div>
            </div>

            {/* Right Column - Price Summary */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <PriceSummary
                  subtotal={subtotal}
                  discount={discount}
                  taxes={taxes}
                  tip={selectedTip}
                  total={total}
                  onPromoApply={handlePromoApply}
                />
                
                {/* Trust Indicators - Desktop */}
                <div className="hidden lg:block">
                  <TrustIndicators />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;