"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Hero from "@/components/Hero";
import SiteNavbar from "@/components/SiteNavbar";

const PRODUCT_SKELETON_KEYS = ["a", "b", "c", "d", "e", "f", "g", "h"];
const CATEGORY_SKELETON_KEYS = ["c1", "c2", "c3", "c4"];

export default function Home() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = "";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);
        const [prodData, catData] = await Promise.all([
          prodRes.json(),
          catRes.json(),
        ]);
        if (cancelled) return;
        setProducts(Array.isArray(prodData) ? prodData : []);
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (e) {
        console.error("Failed to load data", e);
        if (!cancelled) {
          setProducts([]);
          setCategories([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div>
      <SiteNavbar />

      <Hero />

      {/* 🧥 Categories */}
      <div className="container py-4">
        <h5 className="fw-bold text-center mb-3">Shop by Category</h5>

        {loading ? (
          <div className="row g-2">
            {CATEGORY_SKELETON_KEYS.map((key) => (
              <div className="col-3" key={key}>
                <div
                  className="placeholder-glow rounded border p-2 text-center"
                  style={{ minHeight: "38px" }}
                >
                  <span className="placeholder col-8 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </div>

      {/* Products */}
      <div id="products" className="container py-3">
        <h5 className="fw-bold mb-3">Latest Collection</h5>

        <div className="row g-2">
          {loading ? (
            PRODUCT_SKELETON_KEYS.map((key) => (
              <div className="col-6 col-md-3 mb-3" key={key}>
                <div className="card shadow-sm border-0 h-100">
                  <div className="p-2 placeholder-glow">
                    <div
                      className="placeholder w-100 rounded"
                      style={{ aspectRatio: "1 / 1" }}
                    />
                  </div>
                  <div className="card-body pt-2">
                    <div className="placeholder-glow">
                      <p className="placeholder col-9 mb-2" />
                      <p className="placeholder col-5 mb-0" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-12 text-center py-5 text-muted">
              No products found in this category.
            </div>
          )}
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