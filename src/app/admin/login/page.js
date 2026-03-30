"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [form, setForm] = useState({
    userName: "",
    password: "",
  });

  const handleLogin = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
    "Content-Type": "application/json",
  },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      router.push("/admin");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "400px" }}>
      <h3 className="mb-3">Admin Login</h3>

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Username"
        onChange={(e) => setForm({ ...form, userName: e.target.value })}
      />

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button className="btn btn-dark w-100" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}