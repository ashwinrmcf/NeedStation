import styles from './Cards.module.css';
import { useRef } from 'react';

import image from '../../assets/images/cardImage1.jpg';
import image1 from '../../assets/images/services/security/securityGuard.png';
import image2 from '../../assets/images/services/parkinsonsCare.png';
import image3 from '../../assets/images/services/bedriddenPatient.png';
import image4 from '../../assets/images/services/motherAndBaby.png';
import image5 from '../../assets/images/services/paralysisCare.png';
import image6 from '../../assets/images/services/elderlyCare.png';
import image7 from '../../assets/images/services/nursingCare.png';
import image8 from '../../assets/images/services/pathologyCare.png';
import image9 from '../../assets/images/services/diabetesManagement.png';
import image10 from '../../assets/images/services/healthCheckUp.png';
import image11 from '../../assets/images/services/physiotherapy.png';
import image12 from '../../assets/images/services/medicalCare.png';
import image13 from '../../assets/images/services/homeHealthCare.png';
import { Link } from 'react-router-dom';

const Cards = () => {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      });
    }
  };

  return <>
    <section className={`py-5 ${styles["section"]}`}>
    <div className="container">
      <div className={styles["headerSection"]}>
        <h2 className={`${styles["heading"]}`}>Our Services</h2>
        <Link to="/services" className={styles["viewAllButton"]}>
          View all
        </Link>
      </div>
      <div className={styles["scrollWrapper"]}>
        <button className={styles["scrollButton"] + " " + styles["scrollButtonLeft"]} onClick={scrollLeft}>
          <span>‹</span>
        </button>
        <div className={styles["scrollContainer"]} ref={scrollContainerRef}>
          <div className={styles["cardContainer"]}>
          
          <div className={styles["scrollCard"]}>
            <img src={image1} className={`card-img-top ${styles["cardImage"]}`} alt="Home Security Guard"/>
            <div className="card-body">
              <h5 className={`card-title ${styles["cardTitle"]}`}>Home Security Guard</h5>
              <p className={`card-text ${styles["cardBody"]}`}>Professional security personnel to protect your home and family with 24/7 vigilance.</p>
              <Link to="/home-security-guard" className={`btn btn-primary ${styles["cardButton"]}`}>Learn More</Link>
            </div>
          </div>

          <div className={styles["scrollCard"]}>
            <img src={image2} className={`card-img-top ${styles["cardImage"]}`} alt="Parkinsons Care"/>
            <div className="card-body">
              <h5 className={`card-title ${styles["cardTitle"]}`}>Parkinsons Care</h5>
              <p className={`card-text ${styles["cardBody"]}`}>Specialized care and support for patients with Parkinson's disease and their families.</p>
              <Link to="/parkinsons-care" className={`btn btn-primary ${styles["cardButton"]}`}>Learn More</Link>
            </div>
          </div>

          <div className={styles["scrollCard"]}>
            <img src={image3} className={`card-img-top ${styles["cardImage"]}`} alt="Bedridden Patient Care"/>
            <div className="card-body">
              <h5 className={`card-title ${styles["cardTitle"]}`}>Bedridden Patient Care</h5>
              <p className={`card-text ${styles["cardBody"]}`}>Comprehensive bedridden care with daily assistance and medical support.</p>
              <Link to="/bedridden-patient-care" className={`btn btn-primary ${styles["cardButton"]}`}>Learn More</Link>
            </div>
          </div>

          <div className={styles["scrollCard"]}>
            <img src={image4} className={`card-img-top ${styles["cardImage"]}`} alt="Mother and Baby Care"/>
            <div className="card-body">
              <h5 className={`card-title ${styles["cardTitle"]}`}>Mother and Baby Care</h5>
              <p className={`card-text ${styles["cardBody"]}`}>Postnatal care for mothers and comprehensive newborn care services.</p>
              <Link to="/mother-baby-care" className={`btn btn-primary ${styles["cardButton"]}`}>Learn More</Link>
            </div>
          </div>

          <div className={styles["scrollCard"]}>
            <img src={image5} className={`card-img-top ${styles["cardImage"]}`} alt="Paralysis Care"/>
            <div className="card-body">
              <h5 className={`card-title ${styles["cardTitle"]}`}>Paralysis Care</h5>
              <p className={`card-text ${styles["cardBody"]}`}>Specialized care and rehabilitation services for patients with paralysis conditions.</p>
              <Link to="/paralysis-care" className={`btn btn-primary ${styles["cardButton"]}`}>Learn More</Link>
            </div>
          </div>

          <div className={styles["scrollCard"]}>
            <img src={image6} className={`card-img-top ${styles["cardImage"]}`} alt="Elderly Care"/>
            <div className="card-body">
              <h5 className={`card-title ${styles["cardTitle"]}`}>Elderly Care</h5>
              <p className={`card-text ${styles["cardBody"]}`}>Compassionate and professional care tailored to meet the needs of seniors.</p>
              <Link to="/elderly-care" className={`btn btn-primary ${styles["cardButton"]}`}>Learn More</Link>
            </div>
          </div>

          <div className={styles["scrollCard"]}>
            <img src={image7} className={`card-img-top ${styles["cardImage"]}`} alt="Nursing Care"/>
            <div className="card-body">
              <h5 className={`card-title ${styles["cardTitle"]}`}>Nursing Care</h5>
              <p className={`card-text ${styles["cardBody"]}`}>Professional nursing services with qualified nurses for medical care at home.</p>
              <Link to="/nursing-care" className={`btn btn-primary ${styles["cardButton"]}`}>Learn More</Link>
            </div>
          </div>

          <div className={styles["scrollCard"]}>
            <img src={image8} className={`card-img-top ${styles["cardImage"]}`} alt="Pathology Care"/>
            <div className="card-body">
              <h5 className={`card-title ${styles["cardTitle"]}`}>Pathology Care</h5>
              <p className={`card-text ${styles["cardBody"]}`}>Home-based pathology services including sample collection and diagnostic tests.</p>
              <Link to="/pathology-care" className={`btn btn-primary ${styles["cardButton"]}`}>Learn More</Link>
            </div>
          </div>

          <div className={styles["scrollCard"]}>
            <img src={image9} className={`card-img-top ${styles["cardImage"]}`} alt="Diabetes Management"/>
            <div className="card-body">
              <h5 className={`card-title ${styles["cardTitle"]}`}>Diabetes Management</h5>
              <p className={`card-text ${styles["cardBody"]}`}>Comprehensive diabetes care including monitoring, medication management, and lifestyle guidance.</p>
              <Link to="/diabetes-management" className={`btn btn-primary ${styles["cardButton"]}`}>Learn More</Link>
            </div>
          </div>

          <div className={styles["scrollCard"]}>
            <img src={image10} className={`card-img-top ${styles["cardImage"]}`} alt="Health Check Up Services"/>
            <div className="card-body">
              <h5 className={`card-title ${styles["cardTitle"]}`}>Health Check Up Services</h5>
              <p className={`card-text ${styles["cardBody"]}`}>Regular health screenings and comprehensive medical check-ups at your convenience.</p>
              <Link to="/health-checkup" className={`btn btn-primary ${styles["cardButton"]}`}>Learn More</Link>
            </div>
          </div>

          <div className={styles["scrollCard"]}>
            <img src={image11} className={`card-img-top ${styles["cardImage"]}`} alt="Physiotherapy"/>
            <div className="card-body">
              <h5 className={`card-title ${styles["cardTitle"]}`}>Physiotherapy</h5>
              <p className={`card-text ${styles["cardBody"]}`}>Professional physiotherapy services for rehabilitation and pain management at home.</p>
              <Link to="/physiotherapy" className={`btn btn-primary ${styles["cardButton"]}`}>Learn More</Link>
            </div>
          </div>

          <div className={styles["scrollCard"]}>
            <img src={image12} className={`card-img-top ${styles["cardImage"]}`} alt="Post Surgery Care"/>
            <div className="card-body">
              <h5 className={`card-title ${styles["cardTitle"]}`}>Post Surgery Care</h5>
              <p className={`card-text ${styles["cardBody"]}`}>Specialized post-operative care and recovery support in the comfort of your home.</p>
              <Link to="/post-surgery-care" className={`btn btn-primary ${styles["cardButton"]}`}>Learn More</Link>
            </div>
          </div>

          <div className={styles["scrollCard"]}>
            <img src={image13} className={`card-img-top ${styles["cardImage"]}`} alt="Caretaker at Home"/>
            <div className="card-body">
              <h5 className={`card-title ${styles["cardTitle"]}`}>Caretaker at Home</h5>
              <p className={`card-text ${styles["cardBody"]}`}>Dedicated caretakers providing personalized assistance and companionship at home.</p>
              <Link to="/caretaker-at-home" className={`btn btn-primary ${styles["cardButton"]}`}>Learn More</Link>
            </div>
          </div>

        </div>
        </div>
        <button className={styles["scrollButton"] + " " + styles["scrollButtonRight"]} onClick={scrollRight}>
          <span>›</span>
        </button>
      </div>
    </div>
  </section>

  </>
}

export default Cards;