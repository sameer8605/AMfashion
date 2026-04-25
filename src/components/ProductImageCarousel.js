"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getProductImages } from "@/lib/productImages";

export default function ProductImageCarousel({ product, alt }) {
  const images = useMemo(() => getProductImages(product), [product]);
  const carouselRef = useRef(null);
  const carouselId = `product-carousel-${String(product?._id ?? "x")}`;
  const [Carousel, setCarousel] = useState(null);

  useEffect(() => {
    // Dynamically import Bootstrap Carousel to avoid SSR issues
    import("bootstrap").then(({ Carousel: BootstrapCarousel }) => {
      setCarousel(() => BootstrapCarousel);
    });
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el || images.length < 2 || !Carousel) return;

    const instance = Carousel.getOrCreateInstance(el, {
      interval: false,
      wrap: true,
      touch: true,
      ride: false,
    });

    return () => {
      const existing = Carousel.getInstance(el);
      if (existing) existing.dispose();
    };
  }, [carouselId, images.length, Carousel]);

  if (images.length === 0) {
    return (
      <div className="ratio ratio-1x1 rounded shadow-sm bg-secondary-subtle">
        <div className="d-flex align-items-center justify-content-center h-100 w-100 text-muted small">
          No image
        </div>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="ratio ratio-1x1 rounded shadow-sm bg-secondary-subtle overflow-hidden">
        <img
          src={images[0]}
          className="d-block w-100 h-100 object-fit-cover"
          alt={alt}
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div
      ref={carouselRef}
      id={carouselId}
      className="carousel carousel-dark slide w-100 rounded shadow-sm"
    >
      <div className="carousel-indicators mb-0 ">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target={`#${carouselId}`}
            data-bs-slide-to={i}
            className={i === 0 ? "active" : ""}
            aria-current={i === 0 ? "true" : undefined}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="carousel-inner rounded-bottom ">
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className={`carousel-item ${i === 0 ? "active" : ""}`}
          >
            <div className="ratio ratio-1x1 bg-secondary-subtle overflow-hidden">
              <img
                src={src}
                className="d-block w-100 h-100 object-fit-cover"
                alt={`${alt} — ${i + 1} of ${images.length}`}
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev "
        type="button"
        data-bs-target={`#${carouselId}`}
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target={`#${carouselId}`}
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
