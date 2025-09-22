import postSurgeryImage from '../../assets/images/services/medicalCare.png';
import cardiacSurgeryImage from '../../assets/images/services/minicards/post surgery care/ps1 cardiac surgery.jpg';
import orthopedicSurgeryImage from '../../assets/images/services/minicards/post surgery care/ps2 orthopedic.jpg';
import abdominalSurgeryImage from '../../assets/images/services/minicards/post surgery care/ps3 abdominal surgery care.jpg';
import cancerSurgeryImage from '../../assets/images/services/minicards/post surgery care/ps5 cancer care.webp';

export const postSurgeryData = {
  serviceName: "Post Surgery Care",
  serviceDescription: "🏥 Specialized post-operative care for safe and comfortable recovery at home.",
  serviceHighlight: "Expert recovery support for all types of surgical procedures.",
  
  trustIndicators: [
    { key: 'recoveries', value: 7500, suffix: '+', label: 'Successful Recoveries', icon: '🏆' },
    { key: 'nurses', value: 200, suffix: '+', label: 'Post-Op Nurses', icon: '👩‍⚕️' },
    { key: 'rating', value: 49, suffix: '/50', label: 'Rating', icon: '⭐' }
  ],

  services: [
    {
      id: 1,
      title: "Cardiac Surgery Care",
      subtitle: "Heart surgery recovery",
      description: "Specialized post-operative care for cardiac surgery patients",
      price: "₹3,499",
      originalPrice: "₹4,500",
      duration: "/day",
      discount: "22% OFF",
      urgency: "❤️ Cardiac Recovery",
      features: ["CABG recovery", "Valve replacement care", "Pacemaker monitoring", "Cardiac rehabilitation"],
      imgUrl: cardiacSurgeryImage,
      rating: 4.9,
      bookings: "1,567+",
      testimonial: "Excellent cardiac recovery!",
      icon: "❤️",
      gradient: "from-red-500 to-pink-500",
      availability: "Specialist available",
      guarantee: "Cardiac Care Certified"
    },
    {
      id: 2,
      title: "Orthopedic Surgery Care",
      subtitle: "Bone and joint recovery",
      description: "Comprehensive care for orthopedic surgery recovery and rehabilitation",
      price: "₹2,499",
      originalPrice: "₹3,200",
      duration: "/day",
      discount: "22% OFF",
      urgency: "🦴 Most Common",
      features: ["Joint replacement care", "Fracture recovery", "Spine surgery care", "Arthroscopy recovery"],
      imgUrl: orthopedicSurgeryImage,
      rating: 4.8,
      bookings: "3,456+",
      testimonial: "Great orthopedic recovery!",
      icon: "🦴",
      gradient: "from-blue-500 to-indigo-500",
      availability: "Available today",
      guarantee: "Orthopedic Care Expert"
    },
    {
      id: 3,
      title: "Abdominal Surgery Care",
      subtitle: "Abdominal recovery care",
      description: "Specialized care for abdominal and laparoscopic surgery recovery",
      price: "₹2,199",
      originalPrice: "₹2,800",
      duration: "/day",
      discount: "21% OFF",
      urgency: "🏥 Surgical Care",
      features: ["Laparoscopy care", "Hernia recovery", "Appendectomy care", "Gastric surgery care"],
      imgUrl: abdominalSurgeryImage,
      rating: 4.8,
      bookings: "2,789+",
      testimonial: "Smooth abdominal recovery!",
      icon: "🏥",
      gradient: "from-green-500 to-teal-500",
      availability: "Available tomorrow",
      guarantee: "Surgical Care Certified"
    },
    {
      id: 4,
      title: "Cancer Surgery Care",
      subtitle: "Oncology recovery support",
      description: "Comprehensive post-operative care for cancer surgery patients",
      price: "₹3,999",
      originalPrice: "₹5,200",
      duration: "/day",
      discount: "23% OFF",
      urgency: "🎗️ Cancer Recovery",
      features: ["Mastectomy care", "Chemotherapy support", "Radiation therapy support", "Pain management"],
      imgUrl: cancerSurgeryImage,
      rating: 4.9,
      bookings: "1,234+",
      testimonial: "Compassionate cancer care!",
      icon: "🎗️",
      gradient: "from-purple-500 to-indigo-500",
      availability: "Oncology specialist available",
      guarantee: "Oncology Care Certified"
    }
  ],

  detailedInfo: {
    title: "Post Surgery Care",
    description: "Specialized post-operative care services providing comprehensive recovery support for all types of surgical procedures with qualified medical professionals and advanced care protocols.",
    image: postSurgeryImage,
    keyFeatures: [
      "Surgery-specific recovery protocols",
      "Qualified post-operative nurses",
      "Pain management and wound care",
      "Rehabilitation and recovery support"
    ],
    servicesInclude: [
      "Post-operative wound care and monitoring",
      "Pain management and medication administration",
      "Mobility assistance and rehabilitation",
      "Infection prevention and care",
      "Nutritional support and recovery planning",
      "Family education and emotional support"
    ]
  }
};
