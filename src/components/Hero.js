export default function Hero() {
  return (
    <div
      className="d-flex align-items-center text-center"
      style={{
        minHeight: "65vh",
        background: "linear-gradient(135deg, #111, #333)",
        color: "white",
      }}
    >
      <div className="container">

        {/* Heading */}
        <h1
          className="fw-bold"
          style={{
            fontSize: "clamp(1.8rem, 5vw, 3rem)",
          }}
        >
          Upgrade Your Style
        </h1>

        {/* Subtext */}
        <p
          className="text-light mt-2 mx-auto"
          style={{
            fontSize: "clamp(0.9rem, 3vw, 1.2rem)",
            maxWidth: "400px",
          }}
        >
          T-Shirts, Jeans & Pathani Collection
        </p>

        {/* Buttons */}
        <div className="mt-3 d-flex flex-column flex-sm-row gap-2 justify-content-center">
          
          <a
            href="https://wa.me/91XXXXXXXXXX"
            className="btn btn-warning px-4 w-100 w-sm-auto"
          >
            Shop on WhatsApp
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