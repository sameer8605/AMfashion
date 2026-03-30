"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    // 1. Safety confirmation
    const confirmLogout = confirm("Are you sure you want to sign out?");
    if (!confirmLogout) return;

    setLoading(true);

    try {
      // 2. Call the API route we just updated
      const res = await fetch("/api/admin/logout", {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        // 3. Push to login page
        router.push("/admin/login");
        
        // 4. Refresh to ensure Middleware catches the missing cookie
        router.refresh(); 
      } else {
        alert("Logout failed: " + data.message);
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="navbar navbar-dark bg-dark sticky-top px-3 shadow">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold text-warning">
          AF Admin Panel
        </span>

        <div className="d-flex align-items-center">
          <span className="text-light me-3 d-none d-sm-inline">
            Hello, Admin
          </span>
          
          <button
            onClick={handleLogout}
            disabled={loading}
            className={`btn btn-sm ${loading ? "btn-secondary" : "btn-danger"} px-3`}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Logging out...
              </>
            ) : (
              "Logout"
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}