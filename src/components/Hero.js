export default function Hero() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = "";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div
      className="d-flex align-items-center text-center position-relative"
      style={{
        minHeight: "65vh",
        backgroundImage: "url('/images/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "white",
      }}
    >
      {/* ✅ DARK OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.42)", // 
          backdropFilter: "blur(6px)",
          zIndex: 1,
        }}
      />

      {/* ✅ CONTENT */}
      <div className="container position-relative" style={{ zIndex: 2 }}>

        <h1
          className="fw-bold"
          style={{
            fontSize: "clamp(1.8rem, 5vw, 3rem)",
          }}
        >
          Upgrade Your Style
        </h1>

        <p
          className="text-light mt-2 mx-auto"
          style={{
            fontSize: "clamp(0.9rem, 3vw, 1.2rem)",
            maxWidth: "400px",
          }}
        >
          T-Shirts, Jeans & Pathani Collection
        </p>

        <div className="mt-3 d-flex flex-column flex-sm-row gap-2 justify-content-center">
          <a
            href={whatsappUrl}
            className="btn btn-warning px-4 w-100 w-sm-auto"
          >
            Chat on WhatsApp
          </a>

          <a
            href="#products"
            className="btn btn-outline-light px-4 w-100 w-sm-auto"
          >
            Explore Collection
          </a>
        </div>

      </div>
    </div>
  );
}