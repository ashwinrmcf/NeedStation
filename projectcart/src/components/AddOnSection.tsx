import React from 'react';
import { motion } from 'framer-motion';
import { AddOn } from '../types';

interface AddOnSectionProps {
  addOns: AddOn[];
  onToggleAddOn: (id: string) => void;
}

export const AddOnSection: React.FC<AddOnSectionProps> = ({
  addOns,
  onToggleAddOn,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
    >
      <h2 className="text-xl font-semibold text-white mb-4">Add-ons</h2>
      
      <div className="space-y-3">
        {addOns.map((addOn) => (
          <motion.div
            key={addOn.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onToggleAddOn(addOn.id)}
            className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
              addOn.selected
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-white mb-1">{addOn.name}</h3>
                <p className="text-gray-400 text-sm">{addOn.description}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  +₹{addOn.price}
                </span>
                
                <div className={`w-5 h-5 rounded border-2 transition-all ${
                  addOn.selected
                    ? 'border-cyan-400 bg-cyan-400'
                    : 'border-white/30'
                }`}>
                  {addOn.selected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-full h-full rounded flex items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};