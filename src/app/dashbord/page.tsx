"use client";

import { useRole } from "@/context/RoleContext";
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
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CustomTable } from "@/components/ui/table";

export default function DashboardPage() {
  const { role } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (role === "customer") {
      router.push("/dashbord/overview");
    }
  }, [role, router]);

  // Dynamic dashboard rendering based on active role
  switch (role) {
    case "superadmin":
      return <SuperAdminDashboard />;
    case "operator":
      return <OperatorDashboard />;
    case "agent":
      return <AgentDashboard />;
    case "provider":
      return <ProviderDashboard />;
    case "customer":
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
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
            b.status === "Completed"
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
        <h1 className="text-3xl font-bold text-slate-900">System Overview</h1>
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
   2. OPERATOR DASHBOARD
   ========================================================================== */
function OperatorDashboard() {
  const stats = [
    { label: "Pending Dispatch", value: "12", desc: "Requires quick assignment", icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Active Professionals", value: "142 online", desc: "On active service status", icon: HardHat, color: "text-teal-600 bg-teal-50" },
    { label: "Jobs Dispatched Today", value: "78", desc: "+15% vs yesterday", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
    { label: "Urgent Escalations", value: "3", desc: "Customer complaints", icon: AlertCircle, color: "text-rose-600 bg-rose-50" },
  ];

  const pendingDispatches = [
    { id: "RS-9310", customer: "Sayed Karim", address: "Sector 4, Uttara", service: "AC Leak Repair", timeSlot: "12:00 PM - 02:00 PM", urgency: "High" },
    { id: "RS-9309", customer: "Rubina Yasmin", address: "Road 12, Banani", service: "Deep Home Clean", timeSlot: "01:00 PM - 04:00 PM", urgency: "Medium" },
    { id: "RS-9308", customer: "Farid Uddin", address: "Block D, Mirpur 12", service: "Water Line Fix", timeSlot: "03:00 PM - 05:00 PM", urgency: "Low" },
  ];

  const [assigned, setAssigned] = useState<string[]>([]);

  const handleAssign = (id: string) => {
    setAssigned([...assigned, id]);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Operator Dispatch Desk</h1>
        <p className="text-slate-500 mt-1">Assign pending requests, monitor active professionals, and resolve escalations.</p>
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

      {/* Queue Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dispatch Queue (Left 2 columns) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Pending Assignments</h3>
            <span className="text-xs text-slate-400">Real-time update</span>
          </div>

          <div className="space-y-4">
            {pendingDispatches.map((job) => {
              const isAssigned = assigned.includes(job.id);
              return (
                <div key={job.id} className="p-4 border border-slate-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md hover:border-rose-100 transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-rose-500">{job.id}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        job.urgency === "High" ? "bg-rose-50 text-rose-600" : job.urgency === "Medium" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-600"
                      }`}>
                        {job.urgency} Urgency
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-800">{job.service}</h4>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1"><MapPin size={14} /> {job.address}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {job.timeSlot}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-700">{job.customer}</p>
                      <p className="text-xs text-slate-400">Customer</p>
                    </div>
                    <button
                      onClick={() => handleAssign(job.id)}
                      disabled={isAssigned}
                      className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-[0.98] ${
                        isAssigned
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/10"
                      }`}
                    >
                      {isAssigned ? "Assigned ✓" : "Dispatch Expert"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Online Professionals List (Right 1 column) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Available Professionals</h3>
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></span>
          </div>

          <div className="space-y-4">
            {[
              { name: "Abul Hossain", skill: "Plumber", zone: "Uttara Sector 11", rating: 4.8 },
              { name: "Milon Miah", skill: "Electrician", zone: "Mirpur 10", rating: 4.7 },
              { name: "Sumon Khan", skill: "AC Technician", zone: "Banani", rating: 4.9 },
              { name: "Kafil Uddin", skill: "Appliance Repair", zone: "Gulshan 2", rating: 4.6 },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1">
                  <h5 className="text-sm font-semibold text-slate-800">{p.name}</h5>
                  <div className="flex gap-2 text-xs text-slate-400">
                    <span>{p.skill}</span>
                    <span>•</span>
                    <span className="font-semibold text-rose-500">{p.zone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg">
                  ⭐ {p.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. PROVIDER DASHBOARD
   ========================================================================== */
function ProviderDashboard() {
  const stats = [
    { label: "Today's Earnings", value: "৳2,450", desc: "+৳1,200 yesterday", icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
    { label: "Jobs Completed", value: "3 Today", desc: "18 completed this month", icon: CheckCircle2, color: "text-teal-600 bg-teal-50" },
    { label: "Upcoming Bookings", value: "2 Scheduled", desc: "Next job at 03:00 PM", icon: Calendar, color: "text-indigo-600 bg-indigo-50" },
    { label: "My Rating", value: "4.86 / 5", desc: "Top Rated Badge Active", icon: Star, color: "text-amber-600 bg-amber-50" },
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header with toggle availability */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Provider Dashboard</h1>
          <p className="text-slate-500 mt-1">Hello Kabir! Manage your active schedules and monitor earnings.</p>
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
                  className={`p-4 border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md cursor-pointer transition-all ${
                    activeJob === job.id ? "border-rose-300 bg-rose-50/20" : "border-slate-100"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-rose-500">{job.id}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        currentStatus === "Completed"
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

        {/* Job Actions Console (Right 1 column) */}
        {activeJobDetails && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Job Console</h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">Update current status of Booking {activeJobDetails.id}</p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Client Contact</p>
                <h5 className="text-sm font-bold text-slate-800">{activeJobDetails.customer}</h5>
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
                      className={`w-full py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        (jobStatuses[activeJobDetails.id] || activeJobDetails.status) === "On The Way"
                          ? "bg-amber-500 border-amber-500 text-white"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      On The Way
                    </button>
                    <button
                      onClick={() => updateJobStatus(activeJobDetails.id, "In Progress")}
                      className={`w-full py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        (jobStatuses[activeJobDetails.id] || activeJobDetails.status) === "In Progress"
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
      </div>
    </div>
  );
}

/* ==========================================================================
   4. CUSTOMER DASHBOARD
   ========================================================================== */
function CustomerDashboard() {
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
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
            b.status === "Completed"
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
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, Sharmin!</h1>
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
                      className={`absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 ring-4 ring-white ${
                        step.done
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
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
          o.status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
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
          <p className="text-slate-500 mt-1">Hello Rezaul! Book services on behalf of clients and track your commissions.</p>
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