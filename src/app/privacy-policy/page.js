"use client";

import SiteNavbar from "@/components/SiteNavbar";
import styles from "./legal.module.css";

export default function PrivacyPolicy() {
  return (
    <>
      <SiteNavbar />
      <div className="container">
        <div className={styles.legalPage}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <section className={styles.section}>
            <h2>1. Introduction</h2>
            <p>
              Amravati Fashion ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We may collect information about you in a variety of ways. The information we may collect on the site includes:</p>
            <ul className={styles.list}>
              <li>Name and email address</li>
              <li>Phone number</li>
              <li>Shipping and billing address</li>
              <li>Payment information</li>
              <li>Account credentials</li>
              <li>Product preferences and purchase history</li>
            </ul>

            <h3>Automatic Information</h3>
            <p>When you visit our website, we automatically collect certain information about your device and browsing activity, including:</p>
            <ul className={styles.list}>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent</li>
              <li>Referring/exit pages</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect in the following ways:</p>
            <ul className={styles.list}>
              <li>To process your transactions and send related information</li>
              <li>To send promotional communications (with your consent)</li>
              <li>To respond to your inquiries and customer service requests</li>
              <li>To improve our website and services</li>
              <li>To personalize your experience</li>
              <li>To prevent fraudulent transactions</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Disclosure of Your Information</h2>
            <p>
              We may share your information with third parties only in the ways described in this Privacy Policy. 
              These may include:
            </p>
            <ul className={styles.list}>
              <li>Service providers who assist us in operating our website and conducting our business</li>
              <li>Payment processors and financial institutions</li>
              <li>Shipping and logistics partners</li>
              <li>Law enforcement when required by law</li>
              <li>Business partners with your consent</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Security of Your Information</h2>
            <p>
              We use administrative, technical, and physical security measures to protect your personal information. 
              However, no security system is impenetrable, and we cannot guarantee absolute security of your information.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and store certain information. 
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices 
              of these external sites. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Your Privacy Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information:</p>
            <ul className={styles.list}>
              <li>Right to access your personal data</li>
              <li>Right to correct inaccurate data</li>
              <li>Right to request deletion of your data</li>
              <li>Right to opt-out of marketing communications</li>
              <li>Right to data portability</li>
            </ul>
            <p>To exercise these rights, please contact us using the information provided below.</p>
          </section>

          <section className={styles.section}>
            <h2>9. Children's Privacy</h2>
            <p>
              Our website is not directed to children under the age of 13. We do not knowingly collect personal information 
              from children under 13. If we become aware that we have collected personal information from a child under 13, 
              we will delete such information promptly.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className={styles.contactInfo}>
              <p><strong>Email:</strong> support@amravatiashion.com</p>
              <p><strong>Phone:</strong> {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}</p>
              <p><strong>Address:</strong> Amravati, India</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
