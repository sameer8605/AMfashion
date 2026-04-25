"use client";

import { useEffect, useState, use } from "react";
import AdminHeader from "@/components/AdminHeader";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminOrderDetail({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const statusOptions = [
    { value: "pending", label: "Pending", color: "warning" },
    { value: "confirmed", label: "Confirmed", color: "info" },
    { value: "shipped", label: "Shipped", color: "primary" },
    { value: "delivered", label: "Delivered", color: "success" },
    { value: "cancelled", label: "Cancelled", color: "danger" },
  ];

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      const data = await res.json();
      if (res.ok) {
        setOrder(data.order);
      } else {
        setError(data.error || "Order not found.");
      }
    } catch (err) {
      console.error("Fetch order error:", err);
      setError("Unable to load order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchOrder();
  }, [id]);

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchOrder();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Update status error:", err);
      alert("Error updating status");
    } finally {
      setUpdating(false);
    }
  };

  const deleteOrder = async () => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;
    
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin");
      } else {
        alert("Failed to delete order");
      }
    } catch (err) {
      console.error("Delete order error:", err);
      alert("Error deleting order");
    }
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100">
        <AdminHeader />
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-light min-vh-100">
        <AdminHeader />
        <div className="container py-5">
          <div className="alert alert-danger">
            <h5 className="alert-heading">Error</h5>
            <p className="mb-0">{error || "Order not found."}</p>
            <hr />
            <Link href="/admin" className="btn btn-outline-danger btn-sm">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 pb-5">
      <AdminHeader />
      
      <div className="container py-4">
        {/* Breadcrumb & Actions */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-1">
                <li className="breadcrumb-item"><Link href="/admin">Admin</Link></li>
                <li className="breadcrumb-item active">Order Detail</li>
              </ol>
            </nav>
            <h3 className="fw-bold mb-0">Order #{order._id.slice(-8).toUpperCase()}</h3>
            <p className="text-muted small mb-0">
              Placed on {isMounted ? new Date(order.createdAt).toLocaleString() : ""}
            </p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-danger" onClick={deleteOrder}>
              Delete Order
            </button>
            <Link href="/admin" className="btn btn-dark">
              Back to List
            </Link>
          </div>
        </div>

        <div className="row g-4">
          {/* Main Content: Items */}
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm overflow-hidden">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">Order Items ({order.items.length})</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4 py-3 border-0">Product</th>
                        <th className="py-3 border-0 text-center">Price</th>
                        <th className="py-3 border-0 text-center">Qty</th>
                        <th className="px-4 py-3 border-0 text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3">
                            <div className="d-flex align-items-center">
                              <div>
                                <h6 className="mb-0 fw-semibold">{item.name}</h6>
                                {item.selectedSize && (
                                  <span className="badge bg-secondary-subtle text-secondary small">Size: {item.selectedSize}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-center text-muted">₹{item.price}</td>
                          <td className="py-3 text-center">{item.quantity}</td>
                          <td className="px-4 py-3 text-end fw-bold">₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-light">
                      <tr>
                        <td colSpan="3" className="px-4 py-3 text-end fw-bold">Grand Total:</td>
                        <td className="px-4 py-3 text-end fw-bold text-primary fs-5">₹{order.total}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="card border-0 shadow-sm mt-4">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">Payment Information</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p className="text-muted small mb-1">Method</p>
                    <p className="fw-semibold mb-0">
                      {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment (Razorpay)'}
                    </p>
                  </div>
                  {order.razorpayPaymentId && (
                    <div className="col-md-6 mt-3 mt-md-0">
                      <p className="text-muted small mb-1">Payment ID</p>
                      <p className="fw-semibold mb-0 text-break small">{order.razorpayPaymentId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Status & Customer */}
          <div className="col-12 col-lg-4">
            {/* Status Management */}
            <div className="card border-0 shadow-sm mb-4 overflow-hidden">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">Order Status</h5>
              </div>
              <div className="card-body text-center py-4">
                <div className={`badge rounded-pill px-4 py-2 mb-4 fs-6 ${
                  order.status === 'delivered' ? 'bg-success' :
                  order.status === 'cancelled' ? 'bg-danger' :
                  order.status === 'shipped' ? 'bg-primary' :
                  'bg-warning text-dark'
                }`}>
                  {order.status.toUpperCase()}
                </div>
                
                <div className="d-grid gap-2">
                  <p className="small text-muted mb-2">Change Status To:</p>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    {statusOptions.map((opt) => (
                      <button
                        key={opt.value}
                        className={`btn btn-sm ${order.status === opt.value ? 'btn-' + opt.color : 'btn-outline-' + opt.color} ${updating ? 'disabled' : ''}`}
                        onClick={() => updateStatus(opt.value)}
                        disabled={order.status === opt.value || updating}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">Customer Details</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <p className="text-muted small mb-1">Full Name</p>
                  <p className="fw-semibold mb-0">{order.address.name}</p>
                </div>
                <div className="mb-3">
                  <p className="text-muted small mb-1">Phone Number</p>
                  <p className="fw-semibold mb-0">{order.contactPhone}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">Shipping Address</h5>
              </div>
              <div className="card-body">
                <p className="mb-1 fw-semibold">{order.address.name}</p>
                <p className="mb-1 text-muted">{order.address.street}</p>
                <p className="mb-1 text-muted">{order.address.city}, {order.address.state}</p>
                <p className="mb-0 text-muted">{order.address.pincode}</p>
                <hr />
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.address.street}, ${order.address.city}, ${order.address.state} ${order.address.pincode}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-secondary w-100"
                >
                  <i className="bi bi-geo-alt me-1"></i> View on Map
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
