import styles from './HomeSatisfactionContainer.module.css';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const HomeSatisfactionContainer = () => {
  // Initialize scroll animations
  useScrollAnimation();
  return (
    <div className={`${styles["satisfaction-container"]} scroll-animate`}>
      <h2 className="scroll-animate">Your satisfaction, <span className={styles["highlight"]}>guaranteed</span></h2>
      <div className={`${styles["satisfaction-features"]} scroll-animate`}>

        <div className={`${styles["feature"]} scroll-animate`} style={{ animationDelay: '0.2s' }}>
          <h3>Happiness Pledge</h3>
          <p>If you're not satisfied, we'll work to make it right.</p>
        </div>

        <div className={`${styles["feature"]} scroll-animate`} style={{ animationDelay: '0.4s' }}>
          <h3>Vetted Taskers</h3>
          <p>Taskers are always background checked before joining the platform.</p>
        </div>

        <div className={`${styles["feature"]} scroll-animate`} style={{ animationDelay: '0.6s' }}>
          <h3>Dedicated Support</h3>
          <p>Friendly service when you need us – every day of the week.</p>
        </div>

      </div>
    </div>
  );
};

export default HomeSatisfactionContainer;
