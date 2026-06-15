"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";

// Expanded mock reviews (10 total)
const TESTIMONIALS_CONTENT = {
  title: "Real Happy Customers, Real Stories",
  subtitle: "See what our lovely clients say about our professional services",
  testimonials: [
    {
      name: "Adnan Sami",
      location: "Gulshan, Dhaka",
      rating: 5,
      text: '"The AC service was professional and on-time. Best experience in Dhaka so far."',
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Mehjabin R.",
      location: "Uttara, Dhaka",
      rating: 5,
      text: '"Finding a reliable plumber was impossible before Rajseba. Life-changing app!"',
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Saif Islam",
      location: "Banani, Dhaka",
      rating: 5,
      text: '"Fast, reliable and high-quality cleaning service. I highly recommend them to everyone."',
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Tasnim Jahan",
      location: "Dhanmondi, Dhaka",
      rating: 5,
      text: '"Very satisfied with the plumbing repair. They diagnosed the leak quickly and fixed it at a very reasonable price."',
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Adnan Chowdhury",
      location: "Mirpur, Dhaka",
      rating: 5,
      text: '"Courteous electricians who fixed my wiring issues professionally. They even cleaned up after completing the service."',
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Sabrina Yasmin",
      location: "Dhanmondi, Dhaka",
      rating: 5,
      text: '"I booked a deep cleaning service and they exceeded expectations. Spotless corners, clean smell, and great team work!"',
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Imtiaz Hossain",
      location: "Mirpur, Dhaka",
      rating: 5,
      text: '"AC was leaking and not cooling. The technician found the root cause instantly and resolved it. Reliable and transparent!"',
      avatar:
        "https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Nusrat Jahan",
      location: "Banani, Dhaka",
      rating: 5,
      text: '"Very efficient shifting service! They packed all fragile items safely and transported them without a single scratch."',
      avatar:
        "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Farhan Malik",
      location: "Gulshan, Dhaka",
      rating: 5,
      text: '"Had a persistent pest problem. Their control treatment was highly effective. Haven\'t seen any pests in weeks now."',
      avatar:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Mehnaz Chowdhury",
      location: "Uttara, Dhaka",
      rating: 5,
      text: '"The salon service was so relaxing. Professional beautician, followed proper hygiene rules. Wonderful experience at home!"',
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
    },
  ],
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const testimonials = TESTIMONIALS_CONTENT.testimonials;
  const N = testimonials.length;
  const cardsToShow = windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : 3;
  const maxIndex = N - cardsToShow;

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
      {" "}
      {/* Removed overflow-hidden */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-rose-50">
              <MessageSquare className="w-6 h-6 text-[#FF5A5F]" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">
              {TESTIMONIALS_CONTENT.title}
            </h2>
          </div>
          <p className="text-slate-500 max-w-md mx-auto">
            {TESTIMONIALS_CONTENT.subtitle}
          </p>
        </div>

        {/* Carousel Container - Only overflow-hidden here */}
        <div className="relative overflow-hidden rounded-3xl">
          {" "}
          {/* Keep only on the slider wrapper */}
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(-${activeIndex * (100 / cardsToShow)}%)`,
            }}
          >
            {testimonials.map((test, idx) => (
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
                    />
                    <div>
                      <h4 className="font-bold text-slate-900">{test.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {test.location}
                      </p>
                      <div className="flex gap-1 mt-1.5">
                        {[...Array(test.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-[#FF5A5F] fill-current"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed text-[15px]">
                    {test.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;