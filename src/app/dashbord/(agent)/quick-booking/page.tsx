"use client";

import { useAppSelector } from "@/redux/hooks";
import { getRoleName } from "@/redux/features/auth/authSlice";
import { ShieldAlert, Zap, User, Phone, MapPin, Calendar, Check, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { CustomSelect } from "@/components/ui/select";
import { CustomCalendar } from "@/components/ui/calendar";
import dayjs from "dayjs";

export default function AgentQuickBookingPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";
  const [bookingDetails, setBookingDetails] = useState({
    clientName: "",
    clientPhone: "",
    serviceCategory: "AC Servicing & Repair",
    scheduleDate: "",
    scheduleTime: "12:00 PM - 02:00 PM",
    clientAddress: "",
    preferredProvider: "Kabir AC Repair",
  });

  const serviceCategories = [
    { value: "AC Servicing & Repair", label: "AC Servicing & Repair", desc: "Quick leak repairs & gas refill" },
    { value: "Deep Home Cleaning", label: "Deep Home Cleaning", desc: "Sofa, kitchen & carpet cleaning" },
    { value: "Expert Plumbing", label: "Expert Plumbing", desc: "Water pipe leakage & sanitary repair" },
    { value: "Wall Painting & Decor", label: "Wall Painting & Decor", desc: "Premium wall finishes & consultations" },
  ];

  const timeSlots = [
    { value: "09:00 AM - 12:00 PM", label: "Morning Slot", desc: "09:00 AM - 12:00 PM" },
    { value: "12:00 PM - 02:00 PM", label: "Midday Slot", desc: "12:00 PM - 02:00 PM" },
    { value: "03:00 PM - 05:00 PM", label: "Afternoon Slot", desc: "03:00 PM - 05:00 PM" },
    { value: "06:00 PM - 08:00 PM", label: "Evening Slot", desc: "06:00 PM - 08:00 PM" },
  ];

  const providers = [
    { value: "Kabir AC Repair", label: "Kabir AC Repair", desc: "4.8 Star Technician" },
    { value: "Clean & Bright", label: "Clean & Bright", desc: "4.7 Star Cleaning Team" },
    { value: "Dhaka Decorators", label: "Dhaka Decorators", desc: "4.9 Star Painting Agency" },
    { value: "System Default (Auto-assign)", label: "System Default", desc: "Assign best matching professional" },
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Booking placed successfully! Commission credited.");
    setBookingDetails({
      clientName: "",
      clientPhone: "",
      serviceCategory: "AC Servicing & Repair",
      scheduleDate: "",
      scheduleTime: "12:00 PM - 02:00 PM",
      clientAddress: "",
      preferredProvider: "Kabir AC Repair",
    });
  };

  if (role !== "agent") {
    return <AccessDenied roleRequired="Agent" />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="text-amber-500 fill-amber-500" /> Quick Booking Console
          </h1>
          <p className="text-slate-500 mt-1">Book services instantly on behalf of your leads/clients to earn 15% commission.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <form onSubmit={handleBookingSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Customer Contact */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-2">1. Client Contact Details</h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Client Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Asif Zaman"
                  value={bookingDetails.clientName}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, clientName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Client Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 017XXXXXXXX"
                  value={bookingDetails.clientPhone}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, clientPhone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Full Address</label>
                <textarea
                  rows={3}
                  placeholder="Street address, house number, area..."
                  value={bookingDetails.clientAddress}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, clientAddress: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-semibold resize-none"
                  required
                />
              </div>
            </div>

            {/* Service & Schedule */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-2">2. Service &amp; Schedule</h3>

              <CustomSelect
                label="Service Category"
                options={serviceCategories}
                value={bookingDetails.serviceCategory}
                onChange={(val) => setBookingDetails({ ...bookingDetails, serviceCategory: val })}
                placeholder="Select category"
              />

              <CustomCalendar
                label="Schedule Date"
                value={bookingDetails.scheduleDate ? dayjs(bookingDetails.scheduleDate) : null}
                onChange={(date) => setBookingDetails({ ...bookingDetails, scheduleDate: date ? date.format("YYYY-MM-DD") : "" })}
                placeholder="Select schedule date"
              />

              <CustomSelect
                label="Time Slot"
                options={timeSlots}
                value={bookingDetails.scheduleTime}
                onChange={(val) => setBookingDetails({ ...bookingDetails, scheduleTime: val })}
                placeholder="Select slot"
              />

              <CustomSelect
                label="Preferred Expert Provider"
                options={providers}
                value={bookingDetails.preferredProvider}
                onChange={(val) => setBookingDetails({ ...bookingDetails, preferredProvider: val })}
                placeholder="Select provider"
              />
            </div>

          </div>

          <div className="flex justify-end pt-4 border-t border-slate-50">
            <button
              type="submit"
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-8 py-3 rounded-xl text-sm shadow-md shadow-rose-500/10 transition-all active:scale-[0.98]"
            >
              Submit Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AccessDenied({ roleRequired }: { roleRequired: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
      <div className="p-4 bg-rose-50 rounded-2xl text-rose-500 mb-4">
        <ShieldAlert size={48} />
      </div>
      <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        This subpage is only accessible to users with the <strong className="text-slate-800">{roleRequired}</strong> role. 
        Please toggle your preview role using the selector at the top.
      </p>
    </div>
  );
}
