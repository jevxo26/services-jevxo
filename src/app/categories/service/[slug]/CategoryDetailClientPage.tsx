"use client";

import React from "react";
import { CategorizedHero } from '@/components/home/categorizedServices/CategorizedHero';
import { SpecializedServices } from '@/components/home/categorizedServices/SpecializedServices';
import { Packages } from '@/components/home/categorizedServices/Packages';
import { Experts } from '@/components/home/categorizedServices/Experts';
import { Commitments } from '@/components/home/categorizedServices/Commitments';
import { VendorProfile } from '@/components/home/categorizedServices/VendorProfile';
import { ServiceReviews } from '@/components/home/categorizedServices/ServiceReviews';
import { useGetPublicServiceBySlugQuery } from "@/redux/features/landing/landingApi";
import { Loader2 } from "lucide-react";

export default function CategoryDetailClientPage({ slug }: { slug: string }) {
  const { data: serviceRes, isLoading, isError } = useGetPublicServiceBySlugQuery(slug);

  const service = serviceRes?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF7C71]" />
          <p className="text-sm font-semibold text-slate-500">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50 px-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Service Not Found</h2>
          <p className="text-sm text-slate-500 mb-6 font-medium">
            We couldn't retrieve details for the requested service.
          </p>
        </div>
      </div>
    );
  }

  const reviews = service.reviews || [];
  const bookings = service.bookings || [];
  const reviewsCount = reviews.length;
  const bookingsCount = bookings.length;
  const rating = reviewsCount > 0
    ? (reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / reviewsCount).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-slate-50/50 relative">
      <div
        className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
        style={{ backgroundSize: "auto" }}
      />
      <div className="relative z-10">
        <CategorizedHero
          id={service.id}
          name={service.name}
          description={service.description}
          image={service.image}
          rating={rating}
          bookingsCount={bookingsCount}
          reviewsCount={reviewsCount}
          categoryName={service.category?.name}
          subtitle={service.subtitle}
        />
        <SpecializedServices
          nestedServices={service.nestedServices}
          serviceId={service.id}
          vendorId={service.vendor?.id}
        />
        <Packages
          packages={service.packages}
        />
        <Experts
          employees={service.employees}
        />
        <VendorProfile
          vendor={service.vendor}
          serviceRating={rating}
        />
        <ServiceReviews
          reviews={reviews}
        />
        <Commitments />
      </div>
    </div>
  );
}
