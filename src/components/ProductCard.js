"use client";

import Link from "next/link";
import { getPrimaryImage, getProductImages } from "@/lib/productImages";

export default function ProductCard({ product }) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const productUrl = `${baseUrl}/product/${product._id}`;
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = `Hi, I want this product:${product.name}${productUrl}`;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const cover = getPrimaryImage(product);
  const galleryCount = getProductImages(product).length;

  return (
    <div className="col-6 col-md-3 mb-3">
      <div className="card shadow-sm h-100">

        {/* ✅ Image wrapper */}
        <div className="p-2">
          <div
            className="position-relative"
            style={{
              width: "100%",
              aspectRatio: "1/1",
              background: "#f8f9fa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {cover ? (
              <img
                src={cover}
                alt={product.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <span className="text-muted small">No image</span>
            )}
            {galleryCount > 1 && (
              <span className="position-absolute bottom-0 end-0 m-1 badge text-bg-dark opacity-75">
                <i className="bi bi-images" aria-hidden /> {galleryCount}
              </span>
            )}
          </div>
        </div>

        {/* ✅ Card Body */}
        <div className="card-body pt-2 d-flex flex-column">
          <h6 className="mb-1">{product.name}</h6>
          <p className="text-muted small mb-2 bi bi-currency-rupee">{product.price}</p>

          <div className="mt-auto d-flex gap-1">
            <Link
              href={`/product/${product._id}`}
              className="btn btn-outline-primary btn-sm w-50"
            >
              View
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              className="btn btn-success btn-sm w-50"
            >
              WhatsApp
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}