import styles from '../../HomePage/Cards.module.css';
import { useState } from 'react';
import { 
  Heart, Stethoscope, Home, Bed, Activity, Dumbbell, Shield, Baby, 
  Accessibility, TestTube, Droplet, ClipboardCheck, Scissors,
  Users, Pill, Utensils, PersonStanding, Syringe, Bandage, 
  Droplets, TrendingUp, Bath, RotateCcw, HeartPulse, Sparkles,
  MessageCircle, Eye, DoorOpen, AlertCircle, Milk, HandHeart, Moon,
  CircleDot, ClipboardList, Apple
} from 'lucide-react';

// Real service images
import securityImage from '../../../assets/images/services/realservices/se.png';
import parkinsonsImage from '../../../assets/images/services/realservices/parkinsons.webp';
import bedriddenImage from '../../../assets/images/services/realservices/bedridden.jpg';
import motherBabyImage from '../../../assets/images/services/realservices/motherbaby.jpg';
import paralysisImage from '../../../assets/images/services/realservices/paralysis.jpg';
import elderlyCareImage from '../../../assets/images/services/realservices/eldercare.jpg';
import nursingImage from '../../../assets/images/services/realservices/nurse].jpg';
import pathologyImage from '../../../assets/images/services/realservices/pathology.jpg';
import diabetesImage from '../../../assets/images/services/realservices/diabetes.jpg';
import healthCheckImage from '../../../assets/images/services/realservices/healthcheck.jpg';
import physiotherapyImage from '../../../assets/images/services/realservices/physiotherapy.jpg';
import postSurgeryImage from '../../../assets/images/services/realservices/postsurgery.jpg';
import caregiverImage from '../../../assets/images/services/realservices/caregiver.jpg';
import { Link } from 'react-router-dom';

const HindiCards = () => {
  const [selectedService, setSelectedService] = useState(0);
  

  // All services data with subcategories in Hindi
  const allServices = [
    {
      image: elderlyCareImage,
      title: "बुजुर्ग देखभाल",
      description: "वरिष्ठ नागरिकों की जरूरतों को पूरा करने के लिए दयालु और पेशेवर देखभाल।",
      link: "/hi/services/elderly-care",
      alt: "बुजुर्ग देखभाल",
      category: "बुजुर्ग देखभाल",
      icon: Heart,
      subcategories: [
        { name: "साहचर्य", icon: Users },
        { name: "दवा याद दिलाना", icon: Pill },
        { name: "भोजन तैयारी", icon: Utensils },
        { name: "गतिशीलता सहायता", icon: PersonStanding }
      ]
    },
    {
      image: nursingImage,
      title: "नर्सिंग देखभाल",
      description: "घर पर चिकित्सा देखभाल के लिए योग्य नर्सों के साथ पेशेवर नर्सिंग सेवाएं।",
      link: "/hi/services/nursing-care",
      alt: "नर्सिंग देखभाल",
      category: "चिकित्सा देखभाल",
      icon: Stethoscope,
      subcategories: [
        { name: "दवा प्रशासन", icon: Syringe },
        { name: "घाव की ड्रेसिंग", icon: Bandage },
        { name: "IV थेरेपी", icon: Droplets },
        { name: "महत्वपूर्ण निगरानी", icon: TrendingUp }
      ]
    },
    {
      image: caregiverImage,
      title: "घर पर देखभालकर्ता",
      description: "घर पर व्यक्तिगत सहायता और साहचर्य प्रदान करने वाले समर्पित देखभालकर्ता।",
      link: "/hi/services/caretaker-at-home",
      alt: "घर पर देखभालकर्ता",
      category: "व्यक्तिगत देखभाल",
      icon: Users,
      subcategories: [
        { name: "दैनिक गतिविधियों में सहायता", icon: Home },
        { name: "व्यक्तिगत स्वच्छता", icon: Bath },
        { name: "हल्की सफाई", icon: Sparkles },
        { name: "साहचर्य", icon: MessageCircle }
      ]
    },
    {
      image: bedriddenImage,
      title: "बिस्तर पर पड़े मरीज की देखभाल",
      description: "दैनिक सहायता और चिकित्सा सहायता के साथ व्यापक बिस्तर पर पड़े रोगी की देखभाल।",
      link: "/hi/services/bedridden-patient-care",
      alt: "बिस्तर पर पड़े मरीज की देखभाल",
      category: "विशेष देखभाल",
      icon: Bed,
      subcategories: [
        { name: "व्यक्तिगत स्वच्छता", icon: Bath },
        { name: "स्थिति देखभाल", icon: RotateCcw },
        { name: "घाव की देखभाल", icon: Bandage },
        { name: "भावनात्मक समर्थन", icon: Heart }
      ]
    },
    {
      image: parkinsonsImage,
      title: "पार्किंसंस देखभाल",
      description: "पार्किंसंस रोग के रोगियों और उनके परिवारों के लिए विशेष देखभाल और सहायता।",
      link: "/hi/services/parkinsons-care",
      alt: "पार्किंसंस देखभाल",
      category: "विशेष देखभाल",
      icon: Activity,
      subcategories: [
        { name: "दवा प्रबंधन", icon: Pill },
        { name: "गतिशीलता सहायता", icon: PersonStanding },
        { name: "भाषण चिकित्सा", icon: MessageCircle },
        { name: "व्यायाम सहायता", icon: Activity }
      ]
    },
    {
      image: physiotherapyImage,
      title: "फिजियोथेरेपी",
      description: "घर पर पुनर्वास और दर्द प्रबंधन के लिए पेशेवर फिजियोथेरेपी सेवाएं।",
      link: "/hi/services/physiotherapy",
      alt: "फिजियोथेरेपी",
      category: "पुनर्वास",
      icon: Dumbbell,
      subcategories: [
        { name: "दर्द प्रबंधन", icon: HandHeart },
        { name: "गतिशीलता प्रशिक्षण", icon: PersonStanding },
        { name: "शक्ति निर्माण", icon: Dumbbell },
        { name: "चोट के बाद रिकवरी", icon: Bandage }
      ]
    },
    {
      image: securityImage,
      title: "घर सुरक्षा गार्ड",
      description: "24/7 सतर्कता के साथ आपके घर और परिवार की रक्षा के लिए पेशेवर सुरक्षा कर्मी।",
      link: "/hi/services/security-guard",
      alt: "घर सुरक्षा गार्ड",
      category: "सुरक्षा",
      icon: Shield,
      subcategories: [
        { name: "24/7 निगरानी", icon: Eye },
        { name: "पहुंच नियंत्रण", icon: DoorOpen },
        { name: "आपातकालीन प्रतिक्रिया", icon: AlertCircle },
        { name: "नियमित गश्त", icon: PersonStanding }
      ]
    },
    {
      image: motherBabyImage,
      title: "माँ और बच्चे की देखभाल",
      description: "माताओं के लिए प्रसवोत्तर देखभाल और नवजात शिशुओं के लिए व्यापक देखभाल सेवाएं।",
      link: "/hi/services/mother-baby-care",
      alt: "माँ और बच्चे की देखभाल",
      category: "मातृत्व देखभाल",
      icon: Baby,
      subcategories: [
        { name: "स्तनपान सहायता", icon: Milk },
        { name: "नवजात देखभाल", icon: Baby },
        { name: "माँ की रिकवरी", icon: HandHeart },
        { name: "नींद प्रशिक्षण", icon: Moon }
      ]
    },
    {
      image: paralysisImage,
      title: "लकवा देखभाल",
      description: "लकवा की स्थिति वाले रोगियों के लिए विशेष देखभाल और पुनर्वास सेवाएं।",
      link: "/hi/services/paralysis-care",
      alt: "लकवा देखभाल",
      category: "विशेष देखभाल",
      icon: Accessibility,
      subcategories: [
        { name: "भौतिक चिकित्सा", icon: Dumbbell },
        { name: "गतिशीलता सहायता", icon: CircleDot },
        { name: "दैनिक जीवन सहायता", icon: Home },
        { name: "पुनर्वास", icon: RotateCcw }
      ]
    },
    {
      image: pathologyImage,
      title: "पैथोलॉजी देखभाल",
      description: "नमूना संग्रह और नैदानिक ​​परीक्षणों सहित घर-आधारित पैथोलॉजी सेवाएं।",
      link: "/hi/services/pathology-care",
      alt: "पैथोलॉजी देखभाल",
      category: "निदान",
      icon: TestTube,
      subcategories: [
        { name: "नमूना संग्रह", icon: Syringe },
        { name: "रक्त परीक्षण", icon: Droplet },
        { name: "नैदानिक ​​रिपोर्ट", icon: ClipboardList },
        { name: "घर का दौरा", icon: Home }
      ]
    },
    {
      image: diabetesImage,
      title: "मधुमेह प्रबंधन",
      description: "निगरानी, दवा प्रबंधन और जीवनशैली मार्गदर्शन सहित व्यापक मधुमेह देखभाल।",
      link: "/hi/services/diabetes-management",
      alt: "मधुमेह प्रबंधन",
      category: "स्वास्थ्य प्रबंधन",
      icon: Droplet,
      subcategories: [
        { name: "रक्त शर्करा निगरानी", icon: TrendingUp },
        { name: "आहार योजना", icon: Apple },
        { name: "दवा सहायता", icon: Pill },
        { name: "जीवनशैली मार्गदर्शन", icon: Activity }
      ]
    },
    {
      image: healthCheckImage,
      title: "स्वास्थ्य जांच सेवाएं",
      description: "आपकी सुविधा के अनुसार नियमित स्वास्थ्य जांच और व्यापक चिकित्सा जांच।",
      link: "/hi/services/health-check-up-services",
      alt: "स्वास्थ्य जांच सेवाएं",
      category: "निवारक देखभाल",
      icon: ClipboardCheck,
      subcategories: [
        { name: "पूर्ण शरीर जांच", icon: Stethoscope },
        { name: "रक्त परीक्षण", icon: Syringe },
        { name: "ECG और X-Ray", icon: HeartPulse },
        { name: "स्वास्थ्य रिपोर्ट", icon: ClipboardList }
      ]
    },
    {
      image: postSurgeryImage,
      title: "सर्जरी के बाद देखभाल",
      description: "आपके घर के आराम में विशेष पोस्ट-ऑपरेटिव देखभाल और रिकवरी सहायता।",
      link: "/hi/services/post-surgery-care",
      alt: "सर्जरी के बाद देखभाल",
      category: "रिकवरी देखभाल",
      icon: Scissors,
      subcategories: [
        { name: "घाव की देखभाल", icon: Bandage },
        { name: "दर्द प्रबंधन", icon: Pill },
        { name: "गतिशीलता सहायता", icon: PersonStanding },
        { name: "रिकवरी निगरानी", icon: TrendingUp }
      ]
    }
  ];

  return <>
    <section className={`py-5 ${styles["section"]}`}>
    <div className="container">
      <div className={styles["headerSection"]}>
        <h2 className={`${styles["heading"]}`}>हमारी सेवाएं</h2>
      </div>
      {/* Creative Services Showcase */}
      <div className={styles["servicesShowcase"]}>
        
        {/* Hero Service Spotlight */}
        <div className={styles["heroSpotlight"]}>
          <div className={styles["spotlightImageSection"]}>
            {/* Left Half - Service Subcategories */}
            <div className={styles["quickInfoPanel"]}>
              <div className={styles["panelHeader"]}>
                <div className={styles["serviceIconLarge"]}>
                  {(() => {
                    const IconComponent = allServices[selectedService].icon;
                    return IconComponent && typeof IconComponent !== 'string' ? (
                      <IconComponent size={48} strokeWidth={2} />
                    ) : IconComponent;
                  })()}
                </div>
                <div className={styles["headerText"]}>
                  <h4 className={styles["quickTitle"]}>क्या शामिल है</h4>
                  <span className={styles["categoryBadge"]}>{allServices[selectedService].category}</span>
                </div>
              </div>
              
              <div className={styles["infoCards"]}>
                {allServices[selectedService].subcategories ? (
                  allServices[selectedService].subcategories.map((sub, idx) => {
                    const SubIcon = sub.icon;
                    return (
                      <div key={idx} className={styles["infoCard"]}>
                        <div className={styles["cardIcon"]}>
                          {SubIcon && typeof SubIcon !== 'string' ? (
                            <SubIcon size={24} strokeWidth={2} />
                          ) : SubIcon}
                        </div>
                        <div className={styles["cardContent"]}>
                          <span className={styles["cardValue"]}>{sub.name}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className={styles["infoCard"]}>
                      <div className={styles["cardIcon"]}>💳</div>
                      <div className={styles["cardContent"]}>
                        <span className={styles["cardLabel"]}>शुरुआत</span>
                        <span className={styles["cardValue"]}>₹800/दिन</span>
                      </div>
                    </div>
                    <div className={styles["infoCard"]}>
                      <div className={styles["cardIcon"]}>⏰</div>
                      <div className={styles["cardContent"]}>
                        <span className={styles["cardLabel"]}>उपलब्ध</span>
                        <span className={styles["cardValue"]}>24/7</span>
                      </div>
                    </div>
                    <div className={styles["infoCard"]}>
                      <div className={styles["cardIcon"]}>🌍</div>
                      <div className={styles["cardContent"]}>
                        <span className={styles["cardLabel"]}>स्थान</span>
                        <span className={styles["cardValue"]}>पूरे भारत में</span>
                      </div>
                    </div>
                    <div className={styles["infoCard"]}>
                      <div className={styles["cardIcon"]}>⭐</div>
                      <div className={styles["cardContent"]}>
                        <span className={styles["cardLabel"]}>रेटिंग</span>
                        <span className={styles["cardValue"]}>4.8/5</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className={styles["trustBadge"]}>
                <span className={styles["trustIcon"]}>✓</span>
                <span className={styles["trustText"]}>10,000+ परिवारों द्वारा विश्वसनीय</span>
              </div>
            </div>
            
            {/* Right Half - Square Image */}
            <div className={styles["spotlightImage"]}>
              <img 
                src={allServices[selectedService].image} 
                alt={allServices[selectedService].alt}
                className={styles["heroImage"]}
              />
            </div>
          </div>
          <div className={styles["spotlightContent"]}>
            <h3 className={styles["heroTitle"]}>{allServices[selectedService].title}</h3>
            <p className={styles["heroDescription"]}>{allServices[selectedService].description}</p>
            <Link 
              to={allServices[selectedService].link} 
              className={styles["heroButton"]}
            >
              सेवाएं देखें →
            </Link>
          </div>
        </div>

        {/* Interactive Services Grid */}
        <div className={styles["servicesGrid"]}>
          <h4 className={styles["gridTitle"]}>हमारी सभी सेवाएं</h4>
          <div className={styles["servicesList"]}>
            {allServices.map((service, index) => {
              const ServiceIcon = service.icon;
              return (
                <Link 
                  key={index}
                  to={service.link}
                  className={`${styles["serviceItem"]} ${index === selectedService ? styles["active"] : ''}`}
                  onMouseEnter={() => setSelectedService(index)}
                  role="button"
                  aria-label={`${service.title} सेवा पृष्ठ पर जाएं`}
                >
                  <div className={styles["serviceIcon"]}>
                    {ServiceIcon && typeof ServiceIcon !== 'string' ? (
                      <ServiceIcon size={24} strokeWidth={2} />
                    ) : ServiceIcon}
                  </div>
                  <div className={styles["serviceInfo"]}>
                    <h5 className={styles["serviceName"]}>{service.title}</h5>
                    <span className={styles["serviceCategory"]}>{service.category}</span>
                  </div>
                  <div className={styles["serviceArrow"]}>
                    {index === selectedService ? '▶' : '→'}
                  </div>
                </Link>
              );
            })}
          </div>
          <Link to="/hi/services" className={styles["viewAllButton"]}>
            सभी देखें
          </Link>
        </div>

      </div>
    </div>
  </section>

  </>
}

export default HindiCards;
