"use client";

import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Amravati Fashion</h3>
            <p className={styles.description}>
              Discover the latest fashion trends and styles. Quality clothing for everyone.
            </p>
            <div className={styles.socialLinks}>
              <a
                href={`https://wa.me/${phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                title="WhatsApp"
              >
                <span className="bi bi-whatsapp" aria-hidden="true" />
              </a>
              <a href="#" className={styles.socialIcon} title="Facebook">
                <span className="bi bi-facebook" aria-hidden="true" />
              </a>
              <a href="#" className={styles.socialIcon} title="Instagram">
                <span className="bi bi-instagram" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Quick Links</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <a href="/#products">Shop</a>
              </li>
              <li>
                <a href="/#about">About</a>
              </li>
              <li>
                <a href="/#contact">Contact</a>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Legal</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-of-service">Terms of Service</Link>
              </li>
              <li>
                <Link href="/return-refund-policy">Return & Refund Policy</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Contact Info</h3>
            <ul className={styles.contactList}>
              <li>
                <span className="bi bi-envelope" aria-hidden="true" />
                <a href="mailto:support@amravatiashion.com">support@amravatiashion.com</a>
              </li>
              <li>
                <span className="bi bi-telephone" aria-hidden="true" />
                <a href={`tel:${phone}`}>{phone}</a>
              </li>
              <li>
                <span className="bi bi-geo-alt" aria-hidden="true" />
                <span>Amravati, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>
            &copy; {currentYear} Amravati Fashion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
