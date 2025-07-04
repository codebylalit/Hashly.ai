import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../logo4.png";

const navLinks = [
  { to: "/try", label: "Try Free" },
  { to: "/blog", label: "Blogs" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
  // {
  //   to: "https://play.google.com/store/apps/details?id=com.caps.ai",
  //   label: "Download App",
  //   external: true,
  // },
];
const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsNavbarVisible(true);
      } else {
        setIsNavbarVisible(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`w-full bg-background-main border-b border-border-light shadow-sm sticky top-0 z-50 backdrop-blur-sm transition-all duration-300 ${isNavbarVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`} style={{ willChange: 'transform' }}>
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={logo}
            alt="Hashly logo"
            className="h-28 w-28 object-contain"
          />
        </Link>
        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-4">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.to}
                href={link.to}
                className="text-sm font-medium px-3 py-2 rounded transition-colors duration-150 text-primary-main hover:bg-accent-teal"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium px-3 py-2 rounded transition-colors duration-150 ${
                  location.pathname === link.to
                    ? "bg-accent-teal text-white"
                    : "text-primary-main hover:bg-accent-teal"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>
        {/* Hamburger for mobile */}
        <button
          className="sm:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent-teal"
          onClick={() => setMenuOpen((m) => !m)}
          aria-label="Open menu"
        >
          <svg
            className="h-6 w-6 text-primary-main"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden bg-background-card border-b border-border-light shadow-md">
          <div className="flex flex-col items-stretch px-4 py-2">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.to}
                  href={link.to}
                  className="text-base font-medium px-3 py-2 rounded transition-colors duration-150 mb-1 text-primary-main hover:bg-accent-beige"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`text-base font-medium px-3 py-2 rounded transition-colors duration-150 mb-1 ${
                    location.pathname === link.to
                      ? "bg-accent-beige text-primary-main"
                      : "text-primary-main hover:bg-accent-beige"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
