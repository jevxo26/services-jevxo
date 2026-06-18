"use client";

import { useState } from "react";
import Link from "next/link";
import { CustomTable } from "@/components/ui/table";
import { Calendar, User, Package as PkgIcon, MapPin, Search, ChevronDown, CheckCircle, XCircle, Clock, Trash2, ShieldCheck, Briefcase } from "lucide-react";
import { toast } from "sonner";
import {
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation,
  useCreateBookingMutation
} from "@/redux/features/admin/booking";
import { useGetAllServicesQuery } from "@/redux/features/admin/service";
import { useGetAllUsersQuery } from "@/redux/features/admin/user";

export default function BookingsManagementPage() {
  const { data: bookingsRes, isLoading } = useGetAllBookingsQuery();
  const { data: servicesRes } = useGetAllServicesQuery();
  const { data: usersRes } = useGetAllUsersQuery();
  
  const [updateStatus] = useUpdateBookingStatusMutation();
  const [deleteBooking] = useDeleteBookingMutation();
  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  // Create Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBooking, setNewBooking] = useState<any>({
    user_id: "",
    vendor_id: "",
    service_id: "",
    selection_type: "nested", // 'nested' or 'package'
    nested_service_id: "",
    package_id: "",
    date: "",
    location: "",
    notes: ""
  });

  const bookings = bookingsRes?.data || [];
  const services = servicesRes?.data || [];
  const users = usersRes?.data || [];
  const vendors = users.filter((u: any) => u.role?.name === 'Vendor' || u.role === 'Vendor');
  const clients = users.filter((u: any) => u.role?.name === 'Client' || u.role === 'Client');

  // Filtering dependent dropdowns
  const selectedVendorServices = services.filter((s: any) => s.vendor?.id?.toString() === newBooking.vendor_id);
  const selectedService = services.find((s: any) => s.id?.toString() === newBooking.service_id);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Booking status updated to ${status}`);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to update booking status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      await deleteBooking(id).unwrap();
      toast.success("Booking deleted successfully");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to delete booking");
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.user_id || !newBooking.vendor_id || !newBooking.date || !newBooking.location) {
      toast.error("Client, Vendor, Date, and Location are required!");
      return;
    }

    const payload: any = {
      user_id: Number(newBooking.user_id),
      vendor_id: Number(newBooking.vendor_id),
      date: newBooking.date,
      location: newBooking.location,
    };
    if (newBooking.notes) payload.notes = newBooking.notes;
    if (newBooking.selection_type === 'nested' && newBooking.nested_service_id) {
      payload.nested_service_id = Number(newBooking.nested_service_id);
    }
    if (newBooking.selection_type === 'package' && newBooking.package_id) {
      payload.package_id = Number(newBooking.package_id);
    }

    try {
      await createBooking(payload).unwrap();
      toast.success("Booking created successfully!");
      setIsAddModalOpen(false);
      setNewBooking({ user_id: "", vendor_id: "", service_id: "", selection_type: "nested", nested_service_id: "", package_id: "", date: "", location: "", notes: "" });
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to create booking");
    }
  };

  const filteredBookings = bookings.filter((b: any) => {
    const matchesSearch = b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'assigned': return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'on_the_way': return 'bg-purple-50 text-purple-600 border border-purple-200';
      case 'completed': return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case 'cancelled': return 'bg-rose-50 text-rose-600 border border-rose-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const columns = [
    {
      header: "ID & Date",
      accessorKey: "id",
      render: (item: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">#{item.id}</span>
          <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <Calendar size={12} /> {item.date ? new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
          </span>
        </div>
      )
    },
    {
      header: "Client & Location",
      accessorKey: "user",
      render: (item: any) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
            <User size={14} className="text-slate-400" />
            {item.user?.name || "Unknown"}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <MapPin size={12} />
            <span className="truncate max-w-[150px]">{item.location}</span>
          </div>
        </div>
      )
    },
    {
      header: "Service Details",
      accessorKey: "service",
      render: (item: any) => (
        <div className="flex flex-col gap-1">
          {item.nestedService ? (
            <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg text-xs font-semibold">
              <Briefcase size={12} /> {item.nestedService.name}
            </span>
          ) : item.pkg ? (
            <span className="inline-flex items-center gap-1.5 bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-lg text-xs font-semibold">
              <PkgIcon size={12} /> {item.pkg.name}
            </span>
          ) : (
            <span className="text-xs text-slate-400 italic">No Service</span>
          )}
        </div>
      )
    },
    {
      header: "Vendor & Employee",
      accessorKey: "vendor",
      render: (item: any) => (
        <div className="flex flex-col text-xs space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-400">V:</span> 
            <span className="text-slate-700 font-medium">{item.vendor?.name || "Unassigned"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-400">E:</span> 
            <span className="text-slate-700 font-medium">{item.employee?.name || "Unassigned"}</span>
          </div>
        </div>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      render: (item: any) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(item.status)}`}>
          {item.status}
        </span>
      )
    },
    {
      header: "Actions",
      accessorKey: "actions",
      render: (item: any) => (
        <Link 
          href={`/dashbord/manage-bookings/${item.id}`}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
        >
          View Details
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Bookings</h1>
          <p className="text-slate-500 mt-1">Track and manage all service bookings across the platform.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
          >
            <Calendar size={18} />
            Create Booking
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by client or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {['all', 'pending', 'assigned', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all ${
                filterStatus === status 
                  ? 'bg-brand-primary text-white shadow-md' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <Calendar size={48} className="text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">No Bookings Found</h3>
            <p className="text-slate-500 text-sm max-w-sm">
              {searchTerm || filterStatus !== 'all' 
                ? "We couldn't find any bookings matching your current filters." 
                : "There are currently no bookings in the system."}
            </p>
          </div>
        ) : (
          <CustomTable
            columns={columns}
            data={filteredBookings}
          />
        )}
      </div>

      {/* Create Booking Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Calendar size={20} className="text-brand-primary" />
                Create New Booking
              </h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Client *</label>
                  <select
                    required
                    value={newBooking.user_id}
                    onChange={(e) => setNewBooking({...newBooking, user_id: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-brand-primary focus:border-brand-primary block p-3 outline-none transition-all"
                  >
                    <option value="">-- Choose a Client --</option>
                    {clients.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Vendor *</label>
                  <select
                    required
                    value={newBooking.vendor_id}
                    onChange={(e) => setNewBooking({...newBooking, vendor_id: e.target.value, service_id: "", nested_service_id: "", package_id: ""})}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-brand-primary focus:border-brand-primary block p-3 outline-none transition-all"
                  >
                    <option value="">-- Choose a Vendor --</option>
                    {vendors.map((v: any) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Booking Date *</label>
                  <input
                    type="date"
                    required
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({...newBooking, date: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-brand-primary focus:border-brand-primary block p-3 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location *</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., 123 Main St, City, State"
                  value={newBooking.location}
                  onChange={(e) => setNewBooking({...newBooking, location: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-brand-primary focus:border-brand-primary block p-3 outline-none transition-all"
                />
              </div>

              {newBooking.vendor_id && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <h3 className="font-bold text-slate-700 text-sm mb-2">Service Details (Optional)</h3>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter By Service</label>
                    <select
                      value={newBooking.service_id}
                      onChange={(e) => setNewBooking({...newBooking, service_id: e.target.value, nested_service_id: "", package_id: ""})}
                      className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-brand-primary focus:border-brand-primary block p-2.5 outline-none transition-all"
                    >
                      <option value="">-- All Vendor Services --</option>
                      {selectedVendorServices.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <input type="radio" name="selection_type" value="nested" checked={newBooking.selection_type === 'nested'} onChange={(e) => setNewBooking({...newBooking, selection_type: e.target.value, package_id: ""})} />
                        Nested Service
                      </label>
                      <select
                        disabled={newBooking.selection_type !== 'nested'}
                        value={newBooking.nested_service_id}
                        onChange={(e) => setNewBooking({...newBooking, nested_service_id: e.target.value})}
                        className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-brand-primary focus:border-brand-primary block p-2.5 outline-none transition-all disabled:opacity-50"
                      >
                        <option value="">-- Choose Nested Service --</option>
                        {selectedService ? selectedService.nestedServices?.map((ns: any) => (
                          <option key={ns.id} value={ns.id}>{ns.name}</option>
                        )) : selectedVendorServices.flatMap((s: any) => s.nestedServices || []).map((ns: any) => (
                          <option key={ns.id} value={ns.id}>{ns.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <input type="radio" name="selection_type" value="package" checked={newBooking.selection_type === 'package'} onChange={(e) => setNewBooking({...newBooking, selection_type: e.target.value, nested_service_id: ""})} />
                        Service Package
                      </label>
                      <select
                        disabled={newBooking.selection_type !== 'package'}
                        value={newBooking.package_id}
                        onChange={(e) => setNewBooking({...newBooking, package_id: e.target.value})}
                        className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-brand-primary focus:border-brand-primary block p-2.5 outline-none transition-all disabled:opacity-50"
                      >
                        <option value="">-- Choose Package --</option>
                        {selectedService ? selectedService.packages?.map((p: any) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        )) : selectedVendorServices.flatMap((s: any) => s.packages || []).map((p: any) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Additional Notes</label>
                <textarea
                  rows={3}
                  placeholder="Any special instructions or notes for the vendor..."
                  value={newBooking.notes}
                  onChange={(e) => setNewBooking({...newBooking, notes: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-brand-primary focus:border-brand-primary block p-3 outline-none transition-all resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-brand-primary hover:bg-brand-dark rounded-xl transition-colors shadow-md disabled:opacity-70 flex items-center gap-2"
                >
                  {isCreating ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
                  ) : "Create Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
