import styles from '../../HomePage/HomeReview.module.css';
import image1 from '../../../assets/images/HomeReviewImage1.png';
import image2 from '../../../assets/images/HomeReviewImage2.png';
import image3 from '../../../assets/images/HomeReviewImage3.png';
import useScrollAnimation from '../../../hooks/useScrollAnimation';

const HindiHomeReview = () => {
  // Initialize scroll animations
  useScrollAnimation();
  return (
    <div className={`${styles["review-section"]} scroll-animate`}>
      <h2 className="scroll-animate">लोग हमारे बारे में क्या कह रहे हैं</h2>
      <div className={`${styles["review-cards"]} scroll-animate`}>
        
        {/* First Review Card */}
        <div className={`${styles["review-card"]} ${styles["gradient"]} scroll-animate`} style={{ animationDelay: '0.2s' }}>
          <div className={styles["quote"]}>"</div>
          <p className={styles["review-text"]}>
            जोस ने मेरी एसी ड्रेन लाइन को ठीक किया जो मेरे मास्टर बाथरूम सिंक को बंद कर रही थी। वह समय पर, संवादात्मक और कुशल थे। अत्यधिक अनुशंसित!
          </p>
          <div className={styles["reviewer-info"]}>
            <img src={image1} alt="हरमन जेन्सन" className={styles["reviewer-img"]} />
            <div className={styles["reviewer-details"]}>
              <p className={styles["reviewer-name"]}>हरमन जेन्सन</p>
              <p className={styles["reviewer-role"]}>संस्थापक और नेता</p>
            </div>
          </div>
        </div>

        {/* Second Review Card */}
        <div className={`${styles["review-card"]} ${styles["transparent"]} scroll-animate`} style={{ animationDelay: '0.4s' }}>
          <div className={styles["quote"]}>"</div>
          <p className={styles["review-text"]}>
            जोस ने मेरी एसी ड्रेन लाइन को ठीक किया जो मेरे मास्टर बाथरूम सिंक को बंद कर रही थी। वह समय पर, संवादात्मक और कुशल थे। अत्यधिक अनुशंसित!
          </p>
          <div className={styles["reviewer-info"]}>
            <img src={image2} alt="स्टीव मार्क" className={styles["reviewer-img"]} />
            <div className={styles["reviewer-details"]}>
              <p className={styles["reviewer-name"]}>स्टीव मार्क</p>
              <p className={styles["reviewer-role"]}>संस्थापक और नेता</p>
            </div>
          </div>
        </div>

        {/* Third Review Card */}
        <div className={`${styles["review-card"]} ${styles["transparent"]} scroll-animate`} style={{ animationDelay: '0.6s' }}>
          <div className={styles["quote"]}>"</div>
          <p className={styles["review-text"]}>
            जोस ने मेरी एसी ड्रेन लाइन को ठीक किया जो मेरे मास्टर बाथरूम सिंक को बंद कर रही थी। वह समय पर, संवादात्मक और कुशल थे। अत्यधिक अनुशंसित!
          </p>
          <div className={styles["reviewer-info"]}>
            <img src={image3} alt="केन गैलाघर" className={styles["reviewer-img"]} />
            <div className={styles["reviewer-details"]}>
              <p className={styles["reviewer-name"]}>केन गैलाघर</p>
              <p className={styles["reviewer-role"]}>संस्थापक और नेता</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HindiHomeReview;
