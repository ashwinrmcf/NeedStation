import bedriddenCareImage from '../../assets/images/services/bedriddenPatient.png';
import completeBedCareImage from '../../assets/images/services/minicards/bedridden patient care/bpc1 complete bed care.jpg';
import strokePatientImage from '../../assets/images/services/minicards/bedridden patient care/bpc2 stroke patient.jpg';
import comaImage from '../../assets/images/services/minicards/bedridden patient care/bpc3 coma.jpg';
import palliativeImage from '../../assets/images/services/minicards/bedridden patient care/bpc4 palliativecare.jpg';

export const bedriddenCareData = {
  serviceName: "Bedridden Patient Care",
  serviceDescription: "🛏️ Specialized care for bedridden patients with complete medical support.",
  serviceHighlight: "Comprehensive care for complete dependency situations.",
  
  trustIndicators: [
    { key: 'patients', value: 6500, suffix: '+', label: 'Patients Cared', icon: '🏆' },
    { key: 'specialists', value: 300, suffix: '+', label: 'Care Specialists', icon: '👩‍⚕️' },
    { key: 'rating', value: 48, suffix: '/50', label: 'Rating', icon: '⭐' }
  ],

  services: [
    {
      id: 1,
      title: "Complete Bedridden Care",
      subtitle: "Total dependency support",
      description: "Comprehensive care for completely bedridden patients with 24x7 monitoring",
      price: "₹3,999",
      originalPrice: "₹5,200",
      duration: "/day",
      discount: "23% OFF",
      urgency: "🏥 Intensive Care",
      features: ["Total dependency care", "24x7 monitoring", "All ADL support", "Medical management"],
      imgUrl: completeBedCareImage,
      rating: 4.9,
      bookings: "2,134+",
      testimonial: "Exceptional care quality!",
      icon: "🛏️",
      gradient: "from-blue-500 to-cyan-500",
      availability: "Available in 4 hours",
      guarantee: "Specialized Training"
    },
    {
      id: 2,
      title: "Stroke Patient Care",
      subtitle: "Post-stroke rehabilitation",
      description: "Specialized care for stroke patients with paralysis management and therapy support",
      price: "₹3,499",
      originalPrice: "₹4,500",
      duration: "/day",
      discount: "22% OFF",
      urgency: "🧠 Stroke Recovery",
      features: ["Paralysis management", "Speech therapy support", "Cognitive rehabilitation", "Physical therapy assistance"],
      imgUrl: strokePatientImage,
      rating: 4.8,
      bookings: "1,867+",
      testimonial: "Great recovery progress!",
      icon: "🧠",
      gradient: "from-purple-500 to-indigo-500",
      availability: "Specialist available",
      guarantee: "Stroke Care Certified"
    },
    {
      id: 3,
      title: "Coma Patient Care",
      subtitle: "Specialized monitoring",
      description: "Expert care for coma patients with specialized monitoring and family support",
      price: "₹4,999",
      originalPrice: "₹6,500",
      duration: "/day",
      discount: "23% OFF",
      urgency: "🚑 Critical Care",
      features: ["Specialized monitoring", "Sensory stimulation", "Family training", "Medical coordination"],
      imgUrl: comaImage,
      rating: 4.9,
      bookings: "892+",
      testimonial: "Professional and caring!",
      icon: "🚨",
      gradient: "from-red-500 to-pink-500",
      availability: "24/7 Available",
      guarantee: "Critical Care Trained"
    },
    {
      id: 4,
      title: "Palliative Care",
      subtitle: "Comfort and dignity",
      description: "Compassionate end-of-life care focusing on comfort and family support",
      price: "₹2,999",
      originalPrice: "₹3,800",
      duration: "/day",
      discount: "21% OFF",
      urgency: "💕 Compassionate Care",
      features: ["End-of-life care", "Pain management", "Comfort care", "Family support"],
      imgUrl: palliativeImage,
      rating: 4.9,
      bookings: "1,234+",
      testimonial: "Dignity in difficult times",
      icon: "❤️",
      gradient: "from-green-500 to-emerald-500",
      availability: "Available immediately",
      guarantee: "Palliative Certified"
    }
  ],

  detailedInfo: {
    title: "Bedridden Patient Care",
    description: "Comprehensive care services for patients with limited or no mobility, providing medical support, personal care, and emotional comfort in a home environment.",
    image: bedriddenCareImage,
    keyFeatures: [
      "24/7 medical monitoring and support",
      "Specialized equipment handling",
      "Pressure sore prevention and care",
      "Family education and support"
    ],
    servicesInclude: [
      "Complete personal hygiene care",
      "Positioning and mobility assistance",
      "Medication administration and monitoring",
      "Wound care and pressure sore prevention",
      "Nutritional support and feeding assistance",
      "Respiratory care and monitoring"
    ]
  }
};
