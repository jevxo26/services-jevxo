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
  MessageCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CustomTable } from "@/components/ui/table";
import {
  useGetAllProfilesQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
} from "@/redux/features/shared/profileApi";
import { useGetAllCategoriesQuery } from "@/redux/features/admin/category";
import { useGetAllBookingsQuery, useUpdateBookingStatusMutation } from "@/redux/features/admin/booking";
import { useGetOverviewStatsQuery } from "@/redux/features/admin/dashboardApi";
import { toast } from "sonner";

export default function DashboardPage() {
  const rawRole = useAppSelector((state) => state.auth.role) || "client";
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
   PROFESSIONAL REVENUE CHART COMPONENT
   ========================================================================== */
const chartData = [
  { month: "Jan", value: 48000 },
  { month: "Feb", value: 66000 },
  { month: "Mar", value: 54000 },
  { month: "Apr", value: 90000 },
  { month: "May", value: 102000 },
  { month: "Jun", value: 114000 },
];

function RevenueChart({ data }: { data?: { month: string; value: number }[] }) {
  const chartDataToUse = data && data.length > 0 ? data : chartData;
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number; month: string; pct: number } | null>(null);
  const [animatedHeights, setAnimatedHeights] = useState<number[]>(chartDataToUse.map(() => 0));
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const W = 560;
  const H = 240;
  const PADDING = { top: 28, right: 24, bottom: 40, left: 60 };
  const chartW = W - PADDING.left - PADDING.right;
  const chartH = H - PADDING.top - PADDING.bottom;

  const maxVal = Math.max(...chartDataToUse.map((d) => d.value), 1);
  const yMax = Math.ceil(maxVal / 30000) * 30000 || 30000;
  const yTicks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];

  const barWidth = (chartW / chartDataToUse.length) * 0.54;
  const barGap = chartW / chartDataToUse.length;

  const getBarX = (i: number) => PADDING.left + i * barGap + (barGap - barWidth) / 2;
  const getBarH = (val: number) => (val / yMax) * chartH;

  // Staggered animation on mount
  useEffect(() => {
    setAnimatedHeights(chartDataToUse.map(() => 0));
    chartDataToUse.forEach((d, i) => {
      setTimeout(() => {
        setAnimatedHeights((prev) => {
          const next = [...prev];
          next[i] = getBarH(d.value);
          return next;
        });
      }, 60 + i * 80);
    });
  }, [chartDataToUse]);

  const formatVal = (v: number) =>
    v >= 1000 ? `৳${(v / 1000).toFixed(0)}k` : `৳${v}`;

  const prevVal = (i: number) => (i === 0 ? chartDataToUse[0].value : chartDataToUse[i - 1].value);
  const pctChange = (i: number) => {
    if (i === 0) return 0;
    return Math.round(((chartDataToUse[i].value - prevVal(i)) / prevVal(i)) * 100) || 0;
  };

  return (
    <div className="relative w-full select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full overflow-visible"
        style={{ maxHeight: 260 }}
        onMouseLeave={() => { setTooltip(null); setHoveredIdx(null); }}
      >
        <defs>
          {/* Main bar gradient */}
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6014" />
            <stop offset="100%" stopColor="#FFBAB4" stopOpacity="0.75" />
          </linearGradient>
          {/* Hover bar gradient — richer */}
          <linearGradient id="barGradHover" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E05A50" />
            <stop offset="60%" stopColor="#FF6014" />
            <stop offset="100%" stopColor="#FFB3AD" stopOpacity="0.8" />
          </linearGradient>
          {/* Gloss overlay */}
          <linearGradient id="barGloss" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0.22" />
            <stop offset="50%" stopColor="white" stopOpacity="0.06" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          {/* Hover glow */}
          <filter id="barGlow" x="-30%" y="-10%" width="160%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#FF6014" floodOpacity="0.28" />
          </filter>
          {/* Subtle track shadow */}
          <filter id="trackShadow" x="-5%" y="-2%" width="110%" height="110%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#cbd5e1" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Background subtle dot grid */}
        <pattern id="dotGrid" x={PADDING.left} y={PADDING.top} width="40" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.8" fill="#e2e8f0" />
        </pattern>
        <rect x={PADDING.left} y={PADDING.top} width={chartW} height={chartH} fill="url(#dotGrid)" opacity="0.5" />

        {/* Horizontal grid lines + Y-axis labels */}
        {yTicks.map((tick, i) => {
          const y = PADDING.top + chartH - (tick / yMax) * chartH;
          const isZero = tick === 0;
          return (
            <g key={i}>
              <line
                x1={PADDING.left}
                y1={y}
                x2={W - PADDING.right}
                y2={y}
                stroke={isZero ? "#e2e8f0" : "#f1f5f9"}
                strokeWidth={isZero ? 1.5 : 1}
                strokeDasharray={isZero ? "none" : "4 4"}
              />
              <text
                x={PADDING.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize={10}
                fill="#94a3b8"
                fontFamily="Inter, ui-sans-serif, sans-serif"
                fontWeight={500}
                letterSpacing="-0.3"
              >
                {formatVal(tick)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {chartDataToUse.map((d, i) => {
          const bx = getBarX(i);
          const animH = animatedHeights[i] ?? 0;
          const by = PADDING.top + chartH - animH;
          const isHov = hoveredIdx === i;
          const r = 9; // corner radius

          return (
            <g key={d.month}>
              {/* Track */}
              <rect
                x={bx}
                y={PADDING.top}
                width={barWidth}
                height={chartH}
                rx={r}
                fill="#f8fafc"
                filter="url(#trackShadow)"
              />

              {/* Main bar with CSS transition via style */}
              <rect
                x={bx}
                y={by}
                width={barWidth}
                height={animH}
                rx={r}
                fill={isHov ? "url(#barGradHover)" : "url(#barGrad)"}
                filter={isHov ? "url(#barGlow)" : undefined}
                style={{
                  transition: "y 0.6s cubic-bezier(.34,1.4,.64,1), height 0.6s cubic-bezier(.34,1.4,.64,1), filter 0.15s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={() => {
                  setHoveredIdx(i);
                  const svgEl = svgRef.current;
                  if (!svgEl) return;
                  const rect = svgEl.getBoundingClientRect();
                  const scaleX = rect.width / W;
                  const scaleY = rect.height / H;
                  setTooltip({
                    x: bx * scaleX + (barWidth / 2) * scaleX,
                    y: (by - 14) * scaleY,
                    value: d.value,
                    month: d.month,
                    pct: pctChange(i),
                  });
                }}
                onMouseLeave={() => { setHoveredIdx(null); setTooltip(null); }}
              />

              {/* Gloss overlay — only on bar area */}
              {animH > 4 && (
                <rect
                  x={bx}
                  y={by}
                  width={barWidth * 0.55}
                  height={animH}
                  rx={r}
                  fill="url(#barGloss)"
                  style={{ pointerEvents: "none", transition: "y 0.6s cubic-bezier(.34,1.4,.64,1), height 0.6s cubic-bezier(.34,1.4,.64,1)" }}
                />
              )}

              {/* Value label on top of bar when hovered */}
              {isHov && animH > 8 && (
                <text
                  x={bx + barWidth / 2}
                  y={by - 5}
                  textAnchor="middle"
                  fontSize={9.5}
                  fill="#FF6014"
                  fontFamily="Inter, ui-sans-serif, sans-serif"
                  fontWeight={700}
                  letterSpacing="-0.2"
                >
                  {formatVal(d.value)}
                </text>
              )}

              {/* Month label */}
              <text
                x={bx + barWidth / 2}
                y={H - 8}
                textAnchor="middle"
                fontSize={11}
                fill={isHov ? "#64748b" : "#94a3b8"}
                fontFamily="Inter, ui-sans-serif, sans-serif"
                fontWeight={isHov ? 700 : 600}
              >
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Rich Floating Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-20 whitespace-nowrap -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl px-4 py-3 min-w-[120px]">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">{tooltip.month} 2026</div>
            <div className="text-base font-bold leading-tight">৳{tooltip.value.toLocaleString()}</div>
            {tooltip.pct !== 0 && (
              <div className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${tooltip.pct > 0 ? "text-emerald-400" : "text-red-400"}`}>
                {tooltip.pct > 0 ? "▲" : "▼"} {Math.abs(tooltip.pct)}% vs prev
              </div>
            )}
          </div>
          <div className="w-0 h-0 mx-auto border-l-[7px] border-r-[7px] border-t-[7px] border-l-transparent border-r-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   1. SUPER ADMIN DASHBOARD
   ========================================================================== */
function SuperAdminDashboard() {
  const authUser = useAppSelector((state) => state.auth.user);
  const { data: bookingsRes, isLoading: isBookingsLoading } = useGetAllBookingsQuery(undefined);
  const { data: overviewRes, isLoading: isOverviewLoading } = useGetOverviewStatsQuery();
  
  const allBookings = bookingsRes?.data || [];
  const overview = overviewRes?.data || {
    revenue: { total: 0, today: 0, weekly: 0, monthly: 0, chart: [] },
    users: { totalClients: 0, totalVendors: 0, totalAgents: 0 },
    bookings: { todayAssigned: 0, completed: 0, pending: 0 },
    withdraws: { totalAmount: 0, todayAmount: 0, weeklyAmount: 0, monthlyAmount: 0 }
  };

  const dynamicChartData = overview.revenue.chart.map((c: any) => ({
    month: c.date,
    value: c.amount
  }));

  const recentBookings = [...allBookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(b => ({
      id: String(b.id),
      customer: b.user?.name || "Unknown Customer",
      service: b.nestedService?.name || b.pkg?.name || "Service",
      provider: b.vendor?.name || b.vendor?.email || "Unassigned",
      amount: `৳${Number(b.total_price || 0).toLocaleString()}`,
      status: b.status,
      date: new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
    }));

  const adminColumns = [
    {
      key: "id",
      header: "Booking ID",
      render: (b: any) => <span className="font-bold text-brand-primary">#{b.id}</span>
    },
    { key: "customer", header: "Customer" },
    { key: "service", header: "Service" },
    { key: "provider", header: "Provider" },
    {
      key: "amount",
      header: "Amount",
      render: (b: any) => <span className="font-semibold text-slate-700">{b.amount}</span>
    },
    {
      key: "status",
      header: "Status",
      render: (b: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${b.status === "completed" ? "bg-emerald-50 text-emerald-700"
              : b.status === "on_the_way" ? "bg-indigo-50 text-indigo-700"
                : b.status === "assigned" ? "bg-amber-50 text-amber-700"
                  : b.status === "cancelled" ? "bg-red-50 text-red-700"
                    : "bg-slate-50 text-slate-700"
            }`}
        >
          {b.status.replace(/_/g, " ")}
        </span>
      )
    },
    {
      key: "date",
      header: "Date",
      render: (b: any) => <span className="text-xs text-slate-500 font-medium">{b.date}</span>
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* ── Premium Header ── */}
      <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm px-7 py-6">
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-gradient-to-br from-[#FF6014]/10 to-[#FFB3AD]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-tr from-indigo-100/40 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Live Dashboard
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Hello, <span className="text-[#FF6014]">{authUser?.name || "Admin"}</span>!
            </h1>
            <p className="text-slate-400 mt-1.5 text-sm font-medium">Real-time statistics and administrative insights for Rajseba.</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-slate-700">
                {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">Bangladesh Standard Time</span>
            </div>
            <div className="w-px h-8 bg-slate-100 hidden sm:block" />
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6014] to-[#E0530A] flex items-center justify-center shadow-lg shadow-[#FF6014]/25">
              <Sparkles size={18} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Key Performance Metrics (Revenue & Withdrawals) ── */}
      <h2 className="text-xl font-bold text-slate-800 -mb-2 mt-4 px-1">Financial Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: "Total Revenue", value: `৳${overview.revenue.total.toLocaleString()}`, sub: "All time", icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
          { label: "Today's Revenue", value: `৳${overview.revenue.today.toLocaleString()}`, sub: "Today", icon: TrendingUp, color: "text-indigo-600 bg-indigo-50" },
          { label: "Total Withdraws", value: `৳${overview.withdraws.totalAmount.toLocaleString()}`, sub: "All time", icon: Briefcase, color: "text-amber-600 bg-amber-50" },
          { label: "Today's Withdraws", value: `৳${overview.withdraws.todayAmount.toLocaleString()}`, sub: "Today", icon: AlertCircle, color: "text-red-600 bg-red-50" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-all duration-200">
              <div className={`p-3 rounded-xl ${stat.color} shrink-0`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">{stat.label}</p>
                <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">{stat.value}</h4>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── User & Booking Metrics ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Stats Grid */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-bold text-slate-900">User Demographics</h3>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Users size={18} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100/50">
              <p className="text-2xl font-extrabold text-slate-800">{overview.users.totalClients}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Clients</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100/50">
              <p className="text-2xl font-extrabold text-slate-800">{overview.users.totalVendors}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Vendors</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100/50">
              <p className="text-2xl font-extrabold text-slate-800">{overview.users.totalAgents}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Agents</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center px-2">
            <span className="text-sm font-semibold text-slate-500">Total Registered Users</span>
            <span className="text-lg font-bold text-[#FF6014]">{overview.users.totalClients + overview.users.totalVendors + overview.users.totalAgents}</span>
          </div>
        </div>

        {/* Booking Stats Grid */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-bold text-slate-900">Booking Pipeline</h3>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 size={18} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100/50">
              <p className="text-2xl font-extrabold text-emerald-600">{overview.bookings.completed}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Completed</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100/50">
              <p className="text-2xl font-extrabold text-amber-500">{overview.bookings.pending}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Pending</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100/50">
              <p className="text-2xl font-extrabold text-indigo-500">{overview.bookings.todayAssigned}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Assigned</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center px-2">
            <span className="text-sm font-semibold text-slate-500">Active Pipeline Total</span>
            <span className="text-lg font-bold text-slate-800">{overview.bookings.completed + overview.bookings.pending + overview.bookings.todayAssigned}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Revenue Chart */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex justify-between items-start border-b border-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Revenue Trends</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Daily breakdown (Last 7 Days)</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
              <span className="inline-block w-3 h-3 rounded-sm bg-gradient-to-b from-[#FF6014] to-[#FFBAB4]" />
              Revenue
            </div>
          </div>
        </div>
        <div className="px-4 pt-4 pb-2">
          <RevenueChart data={dynamicChartData} />
        </div>
        <div className="mx-6 mb-5 mt-1 grid grid-cols-4 divide-x divide-slate-100 bg-slate-50/70 rounded-2xl border border-slate-100 overflow-hidden">
          {[
            { label: "This Month Rev", value: `৳${overview.revenue.monthly.toLocaleString()}`, accent: "text-[#FF6014]" },
            { label: "This Week Rev", value: `৳${overview.revenue.weekly.toLocaleString()}`, accent: "text-indigo-500" },
            { label: "Month Withdraws", value: `৳${overview.withdraws.monthlyAmount.toLocaleString()}`, accent: "text-emerald-500" },
            { label: "Week Withdraws", value: `৳${overview.withdraws.weeklyAmount.toLocaleString()}`, accent: "text-amber-500" },
          ].map((s, i) => (
            <div key={i} className="text-center py-3 px-2">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{s.label}</p>
              <p className={`text-sm font-extrabold mt-1 ${s.accent}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
          <h3 className="text-lg font-bold text-slate-900">Recent Booking Log</h3>
          <Link href="/dashbord/manage-bookings" className="text-xs font-semibold text-[#FF6014] hover:underline flex items-center gap-0.5">
            View All Bookings <ArrowUpRight size={14} />
          </Link>
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

  const myProfile = profilesRes?.data?.find(
    (p: any) => p.user?.id === authUser?.id || p.user?.id === Number(authUser?.id) || p.user_id === authUser?.id || p.user_id === Number(authUser?.id)
  );

  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const { data: bookingsRes, isLoading: isBookingsLoading } = useGetAllBookingsQuery(undefined);
  const myBookings = bookingsRes?.data?.filter((b: any) =>
    b.vendor?.id === authUser?.id || b.vendor?._id === authUser?.id
  ) || [];

  const completedBookings = myBookings.filter(b => b.status === "completed");
  const todayEarnings = completedBookings.reduce((sum, b) => {
    const completedDate = new Date(b.updatedAt).toDateString();
    const today = new Date().toDateString();
    if (completedDate === today) {
      return sum + Number(b.total_price || 0);
    }
    return sum;
  }, 0);

  const stats = [
    { label: "Today's Earnings", value: `৳${todayEarnings.toLocaleString()}`, desc: "From completed bookings", icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
    { label: "Projects completed", value: completedBookings.length.toString(), desc: "Total projects completed", icon: CheckCircle2, color: "text-teal-600 bg-teal-50" },
    { label: "Starting Price", value: myProfile?.min_starting_price !== undefined ? `৳${myProfile.min_starting_price}` : "N/A", desc: "Minimum starting price", icon: Calendar, color: "text-indigo-600 bg-indigo-50" },
    { label: "My Rating", value: myProfile?.rating !== undefined ? `${myProfile.rating} / 5` : "New", desc: myProfile?.company_name || "Professional Profile", icon: Star, color: "text-amber-600 bg-amber-50" },
  ];

  const providerJobs = myBookings.map(b => ({
    id: String(b.id),
    customer: b.user?.name || "Unknown Customer",
    phone: b.user?.phone || "N/A",
    address: b.location || "N/A",
    service: b.nestedService?.name || b.pkg?.name || "Service",
    time: `${b.date || ''} ${b.time || ''}`,
    amount: `৳${Number(b.total_price || 0).toLocaleString()}`,
    status: b.status,
  }));

  const [activeJob, setActiveJob] = useState<string | null>(null);

  useEffect(() => {
    if (!activeJob && providerJobs.length > 0) {
      setActiveJob(providerJobs[0].id);
    }
  }, [providerJobs, activeJob]);

  const updateJobStatus = async (id: string, newStatus: string) => {
    try {
      await updateBookingStatus({ id, status: newStatus.toLowerCase().replace(/\s+/g, '_') }).unwrap();
      toast.success(`Booking ${id} status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
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
        await updateProfileMut({ id: myProfile.id, data: profileData }).unwrap();
        toast.success("Business profile updated successfully!");
        setIsEditingProfile(false);
      } else {
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
      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm px-7 py-6">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-teal-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-100 text-teal-600 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse inline-block" />
              Provider Mode
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Provider Dashboard</h1>
            <p className="text-slate-400 mt-1.5 text-sm font-medium">Hello, <span className="text-slate-600 font-semibold">{authUser?.name || myProfile?.company_name || "Provider"}</span>! Manage your active schedules and monitor earnings.</p>
          </div>
          <div className="flex items-center gap-3 bg-white border border-slate-100 p-3 rounded-2xl shadow-sm shrink-0">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-semibold text-slate-700">Online &amp; Available</span>
            <button className="text-xs font-semibold text-[#FF6014] bg-[#FFF8F4] hover:bg-[#FFF0EB]/50 px-3 py-1.5 rounded-xl transition-all">
              Toggle Offline
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="group bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3 sm:gap-4 hover:shadow-lg hover:shadow-slate-100/80 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
              <div className={`p-2.5 sm:p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform duration-200 shrink-0`}>
                <Icon size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-400 font-semibold truncate">{stat.label}</p>
                <h4 className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-0.5 leading-tight tracking-tight">{stat.value}</h4>
                <span className="text-[10px] sm:text-xs text-slate-400 mt-1 block font-medium leading-tight">{stat.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Jobs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jobs List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">My Job Schedule</h3>

          <div className="space-y-4">
            {providerJobs.map((job) => {
              const currentStatus = job.status;
              return (
                <div
                  key={job.id}
                  onClick={() => setActiveJob(job.id)}
                  className={`p-4 border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md cursor-pointer transition-all ${activeJob === job.id ? "border-[#FF6014]/40 bg-[#FFF8F4]/20" : "border-slate-100"
                    }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#FF6014]">#{job.id}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${currentStatus === "completed" ? "bg-emerald-50 text-emerald-700"
                          : currentStatus === "on_the_way" ? "bg-indigo-50 text-indigo-700"
                            : currentStatus === "assigned" ? "bg-amber-50 text-amber-700"
                              : currentStatus === "cancelled" ? "bg-red-50 text-red-700"
                                : "bg-slate-50 text-slate-700"
                        }`}>
                        {currentStatus.replace(/_/g, " ")}
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

        {/* Right Column */}
        <div className="space-y-6">
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
                  <p className="text-xs font-semibold text-[#FF6014] flex items-center gap-1">
                    <Phone size={12} /> {activeJobDetails.phone}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Update Status</p>
                  {activeJobDetails.status !== "completed" && activeJobDetails.status !== "cancelled" ? (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => updateJobStatus(activeJobDetails.id, "On The Way")}
                        className={`w-full py-2.5 rounded-xl text-xs font-semibold border transition-all ${activeJobDetails.status === "on_the_way"
                            ? "bg-amber-500 border-amber-500 text-white"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                          }`}
                      >
                        On The Way
                      </button>
                      <button
                        onClick={() => updateJobStatus(activeJobDetails.id, "Completed")}
                        className="w-full py-2.5 rounded-xl text-xs font-semibold border transition-all border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 text-slate-700"
                      >
                        Mark as Completed
                      </button>
                      <button
                        onClick={() => updateJobStatus(activeJobDetails.id, "Cancelled")}
                        className="w-full py-2.5 rounded-xl text-xs font-semibold border transition-all border-slate-200 hover:bg-red-50 hover:text-red-600 text-red-500"
                      >
                        Cancel Booking
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
                  className="text-xs font-semibold text-[#FF6014] hover:text-[#E0530A] px-3 py-1.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
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
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-[#FF6014]/40"
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
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-[#FF6014]/40"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-[#FF6014]/40"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Business Category</label>
                      <select
                        name="category_id"
                        defaultValue={myProfile?.category?.id || ""}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-[#FF6014]/40"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-[#FF6014]/40"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-[#FF6014]/40"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-[#FF6014]/40"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={isCreating || isUpdating}
                        className="flex-1 py-2 bg-[#FF6014] hover:bg-[#E0530A] text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
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
                  <div className="w-12 h-12 bg-[#FFF8F4] rounded-xl flex items-center justify-center text-[#FF6014] font-bold shrink-0">
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
                          className="text-[#FF6014] hover:underline font-semibold"
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
  const router = useRouter();

  const { data: bookingsRes, isLoading } = useGetAllBookingsQuery();
  const myBookings = bookingsRes?.data || [];

  const activeBookings = myBookings.filter((b: any) => b.status === "assigned" || b.status === "on_the_way" || b.status === "pending");
  const completedBookings = myBookings.filter((b: any) => b.status === "completed");
  const totalSpent = completedBookings.reduce((sum: number, b: any) => sum + Number(b.total_price || 0), 0);

  const stats = [
    { label: "Active Orders", value: `${activeBookings.length} Service(s)`, desc: activeBookings.length > 0 ? "Provider is assigned" : "No active orders", icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Completed Bookings", value: `${completedBookings.length} Service(s)`, desc: "Expert home care received", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
    { label: "Total Spent", value: `৳${totalSpent.toLocaleString()}`, desc: "Lifetime expenditure", icon: DollarSign, color: "text-teal-600 bg-teal-50" },
    { label: "Active Promos", value: "3 Available", desc: "Up to 20% off next booking", icon: Sparkles, color: "text-[#E0530A] bg-[#FFF8F4]" },
  ];

  const customerBookings = [...myBookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(b => ({
    id: `RS-${b.id}`,
    service: b.service?.name || "Custom Service",
    provider: b.vendor?.name || "Pending Assignment",
    amount: `৳${b.total_price || 0}`,
    date: new Date(b.createdAt).toLocaleDateString(),
    status: b.status,
    vendorId: b.vendor?.id
  }));

  const customerColumns = [
    {
      key: "id",
      header: "Booking ID",
      render: (b: any) => <span className="font-bold text-brand-primary">{b.id}</span>
    },
    { key: "service", header: "Service Booked" },
    { key: "provider", header: "Expert Provider" },
    { key: "amount", header: "Amount Paid" },
    {
      key: "status",
      header: "Status",
      render: (b: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${b.status === "completed" ? "bg-emerald-50 text-emerald-700"
            : b.status === "cancelled" ? "bg-red-50 text-red-700"
              : "bg-amber-50 text-amber-700"
          }`}>
          {b.status.replace('_', ' ')}
        </span>
      )
    },
    { key: "date", header: "Date Completed" },
    {
      key: "actions",
      header: "Actions",
      render: (b: any) => (
        b.vendorId ? (
          <button
            onClick={() => router.push(`/dashbord/live-chat?receiverId=${b.vendorId}&receiverName=${encodeURIComponent(b.provider)}`)}
            className="text-xs bg-[#FFF8F4] text-[#FF6014] px-3 py-1.5 rounded-lg font-bold hover:bg-[#FFF0EB] transition-colors"
          >
            Chat Provider
          </button>
        ) : <span className="text-xs text-slate-400">Waiting for provider</span>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm px-7 py-6">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-[#FF6014]/10 to-amber-100/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
              Client Portal
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, <span className="text-[#FF6014]">{authUser?.name || "Client"}</span>!
            </h1>
            <p className="text-slate-400 mt-1.5 text-sm font-medium">Keep track of your active services and book premium care for your home.</p>
          </div>
          <button className="shrink-0 bg-gradient-to-br from-[#FF6014] to-[#E0530A] hover:from-[#E0530A] hover:to-[#CC5049] text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-[#FF6014]/25 text-sm transition-all active:scale-[0.985] flex items-center gap-2">
            <Plus size={16} /> Book a New Service
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="group bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3 sm:gap-4 hover:shadow-lg hover:shadow-slate-100/80 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
              <div className={`p-2.5 sm:p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform duration-200 shrink-0`}>
                <Icon size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-400 font-semibold truncate">{stat.label}</p>
                <h4 className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-0.5 leading-tight tracking-tight">{stat.value}</h4>
                <span className="text-[10px] sm:text-xs text-slate-400 mt-1 block font-medium leading-tight">{stat.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tracking Active Booking & Quick Book Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Booking Tracker */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Active Service Tracker</h3>
            <span className="text-xs text-[#FF6014] font-semibold bg-[#FFF8F4] px-2.5 py-1 rounded-lg">Real-time update</span>
          </div>

          {activeBookings.length > 0 ? activeBookings.map((activeBooking: any) => (
            <div key={activeBooking.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase">Booking ID</span>
                  <p className="text-base font-bold text-[#FF6014]">RS-{activeBooking.id}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase">Service Category</span>
                  <p className="text-base font-bold text-slate-800">{activeBooking.service?.name || "Service"}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase">Provider</span>
                  <p className="text-base font-bold text-slate-800">{activeBooking.vendor?.name || "Pending..."}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service Timeline</p>
                  <div className="flex items-center gap-2">
                    {activeBooking.vendor?.id && (
                      <button
                        onClick={() => router.push(`/dashbord/live-chat?receiverId=${activeBooking.vendor.id}&receiverName=${encodeURIComponent(activeBooking.vendor.name)}`)}
                        className="bg-[#FFF8F4] hover:bg-[#FFF0EB] text-[#FF6014] border border-[#FF6014]/20 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <MessageCircle size={14} /> Chat
                      </button>
                    )}
                    <button
                      onClick={() => router.push(`/dashbord/bookings/track/${activeBooking.id}`)}
                      className="bg-[#FF6014] hover:bg-[#E0530A] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <MapPin size={14} /> Track Flow
                    </button>
                  </div>
                </div>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#FFF0EB]">
                  {[
                    { title: "Booking Confirmed", desc: "Your booking was accepted.", done: true, current: activeBooking.status === "pending" },
                    { title: "Expert Assigned", desc: "A provider has been assigned.", done: activeBooking.status === "assigned" || activeBooking.status === "on_the_way", current: activeBooking.status === "assigned" },
                    { title: "En Route / Travelling", desc: "Technician will start journey to your address", done: activeBooking.status === "on_the_way", current: activeBooking.status === "on_the_way" },
                    { title: "Service Complete", desc: "Final verification and payment completion", done: false, current: false },
                  ].map((step, i) => (
                    <div key={i} className="relative">
                      <span className={`absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 ring-4 ring-white ${step.done ? "bg-[#FF6014] border-[#FF6014]"
                          : step.current ? "bg-[#FF6014] border-[#FF6014] animate-pulse"
                            : "bg-slate-200 border-slate-200"
                        }`} />
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
          )) : (
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-2">
              <p className="text-sm font-bold text-slate-500">No active bookings right now</p>
              <p className="text-xs text-slate-400">Book a new service and track its real-time progress here.</p>
            </div>
          )}
        </div>

        {/* Promo Code Banners */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Active Offers</h3>

          <div className="space-y-4">
            {[
              { code: "ACCOOL20", discount: "20% OFF", service: "Valid on AC Repairs", expiry: "Exp: June 30" },
              { code: "CLEANHOMY", discount: "৳500 OFF", service: "Valid on Deep Cleaning", expiry: "Exp: July 05" },
            ].map((promo, i) => (
              <div key={i} className="p-4 bg-[#FFF8F4] border border-[#FFF0EB]/50 rounded-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-16 h-16 bg-[#FF6014]/5 rounded-bl-full flex items-center justify-center font-bold text-[#FF6014] text-xs">%</div>
                <span className="text-xs font-bold text-[#E0530A] tracking-wider bg-[#FFF0EB]/60 px-2 py-0.5 rounded-lg">{promo.code}</span>
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

  const { data: bookingsRes, isLoading } = useGetAllBookingsQuery();

  const myBookings = bookingsRes?.data?.filter((b: any) =>
    b.agent?.id === authUser?.id || b.user?.agent?.id === authUser?.id
  ) || [];

  const totalBookings = myBookings.length;
  const thisWeekBookings = myBookings.filter((b: any) => {
    const bookingDate = new Date(b.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - bookingDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  const totalOrderVolume = myBookings.reduce((sum: number, b: any) => sum + Number(b.total_price || 0), 0);
  const totalCommission = myBookings.reduce((sum: number, b: any) => sum + ((Number(b.total_price || 0) * Number(b.service?.agent_commission_percentage || authUser?.commission_percentage || 0)) / 100), 0);

  const stats = [
    { label: "Bookings Placed", value: `${totalBookings} Orders`, desc: `${thisWeekBookings} active this week`, icon: Briefcase, color: "text-[#E0530A] bg-[#FFF8F4]" },
    { label: "Total Order Volume", value: `৳${totalOrderVolume.toLocaleString()}`, desc: "Lifetime booking value", icon: Zap, color: "text-amber-600 bg-amber-50" },
    { label: "Est. Commission", value: `৳${totalCommission.toLocaleString()}`, desc: "Total potential earnings", icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
    { label: "Wallet Balance", value: `৳${authUser?.wallet_balance || 0}`, desc: "Available for withdrawal", icon: Clock, color: "text-indigo-600 bg-indigo-50" },
  ];

  const agentOrders = [...myBookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10).map(b => ({
    id: `RS-${b.id}`,
    customer: b.user?.name || "Unknown",
    service: b.service?.name || "Custom Service",
    amount: `৳${b.total_price}`,
    commission: `৳${(Number(b.total_price || 0) * Number(b.service?.agent_commission_percentage || authUser?.commission_percentage || 0)) / 100}`,
    status: b.status,
    date: new Date(b.createdAt).toLocaleDateString(),
  }));

  const agentColumns = [
    {
      key: "id",
      header: "Order ID",
      render: (o: any) => <span className="font-bold text-brand-primary">{o.id}</span>
    },
    { key: "customer", header: "Client" },
    { key: "service", header: "Service" },
    { key: "amount", header: "Price" },
    {
      key: "commission",
      header: "Commission",
      render: (o: any) => <span className="font-bold text-emerald-600">+{o.commission}</span>
    },
    {
      key: "status",
      header: "Status",
      render: (o: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${o.status === "completed" ? "bg-emerald-50 text-emerald-700"
            : o.status === "cancelled" ? "bg-red-50 text-red-700"
              : "bg-amber-50 text-amber-700"
          }`}>
          {o.status.replace('_', ' ')}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm px-7 py-6">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-indigo-100/50 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse inline-block" />
              Agent Partner
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Agent Partner Desk</h1>
            <p className="text-slate-400 mt-1.5 text-sm font-medium">Hello, <span className="text-slate-600 font-semibold">{authUser?.name || "Agent"}</span>! Book services on behalf of clients and track your commissions.</p>
          </div>
          <Link
            href="/dashbord/quick-booking"
            className="shrink-0 bg-gradient-to-br from-[#FF6014] to-[#E0530A] hover:from-[#E0530A] hover:to-[#CC5049] text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-[#FF6014]/25 text-sm transition-all active:scale-[0.985] text-center flex items-center gap-2 w-fit"
          >
            <Zap size={15} /> Quick Booking Console
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="group bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3 sm:gap-4 hover:shadow-lg hover:shadow-slate-100/80 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
              <div className={`p-2.5 sm:p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform duration-200 shrink-0`}>
                <Icon size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-400 font-semibold truncate">{stat.label}</p>
                <h4 className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-0.5 leading-tight tracking-tight">{stat.value}</h4>
                <span className="text-[10px] sm:text-xs text-slate-400 mt-1 block font-medium leading-tight">{stat.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Commission Analytics & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
            <h3 className="text-lg font-bold text-slate-900">Recent Placed Orders</h3>
            <Link href="/dashbord/orders" className="text-xs font-semibold text-[#FF6014] hover:underline">
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

        {/* Commission Tier */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Commission Tier</h3>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
              <span>Current Default Rate</span>
              <span className="text-[#FF6014] text-sm">{authUser?.commission_percentage || 0}% Commission</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#FF6014] rounded-full w-3/4" />
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
                  <span className="text-[#FF6014] font-bold">✓</span>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200 rounded-xl" />
          <div className="h-4 w-72 bg-slate-200/80 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-xl self-start sm:self-auto" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
              <div className="w-16 h-6 bg-slate-100 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-slate-200 rounded-lg" />
              <div className="h-7 w-16 bg-slate-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-6 w-36 bg-slate-200 rounded-lg" />
            <div className="h-8 w-20 bg-slate-100 rounded-xl" />
          </div>
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-4 gap-4 pb-2 border-b border-slate-100">
              <div className="h-4 bg-slate-200 rounded col-span-2" />
              <div className="h-4 bg-slate-200 rounded" />
              <div className="h-4 bg-slate-200 rounded" />
            </div>
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="grid grid-cols-4 gap-4 py-3 border-b border-slate-50 last:border-0 items-center">
                <div className="flex items-center gap-3 col-span-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
                  <div className="h-4 w-24 bg-slate-200 rounded-lg" />
                </div>
                <div className="h-4 w-16 bg-slate-100 rounded-lg" />
                <div className="h-6 w-20 bg-slate-100 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-6 w-32 bg-slate-200 rounded-lg" />
            <div className="h-4 w-12 bg-slate-100 rounded-lg" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-4/5 bg-slate-200 rounded-lg" />
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