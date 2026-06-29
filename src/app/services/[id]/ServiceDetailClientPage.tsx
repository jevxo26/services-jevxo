"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { CategorizedHero } from '@/components/home/categorizedServices/CategorizedHero';
import { SpecializedServices } from '@/components/home/categorizedServices/SpecializedServices';
import { Packages } from '@/components/home/categorizedServices/Packages';
import { Experts } from '@/components/home/categorizedServices/Experts';
import { Commitments } from '@/components/home/categorizedServices/Commitments';
import { VendorProfile } from '@/components/home/categorizedServices/VendorProfile';
import { ServiceReviews } from '@/components/home/categorizedServices/ServiceReviews';
import { useGetPublicServiceByIdQuery, useGetPublicServicesQuery } from "@/redux/features/landing/landingApi";
import {
  Loader2,
  ArrowLeft,
  Calendar,
  X,
  ShoppingCart,
  Trash2,
  ShieldCheck,
  Award,
  Clock,
  Star,
  Minus,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { useCreateBookingMutation } from "@/redux/features/admin/booking";
import { ValidateCouponResult } from "@/redux/features/admin/coupon";
import { CouponApply } from "@/components/home/booking/CouponApply";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { CustomCalendar } from "@/components/ui/calendar";
import { CustomSelect } from "@/components/ui/select";

const TIME_SLOT_OPTIONS = [
  { value: "08:00 AM", label: "08:00 AM", desc: "Morning Slot" },
  { value: "09:00 AM", label: "09:00 AM", desc: "Morning Slot" },
  { value: "10:00 AM", label: "10:00 AM", desc: "Morning Slot" },
  { value: "11:00 AM", label: "11:00 AM", desc: "Morning Slot" },
  { value: "12:00 PM", label: "12:00 PM", desc: "Noon Slot" },
  { value: "01:00 PM", label: "01:00 PM", desc: "Noon Slot" },
  { value: "02:00 PM", label: "02:00 PM", desc: "Afternoon Slot" },
  { value: "03:00 PM", label: "03:00 PM", desc: "Afternoon Slot" },
  { value: "04:00 PM", label: "04:00 PM", desc: "Late Afternoon Slot" },
  { value: "05:00 PM", label: "05:00 PM", desc: "Evening Slot" },
  { value: "06:00 PM", label: "06:00 PM", desc: "Evening Slot" },
  { value: "07:00 PM", label: "07:00 PM", desc: "Night Slot" },
  { value: "08:00 PM", label: "08:00 PM", desc: "Night Slot" },
  { value: "09:00 PM", label: "09:00 PM", desc: "Night Slot" },
];

const fallbackServices = [
  {
    id: "leak-repair",
    title: "Leak Repair & Detection",
    description:
      "Non-invasive ultrasonic leak detection for hidden pipes. We fix everything from dripping faucets to underground line bursts.",
    price: "800",
    type: "normal",
  },
  {
    id: "plumbing-emergency",
    title: "Plumbing Emergency?",
    description:
      "Our rapid response team is available 24/7 for burst pipes, flooding, or severe blockages.",
    type: "emergency",
  },
];

const trustPoints = [
  { icon: ShieldCheck, text: "Insured and bonded work" },
  { icon: Award, text: "License verified experts" },
  { icon: Clock, text: "On-time guarantee" },
  { icon: Star, text: "98% satisfaction rate" },
];

export default function ServiceDetailClientPage({ id }: { id: string }) {
  const isNumericId = /^\d+$/.test(id);
  const router = useRouter();
  const searchParams = useSearchParams();
  const authUser = useAppSelector((state) => state.auth.user);

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

  // Cart & Booking States
  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    location: "",
    notes: "",
  });
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResult | null>(null);
  const [activeTab, setActiveTab] = useState("specialized-services");

  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();
  const hasAutoBooked = useRef(false);

  const displayServices = useMemo(() => {
    const nested = service?.nestedServices;
    if (nested && nested.length > 0) {
      return nested.map((ns: any, idx: number) => {
        const isEmergency = nested.length > 2 && idx === nested.length - 1;
        return {
          id: String(ns.id),
          title: ns.name,
          description: ns.description || "Expert service technician ready to assist you.",
          price: ns.starting_price || ns.price,
          image: ns.image,
          subServices: ns.subServices || [],
          type: isEmergency ? "emergency" : "normal",
        };
      });
    }
    return fallbackServices;
  }, [service]);

  const getCartItems = () =>
    displayServices
      .flatMap((s: any) =>
        (s.subServices || []).map((sub: any) => ({
          ...sub,
          parentTitle: s.title,
          quantity: cartQuantities[sub.id] || 0,
        }))
      )
      .filter((sub: any) => sub.quantity > 0);

  const cartItems = getCartItems();
  const cartItemCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum: number, item: any) => sum + Number(item.price || 0) * item.quantity,
    0
  );
  const payableTotal = appliedCoupon ? appliedCoupon.final_price : cartTotal;

  const handleUpdateQuantity = (subId: number, delta: number) => {
    setCartQuantities((prev) => {
      const nextQty = (prev[subId] || 0) + delta;
      if (nextQty <= 0) {
        const { [subId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [subId]: nextQty };
    });
  };

  const handleRemoveFromCart = (subId: number) => {
    setCartQuantities((prev) => {
      const { [subId]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleClearCart = () => {
    setCartQuantities({});
    setAppliedCoupon(null);
  };

  const handleAddToCart = (item: any, subId: number) => {
    if (!authUser) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    setCartQuantities((prev) => ({ ...prev, [subId]: (prev[subId] || 0) + 1 }));
    toast.success("Added to booking cart", { duration: 1500 });
  };

  const handleInitiateBooking = (item: any) => {
    if (!authUser) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDetails.date || !bookingDetails.location) {
      toast.error("Booking Date and Service Location are required!");
      return;
    }
    const subServiceItems = cartItems.map((item: any) => ({
      sub_service_id: item.id,
      quantity: item.quantity,
    }));
    const payload = {
      user_id: authUser?.id,
      vendor_id: service?.vendor?.id || 1,
      service_id: service?.id,
      date: bookingDetails.date,
      time: bookingDetails.time || undefined,
      location: bookingDetails.location,
      notes: bookingDetails.notes || undefined,
      sub_service_items: subServiceItems,
      coupon_code: appliedCoupon?.coupon.code,
    };
    try {
      await createBooking(payload).unwrap();
      toast.success(
        cartItemCount > 1
          ? `${cartItemCount} services booked successfully! ✅`
          : "Booking placed successfully! ✅",
        {
          description: "View and track your booking from your dashboard.",
          action: {
            label: "Track Booking →",
            onClick: () => router.push("/dashbord/bookings"),
          },
          duration: 6000,
        }
      );
      setIsModalOpen(false);
      setCartQuantities({});
      setAppliedCoupon(null);
      setBookingDetails({ date: "", time: "", location: "", notes: "" });
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Failed to place booking. Please try again."
      );
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      setActiveTab(id);
      const offset = 140; // height of sticky elements
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Keep active tab updated on scroll
  useEffect(() => {
    const sections = ["specialized-services", "packages", "experts", "vendor", "reviews"];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Automatically open booking modal if ?book=true is passed
  useEffect(() => {
    if (isLoading || !service || hasAutoBooked.current) return;

    const shouldBook = searchParams.get("book") === "true";
    if (shouldBook) {
      hasAutoBooked.current = true;
      // Find the first sub-service to select
      const firstSubService = displayServices.find(
        (s: any) => s.subServices && s.subServices.length > 0
      )?.subServices[0];

      if (firstSubService) {
        setCartQuantities({ [firstSubService.id]: 1 });
      }

      if (!authUser) {
        const currentPath = window.location.pathname + window.location.search;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

      setIsModalOpen(true);
    }
  }, [isLoading, service, searchParams, displayServices, authUser, router]);

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
          <p className="text-sm text-slate-500 mb-6 font-medium">
            We couldn't retrieve details for the requested service. It may have been relocated or removed.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 bg-[#FF6014] hover:bg-[#E0530A] text-white px-6 py-3 rounded-full font-bold text-sm transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Services
          </Link>
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
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDFD] via-slate-50/70 to-[#FFF8F4] relative pb-16">
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
        />

        {/* Sticky Section Tabs Navigation */}
        <div className="sticky top-[72px] z-30 bg-[#FFF8F4]/50 backdrop-blur-lg border-b border-slate-100 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.02)] hidden md:block">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex gap-2">
            {[
              { id: "specialized-services", label: "Services" },
              { id: "packages", label: "Packages" },
              { id: "experts", label: "Experts" },
              { id: "vendor", label: "Vendor Profile" },
              { id: "reviews", label: "Reviews" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`text-xs font-bold px-4 py-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? "text-white bg-[#FF6014] shadow-md shadow-rose-100"
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Two-Column split layout */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-10 xl:gap-14 items-start">
            
            {/* Left Content Column */}
            <div className="space-y-6 md:space-y-8 min-w-0">
              <div id="specialized-services">
                <SpecializedServices
                  nestedServices={service.nestedServices}
                  serviceId={service.id}
                  vendorId={service.vendor?.id}
                  serviceImage={service.image}
                  serviceName={service.name}
                  cartQuantities={cartQuantities}
                  onUpdateQuantity={handleUpdateQuantity}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                  onInitiateBooking={handleInitiateBooking}
                />
              </div>

              <div id="packages">
                <Packages
                  packages={service.packages}
                  serviceId={service.id}
                  vendorId={service.vendor?.id}
                  serviceName={service.name}
                  serviceImage={service.image}
                />
              </div>

              <div id="experts">
                <Experts employees={service.employees} />
              </div>

              <div id="vendor">
                <VendorProfile vendor={service.vendor} serviceRating={rating} />
              </div>

              <div id="reviews">
                <ServiceReviews reviews={reviews} />
              </div>

              <Commitments />
            </div>

            {/* Right Sticky Sidebar Column (Desktop) */}
            <div className="hidden lg:block sticky top-[136px] z-20">
              <DesktopBookingSidebar
                cartItems={cartItems}
                cartItemCount={cartItemCount}
                cartTotal={cartTotal}
                payableTotal={payableTotal}
                appliedCoupon={appliedCoupon}
                setAppliedCoupon={setAppliedCoupon}
                bookingDetails={bookingDetails}
                setBookingDetails={setBookingDetails}
                isBooking={isBooking}
                onSubmit={handleConfirmBooking}
                serviceId={service.id}
                serviceImage={service.image}
                serviceName={service.name}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveFromCart={handleRemoveFromCart}
                onClearCart={handleClearCart}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Floating Bottom Cart Bar (Mobile) */}
      <AnimatePresence>
        {cartItems.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+82px)] pointer-events-none md:hidden"
          >
            <div
              className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-white/60
                shadow-[0_12px_40px_rgba(255,96,20,0.15)] rounded-[28px] p-4 px-5
                flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-[#FFF8F4] to-[#FFEFE6] text-[#FF6014] flex items-center justify-center shrink-0 border border-[#FF6014]/20 shadow-inner">
                  <ShoppingCart size={20} className="stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-slate-500 leading-none">
                    {cartItemCount} service{cartItemCount === 1 ? "" : "s"}
                  </p>
                  <p className="text-[17px] font-black text-slate-900 mt-1 leading-none">
                    ৳{payableTotal.toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3.5 rounded-[20px] text-sm font-extrabold text-white
                  bg-gradient-to-r from-[#FF6014] to-[#FF7C71] hover:opacity-95
                  transition-all duration-200 shadow-md shadow-[#FF6014]/25 hover:shadow-lg hover:shadow-[#FF6014]/30 cursor-pointer active:scale-95 shrink-0"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive Mobile Bottom Sheet Drawer */}
      <MobileBookingDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cartItems={cartItems}
        cartItemCount={cartItemCount}
        cartTotal={cartTotal}
        payableTotal={payableTotal}
        appliedCoupon={appliedCoupon}
        setAppliedCoupon={setAppliedCoupon}
        bookingDetails={bookingDetails}
        setBookingDetails={setBookingDetails}
        isBooking={isBooking}
        onSubmit={handleConfirmBooking}
        serviceId={service.id}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* ── Sub-Components ── */
/* ──────────────────────────────────────────────────────────────────────── */

function DesktopBookingSidebar({
  cartItems,
  cartItemCount,
  cartTotal,
  payableTotal,
  appliedCoupon,
  setAppliedCoupon,
  bookingDetails,
  setBookingDetails,
  isBooking,
  onSubmit,
  serviceId,
  serviceImage,
  serviceName,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
}: any) {
  if (cartItems.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
        {serviceImage ? (
          <div className="w-full aspect-[4/3] rounded-[24px] overflow-hidden border border-slate-50 shadow-xs">
            <img src={serviceImage} alt={serviceName} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full aspect-[4/3] rounded-[24px] bg-rose-50/50 flex items-center justify-center border border-slate-100">
            <ShoppingCart className="w-12 h-12 text-[#FF6014]/30" />
          </div>
        )}

        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF6014]">
            Why Choose Rajseba
          </p>
          <div className="space-y-3.5">
            {trustPoints.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#FFF8F4] rounded-xl flex items-center justify-center shrink-0 border border-[#FF6014]/10">
                  <Icon className="w-4 h-4 text-[#FF6014]" />
                </div>
                <span className="text-sm text-slate-600 font-semibold">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
          <p className="text-xs font-bold text-slate-400">Select services from the list to start booking.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-xl space-y-5 max-h-[calc(100vh-170px)] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-rose-200 [&::-webkit-scrollbar-thumb]:rounded-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-black text-slate-900 flex items-center gap-2">
          <ShoppingCart size={18} className="text-[#FF6014]" />
          Booking Summary
        </h3>
        <button
          type="button"
          onClick={onClearCart}
          className="text-xs font-bold text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Trash2 size={13} />
          Clear All
        </button>
      </div>

      {/* Cart items list */}
      <div className="space-y-3 max-h-40 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-0.5 [&::-webkit-scrollbar-thumb]:bg-slate-200">
        {cartItems.map((item: any) => (
          <div key={item.id} className="flex justify-between items-start gap-3 text-xs pb-3 border-b border-slate-50 last:border-b-0">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-700 truncate">{item.name}</p>
              <p className="text-slate-400 font-semibold truncate text-[10px]">{item.parentTitle}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-0.5 bg-slate-50 border border-slate-100 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="w-5 h-5 rounded-md text-[#FF6014] flex items-center justify-center hover:bg-rose-50 transition cursor-pointer"
                >
                  <Minus size={10} strokeWidth={3} />
                </button>
                <span className="w-5 text-center text-[10px] font-black text-slate-800">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="w-5 h-5 rounded-md text-[#FF6014] flex items-center justify-center hover:bg-rose-50 transition cursor-pointer"
                >
                  <Plus size={10} strokeWidth={3} />
                </button>
              </div>
              <span className="font-black text-slate-700 min-w-[3.5rem] text-right">
                ৳{(Number(item.price) * item.quantity).toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => onRemoveFromCart(item.id)}
                className="text-slate-400 hover:text-rose-500 transition cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 space-y-2">
        <CouponApply
          subtotal={cartTotal}
          serviceId={serviceId}
          onApplied={setAppliedCoupon}
        />
      </div>

      {/* Bill details */}
      <div className="bg-[#FFF8F4] rounded-2xl p-4 border border-[#FF6014]/10 space-y-2 text-xs">
        <div className="flex justify-between items-center text-slate-600 font-semibold">
          <span>Subtotal</span>
          <span>৳{cartTotal.toLocaleString()}</span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between items-center text-emerald-600 font-bold">
            <span>Coupon ({appliedCoupon.coupon.code})</span>
            <span>-৳{Number(appliedCoupon.discount_amount).toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-sm font-black text-slate-800 pt-2 border-t border-slate-200/50">
          <span>Total Price</span>
          <span className="text-[#FF6014] text-base">৳{payableTotal.toLocaleString()}</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-3 items-end">
          <div className="space-y-1 w-full">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Date *</label>
            <CustomCalendar
              value={bookingDetails.date ? dayjs(bookingDetails.date) : null}
              onChange={(date) =>
                setBookingDetails({
                  ...bookingDetails,
                  date: date ? date.format("YYYY-MM-DD") : "",
                })
              }
              placeholder="Select Date"
              minDate={dayjs()}
              className="w-full"
            />
          </div>
          <div className="space-y-1 w-full">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Time</label>
            <CustomSelect
              options={TIME_SLOT_OPTIONS}
              value={bookingDetails.time}
              onChange={(val) => setBookingDetails({ ...bookingDetails, time: val })}
              placeholder="Select Time"
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address *</label>
          <textarea
            required
            rows={2}
            placeholder="Street address, house no, area..."
            value={bookingDetails.location}
            onChange={(e) => setBookingDetails({ ...bookingDetails, location: e.target.value })}
            className="w-full bg-slate-50/55 hover:bg-slate-50 focus:bg-white border border-slate-200/80 hover:border-slate-300 focus:border-[#FF6014] focus:ring-2 focus:ring-[#FF6014]/15 text-slate-800 text-xs rounded-2xl p-3 outline-none transition-all font-semibold resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notes</label>
          <textarea
            rows={1}
            placeholder="Specific requests..."
            value={bookingDetails.notes}
            onChange={(e) => setBookingDetails({ ...bookingDetails, notes: e.target.value })}
            className="w-full bg-slate-50/55 hover:bg-slate-50 focus:bg-white border border-slate-200/80 hover:border-slate-300 focus:border-[#FF6014] focus:ring-2 focus:ring-[#FF6014]/15 text-slate-800 text-xs rounded-2xl p-3 outline-none transition-all font-semibold resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isBooking}
          className="w-full py-3.5 mt-2 bg-[#FF6014] hover:bg-[#E0530A] text-white font-extrabold rounded-2xl text-sm transition-all shadow-md shadow-rose-100 hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
        >
          {isBooking ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Placing Booking...
            </>
          ) : (
            `Book ${cartItemCount} Service${cartItemCount === 1 ? "" : "s"}`
          )}
        </button>
      </form>
    </div>
  );
}

function MobileBookingDrawer({
  isOpen,
  onClose,
  cartItems,
  cartItemCount,
  cartTotal,
  payableTotal,
  appliedCoupon,
  setAppliedCoupon,
  bookingDetails,
  setBookingDetails,
  isBooking,
  onSubmit,
  serviceId,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
}: any) {
  // Disable body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center p-0 md:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Bottom Sheet Content */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 240 }}
            className="relative bg-white w-full max-w-2xl rounded-t-[32px] md:rounded-[32px] shadow-2xl max-h-[90dvh] md:max-h-[85vh] flex flex-col overflow-hidden z-10 border-t md:border border-slate-100"
          >
            {/* Grab handle indicator */}
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto my-3 shrink-0 md:hidden" />

            {/* Header */}
            <div className="px-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Calendar size={18} className="text-[#FF6014]" />
                Complete Booking Info
              </h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form wrapping the entire body and footer */}
            <form onSubmit={onSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Scrollable body content */}
              <div className="overflow-y-auto flex-1 p-5 space-y-5 [&::-webkit-scrollbar]:w-0.5">
                {/* Selected items list */}
                {cartItems.length > 0 && (
                  <div className="bg-[#FFF8F4] border border-[#FF6014]/10 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-[#FF6014] uppercase tracking-wider pb-2 border-b border-[#FF6014]/10">
                      <span className="flex items-center gap-1">
                        <ShoppingCart size={12} />
                        Selected Services ({cartItemCount})
                      </span>
                      <button type="button" onClick={onClearCart} className="text-slate-400 hover:text-rose-500">
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-3 max-h-36 overflow-y-auto pr-1">
                      {cartItems.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-start gap-3 text-xs">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-700 truncate">{item.name}</p>
                            <p className="text-slate-400 font-semibold truncate text-[10px]">{item.parentTitle}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-0.5 bg-white border border-slate-100 rounded-lg p-0.5">
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="w-5 h-5 rounded-md text-[#FF6014] flex items-center justify-center hover:bg-rose-50 transition cursor-pointer"
                              >
                                <Minus size={10} strokeWidth={3} />
                              </button>
                              <span className="w-5 text-center text-[10px] font-black text-slate-800">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="w-5 h-5 rounded-md text-[#FF6014] flex items-center justify-center hover:bg-rose-50 transition cursor-pointer"
                              >
                                <Plus size={10} strokeWidth={3} />
                              </button>
                            </div>
                            <span className="font-black text-slate-700 min-w-[3.5rem] text-right">
                              ৳{(Number(item.price) * item.quantity).toLocaleString()}
                            </span>
                            <button
                              type="button"
                              onClick={() => onRemoveFromCart(item.id)}
                              className="text-slate-400 hover:text-rose-500 transition cursor-pointer"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* totals */}
                    <div className="pt-2 border-t border-[#FF6014]/10 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600 font-semibold">
                        <span>Subtotal</span>
                        <span>৳{cartTotal.toLocaleString()}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>Coupon ({appliedCoupon.coupon.code})</span>
                          <span>-৳{Number(appliedCoupon.discount_amount).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm font-black text-slate-800 pt-1.5 border-t border-slate-100">
                        <span>Total Price</span>
                        <span className="text-[#FF6014] text-base">৳{payableTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <CouponApply
                    subtotal={cartTotal}
                    serviceId={serviceId}
                    onApplied={setAppliedCoupon}
                  />

                  <div className="grid grid-cols-2 gap-3 items-end">
                    <div className="space-y-1 w-full animate-none">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Date *</label>
                      <CustomCalendar
                        value={bookingDetails.date ? dayjs(bookingDetails.date) : null}
                        onChange={(date) =>
                          setBookingDetails({
                            ...bookingDetails,
                            date: date ? date.format("YYYY-MM-DD") : "",
                          })
                        }
                        placeholder="Select Date"
                        minDate={dayjs()}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-1 w-full animate-none">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Time</label>
                      <CustomSelect
                        options={TIME_SLOT_OPTIONS}
                        value={bookingDetails.time}
                        onChange={(val) => setBookingDetails({ ...bookingDetails, time: val })}
                        placeholder="Select Time"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Enter your street address, house no, area..."
                      value={bookingDetails.location}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, location: e.target.value })}
                      className="w-full bg-slate-50/55 hover:bg-slate-50 focus:bg-white border border-slate-200/80 hover:border-slate-300 focus:border-[#FF6014] focus:ring-2 focus:ring-[#FF6014]/15 text-slate-800 text-xs sm:text-sm rounded-2xl p-3 outline-none transition-all font-semibold resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notes</label>
                    <textarea
                      rows={1}
                      placeholder="Any specific requests or instructions..."
                      value={bookingDetails.notes}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, notes: e.target.value })}
                      className="w-full bg-slate-50/55 hover:bg-slate-50 focus:bg-white border border-slate-200/80 hover:border-slate-300 focus:border-[#FF6014] focus:ring-2 focus:ring-[#FF6014]/15 text-slate-800 text-xs sm:text-sm rounded-2xl p-3 outline-none transition-all font-semibold resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Fixed Footer Buttons */}
              <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-end gap-3 shrink-0 pb-[calc(env(safe-area-inset-bottom)+16px)]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBooking}
                  className="px-6 py-3 text-sm font-bold text-white bg-[#FF6014] hover:bg-[#E0530A] rounded-xl transition shadow-md disabled:opacity-70 flex-1 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isBooking ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Placing...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}