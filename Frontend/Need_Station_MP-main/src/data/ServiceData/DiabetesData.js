import diabetesImage from '../../assets/images/services/diabetesManagement.png';
import type1Image from '../../assets/images/services/minicards/diabetes care/dm type 1.webp';
import type2Image from '../../assets/images/services/minicards/diabetes care/db2 type2.jpg';
import gestationalImage from '../../assets/images/services/minicards/diabetes care/dm3 gestational.jpg';
import complicationImage from '../../assets/images/services/minicards/diabetes care/dm4 complication.jpg';

export const diabetesData = {
  serviceName: "Diabetes Management",
  serviceDescription: "🩺 Comprehensive diabetes care with expert monitoring and management.",
  serviceHighlight: "Professional diabetes management for better health outcomes.",
  
  trustIndicators: [
    { key: 'patients', value: 12000, suffix: '+', label: 'Patients Managed', icon: '🏆' },
    { key: 'specialists', value: 180, suffix: '+', label: 'Diabetes Specialists', icon: '👨‍⚕️' },
    { key: 'rating', value: 48, suffix: '/50', label: 'Rating', icon: '⭐' }
  ],

  services: [
    {
      id: 1,
      title: "Type 1 Diabetes Care",
      subtitle: "Insulin-dependent care",
      description: "Specialized care for Type 1 diabetes with insulin management and monitoring",
      price: "₹1,999",
      originalPrice: "₹2,600",
      duration: "/day",
      discount: "23% OFF",
      urgency: "💉 Insulin Management",
      features: ["Insulin administration", "Continuous monitoring", "Carb counting", "Hypoglycemia management"],
      imgUrl: type1Image,
      rating: 4.9,
      bookings: "2,456+",
      testimonial: "Perfect insulin management!",
      icon: "💉",
      gradient: "from-blue-500 to-indigo-500",
      availability: "Available today",
      guarantee: "Diabetes Care Certified"
    },
    {
      id: 2,
      title: "Type 2 Diabetes Care",
      subtitle: "Comprehensive management",
      description: "Complete care for Type 2 diabetes with medication and lifestyle management",
      price: "₹1,599",
      originalPrice: "₹2,100",
      duration: "/day",
      discount: "24% OFF",
      urgency: "📈 Most Common",
      features: ["Medication management", "Diet counseling", "Exercise planning", "Weight management"],
      imgUrl: type2Image,
      rating: 4.8,
      bookings: "4,789+",
      testimonial: "Great lifestyle management!",
      icon: "📊",
      gradient: "from-green-500 to-teal-500",
      availability: "Available today",
      guarantee: "Lifestyle Management Expert"
    },
    {
      id: 3,
      title: "Gestational Diabetes Care",
      subtitle: "Pregnancy diabetes care",
      description: "Specialized care for diabetes during pregnancy with mother and baby monitoring",
      price: "₹2,199",
      originalPrice: "₹2,800",
      duration: "/day",
      discount: "21% OFF",
      urgency: "🤰 Pregnancy Care",
      features: ["Pregnancy monitoring", "Diet management", "Insulin if needed", "Fetal monitoring"],
      imgUrl: gestationalImage,
      rating: 4.9,
      bookings: "1,567+",
      testimonial: "Safe pregnancy with diabetes!",
      icon: "🤰",
      gradient: "from-pink-500 to-rose-500",
      availability: "Specialist available",
      guarantee: "Pregnancy Diabetes Expert"
    },
    {
      id: 4,
      title: "Diabetic Complication Care",
      subtitle: "Complication management",
      description: "Specialized care for diabetes complications with preventive measures",
      price: "₹2,499",
      originalPrice: "₹3,200",
      duration: "/day",
      discount: "22% OFF",
      urgency: "⚠️ Complication Care",
      features: ["Foot care", "Eye care", "Kidney monitoring", "Neuropathy management"],
      imgUrl: complicationImage,
      rating: 4.8,
      bookings: "1,890+",
      testimonial: "Prevented complications!",
      icon: "⚠️",
      gradient: "from-orange-500 to-red-500",
      availability: "Available tomorrow",
      guarantee: "Complication Care Specialist"
    }
  ],

  detailedInfo: {
    title: "Diabetes Management",
    description: "Comprehensive diabetes care services providing expert management, monitoring, and education for all types of diabetes with focus on preventing complications and improving quality of life.",
    image: diabetesImage,
    keyFeatures: [
      "Type-specific diabetes care protocols",
      "Continuous glucose monitoring",
      "Lifestyle and dietary counseling",
      "Complication prevention programs"
    ],
    servicesInclude: [
      "Blood sugar monitoring and management",
      "Insulin administration and training",
      "Dietary planning and nutrition counseling",
      "Exercise program development",
      "Complication screening and prevention",
      "Family education and support"
    ]
  }
};
