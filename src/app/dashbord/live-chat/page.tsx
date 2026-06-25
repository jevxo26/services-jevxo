"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useAppSelector } from "@/redux/hooks";
import { Send, User as UserIcon, MessageSquare } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useGetChatHistoryQuery, useGetInboxQuery } from "@/redux/features/shared/chatApi";
import { useGetAllUsersQuery } from "@/redux/features/admin/user";
import { useSearchParams } from "next/navigation";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // For Agent specific logic: Find Superadmin ID to chat with if no active chat
  const { data: usersRes } = useGetAllUsersQuery(undefined, { skip: !isAgent });
  useEffect(() => {
    if (isAgent && usersRes?.data && !activeChatUser) {
      const superadmin = usersRes.data.find((u: any) => u.role?.name === "Super Admin");
      if (superadmin) {
        setActiveChatUser(superadmin);
      }
    }
  }, [isAgent, usersRes, activeChatUser]);

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

    const newSocket = io("http://localhost:8000", {
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !socket || !activeChatUser) return;

    const receiverId = activeChatUser.id || activeChatUser._id;
    socket.emit("sendMessage", {
      receiverId: Number(receiverId),
      content: messageInput,
    });

    setMessageInput("");
  };

  return (
    <div className="flex h-[80vh] bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Sidebar for Everyone (Inbox) */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-100 bg-white">
          <h2 className="text-lg font-bold text-slate-800">Inbox</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {inbox.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">No recent chats</div>
          ) : (
            inbox.map((item: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveChatUser(item.user)}
                className={`w-full text-left p-4 border-b border-slate-100 flex items-start gap-3 transition-colors ${activeChatUser?.id === item.user.id ? "bg-rose-50" : "hover:bg-white"
                  }`}
              >
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 shrink-0">
                  <UserIcon size={18} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800 text-sm">{item.user.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{item.lastMessage}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#FAFAFA]">
        {activeChatUser ? (
          <>
            {/* Chat Header */}
            <div className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-4 shrink-0 shadow-sm z-10">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF7C71] to-rose-400 rounded-full flex items-center justify-center text-white font-bold">
                {activeChatUser.name?.charAt(0) || "U"}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 leading-tight">{activeChatUser.name}</h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  Active User • Online
                </p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <MessageSquare size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-medium">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.sender?.id === user?.id || msg.sender?.id === user?._id;
                  return (
                    <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-2xl px-5 py-3 ${isMe
                          ? "bg-[#FF7C71] text-white rounded-br-sm shadow-md shadow-[#FF7C71]/20"
                          : "bg-white text-slate-800 rounded-bl-sm border border-slate-100 shadow-sm"
                          }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? "text-white/80" : "text-slate-400"}`}>
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
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#FF7C71]/50 focus:ring-2 focus:ring-[#FF7C71]/10 transition-all"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="w-12 h-12 bg-[#FF7C71] hover:bg-[#E5675D] rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#FF7C71]/20"
                >
                  <Send size={18} className="ml-1" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <MessageSquare size={64} className="mb-4 opacity-20" />
            <p className="text-lg font-bold text-slate-500">Live Chat Area</p>
            <p className="text-sm mt-2">
              Select a conversation from the inbox to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LiveChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading chat...</div>}>
      <LiveChatContent />
    </Suspense>
  );
}
