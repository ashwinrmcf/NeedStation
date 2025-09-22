import caretakerImage from '../../assets/images/services/homeHealthCare.png';
import liveInImage from '../../assets/images/services/minicards/caretaker at home/cah1 live in caretaker.jpg';
import partTimeImage from '../../assets/images/services/minicards/caretaker at home/cah2 part time caretaker.webp';
import cookImage from '../../assets/images/services/minicards/caretaker at home/cah3 cook.jpg';
import nannyImage from '../../assets/images/services/minicards/caretaker at home/cah4 nanny.jpg';

export const caretakerData = {
  serviceName: "Caretaker at Home",
  serviceDescription: "👨‍⚕️ Professional caretakers providing comprehensive home care services.",
  serviceHighlight: "Trusted care for your loved ones in the comfort of home.",
  
  trustIndicators: [
    { key: 'families', value: 18000, suffix: '+', label: 'Families Served', icon: '🏆' },
    { key: 'caretakers', value: 600, suffix: '+', label: 'Trained Caretakers', icon: '👨‍⚕️' },
    { key: 'rating', value: 46, suffix: '/50', label: 'Rating', icon: '⭐' }
  ],

  services: [
    {
      id: 1,
      title: "Live-in Caretaker",
      subtitle: "24x7 comprehensive care",
      description: "Full-time live-in caretaker providing round-the-clock care and supervision",
      price: "₹2,499",
      originalPrice: "₹3,200",
      duration: "/day",
      discount: "22% OFF",
      urgency: "🏠 Most Comprehensive",
      features: ["24x7 availability", "Full-time residence", "Complete care management", "Night supervision"],
      imgUrl: liveInImage,
      rating: 4.8,
      bookings: "4,567+",
      testimonial: "Peace of mind 24/7!",
      icon: "🏠",
      gradient: "from-blue-500 to-indigo-500",
      availability: "Available in 24 hours",
      guarantee: "Background Verified"
    },
    {
      id: 2,
      title: "Part-time Caretaker",
      subtitle: "Flexible care hours",
      description: "Part-time caretaker for specific hours with flexible scheduling options",
      price: "₹1,299",
      originalPrice: "₹1,700",
      duration: "/day",
      discount: "24% OFF",
      urgency: "⏰ Flexible Hours",
      features: ["Fixed hours", "Daily visits", "Specific task assistance", "Flexible scheduling"],
      imgUrl: partTimeImage,
      rating: 4.7,
      bookings: "3,234+",
      testimonial: "Perfect for our needs!",
      icon: "⏰",
      gradient: "from-green-500 to-teal-500",
      availability: "Available today",
      guarantee: "Trained Professionals"
    },
    {
      id: 3,
      title: "Cook-cum-Caretaker",
      subtitle: "Cooking + care services",
      description: "Combined cooking and caretaking services for comprehensive home support",
      price: "₹1,799",
      originalPrice: "₹2,300",
      duration: "/day",
      discount: "22% OFF",
      urgency: "🍳 Popular Combo",
      features: ["Meal preparation", "Kitchen management", "Basic care duties", "Dietary planning"],
      imgUrl: cookImage,
      rating: 4.6,
      bookings: "2,891+",
      testimonial: "Great meals and care!",
      icon: "🍳",
      gradient: "from-orange-500 to-red-500",
      availability: "Available tomorrow",
      guarantee: "Cooking Certified"
    },
    {
      id: 4,
      title: "Baby Caretaker/Nanny",
      subtitle: "Specialized child care",
      description: "Professional nanny services for infant and child care with safety monitoring",
      price: "₹1,999",
      originalPrice: "₹2,600",
      duration: "/day",
      discount: "23% OFF",
      urgency: "👶 Child Specialist",
      features: ["Infant care", "Child supervision", "Educational activities", "Safety monitoring"],
      imgUrl: nannyImage,
      rating: 4.9,
      bookings: "3,456+",
      testimonial: "My baby loves her!",
      icon: "👶",
      gradient: "from-pink-500 to-purple-500",
      availability: "Available in 2 hours",
      guarantee: "Child Care Certified"
    }
  ],

  detailedInfo: {
    title: "Caretaker at Home",
    description: "Professional caretaking services providing comprehensive support for daily living, personal care, and household management in the comfort of your home.",
    image: caretakerImage,
    keyFeatures: [
      "Background verified and trained staff",
      "Flexible scheduling and service options",
      "Comprehensive care management",
      "Regular monitoring and reporting"
    ],
    servicesInclude: [
      "Personal hygiene and grooming assistance",
      "Meal preparation and feeding support",
      "Medication reminders and management",
      "Light housekeeping and organization",
      "Companionship and emotional support",
      "Emergency response and coordination"
    ]
  }
};
