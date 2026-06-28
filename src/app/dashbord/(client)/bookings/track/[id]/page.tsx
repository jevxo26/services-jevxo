"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetBookingByIdQuery } from "@/redux/features/admin/booking";
import {
  ArrowLeft,
  Check,
  Clock,
  User,
  Shield,
  MapPin,
  AlertCircle,
  Phone,
  Mail,
  MessageCircle
} from "lucide-react";

export default function DynamicBookingTracker() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading, error } = useGetBookingByIdQuery(id);
  const booking = data?.data;

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6014]"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <AlertCircle size={48} className="text-slate-300" />
        <p className="text-slate-500 font-medium">Booking not found or an error occurred.</p>
        <button
          onClick={() => router.back()}
          className="text-[#FF6014] hover:underline text-sm font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const steps = [
    { id: "pending", label: "Pending", desc: "Order Placed" },
    { id: "assigned", label: "Assigned", desc: "Pro Assigned" },
    { id: "on_the_way", label: "On The Way", desc: "Pro is coming" },
    { id: "completed", label: "Completed", desc: "Service Done" }
  ];

  // If status is cancelled, we handle it separately
  const isCancelled = booking.status === "cancelled";

  // Determine current step index
  const statusMap: Record<string, number> = {
    pending: 0,
    assigned: 1,
    on_the_way: 2,
    completed: 3
  };

  const currentStepIndex = statusMap[booking.status] ?? 0;

  return (
    <div className="w-full animate-in fade-in duration-200 pb-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-black transition-all focus:outline-none bg-white py-2.5 px-4 rounded-xl border border-slate-200"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="text-right">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Booking ID</span>
            <span className="text-lg font-black text-slate-800">#{booking.id}</span>
          </div>
        </div>

        {/* Tracker Card */}
        <div className="bg-white p-8 sm:p-12 rounded-[36px] border border-slate-100 shadow-sm space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Track Your Booking</h2>
            <p className="text-sm font-bold text-slate-400">Keep an eye on your service progress in real-time</p>
          </div>

          {isCancelled ? (
            <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-rose-500 mx-auto shadow-sm">
                <AlertCircle size={32} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-rose-600">Booking Cancelled</h3>
                <p className="text-sm font-bold text-rose-400 mt-1">This booking has been cancelled and will not proceed.</p>
              </div>
            </div>
          ) : (
            <div className="relative pt-8 pb-4">
              {/* Desktop Stepper */}
              <div className="hidden sm:block">
                <div className="flex items-center justify-between relative z-10">
                  {steps.map((step, index) => {
                    const isCompleted = currentStepIndex > index;
                    const isActive = currentStepIndex === index;

                    return (
                      <div key={step.id} className="flex flex-col items-center relative w-1/4">
                        {/* Connecting Line */}
                        {index !== 0 && (
                          <div className={`absolute top-6 left-[-50%] w-full h-[3px] -z-10 transition-colors duration-500 ${currentStepIndex >= index ? "bg-[#FF6014]" : "bg-slate-100"
                            }`} />
                        )}

                        {/* Circle */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 shadow-sm border-4 border-white ${isCompleted ? "bg-[#FF6014] text-white" :
                            isActive ? "bg-[#FF6014] text-white ring-4 ring-[#FF6014]/20 scale-110" :
                              "bg-slate-100 text-slate-400"
                          }`}>
                          {isCompleted ? <Check size={20} className="stroke-[3]" /> : index + 1}
                        </div>

                        {/* Labels */}
                        <div className="mt-4 text-center">
                          <span className={`text-sm font-black block tracking-wide ${isActive ? "text-[#FF6014]" : isCompleted ? "text-slate-800" : "text-slate-400"}`}>
                            {step.label}
                          </span>
                          <span className={`text-[11px] font-bold mt-1 block ${isActive ? "text-slate-500" : "text-slate-400"}`}>
                            {step.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Stepper */}
              <div className="sm:hidden space-y-6 relative ml-4">
                <div className="absolute left-5 top-5 bottom-5 w-[3px] bg-slate-100 -z-10" />
                <div className="absolute left-5 top-5 bottom-5 w-[3px] bg-[#FF6014] -z-10 transition-all duration-500 origin-top"
                  style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                  const isCompleted = currentStepIndex > index;
                  const isActive = currentStepIndex === index;

                  return (
                    <div key={step.id} className="flex items-center gap-6">
                      <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 shadow-sm border-2 border-white ${isCompleted ? "bg-[#FF6014] text-white" :
                          isActive ? "bg-[#FF6014] text-white ring-4 ring-[#FF6014]/20 scale-110" :
                            "bg-slate-100 text-slate-400"
                        }`}>
                        {isCompleted ? <Check size={16} className="stroke-[3]" /> : index + 1}
                      </div>
                      <div>
                        <span className={`text-sm font-black block tracking-wide ${isActive ? "text-[#FF6014]" : isCompleted ? "text-slate-800" : "text-slate-400"}`}>
                          {step.label}
                        </span>
                        <span className={`text-xs font-bold mt-0.5 block ${isActive ? "text-slate-500" : "text-slate-400"}`}>
                          {step.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Booking & Assigned Info Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Service Details */}
          <div className="bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Service Details</span>
              <h3 className="text-xl font-black text-slate-800">{booking.service?.name || booking.pkg?.name || "Service Details"}</h3>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
                  <Clock size={18} />
                </div>
                <div>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Schedule</span>
                  <span className="text-sm font-bold text-slate-700">{new Date(booking.date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Location</span>
                  <span className="text-sm font-bold text-slate-700">{booking.location || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-black text-slate-400">Total Amount</span>
              <span className="text-xl font-black text-[#FF6014]">৳{booking.total_price || booking.service?.price || booking.pkg?.price || 0}</span>
            </div>
          </div>

          {/* Assigned Personnel */}
          <div className="bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Assigned To</span>
              <h3 className="text-xl font-black text-slate-800">Professionals</h3>
            </div>

            {!booking.vendor && (!booking.employees || booking.employees.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center py-6 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3">
                  <User size={20} />
                </div>
                <span className="text-sm font-bold text-slate-500">We are assigning the best professionals for your service.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Vendor */}
                {booking.vendor && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden shrink-0">
                      <Shield size={20} className="text-[#FF6014]" />
                    </div>
                    <div className="w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm font-black text-slate-800 block">
                            {booking.vendor.name}
                          </span>
                          <span className="text-xs font-bold text-slate-400 block mt-0.5 mb-2">Service Vendor</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-t border-slate-200/60 pt-2 mt-1">
                        {booking.vendor.phone && (
                          <a href={`tel:${booking.vendor.phone}`} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#FF6014] transition-colors">
                            <Phone size={12} className="text-[#FF6014]" />
                            {booking.vendor.phone}
                          </a>
                        )}
                        {booking.vendor.email && (
                          <a href={`mailto:${booking.vendor.email}`} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#FF6014] transition-colors">
                            <Mail size={12} className="text-[#FF6014]" />
                            {booking.vendor.email}
                          </a>
                        )}
                        <button
                          onClick={() => router.push(`/dashbord/live-chat?receiverId=${booking.vendor.id}&receiverName=${encodeURIComponent(booking.vendor.name)}`)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#FF6014] hover:text-[#E0530A] transition-colors sm:ml-auto"
                        >
                          <MessageCircle size={14} /> Message
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Technicians/Employees */}
                {booking.employees?.map((emp: any) => (
                  <div key={emp.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div className="w-12 h-12 rounded-full bg-indigo-500 border border-slate-200 flex items-center justify-center text-white font-bold overflow-hidden shrink-0">
                      {emp.name?.charAt(0).toUpperCase() || <User size={20} />}
                    </div>
                    <div className="w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm font-black text-slate-800 block">{emp.name}</span>
                          <span className="text-xs font-bold text-slate-400 block mt-0.5 mb-2">Assigned Technician</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-t border-slate-200/60 pt-2 mt-1">
                        {emp.phone && (
                          <a href={`tel:${emp.phone}`} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-500 transition-colors">
                            <Phone size={12} className="text-indigo-400" />
                            {emp.phone}
                          </a>
                        )}
                        {emp.email && (
                          <a href={`mailto:${emp.email}`} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-500 transition-colors">
                            <Mail size={12} className="text-indigo-400" />
                            {emp.email}
                          </a>
                        )}
                        <button
                          onClick={() => router.push(`/dashbord/live-chat?receiverId=${emp.id}&receiverName=${encodeURIComponent(emp.name)}`)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors sm:ml-auto"
                        >
                          <MessageCircle size={14} /> Message
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
