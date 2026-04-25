"use client";

import { useEffect, useState, use } from "react";
import SiteNavbar from "@/components/SiteNavbar";

export default function OrderDetail({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (res.ok) {
          setOrder(data);
        } else {
          setError(data.error || "Order not found.");
        }
      } catch (err) {
        console.error("Fetch order error:", err);
        setError("Unable to load order details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <>
        <SiteNavbar />
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <SiteNavbar />
        <div className="container py-5">
          <div className="alert alert-danger">{error || "Order not found."}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteNavbar />
      <div className="container py-5">
        <div className="row">
          <div className="col-12 mb-4">
            <h3>Order Details</h3>
            <p className="text-muted">Order ID: {order._id}</p>
          </div>

          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header">
                <h5>Items Ordered</h5>
              </div>
              <div className="card-body">
                {order.items.map((item, index) => (
                  <div key={index} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                    <div className="flex-grow-1">
                      <h6>{item.name}</h6>
                      {item.selectedSize && (
                        <p className="mb-1 text-muted small">Size: {item.selectedSize}</p>
                      )}
                      <p className="mb-1">₹{item.price} x {item.quantity}</p>
                    </div>
                    <div className="text-end">
                      <p className="mb-0 fw-semibold">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header">
                <h5>Order Summary</h5>
              </div>
              <div className="card-body">
                <p><strong>Total:</strong> ₹{order.total}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Contact Phone:</strong> {order.contactPhone}</p>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-header">
                <h5>Delivery Address</h5>
              </div>
              <div className="card-body">
                <p className="mb-1"><strong>{order.address.name}</strong></p>
                <p className="mb-1">{order.address.street}</p>
                <p className="mb-1">{order.address.city}, {order.address.state}</p>
                <p className="mb-0">{order.address.pincode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
