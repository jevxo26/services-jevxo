"use client";

import React, { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import {
  HelpCircle,
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  Loader2,
  Send,
  MessageSquare,
  Calendar,
  AlertCircle,
  X,
  User,
  Shield,
  LifeBuoy,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  useGetHelpArticlesQuery,
  useGetSupportTicketsQuery,
  useCreateSupportTicketMutation,
  useGetTicketDetailsQuery,
  useAddTicketReplyMutation,
} from "@/redux/features/client/helpApi";
import AccessDenied from "../components/AccessDenied";

export default function HelpCenterPage() {
  const role = useAppSelector((state) => state.auth.role) || "client";
  const lang = useAppSelector((state) => state.lang.value);

  // Tabs: "faqs" | "tickets"
  const [activeTab, setActiveTab] = useState<"faqs" | "tickets">("faqs");
  
  // FAQ Search & Category Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Ticket Modal & Form State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("booking");
  const [ticketPriority, setTicketPriority] = useState("medium");
  const [ticketDescription, setTicketDescription] = useState("");

  // Active Selected Ticket Details
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  // RTK Queries & Mutations
  const { data: articlesData, isLoading: isArticlesLoading } = useGetHelpArticlesQuery({
    search: searchQuery,
    category: selectedCategory,
  });

  const { data: ticketsData, isLoading: isTicketsLoading } = useGetSupportTicketsQuery(undefined, {
    skip: role !== "client",
  });

  const { data: activeTicketData, isLoading: isActiveTicketLoading } = useGetTicketDetailsQuery(
    selectedTicketId!,
    { skip: !selectedTicketId }
  );

  const [createTicket, { isLoading: isCreatingTicket }] = useCreateSupportTicketMutation();
  const [addReply, { isLoading: isSendingReply }] = useAddTicketReplyMutation();

  if (role !== "client") {
    return <AccessDenied roleRequired="Customer" />;
  }

  const faqCategories = [
    { id: "", labelEn: "All Topics", labelBn: "সব বিষয়" },
    { id: "Booking & Scheduling", labelEn: "Booking", labelBn: "বুকিং" },
    { id: "Payments & Refund", labelEn: "Payments", labelBn: "পেমেন্ট" },
    { id: "Account & Privacy", labelEn: "Account", labelBn: "অ্যাকাউন্ট" },
    { id: "Safety & Trust", labelEn: "Safety", labelBn: "নিরাপত্তা" },
  ];

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDescription) return;

    try {
      await createTicket({
        subject: ticketSubject,
        category: ticketCategory,
        priority: ticketPriority,
        description: ticketDescription,
      }).unwrap();

      setTicketSubject("");
      setTicketDescription("");
      setTicketCategory("booking");
      setTicketPriority("medium");
      setIsCreateModalOpen(false);
      setActiveTab("tickets");
    } catch (err) {
      console.error("Failed to create ticket:", err);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicketId) return;

    try {
      await addReply({
        id: selectedTicketId,
        message: replyMessage,
      }).unwrap();
      setReplyMessage("");
    } catch (err) {
      console.error("Failed to send reply:", err);
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-200">
      
      {/* Premium Gradient Hero Banner */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 sm:p-10 shadow-xl border border-slate-800/80">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#FF6014]/10 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black tracking-widest text-[#FF6014] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6014] animate-pulse" />
              {lang === "bn" ? "রাজসেবা কাস্টমার সাপোর্ট" : "Rajseba Care Hub"}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
              {lang === "bn" ? "আমরা কীভাবে সাহায্য করতে পারি?" : "How can we help you today?"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-350 font-medium max-w-lg">
              {lang === "bn"
                ? "আপনার বুকিং, রিফান্ড বা অ্যাকাউন্ট সম্পর্কিত যেকোনো জিজ্ঞাসার তাৎক্ষণিক সমাধান ও সহায়তা এখানে পাবেন।"
                : "Get real-time answers to your scheduling questions, manage refund processes, or chat directly with our helpdesk specialists."}
            </p>
          </div>

          {/* Quick tab switcher with premium pill look */}
          <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl self-start md:self-auto backdrop-blur-md">
            <button
              onClick={() => {
                setActiveTab("faqs");
                setSelectedTicketId(null);
              }}
              className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all duration-300 ${
                activeTab === "faqs"
                  ? "bg-white text-slate-950 shadow-md scale-[1.02]"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {lang === "bn" ? "নির্দেশিকা ও FAQ" : "FAQ & Guides"}
            </button>
            <button
              onClick={() => setActiveTab("tickets")}
              className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all duration-300 ${
                activeTab === "tickets"
                  ? "bg-white text-slate-950 shadow-md scale-[1.02]"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {lang === "bn" ? "সাপোর্ট টিকিট" : "Support Tickets"}
            </button>
          </div>
        </div>
      </div>

      {activeTab === "faqs" ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Advanced Search & Filtering Interface */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === "bn" ? "সার্ভিস বুকিং, পেমেন্ট অথবা রিফান্ড সংক্রান্ত বিষয় খুঁজুন..." : "Find issues related to scheduling, cancellation, refunds, or safety..."
                }
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-150/70 rounded-2xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/5 transition-all shadow-inner"
              />
            </div>

            {/* Scrollable Categories Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {faqCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                    selectedCategory === cat.id
                      ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10"
                      : "bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {lang === "bn" ? cat.labelBn : cat.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Expandable Accordion Articles */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            {isArticlesLoading ? (
              <div className="flex flex-col items-center justify-center p-20 space-y-3">
                <Loader2 className="w-9 h-9 text-[#FF6014] animate-spin" />
                <span className="text-xs text-slate-400 font-extrabold tracking-wider">
                  {lang === "bn" ? "নির্দেশিকা লোড হচ্ছে..." : "Loading premium FAQ articles..."}
                </span>
              </div>
            ) : articlesData?.data?.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 text-center space-y-3">
                <div className="p-4 bg-slate-50 text-slate-400 rounded-full">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-slate-700">
                  {lang === "bn" ? "কোনো নির্দেশিকা খুঁজে পাওয়া যায়নি" : "No match found"}
                </h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  {lang === "bn"
                    ? "দয়া করে অন্য কোনো সহজ কি-ওয়ার্ড অথবা উপরের বিষয়ভিত্তিক ক্যাটাগরি ব্যবহার করুন।"
                    : "Try adjusting your search terms or filter by Booking or Payments categories instead."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {articlesData?.data?.map((faq: any) => {
                  const isExpanded = expandedFaq === faq.id;
                  return (
                    <div key={faq.id} className="transition-all hover:bg-slate-50/30">
                      <button
                        onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                      >
                        <div className="flex items-center gap-3.5 pr-4">
                          <div className={`p-1.5 rounded-lg transition-colors ${isExpanded ? "bg-[#FF6014]/10 text-[#FF6014]" : "bg-slate-100/70 text-slate-500"}`}>
                            <HelpCircle size={16} />
                          </div>
                          <span className="text-xs sm:text-sm font-black text-slate-800 tracking-tight">
                            {lang === "bn" ? faq.titleBn : faq.title}
                          </span>
                        </div>
                        <div className="p-1.5 bg-slate-150/40 rounded-lg text-slate-500 shrink-0">
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-6 pb-7 text-xs leading-relaxed text-slate-500 font-semibold border-t border-slate-50/50 pt-4 animate-in slide-in-from-top-2 duration-200">
                          <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100/50 whitespace-pre-wrap">
                            {lang === "bn" ? faq.contentBn : faq.content}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Premium Quick Help Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            
            <div className="bg-gradient-to-br from-[#FFF8F4] to-white border border-[#FFF0EB] p-6 rounded-3xl shadow-xs space-y-4 hover:shadow-md transition-all group">
              <div className="p-3 bg-white rounded-2xl text-[#FF6014] border border-[#FFF0EB] w-fit shadow-xs group-hover:scale-110 transition-transform">
                <MessageSquare size={22} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-800">{lang === "bn" ? "লাইভ সাপোর্ট টিকিট" : "Live Support Desk"}</h4>
                <p className="text-[10px] text-slate-450 font-bold leading-relaxed">{lang === "bn" ? "যেকোনো জরুরি বিষয়ে সরাসরি সাপোর্ট মেসেজ পাঠান।" : "Submit support queries directly to our service specialists."}</p>
                <button
                  onClick={() => setActiveTab("tickets")}
                  className="inline-flex items-center gap-1 text-xs font-black text-[#FF6014] hover:underline pt-2"
                >
                  {lang === "bn" ? "নতুন সাপোর্ট টিকেট →" : "Initiate chat desk →"}
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 p-6 rounded-3xl shadow-xs space-y-4 hover:shadow-md transition-all group">
              <div className="p-3 bg-white rounded-2xl text-slate-800 border border-slate-200/60 w-fit shadow-xs group-hover:scale-110 transition-transform">
                <Calendar size={22} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-800">{lang === "bn" ? "বুকিং ও সময় পরিবর্তন" : "Booking Policy Guides"}</h4>
                <p className="text-[10px] text-slate-450 font-bold leading-relaxed">{lang === "bn" ? "সার্ভিস শিডিউল পরিবর্তন এবং বাতিল ফি জানুন।" : "Read scheduling, cancellations & rescheduling terms."}</p>
                <button
                  onClick={() => setSelectedCategory("Booking & Scheduling")}
                  className="inline-flex items-center gap-1 text-xs font-black text-slate-800 hover:underline pt-2"
                >
                  {lang === "bn" ? "বুকিং নিয়মাবলী দেখুন →" : "View scheduling →"}
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 p-6 rounded-3xl shadow-xs space-y-4 hover:shadow-md transition-all group">
              <div className="p-3 bg-white rounded-2xl text-slate-800 border border-slate-200/60 w-fit shadow-xs group-hover:scale-110 transition-transform">
                <Shield size={22} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-800">{lang === "bn" ? "নিরাপত্তা ও বিশ্বাস" : "Trust & Shield Policy"}</h4>
                <p className="text-[10px] text-slate-450 font-bold leading-relaxed">{lang === "bn" ? "ভেরিফাইড সার্ভিস প্রোভাইডার নির্বাচন ও গ্যারান্টি।" : "Vetted service professionals & quality verification."}</p>
                <button
                  onClick={() => setSelectedCategory("Safety & Trust")}
                  className="inline-flex items-center gap-1 text-xs font-black text-slate-800 hover:underline pt-2"
                >
                  {lang === "bn" ? "নিরাপত্তা পলিসি →" : "Check credentials →"}
                </button>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
          
          {/* Tickets Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">
                {lang === "bn" ? "আপনার পূর্বের টিকেটসমূহ" : "Active Ticket Inbox"}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#FF6014] text-white text-xs font-black rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-md shadow-[#FF6014]/15 cursor-pointer"
              >
                <Plus size={14} />
                {lang === "bn" ? "নতুন টিকিট খুলুন" : "Create New Ticket"}
              </button>
            </div>

            {isTicketsLoading ? (
              <div className="flex justify-center py-16 bg-white border border-slate-100 rounded-3xl">
                <Loader2 className="w-7 h-7 text-[#FF6014] animate-spin" />
              </div>
            ) : ticketsData?.data?.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400 border border-slate-100">
                  <LifeBuoy size={20} />
                </div>
                <h4 className="text-xs font-bold text-slate-600">
                  {lang === "bn" ? "কোনো টিকিট পাওয়া যায়নি" : "No tickets yet"}
                </h4>
                <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                  {lang === "bn"
                    ? "কোনো সমস্যা বা রিফান্ড পেতে হেল্প ডেস্কের সাথে আলোচনা করতে নতুন টিকিট শুরু করুন।"
                    : "Having technical booking errors or payment questions? Launch a ticket and we will verify it."}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {ticketsData?.data?.map((ticket: any) => {
                  const isSelected = selectedTicketId === ticket.id;
                  
                  const statusColors: Record<string, string> = {
                    pending: "bg-amber-500/10 text-amber-600 border-amber-200/30",
                    in_progress: "bg-blue-500/10 text-blue-600 border-blue-200/30",
                    resolved: "bg-emerald-500/10 text-emerald-600 border-emerald-200/30",
                    closed: "bg-slate-100 text-slate-500 border-slate-200",
                  };

                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? "bg-slate-950 border-slate-950 text-white shadow-xl scale-[1.01]"
                          : "bg-white border-slate-100 text-slate-850 hover:bg-slate-50/60"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-wider ${isSelected ? "text-slate-400" : "text-slate-450"}`}>
                          {ticket.ticketId}
                        </span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md border shrink-0 ${
                          isSelected ? "bg-white/10 text-white border-white/20" : statusColors[ticket.status] || "bg-slate-100"
                        }`}>
                          {ticket.status.replace("_", " ")}
                        </span>
                      </div>

                      <h4 className="text-xs font-black mt-2 leading-snug line-clamp-1">{ticket.subject}</h4>
                      
                      <div className="flex justify-between items-center gap-4 mt-4 pt-3 border-t border-slate-100/10">
                        <span className={`text-[10px] font-bold ${isSelected ? "text-slate-400" : "text-slate-500"}`}>
                          {lang === "bn" ? "গুরুত্ব: " : "Priority: "}
                          <span className={`font-black uppercase tracking-wider ${
                            ticket.priority === 'high' ? 'text-red-500' : ticket.priority === 'medium' ? 'text-orange-500' : 'text-slate-400'
                          }`}>{ticket.priority}</span>
                        </span>
                        
                        <span className={`text-[9px] font-semibold ${isSelected ? "text-slate-400" : "text-slate-450"}`}>
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Interactive Live Chat Workspace */}
          <div className="lg:col-span-7">
            {selectedTicketId ? (
              <div className="bg-white border border-slate-100 rounded-3xl shadow-md overflow-hidden flex flex-col min-h-[500px] border-slate-150/60">
                
                {/* Header info */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeTicketData?.data?.ticketId}</span>
                      <span className="text-[9px] font-black text-rose-500 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                        {activeTicketData?.data?.priority} priority
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-800 mt-1">{activeTicketData?.data?.subject}</h3>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">{lang === "bn" ? "শুরু হয়েছে" : "Created"}</span>
                    <span className="text-xs text-slate-700 font-extrabold">{activeTicketData?.data ? new Date(activeTicketData.data.createdAt).toLocaleDateString() : ""}</span>
                  </div>
                </div>

                {/* Conversation Body */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[350px] bg-slate-50/30">
                  {isActiveTicketLoading ? (
                    <div className="flex justify-center items-center h-48">
                      <Loader2 className="w-7 h-7 text-[#FF6014] animate-spin" />
                    </div>
                  ) : (
                    <>
                      {/* Original Client Message Description */}
                      <div className="flex gap-3 max-w-xl">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 shadow-xs border border-slate-200">
                          <User size={13} />
                        </div>
                        <div className="bg-white border border-slate-150 p-4 rounded-2xl rounded-tl-none shadow-xs">
                          <span className="text-[10px] font-black text-slate-850 block mb-1">
                            {activeTicketData?.data?.user?.name || "Client"}
                          </span>
                          <p className="text-xs text-slate-650 font-medium whitespace-pre-wrap leading-relaxed">{activeTicketData?.data?.description}</p>
                          <span className="text-[9px] text-slate-400 block mt-2 text-right">
                            {activeTicketData?.data ? new Date(activeTicketData.data.createdAt).toLocaleTimeString() : ""}
                          </span>
                        </div>
                      </div>

                      {/* Replies List */}
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
                    placeholder={lang === "bn" ? "রিপ্লাই মেসেজ লিখুন..." : "Type reply message to our customer service desk..."}
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
              <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center space-y-3 min-h-[500px] flex flex-col justify-center items-center">
                <div className="p-4 bg-slate-50 rounded-full border border-slate-100 text-[#FF6014]/60">
                  <LifeBuoy className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-sm font-black text-slate-850">
                  {lang === "bn" ? "কোনো টিকেট নির্বাচিত নেই" : "Support Chat Offline"}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  {lang === "bn"
                    ? "গ্রাহক সেবার সাথে চ্যাট করতে এবং পূর্বের আলোচনা দেখতে বাম পাশের টিকেট লিস্ট থেকে একটি টিকেট নির্বাচন করুন।"
                    : "Select an active ticket from the inbox listing to view discussion status or post follow-up clarifications."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Support Ticket Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-150 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-xl border border-[#FFF0EB]">
                  <LifeBuoy size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    {lang === "bn" ? "নতুন সাপোর্ট টিকিট তৈরি" : "Create Support Ticket"}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                    {lang === "bn" ? "আমাদের টিম ২৪ ঘণ্টার মধ্যে সমাধান করবে।" : "Response guaranteed within 24 business hours."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-650 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">
                  {lang === "bn" ? "টিকেটের বিষয়বস্তু (Subject)" : "Ticket Subject"}
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder={lang === "bn" ? "সংক্ষেপে সমস্যার নাম লিখুন..." : "e.g. Booking rescheduled incorrectly"}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#FF6014] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">
                    {lang === "bn" ? "ক্যাটাগরি" : "Category"}
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#FF6014]"
                  >
                    <option value="booking">{lang === "bn" ? "বুকিং সংক্রান্ত" : "Booking"}</option>
                    <option value="payment">{lang === "bn" ? "পেমেন্ট/রিফান্ড" : "Payment & Refund"}</option>
                    <option value="account">{lang === "bn" ? "অ্যাকাউন্ট" : "Account"}</option>
                    <option value="other">{lang === "bn" ? "অন্যান্য" : "Other"}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">
                    {lang === "bn" ? "গুরুত্ব (Priority)" : "Priority Level"}
                  </label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#FF6014]"
                  >
                    <option value="low">{lang === "bn" ? "স্বল্প (Low)" : "Low"}</option>
                    <option value="medium">{lang === "bn" ? "মাঝারি (Medium)" : "Medium"}</option>
                    <option value="high">{lang === "bn" ? "উচ্চ (High)" : "High"}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">
                  {lang === "bn" ? "বিস্তারিত বর্ণনা" : "Problem Description"}
                </label>
                <textarea
                  required
                  rows={4}
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  placeholder={lang === "bn" ? "আপনার সমস্যাটির বিস্তারিত বিবরণ লিখুন..." : "Provide detailed information about the issue you are facing..."}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#FF6014] resize-none transition-all"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-3 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  {lang === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isCreatingTicket}
                  className="px-6 py-3 bg-[#FF6014] text-white rounded-xl text-xs font-black hover:opacity-95 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isCreatingTicket && <Loader2 size={14} className="animate-spin" />}
                  {lang === "bn" ? "টিকিট সাবমিট করুন" : "Submit Ticket"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
