import parkinsonsImage from '../../assets/images/services/parkinsonsCare.png';
import earlyStageImage from '../../assets/images/services/minicards/parkinsons cae/pc1 early stage.jfif';
import advancedStageImage from '../../assets/images/services/minicards/parkinsons cae/pc2 advanced stage.jpg';
import therapySupportImage from '../../assets/images/services/minicards/parkinsons cae/pc3 therapy support.jpg';

export const parkinsonsData = {
  serviceName: "Parkinson's Care",
  serviceDescription: "🧠 Specialized care for Parkinson's disease with expert support and therapy.",
  serviceHighlight: "Comprehensive care for all stages of Parkinson's disease.",
  
  trustIndicators: [
    { key: 'patients', value: 3500, suffix: '+', label: 'Patients Cared', icon: '🏆' },
    { key: 'specialists', value: 150, suffix: '+', label: 'Specialists', icon: '👨‍⚕️' },
    { key: 'rating', value: 47, suffix: '/50', label: 'Rating', icon: '⭐' }
  ],

  services: [
    {
      id: 1,
      title: "Early Stage Care",
      subtitle: "Initial management support",
      description: "Comprehensive care for early-stage Parkinson's with medication and lifestyle support",
      price: "₹1,799",
      originalPrice: "₹2,400",
      duration: "/day",
      discount: "25% OFF",
      urgency: "🌱 Early Intervention",
      features: ["Medication management", "Exercise programs", "Fall prevention", "Lifestyle adaptation"],
      imgUrl: earlyStageImage,
      rating: 4.8,
      bookings: "1,567+",
      testimonial: "Great support in early stages!",
      icon: "🌱",
      gradient: "from-green-500 to-emerald-500",
      availability: "Available today",
      guarantee: "Parkinson's Specialists"
    },
    {
      id: 2,
      title: "Advanced Stage Care",
      subtitle: "Complete dependency support",
      description: "Comprehensive care for advanced Parkinson's with complete ADL support",
      price: "₹2,999",
      originalPrice: "₹3,800",
      duration: "/day",
      discount: "21% OFF",
      urgency: "🔬 Advanced Care",
      features: ["Complete ADL support", "Mobility assistance", "Swallowing therapy", "Cognitive support"],
      imgUrl: advancedStageImage,
      rating: 4.9,
      bookings: "1,234+",
      testimonial: "Exceptional advanced care!",
      icon: "🔬",
      gradient: "from-purple-500 to-indigo-500",
      availability: "Specialist available",
      guarantee: "Advanced Care Certified"
    },
    {
      id: 3,
      title: "Therapy Support",
      subtitle: "Multi-therapy approach",
      description: "Comprehensive therapy support including physical, occupational, and speech therapy",
      price: "₹2,199",
      originalPrice: "₹2,800",
      duration: "/session",
      discount: "21% OFF",
      urgency: "🎵 Therapy Specialist",
      features: ["Physical therapy", "Occupational therapy", "Speech therapy", "Music/Dance therapy"],
      imgUrl: therapySupportImage,
      rating: 4.8,
      bookings: "1,890+",
      testimonial: "Therapy really helps!",
      icon: "🎵",
      gradient: "from-blue-500 to-cyan-500",
      availability: "Available tomorrow",
      guarantee: "Multi-therapy Certified"
    },
    {
      id: 4,
      title: "Family Support Care",
      subtitle: "Complete family guidance",
      description: "Support and training for families dealing with Parkinson's disease",
      price: "₹1,499",
      originalPrice: "₹2,000",
      duration: "/session",
      discount: "25% OFF",
      urgency: "👨‍👩‍👧‍👦 Family Care",
      features: ["Family training", "Emotional support", "Care planning", "Resource guidance"],
      imgUrl: parkinsonsImage,
      rating: 4.7,
      bookings: "2,156+",
      testimonial: "Helped our whole family!",
      icon: "👨‍👩‍👧‍👦",
      gradient: "from-orange-500 to-red-500",
      availability: "Available in 2 hours",
      guarantee: "Family Support Certified"
    }
  ],

  detailedInfo: {
    title: "Parkinson's Care",
    description: "Specialized care services for individuals with Parkinson's disease, providing comprehensive support across all stages of the condition with expert medical care and therapy.",
    image: parkinsonsImage,
    keyFeatures: [
      "Stage-specific care protocols",
      "Specialized Parkinson's trained staff",
      "Multi-therapy approach",
      "Family education and support"
    ],
    servicesInclude: [
      "Medication management and monitoring",
      "Physical and occupational therapy",
      "Speech and swallowing therapy",
      "Fall prevention and safety measures",
      "Cognitive support and stimulation",
      "Family training and emotional support"
    ]
  }
};
