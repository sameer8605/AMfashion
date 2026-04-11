import SiteNavbar from "@/components/SiteNavbar";

export default function AboutUs() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    "Hello, I would like to know more about Amravati Fashion."
  )}`;

  return (
    <div>
      <SiteNavbar />
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <h1 className="fw-bold mb-3">About Us</h1>
            <p className="lead text-muted">
              Amravati Fashion brings the latest styles to the local community with a
              focus on quality, value, and friendly service. We carefully curate
              clothing and accessories so you can shop with confidence.
            </p>
            <p className="text-muted">
              Our store is built around convenience — from browsing our collections
              online to shopping through WhatsApp. We are committed to making
              fashion easy and accessible for everyone in Amravati.
            </p>
            <div className="mt-4">
              <a
                href={whatsappUrl}
                className="btn btn-success"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat with us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
