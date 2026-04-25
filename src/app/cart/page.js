"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "@/redux/hooks";
import {
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "@/redux/slices/cartSlice";
import SiteNavbar from "@/components/SiteNavbar";
import { getPrimaryImage } from "@/lib/productImages";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [user, setUser] = useState(null);
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("bag"); // bag, address, payment

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Use timeout to avoid "cascading render" warning
        setTimeout(() => {
          setUser(parsed);
          setContactPhone(parsed.phone || "");
          setAddress({
            name: parsed.name || "",
            street: parsed.address?.street || "",
            city: parsed.address?.city || "",
            state: parsed.address?.state || "",
            pincode: parsed.address?.pincode || "",
          });
        }, 0);
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }

    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          // Use timeout here too
          setTimeout(() => {
            setUser(data.user);
            setContactPhone(data.user.phone || "");
            setAddress({
              name: data.user.name || "",
              street: data.user.address?.street || "",
              city: data.user.address?.city || "",
              state: data.user.address?.state || "",
              pincode: data.user.address?.pincode || "",
            });
            localStorage.setItem("currentUser", JSON.stringify(data.user));
          }, 0);
        }
      } catch (error) {
        console.warn("Unable to load user details", error);
      }
    })();
  }, []);

  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleRazorpayPayment = async () => {
    if (!window.Razorpay) {
      const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!loaded) {
        setMessage("Unable to load Razorpay checkout. Please try again later.");
        return;
      }
    }

    const response = await fetch("/api/orders/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: cart.total,
        items: cart.items,
        contactPhone,
        address,
      }),
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      setMessage(data.error || "Unable to initialize Razorpay checkout.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "Amravati Fashion",
      description: "Complete your order with Razorpay",
      order_id: data.order.id,
      handler: async function (paymentResponse) {
        setLoading(true);
        const confirmRes = await fetch("/api/orders/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            items: cart.items,
            total: cart.total,
            contactPhone,
            address,
            name: user?.name || "",
          }),
        });
        const confirmData = await confirmRes.json();
        setLoading(false);
        if (!confirmRes.ok || !confirmData.success) {
          setMessage(confirmData.error || "Payment could not be verified.");
          return;
        }
        dispatch(clearCart());
        router.push(`/order/${confirmData.order._id}`);
      },
      prefill: {
        contact: contactPhone,
        name: user?.name || "",
      },
      theme: {
        color: "#111",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handlePlaceOrder = async () => {
    setMessage("");

    if (!contactPhone || !/^[0-9]{10}$/.test(contactPhone.trim())) {
      setMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!address.name || !address.street || !address.city || !address.state || !address.pincode) {
      setMessage("Please fill in all address fields.");
      return;
    }

    if (!cart.items.length) {
      setMessage("Your cart is empty. Add products before checkout.");
      return;
    }

    if (!user) {
      router.push("/login?redirect=/cart");
      return;
    }

    if (paymentMethod === "RAZORPAY") {
      await handleRazorpayPayment();
      return;
    }

    setLoading(true);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.items,
        total: cart.total,
        paymentMethod: "COD",
        contactPhone,
        address,
      }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok || !data.success) {
      setMessage(data.error || "Unable to place order.");
      return;
    }

    dispatch(clearCart());
    router.push(`/order/${data.order._id}`);
  };

  return (
    <>
      <SiteNavbar />
      <div className="bg-light min-vh-100 pb-5 mb-5 mb-lg-0">
        <div className="container py-4">
          {/*  Step Indicator */}
          <div className="d-flex justify-content-center mb-5 mt-2">
            <div className="d-flex align-items-center">
              <div className={`d-flex align-items-center justify-content-center rounded-circle ${checkoutStep === 'bag' ? 'bg-dark text-white' : 'bg-success text-white'}`} style={{ width: '32px', height: '32px', fontSize: '14px', fontWeight: 'bold' }}>
                {checkoutStep === 'bag' ? '1' : <i className="bi bi-check-lg"></i>}
              </div>
              <span className={`ms-2 small fw-bold ${checkoutStep === 'bag' ? 'text-dark' : 'text-success'}`}>BAG</span>
              <div className="mx-3 bg-secondary opacity-25" style={{ width: '40px', height: '1px' }}></div>
              
              <div className={`d-flex align-items-center justify-content-center rounded-circle ${checkoutStep === 'address' ? 'bg-dark text-white' : checkoutStep === 'payment' ? 'bg-success text-white' : 'bg-white border text-muted'}`} style={{ width: '32px', height: '32px', fontSize: '14px', fontWeight: 'bold' }}>
                {checkoutStep === 'payment' ? <i className="bi bi-check-lg"></i> : '2'}
              </div>
              <span className={`ms-2 small fw-bold ${checkoutStep === 'address' ? 'text-dark' : checkoutStep === 'payment' ? 'text-success' : 'text-muted'}`}>ADDRESS</span>
              <div className="mx-3 bg-secondary opacity-25" style={{ width: '40px', height: '1px' }}></div>
              
              <div className={`d-flex align-items-center justify-content-center rounded-circle ${checkoutStep === 'payment' ? 'bg-dark text-white' : 'bg-white border text-muted'}`} style={{ width: '32px', height: '32px', fontSize: '14px', fontWeight: 'bold' }}>
                3
              </div>
              <span className={`ms-2 small fw-bold ${checkoutStep === 'payment' ? 'text-dark' : 'text-muted'}`}>PAYMENT</span>
            </div>
          </div>

          {!cart.items.length ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="bi bi-bag-x text-muted" style={{ fontSize: '5rem' }}></i>
              </div>
              <h4 className="fw-bold">Your bag is empty</h4>
              <p className="text-muted mb-4">Add some items to your bag to see them here.</p>
              <Link href="/" className="btn btn-dark px-5 py-2 fw-bold">CONTINUE SHOPPING</Link>
            </div>
          ) : (
            <div className="row g-4 justify-content-center">
              {/* 🛒 Left Column: Items or Address */}
              <div className="col-12 col-lg-7 col-xl-6">
                {checkoutStep === "bag" && (
                  <div className="card border-0 shadow-sm p-3 p-md-4 mb-4" style={{ borderRadius: '12px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="fw-bold mb-0">Shopping Bag ({cart.items.length} Items)</h5>
                      <span className="fw-bold text-dark">Total: ₹{cart.total}</span>
                    </div>

                    <div className="list-group list-group-flush">
                      {cart.items.map((item) => (
                        <div key={item.cartItemId} className="list-group-item border-0 px-0 py-3 mb-2">
                          <div className="d-flex gap-3">
                            <div className="flex-shrink-0 bg-light rounded overflow-hidden" style={{ width: '90px', height: '120px' }}>
                              <img 
                                src={getPrimaryImage(item)} 
                                alt={item.name} 
                                className="w-100 h-100" 
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            <div className="flex-grow-1 position-relative">
                              <button 
                                className="btn-close position-absolute top-0 end-0" 
                                style={{ fontSize: '10px' }}
                                onClick={() => dispatch(removeFromCart(item.cartItemId))}
                              ></button>
                              
                              <h6 className="fw-bold mb-1 pe-4">{item.name}</h6>
                              <p className="small text-muted mb-2">
                                {item.selectedSize ? `Size: ${item.selectedSize}` : 'No Size'}
                              </p>
                              
                              <div className="d-flex align-items-center gap-2 mb-3">
                                <div className="d-flex align-items-center border rounded p-1">
                                  <button 
                                    className="btn btn-sm btn-link text-dark p-0 px-2"
                                    onClick={() => dispatch(decrementQuantity(item.cartItemId))}
                                  >
                                    <i className="bi bi-dash"></i>
                                  </button>
                                  <span className="px-2 small fw-bold">{item.quantity}</span>
                                  <button 
                                    className="btn btn-sm btn-link text-dark p-0 px-2"
                                    onClick={() => dispatch(incrementQuantity(item.cartItemId))}
                                  >
                                    <i className="bi bi-plus"></i>
                                  </button>
                                </div>
                              </div>
                              
                              <div className="d-flex align-items-center gap-2">
                                <span className="fw-bold text-dark">₹{item.price * item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Inline mobile button removed - using sticky bar */}
                  </div>
                )}

                {checkoutStep === "address" && (
                  <div className="card border-0 shadow-sm p-3 p-md-4 mb-4" style={{ borderRadius: '12px' }}>
                    <div className="d-flex align-items-center mb-4">
                      <button className="btn btn-sm btn-link text-dark p-0 me-3" onClick={() => setCheckoutStep("bag")}>
                        <i className="bi bi-arrow-left fs-4"></i>
                      </button>
                      <h5 className="fw-bold mb-0">Select Delivery Address</h5>
                    </div>

                    <div className="mb-4 p-3 bg-light rounded-3 border border-dark border-opacity-10">
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-muted">CONTACT DETAILS</label>
                        <input
                          type="text"
                          className="form-control border-0 bg-white mb-2"
                          value={address.name}
                          onChange={(e) => setAddress({ ...address, name: e.target.value })}
                          placeholder="Name*"
                        />
                        <input
                          type="tel"
                          className="form-control border-0 bg-white"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="Mobile No*"
                        />
                      </div>

                      <div>
                        <label className="form-label small fw-bold text-muted">ADDRESS</label>
                        <input
                          type="text"
                          className="form-control border-0 bg-white mb-2"
                          value={address.pincode}
                          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                          placeholder="Pincode*"
                        />
                        <input
                          type="text"
                          className="form-control border-0 bg-white mb-2"
                          value={address.street}
                          onChange={(e) => setAddress({ ...address, street: e.target.value })}
                          placeholder="Address (House No, Building, Street, Area)*"
                        />
                        <div className="row g-2">
                          <div className="col-6">
                            <input
                              type="text"
                              className="form-control border-0 bg-white"
                              value={address.city}
                              onChange={(e) => setAddress({ ...address, city: e.target.value })}
                              placeholder="Locality/Town*"
                            />
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              className="form-control border-0 bg-white"
                              value={address.state}
                              onChange={(e) => setAddress({ ...address, state: e.target.value })}
                              placeholder="State*"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Inline mobile button removed - using sticky bar */}
                  </div>
                )}

                {checkoutStep === "payment" && (
                  <div className="card border-0 shadow-sm p-3 p-md-4 mb-4" style={{ borderRadius: '12px' }}>
                    <div className="d-flex align-items-center mb-4">
                      <button className="btn btn-sm btn-link text-dark p-0 me-3" onClick={() => setCheckoutStep("address")}>
                        <i className="bi bi-arrow-left fs-4"></i>
                      </button>
                      <h5 className="fw-bold mb-0">Choose Payment Method</h5>
                    </div>

                    <div className="mb-4">
                      <div 
                        className={`p-3 border rounded-3 mb-3 cursor-pointer d-flex align-items-center ${paymentMethod === 'COD' ? 'border-dark bg-light' : ''}`}
                        onClick={() => setPaymentMethod('COD')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className={`rounded-circle border me-3 d-flex align-items-center justify-content-center ${paymentMethod === 'COD' ? 'bg-dark border-dark' : 'bg-white'}`} style={{ width: '20px', height: '20px' }}>
                          {paymentMethod === 'COD' && <div className="bg-white rounded-circle" style={{ width: '8px', height: '8px' }}></div>}
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">Cash On Delivery (COD)</h6>
                          <p className="small text-muted mb-0">Pay when you receive your order</p>
                        </div>
                        <i className="bi bi-cash-stack ms-auto fs-4"></i>
                      </div>

                      <div 
                        className={`p-3 border rounded-3 cursor-pointer d-flex align-items-center ${paymentMethod === 'RAZORPAY' ? 'border-dark bg-light' : ''}`}
                        onClick={() => setPaymentMethod('RAZORPAY')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className={`rounded-circle border me-3 d-flex align-items-center justify-content-center ${paymentMethod === 'RAZORPAY' ? 'bg-dark border-dark' : 'bg-white'}`} style={{ width: '20px', height: '20px' }}>
                          {paymentMethod === 'RAZORPAY' && <div className="bg-white rounded-circle" style={{ width: '8px', height: '8px' }}></div>}
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">Razorpay (Online Payment)</h6>
                          <p className="small text-muted mb-0">Pay securely via Cards, UPI, Netbanking</p>
                        </div>
                        <i className="bi bi-credit-card ms-auto fs-4"></i>
                      </div>
                    </div>

                    {/* Inline mobile button removed - using sticky bar */}
                    
                    {message && <div className="alert alert-danger mt-3 py-2 small">{message}</div>}
                  </div>
                )}
              </div>

              {/* 💰 Right Column: Price Details */}
              <div className="col-12 col-lg-4 col-xl-3">
                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
                  <h6 className="fw-bold text-muted small mb-4" style={{ letterSpacing: '1px' }}>PRICE DETAILS ({cart.items.length} Items)</h6>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Bag Total</span>
                    <span className="text-dark">₹{cart.total}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Delivery Fee</span>
                    <span className="text-dark"><s>₹99</s> <span className="text-success fw-bold">FREE</span></span>
                  </div>
                  
                  <hr className="my-3 opacity-10" />
                  
                  <div className="d-flex justify-content-between mb-4">
                    <span className="fw-bold text-dark fs-5">Total Amount</span>
                    <span className="fw-bold text-dark fs-5">₹{cart.total}</span>
                  </div>

                  {checkoutStep === "bag" && (
                    <button 
                      className="btn btn-dark w-100 py-3 fw-bold d-none d-lg-block" 
                      style={{ letterSpacing: '1px' }}
                      onClick={() => {
                        if (!user) {
                          router.push(`/login?redirect=/cart`);
                        } else {
                          setCheckoutStep("address");
                        }
                      }}
                    >
                      {user ? 'PROCEED TO ADDRESS' : 'LOGIN TO PROCEED'}
                    </button>
                  )}

                  {checkoutStep === "address" && (
                    <button 
                      className="btn btn-dark w-100 py-3 fw-bold d-none d-lg-block" 
                      style={{ letterSpacing: '1px' }}
                      onClick={() => setCheckoutStep("payment")}
                    >
                      PROCEED TO PAYMENT
                    </button>
                  )}

                  {checkoutStep === "payment" && (
                    <button 
                      className="btn btn-dark w-100 py-3 fw-bold d-none d-lg-block" 
                      style={{ letterSpacing: '1px' }}
                      disabled={loading}
                      onClick={handlePlaceOrder}
                    >
                      {loading ? 'PROCESSING...' : paymentMethod === 'COD' ? 'PLACE ORDER' : 'PAY NOW'}
                    </button>
                  )}
                </div>
                
                <div className="mt-4 text-center">
                  <div className="d-flex justify-content-center gap-3 opacity-50 grayscale">
                    <img src="https://constant.myntassets.com/checkout/assets/img/footer-bank-ssl.png" height="20" alt="SSL" />
                    <img src="https://constant.myntassets.com/checkout/assets/img/footer-bank-visa.png" height="20" alt="Visa" />
                    <img src="https://constant.myntassets.com/checkout/assets/img/footer-bank-mc.png" height="20" alt="Mastercard" />
                    <img src="https://constant.myntassets.com/checkout/assets/img/footer-bank-ae.png" height="20" alt="Amex" />
                  </div>
                  <p className="small text-muted mt-3 mb-0">100% SECURE PAYMENTS</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 📱 Mobile Sticky Bottom Bar */}
      {cart.items.length > 0 && (
        <div className="d-lg-none fixed-bottom bg-white border-top shadow-lg p-3">
          <div className="container p-0">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex flex-column">
                <span className="fw-bold text-dark fs-5">₹{cart.total}</span>
                <span className="text-success small fw-bold" style={{ fontSize: '11px' }}>VIEW DETAILS</span>
              </div>
              <div style={{ width: '60%' }}>
                {checkoutStep === "bag" && (
                  <button 
                    className="btn btn-dark w-100 py-2 fw-bold" 
                    onClick={() => {
                      if (!user) {
                        router.push(`/login?redirect=/cart`);
                      } else {
                        setCheckoutStep("address");
                      }
                    }}
                  >
                    {user ? 'PROCEED' : 'LOGIN'}
                  </button>
                )}
                {checkoutStep === "address" && (
                  <button 
                    className="btn btn-dark w-100 py-2 fw-bold" 
                    onClick={() => setCheckoutStep("payment")}
                  >
                    CONTINUE
                  </button>
                )}
                {checkoutStep === "payment" && (
                   <button 
                     className="btn btn-dark w-100 py-2 fw-bold" 
                     disabled={loading}
                     onClick={handlePlaceOrder}
                   >
                     {loading ? '...' : paymentMethod === 'COD' ? 'PLACE ORDER' : 'PAY NOW'}
                   </button>
                 )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
