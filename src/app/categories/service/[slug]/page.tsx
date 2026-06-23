"use client";

import React from "react";
import { CategorizedHero } from '@/components/home/categorizedServices/CategorizedHero';
import { SpecializedServices } from '@/components/home/categorizedServices/SpecializedServices';
import { Packages } from '@/components/home/categorizedServices/Packages';
import { Experts } from '@/components/home/categorizedServices/Experts';
import { Commitments } from '@/components/home/categorizedServices/Commitments';
import { useGetPublicServiceBySlugQuery } from "@/redux/features/landing/landingApi";
import { Loader2 } from "lucide-react";

// Main Component
export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
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

  // If there's an error or no service is returned, we can still fall back gracefully to mock/placeholder data
  // so the page never breaks, but if real data is available, it is fully dynamic!
  return (
    <div className="min-h-screen bg-slate-50/50 relative">
      <div
        className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
        style={{ backgroundSize: "auto" }}
      />
      <div className="relative z-10">
        <CategorizedHero
          name={service?.name}
          description={service?.description}
        />
        <SpecializedServices
          nestedServices={service?.nestedServices}
        />
        <Packages
          packages={service?.packages}
        />
        <Experts
          employees={service?.employees}
        />
        <Commitments />
      </div>
    </div>
  );
}
