"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const serviceCategories = [
  { id: "premium-deep-cleaning", label: "Cleaning", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2l-6 6"/><path d="M15.5 15.5L10 21l-4-4L11.5 11.5"/><path d="M21 3l-6 6"/></svg> },
  { id: "master-ac-service", label: "AC Repair", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="12" y1="2" x2="16" y2="6"></line><line x1="12" y1="2" x2="8" y2="6"></line><line x1="12" y1="22" x2="16" y2="18"></line><line x1="12" y1="22" x2="8" y2="18"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="12" x2="6" y2="8"></line><line x1="2" y1="12" x2="6" y2="16"></line><line x1="22" y1="12" x2="18" y2="8"></line><line x1="22" y1="12" x2="18" y2="16"></line><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line><line x1="4.93" y1="19.07" x2="19.07" y2="4.93"></line></svg> },
  { id: "expert-plumbing", label: "Plumbing", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg> },
  { id: "electrical-solution", label: "Electrical", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> },
  { id: "luxe-painting", label: "Painting", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2v4"/><path d="M21 2v4"/><path d="M14 6h8v6h-8z"/><path d="M14 8H7a2 2 0 0 0-2 2v6"/><path d="M9 16v6h2v-6z"/></svg> },
  { id: "cctv", label: "CCTV", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> },
  { id: "premium-shifting", label: "Shifting", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg> },
  { id: "appliance-repair", label: "Appliance Repair", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/><line x1="2" y1="2" x2="22" y2="22"/></svg> },
];

const trendingServices = [
  {
    id: "premium-deep-cleaning",
    title: "Premium Deep Cleaning",
    description:
      "Full home sanitization using eco-friendly industrial equipment. Perfect for move-ins or seasonal refreshes.",
    image: "/images/service/service-1.png",
    rating: 4.9,
    reviews: "2.4k",
    price: 4500,
    badge: "MOST BOOKED",
    featured: true,
  },
  {
    id: "master-ac-service",
    title: "Master AC Service",
    description:
      "Comprehensive cleaning and gas top-up for all split brands.",
    image: "/images/service/service-2.png",
    rating: 4.8,
    reviews: "1.8k",
    price: 1200,
    badge: null,
    featured: false,
  },
];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("ac-repair");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      {/* Hero Section */}
      <section className="services-hero">
        <div className="services-hero-content">
          <h1 className="services-title">Find the best home <span className="text-[#ff5a5f]">services</span></h1>
          <p className="services-subtitle">
            Premium, reliable, and effortless solutions for your urban lifestyle
            in Bangladesh.
          </p>

          {/* Search Bar */}
          <div className="services-search-bar">
            <div className="services-search-input-wrapper">
              <svg
                className="services-search-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                id="service-search"
                type="text"
                placeholder="What service do you need?"
                className="services-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="services-search-location">
              <svg
                className="services-location-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="services-location-text">Dhaka, BD</span>
            </div>
            <button
              id="filter-button"
              className="services-filter-btn"
              aria-label="Filter services"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-col gap-4 mt-4 w-full items-center">
            {/* First Row: 5 items */}
            <div className="flex flex-wrap justify-center gap-4">
              {serviceCategories.slice(0, 5).map((cat) => (
                <Link
                  href={`/services/${cat.id}`}
                  key={cat.id}
                  id={`category-${cat.id}`}
                  className={`services-category-pill ${
                    activeCategory === cat.id
                      ? "services-category-pill--active !border-[#ff5a5f] !text-[#ff5a5f] !bg-[#fff0ef]"
                      : "text-gray-700 no-underline"
                  }`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span className="services-category-icon">{cat.icon}</span>
                  {cat.label}
                </Link>
              ))}
            </div>
            {/* Second Row: 3 items */}
            <div className="flex flex-wrap justify-center gap-4">
              {serviceCategories.slice(5).map((cat) => (
                <Link
                  href={`/services/${cat.id}`}
                  key={cat.id}
                  id={`category-${cat.id}`}
                  className={`services-category-pill ${
                    activeCategory === cat.id
                      ? "services-category-pill--active !border-[#ff5a5f] !text-[#ff5a5f] !bg-[#fff0ef]"
                      : "text-gray-700 no-underline"
                  }`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span className="services-category-icon">{cat.icon}</span>
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Services Section */}
      <section className="trending-section">
        <div className="trending-container">
          {/* Section Header */}
          <div className="trending-header">
            <div>
              <h2 className="trending-title">Trending Services</h2>
              <p className="trending-subtitle">
                Highly requested by residents in Dhaka this month
              </p>
            </div>
            <Link href="/services/trending" className="trending-view-all">
              View all →
            </Link>
          </div>

          {/* Service Cards */}
          <div className="trending-grid">
            {/* Featured Large Card */}
            {trendingServices
              .filter((s) => s.featured)
              .map((service) => (
                <div key={service.id} className="trending-card-featured">
                  <div className="trending-card-featured-image">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    {service.badge && (
                      <span className="trending-badge">{service.badge}</span>
                    )}
                  </div>
                  <div className="trending-card-featured-info">
                    <div className="trending-rating">
                      <span className="trending-stars">★★★★★</span>
                      <span className="trending-rating-text">
                        ({service.rating}/5 • {service.reviews} reviews)
                      </span>
                    </div>
                    <h3 className="trending-card-title">{service.title}</h3>
                    <p className="trending-card-desc">{service.description}</p>
                    <div className="trending-card-footer">
                      <div className="trending-price">
                        <span className="trending-price-label">
                          STARTING FROM
                        </span>
                        <span className="trending-price-value">
                          ৳{service.price.toLocaleString()}
                        </span>
                      </div>
                      <Link href={`/services/${service.id}`} className="trending-book-btn">Book Now</Link>
                    </div>
                  </div>
                </div>
              ))}

            {/* Smaller Cards */}
            {trendingServices
              .filter((s) => !s.featured)
              .map((service) => (
                <div key={service.id} className="trending-card-small">
                  <div className="trending-card-small-image">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="trending-card-small-info">
                    <div className="trending-card-small-header">
                      <h3 className="trending-card-small-title">
                        {service.title}
                      </h3>
                      <span className="trending-rating-badge">
                        ★ {service.rating}
                      </span>
                    </div>
                    <p className="trending-card-small-desc">
                      {service.description}
                    </p>
                    <div className="trending-card-small-footer">
                      <span className="trending-price-value-small">
                        ৳{service.price.toLocaleString()}
                      </span>
                      <Link
                        href={`/services/${service.id}`}
                        className="trending-arrow-btn"
                        aria-label={`View ${service.title}`}
                      >
                        →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Service Listings Section */}
      <ServiceListings />
    </>
  );
}

/* ============================
   SERVICE LISTINGS DATA
   ============================ */
const serviceListings = [
  {
    id: "premium-deep-cleaning",
    title: "Premium Deep Cleaning",
    description: "Complete sanitation for houses & offices.",
    image: "/images/service/cleaning.png",
    category: "Cleaning",
    price: "৳1,500",
    done: "1.2k+ done",
  },
  {
    id: "master-ac-service",
    title: "Master AC Service",
    description: "Jet wash, gas refill & master repair.",
    image: "/images/service/ac.png",
    category: "AC Repair",
    price: "৳1,200",
    done: "850+ done",
  },
  {
    id: "expert-plumbing",
    title: "Expert Plumbing",
    description: "Leak fixing, pipe installation & drainage.",
    image: "/images/service/plumbing.png",
    category: "Plumbing",
    price: "৳800",
    done: "520+ done",
  },
  {
    id: "electrical-solution",
    title: "Electrical Solution",
    description: "Wiring, socket repair & appliance setup.",
    image: "/images/service/electrical.png",
    category: "Electrical",
    price: "৳900",
    done: "910+ done",
  },
  {
    id: "luxe-painting",
    title: "Luxe Painting",
    description: "Interior & exterior wall painting solutions.",
    image: "/images/service/luxe.png",
    category: "Painting",
    price: "৳5,000",
    done: "315+ done",
  },
  {
    id: "premium-shifting",
    title: "Premium Shifting",
    description: "Hassle-free home & office moving.",
    image: "/images/service/shifting.png",
    category: "Shifting",
    price: "৳4,500",
    done: "1.1k+ done",
  },
  {
    id: "safe-pest-control",
    title: "Safe Pest Control",
    description: "Eco-friendly pest & termite control.",
    image: "/images/service/pest.png",
    category: "Pest Control",
    price: "৳2,000",
    done: "640+ done",
  },
  {
    id: "appliance-repair",
    title: "Appliance Repair",
    description: "Fridge, Oven & Microwave servicing.",
    image: "/images/service/appliance.png",
    category: "Appliance",
    price: "৳1,000",
    done: "290+ done",
  },
];

/* ============================
   SERVICE LISTINGS COMPONENT
   ============================ */
function ServiceListings() {
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("popularity");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceMax, setPriceMax] = useState(10000);

  const PRICE_FLOOR = 500;
  const PRICE_CEIL = 10000;

  const handleMaxChange = (val: number) => {
    setPriceMax(val);
  };

  const handleClear = () => {
    setPriceMax(PRICE_CEIL);
    setSelectedRating(null);
    setSortBy("popularity");
  };

  const fillRight = ((priceMax - PRICE_FLOOR) / (PRICE_CEIL - PRICE_FLOOR)) * 100;

  return (
    <section className="listings-section">
      <div className="listings-container">
        {/* Filters Sidebar */}
        <aside className="listings-filters">
          <div className="filters-header">
            <h3 className="filters-title">Filters</h3>
            <button className="filters-clear" onClick={handleClear}>Clear</button>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <h4 className="filter-label">PRICE RANGE</h4>
            <div className="filter-range-slider">
              <div className="filter-range-track">
                <div
                  className="filter-range-fill"
                  style={{ left: `0%`, width: `${fillRight}%` }}
                />
              </div>
              <input
                type="range"
                className="filter-range-input single-range"
                min={PRICE_FLOOR}
                max={PRICE_CEIL}
                step={100}
                value={priceMax}
                onChange={(e) => handleMaxChange(Number(e.target.value))}
                aria-label="Maximum price"
              />
            </div>
            <div className="filter-price-range">
              <span>৳{PRICE_FLOOR.toLocaleString()}</span>
              <span>৳{priceMax.toLocaleString()}</span>
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="filter-group">
            <h4 className="filter-label">MINIMUM RATING</h4>
            <div className="filter-radio-group">
              <label className="filter-radio">
                <input
                  type="radio"
                  name="rating"
                  value="4.5"
                  checked={selectedRating === "4.5"}
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <span className="filter-radio-circle" />
                <span>4.5 &amp; up</span>
              </label>
              <label className="filter-radio">
                <input
                  type="radio"
                  name="rating"
                  value="4.0"
                  checked={selectedRating === "4.0"}
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <span className="filter-radio-circle" />
                <span>4.0 &amp; up</span>
              </label>
            </div>
          </div>

          {/* Sort By */}
          <div className="filter-group">
            <h4 className="filter-label">SORT BY</h4>
            <select
              id="sort-by"
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </aside>

        {/* Service Cards Grid */}
        <div className="listings-content">
          <div className="listings-grid">
            {serviceListings.slice((currentPage - 1) * 6, currentPage * 6).map((service) => (
              <Link href={`/services/${service.id}`} key={service.id} className="listing-card">
                <div className="listing-card-image">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <span className="listing-card-category">
                    {service.category}
                  </span>
                </div>
                <div className="listing-card-info">
                  <h3 className="listing-card-title">{service.title}</h3>
                  <p className="listing-card-desc">{service.description}</p>
                  <div className="listing-card-footer">
                    <span className="listing-card-price">{service.price}</span>
                    <span className="listing-card-done">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      {service.done}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="listings-pagination">
            <button
              className="pagination-arrow"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              ‹
            </button>
            {Array.from({ length: Math.ceil(serviceListings.length / 6) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-num ${currentPage === page ? "pagination-num--active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-arrow"
              disabled={currentPage === Math.ceil(serviceListings.length / 6)}
              onClick={() => setCurrentPage((p) => Math.min(Math.ceil(serviceListings.length / 6), p + 1))}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
