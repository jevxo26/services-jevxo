"use client";

import { useAppSelector } from "@/redux/hooks";
import { ShieldAlert, Zap, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { CustomSelect } from "@/components/ui/select";
import { CustomCalendar } from "@/components/ui/calendar";
import dayjs from "dayjs";

import { useGetAllServicesQuery } from "@/redux/features/admin/service";
import { useGetAllUsersQuery } from "@/redux/features/admin/user";
import { useCreateBookingMutation } from "@/redux/features/admin/booking";
import { useGetAllNestedServicesQuery } from "@/redux/features/admin/service";

export default function AgentQuickBookingPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";
  const authUser = useAppSelector((state) => state.auth.user);

  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedNestedServiceId, setSelectedNestedServiceId] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [notes, setNotes] = useState("");

  const { data: servicesRes, isLoading: loadingServices } = useGetAllServicesQuery();
  const { data: nestedRes } = useGetAllNestedServicesQuery();
  const { data: usersRes } = useGetAllUsersQuery();
  const [createBooking, { isLoading: submitting }] = useCreateBookingMutation();

  const services = (servicesRes?.data || []) as any[];
  const nestedServices = (nestedRes?.data || []) as any[];
  const allUsers = (usersRes?.data || Array.isArray(usersRes) ? (usersRes?.data || usersRes) : []) as any[];

  const serviceOptions = services.map((s: any) => ({ value: String(s.id), label: s.name }));
  const nestedOptions = nestedServices
    .filter((ns: any) => !selectedServiceId || String(ns.service?.id) === selectedServiceId)
    .map((ns: any) => ({ value: String(ns.id), label: ns.name }));
  const vendorOptions = allUsers
    .filter((u: any) => u.role?.name === "Vendor" || u.role === "Vendor")
    .map((u: any) => ({ value: String(u.id), label: u.name }));

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendorId) {
      toast.error("Please select a vendor.");
      return;
    }

    try {
      const payload: any = {
        vendor_id: Number(selectedVendorId),
        location: clientAddress,
        notes,
        date: scheduleDate || undefined,
        user_id: authUser?.id,
      };
      if (selectedNestedServiceId) {
        payload.nested_service_id = Number(selectedNestedServiceId);
      }

      await createBooking(payload).unwrap();
      toast.success("Booking placed successfully!");

      // Reset
      setSelectedServiceId("");
      setSelectedNestedServiceId("");
      setSelectedVendorId("");
      setScheduleDate("");
      setClientAddress("");
      setNotes("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to place booking. Please try again.");
    }
  };

  if (role !== "agent") {
    return <AccessDenied roleRequired="Agent" />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Quick Booking Console</h1>
            <p className="text-xs text-slate-400 mt-0.5">Book services instantly on behalf of your leads/clients.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <form onSubmit={handleBookingSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Service & Schedule */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-2">1. Service & Schedule</h3>

              <CustomSelect
                label="Service Category"
                options={loadingServices ? [{ value: "", label: "Loading..." }] : serviceOptions}
                value={selectedServiceId}
                onChange={(val) => { setSelectedServiceId(val); setSelectedNestedServiceId(""); }}
                placeholder="Select a service"
              />

              {selectedServiceId && nestedOptions.length > 0 && (
                <CustomSelect
                  label="Sub-Service"
                  options={nestedOptions}
                  value={selectedNestedServiceId}
                  onChange={(val) => setSelectedNestedServiceId(val)}
                  placeholder="Select sub-service"
                />
              )}

              <CustomSelect
                label="Preferred Expert Provider (Vendor)"
                options={vendorOptions}
                value={selectedVendorId}
                onChange={(val) => setSelectedVendorId(val)}
                placeholder="Select vendor"
              />

              <CustomCalendar
                label="Schedule Date"
                value={scheduleDate ? dayjs(scheduleDate) : null}
                onChange={(date) => setScheduleDate(date ? date.format("YYYY-MM-DD") : "")}
                placeholder="Select schedule date"
              />
            </div>

            {/* Address & Notes */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-2">2. Location & Notes</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Service Address *</label>
                <textarea
                  rows={4}
                  placeholder="Street address, house number, area..."
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all font-semibold resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Notes (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Any special instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all font-semibold resize-none"
                />
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-4 border-t border-slate-50">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#FF6014] hover:bg-[#E0530A] disabled:opacity-70 text-white font-bold px-8 py-3 rounded-xl text-sm shadow-md shadow-[#FF6014]/10 transition-all active:scale-[0.98] flex items-center gap-2"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
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
      <div className="p-4 bg-[#FFF8F4] rounded-2xl text-[#FF6014] mb-4">
        <ShieldAlert size={48} />
      </div>
      <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        This subpage is only accessible to users with the <strong className="text-slate-800">{roleRequired}</strong> role.
      </p>
    </div>
  );
}
