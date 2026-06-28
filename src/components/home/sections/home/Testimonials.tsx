"use client";
import React, { useState, useEffect, useRef } from "react";
import { Star, MessageSquare, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetPublicReviewsQuery } from "@/redux/features/landing/landingApi";

const FALLBACK_TESTIMONIALS = [
  {
    name: "Adnan Sami",
    location: "Gulshan, Dhaka",
    rating: 5,
    comment: "The AC service was professional and on-time. Best service experience in Dhaka so far.",
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
    comment: "Very satisfied with the plumbing repair. Diagnosed and fixed quickly at a great price.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
  },
  {
    name: "Adnan Chowdhury",
    location: "Mirpur, Dhaka",
    rating: 5,
    comment: "Courteous electricians who fixed my wiring issues professionally. Even cleaned up after!",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
  },
  {
    name: "Sabrina Yasmin",
    location: "Dhanmondi, Dhaka",
    rating: 5,
    comment: "Booked a deep cleaning — they exceeded expectations. Spotless corners, great team!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
  },
];

const GAP = 20;

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1024);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);

  const { data: reviewsRes, isLoading } = useGetPublicReviewsQuery();
  const rawReviews: any[] = reviewsRes?.data || (Array.isArray(reviewsRes) ? reviewsRes : []);

  const realReviews = rawReviews
    .filter((r: any) => (r.comment || r.content || r.review || "").trim().length > 10)
    .map((r: any) => ({
      name: r.user?.name || "Valued Customer",
      location: r.user?.profile?.address || "Dhaka, Bangladesh",
      rating: r.rating || 5,
      comment: r.comment || r.content || r.review || "",
      avatar:
        r.user?.profile?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user?.name || "U")}&background=FF7C71&color=fff&size=100`,
    }));

  const testimonials =
    realReviews.length >= 5
      ? realReviews
      : [...realReviews, ...FALLBACK_TESTIMONIALS.slice(0, 6 - realReviews.length)];

  const cardsToShow = windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : 3;
  const maxIndex = Math.max(0, testimonials.length - cardsToShow);

  // Recalculate card width from actual DOM
  const recalc = () => {
    if (!wrapperRef.current) return;
    const wrapperW = wrapperRef.current.offsetWidth;
    const cw = (wrapperW - GAP * (cardsToShow - 1)) / cardsToShow;
    setCardWidth(cw);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      recalc();
    };
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    recalc();
  }, [cardsToShow, isLoading]);

  // Apply transform directly — no framer-motion percentage bugs
  useEffect(() => {
    if (!trackRef.current || cardWidth === 0) return;
    const offset = activeIndex * (cardWidth + GAP);
    trackRef.current.style.transform = `translateX(-${offset}px)`;
  }, [activeIndex, cardWidth]);

  useEffect(() => {
    if (activeIndex > maxIndex) setActiveIndex(maxIndex);
  }, [maxIndex]);

  const startAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
  };

  useEffect(() => {
    startAutoplay();
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [maxIndex, cardWidth]);

  const goTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(maxIndex, idx));
    setActiveIndex(clamped);
    startAutoplay();
  };

  // Touch/drag support
  const dragStart = useRef<number | null>(null);
  const handlePointerDown = (e: React.PointerEvent) => { dragStart.current = e.clientX; };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const diff = dragStart.current - e.clientX;
    if (diff > 50) goTo(activeIndex + 1);
    else if (diff < -50) goTo(activeIndex - 1);
    dragStart.current = null;
  };

  return (
    <div className="py-5 md:py-16 lg:py-24 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#FF6014]/10 border border-[#FF6014]/20 text-[#FF6014] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
            <MessageSquare size={13} />
            Customer Reviews
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            What our clients
            <span className="text-[#FF6014]"> say about us</span>
          </h2>

          <p className="mt-3 text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Trusted by thousands of happy homes across Bangladesh.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-7 h-7 animate-spin text-[#FF6014]" />
          </div>
        )}

        {/* Slider */}
        {!isLoading && (
          <>
            <div
              ref={wrapperRef}
              className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
            >
              <div
                ref={trackRef}
                className="flex"
                style={{
                  gap: GAP,
                  transition: "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  willChange: "transform",
                }}
              >
                {testimonials.map((test: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex-shrink-0"
                    style={{ width: cardWidth > 0 ? cardWidth : `calc(${100 / cardsToShow}% - ${(GAP * (cardsToShow - 1)) / cardsToShow}px)` }}
                  >
                    <div className="relative bg-white rounded-3xl border border-slate-100 p-7 shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full min-h-[240px]">

                      {/* Decorative quote */}
                      <span className="absolute top-4 right-6 text-8xl font-serif leading-none select-none pointer-events-none text-[#FF6014]/8">
                        "
                      </span>

                      {/* Stars */}
                      <div className="flex gap-0.5 mb-4">
                        {[...Array(Math.min(test.rating || 5, 5))].map((_, i) => (
                          <Star key={i} size={15} className="text-amber-400 fill-amber-400" />
                        ))}
                      </div>

                      {/* Comment */}
                      <p className="text-slate-700 text-[15px] leading-relaxed line-clamp-4 flex-1 mb-6">
                        "{test.comment}"
                      </p>

                      {/* Accent line */}
                      <div className="w-10 h-0.5 bg-[#FF6014]/30 mb-5" />

                      {/* Author */}
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={test.avatar}
                            alt={test.name}
                            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(test.name)}&background=FF5A5F&color=fff&size=80`;
                            }}
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm leading-tight">{test.name}</h4>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">{test.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default Testimonials;