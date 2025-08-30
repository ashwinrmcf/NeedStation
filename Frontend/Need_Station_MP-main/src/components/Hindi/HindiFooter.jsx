import styles from "./HindiFooter.module.css";
import { BsInstagram } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { Link } from "react-router-dom";

// Hindi version of the Footer component with pre-translated content
const HindiFooter = () => {
  return (
    <>
      <footer className={`${styles["footer"]}`}>
        <div className={`${styles["footer-top"]}`}>
          <div className={`${styles["footer-logo"]}`}>
            <Link to="/hi"> 
              <h2>
                Need<span>Station</span>
              </h2> 
            </Link>
            <p className={`${styles["payment-tagline"]}`}>
              बेहतर समुदाय के लिए सहायकों और ग्राहकों को जोड़ना
            </p>
          </div>

          <div className={`${styles["FirstBreakPoint"]}`}>
            <div className={`${styles["footer-links"]}`}>
              <h3>उपयोगी लिंक</h3>
              <ul>
                <li><Link to="/hi/contact-us">संपर्क करें</Link></li>
                <li><Link to="/hi/how-it-works">यह कैसे काम करता है</Link></li>
                <li><Link to="/hi/faq">अक्सर पूछे जाने वाले प्रश्न</Link></li>
                <li><Link to="/hi/privacy-policy">गोपनीयता नीति</Link></li>
                <li><Link to="/hi/terms-and-services">नियम और सेवाएं</Link></li>
              </ul>
            </div>

            <div className={`${styles["footer-contact"]}`}>
              <h3>संपर्क</h3>
              <p>
                <IoCall /> <span> +11 222 3333</span> 
              </p>
              <p>
                <IoMdMail /> <span>mangcoding123@gmail.com</span> 
              </p>
              <p>
                <FaLocationDot /> <span>2972 वेस्टहाइमर रोड, सांता एना, इलिनोइस 85486</span> 
              </p>
            </div>
          </div>
        </div>
        <hr className={`${styles["footer-separator"]}`} />

        <div className={`${styles["footer-bottom"]}`}>
          <p className={`${styles["copyright"]}`}>
            © कॉपीराइट सभी अधिकार सुरक्षित।
          </p>
          <div className={`${styles["social-media"]}`}>
            <span>
              <BsInstagram />
            </span>{" "}
            <span>
              <FaFacebook />
            </span>{" "}
            <span>
              <FaTwitter />
            </span>{" "}
            <span>
              <FaLinkedin />
            </span>{" "}
          </div>
        </div>
      </footer>
    </>
  );
};

export default HindiFooter;
