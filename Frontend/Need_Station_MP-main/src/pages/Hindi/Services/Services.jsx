import styles from '../../Services/Services.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../store/AuthContext';
import { useCart } from '../../../store/CartContext';

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

const HindiServices = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart, cartItems } = useCart();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedService, setExpandedService] = useState(null);
    const [modalService, setModalService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bottomSheetService, setBottomSheetService] = useState(null);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    // Detect mobile screen
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const openModal = (service) => {
        setModalService(service);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setModalService(null);
        setIsModalOpen(false);
    };
    
    const openBottomSheet = (service) => {
        setBottomSheetService(service);
        setIsBottomSheetOpen(true);
        document.body.style.overflow = 'hidden';
    };
    
    const closeBottomSheet = () => {
        setBottomSheetService(null);
        setIsBottomSheetOpen(false);
        document.body.style.overflow = 'auto';
    };
    
    const handleCardClick = (service) => {
        if (isMobile) {
            openBottomSheet(service);
        } else {
            openModal(service);
        }
    };

    const handleBookService = (service) => {
        navigate(service.link);
    };
    
    const handleAddToCart = (service) => {
        addToCart({
            id: service.id,
            title: service.title,
            price: service.price,
            image: service.image,
            duration: service.duration
        });
        if (isMobile) {
            closeBottomSheet();
        }
    };

    const services = [
        {
            id: 1,
            title: "होम सिक्योरिटी गार्ड",
            description: "24/7 सतर्कता के साथ आपके घर और परिवार की सुरक्षा के लिए पेशेवर सुरक्षा कर्मी।",
            detailedDescription: "हमारे प्रशिक्षित सुरक्षा पेशेवर परिधि निगरानी, पहुंच नियंत्रण, आपातकालीन प्रतिक्रिया और नियमित गश्ती कर्तव्यों सहित व्यापक घर सुरक्षा सेवाएं प्रदान करते हैं। पृष्ठभूमि-सत्यापित कर्मियों के साथ 24/7 उपलब्ध।",
            image: securityImage,
            link: "/services/security-guard",
            category: "security",
            icon: "",
            price: "₹800-1200/दिन",
            duration: "8-24 घंटे",
            availability: "24/7",
            features: ["पृष्ठभूमि सत्यापित", "24/7 निगरानी", "आपातकालीन प्रतिक्रिया", "नियमित गश्त", "पहुंच नियंत्रण"]
        },
        {
            id: 2,
            title: "पार्किंसंस केयर",
            description: "पार्किंसंस रोग के रोगियों और उनके परिवारों के लिए विशेष देखभाल और सहायता।",
            detailedDescription: "दवा प्रबंधन, गतिशीलता सहायता, भाषण चिकित्सा सहायता और विशेष व्यायाम सहित व्यापक पार्किंसंस देखभाल। हमारे प्रशिक्षित देखभालकर्ता पार्किंसंस रोग की अनूठी चुनौतियों को समझते हैं।",
            image: parkinsonsImage,
            link: "/services/parkinsons-care",
            category: "specialized",
            icon: "",
            price: "₹1500-2500/दिन",
            duration: "4-12 घंटे",
            availability: "दैनिक",
            features: ["दवा प्रबंधन", "गतिशीलता सहायता", "भाषण चिकित्सा", "व्यायाम सहायता", "परिवार प्रशिक्षण"]
        },
        {
            id: 3,
            title: "बेडरिडन पेशेंट केयर",
            description: "दैनिक सहायता और चिकित्सा सहायता के साथ व्यापक बिस्तर पर पड़े रोगी की देखभाल।",
            detailedDescription: "व्यक्तिगत स्वच्छता, स्थिति बदलना, घाव की देखभाल, दवा प्रशासन और भावनात्मक समर्थन सहित बिस्तर पर पड़े रोगियों के लिए पूर्ण देखभाल। हमारे देखभालकर्ता जटिल चिकित्सा आवश्यकताओं को संभालने में प्रशिक्षित हैं।",
            image: bedriddenImage,
            link: "/services/bedridden-patient-care",
            category: "medical",
            icon: "",
            price: "₹1200-2000/दिन",
            duration: "8-24 घंटे",
            availability: "24/7",
            features: ["व्यक्तिगत स्वच्छता", "घाव की देखभाल", "दवा सहायता", "स्थिति देखभाल", "भावनात्मक समर्थन"]
        },
        {
            id: 4,
            title: "मदर एंड बेबी केयर",
            description: "माताओं के लिए प्रसवोत्तर देखभाल और व्यापक नवजात शिशु देखभाल सेवाएं।",
            detailedDescription: "स्तनपान सहायता, नवजात शिशु की देखभाल, मां की रिकवरी सहायता, नींद प्रशिक्षण और पोषण मार्गदर्शन सहित विशेषज्ञ प्रसवोत्तर देखभाल। हमारे प्रमाणित देखभालकर्ता मां और बच्चे दोनों की भलाई सुनिश्चित करते हैं।",
            image: motherBabyImage,
            link: "/services/mother-baby-care",
            category: "maternity",
            icon: "",
            price: "₹1000-1800/दिन",
            duration: "8-24 घंटे",
            availability: "24/7",
            features: ["स्तनपान सहायता", "नवजात शिशु देखभाल", "रिकवरी सहायता", "नींद प्रशिक्षण", "पोषण मार्गदर्शन"]
        },
        {
            id: 5,
            title: "पैरालिसिस केयर",
            description: "लकवाग्रस्त स्थितियों वाले रोगियों के लिए विशेष देखभाल और पुनर्वास सेवाएं।",
            detailedDescription: "फिजियोथेरेपी सहायता, गतिशीलता सहायता, दैनिक जीवन गतिविधियां, दबाव घाव रोकथाम और पुनर्वास व्यायाम सहित व्यापक लकवा देखभाल। विभिन्न प्रकार के लकवे के लिए विशेष प्रशिक्षण।",
            image: paralysisImage,
            link: "/services/paralysis-care",
            category: "specialized",
            icon: "",
            price: "₹1400-2200/दिन",
            duration: "6-12 घंटे",
            availability: "दैनिक",
            features: ["फिजियोथेरेपी सहायता", "गतिशीलता सहायता", "दैनिक जीवन सहायता", "दबाव घाव रोकथाम", "पुनर्वास व्यायाम"]
        },
        {
            id: 6,
            title: "एल्डरली केयर",
            description: "वरिष्ठ नागरिकों की जरूरतों को पूरा करने के लिए दयालु और पेशेवर देखभाल।",
            detailedDescription: "साहचर्य, दवा अनुस्मारक, भोजन तैयारी, हल्की गृहकार्य, गतिशीलता सहायता और स्वास्थ्य निगरानी सहित व्यापक बुजुर्ग देखभाल। हमारे देखभालकर्ता वरिष्ठों के लिए सम्मानजनक, सम्मानपूर्ण देखभाल प्रदान करते हैं।",
            image: elderlyCareImage,
            link: "/services/elderly-care",
            category: "elderly",
            icon: "",
            price: "₹900-1600/दिन",
            duration: "4-24 घंटे",
            availability: "24/7",
            features: ["साहचर्य", "दवा अनुस्मारक", "भोजन तैयारी", "गतिशीलता सहायता", "स्वास्थ्य निगरानी"]
        },
        {
            id: 7,
            title: "नर्सिंग केयर",
            description: "घर पर चिकित्सा देखभाल के लिए योग्य नर्सों के साथ पेशेवर नर्सिंग सेवाएं।",
            detailedDescription: "दवा प्रशासन, घाव ड्रेसिंग, IV थेरेपी, कैथेटर देखभाल, महत्वपूर्ण संकेत निगरानी और चिकित्सा उपकरण प्रबंधन सहित लाइसेंस प्राप्त नर्सिंग देखभाल। सभी नर्स प्रमाणित और अनुभवी हैं।",
            image: nursingImage,
            link: "/services/nursing-care",
            category: "medical",
            icon: "",
            price: "₹2000-3500/दिन",
            duration: "8-24 घंटे",
            availability: "24/7",
            features: ["दवा प्रशासन", "घाव देखभाल", "IV थेरेपी", "कैथेटर देखभाल", "महत्वपूर्ण निगरानी"]
        },
        {
            id: 8,
            title: "पैथोलॉजी केयर",
            description: "नमूना संग्रह और नैदानिक परीक्षणों सहित घर-आधारित पैथोलॉजी सेवाएं।",
            detailedDescription: "रक्त संग्रह, मूत्र परीक्षण, ECG, बुनियादी नैदानिक प्रक्रियाएं और प्रमाणित प्रयोगशालाओं में नमूना परिवहन सहित व्यापक घर पैथोलॉजी सेवाएं। डिजिटल रूप से वितरित त्वरित और सटीक परिणाम।",
            image: pathologyImage,
            link: "/services/pathology-care",
            category: "diagnostic",
            icon: "",
            price: "₹300-800/विज़िट",
            duration: "30-60 मिनट",
            availability: "सुबह 7 - शाम 7",
            features: ["रक्त संग्रह", "मूत्र परीक्षण", "ECG सेवाएं", "लैब परिवहन", "डिजिटल रिपोर्ट"]
        },
        {
            id: 9,
            title: "डायबिटीज मैनेजमेंट",
            description: "निगरानी, दवा प्रबंधन और जीवनशैली मार्गदर्शन सहित व्यापक मधुमेह देखभाल।",
            detailedDescription: "रक्त शर्करा निगरानी, इंसुलिन प्रशासन, आहार योजना, व्यायाम मार्गदर्शन, पैर की देखभाल और नियमित स्वास्थ्य मूल्यांकन सहित पूर्ण मधुमेह प्रबंधन। टाइप 1 और टाइप 2 मधुमेह के लिए व्यक्तिगत देखभाल योजनाएं।",
            image: diabetesImage,
            link: "/services/diabetes-management",
            category: "health",
            icon: "",
            price: "₹800-1400/दिन",
            duration: "2-8 घंटे",
            availability: "दैनिक",
            features: ["रक्त शर्करा निगरानी", "इंसुलिन प्रशासन", "आहार योजना", "व्यायाम मार्गदर्शन", "पैर की देखभाल"]
        },
        {
            id: 10,
            title: "हेल्थ चेकअप सर्विसेज",
            description: "आपकी सुविधा पर नियमित स्वास्थ्य जांच और व्यापक चिकित्सा जांच।",
            detailedDescription: "महत्वपूर्ण संकेत, बुनियादी परीक्षण, स्वास्थ्य मूल्यांकन, निवारक देखभाल मार्गदर्शन और स्वास्थ्य सेवा प्रदाताओं के साथ समन्वय सहित व्यापक स्वास्थ्य जांच। पुरानी स्थितियों के लिए नियमित निगरानी।",
            image: healthCheckImage,
            link: "/services/health-check-up-services",
            category: "preventive",
            icon: "",
            price: "₹500-1200/विज़िट",
            duration: "1-2 घंटे",
            availability: "सुबह 9 - शाम 6",
            features: ["महत्वपूर्ण संकेत जांच", "बुनियादी परीक्षण", "स्वास्थ्य मूल्यांकन", "निवारक मार्गदर्शन", "प्रदाता समन्वय"]
        },
        {
            id: 11,
            title: "फिजियोथेरेपी",
            description: "घर पर पुनर्वास और दर्द प्रबंधन के लिए पेशेवर फिजियोथेरेपी सेवाएं।",
            detailedDescription: "गति चिकित्सा, दर्द प्रबंधन, सर्जरी के बाद पुनर्वास, शक्ति प्रशिक्षण और गतिशीलता सुधार सहित लाइसेंस प्राप्त फिजियोथेरेपी सेवाएं। विभिन्न स्थितियों के लिए अनुकूलित उपचार योजनाएं।",
            image: physiotherapyImage,
            link: "/services/physiotherapy",
            category: "rehabilitation",
            icon: "",
            price: "₹600-1000/सत्र",
            duration: "45-90 मिनट",
            availability: "सुबह 9 - शाम 7",
            features: ["गति चिकित्सा", "दर्द प्रबंधन", "सर्जरी के बाद पुनर्वास", "शक्ति प्रशिक्षण", "गतिशीलता सुधार"]
        },
        {
            id: 12,
            title: "पोस्ट सर्जरी केयर",
            description: "आपके घर की सुविधा में विशेष पोस्ट-ऑपरेटिव देखभाल और रिकवरी सहायता।",
            detailedDescription: "घाव प्रबंधन, दवा प्रशासन, गतिशीलता सहायता, रिकवरी निगरानी और सर्जिकल टीमों के साथ समन्वय सहित विशेषज्ञ पोस्ट-सर्जिकल देखभाल। विभिन्न सर्जरी प्रकारों के लिए विशेष देखभाल।",
            image: postSurgeryImage,
            link: "/services/post-surgery-care",
            category: "recovery",
            icon: "",
            price: "₹1500-2800/दिन",
            duration: "8-24 घंटे",
            availability: "24/7",
            features: ["घाव प्रबंधन", "दवा सहायता", "गतिशीलता सहायता", "रिकवरी निगरानी", "टीम समन्वय"]
        },
        {
            id: 13,
            title: "केयरटेकर एट होम",
            description: "घर पर व्यक्तिगत सहायता और साहचर्य प्रदान करने वाले समर्पित देखभालकर्ता।",
            detailedDescription: "व्यक्तिगत देखभाल, साहचर्य, हल्की गृहकार्य, भोजन तैयारी, दवा अनुस्मारक और भावनात्मक समर्थन सहित दयालु देखभाल सेवाएं। व्यक्तिगत जरूरतों को पूरा करने के लिए लचीली शेड्यूलिंग।",
            image: caregiverImage,
            link: "/services/caretaker-at-home",
            category: "personal",
            icon: "",
            price: "₹700-1300/दिन",
            duration: "4-24 घंटे",
            availability: "24/7",
            features: ["व्यक्तिगत देखभाल", "साहचर्य", "हल्की गृहकार्य", "भोजन तैयारी", "भावनात्मक समर्थन"]
        }
    ];

    const categories = [
        { id: 'all', name: 'सभी सेवाएं', count: services.length },
        { id: 'elderly', name: 'बुजुर्ग देखभाल', count: services.filter(s => s.category === 'elderly').length },
        { id: 'medical', name: 'चिकित्सा देखभाल', count: services.filter(s => s.category === 'medical').length },
        { id: 'specialized', name: 'विशेष देखभाल', count: services.filter(s => s.category === 'specialized').length },
        { id: 'rehabilitation', name: 'पुनर्वास', count: services.filter(s => s.category === 'rehabilitation').length },
        { id: 'diagnostic', name: 'नैदानिक', count: services.filter(s => s.category === 'diagnostic').length }
    ];

    const filteredServices = selectedCategory === 'all' 
        ? services 
        : services.filter(service => service.category === selectedCategory);

    return (
        <section className={`py-5 ${styles["section"]}`}>
            <div className="container">
                {/* Attractive Header */}
                <div className={styles["attractiveHeader"]}>
                    <h2 className={styles["mainTitle"]}>हमारी सेवाएं</h2>
                    <p className={styles["subtitle"]}>आपकी जरूरतों के अनुरूप पेशेवर स्वास्थ्य सेवा समाधान</p>
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

                {/* Services Display */}
                <div className={styles["detailedGrid"]}>
                    {filteredServices.map((service) => (
                        <div 
                            key={service.id} 
                            className={styles["detailedCard"]}
                        >
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
                                    </div>
                                    
                                    <p className={styles["serviceDesc"]}>{service.detailedDescription}</p>
                                    
                                    <div className={styles["serviceDetails"]}>
                                        <div className={styles["detailRow"]}>
                                            <span>अवधि:</span>
                                            <span>{service.duration}</span>
                                        </div>
                                        <div className={styles["detailRow"]}>
                                            <span>उपलब्धता:</span>
                                            <span>{service.availability}</span>
                                        </div>
                                    </div>
                                    
                                    <div className={styles["featuresList"]}>
                                        {service.features.slice(0, 3).map((feature, index) => (
                                            <span key={index} className={styles["featureTag"]}>{feature}</span>
                                        ))}
                                        {service.features.length > 3 && (
                                            <span className={styles["moreFeatures"]}>+{service.features.length - 3} और</span>
                                        )}
                                    </div>
                                    
                                    <div className={styles["cardActions"]}>
                                        <button 
                                            onClick={() => handleBookService(service)}
                                            className={styles["bookBtn"]}
                                        >
                                            अभी बुक करें
                                        </button>
                                        <button 
                                            className={styles["infoBtn"]}
                                            onClick={() => openModal(service)}
                                        >
                                            अधिक जानकारी
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
                                            <span className={styles["detailLabel"]}>अवधि:</span>
                                            <span className={styles["detailValue"]}>{modalService.duration}</span>
                                        </div>
                                        <div className={styles["detailItem"]}>
                                            <span className={styles["detailLabel"]}>उपलब्धता:</span>
                                            <span className={styles["detailValue"]}>{modalService.availability}</span>
                                        </div>
                                        <div className={styles["detailItem"]}>
                                            <span className={styles["detailLabel"]}>मूल्य:</span>
                                            <span className={styles["detailValue"]}>{modalService.price}</span>
                                        </div>
                                    </div>
                                    
                                    <div className={styles["modalFeatures"]}>
                                        <h4>मुख्य विशेषताएं:</h4>
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
                                            अभी बुक करें
                                        </button>
                                        <button className={styles["modalCloseBtn"]} onClick={closeModal}>
                                            बंद करें
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

export default HindiServices;
