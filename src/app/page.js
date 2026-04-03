"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Hero from "@/components/Hero";
import Loader from "@/common/loader";
import Image from "next/image";

export default function Home() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = "";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  // Function to toggle the menu
  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  useEffect(() => {
    const fetchData = async () => {
      const res1 = await fetch("/api/products");
      const data1 = await res1.json();
      setProducts(data1);

      const res2 = await fetch("/api/categories");
      const data2 = await res2.json();
      setCategories(data2);
    };

    fetchData();
  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  if(!products.length) {
    return<Loader/>
  }
  return (
    <div>

      {/*  Navbar */}
      <nav className="navbar sticky-top" style={{ padding: '0 0' }}>
        <div className="container" style={{ height: '62px' }}>
          {/* Brand */}
          <Link href="/" className="navbar-brand d-flex align-items-center" style={{ gap: '10px' }}>
            <Image
              src="/images/amravati-fashion-logo.png"
              alt="Amravati Fashion - Latest Styles Logo"
              width={38}
              height={38}
              priority
              style={{ borderRadius: '8px' }}
            />
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#111', letterSpacing: '0.3px' }}>
              Amravati Fashion
            </span>
          </Link>

          {/* Desktop links */}
          <div className="d-none d-lg-flex align-items-center" style={{ gap: '32px' }}>
            <Link href="/" className="nav-desktop-link">Home</Link>
            <a href="#about" className="nav-desktop-link">About</a>
            <a href="#contact" className="nav-desktop-link">Contact</a>
          </div>

          {/* Hamburger — mobile only */}
          <button
            id="burger-toggle"
            className={`burger-btn d-lg-none ${!isNavCollapsed ? 'open' : ''}`}
            onClick={handleNavCollapse}
            aria-label="Toggle navigation menu"
            aria-expanded={!isNavCollapsed}
          >
            <span className="burger-line"></span>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </button>
        </div>
      </nav>

      {/*  Full-Page Overlay Menu */}
      <div
        className={`mobile-menu-overlay d-lg-none ${!isNavCollapsed ? 'open' : ''}`}
        aria-hidden={isNavCollapsed}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Full-page dark panel */}
        <div className="mobile-menu-panel">

          {/* Top bar */}
          <div className="mobile-menu-header">
            <span className="mobile-menu-brand">AM Fashion</span>
            <button
              className="mobile-menu-close"
              onClick={() => setIsNavCollapsed(true)}
              aria-label="Close menu"
            >
              <span className="bi bi-x-lg" aria-hidden="true"></span>
            </button>
          </div>

          {/* Giant nav links */}
          <nav className="mobile-menu-nav" aria-label="Main navigation">
            <Link
              href="/"
              className="mobile-nav-link"
              onClick={() => setIsNavCollapsed(true)}
            >
              <span className="mobile-nav-num">01</span>Home
            </Link>

            <div className="mobile-menu-divider" role="separator" />

            <a
              href="#products"
              className="mobile-nav-link"
              onClick={() => setIsNavCollapsed(true)}
            >
              <span className="mobile-nav-num">02</span>Shop
            </a>

            <div className="mobile-menu-divider" role="separator" />

            <a
              href="#about"
              className="mobile-nav-link"
              onClick={() => setIsNavCollapsed(true)}
            >
              <span className="mobile-nav-num">03</span>About
            </a>

            <div className="mobile-menu-divider" role="separator" />

            <a
              href="#contact"
              className="mobile-nav-link"
              onClick={() => setIsNavCollapsed(true)}
            >
              <span className="mobile-nav-num">04</span>Contact
            </a>
          </nav>

          {/* Bottom WhatsApp CTA */}
          <div className="mobile-menu-footer">
            <span className="mobile-menu-footer-label">Chat with us</span>
            <a
              href={whatsappUrl}
              className="mobile-menu-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsNavCollapsed(true)}
            >
              <span className="bi bi-whatsapp" aria-hidden="true"></span> Chat on WhatsApp
            </a>
          </div>

        </div>
      </div>

      {/*  Hero */}
      <Hero />

      {/* 🧥 Categories */}
      <div className="container py-4">
        <h5 className="fw-bold text-center mb-3">Shop by Category</h5>

        <div className="row g-2">
          <div className="col-3">
            <div
              onClick={() => setSelectedCategory("all")}
              className={`category-card text-center p-2  border ${
                selectedCategory === "all" ? "bg-dark text-white" : ""
              }`}
            >
               <small>All</small>
            </div>
          </div>

          {categories.map((cat) => (
            <div className="col-3" key={cat._id}>
              <div
                onClick={() => setSelectedCategory(cat.categoryName)}
                className={`category-card text-center p-2 border ${
                  selectedCategory === cat.categoryName
                    ? "bg-dark text-white"
                    : ""
                }`}
              >
                <small>{cat.categoryName}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div id="products" className="container py-3">
        <h5 className="fw-bold mb-3">Latest Collection</h5>

        <div className="row g-2">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/* 💡 Why Choose Us */}
      <div className="container py-4 text-center">
        <h5 className="fw-bold mb-3">Why Choose Us?</h5>

        <div className="row">
          <div className="col-4">
            <p><span className="bi bi-truck text-danger"></span> Fast Delivery</p>
          </div>
          <div className="col-4">
            <p><span className="bi bi-tag text-success"></span> Affordable Price</p>
          </div>
          <div className="col-4">
            <p><span className="bi bi-fire text-warning"></span> Latest Trends</p>
          </div>
        </div>
      </div>

      {/*  About */}
      <div id="about" className="bg-light py-4">
        <div className="container text-center">
          <h5 className="fw-bold">About Us</h5>
          <p className="small text-muted">
            We are a local Amravati fashion store bringing you the
            latest styles at affordable prices. Shop easily via WhatsApp!
          </p>
        </div>
      </div>

      {/*  Contact */}
      <div id="contact" className="py-4 text-center">
        <div className="container">
          <h5 className="fw-bold">Contact Us</h5>
          <p className="small text-muted">
            Have questions? Chat with us instantly
          </p>

          <a
            href={whatsappUrl}
            className="btn btn-success"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/*  Floating WhatsApp */}
      <a
        href={whatsappUrl}
        className="btn btn-success position-fixed"
        style={{
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
        }}
      >
        <span className="bi bi-whatsapp" aria-hidden="true"></span>
      </a>

      {/*  Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <small>© 2026 Amravati Fashion • All Rights Reserved</small>
      </footer>

    </div>
  );
}