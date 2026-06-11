"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/map", label: "Map" },
  { href: "/bookings", label: "Bookings" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link href="/" className="navbar-brand">
          Rajseba
        </Link>

        {/* Center Nav Links */}
        <nav className="navbar-nav">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`navbar-link ${isActive ? "navbar-link--active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth Buttons */}
        <div className="navbar-auth">
          <Link href="/login" className="navbar-login">
            Login
          </Link>
          <Link href="/signup" className="navbar-signup">
            Signup
          </Link>
        </div>
      </div>
    </header>
  );
}
