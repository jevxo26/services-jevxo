"use client";

import { useAppSelector } from "@/redux/hooks";
import { getRoleName } from "@/redux/features/auth/authSlice";
import { ShieldAlert, MessageCircle, AlertCircle, Check, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: "Open" | "Resolved" | "In Progress";
  date: string;
  lastReply: string;
}

export default function AgentSupportPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: "TCK-482", subject: "Commission calculation error on RS-9240", category: "Commission & Payout", status: "In Progress", date: "Today", lastReply: "We are auditing the invoice." },
    { id: "TCK-198", subject: "Nagad transfer wallet config missing", category: "Account Config", status: "Resolved", date: "May 14, 2026", lastReply: "Nagad API added." },
  ]);

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Commission & Payout");
  const [description, setDescription] = useState("");

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: Ticket = {
      id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
      subject,
      category,
      status: "Open",
      date: "Just now",
      lastReply: "Waiting for support agent assign.",
    };
    setTickets([newTicket, ...tickets]);
    toast.success("Support ticket generated successfully!");
    setSubject("");
    setDescription("");
  };

  if (role !== "agent") {
    return <AccessDenied roleRequired="Agent" />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Support Desk</h1>
          <p className="text-slate-500 mt-1">Get priority resolution from our admin support representatives.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Columns: Tickets list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Active Support Tickets</h3>

          <div className="space-y-4">
            {tickets.map((t) => (
              <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 font-bold">{t.id}</span>
                    <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-lg font-bold">
                      {t.category}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    t.status === "Resolved"
                      ? "bg-emerald-50 text-emerald-700"
                      : t.status === "In Progress"
                      ? "bg-indigo-50 text-indigo-700"
                      : "bg-rose-50 text-rose-700"
                  }`}>
                    {t.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-800">{t.subject}</h4>
                
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-500">
                  <span className="font-bold text-slate-700 block mb-1">Latest Update:</span>
                  {t.lastReply}
                </div>

                <div className="text-[10px] text-slate-400 font-semibold text-right">
                  Opened {t.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Column: Create ticket */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageCircle size={20} className="text-rose-500" /> Open Priority Ticket
          </h3>

          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer"
              >
                <option>Commission & Payout</option>
                <option>Booking Failures</option>
                <option>Account Dispute</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Subject</label>
              <input
                type="text"
                placeholder="Brief summary..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Details</label>
              <textarea
                rows={4}
                placeholder="Explain the issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-semibold resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
            >
              <Send size={14} /> Submit Ticket
            </button>
          </form>
        </div>

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
