import elderlyCareImage from '../../assets/images/services/elderlyCare.png';
import elderEmojiImage from '../../assets/images/services/emojis/elder.png';
import elderEmoji from '../../assets/images/services/emojis/elder.png';
import companionImage from '../../assets/images/services/minicards/elder care/ec1 companion.jpg';

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
      description: "Friendly companionship and social interaction",
      image: companionImage,
      price: "₹800/day",
      duration: "8-12 hours",
      features: ["Social interaction", "Light activities", "Meal assistance", "Medication reminders"]
    },
    {
      id: 2,
      title: "Personal Care",
      description: "Assistance with daily personal activities",
      image: elderEmojiImage,
      price: "₹1200/day",
      duration: "8-12 hours",
      features: ["Bathing assistance", "Dressing help", "Grooming", "Mobility support"]
    },
    {
      id: 3,
      title: "Medical Care",
      description: "Professional medical assistance and monitoring",
      image: elderEmojiImage,
      price: "₹1800/day",
      duration: "12-24 hours",
      features: ["Medication management", "Health monitoring", "Doctor coordination", "Emergency response"]
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
