import { motion } from 'framer-motion';
import { 
    X, User, Phone, Mail, Home, MapPin, Calendar, Clock, 
    Heart, Activity, Pill, AlertTriangle, FileText, Info,
    Accessibility, Briefcase, Users, MessageCircle
} from 'lucide-react';

const CustomerDetailsModal = ({ task, onClose }) => {
    if (!task) return null;
    
    // Handle both camelCase and snake_case field names
    let formalityData = {};
    try {
        if (task.formality_data_json) {
            formalityData = typeof task.formality_data_json === 'string' 
                ? JSON.parse(task.formality_data_json) 
                : task.formality_data_json;
        } else if (task.formalityDataJson) {
            formalityData = typeof task.formalityDataJson === 'string' 
                ? JSON.parse(task.formalityDataJson) 
                : task.formalityDataJson;
        }
    } catch (e) {
        console.error('Error parsing formality data:', e);
        formalityData = {};
    }
    
    console.log('Task data:', task);
    console.log('Formality data:', formalityData);
    
    // Helper function to format field names
    const formatLabel = (key) => {
        return key
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    
    // Helper function to format values
    const formatValue = (value) => {
        if (!value) return 'Not Provided';
        if (typeof value === 'string') {
            return value
                .replace(/_/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
        return value;
    };
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-800"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-[#00E0B8] via-[#00C4A0] to-[#00A88C] p-6 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <User className="w-8 h-8" />
                                Customer Information
                            </h2>
                            <p className="text-gray-800 mt-1 font-medium">
                                Booking #{task.bookingNumber} • {task.serviceName}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-gray-900/20 hover:bg-gray-900/30 rounded-full p-3 transition-all duration-200 hover:scale-110"
                        >
                            <X className="text-gray-900 w-6 h-6" />
                        </button>
                    </div>
                </div>
                
                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[calc(95vh-120px)] p-6 space-y-6">
                    
                    {/* STEP 1: Basic Contact Information */}
                    <Section icon={Phone} title="Contact Information" color="blue">
                        <InfoGrid>
                            <InfoItem label="Customer Name" value={task.userName} icon={User} />
                            <InfoItem label="Primary Phone" value={task.phone} icon={Phone} clickable={`tel:${task.phone}`} />
                            {task.alternatePhone && (
                                <InfoItem label="Alternate Phone" value={task.alternatePhone} icon={Phone} clickable={`tel:${task.alternatePhone}`} />
                            )}
                            {task.userEmail && (
                                <InfoItem label="Email Address" value={task.userEmail} icon={Mail} />
                            )}
                        </InfoGrid>
                    </Section>
                    
                    {/* STEP 1: Address Information */}
                    <Section icon={Home} title="Service Location" color="green">
                        <div className="space-y-3">
                            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                <div className="flex items-start gap-3">
                                    <MapPin className="text-[#00E0B8] mt-1 flex-shrink-0" size={20} />
                                    <div className="flex-1">
                                        <p className="text-white font-medium leading-relaxed">{task.fullAddress}</p>
                                        {task.landmark && (
                                            <p className="text-gray-400 text-sm mt-2 flex items-center gap-2">
                                                <span className="text-[#00E0B8]">📍</span>
                                                Landmark: {task.landmark}
                                            </p>
                                        )}
                                        <p className="text-gray-400 text-sm mt-2">
                                            {task.city}, {task.state} - {task.pincode}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Map Display - OpenStreetMap */}
                            {(task.locationLat || task.location_lat) && (task.locationLng || task.location_lng) && (
                                <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700">
                                    <div className="bg-gray-700/50 px-4 py-2 flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                            <MapPin size={16} className="text-[#00E0B8]" />
                                            Location on Map
                                        </span>
                                        <button
                                            onClick={() => {
                                                const lat = task.locationLat || task.location_lat;
                                                const lng = task.locationLng || task.location_lng;
                                                window.open(`https://www.openstreetmap.org/directions?from=&to=${lat},${lng}`, '_blank');
                                            }}
                                            className="text-xs bg-[#00E0B8] text-gray-900 px-3 py-1 rounded-lg font-semibold hover:bg-[#00C4A0] transition-colors"
                                        >
                                            Get Directions
                                        </button>
                                    </div>
                                    <iframe
                                        width="100%"
                                        height="250"
                                        frameBorder="0"
                                        style={{ border: 0 }}
                                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${(task.locationLng || task.location_lng) - 0.01},${(task.locationLat || task.location_lat) - 0.01},${(task.locationLng || task.location_lng) + 0.01},${(task.locationLat || task.location_lat) + 0.01}&layer=mapnik&marker=${task.locationLat || task.location_lat},${task.locationLng || task.location_lng}`}
                                        allowFullScreen
                                    />
                                </div>
                            )}
                        </div>
                    </Section>
                    
                    {/* STEP 1: Schedule Information */}
                    <Section icon={Calendar} title="Service Schedule" color="purple">
                        <InfoGrid>
                            <InfoItem 
                                label="Preferred Date" 
                                value={task.preferredDate} 
                                icon={Calendar} 
                            />
                            <InfoItem 
                                label="Preferred Time" 
                                value={formatValue(task.preferredTime || task.preferredTimeSlot)} 
                                icon={Clock} 
                            />
                            {task.urgency && (
                                <InfoItem 
                                    label="Urgency Level" 
                                    value={formatValue(task.urgency)} 
                                    icon={AlertTriangle}
                                    highlight={task.urgency === 'urgent'}
                                />
                            )}
                        </InfoGrid>
                    </Section>
                    
                    {/* STEP 2: Patient Information - Always show if any formality data exists */}
                    {Object.keys(formalityData).length > 0 && (
                        <Section icon={Heart} title="Patient Details" color="red">
                            <InfoGrid>
                                {formalityData.patient_age && (
                                    <InfoItem 
                                        label="Patient Age" 
                                        value={`${formalityData.patient_age} years`} 
                                        icon={User} 
                                    />
                                )}
                                {formalityData.patient_gender && (
                                    <InfoItem 
                                        label="Gender" 
                                        value={formatValue(formalityData.patient_gender)} 
                                        icon={User} 
                                    />
                                )}
                                {formalityData.mobility_level && (
                                    <InfoItem 
                                        label="Mobility Level" 
                                        value={formatValue(formalityData.mobility_level)} 
                                        icon={Accessibility} 
                                    />
                                )}
                                {formalityData.health_status && (
                                    <InfoItem 
                                        label="Health Status" 
                                        value={formatValue(formalityData.health_status)} 
                                        icon={Activity} 
                                    />
                                )}
                            </InfoGrid>
                        </Section>
                    )}
                    
                    {/* STEP 2: Medical Information - Always show if any formality data exists */}
                    {Object.keys(formalityData).length > 0 && (
                        <Section icon={Activity} title="Medical & Care Information" color="orange">
                            <div className="space-y-4">
                                {formalityData.medical_conditions && (
                                    <DetailBox 
                                        label="Medical Conditions" 
                                        value={formalityData.medical_conditions}
                                        icon={Pill}
                                        important
                                    />
                                )}
                                {formalityData.care_activities && (
                                    <DetailBox 
                                        label="Care Activities Required" 
                                        value={formalityData.care_activities}
                                        icon={Briefcase}
                                    />
                                )}
                                {formalityData.care_hours && (
                                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                                        <div className="flex items-start gap-3">
                                            <Clock className="text-[#00E0B8] flex-shrink-0 mt-0.5" size={18} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Care Hours Per Day</p>
                                                <p className="text-white font-semibold">{formalityData.care_hours} hours</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {formalityData.special_requirements && (
                                    <DetailBox 
                                        label="Special Requirements" 
                                        value={formalityData.special_requirements}
                                        icon={AlertTriangle}
                                        important
                                    />
                                )}
                                
                                {/* Show any other formality data fields that weren't explicitly handled */}
                                {Object.entries(formalityData).map(([key, value]) => {
                                    // Skip fields we've already displayed
                                    const displayedFields = ['patient_age', 'patient_gender', 'mobility_level', 'health_status', 
                                                            'medical_conditions', 'care_activities', 'care_hours', 'special_requirements'];
                                    if (displayedFields.includes(key)) return null;
                                    
                                    return (
                                        <div key={key} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                                            <div className="flex items-start gap-3">
                                                <Info className="text-[#00E0B8] flex-shrink-0 mt-0.5" size={18} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">
                                                        {formatLabel(key)}
                                                    </p>
                                                    <p className="text-white font-semibold break-words">
                                                        {formatValue(value)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Section>
                    )}
                    
                    {/* STEP 3: Additional Instructions */}
                    {task.specialInstructions && (
                        <Section icon={FileText} title="Special Instructions" color="yellow">
                            <div className="bg-yellow-900/20 border-l-4 border-yellow-500 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
                                    <div>
                                        <p className="text-yellow-100 leading-relaxed">{task.specialInstructions}</p>
                                    </div>
                                </div>
                            </div>
                        </Section>
                    )}
                    
                    {/* Quick Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <button
                            onClick={() => window.location.href = `tel:${task.phone}`}
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            <Phone size={22} />
                            <span>Call Customer</span>
                        </button>
                        <button
                            onClick={() => {
                                const message = `Hello ${task.userName}, I'm your assigned healthcare worker for the ${task.serviceName} service scheduled on ${task.preferredDate}. I'm looking forward to providing you with excellent care.`;
                                window.open(`https://wa.me/${task.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
                            }}
                            className="bg-gradient-to-r from-[#25D366] to-[#20BA5A] hover:from-[#20BA5A] hover:to-[#1DA851] text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            <MessageCircle size={22} />
                            <span>WhatsApp</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Section Component
const Section = ({ icon: Icon, title, children, color }) => {
    const colorClasses = {
        blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/30',
        green: 'from-green-500/10 to-green-600/10 border-green-500/30',
        purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/30',
        red: 'from-red-500/10 to-red-600/10 border-red-500/30',
        orange: 'from-orange-500/10 to-orange-600/10 border-orange-500/30',
        yellow: 'from-yellow-500/10 to-yellow-600/10 border-yellow-500/30',
        indigo: 'from-indigo-500/10 to-indigo-600/10 border-indigo-500/30',
    };
    
    return (
        <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6`}>
            <div className="flex items-center gap-3 mb-5">
                <div className="bg-[#00E0B8] rounded-lg p-2">
                    <Icon className="text-gray-900 w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
            {children}
        </div>
    );
};

// Info Grid Component
const InfoGrid = ({ children }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
    </div>
);

// Info Item Component
const InfoItem = ({ label, value, icon: Icon, clickable, highlight }) => (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition-colors">
        <div className="flex items-start gap-3">
            {Icon && <Icon className="text-[#00E0B8] flex-shrink-0 mt-0.5" size={18} />}
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">{label}</p>
                {clickable ? (
                    <a 
                        href={clickable}
                        className="text-white font-semibold hover:text-[#00E0B8] transition-colors break-words"
                    >
                        {value || 'Not Provided'}
                    </a>
                ) : (
                    <p className={`font-semibold break-words ${
                        highlight ? 'text-[#00E0B8]' : 'text-white'
                    }`}>
                        {value || 'Not Provided'}
                    </p>
                )}
            </div>
        </div>
    </div>
);

// Detail Box Component
const DetailBox = ({ label, value, icon: Icon, important }) => (
    <div className={`rounded-xl p-4 border ${
        important 
            ? 'bg-red-900/20 border-red-500/30' 
            : 'bg-gray-800/50 border-gray-700/50'
    }`}>
        <div className="flex items-start gap-3">
            {Icon && (
                <Icon className={`flex-shrink-0 mt-1 ${
                    important ? 'text-red-400' : 'text-[#00E0B8]'
                }`} size={20} />
            )}
            <div className="flex-1">
                <p className={`text-sm font-medium mb-2 uppercase tracking-wide ${
                    important ? 'text-red-400' : 'text-gray-400'
                }`}>
                    {label}
                </p>
                <p className={`leading-relaxed ${
                    important ? 'text-red-100' : 'text-white'
                }`}>
                    {value || 'Not Provided'}
                </p>
            </div>
        </div>
    </div>
);

export default CustomerDetailsModal;
