"use client";

import AdminHeader from "@/components/AdminHeader";
import { useEffect, useState } from "react";
import { getPrimaryImage, getProductImages } from "@/lib/productImages";

const MAX_IMAGES = 4;

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
  });

  // 🔄 Fetch products
  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const uploadOneFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Upload failed:", data.error || res.statusText);
      return null;
    }
    if (!data.url) {
      console.error("Upload had no URL:", data);
      return null;
    }
    return data.url;
  };

  const onFilesSelected = async (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    const room = MAX_IMAGES - imageUrls.length;
    if (room <= 0) {
      alert(`You can add up to ${MAX_IMAGES} images per product.`);
      return;
    }
    const batch = picked.slice(0, room);
    if (batch.length === 0) return;

    setUploading(true);
    const newUrls = [];
    try {
      for (const file of batch) {
        const url = await uploadOneFile(file);
        if (url) newUrls.push(url);
      }
    } finally {
      setUploading(false);
    }

    if (newUrls.length < batch.length) {
      alert(
        `Only ${newUrls.length} of ${batch.length} file(s) uploaded. Check the network or Cloudinary configuration and try again.`
      );
    }

    if (newUrls.length) {
      setImageUrls((prev) => [...prev, ...newUrls].slice(0, MAX_IMAGES));
    }
  };

  const removeImageAt = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const addProduct = async () => {
    if (imageUrls.length === 0) {
      return alert("Add at least one image (up to 4).");
    }

    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        images: imageUrls,
        image: imageUrls[0],
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return alert(data.error || "Could not save product. Try again.");
    }

    const saved = data.product ?? data;
    const savedCount = Array.isArray(saved.images) ? saved.images.length : 0;
    if (savedCount !== imageUrls.length) {
      console.warn("Saved product images count mismatch:", {
        sent: imageUrls.length,
        saved: savedCount,
        saved,
      });
    }

    setForm({ name: "", price: "", category: "" });
    setImageUrls([]);
    fetchProducts();
  };

  //  Delete product
  const deleteProduct = async (id) => {
  // 1. Prevent accidental clicks
  const confirmed = confirm("Are you sure you want to delete this product?");
  if (!confirmed) return;

  try {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    // 2. Parse the JSON response from your API
    const data = await res.json();

    if (res.ok) {
      // 3. Success Feedback
      alert(data.message || "Product deleted successfully!");
      
      // 4. Refresh the list
      fetchProducts();
    } else {
      // Handle server-side errors (e.g., 404 or 500)
      alert(`Error: ${data.error || "Failed to delete product"}`);
    }
  } catch (error) {
    // Handle network errors
    console.error("Delete request failed:", error);
    alert("Network error. Please try again later.");
  }
};


  return (
    <div className="d-flex">

      {/* 📱 Sidebar (Desktop) */}
      <div
        className="bg-dark text-white p-3 d-none d-md-block"
        style={{ width: "220px", minHeight: "100vh" }}
      >
        <h5 className="fw-bold">Admin</h5>
        <p className="small text-muted">Dashboard</p>
      </div>

      {/*  Main Content */}
      <div className="flex-grow-1">

        {/* 🔝 Topbar */}
        <AdminHeader  />

        <div className="container py-4">

          {/* ➕ Add Product Card */}
          <div className="card p-3 mb-4 shadow-sm">
            <h6 className="fw-bold mb-3">Add Product</h6>

            <input
              className="form-control mb-2"
              placeholder="Product Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="form-control mb-2"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />

            <select
              className="form-control mb-2"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option value="">Select Category</option>
              <option value="tshirt">T-Shirt</option>
              <option value="jeans">Jeans</option>
              <option value="pathani">Pathani</option>
            </select>

            <label className="form-label small text-muted mb-1">
              Product images (1–{MAX_IMAGES}, select multiple if you like)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="form-control mb-2"
              disabled={uploading || imageUrls.length >= MAX_IMAGES}
              onChange={onFilesSelected}
            />

            {imageUrls.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mb-3">
                {imageUrls.map((url, idx) => (
                  <div key={`${url}-${idx}`} className="position-relative">
                    <img
                      src={url}
                      alt=""
                      style={{
                        width: "72px",
                        height: "72px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger position-absolute top-0 end-0 translate-middle rounded-circle p-0"
                      style={{ width: "22px", height: "22px", fontSize: "12px" }}
                      onClick={() => removeImageAt(idx)}
                      aria-label={`Remove image ${idx + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              className="btn btn-dark w-100"
              onClick={addProduct}
              disabled={uploading || imageUrls.length === 0}
            >
              {uploading ? "Uploading..." : "Add Product"}
            </button>
          </div>

          {/*  Product List */}
          <div className="row">
            {products.map((p) => (
              <div key={p._id} className="col-6 col-md-3 mb-3">
                <div className="card shadow-sm h-100">
                  <div className="position-relative">
                    <img
                      src={getPrimaryImage(p)}
                      alt=""
                      className="w-100"
                      style={{
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                    {getProductImages(p).length > 1 && (
                      <span className="badge bg-secondary position-absolute top-0 end-0 m-1">
                        {getProductImages(p).length} photos
                      </span>
                    )}
                  </div>

                  <div className="card-body">
                    <h6 className="mb-1">{p.name}</h6>
                    <p className="text-muted small mb-2">
                      {p.price}
                    </p>

                    <button
                      className="btn btn-danger btn-sm w-100"
                      onClick={() => deleteProduct(p._id)}
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}