"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  Trash2,
  Clock,
  BarChart2,
  Users,
  TrendingUp,
  Filter,
  RefreshCw,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { hydrateLogs, clearLogs, SearchLogEntry } from "@/redux/features/admin/searchLogSlice";
import { toast } from "sonner";
import { format } from "date-fns";
import { useConfirm } from "@/context/ConfirmDialogContext";

/* ── Helpers ──────────────────────────────────────────────── */
function getDeviceLabel(ua?: string): string {
  if (!ua) return "Unknown";
  if (/Mobile|Android|iPhone/i.test(ua)) return "📱 Mobile";
  if (/iPad|Tablet/i.test(ua)) return "📟 Tablet";
  return "🖥️ Desktop";
}

function getSourceBadge(page: string): { label: string; className: string } {
  if (page.includes("live-chat")) return { label: "💬 Live Chat", className: "bg-indigo-50 text-indigo-700 border border-indigo-100" };
  if (page === "/dashbord" || page === "/dashbord/") return { label: "🔍 Global Search", className: "bg-[#FFF8F4] text-[#FF6014] border border-[#FF6014]/20" };
  if (page.includes("dashbord")) {
    const segment = page.split("/").pop() || page;
    return { label: `📋 ${segment.replace(/-/g, " ")}`, className: "bg-slate-100 text-slate-600 border border-slate-200" };
  }
  return { label: page, className: "bg-slate-100 text-slate-500 border border-slate-200" };
}

/* ── Stat Card ─────────────────────────────────────────────── */
function MiniStat({ label, value, icon: Icon, accent }: { label: string; value: string | number; icon: React.ComponentType<any>; accent: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon size={16} className="text-white" />
      </div>
      <div>
        <p className="text-lg font-black text-slate-900 leading-none">{value}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{label}</p>
      </div>
    </div>
  );
}

/* ── Top Searches Chart ─────────────────────────────────────── */
function TopSearches({ logs }: { logs: SearchLogEntry[] }) {
  const counts: Record<string, number> = {};
  logs.forEach((l) => {
    const k = l.query.toLowerCase();
    counts[k] = (counts[k] || 0) + 1;
  });
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const max = sorted[0]?.[1] || 1;

  if (sorted.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-[#FF6014]" />
        <h3 className="font-black text-slate-900 text-sm">Top Searches</h3>
        <span className="text-[10px] font-bold text-slate-400 ml-auto">সর্বাধিক search করা terms</span>
      </div>
      <div className="space-y-2.5">
        {sorted.map(([query, count], i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 w-4 text-right">{i + 1}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-700 truncate max-w-[60%]">"{query}"</span>
                <span className="text-[10px] font-black text-[#FF6014]">{count}×</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF6014] to-[#FFB3AD] rounded-full transition-all duration-500"
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────── */
export default function SessionSearchesPage() {
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const logs = useAppSelector((state) => state.searchLogs.logs);
  const [searchFilter, setSearchFilter] = useState("");
  const [sessionFilter, setSessionFilter] = useState("all");
  const [pageFilter, setPageFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  useEffect(() => {
    dispatch(hydrateLogs());
  }, [dispatch]);

  const sessions = useMemo(() => {
    const s = new Set(logs.map((l) => l.sessionId));
    return Array.from(s);
  }, [logs]);

  const pages = useMemo(() => {
    const p = new Set(logs.map((l) => l.page));
    return Array.from(p);
  }, [logs]);

  const filtered = useMemo(() =>
    logs.filter((l) => {
      const matchQuery = !searchFilter || l.query.toLowerCase().includes(searchFilter.toLowerCase());
      const matchSession = sessionFilter === "all" || l.sessionId === sessionFilter;
      const matchPage = pageFilter === "all" || l.page === pageFilter;
      return matchQuery && matchSession && matchPage;
    }),
    [logs, searchFilter, sessionFilter, pageFilter]
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleClearAll = async () => {
    const isConfirmed = await confirm({
      title: "Clear Search History?",
      message: "Are you sure you want to clear all session search history logs? This action cannot be undone.",
      confirmText: "Clear All",
      cancelText: "Cancel",
      variant: "warning",
    });
    if (!isConfirmed) return;
    dispatch(clearLogs());
    toast.success("সব search logs clear হয়েছে");
  };

  const uniqueSessions = sessions.length;
  const totalSearches = logs.length;
  const todaySearches = logs.filter((l) => {
    const d = new Date(l.timestamp);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* ── Header ── */}
      <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm px-7 py-6">
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-tr from-[#FF6014]/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">
              <Search size={10} />
              Session Search Tracker
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Search History
            </h1>
            <p className="text-slate-400 mt-1 text-sm font-medium">
              সকল user-এর session-ভিত্তিক search activity monitor করুন
            </p>
          </div>

          <button
            onClick={handleClearAll}
            className="shrink-0 inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 font-bold px-4 py-2.5 rounded-2xl text-sm hover:bg-red-100 transition-all"
          >
            <Trash2 size={15} />
            Clear All Logs
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniStat label="Total Searches" value={totalSearches} icon={Search} accent="bg-gradient-to-br from-[#FF6014] to-[#E0530A]" />
        <MiniStat label="Unique Sessions" value={uniqueSessions} icon={Users} accent="bg-gradient-to-br from-indigo-500 to-indigo-600" />
        <MiniStat label="Today's Searches" value={todaySearches} icon={Clock} accent="bg-gradient-to-br from-emerald-500 to-emerald-600" />
        <MiniStat label="Pages Tracked" value={pages.length} icon={BarChart2} accent="bg-gradient-to-br from-amber-500 to-amber-600" />
      </div>

      {/* ── Top Searches + Filter Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Top Searches */}
        <div className="lg:col-span-1">
          <TopSearches logs={logs} />
        </div>

        {/* Filters + Table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
            <Filter size={14} className="text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => { setSearchFilter(e.target.value); setCurrentPage(1); }}
              placeholder="Query search করুন..."
              className="flex-1 min-w-[140px] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 transition-all"
            />
            <select
              value={sessionFilter}
              onChange={(e) => { setSessionFilter(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-[#FF6014] transition-all max-w-[150px]"
            >
              <option value="all">All Sessions</option>
              {sessions.map((s) => (
                <option key={s} value={s}>{s.substring(0, 18)}…</option>
              ))}
            </select>
            <select
              value={pageFilter}
              onChange={(e) => { setPageFilter(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-[#FF6014] transition-all"
            >
              <option value="all">All Pages</option>
              {pages.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <span className="text-xs font-bold text-slate-400 ml-auto">{filtered.length} results</span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {paginated.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Search size={20} className="text-indigo-400" />
                </div>
                <p className="font-black text-slate-700 mb-1">কোনো search log নেই</p>
                <p className="text-xs text-slate-400 font-medium">
                  {totalSearches === 0
                    ? "ব্যবহারকারীরা search করলে এখানে দেখা যাবে।"
                    : "এই filter-এ কোনো data নেই।"}
                </p>
              </div>
            ) : (
              <>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Query</th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest hidden md:table-cell">Session</th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest hidden lg:table-cell">Page</th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest hidden sm:table-cell">Device</th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((log, i) => (
                      <tr
                        key={log.id}
                        className={`border-b border-slate-50 hover:bg-[#FFF8F4]/50 transition-colors ${i % 2 === 0 ? "" : "bg-slate-50/30"}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Search size={12} className="text-slate-400 shrink-0" />
                            <span className="text-sm font-black text-slate-800 truncate max-w-[120px]">"{log.query}"</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 rounded-lg px-2 py-0.5 font-mono">
                            {log.sessionId.substring(0, 14)}…
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {(() => { const b = getSourceBadge(log.page); return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap ${b.className}`}>{b.label}</span>; })()}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-[11px] font-semibold text-slate-500">{getDeviceLabel(log.userAgent)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-slate-600">
                              {format(new Date(log.timestamp), "MMM d")}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {format(new Date(log.timestamp), "hh:mm a")}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-all"
                      >
                        ← Prev
                      </button>
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-all"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
