"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function SiteNavbar() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent("")}`;

  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  return (
    <>
      <nav className="navbar sticky-top" style={{ padding: "0 0" }}>
        <div className="container" style={{ height: "62px" }}>
          <Link
            href="/"
            className="navbar-brand d-flex align-items-center"
            style={{ gap: "10px" }}
          >
            <Image
              src="/images/amravati-fashion-logo.png"
              alt="Amravati Fashion - Latest Styles Logo"
              width={38}
              height={38}
              priority
              style={{ borderRadius: "8px" }}
            />
            <span
              style={{
                fontWeight: 700,
                fontSize: "1.05rem",
                color: "#111",
                letterSpacing: "0.3px",
              }}
            >
              Amravati Fashion
            </span>
          </Link>

          <div
            className="d-none d-lg-flex align-items-center"
            style={{ gap: "32px" }}
          >
            <Link href="/" className="nav-desktop-link">
              Home
            </Link>
            <Link href="/aboutus" className="nav-desktop-link">
              About
            </Link>
            <Link href="/contactus" className="nav-desktop-link">
              Contact
            </Link>
          </div>

          <button
            id="burger-toggle"
            type="button"
            className={`burger-btn d-lg-none ${!isNavCollapsed ? "open" : ""}`}
            onClick={handleNavCollapse}
            aria-label="Toggle navigation menu"
            aria-expanded={!isNavCollapsed}
          >
            <span className="burger-line" />
            <span className="burger-line" />
            <span className="burger-line" />
          </button>
        </div>
      </nav>

      <div
        className={`mobile-menu-overlay d-lg-none ${!isNavCollapsed ? "open" : ""}`}
        aria-hidden={isNavCollapsed}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="mobile-menu-panel">
          <div className="mobile-menu-header">
            <span className="mobile-menu-brand">AM Fashion</span>
            <button
              type="button"
              className="mobile-menu-close"
              onClick={() => setIsNavCollapsed(true)}
              aria-label="Close menu"
            >
              <span className="bi bi-x-lg" aria-hidden="true" />
            </button>
          </div>

          <nav className="mobile-menu-nav" aria-label="Main navigation">
            <Link
              href="/"
              className="mobile-nav-link"
              onClick={() => setIsNavCollapsed(true)}
            >
              <span className="mobile-nav-num">01</span>Home
            </Link>

            <div className="mobile-menu-divider" role="separator" />

            <Link
              href="/#products"
              className="mobile-nav-link"
              onClick={() => setIsNavCollapsed(true)}
            >
              <span className="mobile-nav-num">02</span>Shop
            </Link>

            <div className="mobile-menu-divider" role="separator" />

            <Link
              href="/aboutus"
              className="mobile-nav-link"
              onClick={() => setIsNavCollapsed(true)}
            >
              <span className="mobile-nav-num">03</span>About
            </Link>

            <div className="mobile-menu-divider" role="separator" />

            <Link
              href="/contactus"
              className="mobile-nav-link"
              onClick={() => setIsNavCollapsed(true)}
            >
              <span className="mobile-nav-num">04</span>Contact
            </Link>
          </nav>

          <div className="mobile-menu-footer">
            <span className="mobile-menu-footer-label">Chat with us</span>
            <a
              href={whatsappUrl}
              className="mobile-menu-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsNavCollapsed(true)}
            >
              <span className="bi bi-whatsapp" aria-hidden="true" /> Chat on
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
