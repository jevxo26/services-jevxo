"use client";

import { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import { Send, User as UserIcon, MessageSquare, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useGetChatHistoryQuery, useGetInboxQuery } from "@/redux/features/shared/chatApi";
import { useGetAllUsersQuery } from "@/redux/features/admin/user";
import { useSearchParams } from "next/navigation";
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

  // For Agent specific logic: Find Superadmin ID to chat with if no active chat
  const { data: usersRes } = useGetAllUsersQuery(undefined, { skip: (!isAgent && !isAdmin) });
  const allUsers = usersRes?.data || [];

  useEffect(() => {
    if (isAgent && usersRes?.data && !activeChatUser) {
      const superadmin = usersRes.data.find((u: any) => u.role?.name === "Super Admin");
      if (superadmin) {
        setActiveChatUser(superadmin);
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

  return (
    <div className="flex h-[80vh] bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Sidebar for Everyone (Inbox) */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-100 bg-white">
          <h2 className="text-lg font-bold text-slate-800">Inbox</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sidebarUsers.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">No recent chats</div>
          ) : (
            sidebarUsers.map((item: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveChatUser(item.user)}
                className={`w-full text-left p-4 border-b border-slate-100 flex items-start gap-3 transition-colors ${activeChatUser?.id === (item.user.id || item.user._id) ? "bg-rose-50" : "hover:bg-white"
                  }`}
              >
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 shrink-0">
                  <UserIcon size={18} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800 text-sm">{item.user.name}</span>
                    {item.lastMessageAt && (
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
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
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6014] to-rose-400 rounded-full flex items-center justify-center text-white font-bold">
                {activeChatUser.name?.charAt(0) || "U"}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 leading-tight">{activeChatUser.name}</h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  {activeChatUser.role?.name || "User"} • Active
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
                        className={`max-w-[70%] rounded-2xl px-5 py-3 ${isMe
                          ? "bg-[#FF6014] text-white rounded-br-sm shadow-md shadow-[#FF6014]/20"
                          : "bg-white text-slate-800 rounded-bl-sm border border-slate-100 shadow-sm"
                          }`}
                      >
                        <div className={`flex items-baseline gap-2 mb-1 ${isMe ? "justify-end text-white" : "justify-start text-slate-800"}`}>
                          <span className="font-bold text-[11px]">{isMe ? "You" : msg.sender?.name}</span>
                          {senderRoleName && (
                             <span className="text-[9px] opacity-75 capitalize">({senderRoleName})</span>
                          )}
                        </div>
                        {msg.imageUrl && (
                          <div className="mb-2 rounded-lg overflow-hidden border border-white/20">
                            <img src={msg.imageUrl} alt="Attachment" className="max-w-[200px] sm:max-w-[300px] object-cover" />
                          </div>
                        )}
                        {msg.content && msg.content.trim() !== "" && (
                          <p className="text-sm">{msg.content}</p>
                        )}
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
                    className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-rose-600 transition-colors"
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
                  className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                  <ImageIcon size={18} />
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#FF6014]/50 focus:ring-2 focus:ring-[#FF6014]/10 transition-all"
                  disabled={isUploading}
                />
                <button
                  type="submit"
                  disabled={(!messageInput.trim() && !imageFile) || isUploading}
                  className="w-12 h-12 bg-[#FF6014] hover:bg-[#E0530A] rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#FF6014]/20"
                >
                  {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-1" />}
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
