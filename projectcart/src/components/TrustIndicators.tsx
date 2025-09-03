import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CreditCard, Clock, Users } from 'lucide-react';

export const TrustIndicators: React.FC = () => {
  const indicators = [
    {
      icon: Users,
      title: 'Trusted Professionals',
      description: 'Background verified experts',
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: '100% secure transactions',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock assistance',
    },
    {
      icon: CreditCard,
      title: 'Easy Refunds',
      description: 'Hassle-free cancellation',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {indicators.map((indicator, index) => (
          <motion.div
            key={indicator.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="text-center"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-white/20">
              <indicator.icon className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="font-medium text-white text-sm mb-1">{indicator.title}</h3>
            <p className="text-gray-400 text-xs">{indicator.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};