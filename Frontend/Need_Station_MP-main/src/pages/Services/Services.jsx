import styles from './Services.module.css';
import { Link } from 'react-router-dom';

import image1 from '../../assets/images/services/security/securityGuard.png';
import image2 from '../../assets/images/services/parkinsonsCare.png';
import image3 from '../../assets/images/services/bedriddenPatient.png';
import image4 from '../../assets/images/services/motherAndBaby.png';
import image5 from '../../assets/images/services/paralysisCare.png';
import image6 from '../../assets/images/services/elderlyCare.png';
import image7 from '../../assets/images/services/nursingCare.png';
import image8 from '../../assets/images/services/pathologyCare.png';
import image9 from '../../assets/images/services/diabetesManagement.png';
import image10 from '../../assets/images/services/healthCheckUp.png';
import image11 from '../../assets/images/services/physiotherapy.png';
import image12 from '../../assets/images/services/medicalCare.png';
import image13 from '../../assets/images/services/homeHealthCare.png';

const Services = () => {
    const services = [
        {
            id: 1,
            title: "Home Security Guard",
            description: "Professional security personnel to protect your home and family with 24/7 vigilance.",
            image: image1,
            link: "/services/security-guard"
        },
        {
            id: 2,
            title: "Parkinsons Care",
            description: "Specialized care and support for patients with Parkinson's disease and their families.",
            image: image2,
            link: "/services/parkinsons-care"
        },
        {
            id: 3,
            title: "Bedridden Patient Care",
            description: "Comprehensive bedridden care with daily assistance and medical support.",
            image: image3,
            link: "/services/bedridden-patient-care"
        },
        {
            id: 4,
            title: "Mother and Baby Care",
            description: "Postnatal care for mothers and comprehensive newborn care services.",
            image: image4,
            link: "/services/mother-baby-care"
        },
        {
            id: 5,
            title: "Paralysis Care",
            description: "Specialized care and rehabilitation services for patients with paralysis conditions.",
            image: image5,
            link: "/services/paralysis-care"
        },
        {
            id: 6,
            title: "Elderly Care",
            description: "Compassionate and professional care tailored to meet the needs of seniors.",
            image: image6,
            link: "/services/elderly-care"
        },
        {
            id: 7,
            title: "Nursing Care",
            description: "Professional nursing services with qualified nurses for medical care at home.",
            image: image7,
            link: "/services/nursing-care"
        },
        {
            id: 8,
            title: "Pathology Care",
            description: "Home-based pathology services including sample collection and diagnostic tests.",
            image: image8,
            link: "/services/pathology-care"
        },
        {
            id: 9,
            title: "Diabetes Management",
            description: "Comprehensive diabetes care including monitoring, medication management, and lifestyle guidance.",
            image: image9,
            link: "/services/diabetes-management"
        },
        {
            id: 10,
            title: "Health Check Up Services",
            description: "Regular health screenings and comprehensive medical check-ups at your convenience.",
            image: image10,
            link: "/services/health-check-up-services"
        },
        {
            id: 11,
            title: "Physiotherapy",
            description: "Professional physiotherapy services for rehabilitation and pain management at home.",
            image: image11,
            link: "/services/physiotherapy"
        },
        {
            id: 12,
            title: "Post Surgery Care",
            description: "Specialized post-operative care and recovery support in the comfort of your home.",
            image: image12,
            link: "/services/post-surgery-care"
        },
        {
            id: 13,
            title: "Caretaker at Home",
            description: "Dedicated caretakers providing personalized assistance and companionship at home.",
            image: image13,
            link: "/services/caretaker-at-home"
        }
    ];

    return (
        <section className={`py-5 ${styles["section"]}`}>
            <div className="container">
                <h2 className={`text-center mb-4 ${styles["heading"]}`}>Our Services</h2>
                <div className={styles["servicesGrid"]}>
                    {services.map((service) => (
                        <div key={service.id} className={styles["serviceCard"]}>
                            <img 
                                src={service.image} 
                                className={`card-img-top ${styles["cardImage"]}`} 
                                alt={service.title}
                            />
                            <div className="card-body">
                                <h5 className={`card-title ${styles["cardTitle"]}`}>{service.title}</h5>
                                <p className={`card-text ${styles["cardBody"]}`}>{service.description}</p>
                                <Link to={service.link} className={`btn btn-primary ${styles["cardButton"]}`}>
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;