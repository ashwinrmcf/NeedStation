import healthCheckupImage from '../../assets/images/services/healthCheckUp.png';
import basicCheckupImage from '../../assets/images/services/minicards/health check up services/hcs1 basic.jpg';
import comprehensiveImage from '../../assets/images/services/minicards/health check up services/hcs2 comprehensive health checkup.jpg';
import seniorCitizenImage from '../../assets/images/services/minicards/health check up services/hcs3 senior citizen.png';
import womenHealthImage from '../../assets/images/services/minicards/health check up services/hcs4 women health checkup.jpg';

export const healthCheckupData = {
  serviceName: "Health Check Up Service",
  serviceDescription: "🏥 Comprehensive health assessments and preventive care at your home.",
  serviceHighlight: "Complete health evaluation for early detection and prevention.",
  
  trustIndicators: [
    { key: 'checkups', value: 15000, suffix: '+', label: 'Checkups Done', icon: '🏆' },
    { key: 'doctors', value: 150, suffix: '+', label: 'Doctors', icon: '👨‍⚕️' },
    { key: 'rating', value: 47, suffix: '/50', label: 'Rating', icon: '⭐' }
  ],

  services: [
    {
      id: 1,
      title: "Basic Health Checkup",
      subtitle: "Essential health screening",
      description: "Fundamental health assessment with basic tests and examination",
      price: "₹999",
      originalPrice: "₹1,500",
      duration: "/checkup",
      discount: "33% OFF",
      urgency: "🔍 Most Popular",
      features: ["Vital signs", "Basic blood tests", "General examination", "Health counseling"],
      imgUrl: basicCheckupImage,
      rating: 4.7,
      bookings: "6,789+",
      testimonial: "Great basic screening!",
      icon: "🔍",
      gradient: "from-blue-500 to-indigo-500",
      availability: "Available today",
      guarantee: "Certified Doctors"
    },
    {
      id: 2,
      title: "Comprehensive Health Checkup",
      subtitle: "Complete health evaluation",
      description: "Thorough health assessment with advanced tests and full body evaluation",
      price: "₹2,999",
      originalPrice: "₹4,000",
      duration: "/checkup",
      discount: "25% OFF",
      urgency: "🏥 Comprehensive",
      features: ["Full body checkup", "All system evaluation", "Cancer screening", "Cardiac assessment"],
      imgUrl: comprehensiveImage,
      rating: 4.9,
      bookings: "3,456+",
      testimonial: "Very thorough checkup!",
      icon: "🏥",
      gradient: "from-green-500 to-teal-500",
      availability: "Schedule required",
      guarantee: "Comprehensive Care"
    },
    {
      id: 3,
      title: "Senior Citizen Checkup",
      subtitle: "Geriatric health assessment",
      description: "Specialized health checkup designed for senior citizens and elderly care",
      price: "₹1,999",
      originalPrice: "₹2,600",
      duration: "/checkup",
      discount: "23% OFF",
      urgency: "👴 Senior Care",
      features: ["Geriatric assessment", "Fall risk evaluation", "Memory testing", "Bone density check"],
      imgUrl: seniorCitizenImage,
      rating: 4.8,
      bookings: "2,567+",
      testimonial: "Perfect for seniors!",
      icon: "👴",
      gradient: "from-purple-500 to-indigo-500",
      availability: "Available tomorrow",
      guarantee: "Geriatric Care Specialist"
    },
    {
      id: 4,
      title: "Women's Health Checkup",
      subtitle: "Women-specific screening",
      description: "Comprehensive health checkup tailored for women's specific health needs",
      price: "₹1,799",
      originalPrice: "₹2,400",
      duration: "/checkup",
      discount: "25% OFF",
      urgency: "👩 Women's Health",
      features: ["Gynecological exam", "Breast examination", "Hormonal profiles", "Pregnancy tests"],
      imgUrl: womenHealthImage,
      rating: 4.8,
      bookings: "4,123+",
      testimonial: "Comprehensive women's care!",
      icon: "👩",
      gradient: "from-pink-500 to-rose-500",
      availability: "Female doctor available",
      guarantee: "Women's Health Expert"
    }
  ],

  detailedInfo: {
    title: "Health Check Up Service",
    description: "Comprehensive health assessment services providing preventive care, early detection, and health monitoring with qualified medical professionals and advanced diagnostic tools.",
    image: healthCheckupImage,
    keyFeatures: [
      "Comprehensive health assessments",
      "Preventive care and early detection",
      "Specialized age and gender-specific checkups",
      "Advanced diagnostic capabilities"
    ],
    servicesInclude: [
      "Complete physical examination",
      "Laboratory tests and diagnostics",
      "Cardiovascular and respiratory assessment",
      "Cancer screening and prevention",
      "Nutritional and lifestyle counseling",
      "Health risk assessment and planning"
    ]
  }
};
