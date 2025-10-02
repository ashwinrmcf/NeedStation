import React from 'react';
import styles from './ServiceDetailModal.module.css';
import { X, Shield, Clock, Star, CheckCircle, Phone, MessageCircle, Heart, Calendar } from 'lucide-react';

const ServiceDetailModal = ({ isOpen, onClose, service }) => {
  if (!isOpen || !service) return null;

  // Sample data for Home Security Guard service
  const securityGuardData = {
    title: "Home Security Guard",
    category: "Security Services",
    rating: 4.8,
    reviews: 1247,
    startingPrice: "₹800",
    duration: "8-24 hours",
    availability: "24/7",
    image: "/src/assets/images/services/realservices/se.png",
    
    overview: "Professional security personnel to protect your home and family with 24/7 vigilance. Our trained security guards provide comprehensive home protection services including perimeter monitoring, access control, and emergency response.",
    
    benefits: [
      "24/7 Professional Surveillance",
      "Trained & Background Verified Guards",
      "Emergency Response Protocol",
      "Access Control Management",
      "Incident Reporting & Documentation",
      "Family Safety Assurance"
    ],
    
    pricing: [
      { duration: "8 Hours (Day Shift)", price: "₹800", popular: false },
      { duration: "12 Hours (Extended)", price: "₹1,200", popular: true },
      { duration: "24 Hours (Full Day)", price: "₹2,000", popular: false }
    ],
    
    qualifications: [
      "Licensed Security Personnel",
      "Police Verification Completed",
      "First Aid & CPR Certified",
      "Professional Training Certificate",
      "Background Check Cleared",
      "Experience: 3+ Years"
    ],
    
    process: [
      { step: 1, title: "Book Service", desc: "Select your preferred time slot and requirements" },
      { step: 2, title: "Guard Assignment", desc: "We assign a qualified security guard to your location" },
      { step: 3, title: "Briefing Session", desc: "Guard receives detailed briefing about your property" },
      { step: 4, title: "Service Begins", desc: "Professional security service starts as scheduled" },
      { step: 5, title: "Regular Updates", desc: "Receive regular reports and updates on security status" }
    ],
    
    testimonials: [
      {
        name: "Rajesh Kumar",
        rating: 5,
        comment: "Excellent service! The security guard was very professional and made us feel completely safe.",
        location: "Bangalore"
      },
      {
        name: "Priya Sharma",
        rating: 5,
        comment: "Highly recommend! Our guard was punctual, alert, and very courteous with the family.",
        location: "Mumbai"
      },
      {
        name: "Amit Patel",
        rating: 4,
        comment: "Great peace of mind knowing our home is protected. Professional and reliable service.",
        location: "Delhi"
      }
    ],
    
    faqs: [
      {
        question: "Are the security guards armed?",
        answer: "Our guards are unarmed but trained in professional security protocols and emergency response procedures."
      },
      {
        question: "What happens during emergencies?",
        answer: "Guards are trained to handle emergencies, contact authorities immediately, and follow established emergency protocols."
      },
      {
        question: "Can I request the same guard regularly?",
        answer: "Yes, you can request the same guard for regular bookings based on availability and performance."
      }
    ]
  };

  const handleBookNow = () => {
    // Navigate to booking page
    window.location.href = '/services/security-guard';
  };

  const handleGetQuote = () => {
    // Open quote form or navigate to quote page
    alert('Quote request functionality - to be implemented');
  };

  const handleCallConsultation = () => {
    // Open call booking or direct call
    window.open('tel:+911234567890');
  };

  const handleAddToFavorites = () => {
    // Add to favorites functionality
    alert('Added to favorites!');
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.serviceIcon}>
              <Shield size={24} />
            </div>
            <div className={styles.headerInfo}>
              <h2 className={styles.serviceTitle}>{securityGuardData.title}</h2>
              <div className={styles.serviceMeta}>
                <span className={styles.category}>{securityGuardData.category}</span>
                <div className={styles.rating}>
                  <Star size={16} fill="currentColor" />
                  <span>{securityGuardData.rating}</span>
                  <span className={styles.reviews}>({securityGuardData.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.modalBody}>
          {/* Service Image & Quick Info */}
          <div className={styles.serviceOverview}>
            <div className={styles.serviceImage}>
              <img src={securityGuardData.image} alt={securityGuardData.title} />
              <div className={styles.priceTag}>
                Starting {securityGuardData.startingPrice}/day
              </div>
            </div>
            
            <div className={styles.quickInfo}>
              <div className={styles.infoCard}>
                <Clock size={20} />
                <div>
                  <span className={styles.infoLabel}>Duration</span>
                  <span className={styles.infoValue}>{securityGuardData.duration}</span>
                </div>
              </div>
              <div className={styles.infoCard}>
                <Shield size={20} />
                <div>
                  <span className={styles.infoLabel}>Availability</span>
                  <span className={styles.infoValue}>{securityGuardData.availability}</span>
                </div>
              </div>
              <div className={styles.infoCard}>
                <CheckCircle size={20} />
                <div>
                  <span className={styles.infoLabel}>Verification</span>
                  <span className={styles.infoValue}>Background Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Description */}
          <div className={styles.section}>
            <h3>Service Overview</h3>
            <p className={styles.description}>{securityGuardData.overview}</p>
          </div>

          {/* Benefits */}
          <div className={styles.section}>
            <h3>Key Benefits</h3>
            <div className={styles.benefitsList}>
              {securityGuardData.benefits.map((benefit, index) => (
                <div key={index} className={styles.benefitItem}>
                  <CheckCircle size={16} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className={styles.section}>
            <h3>Pricing Options</h3>
            <div className={styles.pricingCards}>
              {securityGuardData.pricing.map((option, index) => (
                <div key={index} className={`${styles.pricingCard} ${option.popular ? styles.popular : ''}`}>
                  {option.popular && <div className={styles.popularBadge}>Most Popular</div>}
                  <div className={styles.pricingDuration}>{option.duration}</div>
                  <div className={styles.pricingPrice}>{option.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Qualifications */}
          <div className={styles.section}>
            <h3>Guard Qualifications</h3>
            <div className={styles.qualificationsList}>
              {securityGuardData.qualifications.map((qualification, index) => (
                <div key={index} className={styles.qualificationItem}>
                  <CheckCircle size={16} />
                  <span>{qualification}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Process */}
          <div className={styles.section}>
            <h3>How It Works</h3>
            <div className={styles.processList}>
              {securityGuardData.process.map((step, index) => (
                <div key={index} className={styles.processStep}>
                  <div className={styles.stepNumber}>{step.step}</div>
                  <div className={styles.stepContent}>
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className={styles.section}>
            <h3>Customer Reviews</h3>
            <div className={styles.testimonialsList}>
              {securityGuardData.testimonials.map((testimonial, index) => (
                <div key={index} className={styles.testimonialCard}>
                  <div className={styles.testimonialHeader}>
                    <div className={styles.customerInfo}>
                      <span className={styles.customerName}>{testimonial.name}</span>
                      <span className={styles.customerLocation}>{testimonial.location}</span>
                    </div>
                    <div className={styles.testimonialRating}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className={styles.testimonialComment}>{testimonial.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className={styles.section}>
            <h3>Frequently Asked Questions</h3>
            <div className={styles.faqsList}>
              {securityGuardData.faqs.map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <h4 className={styles.faqQuestion}>{faq.question}</h4>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={styles.modalFooter}>
          <div className={styles.trustIndicators}>
            <div className={styles.trustItem}>
              <Shield size={16} />
              <span>100% Verified</span>
            </div>
            <div className={styles.trustItem}>
              <CheckCircle size={16} />
              <span>Insured Service</span>
            </div>
            <div className={styles.trustItem}>
              <Clock size={16} />
              <span>24/7 Support</span>
            </div>
          </div>
          
          <div className={styles.actionButtons}>
            <button className={styles.secondaryButton} onClick={handleAddToFavorites}>
              <Heart size={18} />
              Save
            </button>
            <button className={styles.secondaryButton} onClick={handleGetQuote}>
              <MessageCircle size={18} />
              Get Quote
            </button>
            <button className={styles.secondaryButton} onClick={handleCallConsultation}>
              <Phone size={18} />
              Call Now
            </button>
            <button className={styles.primaryButton} onClick={handleBookNow}>
              <Calendar size={18} />
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal;
