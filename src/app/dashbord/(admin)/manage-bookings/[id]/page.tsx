"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useGetBookingByIdQuery, useUpdateBookingStatusMutation, useDeleteBookingMutation, useAssignEmployeeToBookingMutation } from "@/redux/features/admin/booking";
import { useGetEmployeesByVendorQuery } from "@/redux/features/admin/user";
import { Calendar, User, Package as PkgIcon, MapPin, Briefcase, ShieldCheck, Trash2, ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'bg-amber-50 text-amber-600 border border-amber-200';
    case 'assigned': return 'bg-blue-50 text-blue-600 border border-blue-200';
    case 'on_the_way': return 'bg-purple-50 text-purple-600 border border-purple-200';
    case 'completed': return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
    case 'cancelled': return 'bg-[#FFF8F7] text-[#E5675D] border border-[#FF7C71]/30';
    default: return 'bg-slate-50 text-slate-600 border border-slate-200';
  }
};

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const bookingId = Array.isArray(id) ? id[0] : id;

  const { data: response, isLoading, isError } = useGetBookingByIdQuery(bookingId as string, {
    skip: !bookingId
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();
  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();
  const [assignEmployee, { isLoading: isAssigning }] = useAssignEmployeeToBookingMutation();

  const booking = response?.data;

  const { data: vendorEmployeesRes, isLoading: isLoadingEmployees } = useGetEmployeesByVendorQuery(
    booking?.vendor?.id, 
    { skip: !booking?.vendor?.id }
  );
  
  const vendorEmployees = vendorEmployeesRes?.data || [];

  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

  useEffect(() => {
    if (booking?.employees) {
      setSelectedEmployees(booking.employees.map((e: any) => e.id));
    }
  }, [booking?.employees]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <p className="text-lg font-medium">Booking not found or an error occurred.</p>
        <Link href="/dashbord/manage-bookings" className="mt-4 text-brand-primary hover:underline">
          Return to Bookings
        </Link>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus({ id: booking.id, status: newStatus }).unwrap();
      toast.success("Booking status updated successfully");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to update status");
    }
  };

  const handleToggleEmployee = (id: number) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleSaveAssignments = async () => {
    try {
      await assignEmployee({ id: booking.id, employee_ids: selectedEmployees }).unwrap();
      toast.success("Employees assigned successfully");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to assign employees");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this booking? This action cannot be undone.")) return;
    try {
      await deleteBooking(booking.id).unwrap();
      toast.success("Booking deleted successfully");
      router.push("/dashbord/manage-bookings");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to delete booking");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200 pb-12">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashbord/manage-bookings"
            className="p-2 hover:bg-white rounded-xl transition-colors text-slate-500 border border-transparent hover:border-slate-200 hover:shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Booking #{booking.id}</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Manage details, vendor, and status</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Top Status Bar */}
        <div className="bg-slate-50 border-b border-slate-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Current Status</p>
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize shadow-sm inline-flex items-center gap-1.5 ${getStatusColor(booking.status)}`}>
              {booking.status === 'pending' && <Clock size={14} />}
              {booking.status === 'assigned' && <ShieldCheck size={14} />}
              {booking.status === 'on_the_way' && <MapPin size={14} />}
              {booking.status === 'completed' && <CheckCircle size={14} />}
              {booking.status === 'cancelled' && <XCircle size={14} />}
              {booking.status}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Update Status:</span>
            <select 
              value={booking.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdating}
              className="bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 px-4 py-2 focus:ring-2 focus:ring-brand-primary/20 outline-none shadow-sm min-w-[140px] cursor-pointer disabled:opacity-50"
            >
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="on_the_way">On the way</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            
            {/* Left Column */}
            <div className="space-y-8">
              {/* Client Info */}
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <User size={14}/> Client Information
                </h3>
                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 space-y-3">
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-0.5">Name</p>
                    <p className="text-sm font-bold text-slate-800">{booking.user?.name || "Unknown Client"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-0.5">Email Address</p>
                    <p className="text-sm font-semibold text-slate-600">{booking.user?.email || "No email"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-0.5">Service Location</p>
                    <p className="text-sm font-medium text-slate-700 flex items-start gap-1.5 mt-1">
                      <MapPin size={14} className="shrink-0 mt-0.5 text-brand-primary" />
                      {booking.location}
                    </p>
                  </div>
                </div>
              </section>

              {/* Date Info */}
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Calendar size={14}/> Schedule
                </h3>
                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium mb-0.5">Booking Date</p>
                  <p className="text-base font-bold text-slate-800">
                    {booking.date ? new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Date not set'}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-3">Created on: {new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Service Info */}
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Briefcase size={14}/> Service Details
                </h3>
                <div className="bg-brand-primary/5 rounded-2xl p-4 border border-brand-primary/10">
                  {booking.subServices && booking.subServices.length > 0 ? (
                    <div>
                      <span className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-bold mb-2 uppercase tracking-wider">
                        Sub Services
                      </span>
                      <div className="space-y-1">
                        {booking.subServices.map((sub: any) => (
                          <p key={sub.id} className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Briefcase size={16} /> {sub.name} - ৳{sub.price}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : booking.pkg ? (
                    <div>
                      <span className="inline-flex items-center gap-1.5 bg-brand-primary/10 text-brand-primary px-2.5 py-1 rounded-lg text-xs font-bold mb-2 uppercase tracking-wider">
                        Package
                      </span>
                      <p className="text-lg font-bold text-slate-800">{booking.pkg.name}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No specific service or package attached</p>
                  )}
                </div>
              </section>

              {/* Vendor Info */}
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <ShieldCheck size={14}/> Assigned Workforce
                </h3>
                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 space-y-4">
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-0.5">Assigned Vendor / Agency</p>
                    {booking.vendor ? (
                    <>
                      <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">V</div>
                        {booking.vendor.name}
                      </div>
                      
                      <div className="pt-4 mt-2 border-t border-slate-200">
                        <p className="text-xs text-slate-400 font-medium mb-1.5">Assign / Update Professionals</p>
                        
                        {isLoadingEmployees ? (
                          <p className="text-xs text-slate-500 animate-pulse">Loading employees...</p>
                        ) : vendorEmployees.length > 0 ? (
                          <div className="space-y-3">
                            <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                              {vendorEmployees.map((emp: any) => (
                                <label key={emp.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 transition-colors">
                                  <input 
                                    type="checkbox" 
                                    checked={selectedEmployees.includes(emp.id)}
                                    onChange={() => handleToggleEmployee(emp.id)}
                                    className="mt-1 w-4 h-4 text-brand-primary border-slate-300 rounded focus:ring-brand-primary"
                                  />
                                  <div>
                                    <p className="text-sm font-medium text-slate-800">{emp.name}</p>
                                    {emp.profile?.category && (
                                      <p className="text-xs text-slate-500">{emp.profile.category.name}</p>
                                    )}
                                  </div>
                                </label>
                              ))}
                            </div>
                            <button
                              onClick={handleSaveAssignments}
                              disabled={isAssigning}
                              className="w-full py-2 bg-brand-primary text-white text-sm font-bold rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50"
                            >
                              {isAssigning ? "Saving..." : "Save Assignments"}
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                            No employees found for this vendor.
                          </p>
                        )}
                        
                        {booking.employees && booking.employees.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-slate-200">
                            <p className="text-xs text-slate-400 font-medium mb-2">Currently Assigned:</p>
                            <div className="flex flex-wrap gap-2">
                              {booking.employees.map((emp: any) => (
                                <span key={emp.id} className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                                  <CheckCircle size={14} /> {emp.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg inline-block border border-amber-100">
                      Pending Vendor Assignment
                    </p>
                  )}
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Notes Section (Full Width) */}
          {booking.notes && (
            <section className="mt-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                Additional Notes
              </h3>
              <div className="bg-amber-50/60 border border-amber-100/50 rounded-2xl p-5 text-sm text-amber-900 leading-relaxed font-medium">
                "{booking.notes}"
              </div>
            </section>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-100 p-6 flex justify-end">
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#E5675D] bg-white border border-[#FF7C71]/30 hover:bg-[#FFF8F7] hover:border-[#FF7C71]/40 rounded-xl transition-all shadow-sm disabled:opacity-50"
          >
            <Trash2 size={16} /> 
            {isDeleting ? "Deleting..." : "Delete Booking Record"}
          </button>
        </div>
      </div>
    </div>
  );
}
