import { Clock, Star } from "lucide-react";
import Link from "next/link";

interface ServiceListing {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  categoryLabel: string;
  price: number;
  priceDisplay: string;
  done: string;
  rating: number;
  availability: string[];
  daysAgo: number;
  slug?: string;
}


export default function ServiceCard({ service }: { service: ServiceListing }) {
  return (
    <Link
      href={`/categories/service/${service.slug || service.id}`}
      className="group bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-sm no-underline flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-[#ff5a5f]"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 py-1 px-2.5 bg-white/95 text-[#1a1a1a] text-[10px] font-bold rounded-lg uppercase tracking-wide shadow-sm">
          {service.categoryLabel}
        </span>
        <span className="absolute top-3 right-3 flex items-center gap-1 py-1 px-2 bg-white/95 rounded-lg text-[10px] font-bold text-[#1a1a1a] shadow-sm">
          <Star
            size={10}
            className="fill-[#f59e0b] text-[#f59e0b]"
            strokeWidth={0}
          />
          {service.rating}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-1 leading-snug">
          {service.title}
        </h3>
        <p className="text-xs text-[#6b7280] leading-relaxed flex-1">
          {service.description}
        </p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f3f4f6]">
          <span className="text-base font-extrabold text-[#ff5a5f]">
            {service.priceDisplay}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-[#9ca3af]">
            <Clock size={10} strokeWidth={2.5} />
            {service.done}
          </span>
        </div>
      </div>
    </Link>
  );
}
