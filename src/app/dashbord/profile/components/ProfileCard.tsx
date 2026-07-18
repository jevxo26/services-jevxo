"use client";

import React from "react";
import { Camera, Loader2, Mail, Phone, MapPin } from "lucide-react";
import { getRoleName } from "@/redux/features/auth/authSlice";

interface ProfileCardProps {
  name: string;
  role: any;
  email: string;
  phone: string;
  address: string;
  avatarUrl: string;
  isUploadingAvatar: boolean;
  handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  lang?: string;
}

export default function ProfileCard({
  name,
  role,
  email,
  phone,
  address,
  avatarUrl,
  isUploadingAvatar,
  handleAvatarUpload,
  lang = "bn",
}: ProfileCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4">
      <div className="w-24 h-24 bg-[#E0E7FF] text-[#123C73] rounded-full flex items-center justify-center font-black text-3xl shadow-inner relative overflow-hidden group/avatar">
        {isUploadingAvatar ? (
          <Loader2 className="w-8 h-8 animate-spin text-[#1E4E8C]" />
        ) : avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          name?.substring(0, 2).toUpperCase() || "UU"
        )}

        {/* Camera Overlay button */}
        <label className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer z-10">
          <Camera size={20} className="mb-0.5" />
          <span className="text-[9px] font-bold tracking-wider uppercase">
            {lang === "bn" ? "আপলোড" : "Upload"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
            disabled={isUploadingAvatar}
          />
        </label>

        <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center text-[10px] text-white z-20">
          ✓
        </span>
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-800">{name}</h3>
        <span className="text-xs font-semibold text-[#1E4E8C] bg-[#EEF2FF] px-2.5 py-0.5 rounded-lg mt-1 inline-block capitalize">
          {getRoleName(role)}
        </span>
      </div>

      <div className="w-full pt-4 border-t border-slate-50 space-y-2 text-xs font-medium text-slate-500 text-left">
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-slate-400" />
          <span>{email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-slate-400" />
          <span>{phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-slate-400" />
          <span>{address}</span>
        </div>
      </div>
    </div>
  );
}
