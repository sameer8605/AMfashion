"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useSelector } from "@/redux/hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Sub-component to handle search logic safely with useSearchParams
function SearchBar({ searchTerm, handleSearch, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit} className="w-100">
      <div className="input-group input-group-sm bg-light rounded-2 border">
        <span className="input-group-text bg-transparent border-0 pe-1">
          <i className="bi bi-search text-muted" style={{ fontSize: "0.8rem" }}></i>
        </span>
        <input
          type="text"
          className="form-control border-0 bg-transparent py-2 shadow-none"
          placeholder="Search for Products, Categories..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ fontSize: "0.85rem" }}
        />
        <button 
          type="submit" 
          className="btn btn-link text-muted p-0 pe-2 border-0 shadow-none"
          aria-label="Submit search"
        >
          <i className="bi bi-arrow-right-short fs-5"></i>
        </button>
      </div>
    </form>
  );
}

// Internal component that uses search hooks
function NavbarContent({ fixedNav }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent("")}`;

  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState(() => {
  return typeof window !== "undefined" 
    ? new URLSearchParams(window.location.search).get("search") || "" 
    : "";
});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsMounted(true);
      // Initialize searchTerm from URL on mount
      const urlSearch = searchParams?.get("search") || "";
      setSearchTerm(urlSearch);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update searchTerm when URL param changes (e.g., user clears it or goes back)
  // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    } else {
      params.delete("search");
    }
    
    if (pathname === "/") {
      router.replace(`/?${params.toString()}`, { scroll: false });
    } else {
      router.push(`/?${params.toString()}`);
    }
  };

  useEffect(() => {
    if (!isMounted) return;
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        if (parsedUser && typeof parsedUser === 'object') {
          setTimeout(() => {
            setUser(parsedUser);
          }, 0);
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("currentUser");
      }
    }
  }, [isMounted]);

  const cartCount = useSelector((state) => state.cart.items.length || 0);
  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("currentUser");
    setUser(null);
    setIsNavCollapsed(true);
  };

  const navbarClass = fixedNav ? "navbar fixed-top" : "navbar sticky-top";
  const navbarStyle = fixedNav
    ? { padding: "0 0", position: "fixed", top: 0, left: 0, right: 0, width: "100%", zIndex: 2000, background: "white", height: "auto" }
    : { padding: "0 0", background: "white", height: "auto" };

  if (!isMounted) {
    return (
      <nav className={navbarClass} style={navbarStyle}>
        <div className="container d-flex align-items-center py-2" style={{ height: "62px" }}>
          <div className="spinner-border spinner-border-sm text-muted" role="status"></div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className={navbarClass} style={navbarStyle}>
        <div className="container d-flex flex-column py-2">
          {/* Top Row: Logo, Icons, Burger */}
          <div className="d-flex align-items-center justify-content-between w-100 mb-2 mb-lg-0">
            <Link href="/" className="navbar-brand d-flex align-items-center me-0 me-lg-4" style={{ gap: "8px" }}>
              <Image src="/images/citykart.png" alt="Logo" width={30} height={30} priority style={{ borderRadius: "6px" }} />
              <span style={{ fontWeight: 700, fontSize: "1rem", color: "#111", letterSpacing: "0.2px" }}>CityKart</span>
            </Link>

            <div className="d-none d-lg-flex align-items-center" style={{ gap: "24px" }}>
              <div className="position-relative me-3" style={{ width: "350px" }}>
                <SearchBar
                key={searchParams?.get("search")}
                 searchTerm={searchTerm} handleSearch={handleSearch} handleSubmit={handleSubmit} />
              </div>
              <Link href="/" className="nav-desktop-link">Home</Link>
              <Link href="/aboutus" className="nav-desktop-link">About</Link>
              <Link href="/cart" className="nav-desktop-link position-relative">
                <span className="bi bi-cart"></span>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{cartCount}</span>
              </Link>
              {user ? (
                <button type="button" className="nav-desktop-link btn btn-link p-0" onClick={handleLogout} style={{ color: "#111", textDecoration: "none" }}>Logout</button>
              ) : (
                <Link href={`/login?redirect=${pathname}`} className="nav-desktop-link">Login</Link>
              )}
            </div>

            <div className="d-flex align-items-center d-lg-none" style={{ gap: "12px" }}>
              <Link href="/cart" className="nav-desktop-link position-relative p-2">
                <span className="bi bi-cart fs-5"></span>
                {cartCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.65rem", padding: "0.35em 0.5em" }}>{cartCount}</span>}
              </Link>
              <button type="button" className={`burger-btn ${!isNavCollapsed ? "open" : ""}`} onClick={handleNavCollapse}>
                <span className="burger-line" />
                <span className="burger-line" />
                <span className="burger-line" />
              </button>
            </div>
          </div>

          {/* Bottom Row (Mobile Only): Full Width Search Bar */}
          <div className="d-lg-none w-100 px-1 mt-1">
            <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} handleSubmit={handleSubmit} />
          </div>
        </div>
      </nav>

      <div className={`mobile-menu-overlay d-lg-none ${!isNavCollapsed ? "open" : ""}`} aria-hidden={isNavCollapsed} role="dialog" aria-modal="true" aria-label="Navigation menu">
        <div className="mobile-menu-panel">
          <div className="mobile-menu-header">
            <span className="mobile-menu-brand">AM Fashion</span>
            <div className="d-flex align-items-center" style={{ gap: "16px" }}>
              <Link href="/cart" className="position-relative p-1 text-white" onClick={() => setIsNavCollapsed(true)}>
                <span className="bi bi-cart fs-4"></span>
                {cartCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.6rem", padding: "0.3em 0.45em" }}>{cartCount}</span>}
              </Link>
              <button type="button" className="mobile-menu-close" onClick={() => setIsNavCollapsed(true)} aria-label="Close menu">
                <span className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>
          </div>
          <nav className="mobile-menu-nav" aria-label="Main navigation">
            <Link href="/" className="mobile-nav-link" onClick={() => setIsNavCollapsed(true)}><span className="mobile-nav-num">01</span>Home</Link>
            <div className="mobile-menu-divider" role="separator" />
            <Link href="/#products" className="mobile-nav-link" onClick={() => setIsNavCollapsed(true)}><span className="mobile-nav-num">02</span>Shop</Link>
            <div className="mobile-menu-divider" role="separator" />
            <Link href="/aboutus" className="mobile-nav-link" onClick={() => setIsNavCollapsed(true)}><span className="mobile-nav-num">03</span>About</Link>
            <div className="mobile-menu-divider" role="separator" />
            <Link href="/contactus" className="mobile-nav-link" onClick={() => setIsNavCollapsed(true)}><span className="mobile-nav-num">04</span>Contact</Link>
            <div className="mobile-menu-divider" role="separator" />
            {user ? (
              <>
                <Link href="/orders" className="mobile-nav-link" onClick={() => setIsNavCollapsed(true)}><span className="mobile-nav-num">05</span>My Orders</Link>
                <div className="mobile-menu-divider" role="separator" />
                <button type="button" className="mobile-nav-link border-0 bg-transparent text-start w-100" onClick={() => { handleLogout(); setIsNavCollapsed(true); }}><span className="mobile-nav-num">06</span>Logout</button>
              </>
            ) : (
              <Link href={`/login?redirect=${pathname}`} className="mobile-nav-link" onClick={() => setIsNavCollapsed(true)}><span className="mobile-nav-num">05</span>Login</Link>
            )}
          </nav>
          <div className="mobile-menu-footer">
            <span className="mobile-menu-footer-label">Chat with us</span>
            <a href={whatsappUrl} className="mobile-menu-whatsapp" target="_blank" rel="noopener noreferrer" onClick={() => setIsNavCollapsed(true)}>
              <span className="bi bi-whatsapp" aria-hidden="true" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

// Main SiteNavbar component with Suspense wrapper
export default function SiteNavbar({ fixedNav = false }) {
  return (
    <Suspense fallback={
      <nav className={fixedNav ? "navbar fixed-top" : "navbar sticky-top"} style={{ padding: "0 0", background: "white" }}>
        <div className="container d-flex align-items-center py-2" style={{ height: "62px" }}>
          <div className="spinner-border spinner-border-sm text-muted" role="status"></div>
        </div>
      </nav>
    }>
      <NavbarContent fixedNav={fixedNav} />
    </Suspense>
  );
}
