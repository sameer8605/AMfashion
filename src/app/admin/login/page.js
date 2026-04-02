"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

export default function AdminLogin() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const validationSchema = Yup.object({
    userName: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(""); // Clear previous errors before trying again
      
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          router.push("/admin");
        } else {
          // This captures "Invalid username or password" from your API
          setServerError(data.error || "Invalid credentials. Please try again.");
        }
      } catch (err) {
        setServerError("Connection failed. Check your internet.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container py-5" style={{ maxWidth: "400px" }}>
      <div className="card p-4 shadow-sm border-0 bg-light">
        <h3 className="mb-4 text-center fw-bold">Admin Portal</h3>

        {/* --- DYNAMIC ERROR MESSAGE --- */}
        {serverError && (
          <div className="alert alert-danger d-flex align-items-center py-2" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div style={{ fontSize: "0.9rem" }}>{serverError}</div>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label small fw-bold">Username</label>
            <input
              name="userName"
              type="text"
              {...formik.getFieldProps("userName")}
              className={`form-control ${
                formik.touched.userName && formik.errors.userName ? "is-invalid" : ""
              }`}
            />
            {formik.touched.userName && formik.errors.userName && (
              <div className="invalid-feedback">{formik.errors.userName}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold">Password</label>
            <input
              name="password"
              type="password"
              {...formik.getFieldProps("password")}
              className={`form-control ${
                formik.touched.password && formik.errors.password ? "is-invalid" : ""
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback">{formik.errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-bold"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}