import styles from './Cards.module.css';
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
import securityImage from '../../assets/images/services/realservices/se.png';
import parkinsonsImage from '../../assets/images/services/realservices/parkinsons.webp';
import bedriddenImage from '../../assets/images/services/realservices/bedridden.jpg';
import motherBabyImage from '../../assets/images/services/realservices/motherbaby.jpg';
import paralysisImage from '../../assets/images/services/realservices/paralysis.jpg';
import elderlyCareImage from '../../assets/images/services/realservices/eldercare.jpg';
import nursingImage from '../../assets/images/services/realservices/nurse].jpg';
import pathologyImage from '../../assets/images/services/realservices/pathology.jpg';
import diabetesImage from '../../assets/images/services/realservices/diabetes.jpg';
import healthCheckImage from '../../assets/images/services/realservices/healthcheck.jpg';
import physiotherapyImage from '../../assets/images/services/realservices/physiotherapy.jpg';
import postSurgeryImage from '../../assets/images/services/realservices/postsurgery.jpg';
import caregiverImage from '../../assets/images/services/realservices/caregiver.jpg';
import { Link } from 'react-router-dom';

const Cards = () => {
  const [selectedService, setSelectedService] = useState(0);
  

  // All services data with subcategories
  const allServices = [
    {
      image: elderlyCareImage,
      title: "Elderly Care",
      description: "Compassionate and professional care tailored to meet the needs of seniors.",
      link: "/services/elderly-care",
      alt: "Elderly Care",
      category: "Elder Care",
      icon: Heart,
      subcategories: [
        { name: "Companionship", icon: Users },
        { name: "Medication Reminders", icon: Pill },
        { name: "Meal Preparation", icon: Utensils },
        { name: "Mobility Assistance", icon: PersonStanding }
      ]
    },
    {
      image: nursingImage,
      title: "Nursing Care",
      description: "Professional nursing services with qualified nurses for medical care at home.",
      link: "/services/nursing-care",
      alt: "Nursing Care",
      category: "Medical Care",
      icon: Stethoscope,
      subcategories: [
        { name: "Medication Administration", icon: Syringe },
        { name: "Wound Dressing", icon: Bandage },
        { name: "IV Therapy", icon: Droplets },
        { name: "Vital Monitoring", icon: TrendingUp }
      ]
    },
    {
      image: caregiverImage,
      title: "Caretaker at Home",
      description: "Dedicated caretakers providing personalized assistance and companionship at home.",
      link: "/services/caretaker-at-home",
      alt: "Caretaker at Home",
      category: "Personal Care",
      icon: Users,
      subcategories: [
        { name: "Daily Activities Support", icon: Home },
        { name: "Personal Hygiene", icon: Bath },
        { name: "Light Housekeeping", icon: Sparkles },
        { name: "Companionship", icon: MessageCircle }
      ]
    },
    {
      image: bedriddenImage,
      title: "Bedridden Patient Care",
      description: "Comprehensive bedridden care with daily assistance and medical support.",
      link: "/services/bedridden-patient-care",
      alt: "Bedridden Patient Care",
      category: "Specialized Care",
      icon: Bed,
      subcategories: [
        { name: "Personal Hygiene", icon: Bath },
        { name: "Positioning Care", icon: RotateCcw },
        { name: "Wound Care", icon: Bandage },
        { name: "Emotional Support", icon: Heart }
      ]
    },
    {
      image: parkinsonsImage,
      title: "Parkinsons Care",
      description: "Specialized care and support for patients with Parkinson's disease and their families.",
      link: "/services/parkinsons-care",
      alt: "Parkinsons Care",
      category: "Specialized Care",
      icon: Activity,
      subcategories: [
        { name: "Medication Management", icon: Pill },
        { name: "Mobility Support", icon: PersonStanding },
        { name: "Speech Therapy", icon: MessageCircle },
        { name: "Exercise Assistance", icon: Activity }
      ]
    },
    {
      image: physiotherapyImage,
      title: "Physiotherapy",
      description: "Professional physiotherapy services for rehabilitation and pain management at home.",
      link: "/services/physiotherapy",
      alt: "Physiotherapy",
      category: "Rehabilitation",
      icon: Dumbbell,
      subcategories: [
        { name: "Pain Management", icon: HandHeart },
        { name: "Mobility Training", icon: PersonStanding },
        { name: "Strength Building", icon: Dumbbell },
        { name: "Post-Injury Recovery", icon: Bandage }
      ]
    },
    {
      image: securityImage,
      title: "Home Security Guard",
      description: "Professional security personnel to protect your home and family with 24/7 vigilance.",
      link: "/services/security-guard",
      alt: "Home Security Guard",
      category: "Security",
      icon: Shield,
      subcategories: [
        { name: "24/7 Monitoring", icon: Eye },
        { name: "Access Control", icon: DoorOpen },
        { name: "Emergency Response", icon: AlertCircle },
        { name: "Regular Patrols", icon: PersonStanding }
      ]
    },
    {
      image: motherBabyImage,
      title: "Mother and Baby Care",
      description: "Postnatal care for mothers and comprehensive newborn care services.",
      link: "/services/mother-baby-care",
      alt: "Mother and Baby Care",
      category: "Maternity Care",
      icon: Baby,
      subcategories: [
        { name: "Breastfeeding Support", icon: Milk },
        { name: "Newborn Care", icon: Baby },
        { name: "Mother's Recovery", icon: HandHeart },
        { name: "Sleep Training", icon: Moon }
      ]
    },
    {
      image: paralysisImage,
      title: "Paralysis Care",
      description: "Specialized care and rehabilitation services for patients with paralysis conditions.",
      link: "/services/paralysis-care",
      alt: "Paralysis Care",
      category: "Specialized Care",
      icon: Accessibility,
      subcategories: [
        { name: "Physical Therapy", icon: Dumbbell },
        { name: "Mobility Assistance", icon: CircleDot },
        { name: "Daily Living Support", icon: Home },
        { name: "Rehabilitation", icon: RotateCcw }
      ]
    },
    {
      image: pathologyImage,
      title: "Pathology Care",
      description: "Home-based pathology services including sample collection and diagnostic tests.",
      link: "/services/pathology-care",
      alt: "Pathology Care",
      category: "Diagnostic",
      icon: TestTube,
      subcategories: [
        { name: "Sample Collection", icon: Syringe },
        { name: "Blood Tests", icon: Droplet },
        { name: "Diagnostic Reports", icon: ClipboardList },
        { name: "Home Visit", icon: Home }
      ]
    },
    {
      image: diabetesImage,
      title: "Diabetes Management",
      description: "Comprehensive diabetes care including monitoring, medication management, and lifestyle guidance.",
      link: "/services/diabetes-management",
      alt: "Diabetes Management",
      category: "Health Management",
      icon: Droplet,
      subcategories: [
        { name: "Blood Sugar Monitoring", icon: TrendingUp },
        { name: "Diet Planning", icon: Apple },
        { name: "Medication Support", icon: Pill },
        { name: "Lifestyle Guidance", icon: Activity }
      ]
    },
    {
      image: healthCheckImage,
      title: "Health Check Up Services",
      description: "Regular health screenings and comprehensive medical check-ups at your convenience.",
      link: "/services/health-check-up-services",
      alt: "Health Check Up Services",
      category: "Preventive Care",
      icon: ClipboardCheck,
      subcategories: [
        { name: "Full Body Checkup", icon: Stethoscope },
        { name: "Blood Tests", icon: Syringe },
        { name: "ECG & X-Ray", icon: HeartPulse },
        { name: "Health Reports", icon: ClipboardList }
      ]
    },
    {
      image: postSurgeryImage,
      title: "Post Surgery Care",
      description: "Specialized post-operative care and recovery support in the comfort of your home.",
      link: "/services/post-surgery-care",
      alt: "Post Surgery Care",
      category: "Recovery Care",
      icon: Scissors,
      subcategories: [
        { name: "Wound Care", icon: Bandage },
        { name: "Pain Management", icon: Pill },
        { name: "Mobility Support", icon: PersonStanding },
        { name: "Recovery Monitoring", icon: TrendingUp }
      ]
    }
  ];

  return <>
    <section className={`py-5 ${styles["section"]}`}>
    <div className="container">
      <div className={styles["headerSection"]}>
        <h2 className={`${styles["heading"]}`}>Our Services</h2>
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
                  <h4 className={styles["quickTitle"]}>What's Included</h4>
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
                        <span className={styles["cardLabel"]}>Starting</span>
                        <span className={styles["cardValue"]}>₹800/day</span>
                      </div>
                    </div>
                    <div className={styles["infoCard"]}>
                      <div className={styles["cardIcon"]}>⏰</div>
                      <div className={styles["cardContent"]}>
                        <span className={styles["cardLabel"]}>Available</span>
                        <span className={styles["cardValue"]}>24/7</span>
                      </div>
                    </div>
                    <div className={styles["infoCard"]}>
                      <div className={styles["cardIcon"]}>🌍</div>
                      <div className={styles["cardContent"]}>
                        <span className={styles["cardLabel"]}>Location</span>
                        <span className={styles["cardValue"]}>Pan India</span>
                      </div>
                    </div>
                    <div className={styles["infoCard"]}>
                      <div className={styles["cardIcon"]}>⭐</div>
                      <div className={styles["cardContent"]}>
                        <span className={styles["cardLabel"]}>Rating</span>
                        <span className={styles["cardValue"]}>4.8/5</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className={styles["trustBadge"]}>
                <span className={styles["trustIcon"]}>✓</span>
                <span className={styles["trustText"]}>Trusted by 10,000+ families</span>
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
              Explore Services →
            </Link>
          </div>
        </div>

        {/* Interactive Services Grid */}
        <div className={styles["servicesGrid"]}>
          <h4 className={styles["gridTitle"]}>All Our Services</h4>
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
                  aria-label={`Go to ${service.title} service page`}
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
          <Link to="/services" className={styles["viewAllButton"]}>
            View all
          </Link>
        </div>

      </div>
    </div>
  </section>

  </>
}

export default Cards;