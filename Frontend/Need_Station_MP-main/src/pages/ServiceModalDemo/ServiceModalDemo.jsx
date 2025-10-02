import React, { useState } from 'react';
import ServiceDetailModal from '../../components/ServiceDetailModal/ServiceDetailModal';
import styles from './ServiceModalDemo.module.css';

const ServiceModalDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const securityGuardService = {
    id: 'security-guard',
    title: 'Home Security Guard',
    category: 'Security Services'
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.demoContainer}>
      <div className={styles.demoContent}>
        <h1 className={styles.demoTitle}>Service Detail Modal Demo</h1>
        <p className={styles.demoDescription}>
          Click the button below to see the comprehensive Service Detail Modal for Home Security Guard service.
        </p>
        
        <div className={styles.serviceCard}>
          <div className={styles.serviceHeader}>
            <div className={styles.serviceIcon}>🛡️</div>
            <div className={styles.serviceInfo}>
              <h3>Home Security Guard</h3>
              <p>Professional security personnel for your home protection</p>
            </div>
          </div>
          
          <div className={styles.serviceActions}>
            <button className={styles.bookButton}>
              Book Now
            </button>
            <button className={styles.moreInfoButton} onClick={openModal}>
              More Info
            </button>
          </div>
        </div>

        <div className={styles.features}>
          <h2>Modal Features Included:</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>📋</span>
              <span>Comprehensive Service Overview</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>💰</span>
              <span>Transparent Pricing Breakdown</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>✅</span>
              <span>Guard Qualifications & Certifications</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>⭐</span>
              <span>Customer Reviews & Testimonials</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>🔄</span>
              <span>Step-by-Step Service Process</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>❓</span>
              <span>Frequently Asked Questions</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>🛡️</span>
              <span>Trust Indicators & Security</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>📞</span>
              <span>Multiple Action Buttons</span>
            </div>
          </div>
        </div>
      </div>

      <ServiceDetailModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        service={securityGuardService}
      />
    </div>
  );
};

export default ServiceModalDemo;
