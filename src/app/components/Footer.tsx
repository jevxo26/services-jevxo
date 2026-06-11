import Link from "next/link";

const footerLinks = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
  { href: "#", label: "Help Center" },
  { href: "#", label: "Contact Us" },
  { href: "#", label: "Partner with Us" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <Link href="/" className="footer-brand">
          Rajseba
        </Link>
        <div className="footer-links">
          {footerLinks.map((link) => (
            <Link key={link.label} href={link.href} className="footer-link">
              {link.label}
            </Link>
          ))}
        </div>
        <p className="footer-copyright">
          © 2024 Rajseba. All rights reserved. Premium Home Services in Bangladesh.
        </p>
      </div>
    </footer>
  );
}
