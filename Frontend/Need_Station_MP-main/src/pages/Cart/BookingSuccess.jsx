import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Home, FileText, ArrowRight, Calendar, MapPin, Phone } from 'lucide-react';
import styles from './BookingSuccess.module.css';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId, amount, services } = location.state || {};

  useEffect(() => {
    // Redirect if no booking data
    if (!bookingId) {
      navigate('/');
    }
  }, [bookingId, navigate]);

  if (!bookingId) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className={styles.successIcon}
        >
          <CheckCircle2 className="w-20 h-20" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={styles.title}
        >
          Booking Confirmed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={styles.subtitle}
        >
          Your healthcare service has been successfully booked
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={styles.bookingCard}
        >
          <div className={styles.bookingHeader}>
            <h3>Booking Details</h3>
            <span className={styles.bookingId}>#{bookingId}</span>
          </div>

          <div className={styles.bookingInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Amount Paid</span>
              <span className={styles.value}>₹{amount?.toLocaleString()}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Services Booked</span>
              <span className={styles.value}>{services?.length || 0}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Status</span>
              <span className={`${styles.value} ${styles.confirmed}`}>Confirmed</span>
            </div>
          </div>

          {services && services.length > 0 && (
            <div className={styles.servicesList}>
              <h4>Your Services</h4>
              {services.map((service, index) => (
                <div key={index} className={styles.serviceItem}>
                  <div className={styles.serviceName}>{service.name}</div>
                  <div className={styles.serviceQty}>Qty: {service.quantity}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={styles.nextSteps}
        >
          <h3>What's Next?</h3>
          <div className={styles.steps}>
            <div className={styles.step}>
              <Calendar className="w-5 h-5" />
              <div>
                <strong>Confirmation Call</strong>
                <p>Our team will call you within 30 minutes to confirm details</p>
              </div>
            </div>
            <div className={styles.step}>
              <MapPin className="w-5 h-5" />
              <div>
                <strong>Service Assignment</strong>
                <p>We'll assign the best professional for your needs</p>
              </div>
            </div>
            <div className={styles.step}>
              <Phone className="w-5 h-5" />
              <div>
                <strong>Stay Connected</strong>
                <p>Track your booking status in real-time</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={styles.actions}
        >
          <button onClick={() => navigate('/my-bookings')} className={styles.primaryButton}>
            <FileText className="w-5 h-5" />
            View My Bookings
            <ArrowRight className="w-5 h-5" />
          </button>

          <button onClick={() => navigate('/')} className={styles.secondaryButton}>
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingSuccess;
