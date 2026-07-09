"use client";

import React, { useState } from "react";
import {
  Ticket,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Send,
  User,
  Shield,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Sparkles,
  Inbox,
  Filter,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import {
  useGetAdminTicketsQuery,
  useUpdateAdminTicketStatusMutation,
  useAddAdminTicketReplyMutation,
  useGetTicketDetailsQuery,
} from "@/redux/features/client/helpApi";
import { toast } from "sonner";

/* ── Helpers ──────────────────────────────────────────────── */
const statusConfig: Record<string, { labelEn: string; labelBn: string; icon: React.ComponentType<any>; badge: string }> = {
  pending:     { labelEn: "Pending",     labelBn: "পেন্ডিং",    icon: AlertCircle,  badge: "bg-amber-500/10 text-amber-600 border border-amber-250/20" },
  in_progress: { labelEn: "In Progress", labelBn: "চলমান",     icon: Clock,        badge: "bg-blue-500/10 text-blue-600 border border-blue-250/20" },
  resolved:    { labelEn: "Resolved",    labelBn: "সমাধানকৃত",   icon: CheckCircle2, badge: "bg-emerald-500/10 text-emerald-600 border border-emerald-250/20" },
  closed:      { labelEn: "Closed",      labelBn: "বন্ধ",        icon: XCircle,      badge: "bg-slate-100 text-slate-500 border border-slate-200" },
};

const priorityConfig: Record<string, { label: string; color: string; dot: string; bg: string }> = {
  low:    { label: "Low Priority",    color: "text-slate-500", dot: "bg-slate-400", bg: "bg-slate-50" },
  medium: { label: "Medium Priority", color: "text-amber-600", dot: "bg-amber-400", bg: "bg-amber-50/40" },
  high:   { label: "High Priority",   color: "text-rose-600", dot: "bg-rose-500", bg: "bg-rose-50/40" },
};

/* ── Stat Card ─────────────────────────────────────────────── */
function StatCard({ label, count, accent, icon: Icon }: { label: string; count: number; accent: string; icon: React.ComponentType<any> }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 flex items-center justify-between hover:shadow-md hover:border-[#FF6014]/15 transition-all duration-300 group">
      <div className="space-y-1">
        <p className="text-3xl font-black text-slate-900 leading-none">{count}</p>
        <p className="text-[10px] font-black text-slate-450 uppercase tracking-widest pt-1">{label}</p>
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-all group-hover:scale-105 ${accent}`}>
        <Icon size={20} />
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────── */
export default function SupportDeskPage() {
  const lang = useAppSelector((state) => state.lang.value);
  const role = useAppSelector((state) => state.auth.role) || "superadmin";

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  // RTK Queries
  const { data: ticketsData, isLoading: isTicketsLoading, refetch: refetchTickets } = useGetAdminTicketsQuery(undefined, {
    skip: role !== "superadmin",
  });

  const { data: activeTicketData, isLoading: isActiveTicketLoading } = useGetTicketDetailsQuery(
    selectedTicketId!,
    { skip: !selectedTicketId }
  );

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateAdminTicketStatusMutation();
  const [addAdminReply, { isLoading: isSendingReply }] = useAddAdminTicketReplyMutation();

  if (role !== "superadmin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
        <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
      </div>
    );
  }

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(lang === "bn" ? `টিকেটের স্ট্যাটাস পরিবর্তন সফল` : `Ticket status updated to ${status}`);
    } catch (err) {
      toast.error(lang === "bn" ? `স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে` : `Failed to update status`);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicketId) return;

    try {
      await addAdminReply({
        id: selectedTicketId,
        message: replyMessage,
      }).unwrap();
      setReplyMessage("");
      toast.success(lang === "bn" ? `বার্তা সফলভাবে পাঠানো হয়েছে` : `Reply sent successfully`);
    } catch (err) {
      toast.error(lang === "bn" ? `বার্তা পাঠাতে ব্যর্থ হয়েছে` : `Failed to send reply`);
    }
  };

  const ticketsList = ticketsData?.data || [];

  // Filter logic
  const filteredTickets = ticketsList.filter((t: any) => {
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    const matchPriority = filterPriority === "all" || t.priority === filterPriority;
    
    const clientName = t.user?.name || "";
    const clientEmail = t.user?.email || "";
    const subject = t.subject || "";
    const ticketId = t.ticketId || "";

    const matchSearch =
      !searchQuery ||
      subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clientEmail.toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchPriority && matchSearch;
  });

  // Calculate statistics
  const stats = {
    total: ticketsList.length,
    pending: ticketsList.filter((t: any) => t.status === "pending").length,
    inProgress: ticketsList.filter((t: any) => t.status === "in_progress").length,
    resolved: ticketsList.filter((t: any) => t.status === "resolved").length,
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
      
      {/* Premium Header with Gradient Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-[32px] border border-slate-800/80 px-8 py-6 shadow-xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FF6014]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-[#FF6014] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              <Sparkles size={11} className="animate-pulse" />
              {lang === "bn" ? "অ্যাডমিন সাপোর্ট কনসোল" : "Support Operations Desk"}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">
              {lang === "bn" ? "গ্রাহক টিকিট ড্যাশবোর্ড" : "Customer Support Desk"}
            </h1>
            <p className="text-slate-400 text-xs font-medium">
              {lang === "bn"
                ? "ক্লায়েন্ট, ভেন্ডর এবং এজেন্টদের টিকিটসমূহ পরিচালনা ও দ্রুত উত্তর প্রদান করুন।"
                : "Monitor, reply, and process help requests from clients, service providers, and agents."}
            </p>
          </div>

          <button
            onClick={() => refetchTickets()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-black transition-all active:scale-[0.98] shadow-md"
          >
            <RefreshCw size={13} className="text-[#FF6014]" />
            {lang === "bn" ? "রিলোড করুন" : "Sync Tickets"}
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={lang === "bn" ? "মোট টিকিট" : "Total Tickets"} count={stats.total} accent="bg-gradient-to-br from-slate-700 to-slate-800 shadow-slate-900/10" icon={Ticket} />
        <StatCard label={lang === "bn" ? "নতুন পেন্ডিং" : "New Pending"} count={stats.pending} accent="bg-gradient-to-br from-[#FF6014] to-[#E0530A] shadow-[#FF6014]/20" icon={AlertCircle} />
        <StatCard label={lang === "bn" ? "চলমান সমস্যা" : "Active In-Progress"} count={stats.inProgress} accent="bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/10" icon={Clock} />
        <StatCard label={lang === "bn" ? "সমাধানকৃত টিকিট" : "Resolved"} count={stats.resolved} accent="bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/10" icon={CheckCircle2} />
      </div>

      {/* Core Support Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Tickets Inbox List & Filtering */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                <Filter size={12} className="text-[#FF6014]" />
                {lang === "bn" ? "ফিল্টার কনসোল" : "Inbox Filters"}
              </span>
              <span className="text-[10px] font-extrabold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                {filteredTickets.length} {lang === "bn" ? "টি টিকিট" : "tickets"}
              </span>
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "bn" ? "আইডি, বিষয়বস্তু অথবা গ্রাহকের নাম..." : "Search ID, subject or name..."}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#FF6014] focus:bg-white transition-colors"
            />
            
            <div className="grid grid-cols-2 gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-2.5 text-xs font-bold text-slate-600 outline-none focus:border-[#FF6014] bg-white cursor-pointer"
              >
                <option value="all">{lang === "bn" ? "সকল স্ট্যাটাস" : "All Status"}</option>
                <option value="pending">{lang === "bn" ? "পেন্ডিং (Pending)" : "Pending"}</option>
                <option value="in_progress">{lang === "bn" ? "চলমান (In Progress)" : "In Progress"}</option>
                <option value="resolved">{lang === "bn" ? "সমাধানকৃত (Resolved)" : "Resolved"}</option>
                <option value="closed">{lang === "bn" ? "বন্ধ (Closed)" : "Closed"}</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-2.5 text-xs font-bold text-slate-600 outline-none focus:border-[#FF6014] bg-white cursor-pointer"
              >
                <option value="all">{lang === "bn" ? "সকল গুরুত্ব" : "All Priority"}</option>
                <option value="low">{lang === "bn" ? "স্বল্প (Low)" : "Low Priority"}</option>
                <option value="medium">{lang === "bn" ? "মাঝারি (Medium)" : "Medium Priority"}</option>
                <option value="high">{lang === "bn" ? "উচ্চ (High)" : "High Priority"}</option>
              </select>
            </div>
          </div>

          {/* Dynamic Scrollable Tickets Inbox */}
          {isTicketsLoading ? (
            <div className="flex justify-center py-16 bg-white rounded-3xl border border-slate-100">
              <Loader2 className="w-8 h-8 text-[#FF6014] animate-spin" />
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center text-slate-400 font-bold text-xs space-y-2">
              <Inbox size={24} className="mx-auto text-slate-300" />
              <p>{lang === "bn" ? "কোনো টিকিট পাওয়া যায়নি।" : "No tickets matching filter criteria."}</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {filteredTickets.map((ticket: any) => {
                const isSelected = selectedTicketId === ticket.id;
                const sc = statusConfig[ticket.status] || { labelEn: ticket.status, badge: "bg-slate-100" };
                const pc = priorityConfig[ticket.priority] || { label: ticket.priority, color: "text-slate-400", dot: "bg-slate-350" };

                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? "bg-slate-950 border-slate-950 text-white shadow-xl scale-[1.01]"
                        : "bg-white border-slate-100 text-slate-800 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className={`text-[9px] font-black uppercase tracking-wider ${isSelected ? "text-slate-400" : "text-slate-450"}`}>
                        {ticket.ticketId}
                      </span>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md border shrink-0 ${
                        isSelected ? "bg-white/10 text-white border-white/20" : sc.badge
                      }`}>
                        {lang === "bn" ? sc.labelBn : sc.labelEn}
                      </span>
                    </div>

                    <h4 className="text-xs font-black mt-2 leading-snug line-clamp-1">{ticket.subject}</h4>
                    
                    <div className="flex justify-between items-center gap-4 mt-4 pt-3 border-t border-slate-100/10 text-[10px] font-bold">
                      <span className={isSelected ? "text-slate-400" : "text-slate-500"}>
                        {ticket.user?.name || "Anonymous Client"}
                      </span>
                      <span className={`flex items-center gap-1.5 ${pc.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${pc.dot}`} />
                        {pc.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Right Side: Support Ticket Chat Console */}
        <div className="lg:col-span-7">
          {selectedTicketId ? (
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[550px] border-slate-150/60">
              
              {/* Top Workspace Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeTicketData?.data?.ticketId}</span>
                    <span className="text-[9px] font-black text-rose-500 uppercase bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                      {activeTicketData?.data?.priority} priority
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-800 mt-1">{activeTicketData?.data?.subject}</h3>
                </div>

                {/* Live Status Control Dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Ticket Status:</label>
                  <select
                    value={activeTicketData?.data?.status || "pending"}
                    onChange={(e) => handleStatusChange(selectedTicketId, e.target.value)}
                    disabled={isUpdatingStatus}
                    className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-black text-slate-700 outline-none cursor-pointer hover:border-slate-300"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* User Bio Panel Card */}
              {activeTicketData?.data?.user && (
                <div className="px-5 py-3.5 border-b border-slate-100 bg-[#FFF8F4]/10 flex flex-wrap gap-4 text-[10px] font-bold text-slate-500">
                  <span className="flex items-center gap-1.5"><User size={13} className="text-[#FF6014]" /> {activeTicketData.data.user.name}</span>
                  <span className="flex items-center gap-1.5"><Mail size={13} className="text-[#FF6014]" /> {activeTicketData.data.user.email}</span>
                  {activeTicketData.data.user.phone && (
                    <span className="flex items-center gap-1.5"><Phone size={13} className="text-[#FF6014]" /> {activeTicketData.data.user.phone}</span>
                  )}
                </div>
              )}

              {/* Chat Thread Messages list */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[350px] bg-slate-50/30">
                {isActiveTicketLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <Loader2 className="w-7 h-7 text-[#FF6014] animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* Customer description bubble */}
                    <div className="flex gap-3 max-w-xl">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 border border-slate-200 shadow-xs">
                        <User size={13} />
                      </div>
                      <div className="bg-white border border-slate-150 p-4 rounded-2xl rounded-tl-none shadow-xs">
                        <span className="text-[10px] font-black text-slate-850 block mb-1">
                          {activeTicketData?.data?.user?.name || "Client"} (Customer Message)
                        </span>
                        <p className="text-xs text-slate-650 font-medium whitespace-pre-wrap leading-relaxed">{activeTicketData?.data?.description}</p>
                        <span className="text-[9px] text-slate-400 block mt-2 text-right">
                          {activeTicketData?.data ? new Date(activeTicketData.data.createdAt).toLocaleString() : ""}
                        </span>
                      </div>
                    </div>

                    {/* Replies Thread list */}
                    {activeTicketData?.data?.replies?.map((rep: any, rIdx: number) => {
                      const isClient = rep.sender === "user";
                      return (
                        <div
                          key={rIdx}
                          className={`flex gap-3 max-w-xl ${isClient ? "" : "ml-auto flex-row-reverse"}`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-xs ${
                            isClient ? "bg-slate-100 text-slate-500 border-slate-200" : "bg-[#FFF8F4] text-[#FF6014] border-[#FFF0EB]"
                          }`}>
                            {isClient ? <User size={13} /> : <Shield size={13} />}
                          </div>
                          <div className={`p-4 rounded-2xl shadow-xs border ${
                            isClient 
                              ? "bg-white border-slate-150 rounded-tl-none"
                              : "bg-gradient-to-br from-[#FFF9F6] to-white border-[#FFEFE7] rounded-tr-none text-right"
                          }`}>
                            <span className="text-[10px] font-black text-slate-850 block mb-1">
                              {rep.name}
                            </span>
                            <p className="text-xs text-slate-650 font-medium whitespace-pre-wrap leading-relaxed">{rep.message}</p>
                            <span className="text-[9px] text-slate-400 block mt-2">
                              {new Date(rep.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-slate-100 bg-white flex gap-2">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder={lang === "bn" ? "অ্যাডমিন উত্তর লিখুন..." : "Type reply message to client..."}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-150 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#FF6014] transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSendingReply || !replyMessage.trim()}
                  className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shrink-0 cursor-pointer disabled:opacity-40"
                >
                  {isSendingReply ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </form>

            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center space-y-3 min-h-[550px] flex flex-col justify-center items-center">
              <div className="p-4 bg-slate-50 rounded-full border border-slate-100 text-[#FF6014]/65">
                <Ticket className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-sm font-black text-slate-850">
                {lang === "bn" ? "কোনো টিকেট নির্বাচিত করা হয়নি" : "Workspace Offline"}
              </h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                {lang === "bn"
                  ? "ডিটেইল চ্যাট দেখতে এবং গ্রাহককে রিপ্লাই করতে বাম পাশের টিকেট লিস্ট থেকে একটি টিকিট নির্বাচন করুন।"
                  : "Select an active ticket from the inbox list to modify its support status, write replies or check customer metadata."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
