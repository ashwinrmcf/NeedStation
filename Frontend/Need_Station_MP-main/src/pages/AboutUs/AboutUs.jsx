import styles from "./AboutUs.module.css";
import ScrollToTop from "../../hooks/ScrollToTop.jsx";
import ashwin from "../../assets/images/AboutUs/ashwin.jpg";
import ajitesh from "../../assets/images/AboutUs/ajitesh.jpg";
import abhishek from "../../assets/images/AboutUs/abhishek.jpg";
import zainab from "../../assets/images/AboutUs/zainab.jpg";
import yash from "../../assets/images/AboutUs/yash.png";
import navneet from "../../assets/images/AboutUs/navneet.jpeg";
import bairagi from "../../assets/images/AboutUs/bairagi.jpeg";
import siddharth from "../../assets/images/AboutUs/siddharth.jpg";
import divyaraj from "../../assets/images/AboutUs/divyaraj.png";
import logo from "../../assets/images/AboutUs/logo.jpeg";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Ashwin Soni",
      role: "Financial Operations",
      image: ashwin,
      description: "Leads financial structuring, business management, and revenue growth while overseeing legal, client, product, and security initiatives for holistic development.",
    },
    {
      name: "Zainab Ansari",
      role: "Customer Experience",
      image: zainab,
      description: "Leads the strategic direction of customer engagement, ensuring every interaction reflects quality, care, and trust.",
    },
    {
      name: "Abhishek Gupta",
      role: "Technology Infra",
      image: abhishek,
      description: "Manages the technological infrastructure and platform development, ensuring security, scalability, and seamless user experience.",
    },
    {
      name: "Ajitesh Tripathi",
      role: "Operations Manager",
      image: ajitesh,
      description: "Bridges client relationships with internal execution, overseeing team tasks and ensuring timely, high-quality delivery that strengthens trust and efficiency.",
    },
    {
      name: "Navneet Chauhan",
      role: "Data & Marketing",
      image: navneet,
      description: "Oversees database operations and drives social media marketing, merging analytics with creativity for efficient and impactful outreach.",
    },
    {
      name: "Aman Bairagi",
      role: "Business Development",
      image: bairagi,
      description: "Drives business growth by implementing strategies that expand our reach and highlight the impact of our services.",
    },
    {
      name: "Yash Sharma",
      role: "Product Development",
      image: yash,
      description: "Drives innovation by designing, refining, and enhancing NeedStation’s services and digital platform, ensuring alignment with user needs and market trends.",
    },
    {
      name: "Siddharth Singh Rathore",
      role: "Business Strategy",
      image: siddharth, 
      description: "Leads local market negotiations and brand campaigns, combining creative writing with strategic marketing and endorsements.",
    },
    {
      name: "Divyaraj Singh Panwar",
      role: "Media & Partnerships",
      image: divyaraj, 
      description: "Manages big client outreach and digital negotiations while directing creative content, YouTube strategy, and brand partnerships.",
    },
  ];

  // Service categories
  const serviceCategories = [
    {
      title: "Elder Care",
      icon: "",
      services: [
        "CareTaker",
        "Paralysis Caregiver",
        "Postnatal Caregiver",
        "Nurse",
        "Health Checkup Services",
        "Baby Sitter",
      ],
    },
    {
      title: "Basic Needs",
      icon: "",
      services: ["Electrician", "Plumber", "Water-Supply"],
    },
    {
      title: "Maid Services",
      icon: "",
      services: ["Cooking", "Cleaning", "Laundry"],
    },
  ];

  return (
    <>
      <ScrollToTop />
      <main className={`${styles["about-main"]} page-content-spacing`}>
        <div className={styles["container"]}>
          {/* Vision & Mission Section */}
          <section className={styles["vision-section"]}>
            <h2>About NeedStation</h2>
            <div className={styles["vision-content"]}>
              <div className={styles["vision-text"]}>
                <h3>Our Vision</h3>
                <p>
                  To create a platform that connects households with trusted and
                  verified service providers, making daily life more convenient
                  and manageable for everyone.
                </p>
                
                <h3>Our Mission</h3>
                <p>
                  We aim to bridge the gap between service seekers and providers
                  by offering a secure, reliable, and user-friendly platform that
                  addresses essential household needs and elder care services.
                </p>
              </div>
              <div className={styles["vision-image"]}>
                <div className={styles["logo-container"]}>
                  <img 
                    src={logo} 
                    alt="NeedStation Logo" 
                    className={styles["logo-image"]} 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className={styles["services-section"]}>
            <h2>Our Services</h2>
            <p className={styles["section-description"]}>
              At NeedStation, we offer a comprehensive range of services designed
              to meet your everyday needs and provide specialized care for your
              loved ones.
            </p>
            
            <div className={styles["service-categories"]}>
              {serviceCategories.map((category, index) => (
                <div key={index} className={styles["service-category"]}>
                  <div className={styles["category-header"]}>
                    <span className={styles["category-icon"]}>{category.icon}</span>
                    <h3>{category.title}</h3>
                  </div>
                  <ul className={styles["service-list"]}>
                    {category.services.map((service, sIndex) => (
                      <li key={sIndex}>{service}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section className={styles["team-section"]}>
            <h2>Meet Our Team</h2>
            <p className={styles["section-description"]}>
              Our dedicated team of professionals works tirelessly to ensure
              NeedStation delivers the highest quality services to meet your
              household needs.
            </p>
            
            <div className={styles["team-grid"]}>
              {teamMembers.map((member, index) => (
                <div key={index} className={styles["team-member"]}>
                  <div className={styles["member-image"]}>
                    <div 
                      className={styles["placeholder-member-image"]} 
                      style={{backgroundImage: `url(${member.image})`}}
                    >
                      {/* <span>{member.name.charAt(0)}</span> */}
                    </div>
                  </div>
                  <div className={styles["member-info"]}>
                    <h3>{member.name}</h3>
                    <h4>{member.role}</h4>
                    <p>{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Values Section */}
          <section className={styles["values-section"]}>
            <h2>Our Values</h2>
            <div className={styles["values-grid"]}>
              <div className={styles["value-item"]}>
                <h3>Trust</h3>
                <p>
                  We verify all service providers to ensure they are reliable and
                  trustworthy, giving you peace of mind.
                </p>
              </div>
              <div className={styles["value-item"]}>
                <h3>Quality</h3>
                <p>
                  We are committed to maintaining high standards in all services
                  we offer through continuous monitoring and feedback.
                </p>
              </div>
              <div className={styles["value-item"]}>
                <h3>Accessibility</h3>
                <p>
                  Our platform is designed to make essential services accessible
                  to everyone, whenever and wherever they need them.
                </p>
              </div>
              <div className={styles["value-item"]}>
                <h3>Empathy</h3>
                <p>
                  We understand the challenges of daily life and strive to create
                  solutions that genuinely address your needs with compassion.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default AboutUs;