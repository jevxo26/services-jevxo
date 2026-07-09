"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  MessageSquare,
  Users,
  Clock,
  RefreshCw,
  Search,
  Wifi,
  ChevronRight,
  Inbox,
  TrendingUp,
  Send,
  Sparkles,
  Loader2,
  X,
  Trash2,
  User as UserIcon,
  BarChart2,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useConfirm } from "@/context/ConfirmDialogContext";

/* ── Types ────────────────────────────────────────────────── */
interface ChatMessage {
  role: "user" | "model";
  text: string;
  time?: string;
}
interface ChatSession {
  sessionId: string;
  startedAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  user?: { name: string; email: string } | null;
}

const CHAT_LOG_KEY = "rajseba_ai_chat_logs";

/* ── Helpers ──────────────────────────────────────────────── */
function getInitials(name: string) {
  return (name || "G").split(" ").map((w) => w[0]).join("").toUpperCase().substring(0, 2);
}
function avatarColor(name: string) {
  const colors = [
    "from-[#FF6014] to-[#E0530A]",
    "from-indigo-500 to-indigo-700",
    "from-emerald-500 to-emerald-700",
    "from-amber-500 to-amber-700",
    "from-rose-500 to-rose-700",
    "from-violet-500 to-violet-700",
  ];
  return colors[(name || "G").charCodeAt(0) % colors.length];
}

/* ── Stat Card ────────────────────────────────────────────── */
function StatCard({ label, value, sub, icon: Icon, accent, pulse }: {
  label: string; value: string | number; sub?: string;
  icon: React.ComponentType<any>; accent: string; pulse?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md hover:border-[#FF6014]/15 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon size={18} className="text-white" />
        </div>
        {pulse && (
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-black text-slate-900 leading-none">{value}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{label}</p>
        {sub && <p className="text-xs text-slate-400 font-medium mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ── Session Row ──────────────────────────────────────────── */
function SessionRow({ session, isActive, onClick }: {
  session: ChatSession; isActive: boolean; onClick: () => void;
}) {
  const name = session.user?.name || "Guest Visitor";
  const lastMsg = session.messages[session.messages.length - 1]?.text || "No messages";
  const userMsgs = session.messages.filter((m) => m.role === "user").length;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 flex items-start gap-3 transition-all rounded-2xl border ${
        isActive
          ? "bg-[#FFF8F4] border-[#FF6014]/20 shadow-sm"
          : "border-transparent hover:bg-slate-50 hover:border-slate-100"
      }`}
    >
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColor(name)} flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm`}>
        {getInitials(name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={`text-sm font-black truncate ${isActive ? "text-[#FF6014]" : "text-slate-800"}`}>
            {name}
          </span>
          <span className="text-[10px] text-slate-400 font-medium shrink-0">
            {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium truncate">{lastMsg}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
            {userMsgs} queries
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{session.sessionId.substring(0, 10)}…</span>
        </div>
      </div>
    </button>
  );
}

/* ── Message Bubble ───────────────────────────────────────── */
function MsgBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  const parseText = (text: string) => {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let last = 0, match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > last) parts.push(text.substring(last, match.index));
      const [_, label, url] = match;
      parts.push(
        url.startsWith("/")
          ? <Link key={match.index} href={url} className="inline-flex items-center gap-1 bg-[#FF6014]/10 hover:bg-[#FF6014]/20 text-[#FF6014] px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-[#FF6014]/20 ml-1">{label}</Link>
          : <a key={match.index} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-[#FF6014]/10 text-[#FF6014] px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-[#FF6014]/20 ml-1">{label}</a>
      );
      last = regex.lastIndex;
    }
    if (last < text.length) parts.push(text.substring(last));
    return parts.length > 0 ? parts : text;
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF6014] to-[#E0530A] flex items-center justify-center text-white mr-2 shrink-0 mt-0.5">
          <Bot size={14} />
        </div>
      )}
      <div className={`max-w-[75%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed ${
          isUser
            ? "bg-gradient-to-br from-[#FF6014] to-[#E0530A] text-white rounded-br-sm shadow-md shadow-[#FF6014]/15"
            : "bg-white border border-slate-100 text-slate-800 rounded-bl-sm shadow-sm"
        }`}>
          {parseText(msg.text)}
        </div>
        {msg.time && (
          <span className="text-[9px] text-slate-400 mt-0.5 px-1">
            {format(new Date(msg.time), "hh:mm a")}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Mini AI Tester ───────────────────────────────────────── */
function AiWorkflowTester() {
  const [msgs, setMsgs] = useState<{ role: "user" | "model"; text: string }[]>([
    { role: "model", text: "Hello! I am Arko's AI Portfolio Assistant. How can I help you test our chat flows today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    const updated = [...msgs, { role: "user" as const, text: userMsg }];
    setMsgs(updated);
    setInput("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMsgs((prev) => [...prev, { role: "model", text: data.reply || "Sorry, I couldn't process that." }]);
    } catch {
      setMsgs((prev) => [...prev, { role: "model", text: "Connection error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-100 bg-[#FFF8F4]/50">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[#FF6014]" />
          <span className="text-xs font-black text-slate-800">AI Workflow Tester</span>
          <span className="ml-auto text-[10px] text-slate-400 font-medium">Chat directly with the bot</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-slate-50/30">
        {msgs.map((m, i) => <MsgBubble key={i} msg={{ ...m, time: new Date().toISOString() }} />)}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm p-3 flex items-center gap-1.5 shadow-sm">
              <Loader2 size={12} className="animate-spin text-[#FF6014]" />
              <span className="text-[10px] text-slate-400 font-bold">AI is typing…</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="p-3 border-t border-slate-100 bg-white">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 pr-2 focus-within:border-[#FF6014]/30 focus-within:bg-white transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything…"
            className="flex-1 bg-transparent text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none px-2"
          />
          <button type="submit" disabled={!input.trim() || isLoading}
            className="w-8 h-8 rounded-xl bg-[#FF6014] hover:bg-[#E0530A] text-white flex items-center justify-center transition disabled:opacity-40 shrink-0">
            <Send size={13} />
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────── */
export default function AiChatLogPage() {
  const confirm = useConfirm();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const loadSessions = () => {
    try {
      const raw = localStorage.getItem(CHAT_LOG_KEY);
      const data: ChatSession[] = raw ? JSON.parse(raw) : [];
      setSessions(data);
    } catch { setSessions([]); }
  };

  useEffect(() => { loadSessions(); }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadSessions();
    setLastRefreshed(new Date());
    setTimeout(() => setIsRefreshing(false), 700);
  };

  const handleClearAll = async () => {
    const isConfirmed = await confirm({
      title: "Clear All Chat Logs?",
      message: "Are you sure you want to delete all AI chat logs? This action cannot be undone.",
      confirmText: "Clear All",
      cancelText: "Cancel",
      variant: "warning",
    });
    if (!isConfirmed) return;
    localStorage.removeItem(CHAT_LOG_KEY);
    setSessions([]);
    setActiveSession(null);
  };

  const filteredSessions = sessions.filter((s) => {
    const q = searchQuery.toLowerCase();
    const name = s.user?.name || "";
    const msgs = s.messages.map((m) => m.text).join(" ");
    return name.toLowerCase().includes(q) || msgs.toLowerCase().includes(q) || s.sessionId.toLowerCase().includes(q);
  });

  // Stats
  const totalSessions = sessions.length;
  const totalMessages = sessions.reduce((a, s) => a + s.messages.filter((m) => m.role === "user").length, 0);
  const todaySessions = sessions.filter((s) => {
    return new Date(s.updatedAt).toDateString() === new Date().toDateString();
  }).length;
  const avgMsgsPerSession = totalSessions > 0
    ? (sessions.reduce((a, s) => a + s.messages.filter((m) => m.role === "user").length, 0) / totalSessions).toFixed(1)
    : "0";

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* ── Header ── */}
      <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm px-7 py-6">
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-gradient-to-br from-[#FF6014]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#FFF8F4] border border-[#FF6014]/20 text-[#FF6014] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">
              <Bot size={10} />AI Customer Service
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Chat Log Manager</h1>
            <p className="text-slate-400 mt-1 text-sm font-medium">
              Monitor real-time user query sessions, inspect logs, and run agent simulations.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-emerald-700">Gemini Status</span>
              <Wifi size={14} className="text-emerald-600" />
            </div>
            <button onClick={handleRefresh}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 font-bold px-4 py-2.5 rounded-2xl text-sm hover:bg-slate-50 transition-all">
              <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Conversations" value={totalSessions} sub="Active chat threads" icon={MessageSquare} accent="bg-gradient-to-br from-[#FF6014] to-[#E0530A]" pulse />
        <StatCard label="Total AI Messages" value={totalMessages} sub="User queries sent" icon={Bot} accent="bg-gradient-to-br from-indigo-500 to-indigo-700" />
        <StatCard label="Avg Messages / Session" value={avgMsgsPerSession} sub="Based on all threads" icon={TrendingUp} accent="bg-gradient-to-br from-amber-500 to-amber-600" />
        <StatCard label="Today's Sessions" value={todaySessions} sub="New conversations today" icon={Clock} accent="bg-gradient-to-br from-emerald-500 to-emerald-600" />
      </div>

      {/* ── Main Panel: Sessions List + Session Detail + AI Tester ── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden" style={{ height: "72vh" }}>
        <div className="flex h-full">

          {/* ── Left: Sessions List ── */}
          <div className="w-[300px] border-r border-slate-100 flex flex-col bg-slate-50/30 shrink-0">
            <div className="px-4 py-4 border-b border-slate-100 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Bot size={14} className="text-[#FF6014]" />
                  AI Chat Sessions
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-[#FF6014] bg-[#FFF8F4] border border-[#FF6014]/20 px-2 py-0.5 rounded-full">
                    {filteredSessions.length}
                  </span>
                  {sessions.length > 0 && (
                    <button onClick={handleClearAll} className="w-6 h-6 rounded-lg bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 flex items-center justify-center transition">
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-[#FF6014]/40 focus-within:bg-white transition-all">
                <Search size={12} className="text-slate-400 shrink-0" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sessions..." className="flex-1 bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredSessions.length === 0 ? (
                <div className="p-8 text-center">
                  <Bot size={20} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-medium">
                    {sessions.length === 0
                      ? "No AI chat sessions yet. Users will appear here after chatting on the home page."
                      : "No matching sessions."}
                  </p>
                </div>
              ) : (
                filteredSessions.map((s, i) => (
                  <SessionRow key={i} session={s} isActive={activeSession?.sessionId === s.sessionId} onClick={() => setActiveSession(s)} />
                ))
              )}
            </div>

            <div className="px-4 py-2.5 border-t border-slate-100 bg-white">
              <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5">
                <Clock size={10} />
                Last refresh: {format(lastRefreshed, "hh:mm a")}
              </p>
            </div>
          </div>

          {/* ── Middle: Session Detail ── */}
          <div className="flex-1 flex flex-col min-w-0 border-r border-slate-100">
            {activeSession ? (
              <>
                <div className="px-5 py-3 border-b border-slate-100 bg-white flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColor(activeSession.user?.name || "G")} flex items-center justify-center text-white font-black text-sm shrink-0`}>
                    {getInitials(activeSession.user?.name || "G")}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm">{activeSession.user?.name || "Guest Visitor"}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{activeSession.user?.email || "Anonymous"}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                      {activeSession.messages.length} Messages
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 hidden sm:block">
                      {activeSession.sessionId.substring(0, 16)}…
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 bg-[#FAF9F6]/40">
                  {activeSession.messages.map((msg, i) => (
                    <MsgBubble key={i} msg={msg} />
                  ))}
                </div>

                <div className="px-5 py-2.5 border-t border-slate-100 bg-white">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Session: {activeSession.sessionId.substring(0, 14)}</span>
                    <span>{format(new Date(activeSession.startedAt), "MMM d, hh:mm a")}</span>
                    <span className="ml-auto">{activeSession.messages.filter(m => m.role === "user").length} user msgs</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-[#FFF8F4] border border-[#FF6014]/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Bot size={28} className="text-[#FF6014]/60" />
                </div>
                <p className="font-black text-slate-700 mb-1.5 text-lg">No Session Selected</p>
                <p className="text-sm text-slate-400 font-medium max-w-[200px] leading-relaxed">
                  Select a user thread on the left to inspect conversation logs.
                </p>
              </div>
            )}
          </div>

          {/* ── Right: AI Workflow Tester ── */}
          <div className="w-[320px] shrink-0 flex flex-col border-l border-slate-100 bg-white">
            <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-[#FF6014]/5 to-transparent">
              <span className="text-xs font-black text-[#FF6014] flex items-center gap-1.5">
                <Sparkles size={13} />
                AI WORKFLOW TESTER
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <AiWorkflowTester />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
