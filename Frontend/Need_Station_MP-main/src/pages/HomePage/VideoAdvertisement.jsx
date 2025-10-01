import styles from './VideoAdvertisement.module.css';
import CustomVideoPlayer from '../../components/CustomVideoPlayer/CustomVideoPlayer.jsx';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const VideoAdvertisement = () => {
  // Initialize scroll animations
  useScrollAnimation();
  return (
    <div className={`${styles["video-ad-container"]} scroll-animate`}>
      {/* Main Advertisement Section */}
      <div className={styles["ad-content"]}>
        <div className={`${styles["ad-left"]} scroll-animate`}>
          <div className={styles["ad-badge"]}>
            <span>✨ Featured</span>
          </div>
          <h2 className={styles["ad-title"]}>
            See NeedStation in <span className={styles["highlight"]}>Action</span>
          </h2>
          <p className={styles["ad-description"]}>
            Watch how thousands of customers find trusted service providers 
            effortlessly with our platform every day. From quick fixes to 
            major projects, see how NeedStation connects you with verified 
            professionals in your area.
          </p>
          <div className={`${styles["ad-stats"]} scroll-animate`}>
            <div className={`${styles["stat"]} scroll-animate`} style={{ animationDelay: '0.2s' }}>
              <div className={styles["stat-number"]}>50K+</div>
              <div className={styles["stat-label"]}>Happy Customers</div>
            </div>
            <div className={`${styles["stat"]} scroll-animate`} style={{ animationDelay: '0.4s' }}>
              <div className={styles["stat-number"]}>1000+</div>
              <div className={styles["stat-label"]}>Verified Taskers</div>
            </div>
            <div className={`${styles["stat"]} scroll-animate`} style={{ animationDelay: '0.6s' }}>
              <div className={styles["stat-number"]}>24/7</div>
              <div className={styles["stat-label"]}>Dedicated Support</div>
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
            <span>Watch our story</span>
            <span>2:30 min</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAdvertisement;
