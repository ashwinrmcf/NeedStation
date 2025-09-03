import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Tag, CreditCard } from 'lucide-react';

interface PriceSummaryProps {
  subtotal: number;
  discount: number;
  taxes: number;
  tip: number;
  total: number;
  onPromoApply: (code: string) => void;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  subtotal,
  discount,
  taxes,
  tip,
  total,
  onPromoApply,
}) => {
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim()) {
      onPromoApply(promoCode);
      setPromoCode('');
      setShowPromoInput(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sticky top-6"
    >
      <h2 className="text-xl font-semibold text-white mb-6">Price Summary</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-300">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-400">
            <span>Discount</span>
            <span>-₹{discount.toLocaleString()}</span>
          </div>
        )}
        
        <div className="flex justify-between text-gray-300">
          <span>Taxes & Fees</span>
          <span>₹{taxes.toLocaleString()}</span>
        </div>
        
        {tip > 0 && (
          <div className="flex justify-between text-purple-400">
            <span>Tip</span>
            <span>₹{tip.toLocaleString()}</span>
          </div>
        )}
        
        <div className="border-t border-white/20 pt-4">
          <div className="flex justify-between text-xl font-bold">
            <span className="text-white">Total</span>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              ₹{total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Promo Code Section */}
      <div className="mb-6">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowPromoInput(!showPromoInput)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all"
        >
          <div className="flex items-center gap-2">
            <Tag size={16} />
            <span>Apply Promo Code</span>
          </div>
          <motion.div
            animate={{ rotate: showPromoInput ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.button>
        
        <AnimatePresence>
          {showPromoInput && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handlePromoSubmit}
              className="mt-3"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all text-sm"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all text-sm"
                >
                  Apply
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Proceed to Payment Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        className="w-full px-6 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] flex items-center justify-center gap-3"
      >
        <CreditCard size={20} />
        Proceed to Payment
      </motion.button>
    </motion.div>
  );
};