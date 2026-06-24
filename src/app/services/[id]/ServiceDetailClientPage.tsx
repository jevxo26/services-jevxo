"use client";

import React from "react";
import { CategorizedHero } from '@/components/home/categorizedServices/CategorizedHero';
import { SpecializedServices } from '@/components/home/categorizedServices/SpecializedServices';
import { Packages } from '@/components/home/categorizedServices/Packages';
import { Experts } from '@/components/home/categorizedServices/Experts';
import { Commitments } from '@/components/home/categorizedServices/Commitments';
import { useGetPublicServiceByIdQuery } from "@/redux/features/landing/landingApi";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ServiceDetailClientPage({ id }: { id: string }) {
  const serviceId = Number(id);

  const { data: serviceRes, isLoading, isError } = useGetPublicServiceByIdQuery(
    isNaN(serviceId) ? 0 : serviceId
  );

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
            We couldn't retrieve details for the requested service. It may have been relocated or removed.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 bg-[#FF7C71] hover:bg-[#E5675D] text-white px-6 py-3 rounded-full font-bold text-sm transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Services
          </Link>
        </div>
      </div>
    );
  }

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
        />
        <SpecializedServices
          nestedServices={service.nestedServices}
        />
        <Packages
          packages={service.packages}
        />
        <Experts
          employees={service.employees}
        />
        <Commitments />
      </div>
    </div>
  );
}
