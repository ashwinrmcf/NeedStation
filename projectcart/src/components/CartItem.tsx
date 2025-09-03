import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 rounded-xl object-cover border border-white/20"
          />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
          <p className="text-gray-300 text-sm mb-3">{item.description}</p>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              ₹{item.price.toLocaleString()}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Quantity Controls */}
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                >
                  <Minus size={14} />
                </motion.button>
                
                <span className="text-white font-medium min-w-[20px] text-center">
                  {item.quantity}
                </span>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                >
                  <Plus size={14} />
                </motion.button>
              </div>
              
              {/* Remove Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onRemove(item.id)}
                className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all"
              >
                <Trash2 size={14} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};