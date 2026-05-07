"use client";

import { useEffect, useState, useMemo, useRef, Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import Hero from "@/components/Hero";
import SiteNavbar from "@/components/SiteNavbar";
import { useSearchParams } from "next/navigation";

const PRODUCT_SKELETON_KEYS = ["a", "b", "c", "d", "e", "f", "g", "h"];
const CATEGORY_SKELETON_KEYS = ["c1", "c2", "c3", "c4"];

function HomeContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const productsRef = useRef(null);
  
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = "";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset category when searching
    if (search) {
      setSelectedCategory("all");
      // Scroll to products section when search changes
      setTimeout(() => {
        productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [search]);

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

  const filteredProducts = useMemo(() => {
    let result = products;
    
    // Filter by Category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    
    // Filter by Search (Name, Category, etc)
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query) ||
          p.fabric?.toLowerCase().includes(query) ||
          p.color?.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [products, selectedCategory, search]);

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
      <div id="products" ref={productsRef} className="container py-3" style={{ scrollMarginTop: "80px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">
            {search ? `Search results for "${search}"` : "Latest Collection"}
          </h5>
          {search && (
            <span className="badge bg-secondary rounded-pill">
              {filteredProducts.length} items
            </span>
          )}
        </div>

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
     
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}