import styles from '../../HomePage/HomeSatisfactionContainer.module.css';
import useScrollAnimation from '../../../hooks/useScrollAnimation';

const HindiHomeSatisfactionContainer = () => {
  // Initialize scroll animations
  useScrollAnimation();
  return (
    <div className={`${styles["satisfaction-container"]} scroll-animate`}>
      <h2 className="scroll-animate">आपकी संतुष्टि, <span className={styles["highlight"]}>गारंटीकृत</span></h2>
      <div className={`${styles["satisfaction-features"]} scroll-animate`}>

        <div className={`${styles["feature"]} scroll-animate`} style={{ animationDelay: '0.2s' }}>
          <h3>खुशी की प्रतिज्ञा</h3>
          <p>यदि आप संतुष्ट नहीं हैं, तो हम इसे सही करने के लिए काम करेंगे।</p>
        </div>

        <div className={`${styles["feature"]} scroll-animate`} style={{ animationDelay: '0.4s' }}>
          <h3>सत्यापित कार्यकर्ता</h3>
          <p>प्लेटफॉर्म में शामिल होने से पहले कार्यकर्ताओं की हमेशा पृष्ठभूमि जांच की जाती है।</p>
        </div>

        <div className={`${styles["feature"]} scroll-animate`} style={{ animationDelay: '0.6s' }}>
          <h3>समर्पित सहायता</h3>
          <p>जब आपको हमारी आवश्यकता हो - सप्ताह के हर दिन मैत्रीपूर्ण सेवा।</p>
        </div>

      </div>
    </div>
  );
};

export default HindiHomeSatisfactionContainer;
