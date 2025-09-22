import pathologyImage from '../../assets/images/services/pathologyCare.png';
import homeSampleImage from '../../assets/images/services/minicards/pathology care/pathc1 home sample.jpg';
import diagnosticServicesImage from '../../assets/images/services/minicards/pathology care/pathc2 diagnostic services.jpg';
import regularMonitoringImage from '../../assets/images/services/minicards/pathology care/pathc3 regular monitoring.webp';
import corporateHealthImage from '../../assets/images/services/minicards/pathology care/pathc4 corporate health.jpg';

export const pathologyData = {
  serviceName: "Pathology Care",
  serviceDescription: "🔬 Professional diagnostic services and sample collection at your home.",
  serviceHighlight: "Accurate diagnostics with convenient home collection.",
  
  trustIndicators: [
    { key: 'tests', value: 25000, suffix: '+', label: 'Tests Conducted', icon: '🏆' },
    { key: 'technicians', value: 120, suffix: '+', label: 'Lab Technicians', icon: '👨‍🔬' },
    { key: 'rating', value: 47, suffix: '/50', label: 'Rating', icon: '⭐' }
  ],

  services: [
    {
      id: 1,
      title: "Home Sample Collection",
      subtitle: "Convenient sample pickup",
      description: "Professional collection of blood, urine, and other samples at your home",
      price: "₹299",
      originalPrice: "₹500",
      duration: "/visit",
      discount: "40% OFF",
      urgency: "🩸 Most Popular",
      features: ["Blood tests", "Urine tests", "Stool tests", "Swab collection"],
      imgUrl: homeSampleImage,
      rating: 4.8,
      bookings: "8,567+",
      testimonial: "So convenient and professional!",
      icon: "🩸",
      gradient: "from-red-500 to-pink-500",
      availability: "Available today",
      guarantee: "Certified Lab Technicians"
    },
    {
      id: 2,
      title: "Diagnostic Services",
      subtitle: "Advanced diagnostics at home",
      description: "Portable diagnostic equipment brought to your home for tests",
      price: "₹899",
      originalPrice: "₹1,200",
      duration: "/test",
      discount: "25% OFF",
      urgency: "📈 Advanced Testing",
      features: ["ECG at home", "Echo cardiogram", "X-ray (portable)", "Ultrasound"],
      imgUrl: diagnosticServicesImage,
      rating: 4.9,
      bookings: "3,456+",
      testimonial: "Amazing portable diagnostics!",
      icon: "📊",
      gradient: "from-blue-500 to-indigo-500",
      availability: "Available tomorrow",
      guarantee: "Advanced Equipment"
    },
    {
      id: 3,
      title: "Regular Monitoring",
      subtitle: "Ongoing health tracking",
      description: "Regular monitoring services for chronic conditions and health maintenance",
      price: "₹599",
      originalPrice: "₹800",
      duration: "/visit",
      discount: "25% OFF",
      urgency: "📈 Health Tracking",
      features: ["Diabetes monitoring", "Cardiac markers", "Thyroid profiles", "Vitamin levels"],
      imgUrl: regularMonitoringImage,
      rating: 4.7,
      bookings: "4,789+",
      testimonial: "Great for regular monitoring!",
      icon: "📈",
      gradient: "from-green-500 to-teal-500",
      availability: "Available today",
      guarantee: "Regular Monitoring Expert"
    },
    {
      id: 4,
      title: "Corporate Health Checkups",
      subtitle: "Employee health programs",
      description: "Comprehensive health screening programs for corporate employees",
      price: "₹1,499",
      originalPrice: "₹2,000",
      duration: "/employee",
      discount: "25% OFF",
      urgency: "🏢 Corporate Package",
      features: ["Employee screening", "Annual health checks", "Pre-employment tests", "Wellness programs"],
      imgUrl: corporateHealthImage,
      rating: 4.8,
      bookings: "2,134+",
      testimonial: "Excellent corporate service!",
      icon: "🏢",
      gradient: "from-purple-500 to-indigo-500",
      availability: "Schedule required",
      guarantee: "Corporate Health Certified"
    }
  ],

  detailedInfo: {
    title: "Pathology Care",
    description: "Professional pathology and diagnostic services delivered at your home with certified technicians, advanced equipment, and accurate results for comprehensive health monitoring.",
    image: pathologyImage,
    keyFeatures: [
      "Certified lab technicians and equipment",
      "Home sample collection convenience",
      "Advanced portable diagnostic tools",
      "Fast and accurate results delivery"
    ],
    servicesInclude: [
      "Complete blood work and analysis",
      "Urine and stool sample collection",
      "Portable ECG and cardiac tests",
      "Ultrasound and imaging services",
      "Regular health monitoring programs",
      "Corporate wellness packages"
    ]
  }
};
