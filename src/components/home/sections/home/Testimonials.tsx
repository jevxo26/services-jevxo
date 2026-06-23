"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Loader2 } from "lucide-react";
import { useGetPublicReviewsQuery } from "@/redux/features/landing/landingApi";

// Fallback testimonials (shown if no reviews in DB yet)
const FALLBACK_TESTIMONIALS = [
  {
    name: "Adnan Sami",
    location: "Gulshan, Dhaka",
    rating: 5,
    comment: "The AC service was professional and on-time. Best experience in Dhaka so far.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
  },
  {
    name: "Mehjabin R.",
    location: "Uttara, Dhaka",
    rating: 5,
    comment: "Finding a reliable plumber was impossible before Rajseba. Life-changing app!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
  },
  {
    name: "Saif Islam",
    location: "Banani, Dhaka",
    rating: 5,
    comment: "Fast, reliable and high-quality cleaning service. I highly recommend them to everyone.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
  },
  {
    name: "Tasnim Jahan",
    location: "Dhanmondi, Dhaka",
    rating: 5,
    comment: "Very satisfied with the plumbing repair. They diagnosed the leak quickly and fixed it at a very reasonable price.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
  },
  {
    name: "Adnan Chowdhury",
    location: "Mirpur, Dhaka",
    rating: 5,
    comment: "Courteous electricians who fixed my wiring issues professionally. They even cleaned up after completing the service.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
  },
  {
    name: "Sabrina Yasmin",
    location: "Dhanmondi, Dhaka",
    rating: 5,
    comment: "I booked a deep cleaning service and they exceeded expectations. Spotless corners, clean smell, and great team!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1024);

  const { data: reviewsRes, isLoading } = useGetPublicReviewsQuery();
  const rawReviews: any[] = reviewsRes?.data || (Array.isArray(reviewsRes) ? reviewsRes : []);

  // Map backend reviews to testimonial shape; use fallback if none
  const testimonials = rawReviews.length > 0
    ? rawReviews.map((r: any) => ({
        name: r.user?.name || "Valued Customer",
        location: r.user?.profile?.address || "Dhaka, Bangladesh",
        rating: r.rating || 5,
        comment: r.comment || r.content || r.review || "",
        avatar: r.user?.profile?.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user?.name || "U")}&background=FF5A5F&color=fff&size=100`,
      }))
    : FALLBACK_TESTIMONIALS;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const N = testimonials.length;
  const cardsToShow = windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : 3;
  const maxIndex = Math.max(0, N - cardsToShow);

  useEffect(() => {
    if (activeIndex > maxIndex) setActiveIndex(maxIndex);
  }, [cardsToShow, maxIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [maxIndex]);

  return (
    <div className="py-12 md:py-16 mt-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-rose-50">
              <MessageSquare className="w-6 h-6 text-[#FF5A5F]" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">
              Real Happy Customers, Real Stories
            </h2>
          </div>
          <p className="text-slate-500 max-w-md mx-auto">
            See what our lovely clients say about our professional services
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF5A5F]" />
          </div>
        )}

        {/* Carousel */}
        {!isLoading && (
          <div className="relative overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${activeIndex * (100 / cardsToShow)}%)`,
              }}
            >
              {testimonials.map((test: any, idx: number) => (
                <div
                  key={idx}
                  className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
                >
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm flex flex-col h-[280px] md:h-[300px] hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={test.avatar}
                        alt={test.name}
                        className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(test.name)}&background=FF5A5F&color=fff&size=100`;
                        }}
                      />
                      <div>
                        <h4 className="font-bold text-slate-900">{test.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{test.location}</p>
                        <div className="flex gap-1 mt-1.5">
                          {[...Array(Math.min(test.rating || 5, 5))].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-[#FF5A5F] fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-600 leading-relaxed text-[15px] line-clamp-4">
                      "{test.comment}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dots */}
        {!isLoading && N > cardsToShow && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === activeIndex ? "bg-[#FF5A5F] w-6" : "bg-slate-300"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;