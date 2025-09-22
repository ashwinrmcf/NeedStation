import paralysisImage from '../../assets/images/services/paralysisCare.png';
import hemiplegiaImage from '../../assets/images/services/minicards/paralysis care/parac1 hemiplegia care.webp';
import paraplegiaImage from '../../assets/images/services/minicards/paralysis care/parac2 paraphlegia.jpg';
import quadriplegiaImage from '../../assets/images/services/minicards/paralysis care/parac3 quadriplegia.jpg';

export const paralysisData = {
  serviceName: "Paralysis Care",
  serviceDescription: "🦽 Specialized care for paralysis patients with comprehensive rehabilitation support.",
  serviceHighlight: "Expert care for all types of paralysis conditions.",
  
  trustIndicators: [
    { key: 'patients', value: 4200, suffix: '+', label: 'Patients Cared', icon: '🏆' },
    { key: 'specialists', value: 180, suffix: '+', label: 'Specialists', icon: '👨‍⚕️' },
    { key: 'rating', value: 48, suffix: '/50', label: 'Rating', icon: '⭐' }
  ],

  services: [
    {
      id: 1,
      title: "Hemiplegia Care",
      subtitle: "One-sided paralysis care",
      description: "Specialized care for stroke recovery and one-sided paralysis management",
      price: "₹2,499",
      originalPrice: "₹3,200",
      duration: "/day",
      discount: "22% OFF",
      urgency: "🧠 Stroke Recovery",
      features: ["Stroke recovery", "Brain injury care", "Mobility training", "ADL retraining"],
      imgUrl: hemiplegiaImage,
      rating: 4.8,
      bookings: "2,134+",
      testimonial: "Great progress after stroke!",
      icon: "🧠",
      gradient: "from-blue-500 to-indigo-500",
      availability: "Available today",
      guarantee: "Stroke Care Certified"
    },
    {
      id: 2,
      title: "Paraplegia Care",
      subtitle: "Lower body paralysis care",
      description: "Comprehensive care for spinal injury and lower body paralysis",
      price: "₹2,799",
      originalPrice: "₹3,600",
      duration: "/day",
      discount: "22% OFF",
      urgency: "🦽 Spinal Care",
      features: ["Spinal injury care", "Wheelchair management", "Bladder/bowel management", "Transfer training"],
      imgUrl: paraplegiaImage,
      rating: 4.9,
      bookings: "1,789+",
      testimonial: "Excellent spinal care!",
      icon: "🦽",
      gradient: "from-purple-500 to-pink-500",
      availability: "Specialist available",
      guarantee: "Spinal Care Expert"
    },
    {
      id: 3,
      title: "Quadriplegia Care",
      subtitle: "Complete paralysis care",
      description: "Intensive care for complete paralysis with advanced equipment handling",
      price: "₹3,999",
      originalPrice: "₹5,200",
      duration: "/day",
      discount: "23% OFF",
      urgency: "🚨 Intensive Care",
      features: ["Complete care management", "Respiratory support", "Advanced equipment handling", "24x7 monitoring"],
      imgUrl: quadriplegiaImage,
      rating: 4.9,
      bookings: "1,234+",
      testimonial: "Life-changing care quality!",
      icon: "🚨",
      gradient: "from-red-500 to-orange-500",
      availability: "24/7 Available",
      guarantee: "Intensive Care Certified"
    },
    {
      id: 4,
      title: "Facial Paralysis Care",
      subtitle: "Facial nerve care",
      description: "Specialized care for Bell's palsy and facial paralysis conditions",
      price: "₹1,799",
      originalPrice: "₹2,300",
      duration: "/session",
      discount: "22% OFF",
      urgency: "😊 Facial Recovery",
      features: ["Bell's palsy care", "Facial exercises", "Speech therapy support", "Eye care"],
      imgUrl: paralysisImage,
      rating: 4.7,
      bookings: "1,567+",
      testimonial: "Face is recovering well!",
      icon: "😊",
      gradient: "from-green-500 to-teal-500",
      availability: "Available tomorrow",
      guarantee: "Facial Care Specialist"
    }
  ],

  detailedInfo: {
    title: "Paralysis Care",
    description: "Comprehensive care services for individuals with paralysis, providing specialized support for recovery, rehabilitation, and quality of life improvement across all types of paralysis conditions.",
    image: paralysisImage,
    keyFeatures: [
      "Type-specific paralysis care protocols",
      "Advanced rehabilitation equipment",
      "Specialized therapy programs",
      "24/7 monitoring and support"
    ],
    servicesInclude: [
      "Comprehensive paralysis assessment",
      "Mobility training and assistance",
      "Respiratory care and monitoring",
      "Bladder and bowel management",
      "Physical and occupational therapy",
      "Equipment training and maintenance"
    ]
  }
};
