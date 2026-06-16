import { ArrowRight, Stars } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TrendingService {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  reviews: string;
  price: number;
  badge?: string;
  featured: boolean;
}

const TRENDING_SERVICES: TrendingService[] = [
  {
    id: "premium-deep-cleaning",
    title: "Premium Deep Cleaning",
    description:
      "Full home sanitization using industrial equipment. Perfect for move-ins or seasonal refreshes.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
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
      "Comprehensive cleaning and gas top-up for all split AC brands.",
    image:
      "https://images.unsplash.com/photo-1621905252507-b354bc25edac?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    reviews: "1.8k",
    price: 1200,
    badge: "5.0 ★",
    featured: false,
  },
];

const TrendingServices = () => {

    return (
      <section className="py-14 bg-[#FFF0EF]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-7">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a1a1a] border-b-2 border-[#ff5a5f] pb-1.5 inline-block">
                Trending Services
              </h2>
              <p className="text-sm text-[#6b7280] mt-1">
                Highly requested in Dhaka this month
              </p>
            </div>
            <Link
              href="#"
              className="text-sm font-bold text-[#ff5a5f] no-underline hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">
            {/* Featured card */}
            {TRENDING_SERVICES.filter((s) => s.featured).map((service) => (
              <div
                key={service.id}
                className="grid grid-cols-1 sm:grid-cols-2 bg-white rounded-2xl overflow-hidden shadow-md border border-[#f3f4f6] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="relative min-h-[260px] sm:min-h-[auto] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  {service.badge && (
                    <span className="absolute top-3 left-3 py-1.5 px-3 bg-[#8b1a1a] text-white text-[10px] font-bold tracking-wider rounded-lg uppercase">
                      {service.badge}
                    </span>
                  )}
                </div>
                <div className="p-6 flex flex-col justify-center gap-3">
                  <div className="flex items-center gap-2">
                    <Stars rating={service.rating} />
                    <span className="text-xs text-[#6b7280] font-semibold">
                      ({service.rating} • {service.reviews} reviews)
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#1a1a1a] m-0 leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#6b7280] leading-relaxed m-0">
                    {service.description}
                  </p>
                  <div className="flex items-end justify-between mt-auto pt-4 border-t border-[#f3f4f6]">
                    <div>
                      <p className="text-[10px] font-bold text-[#9ca3af] tracking-widest uppercase mb-0.5">
                        Starting from
                      </p>
                      <p className="text-xl text-primary font-extrabold text-[#1a1a1a] m-0">
                        ৳{service.price.toLocaleString()}
                      </p>
                    </div>
                    <Link
                      href={`/services/${service.id}`}
                      className="px-5 py-2.5 bg-[#ff5a5f] text-white text-xs font-bold rounded-full no-underline hover:bg-[#e04a4f] transition-all shadow-md"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Secondary cards */}
            {TRENDING_SERVICES.filter((s) => !s.featured).map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-[#f3f4f6] flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-5 flex flex-col flex-1 gap-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-[#1a1a1a] m-0 leading-snug">
                      {service.title}
                    </h3>
                    <span className="bg-[#fff8e1] text-[#b45309] px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap">
                      ★ {service.rating}
                    </span>
                  </div>
                  <p className="text-xs text-[#6b7280] leading-relaxed m-0 flex-1">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-[#f3f4f6]">
                    <span className="text-primary font-extrabold">
                      ৳{service.price.toLocaleString()}
                    </span>
                    <Link
                      href={`/services/${service.id}`}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f3f4f6] border-2 border-gray-300 text-[#4b5563] no-underline hover:bg-[#ff5a5f] hover:text-white transition-all text-base font-bold"
                      aria-label={`View ${service.title}`}
                    >
                      <ArrowRight size={16} strokeWidth={3} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
};

export default TrendingServices;