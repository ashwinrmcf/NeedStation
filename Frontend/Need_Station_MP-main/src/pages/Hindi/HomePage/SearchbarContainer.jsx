import styles from "../../HomePage/SearchbarContainer.module.css";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useScrollAnimation from "../../../hooks/useScrollAnimation";

const HindiSearchbarContainer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [placeholder, setPlaceholder] = useState("मुझे मदद चाहिए");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);
  
  // State to hold the randomized services
  const [shuffledServices, setShuffledServices] = useState([]);
  
  // Initialize scroll animations
  useScrollAnimation();
  
  // Initialize with comprehensive list of services in Hindi
  useEffect(() => {
    const services = [
      "घर सुरक्षा गार्ड",
      "पार्किंसंस देखभाल",
      "बिस्तर पर पड़े मरीज की देखभाल",
      "माँ और बच्चे की देखभाल",
      "लकवा देखभाल",
      "बुजुर्ग देखभाल",
      "नर्सिंग देखभाल",
      "पैथोलॉजी देखभाल",
      "मधुमेह प्रबंधन",
      "स्वास्थ्य जांच सेवाएं",
      "फिजियोथेरेपी",
      "सर्जरी के बाद देखभाल",
      "घर पर देखभालकर्ता"
    ];
    
    // Fisher-Yates shuffle algorithm
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
    
    // Set the shuffled services to state
    setShuffledServices(shuffleArray(services));
  }, []);
  
  const navigate = useNavigate();
  
  // Type animation logic
  useEffect(() => {
    if (searchTerm || shuffledServices.length === 0) return; // Don't animate if user is typing or services not loaded
    
    const typeAnimation = () => {
      const currentWord = shuffledServices[wordIndex];
      const staticText = "मुझे मदद चाहिए ";
      const cursor = "|"; // Cursor character
      
      if (isDeleting) {
        // Deleting characters
        setPlaceholder(staticText + currentWord.substring(0, charIndex - 1) + cursor);
        setCharIndex(charIndex - 1);
        setTypingSpeed(80); // Faster when deleting
      } else {
        // Adding characters
        setPlaceholder(staticText + currentWord.substring(0, charIndex + 1) + cursor);
        setCharIndex(charIndex + 1);
        setTypingSpeed(150); // Normal typing speed
      }
      
      // Change direction if reached end of word
      if (!isDeleting && charIndex === currentWord.length) {
        setIsDeleting(true);
        setTypingSpeed(1500); // Pause before deleting
      } 
      // Move to next word if deleted everything
      else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setWordIndex((wordIndex + 1) % shuffledServices.length);
      }
    };
    
    const timer = setTimeout(typeAnimation, typingSpeed);
    return () => clearTimeout(timer);
  }, [placeholder, charIndex, wordIndex, isDeleting, typingSpeed, searchTerm, shuffledServices]);

  // Service map with Hindi services and their corresponding URLs
  const serviceMap = new Map([
    ["घर सुरक्षा गार्ड", "/hi/services/security-guard"],
    ["सुरक्षा गार्ड", "/hi/services/security-guard"],
    ["पार्किंसंस देखभाल", "/hi/services/parkinsons-care"],
    ["बिस्तर पर पड़े मरीज की देखभाल", "/hi/services/bedridden-patient-care"],
    ["माँ और बच्चे की देखभाल", "/hi/services/mother-baby-care"],
    ["लकवा देखभाल", "/hi/services/paralysis-care"],
    ["बुजुर्ग देखभाल", "/hi/services/elderly-care"],
    ["नर्सिंग देखभाल", "/hi/services/nursing-care"],
    ["पैथोलॉजी देखभाल", "/hi/services/pathology-care"],
    ["मधुमेह प्रबंधन", "/hi/services/diabetes-management"],
    ["स्वास्थ्य जांच सेवाएं", "/hi/services/health-check-up-services"],
    ["फिजियोथेरेपी", "/hi/services/physiotherapy"],
    ["सर्जरी के बाद देखभाल", "/hi/services/post-surgery-care"],
    ["घर पर देखभालकर्ता", "/hi/services/caretaker-at-home"],
  ]);

  // Get all services as an array
  const services = Array.from(serviceMap.keys());

  // Filter services based on search term and limit to 3 results
  const filteredServices = searchTerm
    ? services
        .filter(service =>
          service.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 3) // Limit to 3 results
    : [];
    

  const handleSearch = (e) => {
    e.preventDefault();
    const service = searchTerm.toLowerCase();
    
    if (serviceMap.has(service)) {
      navigate(serviceMap.get(service));
    } else {
      alert("सेवा उपलब्ध नहीं है");
    }
  };

  const handleServiceClick = (service) => {
    setSearchTerm(service);
    navigate(serviceMap.get(service));
  };

  return (
    <>
      <div className={`${styles.tagline} scroll-animate`}>
        बेहतर समुदाय के लिए सहायकों और ग्राहकों को जोड़ना
      </div>

      <div className={`${styles.searchbarContainer} ${showDropdown && filteredServices.length > 0 ? styles.expanded : ''} scroll-animate`}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchbar}>
            <FaSearch className={styles.searchIcon} />
            <input
              className={styles.searchbarInput}
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => {
                setShowDropdown(true);
                // Reset placeholder to static text when focused
                setPlaceholder("मुझे मदद चाहिए");
              }}
              onBlur={() => {
                const dropdownTimer = setTimeout(() => setShowDropdown(false), 200);
                
                // Resume animation if search field is empty
                if (searchTerm === "") {
                  // Reset typing animation
                  setCharIndex(0);
                  setIsDeleting(false);
                }
                
                return () => {
                  clearTimeout(dropdownTimer);
                };
              }}
            />
          </div>
        </form>
        
        {showDropdown && filteredServices.length > 0 && (
          <div className={styles.dropdown}>
            {filteredServices.map((service) => (
              <div
                key={service}
                className={styles.dropdownItem}
                onClick={() => handleServiceClick(service)}
              >
                {service}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`${styles.info} scroll-animate`}>
        <div className={`${styles.infoData} scroll-animate`}>
          <div className={`${styles.number} scroll-animate`}>2500+</div>
          <div className={`${styles.text} scroll-animate`}>नियमित उपयोगकर्ता</div>
        </div>
        <div className={styles.divider}></div>
        <div className={`${styles.infoData} scroll-animate`}>
          <div className={`${styles.number} scroll-animate`}>700+</div>
          <div className={`${styles.text} scroll-animate`}>सत्यापित सहायक</div>
        </div>
      </div>
    </>
  );
};

export default HindiSearchbarContainer;
