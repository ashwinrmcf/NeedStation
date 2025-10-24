import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Phone, MapPin, Calendar, Clock, DollarSign, Navigation, 
    User, Mail, Home, AlertCircle, FileText, Package, 
    ChevronDown, ChevronUp, CheckCircle
} from 'lucide-react';

const ActiveBookingCard = ({ booking }) => {
    const [showFullDetails, setShowFullDetails] = useState(false);
    
    if (!booking) return null;
    
    // Parse JSON data
    const subservices = booking.subservicesSummary ? JSON.parse(booking.subservicesSummary) : [];
    const formalityData = booking.formalityDataJson ? JSON.parse(booking.formalityDataJson) : {};
    
    const handleNavigate = () => {
        if (booking.locationLat && booking.locationLng) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${booking.locationLat},${booking.locationLng}`;
            window.open(url, '_blank');
        }
    };
    
    const handleCall = () => {
        window.location.href = `tel:${booking.phone}`;
    };
    
    const handleWhatsApp = () => {
        const message = `Hello ${booking.userName}, I'm your assigned healthcare worker for the ${booking.serviceName} service on ${booking.preferredDate}.`;
        window.open(`https://wa.me/${booking.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    };
    
    return (
        <motion.div
            className="bg-gradient-to-br from-[#00E0B8] to-[#00C4A0] rounded-2xl p-6 shadow-2xl mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <User className="text-gray-900" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">🎯 ACTIVE BOOKING</h2>
                        <p className="text-sm text-gray-800">#{booking.bookingNumber}</p>
                    </div>
                </div>
                <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {booking.status}
                </div>
            </div>
            
            {/* Customer Info */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Customer Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <User className="text-[#00C4A0]" size={20} />
                        <div>
                            <p className="text-xs text-gray-600">Name</p>
                            <p className="font-semibold text-gray-900">{booking.userName || 'N/A'}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Phone className="text-[#00C4A0]" size={20} />
                        <div>
                            <p className="text-xs text-gray-600">Phone</p>
                            <p className="font-semibold text-gray-900">{booking.phone}</p>
                        </div>
                    </div>
                    
                    {booking.alternatePhone && (
                        <div className="flex items-center gap-3">
                            <Phone className="text-[#00C4A0]" size={20} />
                            <div>
                                <p className="text-xs text-gray-600">Alternate Phone</p>
                                <p className="font-semibold text-gray-900">{booking.alternatePhone}</p>
                            </div>
                        </div>
                    )}
                    
                    {booking.userEmail && (
                        <div className="flex items-center gap-3">
                            <Mail className="text-[#00C4A0]" size={20} />
                            <div>
                                <p className="text-xs text-gray-600">Email</p>
                                <p className="font-semibold text-gray-900 text-sm">{booking.userEmail}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Service & Schedule */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Service Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <Package className="text-[#00C4A0]" size={20} />
                        <div>
                            <p className="text-xs text-gray-600">Service</p>
                            <p className="font-semibold text-gray-900">{booking.serviceName}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <DollarSign className="text-[#00C4A0]" size={20} />
                        <div>
                            <p className="text-xs text-gray-600">Amount</p>
                            <p className="font-semibold text-gray-900 text-xl">₹{booking.totalAmount}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Calendar className="text-[#00C4A0]" size={20} />
                        <div>
                            <p className="text-xs text-gray-600">Date</p>
                            <p className="font-semibold text-gray-900">{booking.preferredDate}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Clock className="text-[#00C4A0]" size={20} />
                        <div>
                            <p className="text-xs text-gray-600">Time</p>
                            <p className="font-semibold text-gray-900">
                                {booking.preferredTime || booking.preferredTimeSlot || 'N/A'}
                            </p>
                        </div>
                    </div>
                    
                    {booking.urgency && booking.urgency !== 'NORMAL' && (
                        <div className="flex items-center gap-3 col-span-2">
                            <AlertCircle className="text-red-600" size={20} />
                            <div>
                                <p className="text-xs text-gray-600">Urgency</p>
                                <p className="font-semibold text-red-600">{booking.urgency}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Location */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 mb-4">
                <div className="flex items-start gap-3">
                    <MapPin className="text-[#00C4A0] mt-1" size={20} />
                    <div className="flex-1">
                        <p className="text-xs text-gray-600">Location</p>
                        <p className="font-semibold text-gray-900">{booking.fullAddress}</p>
                        {booking.landmark && (
                            <p className="text-sm text-gray-700 mt-1">Landmark: {booking.landmark}</p>
                        )}
                        <p className="text-sm text-gray-700 mt-1">
                            {booking.city}, {booking.state} - {booking.pincode}
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Special Instructions */}
            {booking.specialInstructions && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                        <FileText className="text-yellow-600 mt-1" size={20} />
                        <div>
                            <p className="text-sm font-semibold text-yellow-800">Special Instructions:</p>
                            <p className="text-sm text-yellow-900 mt-1">{booking.specialInstructions}</p>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Subservices */}
            {subservices.length > 0 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Selected Services ({subservices.length})</h3>
                    <div className="space-y-2">
                        {subservices.map((service, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="text-green-600" size={16} />
                                    <span className="text-sm font-medium text-gray-900">{service.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">₹{service.price}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Formality Data - Expandable */}
            {Object.keys(formalityData).length > 0 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 mb-4">
                    <button
                        onClick={() => setShowFullDetails(!showFullDetails)}
                        className="w-full flex items-center justify-between"
                    >
                        <h3 className="text-lg font-bold text-gray-900">Additional Details</h3>
                        {showFullDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    
                    {showFullDetails && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 space-y-3"
                        >
                            {Object.entries(formalityData).map(([key, value]) => (
                                <div key={key} className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-600 capitalize">{key.replace(/_/g, ' ')}</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {typeof value === 'object' ? JSON.stringify(value) : value}
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>
            )}
            
            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                    onClick={handleNavigate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                    <Navigation size={20} />
                    Navigate
                </button>
                
                <button
                    onClick={handleCall}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                    <Phone size={20} />
                    Call Customer
                </button>
                
                <button
                    onClick={handleWhatsApp}
                    className="bg-[#25D366] hover:bg-[#20BA5A] text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                    <Phone size={20} />
                    WhatsApp
                </button>
            </div>
        </motion.div>
    );
};

export default ActiveBookingCard;
