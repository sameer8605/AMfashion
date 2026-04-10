"use client";

import SiteNavbar from "@/components/SiteNavbar";
import styles from "./legal.module.css";

export default function ReturnRefundPolicy() {
  return (
    <>
      <SiteNavbar />
      <div className="container">
        <div className={styles.legalPage}>
          <h1 className={styles.title}>Return & Refund Policy</h1>
          <p className={styles.lastUpdated}>
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <section className={styles.section}>
            <h2>1. Returns Policy Overview</h2>
            <p>
              At Amravati Fashion, we want you to be completely satisfied with your purchase. If you are not satisfied 
              with your order for any reason, we offer a hassle-free return policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Return Eligibility</h2>
            <p>To be eligible for a return, your item must meet the following conditions:</p>
            <ul className={styles.list}>
              <li>Return request must be initiated within 30 days of purchase</li>
              <li>Item must be in original, unused condition</li>
              <li>Item must have all original packaging, tags, and accessories</li>
              <li>Item must show no signs of wear or alteration</li>
              <li>Item must be clean and free from any damage</li>
            </ul>
            <p>
              <strong>Note:</strong> Personalized, custom-made, or final sale items may not be eligible for return. 
              Please check the product description for any exclusions.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. How to Initiate a Return</h2>
            <p>To return an item, follow these steps:</p>
            <ol className={styles.list} style={{ listStyleType: "decimal" }}>
              <li>Contact our customer service team within 30 days of purchase</li>
              <li>Provide your order number and reason for return</li>
              <li>Receive return authorization and shipping instructions</li>
              <li>Ship the item to the address provided (see shipping information below)</li>
              <li>Include a copy of your order confirmation in the package</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2>4. Return Shipping</h2>
            <p><strong>Shipping Costs:</strong></p>
            <ul className={styles.list}>
              <li>For defective or wrong items: Amravati Fashion covers return shipping</li>
              <li>For change of mind returns: Customer covers return shipping costs</li>
            </ul>
            <p>
              <strong>Guidelines:</strong> Please use a trackable shipping method to ensure your return reaches us. 
              Amravati Fashion is not responsible for lost or damaged items during return shipment.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Refund Processing</h2>
            <p>Once we receive and inspect your returned item:</p>
            <ul className={styles.list}>
              <li>Items will be inspected within 5-7 business days</li>
              <li>If approved, your refund will be processed within 10-15 business days</li>
              <li>Refunds will be issued to your original payment method</li>
              <li>Please allow 5-10 business days for the refund to appear in your account</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>6. Refund Amount</h2>
            <p>
              The refund amount will include the full purchase price of the item. Original shipping costs are non-refundable 
              unless the return is due to a defect or our error. Return shipping costs are deducted from the refund unless 
              the return is due to our mistake or a defective item.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Non-Refundable Items</h2>
            <p>The following items are non-refundable:</p>
            <ul className={styles.list}>
              <li>Final sale or clearance items marked as non-refundable</li>
              <li>Personalized or custom-made products</li>
              <li>Items purchased during special promotions or clearance sales</li>
              <li>Items that have been worn, washed, or altered</li>
              <li>Items without original packaging or tags</li>
              <li>Gift cards and promotional codes</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>8. Exchanges</h2>
            <p>
              If you would like to exchange an item for a different size or color, please contact our customer service team. 
              We will assist you with the exchange process. Exchange shipping costs will be covered by Amravati Fashion for 
              size/color exchanges, provided the original item meets return eligibility criteria.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Defective or Damaged Items</h2>
            <p>
              If you receive a defective or damaged item, please contact us immediately with photos of the damage. We will 
              provide you with a prepaid return shipping label and process a full refund or replacement at no cost to you.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Wrong Item Received</h2>
            <p>
              If you received the wrong item, please contact us within 24 hours of receipt. We will arrange for a prepaid 
              return shipping label and send you the correct item immediately or issue a full refund.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Return Address</h2>
            <p>
              Please ensure your returned item is clearly labeled with your order number and return reason. 
              Contact our customer service team for the specific return address in your region.
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Sale and Clearance Items</h2>
            <p>
              Items purchased on sale or during clearance events may have different return policies. Please refer to the 
              specific product page or your order confirmation for details on these items' return eligibility.
            </p>
          </section>

          <section className={styles.section}>
            <h2>13. Special Circumstances</h2>
            <p>
              If you have special circumstances affecting your return request, please contact us to discuss. 
              We will do our best to work with you to find a satisfactory solution.
            </p>
          </section>

          <section className={styles.section}>
            <h2>14. Refund Disputes</h2>
            <p>
              If there is a dispute regarding your refund, Amravati Fashion reserves the right to conduct an investigation. 
              Our decision on refund eligibility is final. If you disagree, you may request further review by contacting 
              our management team.
            </p>
          </section>

          <section className={styles.section}>
            <h2>15. Contact Us</h2>
            <p>
              If you have questions about our Return & Refund Policy or need to initiate a return, please contact us:
            </p>
            <div className={styles.contactInfo}>
              <p><strong>Email:</strong> support@amravatiashion.com</p>
              <p><strong>Phone:</strong> {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}</p>
              <p><strong>WhatsApp:</strong> {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}</p>
              <p><strong>Address:</strong> Amravati, India</p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>16. Changes to This Policy</h2>
            <p>
              Amravati Fashion reserves the right to modify this Return & Refund Policy at any time. Changes will be 
              effective immediately upon posting to the website. Your continued use of the website constitutes your 
              acceptance of any changes to this policy.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
