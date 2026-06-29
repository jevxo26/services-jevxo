"use client";

import { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import {
  Send,
  User as UserIcon,
  MessageSquare,
  ChevronLeft,
  Search,
  Sparkles,
  Image as ImageIcon,
  X,
  Loader2
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useGetChatHistoryQuery, useGetInboxQuery } from "@/redux/features/shared/chatApi";
import { useGetAllUsersQuery } from "@/redux/features/admin/user";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { uploadImage } from "@/lib/upload";

function LiveChatContent() {
  const user = useAppSelector((state) => state.auth.user);
  const rawRole = useAppSelector((state) => state.auth.role);
  const role = typeof rawRole === "string" ? rawRole.toLowerCase().replace(/\s+/g, "") : "";
  const isAdmin = role === "superadmin" || role === "admin";
  const isAgent = role === "agent";

  const searchParams = useSearchParams();
  const queryUserId = searchParams?.get("userId") || searchParams?.get("receiverId");
  const queryUserName = searchParams?.get("userName") || searchParams?.get("receiverName");

  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [activeChatUser, setActiveChatUser] = useState<any | null>(null);
  const [inboxSearch, setInboxSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch inbox for everyone
  const { data: inboxRes, refetch: refetchInbox } = useGetInboxQuery(undefined);
  const inbox = inboxRes || [];

  // If query params are provided, set active chat user
  useEffect(() => {
    if (queryUserId) {
      setActiveChatUser({
        id: Number(queryUserId),
        name: queryUserName || "User",
      });
    }
  }, [queryUserId, queryUserName]);

  // For Agent/Admin specific logic: Fetch all users
  const { data: usersRes } = useGetAllUsersQuery(undefined, { skip: (!isAgent && !isAdmin) });
  const allUsers = usersRes?.data || [];

  useEffect(() => {
    if (isAgent && usersRes?.data && !activeChatUser) {
      const superadmin = usersRes.data.find((u: any) => u.role?.name === "Super Admin");
      if (superadmin) {
        // Auto-select on desktop only
        if (typeof window !== "undefined" && window.innerWidth >= 768) {
          setActiveChatUser(superadmin);
        }
      }
    }
  }, [isAgent, usersRes, activeChatUser]);

  // Combine inbox with all agents/vendors if admin
  const sidebarUsers = useMemo(() => {
    if (isAdmin) {
      const vendorsAndAgents = allUsers.filter((u: any) => {
        const r = u.role?.name?.toLowerCase();
        return r === 'vendor' || r === 'agent';
      });
      // Merge with inbox
      const inboxUserIds = new Set(inbox.map((i: any) => i.user.id || i.user._id));
      const notInInbox = vendorsAndAgents.filter((u: any) => !inboxUserIds.has(u.id) && !inboxUserIds.has(u._id));

      const merged = [
        ...inbox.map((item: any) => ({
          user: item.user,
          lastMessage: item.lastMessage,
          lastMessageAt: item.lastMessageAt
        })),
        ...notInInbox.map((u: any) => ({
          user: u,
          lastMessage: 'Click to start chat',
          lastMessageAt: null
        }))
      ];
      return merged;
    }
    return inbox.map((item: any) => ({
      user: item.user,
      lastMessage: item.lastMessage,
      lastMessageAt: item.lastMessageAt
    }));
  }, [isAdmin, inbox, allUsers]);

  // Fetch History for active chat
  const { data: historyRes, refetch: refetchHistory } = useGetChatHistoryQuery(activeChatUser?.id || activeChatUser?._id, {
    skip: !activeChatUser,
  });

  useEffect(() => {
    if (historyRes) {
      setMessages(historyRes);
      scrollToBottom();
    }
  }, [historyRes]);

  // Connect WebSockets
  useEffect(() => {
    if (!user?.id && !user?._id) return;

    const newSocket = io("https://api.rajseba.com", {
      query: { userId: user.id || user._id },
    });

    newSocket.on("connect", () => {
      console.log("Connected to chat server");
    });

    newSocket.on("newMessage", (message: any) => {
      setMessages((prev) => [...prev, message]);
      refetchInbox();
      scrollToBottom();
    });

    newSocket.on("messageSent", (message: any) => {
      setMessages((prev) => [...prev, message]);
      refetchInbox();
      scrollToBottom();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, refetchInbox]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!messageInput.trim() && !imageFile) || !socket || !activeChatUser || isUploading) return;

    let uploadedImageUrl = undefined;
    if (imageFile) {
      setIsUploading(true);
      try {
        uploadedImageUrl = await uploadImage(imageFile);
      } catch (error) {
        console.error("Image upload failed:", error);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const receiverId = activeChatUser.id || activeChatUser._id;
    socket.emit("sendMessage", {
      receiverId: Number(receiverId),
      content: messageInput || " ",
      imageUrl: uploadedImageUrl,
    });

    setMessageInput("");
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Filter inbox list based on sidebar search input
  const filteredInbox = sidebarUsers.filter((item: any) => {
    const name = item.user?.name || "";
    return name.toLowerCase().includes(inboxSearch.toLowerCase());
  });

  return (
    <div className="flex h-[82vh] bg-white rounded-3xl shadow-lg border border-slate-100/80 overflow-hidden relative">

      {/* ── Inbox Sidebar ── */}
      <div
        className={`w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50/40 transition-all duration-300 ${activeChatUser ? "hidden md:flex" : "flex"
          }`}
      >
        <div className="p-4 border-b border-slate-100 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#FF6014]" />
              Inbox Chats
            </h2>
            <span className="text-[10px] font-extrabold text-[#FF6014] bg-[#FFF8F4] border border-[#FF6014]/20 px-2 py-0.5 rounded-full">
              {filteredInbox.length} Total
            </span>
          </div>

          {/* Search bar inside inbox list */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 focus-within:border-[#FF6014]/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FF6014]/5 transition-all">
            <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={inboxSearch}
              onChange={(e) => setInboxSearch(e.target.value)}
              placeholder="Search chat users..."
              className="flex-1 bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100/50 p-2 space-y-1">
          {filteredInbox.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-semibold">
              {inboxSearch ? "No matching chat users" : "No recent conversations"}
            </div>
          ) : (
            <AnimatePresence>
              {filteredInbox.map((item: any, idx: number) => {
                const isActive = activeChatUser?.id === item.user.id || activeChatUser?._id === item.user.id;
                return (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setActiveChatUser(item.user)}
                    className={`w-full text-left p-3.5 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${isActive
                        ? "bg-[#FFF8F4] border border-[#FF6014]/15 shadow-sm"
                        : "bg-transparent border border-transparent hover:bg-white hover:border-slate-100"
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${isActive ? "bg-gradient-to-br from-[#FF6014] to-[#FF8142] text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                      {item.user?.name ? (
                        <span className="font-extrabold text-sm uppercase">{item.user.name.charAt(0)}</span>
                      ) : (
                        <UserIcon size={18} />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden space-y-0.5">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-slate-800 text-xs truncate">{item.user.name}</span>
                        {item.lastMessageAt && (
                          <span className="text-[9px] font-bold text-slate-400">
                            {new Date(item.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] truncate ${isActive ? "text-[#E0530A] font-semibold" : "text-slate-400 font-medium"}`}>
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

      {/* ── Main Chat Area ── */}
      <div
        className={`flex-1 flex flex-col bg-[#FAF9F6]/40 transition-all duration-300 ${activeChatUser ? "flex" : "hidden md:flex"
          }`}
      >
        {activeChatUser ? (
          <>
            {/* Chat Header */}
            <div className="h-16 bg-white border-b border-slate-100 flex items-center px-4 md:px-6 gap-3 shrink-0 shadow-sm z-10">
              {/* Back button visible on Mobile devices */}
              <button
                onClick={() => setActiveChatUser(null)}
                className="md:hidden p-2 -ml-2 text-slate-500 hover:text-[#FF6014] hover:bg-[#FFF8F4] rounded-full transition-colors shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6014] to-[#FF8142] rounded-full flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-[#FF6014]/10">
                {activeChatUser.name?.charAt(0) || "U"}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm leading-tight">{activeChatUser.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {activeChatUser.role?.name || "User"} • Online
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
                  <div className="p-4 bg-white rounded-full border border-slate-100 shadow-sm">
                    <MessageSquare size={36} className="text-[#FF6014]/25" />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.sender?.id === user?.id || msg.sender?.id === user?._id;

                  // Extract role name
                  let senderRoleName = "";
                  if (msg.sender?.role && typeof msg.sender.role === 'object') {
                    senderRoleName = msg.sender.role.name;
                  } else if (msg.sender?.role && typeof msg.sender.role === 'string') {
                    senderRoleName = msg.sender.role;
                  }

                  return (
                    <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] md:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-xs border ${isMe
                            ? "bg-gradient-to-br from-[#FF6014] to-[#FF8142] text-white rounded-br-none border-transparent shadow-[#FF6014]/10"
                            : "bg-white text-slate-800 rounded-bl-none border-slate-100/90"
                          }`}
                      >
                        <div className={`flex items-baseline gap-2 mb-1 ${isMe ? "justify-end text-white/90" : "justify-start text-slate-550"}`}>
                          <span className="font-extrabold text-[10px]">{isMe ? "You" : msg.sender?.name}</span>
                          {senderRoleName && (
                            <span className="text-[9px] opacity-75 font-bold capitalize">({senderRoleName})</span>
                          )}
                        </div>
                        {msg.imageUrl && (
                          <div className="mb-2 rounded-lg overflow-hidden border border-slate-100 max-w-[200px] sm:max-w-[300px]">
                            <img src={msg.imageUrl} alt="Attachment" className="object-cover w-full h-full" />
                          </div>
                        )}
                        {msg.content && msg.content.trim() !== " " && (
                          <p className="text-[12.5px] leading-relaxed font-semibold">{msg.content}</p>
                        )}
                        <p className={`text-[8.5px] mt-1 text-right font-bold uppercase tracking-wider ${isMe ? "text-white/70" : "text-slate-350"
                          }`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 md:p-4 bg-white border-t border-slate-100 shrink-0">
              {imagePreview && (
                <div className="mb-3 relative inline-block">
                  <img src={imagePreview} alt="Preview" className="h-20 rounded-lg object-cover border border-slate-200 shadow-sm" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-rose-600 transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                >
                  <ImageIcon size={18} />
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={isUploading ? "Uploading image..." : "Type your message..."}
                  className="flex-1 bg-slate-50 border border-slate-200/80 rounded-full px-5 py-3 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#FF6014]/30 focus:ring-4 focus:ring-[#FF6014]/5 transition-all"
                  disabled={isUploading}
                />
                <button
                  type="submit"
                  disabled={(!messageInput.trim() && !imageFile) || isUploading}
                  className="w-11 h-11 bg-[#FF6014] hover:bg-[#E0530A] rounded-full flex items-center justify-center text-white transition-all disabled:opacity-55 disabled:cursor-not-allowed shadow-md shadow-[#FF6014]/15 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                >
                  {isUploading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} className="ml-0.5" />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
            <div className="p-6 bg-white rounded-full border border-slate-100 shadow-sm relative">
              <MessageSquare size={48} className="text-[#FF6014]/15" />
              <div className="absolute -top-1 -right-1 p-1 bg-[#FF6014] rounded-full text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Live Chat Room</p>
              <p className="text-xs text-slate-400 font-semibold">
                Select a conversation from the inbox to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LiveChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold animate-pulse">Loading chat...</div>}>
      <LiveChatContent />
    </Suspense>
  );
}
