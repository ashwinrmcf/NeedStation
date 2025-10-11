import styles from './Services.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../store/AuthContext';

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

const Services = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedService, setExpandedService] = useState(null);
    const [modalService, setModalService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Removed viewMode - only using detailed view now

    const openModal = (service) => {
        setModalService(service);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setModalService(null);
        setIsModalOpen(false);
    };

    const handleBookService = (service) => {
        // Check if user is logged in
        if (!user) {
            // Redirect to login page if not logged in
            navigate('/login');
            return;
        }
        
        // Navigate to service page if user is logged in
        navigate(service.link);
    };

    const services = [
        {
            id: 1,
            title: "Home Security Guard",
            description: "Professional security personnel to protect your home and family with 24/7 vigilance.",
            detailedDescription: "Our trained security professionals provide comprehensive home protection services including perimeter monitoring, access control, emergency response, and regular patrol duties. Available 24/7 with background-verified personnel.",
            image: securityImage,
            link: "/services/security-guard",
            category: "security",
            icon: "",
            price: "₹800-1200/day",
            duration: "8-24 hours",
            availability: "24/7",
            features: ["Background Verified", "24/7 Monitoring", "Emergency Response", "Regular Patrols", "Access Control"]
        },
        {
            id: 2,
            title: "Parkinsons Care",
            description: "Specialized care and support for patients with Parkinson's disease and their families.",
            detailedDescription: "Comprehensive Parkinson's care including medication management, mobility assistance, speech therapy support, and specialized exercises. Our trained caregivers understand the unique challenges of Parkinson's disease.",
            image: parkinsonsImage,
            link: "/services/parkinsons-care",
            category: "specialized",
            icon: "",
            price: "₹1500-2500/day",
            duration: "4-12 hours",
            availability: "Daily",
            features: ["Medication Management", "Mobility Support", "Speech Therapy", "Exercise Assistance", "Family Training"]
        },
        {
            id: 3,
            title: "Bedridden Patient Care",
            description: "Comprehensive bedridden care with daily assistance and medical support.",
            detailedDescription: "Complete care for bedridden patients including personal hygiene, positioning, wound care, medication administration, and emotional support. Our caregivers are trained in handling complex medical needs.",
            image: bedriddenImage,
            link: "/services/bedridden-patient-care",
            category: "medical",
            icon: "",
            price: "₹1200-2000/day",
            duration: "8-24 hours",
            availability: "24/7",
            features: ["Personal Hygiene", "Wound Care", "Medication Support", "Positioning Care", "Emotional Support"]
        },
        {
            id: 4,
            title: "Mother and Baby Care",
            description: "Postnatal care for mothers and comprehensive newborn care services.",
            detailedDescription: "Expert postnatal care including breastfeeding support, newborn care, mother's recovery assistance, sleep training, and nutritional guidance. Our certified caregivers ensure both mother and baby's wellbeing.",
            image: motherBabyImage,
            link: "/services/mother-baby-care",
            category: "maternity",
            icon: "",
            price: "₹1000-1800/day",
            duration: "8-24 hours",
            availability: "24/7",
            features: ["Breastfeeding Support", "Newborn Care", "Recovery Assistance", "Sleep Training", "Nutritional Guidance"]
        },
        {
            id: 5,
            title: "Paralysis Care",
            description: "Specialized care and rehabilitation services for patients with paralysis conditions.",
            detailedDescription: "Comprehensive paralysis care including physiotherapy assistance, mobility support, daily living activities, pressure sore prevention, and rehabilitation exercises. Specialized training for different types of paralysis.",
            image: paralysisImage,
            link: "/services/paralysis-care",
            category: "specialized",
            icon: "",
            price: "₹1400-2200/day",
            duration: "6-12 hours",
            availability: "Daily",
            features: ["Physiotherapy Support", "Mobility Assistance", "Daily Living Help", "Pressure Sore Prevention", "Rehabilitation Exercises"]
        },
        {
            id: 6,
            title: "Elderly Care",
            description: "Compassionate and professional care tailored to meet the needs of seniors.",
            detailedDescription: "Comprehensive elderly care including companionship, medication reminders, meal preparation, light housekeeping, mobility assistance, and health monitoring. Our caregivers provide dignified, respectful care for seniors.",
            image: elderlyCareImage,
            link: "/services/elderly-care",
            category: "elderly",
            icon: "",
            price: "₹900-1600/day",
            duration: "4-24 hours",
            availability: "24/7",
            features: ["Companionship", "Medication Reminders", "Meal Preparation", "Mobility Support", "Health Monitoring"]
        },
        {
            id: 7,
            title: "Nursing Care",
            description: "Professional nursing services with qualified nurses for medical care at home.",
            detailedDescription: "Licensed nursing care including medication administration, wound dressing, IV therapy, catheter care, vital sign monitoring, and medical equipment management. All nurses are certified and experienced.",
            image: nursingImage,
            link: "/services/nursing-care",
            category: "medical",
            icon: "",
            price: "₹2000-3500/day",
            duration: "8-24 hours",
            availability: "24/7",
            features: ["Medication Administration", "Wound Care", "IV Therapy", "Catheter Care", "Vital Monitoring"]
        },
        {
            id: 8,
            title: "Pathology Care",
            description: "Home-based pathology services including sample collection and diagnostic tests.",
            detailedDescription: "Comprehensive home pathology services including blood collection, urine tests, ECG, basic diagnostic procedures, and sample transportation to certified labs. Quick and accurate results delivered digitally.",
            image: pathologyImage,
            link: "/services/pathology-care",
            category: "diagnostic",
            icon: "",
            price: "₹300-800/visit",
            duration: "30-60 minutes",
            availability: "7 AM - 7 PM",
            features: ["Blood Collection", "Urine Tests", "ECG Services", "Lab Transportation", "Digital Reports"]
        },
        {
            id: 9,
            title: "Diabetes Management",
            description: "Comprehensive diabetes care including monitoring, medication management, and lifestyle guidance.",
            detailedDescription: "Complete diabetes management including blood sugar monitoring, insulin administration, diet planning, exercise guidance, foot care, and regular health assessments. Personalized care plans for Type 1 and Type 2 diabetes.",
            image: diabetesImage,
            link: "/services/diabetes-management",
            category: "health",
            icon: "",
            price: "₹800-1400/day",
            duration: "2-8 hours",
            availability: "Daily",
            features: ["Blood Sugar Monitoring", "Insulin Administration", "Diet Planning", "Exercise Guidance", "Foot Care"]
        },
        {
            id: 10,
            title: "Health Check Up Services",
            description: "Regular health screenings and comprehensive medical check-ups at your convenience.",
            detailedDescription: "Comprehensive health screenings including vital signs, basic tests, health assessments, preventive care guidance, and coordination with healthcare providers. Regular monitoring for chronic conditions.",
            image: healthCheckImage,
            link: "/services/health-check-up-services",
            category: "preventive",
            icon: "",
            price: "₹500-1200/visit",
            duration: "1-2 hours",
            availability: "9 AM - 6 PM",
            features: ["Vital Signs Check", "Basic Tests", "Health Assessment", "Preventive Guidance", "Provider Coordination"]
        },
        {
            id: 11,
            title: "Physiotherapy",
            description: "Professional physiotherapy services for rehabilitation and pain management at home.",
            detailedDescription: "Licensed physiotherapy services including movement therapy, pain management, post-surgery rehabilitation, strength training, and mobility improvement. Customized treatment plans for various conditions.",
            image: physiotherapyImage,
            link: "/services/physiotherapy",
            category: "rehabilitation",
            icon: "",
            price: "₹600-1000/session",
            duration: "45-90 minutes",
            availability: "9 AM - 7 PM",
            features: ["Movement Therapy", "Pain Management", "Post-Surgery Rehab", "Strength Training", "Mobility Improvement"]
        },
        {
            id: 12,
            title: "Post Surgery Care",
            description: "Specialized post-operative care and recovery support in the comfort of your home.",
            detailedDescription: "Expert post-surgical care including wound management, medication administration, mobility assistance, recovery monitoring, and coordination with surgical teams. Specialized care for different surgery types.",
            image: postSurgeryImage,
            link: "/services/post-surgery-care",
            category: "recovery",
            icon: "",
            price: "₹1500-2800/day",
            duration: "8-24 hours",
            availability: "24/7",
            features: ["Wound Management", "Medication Support", "Mobility Assistance", "Recovery Monitoring", "Team Coordination"]
        },
        {
            id: 13,
            title: "Caretaker at Home",
            description: "Dedicated caretakers providing personalized assistance and companionship at home.",
            detailedDescription: "Compassionate caretaking services including personal care, companionship, light housekeeping, meal preparation, medication reminders, and emotional support. Flexible scheduling to meet individual needs.",
            image: caregiverImage,
            link: "/services/caretaker-at-home",
            category: "personal",
            icon: "",
            price: "₹700-1300/day",
            duration: "4-24 hours",
            availability: "24/7",
            features: ["Personal Care", "Companionship", "Light Housekeeping", "Meal Preparation", "Emotional Support"]
        }
    ];

    const categories = [
        { id: 'all', name: 'All Services', count: services.length },
        { id: 'elderly', name: 'Elder Care', count: services.filter(s => s.category === 'elderly').length },
        { id: 'medical', name: 'Medical Care', count: services.filter(s => s.category === 'medical').length },
        { id: 'specialized', name: 'Specialized Care', count: services.filter(s => s.category === 'specialized').length },
        { id: 'rehabilitation', name: 'Rehabilitation', count: services.filter(s => s.category === 'rehabilitation').length },
        { id: 'diagnostic', name: 'Diagnostic', count: services.filter(s => s.category === 'diagnostic').length }
    ];

    const filteredServices = selectedCategory === 'all' 
        ? services 
        : services.filter(service => service.category === selectedCategory);

    return (
        <section className={`py-5 ${styles["section"]}`}>
            <div className="container">
                {/* Attractive Header */}
                <div className={styles["attractiveHeader"]}>
                    <h2 className={styles["mainTitle"]}>Our Services</h2>
                    <p className={styles["subtitle"]}>Professional healthcare solutions tailored to your needs</p>
                </div>

                {/* Category Filter */}
                <div className={styles["filterPanel"]}>
                    <div className={styles["categoryFilter"]}>
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`${styles["filterBtn"]} ${selectedCategory === category.id ? styles["active"] : ''}`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                {category.name} ({category.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Services Display - Detailed View Only */}
                <div className={styles["detailedGrid"]}>
                    {filteredServices.map((service) => (
                        <div key={service.id} className={styles["detailedCard"]}>
                            <div className={styles["cardImage"]} onClick={() => handleBookService(service)} style={{ cursor: 'pointer' }}>
                                <img src={service.image} alt={service.title} />
                                <div className={styles["imageOverlay"]}>
                                    <span className={styles["categoryBadge"]}>{service.category}</span>
                                    <span className={styles["priceBadge"]}>{service.price}</span>
                                </div>
                            </div>
                            
                            <div className={styles["cardContent"]}>
                                <div className={styles["contentHeader"]}>
                                    <h4 className={styles["serviceTitle"]}>{service.title}</h4>
                                    <div className={styles["serviceIcon"]}>{service.icon}</div>
                                </div>
                                
                                <p className={styles["serviceDesc"]}>{service.detailedDescription}</p>
                                
                                <div className={styles["serviceDetails"]}>
                                    <div className={styles["detailRow"]}>
                                        <span>Duration:</span>
                                        <span>{service.duration}</span>
                                    </div>
                                    <div className={styles["detailRow"]}>
                                        <span>Availability:</span>
                                        <span>{service.availability}</span>
                                    </div>
                                </div>
                                
                                <div className={styles["featuresList"]}>
                                    {service.features.slice(0, 3).map((feature, index) => (
                                        <span key={index} className={styles["featureTag"]}>{feature}</span>
                                    ))}
                                    {service.features.length > 3 && (
                                        <span className={styles["moreFeatures"]}>+{service.features.length - 3} more</span>
                                    )}
                                </div>
                                
                                <div className={styles["cardActions"]}>
                                    <button 
                                        onClick={() => handleBookService(service)}
                                        className={styles["bookBtn"]}
                                    >
                                        Book Now
                                    </button>
                                    <button 
                                        className={styles["infoBtn"]}
                                        onClick={() => openModal(service)}
                                    >
                                        More Info
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                {isModalOpen && modalService && (
                    <div className={styles["modalOverlay"]} onClick={closeModal}>
                        <div className={styles["modalContent"]} onClick={(e) => e.stopPropagation()}>
                            <div className={styles["modalHeader"]}>
                                <h3 className={styles["modalTitle"]}>{modalService.title}</h3>
                                <button className={styles["closeBtn"]} onClick={closeModal}>
                                    ✕
                                </button>
                            </div>
                            
                            <div className={styles["modalBody"]}>
                                <div className={styles["modalImage"]}>
                                    <img src={modalService.image} alt={modalService.title} />
                                </div>
                                
                                <div className={styles["modalInfo"]}>
                                    <p className={styles["modalDescription"]}>
                                        {modalService.detailedDescription}
                                    </p>
                                    
                                    <div className={styles["modalDetails"]}>
                                        <div className={styles["detailItem"]}>
                                            <span className={styles["detailLabel"]}>Duration:</span>
                                            <span className={styles["detailValue"]}>{modalService.duration}</span>
                                        </div>
                                        <div className={styles["detailItem"]}>
                                            <span className={styles["detailLabel"]}>Availability:</span>
                                            <span className={styles["detailValue"]}>{modalService.availability}</span>
                                        </div>
                                        <div className={styles["detailItem"]}>
                                            <span className={styles["detailLabel"]}>Price:</span>
                                            <span className={styles["detailValue"]}>{modalService.price}</span>
                                        </div>
                                    </div>
                                    
                                    <div className={styles["modalFeatures"]}>
                                        <h4>Key Features:</h4>
                                        <ul>
                                            {modalService.features.map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div className={styles["modalActions"]}>
                                        <button 
                                            onClick={() => handleBookService(modalService)}
                                            className={styles["modalBookBtn"]}
                                        >
                                            Book Now
                                        </button>
                                        <button className={styles["modalCloseBtn"]} onClick={closeModal}>
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Services;