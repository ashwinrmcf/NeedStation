import styles from "./SearchbarContainer.module.css";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SearchbarContainer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [placeholder, setPlaceholder] = useState("I need help with");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);
  
  // State to hold the randomized services
  const [shuffledServices, setShuffledServices] = useState([]);
  
  // Initialize with comprehensive list of services with appropriate articles
  useEffect(() => {
    const services = [
      "an electrician ⚡",
      "a plumber 🔧",
      "water supply 💧",
      "elder care 👴",
      "a paralysis caregiver 🤲",
      "postnatal care 👶",
      "a nurse 👩‍⚕️",
      "a baby sitter 🧸",
      "a health checkup 🩺",
      "cooking services 🍳",
      "laundry services 🧺",
      "cleaning services 🧹"
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
      const staticText = "I need help with ";
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

  // Service map with services and their corresponding URLs
  const serviceMap = new Map([
    ["electrician", "/electrician"],
    ["plumber", "/plumber"],
    ["water-supply", "/water-supply"],
    ["babysitter", "/babysitter"],
    ["caretaker", "/caretaker"],
    ["nurse", "/nurse"],
    ["paralysis-care", "/paralysis-care"],
    ["postnatal-care", "/postnatal-care"],
    ["health-checkup", "/health-checkup"],
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
      alert("Service not provided");
    }
  };

  const handleServiceClick = (service) => {
    setSearchTerm(service);
    navigate(serviceMap.get(service));
  };

  return (
    <>
      <div className={styles.tagline}>
        Connecting Helpers and Clients for a Better Community
      </div>

      <div className={`${styles.searchbarContainer} ${showDropdown && filteredServices.length > 0 ? styles.expanded : ''}`}>
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
                setPlaceholder("I need help with");
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

      <div className={styles.info}>
        <div className={styles.infoData}>
          <div className={styles.number}>2500+</div>
          <div className={styles.text}>Regular Users</div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.infoData}>
          <div className={styles.number}>700+</div>
          
            <div className={styles.text}>Verified Helpers</div>
          
        </div>
      </div>
    </>
  );
};

export default SearchbarContainer;