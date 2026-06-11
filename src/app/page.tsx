import Link from "next/link";

export default function Home() {
  return (
    <section className="home-hero">
      <div className="home-hero-content">
        <h1 className="home-title">
          Your trusted partner for
          <span className="home-title-accent"> home services</span>
        </h1>
        <p className="home-subtitle">
          Premium, reliable, and effortless solutions for your urban lifestyle in
          Bangladesh. Book cleaning, repairs, and more with just a few clicks.
        </p>
        <div className="home-cta-group">
          <Link href="/services" className="home-cta-primary">
            Explore Services
          </Link>
          <Link href="/signup" className="home-cta-secondary">
            Get Started
          </Link>
        </div>

        {/* Stats */}
        <div className="home-stats">
          <div className="home-stat">
            <span className="home-stat-number">500+</span>
            <span className="home-stat-label">Service Providers</span>
          </div>
          <div className="home-stat-divider" />
          <div className="home-stat">
            <span className="home-stat-number">10K+</span>
            <span className="home-stat-label">Happy Customers</span>
          </div>
          <div className="home-stat-divider" />
          <div className="home-stat">
            <span className="home-stat-number">15+</span>
            <span className="home-stat-label">Service Categories</span>
          </div>
        </div>
      </div>
    </section>
  );
}
