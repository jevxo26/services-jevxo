"use client";

import React from "react";
import { ChevronLeft, MessageSquare, ImageIcon, X, Loader2, Send } from "lucide-react";

interface ChatWindowProps {
  activeChatUser: any;
  setActiveChatUser: (val: any) => void;
  messages: any[];
  user: any;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  imageFile: File | null;
  imagePreview: string | null;
  messageInput: string;
  setMessageInput: (val: string) => void;
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  setImageFile: (val: File | null) => void;
  setImagePreview: (val: string | null) => void;
  lang?: string;
}

export default function ChatWindow({
  activeChatUser,
  setActiveChatUser,
  messages,
  user,
  messagesEndRef,
  imageFile,
  imagePreview,
  messageInput,
  setMessageInput,
  isUploading,
  fileInputRef,
  handleImageSelect,
  handleSendMessage,
  setImageFile,
  setImagePreview,
  lang = "bn",
}: ChatWindowProps) {
  return (
    <>
      {/* Chat Header */}
      <div className="h-16 bg-white border-b border-slate-100 flex items-center px-4 md:px-6 gap-3 shrink-0 shadow-sm z-10">
        {/* Back button visible on Mobile devices */}
        <button
          onClick={() => setActiveChatUser(null)}
          className="md:hidden p-2 -ml-2 text-slate-500 hover:text-[#1E4E8C] hover:bg-[#EEF2FF] rounded-full transition-colors shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="shrink-0">
          {activeChatUser.avatar || activeChatUser.image ? (
            <img
              src={activeChatUser.avatar || activeChatUser.image}
              alt={activeChatUser.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-[#1E4E8C] to-[#FF8142] rounded-full flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-[#1E4E8C]/10">
              {activeChatUser.name?.charAt(0) || "U"}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm leading-tight">{activeChatUser.name}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {activeChatUser.role?.name || "User"} • {lang === "bn" ? "অনলাইন" : "Online"}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/30">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
            <div className="p-4 bg-white rounded-full border border-slate-100 shadow-sm">
              <MessageSquare size={36} className="text-[#1E4E8C]/25" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {lang === "bn" ? "কোনো মেসেজ নেই। কথোপকথন শুরু করুন!" : "No messages yet. Start conversation!"}
            </p>
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
                  className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-xs border ${
                    isMe
                      ? "bg-gradient-to-br from-[#1E4E8C] to-[#FF8142] text-white rounded-tr-none border-transparent shadow-[#1E4E8C]/10"
                      : "bg-white text-slate-800 rounded-tl-none border-slate-100/90"
                  }`}
                >
                  <div className={`flex items-baseline gap-2 mb-1 ${isMe ? "justify-end text-white/90" : "justify-start text-slate-550"}`}>
                    <span className="font-extrabold text-[10px]">{isMe ? (lang === "bn" ? "আপনি" : "You") : msg.sender?.name}</span>
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
                  <p
                    className={`text-[8.5px] mt-1 text-right font-bold uppercase tracking-wider ${
                      isMe ? "text-white/70" : "text-slate-350"
                    }`}
                  >
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
      <div className="p-3 bg-white border-t border-slate-100 shrink-0">
        {imagePreview && (
          <div className="mb-3 relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-20 rounded-lg object-cover border border-slate-200 shadow-sm"
            />
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
        <form onSubmit={handleSendMessage} className="flex items-center gap-2.5">
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
            className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer shrink-0 animate-in fade-in zoom-in"
          >
            <ImageIcon size={18} />
          </button>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={
              isUploading
                ? lang === "bn"
                  ? "ছবি আপলোড হচ্ছে..."
                  : "Uploading image..."
                : lang === "bn"
                ? "আপনার মেসেজ লিখুন..."
                : "Type your message..."
            }
            className="flex-1 bg-slate-550/5 border border-slate-200/80 rounded-full px-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#1E4E8C]/30 focus:ring-4 focus:ring-[#1E4E8C]/5 transition-all"
            disabled={isUploading}
          />
          <button
            type="submit"
            disabled={(!messageInput.trim() && !imageFile) || isUploading}
            className="w-10 h-10 bg-[#1E4E8C] hover:bg-[#123C73] rounded-full flex items-center justify-center text-white transition-all disabled:opacity-55 disabled:cursor-not-allowed shadow-md shadow-[#1E4E8C]/15 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            {isUploading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} className="ml-0.5" />}
          </button>
        </form>
      </div>
    </>
  );
}
