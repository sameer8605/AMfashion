"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SiteNavbar from "@/components/SiteNavbar";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (res.ok) {
          setOrders(data.orders || []);
        } else {
          setError(data.error || "Unable to load orders.");
        }
      } catch (err) {
        console.error("Fetch orders error:", err);
        setError("Unable to load orders.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

  if (error) {
    return (
      <>
        <SiteNavbar />
        <div className="container py-5">
          <div className="alert alert-danger">{error}</div>
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
            <h3>My Orders</h3>
          </div>

          {orders.length === 0 ? (
            <div className="col-12">
              <div className="text-center py-5">
                <h5>No orders found</h5>
                <p className="text-muted">You haven't placed any orders yet.</p>
                <Link href="/" className="btn btn-primary">
                  Start Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="col-12">
              <div className="list-group">
                {orders.map((order) => (
                  <div key={order._id} className="list-group-item mb-3 rounded shadow-sm">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="mb-1">Order #{order._id.slice(-8)}</h6>
                        <p className="mb-1 text-muted">
                          {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                        <p className="mb-1">
                          <strong>Total:</strong> ₹{order.total} • <strong>Status:</strong>{" "}
                          <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                            {order.status}
                          </span>
                        </p>
                        <p className="mb-1">
                          <strong>Payment:</strong> {order.paymentMethod}
                        </p>
                        <div className="mt-2">
                          <small className="text-muted">
                            Items: {order.items.map(item => `${item.name} (${item.quantity})`).join(", ")}
                          </small>
                        </div>
                      </div>
                      <div className="text-end">
                        <Link href={`/order/${order._id}`} className="btn btn-outline-primary btn-sm">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "paid":
    case "confirmed":
      return "bg-success";
    case "pending":
      return "bg-warning";
    case "cancelled":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
}
