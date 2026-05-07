"use client";

import AdminHeader from "@/components/AdminHeader";
import { useEffect, useState } from "react";
import { getPrimaryImage, getProductImages } from "@/lib/productImages";
import Link from "next/link";

const MAX_IMAGES = 4;

// Standard sizes available for products
const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    color: "",
    fabric: "",
    sellerName: "",
    sizes: [],
    productDetails: "",
  });

  // 🔄 Fetch products
  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  // 🔄 Fetch orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchProducts();
    fetchOrders();
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

  const saveProduct = async () => {
    if (imageUrls.length === 0) {
      return alert("Add at least one image (up to 4).");
    }

    if (!form.name.trim() || !form.price.trim() || !form.category.trim()) {
      return alert("Please fill in name, price, and category before saving.");
    }

    setSaving(true);
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
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
        return alert(
          data.error ||
            `Could not ${editingProduct ? "update" : "save"} product. Try again.`
        );
      }

      setForm({ name: "", price: "", category: "", color: "", fabric: "", sellerName: "", sizes: [], productDetails: "" });
      setImageUrls([]);
      setEditingProduct(null);
      fetchProducts();
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      price: product.price || "",
      category: product.category || "",
      color: product.color || "",
      fabric: product.fabric || "",
      sellerName: product.sellerName || "",
      sizes: product.sizes || [],
      productDetails: product.productDetails || "",
    });
    setImageUrls(getProductImages(product));
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setForm({ name: "", price: "", category: "", color: "", fabric: "", sellerName: "", sizes: [], productDetails: "" });
    setImageUrls([]);
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
        <h5 className="fw-bold mb-4">Admin</h5>
        <div className="nav flex-column nav-pills">
          <button
            className={`nav-link text-white text-start mb-2 ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
          <button
            className={`nav-link text-white text-start mb-2 ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
        </div>
      </div>

      {/*  Main Content */}
      <div className="flex-grow-1">
        {/*  Topbar */}
        <AdminHeader />

        {/* 📱 Mobile Tabs Navigation (Visible only on mobile) */}
        <div className="d-md-none bg-white border-bottom shadow-sm">
          <div className="nav nav-fill nav-pills p-2">
            <button
              className={`nav-link py-2 ${activeTab === "products" ? "active bg-dark text-white" : "text-dark"}`}
              onClick={() => setActiveTab("products")}
            >
              <i className="bi bi-box-seam me-2"></i>
              Products
            </button>
            <button
              className={`nav-link py-2 ${activeTab === "orders" ? "active bg-dark text-white" : "text-dark"}`}
              onClick={() => setActiveTab("orders")}
            >
              <i className="bi bi-receipt me-2"></i>
              Orders
            </button>
          </div>
        </div>

        <div className="container py-4">
          {activeTab === "products" ? (
            <>
              {/*  Add Product Card */}
              <div className="card p-3 mb-4 shadow-sm">
                <h6 className="fw-bold mb-3">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h6>

                <input
                  className="form-control mb-2"
                  placeholder="Product Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />

                <div className="row">
                  <div className="col-6">
                    <input
                      className="form-control mb-2"
                      placeholder="Color (e.g. Black)"
                      value={form.color}
                      onChange={(e) => setForm({ ...form, color: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      className="form-control mb-2"
                      placeholder="Fabric (e.g. Cotton)"
                      value={form.fabric}
                      onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Available Sizes</label>
                  <div className="row">
                    {AVAILABLE_SIZES.map((size) => (
                      <div key={size} className="col-3 col-md-2 mb-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`size-${size}`}
                            checked={form.sizes.includes(size)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setForm({ ...form, sizes: [...form.sizes, size] });
                              } else {
                                setForm({
                                  ...form,
                                  sizes: form.sizes.filter((s) => s !== size),
                                });
                              }
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`size-${size}`}
                          >
                            {size}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <input
                  className="form-control mb-2"
                  placeholder="Seller Name (e.g. Amravati Fashion)"
                  value={form.sellerName}
                  onChange={(e) => setForm({ ...form, sellerName: e.target.value })}
                />

                <textarea
                  className="form-control mb-2"
                  placeholder="Product Details (optional)"
                  rows="3"
                  value={form.productDetails}
                  onChange={(e) =>
                    setForm({ ...form, productDetails: e.target.value })
                  }
                />

                <select
                  className="form-control mb-2"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
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
                          style={{
                            width: "22px",
                            height: "22px",
                            fontSize: "12px",
                          }}
                          onClick={() => removeImageAt(idx)}
                          aria-label={`Remove image ${idx + 1}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {editingProduct && (
                  <div className="alert alert-info py-2 mb-3" role="alert">
                    Editing product <strong>{editingProduct.name}</strong>. Save
                    changes or cancel.
                  </div>
                )}

                <button
                  className="btn btn-dark w-100 mb-2"
                  onClick={saveProduct}
                  disabled={saving || uploading || imageUrls.length === 0}
                >
                  {saving
                    ? editingProduct
                      ? "Saving..."
                      : "Adding..."
                    : editingProduct
                    ? "Update Product"
                    : "Add Product"}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    className="btn btn-secondary w-100"
                    onClick={cancelEdit}
                    disabled={saving || uploading}
                  >
                    Cancel edit
                  </button>
                )}
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
                        <p className="text-muted small mb-1">{p.price}</p>
                        {(p.color || p.fabric) && (
                          <p className="small text-muted mb-2">
                            {p.color && <span>Color: {p.color}</span>}
                            {p.color && p.fabric && " • "}
                            {p.fabric && <span>Fabric: {p.fabric}</span>}
                          </p>
                        )}

                        <button
                          className="btn btn-primary btn-sm w-100 mb-2"
                          onClick={() => startEdit(p)}
                        >
                          Edit
                        </button>
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
            </>
          ) : (
            /* Orders List */
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0">All Orders</h6>
                <button
                  className="btn btn-sm btn-outline-dark"
                  onClick={fetchOrders}
                >
                  Refresh
                </button>
              </div>
              <div className="card-body p-0">
                {/* 💻 Desktop Table View (Visible only on desktop) */}
                <div className="table-responsive d-none d-md-block">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4 py-3 border-0 text-center">ID</th>
                        <th className="py-3 border-0">Customer</th>
                        <th className="py-3 border-0">Date</th>
                        <th className="py-3 border-0">Total</th>
                        <th className="py-3 border-0">Status</th>
                        <th className="px-4 py-3 border-0 text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingOrders ? (
                        <tr>
                          <td colSpan="6" className="text-center py-5">
                            <div
                              className="spinner-border spinner-border-sm text-primary me-2"
                              role="status"
                            ></div>
                            Loading orders...
                          </td>
                        </tr>
                      ) : orders.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="text-center py-5 text-muted"
                          >
                            No orders found.
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order._id}>
                            <td className="px-4 py-3 text-center">
                              <span className="fw-medium text-uppercase small">
                                #{order._id.slice(-8)}
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="d-flex flex-column">
                                <span className="fw-semibold">
                                  {order.address?.name || "N/A"}
                                </span>
                                <span className="small text-muted">
                                  {order.contactPhone}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 small text-muted">
                              {isMounted ? new Date(order.createdAt).toLocaleDateString() : ""}
                            </td>
                            <td className="py-3 fw-bold text-dark">
                              ₹{order.total}
                            </td>
                            <td className="py-3">
                              <span
                                className={`badge rounded-pill px-3 py-2 ${
                                  order.status === "delivered"
                                    ? "bg-success-subtle text-success"
                                    : order.status === "cancelled"
                                    ? "bg-danger-subtle text-danger"
                                    : order.status === "shipped"
                                    ? "bg-primary-subtle text-primary"
                                    : "bg-warning-subtle text-warning"
                                }`}
                              >
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-end">
                              <Link
                                href={`/admin/orders/${order._id}`}
                                className="btn btn-sm btn-dark px-3"
                              >
                                View Detail
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 📱 Mobile Card View (Visible only on mobile) */}
                <div className="d-md-none p-3">
                  {loadingOrders ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status"></div>
                      <p className="mt-2 text-muted">Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      No orders found.
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {orders.map((order) => (
                        <div key={order._id} className="card border shadow-none rounded-3">
                          <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="fw-bold text-uppercase small text-muted">#{order._id.slice(-8)}</span>
                              <span
                                className={`badge rounded-pill px-2 py-1 small ${
                                  order.status === "delivered"
                                    ? "bg-success-subtle text-success"
                                    : order.status === "cancelled"
                                    ? "bg-danger-subtle text-danger"
                                    : order.status === "shipped"
                                    ? "bg-primary-subtle text-primary"
                                    : "bg-warning-subtle text-warning"
                                }`}
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            <div className="mb-2">
                              <h6 className="mb-0 fw-bold">{order.address?.name || "N/A"}</h6>
                              <span className="small text-muted">{order.contactPhone}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-end mt-3">
                              <div>
                                <span className="small text-muted d-block">
                                  {isMounted ? new Date(order.createdAt).toLocaleDateString() : ""}
                                </span>
                                <span className="fw-bold fs-5">₹{order.total}</span>
                              </div>
                              <Link
                                href={`/admin/orders/${order._id}`}
                                className="btn btn-dark btn-sm px-3"
                              >
                                View Detail
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}