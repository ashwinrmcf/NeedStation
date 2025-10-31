import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import SearchbarContainer from './SearchbarContainer.jsx'
import Cards from './Cards.jsx'
import HomeHowItWorks from './HomeHowItWorks.jsx'
import HomeSatisfactionContainer from './HomeSatisfactionContainer.jsx'
import VideoAdvertisement from './VideoAdvertisement.jsx'
import HomeReview from './HomeReview.jsx'
import GetStarted from '../../../components/GetStarted/GetStarted.jsx'
import styles from '../../HomePage/Home.module.css';

const HindiHome = () => {
  const location = useLocation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successBookingData, setSuccessBookingData] = useState(null);
  
  // Check for booking success from location state
  useEffect(() => {
    if (location.state?.bookingSuccess && location.state?.bookingData) {
      setShowSuccessMessage(true);
      setSuccessBookingData(location.state.bookingData);
      
      // Clear the state
      window.history.replaceState({}, document.title);
      
      // Auto-hide after 10 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 10000);
    }
  }, [location.state]);

  return <>
  {/* Success Message Banner */}
  <AnimatePresence>
    {showSuccessMessage && successBookingData && (
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className={styles.successBanner}
      >
        <div className={styles.successContent}>
          <div className={styles.successIcon}>
            <CheckCircle className="w-8 h-8" style={{ color: '#10b981' }} />
          </div>
          <div className={styles.successText}>
            <h3>🎉 बुकिंग सफलतापूर्वक पुष्टि हो गई!</h3>
            <p>
              <strong>बुकिंग #{successBookingData.bookingNumber}</strong> - {successBookingData.serviceName}
            </p>
            <p className={styles.successSubtext}>
              हम आपके पास सबसे अच्छे कार्यकर्ता ढूंढ रहे हैं! जैसे ही कोई कार्यकर्ता आपकी बुकिंग स्वीकार करेगा, आपको सूचित किया जाएगा।
            </p>
          </div>
          <button 
            onClick={() => setShowSuccessMessage(false)}
            className={styles.closeSuccess}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
  
  <SearchbarContainer/>
  <Cards/>
  <HomeHowItWorks/>
  <HomeSatisfactionContainer/>
  <VideoAdvertisement/>
  <HomeReview/>
  <GetStarted/>
  </>
}

export default HindiHome;
