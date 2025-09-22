import motherBabyImage from '../../assets/images/services/motherAndBaby.png';
import newbornCareImage from '../../assets/images/services/minicards/mother and baby care/mbc newborn care.jpg';
import postnatalImage from '../../assets/images/services/minicards/mother and baby care/mbc postnatal.jpg';
import babyMassageImage from '../../assets/images/services/minicards/mother and baby care/mbc baby massage and care.jpg';
import twinsCareImage from '../../assets/images/services/minicards/mother and baby care/mbc twins baby care.jpg';

export const motherBabyData = {
  serviceName: "Mother and Baby Care",
  serviceDescription: "👶 Expert care for new mothers and babies with specialized postnatal support.",
  serviceHighlight: "Nurturing care for the most precious moments of life.",
  
  trustIndicators: [
    { key: 'families', value: 8500, suffix: '+', label: 'Families Served', icon: '🏆' },
    { key: 'specialists', value: 200, suffix: '+', label: 'Care Specialists', icon: '👩‍⚕️' },
    { key: 'rating', value: 49, suffix: '/50', label: 'Rating', icon: '⭐' }
  ],

  services: [
    {
      id: 1,
      title: "Newborn Care (0-3 months)",
      subtitle: "Expert newborn support",
      description: "Specialized care for newborns with breastfeeding and development support",
      price: "₹1,899",
      originalPrice: "₹2,500",
      duration: "/day",
      discount: "24% OFF",
      urgency: "👶 Newborn Specialist",
      features: ["Breastfeeding support", "Sleep training", "Umbilical care", "Bathing assistance"],
      imgUrl: newbornCareImage,
      rating: 4.9,
      bookings: "3,456+",
      testimonial: "Perfect care for my newborn!",
      icon: "👶",
      gradient: "from-pink-500 to-rose-500",
      availability: "Available in 2 hours",
      guarantee: "Newborn Care Certified"
    },
    {
      id: 2,
      title: "Postnatal Mother Care",
      subtitle: "Complete recovery support",
      description: "Comprehensive care for new mothers during recovery period",
      price: "₹1,599",
      originalPrice: "₹2,100",
      duration: "/day",
      discount: "24% OFF",
      urgency: "🤱 Mother Care",
      features: ["Recovery assistance", "Nutrition guidance", "Emotional support", "Exercise guidance"],
      imgUrl: postnatalImage,
      rating: 4.8,
      bookings: "2,789+",
      testimonial: "Helped me recover beautifully!",
      icon: "🤱",
      gradient: "from-purple-500 to-indigo-500",
      availability: "Available today",
      guarantee: "Postnatal Care Certified"
    },
    {
      id: 3,
      title: "Baby Massage & Care",
      subtitle: "Traditional baby care",
      description: "Traditional massage and development activities for healthy baby growth",
      price: "₹999",
      originalPrice: "₹1,300",
      duration: "/session",
      discount: "23% OFF",
      urgency: "💆‍♀️ Traditional Care",
      features: ["Traditional massage", "Development activities", "Milestone tracking", "Immunization schedule"],
      imgUrl: babyMassageImage,
      rating: 4.8,
      bookings: "4,123+",
      testimonial: "Baby loves the massage!",
      icon: "💆‍♀️",
      gradient: "from-green-500 to-teal-500",
      availability: "Available tomorrow",
      guarantee: "Traditional Care Expert"
    },
    {
      id: 4,
      title: "Twins/Multiple Babies Care",
      subtitle: "Specialized multiple care",
      description: "Expert care for twins and multiple babies with coordinated support",
      price: "₹2,999",
      originalPrice: "₹3,800",
      duration: "/day",
      discount: "21% OFF",
      urgency: "👯‍♀️ Twin Specialist",
      features: ["Specialized handling", "Feeding management", "Schedule coordination", "Extra support"],
      imgUrl: twinsCareImage,
      rating: 4.9,
      bookings: "1,567+",
      testimonial: "Amazing with my twins!",
      icon: "👯‍♀️",
      gradient: "from-blue-500 to-cyan-500",
      availability: "Specialist available",
      guarantee: "Multiple Baby Expert"
    }
  ],

  detailedInfo: {
    title: "Mother and Baby Care",
    description: "Comprehensive care services for new mothers and babies, providing expert support during the crucial postnatal period with specialized knowledge and compassionate care.",
    image: motherBabyImage,
    keyFeatures: [
      "Certified postnatal care specialists",
      "Traditional and modern care methods",
      "24/7 support availability",
      "Comprehensive mother-baby wellness"
    ],
    servicesInclude: [
      "Newborn care and feeding support",
      "Postnatal mother recovery assistance",
      "Baby massage and development activities",
      "Breastfeeding guidance and support",
      "Sleep training and schedule management",
      "Health monitoring and milestone tracking"
    ]
  }
};
