"use client";

import { useEffect, useState, use } from "react";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import SiteNavbar from "@/components/SiteNavbar";

export default function ProductDetail({ params }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (cancelled) return;
        if (res.ok) {
          setProduct(data);
          setNotFound(false);
        } else {
          setProduct(null);
          setNotFound(true);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (!cancelled) {
          setProduct(null);
          setNotFound(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <>
        <SiteNavbar />
        <div className="container py-3 py-md-4 px-3 px-sm-4">
          <div className="row align-items-start g-3 g-md-4">
            <div className="col-12 col-md-6 mb-2 mb-md-0">
              <div className="ratio ratio-1x1 rounded placeholder-glow">
                <span className="placeholder w-100 h-100 border-0 rounded" />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="placeholder-glow">
                <span
                  className="placeholder col-10 col-lg-8 mb-3 d-block"
                  style={{ minHeight: "2.25rem" }}
                />
                <span
                  className="placeholder col-4 mb-4 d-block"
                  style={{ minHeight: "2.5rem" }}
                />
                <span className="placeholder col-11 mb-2 d-block" />
                <span className="placeholder col-7 mb-2 d-block" />
                <span
                  className="placeholder col-12 rounded d-block"
                  style={{ minHeight: "3rem" }}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!product || notFound) {
    return (
      <>
        <SiteNavbar />
        <div className="container py-4">
          <h2>Product Not Found</h2>
          <p>Could not find product with ID: {id}</p>
        </div>
      </>
    );
  }

  const productUrl = `${baseUrl}/product/${product._id}`;
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = `Hi, I want this product: ${product.name} ${productUrl}`;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <>
      <SiteNavbar />
      <div className="container py-3 py-md-4 px-3 px-sm-4">
        <div className="row align-items-start g-3 g-md-4">
          <div className="col-12 col-md-6 mb-2 mb-md-0">
            <ProductImageCarousel product={product} alt={product.name} />
          </div>
          <div className="col-12 col-md-6">
            <h2 className="mb-3 mt-0">{product.name}</h2>
            <p className="h4 text-success bi bi-currency-rupee">{product.price}</p>
            {(product.color || product.fabric) && (
              <p className="mb-2 text-muted">
                {product.color && (
                  <span>
                    <strong>Color:</strong> {product.color}
                  </span>
                )}
                {product.color && product.fabric && " · "}
                {product.fabric && (
                  <span>
                    <strong>Fabric:</strong> {product.fabric}
                  </span>
                )}
              </p>
            )}
            <hr />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success btn-lg w-100 mt-3"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
