import securityImage from '../../assets/images/services/securityGuard.png';
import residentialSecurityImage from '../../assets/images/services/minicards/security guard/hsg home sec.jpg';
import corporateSecurityImage from '../../assets/images/services/minicards/security guard/hsg corporate security.jpg';
import personalSecurityImage from '../../assets/images/services/minicards/security guard/hsg personal_security.jpg';
import nightWatchmanImage from '../../assets/images/services/minicards/security guard/hsg night watchman.jpg';

export const securityGuardData = {
  serviceName: "Home Security Guard",
  serviceDescription: "🛡️ Professional security personnel to protect your home and family with 24/7 vigilance.",
  serviceHighlight: "Peace of mind with trained security professionals.",
  
  trustIndicators: [
    { key: 'properties', value: 5000, suffix: '+', label: 'Properties Protected', icon: '🏆' },
    { key: 'guards', value: 800, suffix: '+', label: 'Trained Guards', icon: '👮‍♂️' },
    { key: 'rating', value: 45, suffix: '/50', label: 'Rating', icon: '⭐' }
  ],

  services: [
    {
      id: 1,
      title: "Residential Security",
      subtitle: "Complete home protection",
      description: "Professional security for individual homes and residential complexes",
      price: "₹1,199",
      originalPrice: "₹1,600",
      duration: "/day",
      discount: "25% OFF",
      urgency: "🏠 Most Popular",
      features: ["Individual homes", "Apartment complexes", "Gated communities", "Farm houses"],
      imgUrl: residentialSecurityImage,
      rating: 4.7,
      bookings: "4,123+",
      testimonial: "Feel so much safer now!",
      icon: "🏠",
      gradient: "from-blue-500 to-cyan-500",
      availability: "Available today",
      guarantee: "Background Verified",
      category: "residential"
    },
    {
      id: 2,
      title: "Corporate Security",
      subtitle: "Business protection services",
      description: "Professional security for offices, stores, and commercial properties",
      price: "₹1,499",
      originalPrice: "₹2,000",
      duration: "/day",
      discount: "25% OFF",
      urgency: "🏢 Business Grade",
      features: ["Office buildings", "Retail stores", "Warehouses", "Construction sites"],
      imgUrl: corporateSecurityImage,
      rating: 4.8,
      bookings: "2,847+",
      testimonial: "Professional and reliable!",
      icon: "🏢",
      gradient: "from-indigo-500 to-purple-500",
      availability: "Available tomorrow",
      guarantee: "Corporate Trained",
      category: "corporate"
    },
    {
      id: 3,
      title: "Personal Security/Bodyguard",
      subtitle: "VIP protection services",
      description: "Dedicated bodyguard services for personal and family protection",
      price: "₹2,499",
      originalPrice: "₹3,200",
      duration: "/day",
      discount: "22% OFF",
      urgency: "👥 VIP Services",
      features: ["VIP protection", "Executive security", "Family protection", "Travel security"],
      imgUrl: personalSecurityImage,
      rating: 4.9,
      bookings: "1,234+",
      testimonial: "Excellent protection service!",
      icon: "👤",
      gradient: "from-red-500 to-pink-500",
      availability: "Available in 4 hours",
      guarantee: "Elite Training",
      category: "personal"
    },
    {
      id: 4,
      title: "Night Watchman",
      subtitle: "Overnight security patrol",
      description: "Dedicated night shift security for property protection and monitoring",
      price: "₹800",
      originalPrice: "₹1,200",
      duration: "/night",
      discount: "33% OFF",
      urgency: "🌙 Night Shift",
      features: ["Night shift only", "Property patrol", "Asset protection", "Emergency response"],
      imgUrl: nightWatchmanImage,
      rating: 4.6,
      bookings: "3,567+",
      testimonial: "Sleep peacefully now!",
      icon: "🌙",
      gradient: "from-gray-600 to-gray-800",
      availability: "Available tonight",
      guarantee: "Night Trained",
      category: "night"
    }
  ],

  detailedInfo: {
    title: "Home Security Guard",
    description: "Professional security services with trained and background-verified personnel providing comprehensive protection for your property, family, and peace of mind.",
    image: securityImage,
    keyFeatures: [
      "Background verified personnel",
      "24/7 monitoring and surveillance",
      "Emergency response capabilities",
      "Regular patrol and inspection"
    ],
    servicesInclude: [
      "Perimeter monitoring and access control",
      "Visitor screening and management",
      "Emergency response and coordination",
      "Regular patrol duties and reporting",
      "CCTV monitoring and maintenance",
      "Incident documentation and reporting"
    ]
  }
};
