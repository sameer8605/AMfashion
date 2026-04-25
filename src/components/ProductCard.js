"use client";

import Link from "next/link";
import { getPrimaryImage, getProductImages } from "@/lib/productImages";
import { useRouter } from "next/navigation";
import { useDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/slices/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const productUrl = `${baseUrl}/product/${product._id}`;
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = `Hi, I want this product: ${product.name} ${productUrl}`;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const cover = getPrimaryImage(product);
  const galleryCount = getProductImages(product).length;

  function handleNavigate() {
    router.push(`/product/${product._id}`);
  }
  return (
    <div className="col-6 col-md-4 col-lg-3 mb-4">
  <div 
    className="card border-0 h-100 product-card" 
    onClick={handleNavigate}
    style={{ 
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      borderRadius: '16px',
      overflow: 'hidden'
    }}
  >
    {/* 📸 Image Wrapper */}
    <div className="position-relative overflow-hidden" style={{ aspectRatio: '1/1', backgroundColor: '#f9f9f9' }}>
      {cover ? (
        <img
          src={cover}
          alt={product.name}
          className="product-image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // Changed to cover for a more premium look
            transition: 'transform 0.5s ease'
          }}
        />
      ) : (
        <div className="d-flex align-items-center justify-content-center h-100 text-muted small">
          No Image
        </div>
      )}

      {/* Gallery Badge */}
      {galleryCount > 1 && (
        <div 
          className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill bg-white shadow-sm d-flex align-items-center" 
          style={{ fontSize: '0.7rem', fontWeight: '600', zIndex: 2 }}
        >
          <i className="bi bi-images me-1"></i> {galleryCount}
        </div>
      )}
    </div>

    {/* ✨ Card Body */}
    <div className="card-body p-3 d-flex flex-column">
      <h6 
        className="text-dark mb-1 text-truncate" 
        style={{ fontWeight: '600', fontSize: '0.95rem' }}
      >
        {product.name}
      </h6>
      
      <div className="d-flex align-items-center mb-3">
        <span className="fw-bold text-primary" style={{ fontSize: '1.1rem' }}>
          ₹{product.price}
        </span>
        {/* Optional: Add a 'fake' original price for modern look */}
        <span className="text-muted text-decoration-line-through ms-2 small">
          ₹{Math.floor(product.price * 1.2)}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto d-flex gap-2">
        <Link
          href={`/product/${product._id}`}
          className="btn btn-light btn-sm flex-grow-1 border-0"
          style={{ borderRadius: '8px', fontWeight: '500', background: '#f1f3f5' }}
          onClick={(e) => e.stopPropagation()}
        >
          Details
        </Link>

        <button
          type="button"
          className="btn btn-primary btn-sm flex-grow-1"
          style={{ borderRadius: '8px', fontWeight: '500' }}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(addToCart(product));
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>

  {/* Add this CSS to your global styles or a <style> tag */}
  <style jsx>{`
    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.08) !important;
    }
    .product-card:hover .product-image {
      transform: scale(1.08);
    }
    .btn-success {
      background-color: #25D366;
      border: none;
    }
    .btn-success:hover {
      background-color: #128C7E;
    }
  `}</style>
</div>
  );
}