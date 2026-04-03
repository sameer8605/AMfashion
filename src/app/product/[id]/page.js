"use client";
import { useEffect, useState, use } from "react";
import ProductImageCarousel from "@/components/ProductImageCarousel";

// 1. Ensure 'params' is accepted as a prop
export default function ProductDetail({ params }) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // 2. In Next.js 15, params is a Promise. We MUST unwrap it.
  const resolvedParams = use(params); 
  const id = resolvedParams.id; 

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 3. Match ID (using .toString() to be safe with MongoDB IDs)
  const product = products.find((p) => p._id.toString() === id);

  if (loading) return <div className="container py-4">Loading product...</div>;
  
  if (!product) {
    return (
      <div className="container py-4">
        <h2>Product Not Found</h2>
        <p>Could not find product with ID: {id}</p>
      </div>
    );
  }

  const productUrl = `${baseUrl}/product/${product._id}`;
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = `Hi, I want this product: ${product.name} ${productUrl}`;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;


  return (
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
  );
}