"use client";

import React from "react";
import { Search, MessageSquare, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatSidebarProps {
  inboxSearch: string;
  setInboxSearch: (val: string) => void;
  filteredInbox: any[];
  activeChatUser: any;
  setActiveChatUser: (user: any) => void;
  lang?: string;
}

export default function ChatSidebar({
  inboxSearch,
  setInboxSearch,
  filteredInbox,
  activeChatUser,
  setActiveChatUser,
  lang = "bn",
}: ChatSidebarProps) {
  return (
    <div
      className={`w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50/40 transition-all duration-300 ${
        activeChatUser ? "hidden md:flex" : "flex"
      }`}
    >
      <div className="p-4 border-b border-slate-100 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-[#4F46E5]" />
            {lang === "bn" ? "ইনবক্স চ্যাট" : "Inbox Chat"}
          </h2>
          <span className="text-[10px] font-extrabold text-[#4F46E5] bg-[#EEF2FF] border border-[#4F46E5]/20 px-2 py-0.5 rounded-full">
            {lang === "bn" ? `মোট ${filteredInbox.length}` : `Total ${filteredInbox.length}`}
          </span>
        </div>

        {/* Search bar inside inbox list */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 focus-within:border-[#4F46E5]/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#4F46E5]/5 transition-all">
          <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={inboxSearch}
            onChange={(e) => setInboxSearch(e.target.value)}
            placeholder={lang === "bn" ? "ইউজার খুঁজুন..." : "Search user..."}
            className="flex-1 bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-100/50 p-2 space-y-1">
        {filteredInbox.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs font-semibold">
            {inboxSearch
              ? lang === "bn"
                ? "কোনো ইউজার পাওয়া যায়নি"
                : "No users found"
              : lang === "bn"
              ? "কোনো সাম্প্রতিক কথোপকথন নেই"
              : "No recent conversations"}
          </div>
        ) : (
          <AnimatePresence>
            {filteredInbox.map((item: any, idx: number) => {
              const activeId = activeChatUser?.id || activeChatUser?._id;
              const itemId = item.user?.id || item.user?._id;
              const isActive = activeId && itemId && String(activeId) === String(itemId);
              return (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setActiveChatUser(item.user)}
                  className={`w-full text-left p-3 flex items-center gap-3 transition-all cursor-pointer rounded-2xl ${
                    isActive
                      ? "bg-[#EEF2FF] border-l-4 border-l-[#4F46E5] border border-[#4F46E5]/15 shadow-sm shadow-[#4F46E5]/5"
                      : "bg-transparent border border-transparent hover:bg-white hover:border-slate-100"
                  }`}
                >
                  <div className="shrink-0">
                    {item.user?.avatar || item.user?.image ? (
                      <img
                        src={item.user.avatar || item.user.image}
                        alt={item.user.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-xs"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                          isActive ? "bg-gradient-to-br from-[#4F46E5] to-[#FF8142] text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.user?.name ? (
                          <span className="font-extrabold text-sm uppercase">
                            {item.user.name.charAt(0)}
                          </span>
                        ) : (
                          <UserIcon size={18} />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-800 text-xs truncate">
                        {item.user.name}
                      </span>
                      {item.lastMessageAt && (
                        <span className="text-[9px] font-bold text-slate-400">
                          {new Date(item.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] truncate ${isActive ? "text-[#4338CA] font-semibold" : "text-slate-400 font-medium"}`}>
                      {item.lastMessage}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
