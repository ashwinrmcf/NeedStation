import styles from './Cards.module.css';
import { useState } from 'react';

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
      icon: "👨‍⚕️",
      subcategories: [
        { name: "Companionship", icon: "👥" },
        { name: "Medication Reminders", icon: "💊" },
        { name: "Meal Preparation", icon: "🍽️" },
        { name: "Mobility Assistance", icon: "🚶" }
      ]
    },
    {
      image: nursingImage,
      title: "Nursing Care",
      description: "Professional nursing services with qualified nurses for medical care at home.",
      link: "/services/nursing-care",
      alt: "Nursing Care",
      category: "Medical Care",
      icon: "🏥",
      subcategories: [
        { name: "Medication Administration", icon: "💉" },
        { name: "Wound Dressing", icon: "🩹" },
        { name: "IV Therapy", icon: "💧" },
        { name: "Vital Monitoring", icon: "📊" }
      ]
    },
    {
      image: caregiverImage,
      title: "Caretaker at Home",
      description: "Dedicated caretakers providing personalized assistance and companionship at home.",
      link: "/services/caretaker-at-home",
      alt: "Caretaker at Home",
      category: "Personal Care",
      icon: "👥",
      subcategories: [
        { name: "Daily Activities Support", icon: "🏠" },
        { name: "Personal Hygiene", icon: "🛁" },
        { name: "Light Housekeeping", icon: "🧹" },
        { name: "Companionship", icon: "💬" }
      ]
    },
    {
      image: bedriddenImage,
      title: "Bedridden Patient Care",
      description: "Comprehensive bedridden care with daily assistance and medical support.",
      link: "/services/bedridden-patient-care",
      alt: "Bedridden Patient Care",
      category: "Specialized Care",
      icon: "🏠",
      subcategories: [
        { name: "Personal Hygiene", icon: "🛁" },
        { name: "Positioning Care", icon: "🔄" },
        { name: "Wound Care", icon: "🩹" },
        { name: "Emotional Support", icon: "❤️" }
      ]
    },
    {
      image: parkinsonsImage,
      title: "Parkinsons Care",
      description: "Specialized care and support for patients with Parkinson's disease and their families.",
      link: "/services/parkinsons-care",
      alt: "Parkinsons Care",
      category: "Specialized Care",
      icon: "⚕️",
      subcategories: [
        { name: "Medication Management", icon: "💊" },
        { name: "Mobility Support", icon: "🚶" },
        { name: "Speech Therapy", icon: "🗣️" },
        { name: "Exercise Assistance", icon: "🏃" }
      ]
    },
    {
      image: physiotherapyImage,
      title: "Physiotherapy",
      description: "Professional physiotherapy services for rehabilitation and pain management at home.",
      link: "/services/physiotherapy",
      alt: "Physiotherapy",
      category: "Rehabilitation",
      icon: "💪",
      subcategories: [
        { name: "Pain Management", icon: "💆" },
        { name: "Mobility Training", icon: "🚶" },
        { name: "Strength Building", icon: "💪" },
        { name: "Post-Injury Recovery", icon: "🩹" }
      ]
    },
    {
      image: securityImage,
      title: "Home Security Guard",
      description: "Professional security personnel to protect your home and family with 24/7 vigilance.",
      link: "/services/security-guard",
      alt: "Home Security Guard",
      category: "Security",
      icon: "🔒",
      subcategories: [
        { name: "24/7 Monitoring", icon: "👁️" },
        { name: "Access Control", icon: "🚪" },
        { name: "Emergency Response", icon: "🚨" },
        { name: "Regular Patrols", icon: "🚶" }
      ]
    },
    {
      image: motherBabyImage,
      title: "Mother and Baby Care",
      description: "Postnatal care for mothers and comprehensive newborn care services.",
      link: "/services/mother-baby-care",
      alt: "Mother and Baby Care",
      category: "Maternity Care",
      icon: "👩‍👧‍👦",
      subcategories: [
        { name: "Breastfeeding Support", icon: "🍼" },
        { name: "Newborn Care", icon: "👶" },
        { name: "Mother's Recovery", icon: "💆" },
        { name: "Sleep Training", icon: "😴" }
      ]
    },
    {
      image: paralysisImage,
      title: "Paralysis Care",
      description: "Specialized care and rehabilitation services for patients with paralysis conditions.",
      link: "/services/paralysis-care",
      alt: "Paralysis Care",
      category: "Specialized Care",
      icon: "🩺",
      subcategories: [
        { name: "Physical Therapy", icon: "💪" },
        { name: "Mobility Assistance", icon: "♿" },
        { name: "Daily Living Support", icon: "🏠" },
        { name: "Rehabilitation", icon: "🔄" }
      ]
    },
    {
      image: pathologyImage,
      title: "Pathology Care",
      description: "Home-based pathology services including sample collection and diagnostic tests.",
      link: "/services/pathology-care",
      alt: "Pathology Care",
      category: "Diagnostic",
      icon: "🧪",
      subcategories: [
        { name: "Sample Collection", icon: "💉" },
        { name: "Blood Tests", icon: "🩸" },
        { name: "Diagnostic Reports", icon: "📋" },
        { name: "Home Visit", icon: "🏠" }
      ]
    },
    {
      image: diabetesImage,
      title: "Diabetes Management",
      description: "Comprehensive diabetes care including monitoring, medication management, and lifestyle guidance.",
      link: "/services/diabetes-management",
      alt: "Diabetes Management",
      category: "Health Management",
      icon: "📊",
      subcategories: [
        { name: "Blood Sugar Monitoring", icon: "📈" },
        { name: "Diet Planning", icon: "🥗" },
        { name: "Medication Support", icon: "💊" },
        { name: "Lifestyle Guidance", icon: "🏃" }
      ]
    },
    {
      image: healthCheckImage,
      title: "Health Check Up Services",
      description: "Regular health screenings and comprehensive medical check-ups at your convenience.",
      link: "/services/health-check-up-services",
      alt: "Health Check Up Services",
      category: "Preventive Care",
      icon: "✅",
      subcategories: [
        { name: "Full Body Checkup", icon: "🩺" },
        { name: "Blood Tests", icon: "💉" },
        { name: "ECG & X-Ray", icon: "📊" },
        { name: "Health Reports", icon: "📋" }
      ]
    },
    {
      image: postSurgeryImage,
      title: "Post Surgery Care",
      description: "Specialized post-operative care and recovery support in the comfort of your home.",
      link: "/services/post-surgery-care",
      alt: "Post Surgery Care",
      category: "Recovery Care",
      icon: "🔄",
      subcategories: [
        { name: "Wound Care", icon: "🩹" },
        { name: "Pain Management", icon: "💊" },
        { name: "Mobility Support", icon: "🚶" },
        { name: "Recovery Monitoring", icon: "📊" }
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
                <div className={styles["serviceIconLarge"]}>{allServices[selectedService].icon}</div>
                <div className={styles["headerText"]}>
                  <h4 className={styles["quickTitle"]}>What's Included</h4>
                  <span className={styles["categoryBadge"]}>{allServices[selectedService].category}</span>
                </div>
              </div>
              
              <div className={styles["infoCards"]}>
                {allServices[selectedService].subcategories ? (
                  allServices[selectedService].subcategories.map((sub, idx) => (
                    <div key={idx} className={styles["infoCard"]}>
                      <div className={styles["cardIcon"]}>{sub.icon}</div>
                      <div className={styles["cardContent"]}>
                        <span className={styles["cardValue"]}>{sub.name}</span>
                      </div>
                    </div>
                  ))
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
              Book This Service
            </Link>
          </div>
        </div>

        {/* Interactive Services Grid */}
        <div className={styles["servicesGrid"]}>
          <h4 className={styles["gridTitle"]}>All Our Services</h4>
          <div className={styles["servicesList"]}>
            {allServices.map((service, index) => (
              <Link 
                key={index}
                to={service.link}
                className={`${styles["serviceItem"]} ${index === selectedService ? styles["active"] : ''}`}
                onMouseEnter={() => setSelectedService(index)}
                role="button"
                aria-label={`Go to ${service.title} service page`}
              >
                <div className={styles["serviceIcon"]}>{service.icon}</div>
                <div className={styles["serviceInfo"]}>
                  <h5 className={styles["serviceName"]}>{service.title}</h5>
                  <span className={styles["serviceCategory"]}>{service.category}</span>
                </div>
                <div className={styles["serviceArrow"]}>
                  {index === selectedService ? '▶' : '→'}
                </div>
              </Link>
            ))}
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