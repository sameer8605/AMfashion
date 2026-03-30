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

      {/* 🔝 Navbar */}
     <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
      <div className="container">
        {/* Brand Name */}
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <Image
            src="/images/amravati-fashion-logo.png" 
            alt="Amravati Fashion - Latest Styles Logo" 
            width={40} 
            height={40} 
            priority // This logo loads FAST as it's above the fold
            className="d-inline-block align-top me-2" // Standard Bootstrap classes
          />
          <span className="fw-bold text-dark d-none d-sm-inline">
            Amravati Fashion
          </span>
        </Link>

        {/* 🍔 Bootstrap Hamburger Button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleNavCollapse}
          aria-controls="navbarNav"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 📱 Collapsible Menu Items */}
        <div 
          className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse justify-content-end`} 
          id="navbarNav"
        >
          <div className="navbar-nav pt-2 pt-lg-0">
            <Link 
              href="/" 
              className="text-dark text-decoration-none mx-lg-3 mb-2 mb-lg-0" 
              onClick={() => setIsNavCollapsed(true)}
            >
              Home
            </Link>
            <a 
              href="#about" 
              className="text-dark text-decoration-none mx-lg-3 mb-2 mb-lg-0" 
              onClick={() => setIsNavCollapsed(true)}
            >
              About
            </a>
            <a 
              href="#contact" 
              className="text-dark text-decoration-none ms-lg-3 mb-2 mb-lg-0" 
              onClick={() => setIsNavCollapsed(true)}
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>

      {/* 🎯 Hero */}
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
            <p>🚚 Fast Delivery</p>
          </div>
          <div className="col-4">
            <p>💰 Affordable Price</p>
          </div>
          <div className="col-4">
            <p>🔥 Latest Trends</p>
          </div>
        </div>
      </div>

      {/* 🧑 About */}
      <div id="about" className="bg-light py-4">
        <div className="container text-center">
          <h5 className="fw-bold">About Us</h5>
          <p className="small text-muted">
            We are a local Amravati fashion store bringing you the
            latest styles at affordable prices. Shop easily via WhatsApp!
          </p>
        </div>
      </div>

      {/* 📲 Contact */}
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

      {/* 💬 Floating WhatsApp */}
      <a
        href={whatsappUrl}
        className="btn btn-success position-fixed"
        style={{
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
        }}
      >
        💬
      </a>

      {/* ⚫ Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <small>© 2026 Amravati Fashion • All Rights Reserved</small>
      </footer>

    </div>
  );
}