"use client"

import * as React from "react"
import { useAppSelector } from "@/redux/hooks";
import { getRoleName } from "@/redux/features/auth/authSlice";
import {
  Sparkles,
  Plus,
  Share2,
  ChevronRight,
  Calendar,
  Trash2,
  Star,
  Heart,
  Zap,
  FileText,
  SlidersHorizontal,
  Download,
  MessageCircle,
  Check,
  Briefcase,
  DollarSign,
  Clock,
  ArrowUpRight,
  ShieldAlert
} from "lucide-react"
import Link from "next/link"
import { CustomTable } from "@/components/ui/table"

export default function UnifiedOverviewPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <OverviewSkeleton />;
  }

  if (role === "agent") {
    return <AgentOverview />
  }

  return <CustomerOverview />
}

/* ==========================================================================
   1. CUSTOMER OVERVIEW VIEW
   ========================================================================== */
function CustomerOverview() {
  const authUser = useAppSelector((state) => state.auth.user);

  const recommendedServices = [
    {
      title: "Sofa Deep Cleaning",
      rating: 4.8,
      desc: "Keep your furniture hygienic and fresh with our steam treatment.",
      price: "৳1,200",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80",
    },
    {
      title: "Master AC Service",
      rating: 4.9,
      desc: "Ensure peak cooling efficiency and save on energy bills.",
      price: "৳850",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80",
    },
    {
      title: "Emergency Plumbing",
      rating: 4.7,
      desc: "24/7 expert support for leaks, blockages, and repairs.",
      price: "৳500",
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&auto=format&fit=crop&q=80",
    },
  ]

  const historyServices = [
    {
      title: "Kitchen Deep Cleaning",
      date: "Oct 12, 2023",
      amount: "৳1,800",
      icon: Sparkles,
    },
    {
      title: "Electrical Wiring Check",
      date: "Sep 28, 2023",
      amount: "৳2,450",
      icon: Zap,
    },
  ]

  const customerBookings = [
    { id: "RS-9284", service: "Expert AC Gas Refill", provider: "Kabir AC Repair", amount: "৳1,400", date: "Today, 03:00 PM", status: "Assigned" },
    { id: "RS-9128", service: "Deep Sofa Cleaning", provider: "Clean & Bright", amount: "৳2,500", date: "May 20, 2026", status: "Completed" },
    { id: "RS-9014", service: "Full Apartment Painting", provider: "Dhaka Decorators", amount: "৳15,000", date: "Apr 12, 2026", status: "Completed" },
  ]

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
  ]

  return (
    <div className="w-full animate-in fade-in duration-200">
      <div className="w-full space-y-8 relative z-10">

        {/* Header Title & Top Counters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Hello, {authUser?.name || "Client"}</h1>
            <p className="text-slate-500 mt-1 font-semibold text-sm">It's a great day to refresh your home.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white px-6 py-3.5 rounded-2xl border border-slate-100 shadow-sm text-center min-w-[110px]">
              <span className="text-3xl font-black text-rose-500 block leading-tight">02</span>
              <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Active</span>
            </div>

            <div className="bg-white px-6 py-3.5 rounded-2xl border border-slate-100 shadow-sm text-center min-w-[110px]">
              <span className="text-3xl font-black text-[#FF464C] block leading-tight">1,250</span>
              <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Points</span>
            </div>
          </div>
        </div>

        {/* Action Banners Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/dashbord/quick-booking"
            className="relative overflow-hidden bg-[#FF5B60] text-white p-6 rounded-[28px] shadow-lg shadow-rose-500/10 flex items-center justify-between group hover:opacity-95 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full border border-white/10">
                <Plus size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight flex items-center gap-1">
                  Book a New Service <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-rose-100 mt-0.5 font-medium">Get professional help today</p>
              </div>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-50 rounded-2xl text-rose-500">
                <Share2 size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Refer a Friend</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-semibold">Earn credits for sharing</p>
              </div>
            </div>
            <button className="p-2.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors shadow-sm focus:outline-none">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Active Bookings Tracker & Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Bookings</h2>
            <Link href="/dashbord/bookings" className="text-xs font-bold text-rose-500 hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-[28px] border border-slate-100/80 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-[#FF464C] text-base">Deep Home Cleaning</h3>
                    <span className="text-[10px] font-bold text-slate-400 block mt-0.5">ID: #RS-92841</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    In Progress
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-2xl border border-slate-100/40">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="Kamal Hossain avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Kamal Hossain</h4>
                      <p className="text-[10px] font-semibold text-slate-400">Verified Specialist</p>
                    </div>
                  </div>
                  <button className="p-2 bg-white text-rose-500 rounded-xl hover:bg-rose-50 border border-slate-100 shadow-sm transition-colors">
                    <MessageCircle size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="relative flex justify-between text-[10px] font-bold text-slate-400 select-none">
                  <div className="flex flex-col items-center gap-1.5 relative z-10 bg-white px-2">
                    <div className="w-5 h-5 bg-[#FF464C] text-white rounded-full flex items-center justify-center border border-white">
                      <Check size={10} />
                    </div>
                    <span>Assigned</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 relative z-10 bg-white px-2">
                    <div className="w-5 h-5 bg-[#FF464C] text-white rounded-full flex items-center justify-center border border-white">
                      <Check size={10} />
                    </div>
                    <span>On Way</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 relative z-10 bg-white px-2">
                    <div className="w-5 h-5 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center border border-white">
                      3
                    </div>
                    <span>Started</span>
                  </div>

                  <div className="absolute top-2.5 left-6 right-6 h-0.5 bg-slate-100 -z-10">
                    <div className="h-full bg-[#FF464C] w-1/2 rounded-full" />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100/50">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#FF464C] h-full w-3/4 rounded-full" />
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-extrabold text-[#FF464C] uppercase tracking-widest mt-2">
                    <span>Almost Done</span>
                    <span>75%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[28px] border border-slate-100/80 shadow-sm flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base">AC Repair & Service</h3>
                    <span className="text-[10px] font-bold text-slate-400 block mt-0.5">ID: #RS-92842</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    Scheduled
                  </span>
                </div>

                <div className="flex items-center gap-3.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/40">
                  <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block">Appointment Time</span>
                    <h4 className="text-xs font-bold text-slate-800 mt-0.5">Tomorrow, 10:00 AM</h4>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex-1 bg-white hover:bg-rose-50/50 border border-rose-200 text-rose-500 text-xs font-bold py-3 rounded-2xl transition-colors active:scale-[0.98]">
                  Reschedule
                </button>
                <button className="p-3 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-500 rounded-2xl transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Services Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedServices.map((service, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative"
              >
                <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-xl text-slate-500 hover:text-rose-500 transition-colors shadow-sm focus:outline-none">
                    <Heart size={14} className="fill-current" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-slate-800 text-sm">{service.title}</h3>
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs">
                        <Star size={11} className="fill-current" /> {service.rating}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">{service.desc}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <div>
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Starting From</span>
                      <span className="text-sm font-black text-slate-800">{service.price}</span>
                    </div>
                    <button className="w-8 h-8 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md shadow-rose-500/10 transition-transform active:scale-90 focus:outline-none">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service History Logs */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Service History</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl border border-slate-100 shadow-sm transition-colors">
                <SlidersHorizontal size={14} />
              </button>
              <button className="p-2 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl border border-slate-100 shadow-sm transition-colors">
                <Download size={14} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {historyServices.map((history, idx) => {
              const Icon = history.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-rose-50 rounded-xl text-rose-500 shrink-0">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">{history.title}</h4>
                      <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">{history.date}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-50">
                    <div className="text-left sm:text-right">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Amount Paid</span>
                      <span className="text-sm font-black text-slate-800">{history.amount}</span>
                    </div>

                    <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Completed
                    </span>

                    <div className="flex items-center gap-2">
                      <button className="bg-rose-50 hover:bg-rose-100 text-[#FF464C] text-[10px] font-extrabold px-3.5 py-2 rounded-xl transition-colors">
                        Book Again
                      </button>
                      <button className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
                        <FileText size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

/* ==========================================================================
   2. AGENT OVERVIEW VIEW
   ========================================================================== */
function AgentOverview() {
  const authUser = useAppSelector((state) => state.auth.user);

  const stats = [
    { label: "Bookings Placed", value: "124 Orders", desc: "18 active this week", icon: Briefcase, color: "text-rose-600 bg-rose-50" },
    { label: "Today's Bookings", value: "12", desc: "৳15,400 order volume", icon: Zap, color: "text-amber-600 bg-amber-50" },
    { label: "Commission Earned", value: "৳14,500", desc: "৳2,450 this week", icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
    { label: "Pending Payout", value: "৳3,200", desc: "Auto payout on June 15", icon: Clock, color: "text-indigo-600 bg-indigo-50" },
  ]

  const agentOrders = [
    { id: "RS-9310", customer: "Sayed Karim", service: "AC Leak Repair", amount: "৳1,800", commission: "৳270", status: "Assigned", date: "Today, 12:00 PM" },
    { id: "RS-9302", customer: "Salma Khatun", service: "Deep Sofa Clean", amount: "৳2,500", commission: "৳375", status: "Completed", date: "June 11, 2026" },
    { id: "RS-9290", customer: "Rafiqul Islam", service: "Appliance Repair", amount: "৳1,200", commission: "৳180", status: "Completed", date: "June 08, 2026" },
  ]

  const columns = [
    {
      key: "id",
      header: "Booking ID",
      render: (o: any) => <span className="font-bold text-brand-primary">{o.id}</span>
    },
    {
      key: "customer",
      header: "Client Name"
    },
    {
      key: "service",
      header: "Service Booked"
    },
    {
      key: "amount",
      header: "Booking Price"
    },
    {
      key: "commission",
      header: "My Commission",
      render: (o: any) => <span className="font-bold text-emerald-600">+{o.commission}</span>
    },
    {
      key: "status",
      header: "Status",
      render: (o: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${o.status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-indigo-700"
          }`}>
          {o.status}
        </span>
      )
    },
    {
      key: "date",
      header: "Date"
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-200">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Agent Overview</h1>
          <p className="text-slate-500 mt-1">Hello, {authUser?.name || "Agent"}! Manage bookings and track commissions generated by your referrals.</p>
        </div>
        <Link
          href="/dashbord/quick-booking"
          className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg shadow-rose-500/20 text-sm transition-all active:scale-[0.985] text-center"
        >
          Book a New Lead
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

      {/* Active Agent Bookings Ledger */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Recent Lead Orders</h3>
          <Link href="/dashbord/orders" className="text-xs font-bold text-rose-500 hover:underline">
            View Ledger &rarr;
          </Link>
        </div>

        <CustomTable
          columns={columns}
          data={agentOrders}
          searchKey="customer"
          searchPlaceholder="Search leads by customer name..."
          pageSize={5}
        />
      </div>

    </div>
  )
}

function OverviewSkeleton() {
  return (
    <div className="relative min-h-screen p-1 sm:p-6 overflow-hidden animate-pulse">
      <div className="w-full space-y-8 relative z-10">
        {/* Header Title & Top Counters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="h-10 w-48 bg-slate-200 rounded-xl" />
            <div className="h-4 w-64 bg-slate-100 rounded-lg" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-16 w-24 bg-slate-100 rounded-2xl" />
            <div className="h-16 w-24 bg-slate-100 rounded-2xl" />
          </div>
        </div>

        {/* Action Banners Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-20 w-full bg-slate-200 rounded-[28px]" />
          <div className="h-20 w-full bg-slate-100 rounded-[28px]" />
        </div>

        {/* Active Bookings Tracker */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-6 w-36 bg-slate-200 rounded-lg" />
            <div className="h-4 w-16 bg-slate-100 rounded-md" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm h-[200px]" />
            <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm h-[200px]" />
          </div>
        </div>

        {/* Recommended Services Grid */}
        <div className="space-y-4">
          <div className="h-6 w-44 bg-slate-200 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm h-[320px] p-5 flex flex-col justify-between">
                <div className="w-full h-36 bg-slate-100 rounded-2xl" />
                <div className="space-y-2 pt-4">
                  <div className="h-5 w-3/4 bg-slate-200 rounded-lg" />
                  <div className="h-4 w-1/2 bg-slate-100 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
