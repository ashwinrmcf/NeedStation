import elderlyCareImage from '../../assets/images/services/realservices/eldercare.jpg';
import elderEmojiImage from '../../assets/images/services/emojis/elder.png';
import elderEmoji from '../../assets/images/services/emojis/elder.png';
import companionImage from '../../assets/images/services/minicards/elder care/ec1 companion.jpg';
import personalCareImage from '../../assets/images/services/minicards/elder care/ec2 personal.jpg';
import dementiaImage from '../../assets/images/services/minicards/elder care/ec3 dementia.jpg';
import respiteImage from '../../assets/images/services/minicards/elder care/ec4 respite.jpg';
import caregiverImage from '../../assets/images/services/realservices/caregiver.jpg';
import nurseImage from '../../assets/images/services/realservices/nurse].jpg';

export const elderCareData = {
  serviceName: "Elder Care",
  serviceDescription: "Professional and compassionate care for elderly individuals",
  serviceHighlight: "24/7 Available • Trained Caregivers • Medical Support",
  serviceImage: elderlyCareImage,
  serviceEmoji: elderEmoji,
  serviceOptions: [
    {
      id: 1,
      title: "Companion Care",
      subtitle: "Daily companionship and social interaction",
      description: "Friendly companionship and social interaction for elderly individuals who need emotional support and daily engagement.",
      imgUrl: companionImage,
      price: "₹800",
      originalPrice: "₹1000",
      duration: "8-12 hours",
      rating: "4.8",
      gradient: "from-blue-500 to-cyan-500",
      features: ["Social interaction", "Light activities", "Meal assistance", "Medication reminders"]
    },
    {
      id: 2,
      title: "Personal Care",
      subtitle: "Assistance with daily personal activities",
      description: "Professional assistance with bathing, dressing, grooming and other personal care needs for elderly individuals.",
      imgUrl: caregiverImage,
      price: "₹1200",
      originalPrice: "₹1500",
      duration: "8-12 hours",
      rating: "4.9",
      gradient: "from-green-500 to-teal-500",
      features: ["Bathing assistance", "Dressing help", "Grooming", "Mobility support"]
    },
    {
      id: 3,
      title: "Medical Care",
      subtitle: "Professional medical assistance and monitoring",
      description: "Comprehensive medical care including medication management, health monitoring and coordination with healthcare providers.",
      imgUrl: nurseImage,
      price: "₹1800",
      originalPrice: "₹2200",
      duration: "12-24 hours",
      rating: "4.9",
      gradient: "from-purple-500 to-pink-500",
      features: ["Medication management", "Health monitoring", "Doctor coordination", "Emergency response"]
    },
    {
      id: 4,
      title: "Respite Care",
      subtitle: "Short-term relief care for family caregivers",
      description: "Temporary care services that provide family caregivers with much-needed breaks while ensuring quality care for their loved ones.",
      imgUrl: respiteImage,
      price: "₹1000",
      originalPrice: "₹1300",
      duration: "4-8 hours",
      rating: "4.7",
      gradient: "from-orange-500 to-red-500",
      features: ["Temporary relief", "Flexible scheduling", "Trained caregivers", "Peace of mind"]
    }
  ],
  pricing: {
    hourly: "₹100-150/hour",
    daily: "₹800-1800/day",
    monthly: "₹20000-45000/month"
  },
  availability: "24/7",
  responseTime: "Within 2 hours",
  serviceAreas: ["Home Care", "Hospital Care", "Assisted Living"]
};
