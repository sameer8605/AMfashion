import SiteNavbar from "@/components/SiteNavbar";

export default function ContactUs() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    "Hello, I would like to contact Amravati Fashion."
  )}`;

  return (
    <div>
      <SiteNavbar />
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <h1 className="fw-bold mb-3">Contact Us</h1>
            <p className="lead text-muted">
              Have questions about our products, order process, or delivery?
              Reach out and we will respond as quickly as possible.
            </p>
            <div className="mb-3">
              <p className="mb-1">
                <strong>Email:</strong> support@amravatiashion.com
              </p>
              <p className="mb-1">
                <strong>Phone:</strong> <a href={`tel:${phone}`}>{phone}</a>
              </p>
              <p>
                <strong>Location:</strong> Amravati, India
              </p>
            </div>
            <a
              href={whatsappUrl}
              className="btn btn-success"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
