import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Home, FileText, ArrowRight, Calendar, MapPin, Phone } from 'lucide-react';
import styles from './BookingSuccess.module.css';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId, bookingIds, amount, services, paymentDetails } = location.state || {};

  useEffect(() => {
    // Redirect if no booking data
    if (!bookingId && !bookingIds) {
      navigate('/');
    }
  }, [bookingId, bookingIds, navigate]);

  if (!bookingId && !bookingIds) {
    return null;
  }

  const displayBookingId = bookingId || (bookingIds && bookingIds[0]);
  const bookingCount = bookingIds?.length || 1;

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
            <span className={styles.bookingId}>#{displayBookingId}</span>
          </div>

          <div className={styles.bookingInfo}>
            {paymentDetails ? (
              <>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Subtotal</span>
                  <span className={styles.value}>₹{paymentDetails.subtotal?.toLocaleString()}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Platform Fee</span>
                  <span className={styles.value}>₹{paymentDetails.platformFee?.toLocaleString()}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>GST (18%)</span>
                  <span className={styles.value}>₹{paymentDetails.gst?.toLocaleString()}</span>
                </div>
                {paymentDetails.discount > 0 && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Discount</span>
                    <span className={styles.value} style={{color: '#10b981'}}>-₹{paymentDetails.discount?.toLocaleString()}</span>
                  </div>
                )}
                <div className={styles.infoRow} style={{borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem', marginTop: '0.5rem'}}>
                  <span className={styles.label} style={{fontWeight: '600'}}>Total Paid</span>
                  <span className={styles.value} style={{fontWeight: '600', fontSize: '1.25rem'}}>₹{paymentDetails.total?.toLocaleString()}</span>
                </div>
              </>
            ) : (
              <div className={styles.infoRow}>
                <span className={styles.label}>Amount Paid</span>
                <span className={styles.value}>₹{amount?.toLocaleString()}</span>
              </div>
            )}

            <div className={styles.infoRow}>
              <span className={styles.label}>Services Booked</span>
              <span className={styles.value}>{bookingCount}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Status</span>
              <span className={`${styles.value} ${styles.confirmed}`}>Payment Completed</span>
            </div>
          </div>

          {services && services.length > 0 && (
            <div className={styles.servicesList}>
              <h4>Your Services</h4>
              {services.map((service, index) => (
                <div key={index} className={styles.serviceItem}>
                  <div className={styles.serviceName}>
                    {service.serviceName || service.name}
                  </div>
                  <div className={styles.serviceAmount}>
                    ₹{(service.quotationAmount || service.amount || 0).toLocaleString()}
                  </div>
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
