import styles from "./Footer.module.css";
import { BsInstagram } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className={`${styles["footer"]}`}>
        <div className={`${styles["footer-top"]}`}>
          <div className={`${styles["footer-logo"]}`}>
            <Link to="/"> <h2>
              Need<span>Station</span>
            </h2> </Link>
            <p className={`${styles["payment-tagline"]}`}>
              Connecting Helpers and Clients for a Better Community
            </p>
          </div>

          <div className={`${styles["FirstBreakPoint"]}`}>
            <div className={`${styles["footer-links"]}`}>
              <h3>Useful Links</h3>
              <ul>
                <li><Link to="/contact-us">Contact Us</Link></li>
                <li><Link to="/how-it-works">How it Works</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/terms-and-services">Terms & Services</Link></li>
              </ul>
            </div>

            <div className={`${styles["footer-contact"]}`}>
              <h3>Contact</h3>
              <p>
                 <IoCall /> <span> +91 8357028350</span> 
              </p>
              <p>
                <IoMdMail /> <span>support@needstation.in</span> 
              </p>
              <p>
                <FaLocationDot /> <span>2972 Westheimer Rd, Santa Ana, Illinois 85486</span> 
              </p>
            </div>
          </div>
        </div>
        <hr className={`${styles["footer-separator"]}`} />

        <div className={`${styles["footer-bottom"]}`}>
          <p className={`${styles["copyright"]}`}>
            © Copyright All Rights Reserved.
          </p>
          <div className={`${styles["social-media"]}`}>
            <a href="https://www.instagram.com/needstation.in?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
              <span>
                <BsInstagram />
              </span>
            </a>{" "}
            {/*Instagram*/}
            <a href="https://facebook.com/your_facebook_page" target="_blank" rel="noopener noreferrer">
              <span>
                <FaFacebook />
              </span>
            </a>{" "}
            {/*Facebook*/}
            <a href="https://twitter.com/your_twitter_handle" target="_blank" rel="noopener noreferrer">
              <span>
                <FaTwitter />
              </span>
            </a>{" "}
            {/*Twitter*/}
            <a href="https://www.linkedin.com/company/needstation/?viewAsMember=true" target="_blank" rel="noopener noreferrer">
              <span>
                <FaLinkedin />
              </span>
            </a>{" "}
            {/*LinkedIn*/}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
