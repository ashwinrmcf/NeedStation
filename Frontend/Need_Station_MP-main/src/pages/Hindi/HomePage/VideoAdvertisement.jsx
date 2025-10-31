import styles from '../../HomePage/VideoAdvertisement.module.css';
import CustomVideoPlayer from '../../../components/CustomVideoPlayer/CustomVideoPlayer.jsx';
import useScrollAnimation from '../../../hooks/useScrollAnimation';

const HindiVideoAdvertisement = () => {
  // Initialize scroll animations
  useScrollAnimation();
  return (
    <div className={`${styles["video-ad-container"]} scroll-animate`}>
      {/* Main Advertisement Section */}
      <div className={styles["ad-content"]}>
        <div className={`${styles["ad-left"]} scroll-animate`}>
          <div className={styles["ad-badge"]}>
            <span>✨ विशेष रुप से प्रदर्शित</span>
          </div>
          <h2 className={styles["ad-title"]}>
            NeedStation को <span className={styles["highlight"]}>कार्य में</span> देखें
          </h2>
          <p className={styles["ad-description"]}>
            देखें कि कैसे हजारों ग्राहक हमारे प्लेटफॉर्म के साथ हर दिन आसानी से 
            विश्वसनीय सेवा प्रदाताओं को ढूंढते हैं। त्वरित सुधार से लेकर प्रमुख 
            परियोजनाओं तक, देखें कि NeedStation आपको आपके क्षेत्र में सत्यापित 
            पेशेवरों से कैसे जोड़ता है।
          </p>
          <div className={`${styles["ad-stats"]} scroll-animate`}>
            <div className={`${styles["stat"]} scroll-animate`} style={{ animationDelay: '0.2s' }}>
              <div className={styles["stat-number"]}>50K+</div>
              <div className={styles["stat-label"]}>खुश ग्राहक</div>
            </div>
            <div className={`${styles["stat"]} scroll-animate`} style={{ animationDelay: '0.4s' }}>
              <div className={styles["stat-number"]}>1000+</div>
              <div className={styles["stat-label"]}>सत्यापित कार्यकर्ता</div>
            </div>
            <div className={`${styles["stat"]} scroll-animate`} style={{ animationDelay: '0.6s' }}>
              <div className={styles["stat-number"]}>24/7</div>
              <div className={styles["stat-label"]}>समर्पित सहायता</div>
            </div>
          </div>
        </div>
        
        <div className={`${styles["ad-right"]} scroll-animate`}>
          <CustomVideoPlayer
            src="https://res.cloudinary.com/dchmvabfy/video/upload/v1757630426/needstation_ad_eqf2sk.mp4"
            width="100%"
            height="400px"
          />
          <div className={styles["video-info"]}>
            <span>हमारी कहानी देखें</span>
            <span>2:30 मिनट</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HindiVideoAdvertisement;
