import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TipSectionProps {
  selectedTip: number;
  onTipChange: (tip: number) => void;
}

export const TipSection: React.FC<TipSectionProps> = ({
  selectedTip,
  onTipChange,
}) => {
  const [customTip, setCustomTip] = useState('');
  const presetTips = [50, 100, 200];

  const handleCustomTipChange = (value: string) => {
    setCustomTip(value);
    const numValue = parseFloat(value) || 0;
    onTipChange(numValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
    >
      <h2 className="text-xl font-semibold text-white mb-4">Add Tip</h2>
      
      <div className="flex flex-wrap gap-3 mb-4">
        {presetTips.map((tip) => (
          <motion.button
            key={tip}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onTipChange(tip);
              setCustomTip('');
            }}
            className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
              selectedTip === tip
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/50 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30'
            }`}
          >
            ₹{tip}
          </motion.button>
        ))}
      </div>
      
      <div className="relative">
        <input
          type="number"
          placeholder="Custom amount"
          value={customTip}
          onChange={(e) => handleCustomTipChange(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
        />
        {customTip && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400"
          >
            ₹
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};