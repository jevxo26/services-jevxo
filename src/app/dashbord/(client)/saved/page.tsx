"use client"

import * as React from "react"
import { useAppSelector } from "@/redux/hooks";
import { useGetSavedServicesQuery, useToggleSavedServiceMutation } from "@/redux/features/admin/user";
import {
  ShieldAlert,
  Heart,
  Star,
  Plus,
  Loader2,
  ChevronRight,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner";

export default function SavedServicesPage() {
  const role = useAppSelector((state) => state.auth.role) || "client";
  const authUser = useAppSelector((state) => state.auth.user);

  const { data: savedRes, isLoading } = useGetSavedServicesQuery(undefined, {
    skip: !authUser,
  });
  const savedServices: any[] = savedRes?.data || [];

  const [toggleSaved] = useToggleSavedServiceMutation();

  const handleUnsave = async (id: string | number, title: string) => {
    try {
      await toggleSaved(id).unwrap();
      toast.success(`"${title}" removed from wishlist`);
    } catch {
      toast.error("Failed to remove from wishlist");
    }
  };

  if (role !== "client") {
    return <AccessDenied roleRequired="Customer" />;
  }

  return (
    <div className="w-full animate-in fade-in duration-200">
      <div className="w-full space-y-10 relative z-10">

        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FFF8F7] text-[#FF7C71] rounded-2xl">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Saved Services</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {isLoading ? "Loading..." : `${savedServices.length} service${savedServices.length !== 1 ? "s" : ""} saved to your wishlist.`}
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF7C71]" />
            </div>
          ) : savedServices.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-[24px] border border-dashed border-slate-200 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                <Heart size={28} />
              </div>
              <h3 className="text-base font-bold text-slate-700 mb-1">No saved services yet</h3>
              <p className="text-sm text-slate-400 font-medium mb-5">
                Tap the ♥ heart icon on any service card to save it here.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-[#FF7C71] hover:bg-[#E5675D] text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm"
              >
                <BookOpen size={14} />
                Browse Services
              </Link>
            </div>
          ) : (
            <>
              {savedServices.map((service: any) => (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden">
                    <img
                      src={service.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=80"}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Category badge */}
                    {service.category?.name && (
                      <span className="absolute top-3 left-3 py-1 px-2.5 bg-white/95 text-[10px] font-bold rounded-lg uppercase tracking-wide shadow-sm text-slate-700">
                        {service.category.name}
                      </span>
                    )}
                    {/* Remove heart */}
                    <button
                      onClick={() => handleUnsave(service.id, service.name)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-[#FF7C71] text-white shadow-md hover:scale-110 transition-all cursor-pointer"
                      aria-label="Remove from wishlist"
                    >
                      <Heart size={14} className="fill-white" />
                    </button>
                  </div>

                  {/* Card Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-slate-800 text-sm line-clamp-1">{service.name}</h3>
                        {service.reviews?.length > 0 && (
                          <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs">
                            <Star size={11} className="fill-current" />
                            {(service.reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / service.reviews.length).toFixed(1)}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-semibold line-clamp-2">
                        {service.subtitle || service.description || "Top-rated service."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-50 gap-2">
                      <Link
                        href={`/services/${service.id}`}
                        className="flex-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-all"
                      >
                        Details
                      </Link>
                      <Link
                        href={`/categories/service/${service.slug || service.id}`}
                        className="flex-1 text-center bg-[#FF7C71] hover:bg-[#E5675D] text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* Discover More Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-dashed border-slate-200 p-6 flex flex-col justify-between items-center text-center shadow-sm">
                <div className="my-auto space-y-4">
                  <div className="w-12 h-12 bg-[#FFF8F7] rounded-full flex items-center justify-center text-[#FF7C71] mx-auto border border-[#FFEBE9]">
                    <Plus size={20} />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-slate-800 text-sm">Discover More</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold max-w-[200px] mx-auto">
                      Want to explore more options? Check out our trending services this month.
                    </p>
                  </div>
                </div>
                <Link
                  href="/services"
                  className="mt-6 w-full bg-white hover:bg-slate-50 border border-slate-100 text-[#FF7C71] text-xs font-bold py-2.5 rounded-2xl transition-colors text-center flex items-center justify-center gap-1"
                >
                  Find More Services <ChevronRight size={12} />
                </Link>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

function AccessDenied({ roleRequired }: { roleRequired: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
      <div className="p-4 bg-[#FFF8F7] rounded-2xl text-[#FF7C71] mb-4">
        <ShieldAlert size={48} />
      </div>
      <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        This page is only accessible to users with the <strong className="text-slate-800">{roleRequired}</strong> role.
      </p>
    </div>
  );
}
