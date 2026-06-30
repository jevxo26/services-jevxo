"use client";

import React from "react";
import { CategorizedHero } from '@/components/home/categorizedServices/CategorizedHero';
import { SpecializedServices } from '@/components/home/categorizedServices/SpecializedServices';
import { Packages } from '@/components/home/categorizedServices/Packages';
import { Experts } from '@/components/home/categorizedServices/Experts';
import { Commitments } from '@/components/home/categorizedServices/Commitments';
import { VendorProfile } from '@/components/home/categorizedServices/VendorProfile';
import { ServiceReviews } from '@/components/home/categorizedServices/ServiceReviews';
import { useGetPublicServiceByIdQuery, useGetPublicServicesQuery } from "@/redux/features/landing/landingApi";
import { Loader2, ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useBookingCartState } from "@/components/home/booking/hooks/useBookingCartState";
import { DesktopBookingSidebar } from "@/components/home/booking/DesktopBookingSidebar";
import { MobileBookingDrawer } from "@/components/home/booking/MobileBookingDrawer";

export default function ServiceDetailClientPage({ id }: { id: string }) {
  const isNumericId = /^\d+$/.test(id);

  const { data: publicRes, isLoading: isPublicLoading } = useGetPublicServicesQuery(
    undefined,
    { skip: isNumericId }
  );
  const allServices = publicRes?.data || (Array.isArray(publicRes) ? publicRes : []);
  const matchedId = isNumericId
    ? Number(id)
    : allServices.find((s: any) => s.slug === id)?.id;

  const { data: serviceRes, isLoading: isServiceLoading, isError } = useGetPublicServiceByIdQuery(
    matchedId || 0,
    { skip: !matchedId }
  );

  const service = serviceRes?.data;
  const isLoading = isNumericId ? isServiceLoading : isPublicLoading || isServiceLoading;

  const state = useBookingCartState({ service, isLoading });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF6014]" />
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
          <p className="text-sm text-slate-500 mb-6 font-medium">We couldn't retrieve details for the requested service.</p>
          <Link href="/services" className="inline-flex items-center justify-center gap-2 bg-[#FF6014] hover:bg-[#E0530A] text-white px-6 py-3 rounded-full font-bold text-sm transition-all shadow-md cursor-pointer">
            <ArrowLeft size={16} /> Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const reviews = service.reviews || [];
  const bookingsCount = (service.bookings || []).length;
  const reviewsCount = reviews.length;
  const rating = reviewsCount > 0
    ? (reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / reviewsCount).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDFD] via-slate-50/70 to-[#FFF8F4] relative pb-16">
      <div className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0" style={{ backgroundSize: "auto" }} />
      <div className="relative z-10">
        <CategorizedHero id={service.id} name={service.name} description={service.description} image={service.image} rating={rating} bookingsCount={bookingsCount} reviewsCount={reviewsCount} categoryName={service.category?.name} />

        <div className="sticky top-[72px] z-30 bg-[#FFF8F4]/50 backdrop-blur-lg border-b border-slate-100 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.02)] hidden md:block">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex gap-2">
            {[{ id: "specialized-services", label: "Services" }, { id: "packages", label: "Packages" }, { id: "experts", label: "Experts" }, { id: "vendor", label: "Vendor Profile" }, { id: "reviews", label: "Reviews" }].map((tab) => (
              <button key={tab.id} onClick={() => state.scrollToSection(tab.id)} className={`text-xs font-bold px-4 py-2.5 rounded-full transition-all duration-300 cursor-pointer ${state.activeTab === tab.id ? "text-white bg-[#FF6014] shadow-md shadow-rose-100" : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"}`}>{tab.label}</button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-10 xl:gap-14 items-start">
            <div className="space-y-6 md:space-y-8 min-w-0">
              <div id="specialized-services">
                <SpecializedServices nestedServices={service.nestedServices} serviceId={service.id} vendorId={service.vendor?.id} serviceImage={service.image} serviceName={service.name} cartQuantities={state.cartItems.reduce((acc: any, i: any) => ({ ...acc, [i.id]: i.quantity }), {})} onUpdateQuantity={state.handleUpdateQuantity} onAddToCart={state.handleAddToCart} onRemoveFromCart={state.handleRemoveFromCart} onInitiateBooking={state.handleInitiateBooking} />
              </div>
              <div id="packages"><Packages packages={service.packages} serviceId={service.id} vendorId={service.vendor?.id} serviceName={service.name} serviceImage={service.image} /></div>
              <div id="experts"><Experts employees={service.employees} /></div>
              <div id="vendor"><VendorProfile vendor={service.vendor} serviceRating={rating} /></div>
              <div id="reviews"><ServiceReviews reviews={reviews} /></div>
              <Commitments />
            </div>

            <div className="hidden lg:block sticky top-[136px] z-20">
              <DesktopBookingSidebar cartItems={state.cartItems} cartItemCount={state.cartItemCount} cartTotal={state.cartTotal} payableTotal={state.payableTotal} appliedCoupon={state.appliedCoupon} setAppliedCoupon={state.setAppliedCoupon} bookingDetails={state.bookingDetails} setBookingDetails={state.setBookingDetails} isBooking={state.isBooking} onSubmit={state.handleConfirmBooking} serviceId={service.id} serviceImage={service.image} serviceName={service.name} onUpdateQuantity={state.handleUpdateQuantity} onRemoveFromCart={state.handleRemoveFromCart} onClearCart={state.handleClearCart} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+82px)] pointer-events-none md:hidden">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-slate-200/50 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] rounded-[24px] p-3 flex items-center justify-between gap-3">
          {state.cartItems.length > 0 ? (
            <>
              <div className="flex items-center gap-3 min-w-0 pl-1">
                <div className="w-10 h-10 rounded-xl bg-[#FFF8F4] text-[#FF6014] flex items-center justify-center shrink-0 border border-[#FF6014]/10">
                  <ShoppingCart size={18} className="stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 leading-none">{state.cartItemCount} item{state.cartItemCount === 1 ? "" : "s"}</p>
                  <p className="text-base font-black text-slate-900 mt-0.5 leading-none">৳{state.payableTotal.toLocaleString()}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => state.setIsModalOpen(true)}
                className="px-6 py-3 rounded-xl text-xs font-black text-white bg-[#FF6014] hover:bg-[#E0530A] transition-all duration-250 shadow-md active:scale-95 shrink-0"
              >
                Proceed to Book
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col justify-center pl-2">
                <p className="text-xs font-black text-slate-800">Quick Booking</p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">Book instantly in 2 taps</p>
              </div>
              <button
                type="button"
                onClick={() => state.handleInitiateBooking()}
                className="px-8 py-3 rounded-xl text-xs font-black text-white bg-[#FF6014] hover:bg-[#E0530A] transition-all duration-250 shadow-md active:scale-95 shrink-0"
              >
                Book Now
              </button>
            </>
          )}
        </div>
      </div>

      <MobileBookingDrawer isOpen={state.isModalOpen} onClose={() => state.setIsModalOpen(false)} cartItems={state.cartItems} cartItemCount={state.cartItemCount} cartTotal={state.cartTotal} payableTotal={state.payableTotal} appliedCoupon={state.appliedCoupon} setAppliedCoupon={state.setAppliedCoupon} bookingDetails={state.bookingDetails} setBookingDetails={state.setBookingDetails} isBooking={state.isBooking} onSubmit={state.handleConfirmBooking} serviceId={service.id} onUpdateQuantity={state.handleUpdateQuantity} onRemoveFromCart={state.handleRemoveFromCart} onClearCart={state.handleClearCart} />
    </div>
  );
}