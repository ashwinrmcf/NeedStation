import React from "react";
import styles from "./TermsAndServices.module.css";

const TermsAndServices = () => {
  return (
    <div className={`${styles.termsContainer} page-content-spacing`}>
      <div className={styles.termsHeader}>
        <h1>Terms <span className={styles.highlight}>& Services</span></h1>
        <div className={styles.headerAccent}></div>
      </div>

      <div className={styles.termsContent}>
        <section className={styles.termsSection}>
          <h2>1. Introduction</h2>
          <p>
            Welcome to NeedStation. These Terms of Service ("Terms") govern your access to and use of the NeedStation website, mobile application, and services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services.
          </p>
          <p>
            NeedStation is a platform that connects users seeking household services ("Customers") with service providers ("Professionals"). These Terms constitute a legally binding agreement between you and NeedStation, whether you are a Customer, Professional, or simply a visitor to our website.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>2. Eligibility</h2>
          <p>
            You must be at least 18 years old to use our Services. By using our Services, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms. If you are using our Services on behalf of a business or other entity, you represent and warrant that you have the authority to bind that entity to these Terms.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>3. Account Registration</h2>
          <p>
            To access certain features of our Services, you may need to register for an account. When you register, you agree to provide accurate, current, and complete information about yourself. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
          <p>
            NeedStation reserves the right to suspend or terminate your account if we suspect that any information you provide is inaccurate, incomplete, or fraudulent, or if you have violated these Terms.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>4. Service Bookings and Payments</h2>
          <p>
            <strong>4.1 Service Bookings:</strong> Customers can book services through our platform. The availability, pricing, and details of services are determined by the Professionals providing those services. NeedStation does not guarantee the availability of any specific service or Professional.
          </p>
          <p>
            <strong>4.2 Payments:</strong> All payments for services booked through our platform are processed through our secure payment system. By making a payment, you authorize us to charge the payment method you provide for the service fees and any applicable taxes. All payments are final and non-refundable, except as otherwise specified in our Cancellation and Refund Policy.
          </p>
          <p>
            <strong>4.3 Service Fees:</strong> NeedStation charges a service fee for facilitating transactions between Customers and Professionals. This fee is included in the total price displayed to Customers before they confirm a booking.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>5. Professional Terms</h2>
          <p>
            <strong>5.1 Service Provision:</strong> If you are a Professional using our platform, you agree to provide services to Customers in a professional, timely, and satisfactory manner. You are solely responsible for the quality of your services and for ensuring compliance with all applicable laws and regulations.
          </p>
          <p>
            <strong>5.2 Ratings and Reviews:</strong> Customers may rate and review your services. These ratings and reviews are public and may affect your visibility and attractiveness to other potential Customers. NeedStation reserves the right to remove ratings and reviews that violate our content policies.
          </p>
          <p>
            <strong>5.3 Background Checks:</strong> NeedStation may conduct background checks on Professionals. However, we do not guarantee the accuracy, completeness, or reliability of these checks. Customers should use their own judgment when engaging with Professionals.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>6. Customer Terms</h2>
          <p>
            <strong>6.1 Service Requests:</strong> When you book a service as a Customer, you agree to provide accurate information about your service needs. You also agree to be available at the scheduled time and to provide a safe and accessible environment for the Professional to perform the requested services.
          </p>
          <p>
            <strong>6.2 Cancellations:</strong> If you need to cancel a booking, please do so according to our Cancellation Policy. Late cancellations or no-shows may result in charges as specified in that policy.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>7. Prohibited Conduct</h2>
          <p>
            You agree not to engage in any of the following prohibited activities:
          </p>
          <ul className={styles.bulletList}>
            <li>Violating any applicable laws or regulations</li>
            <li>Infringing the intellectual property rights of others</li>
            <li>Engaging in fraudulent, deceptive, or misleading conduct</li>
            <li>Harassing, threatening, or intimidating others</li>
            <li>Attempting to gain unauthorized access to our systems or user accounts</li>
            <li>Using our Services for any illegal or unauthorized purpose</li>
            <li>Interfering with the proper functioning of our Services</li>
          </ul>
        </section>

        <section className={styles.termsSection}>
          <h2>8. Disclaimers and Limitations of Liability</h2>
          <p>
            <strong>8.1 Services Provided "As Is":</strong> Our Services are provided on an "as is" and "as available" basis. We make no warranties, express or implied, regarding the reliability, accuracy, or availability of our Services.
          </p>
          <p>
            <strong>8.2 Third-Party Service Providers:</strong> NeedStation is a platform that connects Customers with Professionals. We are not responsible for the conduct or services provided by Professionals or the satisfaction of Customers with those services. Any contract for services is directly between the Customer and the Professional.
          </p>
          <p>
            <strong>8.3 Limitation of Liability:</strong> To the maximum extent permitted by law, NeedStation and its affiliates, officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
          </p>
          <ul className={styles.bulletList}>
            <li>Your use of or inability to use our Services</li>
            <li>Any unauthorized access to or use of our servers or personal information</li>
            <li>Any services provided by Professionals</li>
            <li>Any conduct or content of Professionals or Customers</li>
          </ul>
        </section>

        <section className={styles.termsSection}>
          <h2>9. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless NeedStation and its affiliates, officers, directors, employees, and agents from and against any claims, disputes, demands, liabilities, damages, losses, and expenses, including reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of our Services, your violation of these Terms, or your violation of any rights of another.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>10. Changes to These Terms</h2>
          <p>
            We may revise these Terms from time to time. The most current version will always be posted on our website. If we make changes that we believe are material, we will make reasonable efforts to notify you by email or through a notification on our website. By continuing to use our Services after those changes become effective, you agree to be bound by the revised Terms.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>11. Governing Law and Jurisdiction</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any legal action arising out of or relating to these Terms shall be filed only in the courts located in India, and you hereby consent and submit to the personal jurisdiction of such courts for the purposes of litigating any such action.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>12. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@needstation.in or through our contact page.
          </p>
        </section>
        
        <div className={styles.lastUpdated}>
          <p>Last Updated: May 12, 2025</p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndServices;
