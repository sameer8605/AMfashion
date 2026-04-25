"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSelector } from "@/redux/hooks";
import { usePathname } from "next/navigation";

export default function SiteNavbar() {
  const pathname = usePathname();
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent("")}`;

  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        if (parsedUser && typeof parsedUser === 'object') {
          // Wrap in setTimeout to move the state update out of the synchronous execution of the effect
          // This avoids the "cascading render" warning in React 18+
          setTimeout(() => {
            setUser(parsedUser);
          }, 0);
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("currentUser");
      }
    }
  }, []);
  const cartCount = useSelector((state) => state.cart.items.length || 0);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("currentUser");
    setUser(null);
    setIsNavCollapsed(true);
  };

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
            style={{ gap: "24px" }}
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
            <Link href="/cart" className="nav-desktop-link position-relative">
              <span className="bi bi-cart"></span>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
              </span>
            </Link>
            {user ? (
              <>
                <Link href="/orders" className="nav-desktop-link">
                  My Orders
                </Link>
                <button
                  type="button"
                  className="nav-desktop-link btn btn-link p-0"
                  onClick={handleLogout}
                  style={{ color: "#111", textDecoration: "none" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href={`/login?redirect=${pathname}`} className="nav-desktop-link">
                Login
              </Link>
            )}
          </div>

          <div className="d-flex align-items-center d-lg-none" style={{ gap: "12px" }}>
            <Link href="/cart" className="nav-desktop-link position-relative p-2">
              <span className="bi bi-cart fs-5"></span>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.65rem", padding: "0.35em 0.5em" }}>
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              id="burger-toggle"
              type="button"
              className={`burger-btn ${!isNavCollapsed ? "open" : ""}`}
              onClick={handleNavCollapse}
              aria-label="Toggle navigation menu"
              aria-expanded={!isNavCollapsed}
            >
              <span className="burger-line" />
              <span className="burger-line" />
              <span className="burger-line" />
            </button>
          </div>
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
            <div className="d-flex align-items-center" style={{ gap: "16px" }}>
              <Link href="/cart" className="position-relative p-1 text-white" onClick={() => setIsNavCollapsed(true)}>
                <span className="bi bi-cart fs-4"></span>
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.6rem", padding: "0.3em 0.45em" }}>
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                type="button"
                className="mobile-menu-close"
                onClick={() => setIsNavCollapsed(true)}
                aria-label="Close menu"
              >
                <span className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>
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

            <div className="mobile-menu-divider" role="separator" />

            {user ? (
              <>
                <Link
                  href="/orders"
                  className="mobile-nav-link"
                  onClick={() => setIsNavCollapsed(true)}
                >
                  <span className="mobile-nav-num">05</span>My Orders
                </Link>

                <div className="mobile-menu-divider" role="separator" />

                <button
                  type="button"
                  className="mobile-nav-link border-0 bg-transparent text-start w-100"
                  onClick={() => {
                    handleLogout();
                    setIsNavCollapsed(true);
                  }}
                >
                  <span className="mobile-nav-num">06</span>Logout
                </button>
              </>
            ) : (
              <Link
                href={`/login?redirect=${pathname}`}
                className="mobile-nav-link"
                onClick={() => setIsNavCollapsed(true)}
              >
                <span className="mobile-nav-num">05</span>Login
              </Link>
            )}
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
