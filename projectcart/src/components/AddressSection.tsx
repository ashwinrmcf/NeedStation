import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { Address, MapLocation } from '../types';

interface AddressSectionProps {
  address: Address;
  onAddressChange: (address: Address) => void;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
  address,
  onAddressChange,
}) => {
  const [mapLocation, setMapLocation] = useState<MapLocation>({ lat: 28.6139, lng: 77.2090 });
  const [isLocating, setIsLocating] = useState(false);

  const addressTypes = [
    { key: 'home' as const, label: 'Home' },
    { key: 'work' as const, label: 'Work' },
    { key: 'other' as const, label: 'Other' },
  ];

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    // Simulate GPS location detection
    setTimeout(() => {
      const newLocation = { lat: 28.6139 + Math.random() * 0.01, lng: 77.2090 + Math.random() * 0.01 };
      setMapLocation(newLocation);
      setIsLocating(false);
      
      // Auto-fill address fields with simulated reverse geocoding
      onAddressChange({
        ...address,
        street: 'Connaught Place, Central Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
      });
    }, 2000);
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Simulate map click to location conversion
    const newLocation = {
      lat: 28.6139 + (y - 50) * 0.0001,
      lng: 77.2090 + (x - 50) * 0.0001,
    };
    
    setMapLocation(newLocation);
    
    // Auto-fill with simulated reverse geocoding
    onAddressChange({
      ...address,
      street: `Street ${Math.floor(Math.random() * 100)}, Sector ${Math.floor(Math.random() * 50)}`,
      city: 'New Delhi',
      state: 'Delhi',
      pincode: `11000${Math.floor(Math.random() * 9)}`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
    >
      <h2 className="text-xl font-semibold text-white mb-6">Delivery Address</h2>
      
      {/* Address Type Tabs */}
      <div className="flex gap-2 mb-6">
        {addressTypes.map((type) => (
          <motion.button
            key={type.key}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddressChange({ ...address, type: type.key })}
            className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
              address.type === type.key
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/50 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30'
            }`}
          >
            {type.label}
          </motion.button>
        ))}
      </div>

      {/* Map Section */}
      <div className="mb-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLocating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Detecting Location...
            </>
          ) : (
            <>
              <Navigation size={16} />
              Use Current Location
            </>
          )}
        </motion.button>

        <div 
          onClick={handleMapClick}
          className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/20 overflow-hidden cursor-crosshair shadow-[0_0_20px_rgba(34,211,238,0.2)]"
        >
          {/* Simulated Map Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20" />
            <div className="absolute top-4 left-4 w-8 h-8 bg-cyan-400/30 rounded-full blur-sm" />
            <div className="absolute bottom-8 right-8 w-6 h-6 bg-purple-400/30 rounded-full blur-sm" />
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-400/30 rounded-full blur-sm" />
          </div>
          
          {/* Map Pin */}
          <motion.div
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            style={{
              left: `${((mapLocation.lng - 77.2090) / 0.0001 + 50)}%`,
              top: `${((mapLocation.lat - 28.6139) / 0.0001 + 50)}%`,
            }}
            className="absolute transform -translate-x-1/2 -translate-y-full"
          >
            <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg" fill="currentColor" />
          </motion.div>
          
          {/* Map Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white/60 text-sm">
            Click to drop pin
          </div>
        </div>
      </div>

      {/* Address Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={address.fullName}
          onChange={(e) => onAddressChange({ ...address, fullName: e.target.value })}
          className="px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
        />
        
        <input
          type="tel"
          placeholder="Mobile Number"
          value={address.mobile}
          onChange={(e) => onAddressChange({ ...address, mobile: e.target.value })}
          className="px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
        />
        
        <input
          type="text"
          placeholder="Flat/House No."
          value={address.flatNo}
          onChange={(e) => onAddressChange({ ...address, flatNo: e.target.value })}
          className="px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
        />
        
        <input
          type="text"
          placeholder="Street/Area"
          value={address.street}
          readOnly
          className="px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-gray-300 placeholder-gray-400 cursor-not-allowed"
        />
        
        <input
          type="text"
          placeholder="City"
          value={address.city}
          readOnly
          className="px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-gray-300 placeholder-gray-400 cursor-not-allowed"
        />
        
        <input
          type="text"
          placeholder="State"
          value={address.state}
          readOnly
          className="px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-gray-300 placeholder-gray-400 cursor-not-allowed"
        />
        
        <input
          type="text"
          placeholder="Pincode"
          value={address.pincode}
          readOnly
          className="px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-gray-300 placeholder-gray-400 cursor-not-allowed"
        />
      </div>

      {/* Save Address Checkbox */}
      <div className="flex items-center gap-3 mt-4">
        <motion.div
          whileTap={{ scale: 0.95 }}
          onClick={() => onAddressChange({ ...address, saveAddress: !address.saveAddress })}
          className={`w-5 h-5 rounded border-2 cursor-pointer transition-all ${
            address.saveAddress
              ? 'border-cyan-400 bg-cyan-400'
              : 'border-white/30'
          }`}
        >
          {address.saveAddress && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-full h-full rounded flex items-center justify-center"
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </motion.div>
          )}
        </motion.div>
        <span className="text-white">Save this address for future orders</span>
      </div>
    </motion.div>
  );
};