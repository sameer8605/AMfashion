"use client";

import SiteNavbar from "@/components/SiteNavbar";
import styles from "./legal.module.css";

export default function TermsOfService() {
  return (
    <>
      <SiteNavbar />
      <div className="container">
        <div className={styles.legalPage}>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.lastUpdated}>
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <section className={styles.section}>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using the CityKart website, you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (including information and software) 
              on CityKart's website for personal, non-commercial transitory viewing only. This is the grant of a 
              license, not a transfer of title, and under this license you may not:
            </p>
            <ul className={styles.list}>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              <li>Use automated tools to collect data from our website</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. Disclaimer</h2>
            <p>
              The materials on CityKart's website are provided on an "as is" basis. CityKart makes no 
              warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without 
              limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or 
              non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Limitations</h2>
            <p>
              In no event shall CityKart or its suppliers be liable for any damages (including, without limitation, 
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability to 
              use the materials on CityKart's website, even if we or our authorized representative has been notified 
              orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Accuracy of Materials</h2>
            <p>
              The materials appearing on CityKart's website could include technical, typographical, or photographic 
              errors. CityKart does not warrant that any of the materials on our website are accurate, complete, or 
              current. CityKart may make changes to the materials contained on our website at any time without notice.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Materials and Links</h2>
            <p>
              CityKart has not reviewed all of the sites linked to our website and is not responsible for the 
              contents of any such linked site. The inclusion of any link does not imply endorsement by CityKart 
              of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Modifications</h2>
            <p>
              CityKart may revise these terms of service for our website at any time without notice. By using this 
              website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of India, and you 
              irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. User Accounts</h2>
            <p>
              If you create an account on our website, you are responsible for maintaining the confidentiality of your 
              account information and password. You agree to accept responsibility for all activities that occur under your 
              account. You must notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Product Information</h2>
            <p>
              We strive to provide accurate descriptions and images of our products. However, we do not warrant that product 
              descriptions, pricing, or other content is accurate, complete, reliable, current, or error-free. If a product 
              offered by CityKart is not as described, your sole remedy is to return it in unused condition.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. User Conduct</h2>
            <p>You agree not to use our website for any unlawful or fraudulent purpose, or in violation of any applicable laws or regulations. You specifically agree not to:</p>
            <ul className={styles.list}>
              <li>Harass or cause distress or inconvenience to any person</li>
              <li>Obscene or abusive language or images</li>
              <li>Disrupt the normal flow of dialogue within our website</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Create false or misleading content</li>
              <li>Infringe on others' intellectual property rights</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>12. Limitation of Liability</h2>
            <p>
              In no case shall CityKart, its directors, officers, employees, or agents be liable for any indirect, 
              incidental, special, consequential, or exemplary damages arising from your use of or inability to use the 
              website or materials.
            </p>
          </section>

          <section className={styles.section}>
            <h2>13. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
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
