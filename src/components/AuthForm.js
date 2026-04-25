"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [stage, setStage] = useState("send");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const handleSendOtp = async (event) => {
    event.preventDefault();
    if (!acceptedTerms) {
      return setStatus("Please accept the terms and privacy policy to continue.");
    }
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus(data.error || "Unable to send OTP.");
      } else {
        setStage("verify");
        setStatus(
          data.debugOtp
            ? `OTP sent. Enter ${data.debugOtp} to continue.`
            : "OTP sent. Enter the code to continue."
        );
      }
    } catch (error) {
      console.error(error);
      setStatus("Unable to send OTP right now. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, name: name.trim() }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus(data.error || "OTP verification failed.");
      } else {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        router.push(redirect);
      }
    } catch (error) {
      console.error(error);
      setStatus("Unable to verify OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "16px" }}>
            <div className="bg-dark p-4 text-center">
              <h4 className="text-white fw-bold mb-0">Amravati Fashion</h4>
              <p className="text-white-50 small mb-0 mt-1">Login or Signup in seconds</p>
            </div>
            <div className="card-body p-4">
              <form onSubmit={stage === "send" ? handleSendOtp : handleVerifyOtp}>
                {stage === "send" ? (
                  <>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">Mobile Number</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">+91</span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          className="form-control bg-light border-start-0 ps-0"
                          placeholder="Enter 10 digit number"
                          pattern="[0-9]{10}"
                          required
                          disabled={loading}
                          style={{ boxShadow: "none" }}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="form-check small">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="termsCheck"
                          checked={acceptedTerms}
                          onChange={(e) => setAcceptedTerms(e.target.checked)}
                          required
                        />
                        <label className="form-check-label text-muted" htmlFor="termsCheck">
                          By continuing, I agree to Amravati Fashion`s{" "}
                          <Link href="/terms-of-service" className="text-dark fw-semibold text-decoration-none">Terms of Use</Link>
                          {" "}and{" "}
                          <Link href="/privacy-policy" className="text-dark fw-semibold text-decoration-none">Privacy Policy</Link>
                        </label>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <p className="mb-1 text-muted">OTP sent to <strong>+91 {phone}</strong></p>
                      <button 
                        type="button" 
                        className="btn btn-link btn-sm text-primary text-decoration-none p-0"
                        onClick={() => setStage("send")}
                      >
                        Edit Number
                      </button>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Full Name (for first time users)</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="form-control bg-light"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">Enter OTP</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(event) => setOtp(event.target.value)}
                        className="form-control bg-light text-center fw-bold fs-5"
                        placeholder="0 0 0 0 0 0"
                        required
                        maxLength={6}
                        style={{ letterSpacing: "8px" }}
                      />
                    </div>
                  </>
                )}

                {status && (
                  <div className={`alert ${status.includes("sent") ? "alert-success" : "alert-danger"} py-2 small mb-4`}>
                    {status}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-dark w-100 py-2 fw-bold mb-3" 
                  disabled={loading || (stage === "send" && !acceptedTerms)}
                  style={{ borderRadius: "8px" }}
                >
                  {loading
                    ? "Please wait..."
                    : stage === "send"
                    ? "Continue"
                    : "Verify & Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
