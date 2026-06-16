"use client";

import { useAppSelector } from "@/redux/hooks";
import { getRoleName } from "@/redux/features/auth/authSlice";
import {
  TrendingUp,
  Users,
  Briefcase,
  Star,
  CheckCircle2,
  Clock,
  AlertCircle,
  HardHat,
  DollarSign,
  ArrowUpRight,
  MapPin,
  Calendar,
  Sparkles,
  ChevronRight,
  Phone,
  Zap,
  Building,
  Globe,
  FileText,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CustomTable } from "@/components/ui/table";
import {
  useGetAllProfilesQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
} from "@/redux/features/shared/profileApi";
import { useGetAllCategoriesQuery } from "@/redux/features/admin/category";
import { toast } from "sonner";

export default function DashboardPage() {
  const rawRole = useAppSelector((state) => state.auth.role) || "superadmin";
  const role = typeof rawRole === 'string' ? rawRole.toLowerCase().replace(/\s+/g, '') : "client";
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && role === "client") {
      router.push("/dashbord/overview");
    }
  }, [role, router, isLoading]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Dynamic dashboard rendering based on active role
  switch (role) {
    case "superadmin":
      return <SuperAdminDashboard />;
    case "agent":
      return <AgentDashboard />;
    case "vendor":
      return <ProviderDashboard />;
    case "client":
      return (
        <div className="p-8 text-center text-slate-500 animate-pulse">
          Redirecting to Overview...
        </div>
      );
    default:
      return (
        <div className="p-8 text-center text-slate-500">
          Loading dashboard content...
        </div>
      );
  }
}

/* ==========================================================================
   1. SUPER ADMIN DASHBOARD
   ========================================================================== */
function SuperAdminDashboard() {
  const authUser = useAppSelector((state) => state.auth.user);
  
  const stats = [
    { label: "Total Revenue", value: "৳1,245,600", desc: "+12.5% this month", icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
    { label: "Verified Providers", value: "842", desc: "18 pending approval", icon: HardHat, color: "text-teal-600 bg-teal-50" },
    { label: "Active Bookings", value: "156", desc: "45 in progress", icon: Briefcase, color: "text-indigo-600 bg-indigo-50" },
    { label: "Platform Rating", value: "4.92 / 5", desc: "Based on 12k reviews", icon: Star, color: "text-amber-600 bg-amber-50" },
  ];

  const recentBookings = [
    { id: "RS-9284", customer: "Ahmad Jalal", service: "Expert AC Repair", provider: "Rana AC Service", amount: "৳1,400", status: "In Progress", date: "Today, 11:30 AM" },
    { id: "RS-9283", customer: "Maria Kazi", service: "Premium Painting", provider: "Dhaka Decorators", amount: "৳12,000", status: "Completed", date: "Today, 10:15 AM" },
    { id: "RS-9282", customer: "Asif Zaman", service: "Sparkle Home Clean", provider: "Clean & Bright", amount: "৳2,200", status: "Pending", date: "Today, 09:00 AM" },
    { id: "RS-9281", customer: "Nusrat Jahan", service: "Emergency Plumbing", provider: "Rahim Plumbing", amount: "৳850", status: "Completed", date: "Yesterday" },
  ];

  const adminColumns = [
    {
      key: "id",
      header: "Booking ID",
      render: (b: any) => <span className="font-bold text-brand-primary">{b.id}</span>
    },
    {
      key: "customer",
      header: "Customer"
    },
    {
      key: "service",
      header: "Service"
    },
    {
      key: "provider",
      header: "Provider"
    },
    {
      key: "amount",
      header: "Amount"
    },
    {
      key: "status",
      header: "Status",
      render: (b: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${b.status === "Completed"
              ? "bg-emerald-50 text-emerald-700"
              : b.status === "In Progress"
                ? "bg-indigo-50 text-indigo-700"
                : "bg-amber-50 text-amber-700"
            }`}
        >
          {b.status}
        </span>
      )
    },
    {
      key: "date",
      header: "Date"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Hello, {authUser?.name || "Admin"}!</h1>
        <p className="text-slate-500 mt-1">Real-time statistics and administrative insights for Rajseba.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <h4 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h4>
                <span className="text-xs text-slate-400 mt-1 block font-medium">{stat.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Revenue Chart & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Revenue Growth</h3>
              <p className="text-xs text-slate-500">Monthly breakdown for 2026</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              <TrendingUp size={14} /> +15% YoY
            </span>
          </div>

          {/* Simple Visual Chart using Tailwind */}
          <div className="h-64 flex items-end justify-between gap-4 pt-4 border-b border-slate-100">
            {[
              { month: "Jan", val: 40 },
              { month: "Feb", val: 55 },
              { month: "Mar", val: 45 },
              { month: "Apr", val: 75 },
              { month: "May", val: 85 },
              { month: "Jun", val: 95 },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  style={{ height: `${bar.val}%` }}
                  className="w-full bg-gradient-to-t from-rose-500 to-rose-400 rounded-t-lg relative group transition-all duration-300 hover:brightness-105 hover:shadow-lg hover:shadow-rose-500/20"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow pointer-events-none">
                    ৳{(bar.val * 1200).toLocaleString()}
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Column: Pending Verification */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Pending Approvals</h3>
            <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-lg">18 New</span>
          </div>

          <div className="space-y-4">
            {[
              { name: "Rafiq AC Services", experience: "5 Yrs Exp", skill: "AC Maintenance", rating: "4.8" },
              { name: "Zaman Cleaners", experience: "3 Yrs Exp", skill: "Deep Cleaning", rating: "New" },
              { name: "Mamun Electricians", experience: "8 Yrs Exp", skill: "Wiring Specialist", rating: "4.9" },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                <div>
                  <h5 className="text-sm font-semibold text-slate-800">{p.name}</h5>
                  <span className="text-xs text-slate-400">{p.skill} • {p.experience}</span>
                </div>
                <button className="text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg transition-all active:scale-[0.97]">
                  Verify
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
          <h3 className="text-lg font-bold text-slate-900">Recent Booking Log</h3>
          <button className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-0.5">
            View All Bookings <ArrowUpRight size={14} />
          </button>
        </div>
        <CustomTable
          columns={adminColumns}
          data={recentBookings}
          searchKey="customer"
          searchPlaceholder="Search bookings by customer..."
          pageSize={5}
        />
      </div>
    </div>
  );
}

/* ==========================================================================
   2. PROVIDER DASHBOARD
   ========================================================================== */
function ProviderDashboard() {
  const authUser = useAppSelector((state) => state.auth.user);
  const { data: profilesRes, isLoading: isProfilesLoading } = useGetAllProfilesQuery();
  const { data: categoriesRes } = useGetAllCategoriesQuery();
  
  const [createProfileMut, { isLoading: isCreating }] = useCreateProfileMutation();
  const [updateProfileMut, { isLoading: isUpdating }] = useUpdateProfileMutation();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  
  // Find vendor's profile by user ID (matching string or number)
  const myProfile = profilesRes?.data?.find(
    (p: any) => p.user?.id === authUser?.id || p.user?.id === Number(authUser?.id) || p.user_id === authUser?.id || p.user_id === Number(authUser?.id)
  );

  const stats = [
    { label: "Today's Earnings", value: "৳2,450", desc: "+৳1,200 yesterday", icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
    { label: "Projects completed", value: myProfile?.total_projects !== undefined ? `${myProfile.total_projects}` : "0", desc: "Total projects completed", icon: CheckCircle2, color: "text-teal-600 bg-teal-50" },
    { label: "Starting Price", value: myProfile?.min_starting_price !== undefined ? `৳${myProfile.min_starting_price}` : "N/A", desc: "Minimum starting price", icon: Calendar, color: "text-indigo-600 bg-indigo-50" },
    { label: "My Rating", value: myProfile?.rating !== undefined ? `${myProfile.rating} / 5` : "New", desc: myProfile?.company_name || "Professional Profile", icon: Star, color: "text-amber-600 bg-amber-50" },
  ];

  const providerJobs = [
    { id: "RS-9284", customer: "Asif Zaman", phone: "+880 1712 345678", address: "House 24, Road 4, Mirpur 12", service: "AC Gas Refill", time: "Today, 03:00 PM", amount: "৳1,400", status: "Assigned" },
    { id: "RS-9278", customer: "Imran Khan", phone: "+880 1819 876543", address: "Sector 3, Uttara", service: "AC Servicing (2 Units)", time: "Completed (Today)", amount: "৳1,800", status: "Completed" },
  ];

  const [jobStatuses, setJobStatuses] = useState<Record<string, string>>({
    "RS-9284": "Assigned",
  });

  const [activeJob, setActiveJob] = useState("RS-9284");

  const updateJobStatus = (id: string, newStatus: string) => {
    setJobStatuses({ ...jobStatuses, [id]: newStatus });
  };

  const activeJobDetails = providerJobs.find((j) => j.id === activeJob);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const profileData: any = {
      type: formData.get("type") as 'personal' | 'company',
      company_name: formData.get("company_name") as string || undefined,
      description: formData.get("description") as string || undefined,
      location: formData.get("location") as string || undefined,
      min_starting_price: formData.get("min_starting_price") ? Number(formData.get("min_starting_price")) : undefined,
      google_map_link: formData.get("google_map_link") as string || undefined,
      category_id: formData.get("category_id") ? Number(formData.get("category_id")) : undefined,
    };

    try {
      if (myProfile) {
        // Update existing profile
        await updateProfileMut({ id: myProfile.id, data: profileData }).unwrap();
        toast.success("Business profile updated successfully!");
        setIsEditingProfile(false);
      } else {
        // Create new profile
        profileData.user_id = Number(authUser?.id);
        await createProfileMut(profileData).unwrap();
        toast.success("Business profile created successfully!");
        setIsCreatingProfile(false);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save profile. Please check validation.");
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header with toggle availability */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Provider Dashboard</h1>
          <p className="text-slate-500 mt-1">Hello, {authUser?.name || myProfile?.company_name || "Provider"}! Manage your active schedules and monitor earnings.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-100 p-3 rounded-2xl shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-semibold text-slate-700">Online &amp; Available</span>
          <button className="text-xs font-semibold text-rose-500 bg-rose-50 hover:bg-rose-100/50 px-3 py-1.5 rounded-xl transition-all">
            Toggle Offline
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <h4 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h4>
                <span className="text-xs text-slate-400 mt-1 block font-medium">{stat.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Jobs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jobs List (Left 2 columns) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">My Job Schedule</h3>

          <div className="space-y-4">
            {providerJobs.map((job) => {
              const currentStatus = jobStatuses[job.id] || job.status;
              return (
                <div
                  key={job.id}
                  onClick={() => setActiveJob(job.id)}
                  className={`p-4 border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md cursor-pointer transition-all ${activeJob === job.id ? "border-rose-300 bg-rose-50/20" : "border-slate-100"
                    }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-rose-500">{job.id}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${currentStatus === "Completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : currentStatus === "In Progress"
                            ? "bg-indigo-50 text-indigo-700"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                        {currentStatus}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-800">{job.service}</h4>
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <MapPin size={14} /> {job.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{job.amount}</p>
                      <p className="text-xs text-slate-400">{job.time}</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Column: Job Console & Business Profile */}
        <div className="space-y-6">
          {/* Job Actions Console */}
          {activeJobDetails && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-950">Job Console</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">Update current status of Booking {activeJobDetails.id}</p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Client Contact</p>
                  <h5 className="text-sm font-bold text-slate-850">{activeJobDetails.customer}</h5>
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <Phone size={12} /> {activeJobDetails.phone}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Update Status</p>
                  {activeJobDetails.status !== "Completed" ? (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => updateJobStatus(activeJobDetails.id, "On The Way")}
                        className={`w-full py-2.5 rounded-xl text-xs font-semibold border transition-all ${(jobStatuses[activeJobDetails.id] || activeJobDetails.status) === "On The Way"
                            ? "bg-amber-500 border-amber-500 text-white"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                          }`}
                      >
                        On The Way
                      </button>
                      <button
                        onClick={() => updateJobStatus(activeJobDetails.id, "In Progress")}
                        className={`w-full py-2.5 rounded-xl text-xs font-semibold border transition-all ${(jobStatuses[activeJobDetails.id] || activeJobDetails.status) === "In Progress"
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                          }`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => updateJobStatus(activeJobDetails.id, "Completed")}
                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
                      >
                        Mark Completed
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-center text-xs font-semibold flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={16} /> Job Completed successfully!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Business Profile Console */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Business Profile</h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage your commercial profile details</p>
              </div>
              {!isEditingProfile && !isCreatingProfile && myProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-600 px-3 py-1.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingProfile || isCreatingProfile || !myProfile ? (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                {!myProfile && !isCreatingProfile && (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-2">
                    <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                      You haven't set up your business profile yet. Complete your profile setup to receive bookings and show up in searches!
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsCreatingProfile(true)}
                      className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg transition-all"
                    >
                      Set Up Profile Now
                    </button>
                  </div>
                )}

                {(isCreatingProfile || myProfile) && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Profile Type</label>
                        <select
                          name="type"
                          defaultValue={myProfile?.type || 'personal'}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-rose-300"
                          required
                        >
                          <option value="personal">Personal</option>
                          <option value="company">Company</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Starting Price (৳)</label>
                        <input
                          name="min_starting_price"
                          type="number"
                          placeholder="800"
                          defaultValue={myProfile?.min_starting_price}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-rose-300"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Company/Business Name</label>
                      <input
                        name="company_name"
                        type="text"
                        placeholder="e.g. Rana AC Services"
                        defaultValue={myProfile?.company_name}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-rose-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Business Category</label>
                      <select
                        name="category_id"
                        defaultValue={myProfile?.category?.id || ""}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-rose-300"
                      >
                        <option value="">Select a Category</option>
                        {categoriesRes?.data?.map((cat: any) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Service Location</label>
                      <input
                        name="location"
                        type="text"
                        placeholder="e.g. Mirpur, Dhaka"
                        defaultValue={myProfile?.location}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-rose-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Business Description</label>
                      <textarea
                        name="description"
                        rows={3}
                        placeholder="Describe your expertise and service quality..."
                        defaultValue={myProfile?.description}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-rose-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Google Maps Link</label>
                      <input
                        name="google_map_link"
                        type="url"
                        placeholder="https://maps.google.com/..."
                        defaultValue={myProfile?.google_map_link}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-rose-300"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={isCreating || isUpdating}
                        className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                      >
                        {isCreating || isUpdating ? "Saving..." : "Save Details"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setIsCreatingProfile(false);
                        }}
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 font-bold shrink-0">
                    <Building size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-850">{myProfile.company_name}</h4>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-500 capitalize">
                      {myProfile.type}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 text-xs">
                  <div className="flex items-start gap-2.5">
                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-750">Location</p>
                      <p className="text-slate-500">{myProfile.location || "Not provided"}</p>
                    </div>
                  </div>

                  {myProfile.category && (
                    <div className="flex items-start gap-2.5">
                      <Briefcase size={14} className="text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-750">Category</p>
                        <p className="text-slate-500">{myProfile.category.name}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2.5">
                    <FileText size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-750">Description</p>
                      <p className="text-slate-500 leading-relaxed">{myProfile.description || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <DollarSign size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-750">Min Starting Price</p>
                      <p className="text-slate-500">৳{myProfile.min_starting_price || "Not set"}</p>
                    </div>
                  </div>

                  {myProfile.google_map_link && (
                    <div className="flex items-start gap-2.5">
                      <Globe size={14} className="text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-750">Location Link</p>
                        <a
                          href={myProfile.google_map_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-rose-500 hover:underline font-semibold"
                        >
                          View on Google Maps
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. CUSTOMER DASHBOARD
   ========================================================================== */
function CustomerDashboard() {
  const authUser = useAppSelector((state) => state.auth.user);
  
  const stats = [
    { label: "Active Orders", value: "1 Service", desc: "Provider is arriving today", icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Completed Bookings", value: "14 Services", desc: "Expert home care received", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
    { label: "Total Spent", value: "৳24,500", desc: "৳3,400 spent this month", icon: DollarSign, color: "text-teal-600 bg-teal-50" },
    { label: "Active Promos", value: "3 Available", desc: "Up to 20% off next booking", icon: Sparkles, color: "text-rose-600 bg-rose-50" },
  ];

  const customerBookings = [
    { id: "RS-9284", service: "Expert AC Gas Refill", provider: "Kabir AC Repair", amount: "৳1,400", date: "Today, 03:00 PM", status: "Assigned" },
    { id: "RS-9128", service: "Deep Sofa Cleaning", provider: "Clean & Bright", amount: "৳2,500", date: "May 20, 2026", status: "Completed" },
    { id: "RS-9014", service: "Full Apartment Painting", provider: "Dhaka Decorators", amount: "৳15,000", date: "Apr 12, 2026", status: "Completed" },
  ];

  const customerColumns = [
    {
      key: "id",
      header: "Booking ID",
      render: (b: any) => <span className="font-bold text-brand-primary">{b.id}</span>
    },
    {
      key: "service",
      header: "Service",
      render: (b: any) => <span className="font-semibold text-slate-900">{b.service}</span>
    },
    {
      key: "provider",
      header: "Expert Provider"
    },
    {
      key: "amount",
      header: "Amount Paid"
    },
    {
      key: "status",
      header: "Status",
      render: (b: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${b.status === "Completed"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
            }`}
        >
          {b.status}
        </span>
      )
    },
    {
      key: "date",
      header: "Date Completed"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {authUser?.name || "Client"}!</h1>
          <p className="text-slate-500 mt-1">Keep track of your active services and book premium care for your home.</p>
        </div>
        <button className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg shadow-rose-500/20 text-sm transition-all active:scale-[0.985]">
          Book a New Service
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <h4 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h4>
                <span className="text-xs text-slate-400 mt-1 block font-medium">{stat.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tracking Active Booking & Quick Book Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Booking Tracker (Left 2 columns) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Active Service Tracker</h3>
            <span className="text-xs text-rose-500 font-semibold bg-rose-50 px-2.5 py-1 rounded-lg">Arriving Today</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase">Booking ID</span>
                <p className="text-base font-bold text-rose-500">RS-9284</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase">Service Category</span>
                <p className="text-base font-bold text-slate-800">Expert AC Gas Refill</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase">Technician</span>
                <p className="text-base font-bold text-slate-800">Kabir AC Repair</p>
              </div>
            </div>

            {/* Tracker Step Bar */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service Timeline</p>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-rose-100">
                {[
                  { title: "Booking Confirmed", desc: "Your booking was accepted by Kabir AC Repair", done: true, current: false },
                  { title: "Expert Assigned", desc: "Kabir has been assigned to your service location", done: true, current: true },
                  { title: "En Route / Travelling", desc: "Technician will start journey to your address", done: false, current: false },
                  { title: "Service Complete", desc: "Final verification and payment completion", done: false, current: false },
                ].map((step, i) => (
                  <div key={i} className="relative">
                    <span
                      className={`absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 ring-4 ring-white ${step.done
                          ? "bg-rose-500 border-rose-500"
                          : step.current
                            ? "bg-rose-500 border-rose-500 animate-pulse"
                            : "bg-slate-200 border-slate-200"
                        }`}
                    />
                    <div>
                      <h5 className={`text-sm font-semibold ${step.done || step.current ? "text-slate-800" : "text-slate-400"}`}>
                        {step.title}
                      </h5>
                      <p className={`text-xs ${step.done || step.current ? "text-slate-500" : "text-slate-400"}`}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Promo Code Banners (Right 1 column) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Active Offers</h3>

          <div className="space-y-4">
            {[
              { code: "ACCOOL20", discount: "20% OFF", service: "Valid on AC Repairs", expiry: "Exp: June 30" },
              { code: "CLEANHOMY", discount: "৳500 OFF", service: "Valid on Deep Cleaning", expiry: "Exp: July 05" },
            ].map((promo, i) => (
              <div key={i} className="p-4 bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-100/50 rounded-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-16 h-16 bg-rose-500/5 rounded-bl-full flex items-center justify-center font-bold text-rose-500 text-xs">
                  %
                </div>
                <span className="text-xs font-bold text-rose-600 tracking-wider bg-rose-100/60 px-2 py-0.5 rounded-lg">{promo.code}</span>
                <h4 className="text-lg font-bold text-slate-800 mt-2">{promo.discount}</h4>
                <p className="text-xs text-slate-500 mt-1">{promo.service}</p>
                <span className="text-[10px] text-slate-400 mt-3 block font-semibold">{promo.expiry}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking History Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
          <h3 className="text-lg font-bold text-slate-900">Booking History</h3>
        </div>
        <CustomTable
          columns={customerColumns}
          data={customerBookings}
          searchKey="service"
          searchPlaceholder="Search bookings by service..."
          pageSize={5}
        />
      </div>
    </div>
  );
}

/* ==========================================================================
   5. AGENT DASHBOARD OVERVIEW
   ========================================================================== */
function AgentDashboard() {
  const authUser = useAppSelector((state) => state.auth.user);

  const stats = [
    { label: "Bookings Placed", value: "124 Orders", desc: "18 active this week", icon: Briefcase, color: "text-rose-600 bg-rose-50" },
    { label: "Today's Bookings", value: "12", desc: "৳15,400 order volume", icon: Zap, color: "text-amber-600 bg-amber-50" },
    { label: "Commission Earned", value: "৳14,500", desc: "৳2,450 this week", icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
    { label: "Pending Payout", value: "৳3,200", desc: "Auto payout on June 15", icon: Clock, color: "text-indigo-600 bg-indigo-50" },
  ];

  const agentOrders = [
    { id: "RS-9310", customer: "Sayed Karim", service: "AC Leak Repair", amount: "৳1,800", commission: "৳270", status: "Assigned", date: "Today, 12:00 PM" },
    { id: "RS-9302", customer: "Salma Khatun", service: "Deep Sofa Clean", amount: "৳2,500", commission: "৳375", status: "Completed", date: "Yesterday" },
    { id: "RS-9290", customer: "Rafiqul Islam", service: "Appliance Repair", amount: "৳1,200", commission: "৳180", status: "Completed", date: "June 08, 2026" },
  ];

  const agentColumns = [
    {
      key: "id",
      header: "Order ID",
      render: (o: any) => <span className="font-bold text-brand-primary">{o.id}</span>
    },
    {
      key: "customer",
      header: "Client"
    },
    {
      key: "service",
      header: "Service"
    },
    {
      key: "amount",
      header: "Price"
    },
    {
      key: "commission",
      header: "Commission",
      render: (o: any) => <span className="font-bold text-emerald-600">+{o.commission}</span>
    },
    {
      key: "status",
      header: "Status",
      render: (o: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${o.status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
          }`}>
          {o.status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Agent Partner Desk</h1>
          <p className="text-slate-500 mt-1">Hello, {authUser?.name || "Agent"}! Book services on behalf of clients and track your commissions.</p>
        </div>
        <Link
          href="/dashbord/quick-booking"
          className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg shadow-rose-500/20 text-sm transition-all active:scale-[0.985] text-center"
        >
          Quick Booking Console
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <h4 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h4>
                <span className="text-xs text-slate-400 mt-1 block font-medium">{stat.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Commission Analytics & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Orders Booked */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
            <h3 className="text-lg font-bold text-slate-900">Recent Placed Orders</h3>
            <Link href="/dashbord/orders" className="text-xs font-semibold text-rose-500 hover:underline">
              View All Orders
            </Link>
          </div>
          <CustomTable
            columns={agentColumns}
            data={agentOrders}
            searchKey="customer"
            searchPlaceholder="Search orders..."
            pageSize={5}
          />
        </div>

        {/* Commission Tier Progress */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Commission Tier</h3>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
              <span>Current Rate</span>
              <span className="text-rose-500 text-sm">15% Commission</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full w-3/4" />
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Complete 26 more bookings to unlock **18% Silver Partner commission** rate!
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800">Partner Benefits</h4>
            <div className="space-y-2">
              {[
                { title: "Direct Payouts", desc: "Withdraw to bKash instantly" },
                { title: "Custom Agent Coupons", desc: "Offer 5% off to your clients" },
              ].map((b, idx) => (
                <div key={idx} className="flex gap-3 text-xs">
                  <span className="text-rose-500 font-bold">✓</span>
                  <div>
                    <h5 className="font-semibold text-slate-800">{b.title}</h5>
                    <p className="text-slate-400">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="w-full min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-8 space-y-8 animate-pulse">
      {/* ── Top Header Placeholder ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          {/* Title bar */}
          <div className="h-8 w-48 bg-slate-200 rounded-xl" />
          {/* Subtitle bar */}
          <div className="h-4 w-72 bg-slate-200/80 rounded-lg" />
        </div>
        {/* Action Button placeholder */}
        <div className="h-10 w-32 bg-slate-200 rounded-xl self-start sm:self-auto" />
      </div>

      {/* ── Metric Cards Placeholder (Grid of 4) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              {/* Icon circle placeholder */}
              <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
              {/* Trend pill placeholder */}
              <div className="w-16 h-6 bg-slate-100 rounded-full" />
            </div>
            <div className="space-y-2">
              {/* Title bar */}
              <div className="h-4 w-24 bg-slate-200 rounded-lg" />
              {/* Number bar */}
              <div className="h-7 w-16 bg-slate-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Dashboard Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Table/Chart Card (Col span 2) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center">
            {/* Table title */}
            <div className="h-6 w-36 bg-slate-200 rounded-lg" />
            {/* Table action */}
            <div className="h-8 w-20 bg-slate-100 rounded-xl" />
          </div>
          {/* Table Header */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-4 gap-4 pb-2 border-b border-slate-100">
              <div className="h-4 bg-slate-200 rounded col-span-2" />
              <div className="h-4 bg-slate-200 rounded" />
              <div className="h-4 bg-slate-200 rounded" />
            </div>
            {/* Table Rows (5 rows) */}
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="grid grid-cols-4 gap-4 py-3 border-b border-slate-50 last:border-0 items-center">
                <div className="flex items-center gap-3 col-span-2">
                  {/* Avatar circle */}
                  <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
                  {/* Name */}
                  <div className="h-4 w-24 bg-slate-200 rounded-lg" />
                </div>
                {/* Info Column */}
                <div className="h-4 w-16 bg-slate-100 rounded-lg" />
                {/* Status Column */}
                <div className="h-6 w-20 bg-slate-100 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Mini-feed / List Card */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center">
            {/* Title */}
            <div className="h-6 w-32 bg-slate-200 rounded-lg" />
            {/* More link */}
            <div className="h-4 w-12 bg-slate-100 rounded-lg" />
          </div>
          {/* List items (4 items) */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                {/* Icon or image placeholder */}
                <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0" />
                <div className="space-y-2 flex-1">
                  {/* Title bar */}
                  <div className="h-4 w-4/5 bg-slate-200 rounded-lg" />
                  {/* Description bar */}
                  <div className="h-3 w-1/2 bg-slate-100 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}