import physiotherapyImage from '../../assets/images/services/physiotherapy.png';
import orthopedicImage from '../../assets/images/services/minicards/physiotherapy/p1 orthopedic.jpg';
import neurologicalImage from '../../assets/images/services/minicards/physiotherapy/p2 neurological.jpg';
import pediatricPhysioImage from '../../assets/images/services/minicards/physiotherapy/p3 pediatric.jpg';
import chestPhysioImage from '../../assets/images/services/minicards/physiotherapy/p5 chest.webp';

export const physiotherapyData = {
  serviceName: "Physiotherapy",
  serviceDescription: "🏃‍♂️ Professional rehabilitation and physical therapy services at your home.",
  serviceHighlight: "Restore mobility and strength with expert care.",
  
  trustIndicators: [
    { key: 'patients', value: 8500, suffix: '+', label: 'Patients Treated', icon: '🏆' },
    { key: 'therapists', value: 250, suffix: '+', label: 'Licensed Therapists', icon: '👨‍⚕️' },
    { key: 'rating', value: 46, suffix: '/50', label: 'Rating', icon: '⭐' }
  ],

  services: [
    {
      id: 1,
      title: "Orthopedic Physiotherapy",
      subtitle: "Joint and bone rehabilitation",
      description: "Specialized therapy for joint replacement, fractures, and sports injuries",
      price: "₹1,899",
      originalPrice: "₹2,500",
      duration: "/session",
      discount: "24% OFF",
      urgency: "🦴 Most Popular",
      features: ["Joint replacement rehab", "Fracture recovery", "Sports injuries", "Back/neck pain"],
      imgUrl: orthopedicImage,
      rating: 4.8,
      bookings: "3,247+",
      testimonial: "My knee is much better now!",
      icon: "🦴",
      gradient: "from-orange-500 to-red-500",
      availability: "Available today",
      guarantee: "Licensed Therapists"
    },
    {
      id: 2,
      title: "Neurological Physiotherapy",
      subtitle: "Brain and nerve rehabilitation",
      description: "Expert therapy for stroke, paralysis, and neurological conditions",
      price: "₹2,299",
      originalPrice: "₹3,000",
      duration: "/session",
      discount: "23% OFF",
      urgency: "🧠 Specialized Care",
      features: ["Stroke rehabilitation", "Paralysis therapy", "Balance training", "Gait training"],
      imgUrl: neurologicalImage,
      rating: 4.9,
      bookings: "2,156+",
      testimonial: "Amazing progress after stroke!",
      icon: "🧠",
      gradient: "from-purple-500 to-indigo-500",
      availability: "Available in 2 hours",
      guarantee: "Neuro Specialists"
    },
    {
      id: 3,
      title: "Pediatric Physiotherapy",
      subtitle: "Child development therapy",
      description: "Specialized physiotherapy for children with developmental and growth issues",
      price: "₹1,699",
      originalPrice: "₹2,200",
      duration: "/session",
      discount: "23% OFF",
      urgency: "👶 Child Specialist",
      features: ["Developmental delays", "Cerebral palsy", "Birth injuries", "Postural correction"],
      imgUrl: pediatricPhysioImage,
      rating: 4.8,
      bookings: "1,834+",
      testimonial: "My child is walking now!",
      icon: "👶",
      gradient: "from-pink-500 to-rose-500",
      availability: "Available tomorrow",
      guarantee: "Pediatric Certified"
    },
    {
      id: 4,
      title: "Chest Physiotherapy",
      subtitle: "Respiratory rehabilitation",
      description: "Breathing exercises and lung rehabilitation therapy for respiratory conditions",
      price: "₹1,599",
      originalPrice: "₹2,100",
      duration: "/session",
      discount: "24% OFF",
      urgency: "🛑 Post-COVID Care",
      features: ["Breathing exercises", "Lung expansion", "Secretion clearance", "Post-COVID recovery"],
      imgUrl: chestPhysioImage,
      rating: 4.7,
      bookings: "2,567+",
      testimonial: "Breathing is so much easier!",
      icon: "🫁",
      gradient: "from-green-500 to-teal-500",
      availability: "Available today",
      guarantee: "Respiratory Specialists"
    }
  ],

  detailedInfo: {
    title: "Physiotherapy",
    description: "Professional rehabilitation services delivered by licensed physiotherapists to help you recover, restore mobility, and improve quality of life in the comfort of your home.",
    image: physiotherapyImage,
    keyFeatures: [
      "Personalized treatment plans",
      "Licensed and experienced therapists",
      "Advanced rehabilitation techniques",
      "Progress tracking and monitoring"
    ],
    servicesInclude: [
      "Comprehensive physical assessment",
      "Therapeutic exercises and stretching",
      "Manual therapy and mobilization",
      "Pain management techniques",
      "Home exercise program design",
      "Progress evaluation and adjustment"
    ]
  }
};
