import styles from './AvailableHelpers.module.css';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import availableHelpersData from '../../data/AvailableHelperData.js';
import { FaStar, FaRupeeSign, FaBriefcase, FaFilter } from 'react-icons/fa';

const AvailableHelpers = () => {
    const location = useLocation();
    const [helpers, setHelpers] = useState([]);
    const [serviceType, setServiceType] = useState('default');
    const [serviceName, setServiceName] = useState('General Service');

    useEffect(() => {
        // Get service information from location state or URL
        const serviceInfo = location.state || {};
        const { service, subService } = serviceInfo;
        
        // Determine service type from URL path or state
        let detectedServiceType = 'default';
        let detectedServiceName = 'General Service';
        
        // Prefer serviceType from navigation state if available
        if (serviceInfo.serviceType) {
            detectedServiceType = serviceInfo.serviceType;
            detectedServiceName = service || 'General Service';
        } else if (service) {
            detectedServiceType = service.toLowerCase().replace(/\s+/g, '-');
            detectedServiceName = service;
            // Handle specific maid service sub-categories
            if (service.toLowerCase().includes('cooking')) {
                detectedServiceType = 'cooking';
                detectedServiceName = 'Cooking';
            } else if (service.toLowerCase().includes('cleaning')) {
                detectedServiceType = 'cleaning';
                detectedServiceName = 'Cleaning';
            } else if (service.toLowerCase().includes('laundry')) {
                detectedServiceType = 'laundry';
                detectedServiceName = 'Laundry';
            } else if (service.toLowerCase() === 'cooking assistance') {
                detectedServiceType = 'cooking';
                detectedServiceName = 'Cooking';
            } else if (service.toLowerCase() === 'cleaning services') {
                detectedServiceType = 'cleaning';
                detectedServiceName = 'Cleaning';
            } else if (service.toLowerCase() === 'laundry services') {
                detectedServiceType = 'laundry';
                detectedServiceName = 'Laundry';
            }
        } else {
            // Try to detect from URL path
            const path = location.pathname;
            if (path.includes('electrician')) {
                detectedServiceType = 'electrician';
                detectedServiceName = 'Electrician';
            } else if (path.includes('plumber')) {
                detectedServiceType = 'plumber';
                detectedServiceName = 'Plumber';
            } else if (path.includes('water-supply')) {
                detectedServiceType = 'water-supply';
                detectedServiceName = 'Water Supply';
            } else if (path.includes('nurse')) {
                detectedServiceType = 'nurse';
                detectedServiceName = 'Nurse';
            } else if (path.includes('caretaker')) {
                detectedServiceType = 'caretaker';
                detectedServiceName = 'Caretaker';
            } else if (path.includes('babysitter')) {
                detectedServiceType = 'babysitter';
                detectedServiceName = 'Babysitter';
            } else if (path.includes('maid')) {
                detectedServiceType = 'maid-services';
                detectedServiceName = 'Maid Services';
            }
        }
        
        console.log('Service from state:', service);
        console.log('Service type from state:', serviceInfo.serviceType);
        console.log('Detected service type:', detectedServiceType);
        console.log('Available helpers for service:', availableHelpersData[detectedServiceType] || availableHelpersData.default);
        console.log('All available helper data keys:', Object.keys(availableHelpersData));

        setServiceType(detectedServiceType);
        setServiceName(detectedServiceName);
        setHelpers(availableHelpersData[detectedServiceType] || availableHelpersData.default);
    }, [location]);

    return (
        <div className={styles['container']}>
            <div className={styles["header"]}>
                <Link to="/">
                    <div className={styles["logo"]}>
                        Need<span style={{ color: "#5CE1E6" }}>Station</span>
                    </div>
                </Link>
                <div className={styles["progress-bar"]}>
                    <div className={`${styles["step"]} ${styles["active"]}`}>
                        <div className={styles["circle"]}></div>
                    </div>
                    <div className={styles["line"]}></div>
                    <div className={styles["step"]}>
                        <div className={styles["circle"]}></div>
                    </div>
                    <div className={styles["line1"]}></div>
                    <span className={styles["helper-list"]}>Browse {serviceName} Taskers and Price</span>
                    <div className={styles["line1"]}></div>
                    <div className={styles["step"]}>
                        <div className={styles["circle"]}></div>
                    </div>
                    <div className={styles["line"]}></div>
                    <div className={styles["step"]}>
                        <div className={styles["circle"]}></div>
                    </div>
                </div>
            </div>

            <div className={styles["container2"]}>
                <div className={styles['rectangle']}>
                    {/* Rating Filter Section */}
                    <div className={styles['rating-group']}>
                        <h2>Rating</h2>
                        <select className={styles['filter-dropdown']}>
                            <option value="">All Ratings</option>
                            <option value="4.5">4.5+ Stars</option>
                            <option value="4.0">4.0+ Stars</option>
                            <option value="3.5">3.5+ Stars</option>
                        </select>
                    </div>

                    {/* Price Filter Section */}
                    <div className={styles['price-group']}>
                        <h2>Price Range</h2>
                        <select className={styles['filter-dropdown']}>
                            <option value="">All Prices</option>
                            <option value="200-400">₹200-400/hr</option>
                            <option value="400-600">₹400-600/hr</option>
                            <option value="600-800">₹600-800/hr</option>
                            <option value="800+">₹800+/hr</option>
                        </select>
                    </div>

                    {/* Urgency Filter Section */}
                    <div className={styles['urgency-group']}>
                        <h2>Urgency Level</h2>
                        <select className={styles['filter-dropdown']}>
                            <option value="">All Urgency</option>
                            <option value="normal">Normal</option>
                            <option value="urgent">Urgent</option>
                            <option value="emergency">Emergency</option>
                        </select>
                    </div>
                </div>

                {/* Tasker Profiles */}
                {helpers.map((tasker, index) => (
                    <Link to="/cart" key={tasker.id}>
                        <div className={styles['tasker-profile']}>
                            {/* Profile Section */}
                            <div className={styles['profile-section']}>
                                <div className={styles['profile-image']}>
                                    <img src={tasker.image} alt="Profile Photo" />
                                </div>
                                <p className={styles['profile-link']}>View Profile & reviews</p>
                                <button className={styles['select-button']}>Select and continue</button>
                                <p className={styles['note']}>
                                    You can call your Tasker, adjust task details, or change task time after booking.
                                </p>
                            </div>

                            {/* Info Section */}
                            <div className={styles['info-section']}>
                                <div className={styles['info-header']}>
                                    <h2 className={styles['tasker-name']}>{tasker.name}</h2>
                                    <div className={styles['rate']}>{tasker.rate}</div>
                                </div>
                                <p className={styles['reviews']}>{tasker.reviews}</p>
                                <p className={styles['tasks']}>{tasker.tasks}</p>
                                <p className={styles['experience']}>Experience: {tasker.experience}</p>
                                <div className={styles['help-section']}>
                                    <h3>How can I help:</h3>
                                    <p className={styles['help-description']}>
                                        {tasker.description}
                                        <span className={styles['read-more']}>Read more</span>
                                    </p>
                                    <div className={styles['specialties']}>
                                        <h4>Specialties:</h4>
                                        <ul>
                                            {tasker.specialties.map((specialty, idx) => (
                                                <li key={idx}>{specialty}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AvailableHelpers;
