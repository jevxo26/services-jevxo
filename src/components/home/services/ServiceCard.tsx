"use client";

import { Clock, Heart, Star } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { useToggleSavedServiceMutation, useGetSavedServicesQuery } from "@/redux/features/admin/user";
import { toast } from "sonner";

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
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  // Fetch saved services only when logged in
  const { data: savedRes } = useGetSavedServicesQuery(undefined, {
    skip: !isAuthenticated,
  });
  const savedServices: any[] = savedRes?.data || [];
  const isWishlisted = savedServices.some(
    (s) => String(s.id) === String(service.id)
  );

  const [toggleSaved, { isLoading: isToggling }] = useToggleSavedServiceMutation();

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to save to wishlist");
      return;
    }

    try {
      await toggleSaved(service.id).unwrap();
      toast.success(isWishlisted ? "Removed from wishlist" : "Saved to wishlist ❤️");
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  const truncatedDesc = service.description
    ? service.description.length > 150
      ? service.description.slice(0, 150) + "..."
      : service.description
    : "";

  return (
    <Link
      href={`/services/${service.id}`}
      className="group bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-sm no-underline flex flex-col hover-card-premium"
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
          <Star size={10} className="fill-[#f59e0b] text-[#f59e0b]" strokeWidth={0} />
          {service.rating}
        </span>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlist}
          disabled={isToggling}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 cursor-pointer disabled:opacity-60 ${
            isWishlisted
              ? "bg-[#FF6014] text-white scale-110"
              : "bg-white/90 text-slate-400 hover:bg-rose-50 hover:text-[#FF6014] hover:scale-110"
          }`}
        >
          <Heart
            size={15}
            className={isWishlisted ? "fill-white" : ""}
            strokeWidth={2}
          />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-1 leading-snug">
          {service.title}
        </h3>
        <p className="text-xs text-[#6b7280] leading-relaxed flex-1 line-clamp-3">
          {truncatedDesc}
        </p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f3f4f6]">
          <span className="text-base font-extrabold text-[#FF6014]">
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
