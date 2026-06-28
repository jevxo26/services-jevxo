"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashbord/profile");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FFF8F4] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative flex items-center justify-center mb-6">
        <span
          className="absolute w-16 h-16 rounded-full border-[3px] border-transparent"
          style={{
            borderTopColor: "#FF6014",
            borderRightColor: "#FF6014",
            animation: "spin 1.2s linear infinite",
            opacity: 0.25,
          }}
        />
        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6014] to-rose-500 shadow-lg shadow-rose-300/40" />
      </div>
      <p className="text-base font-black text-slate-800 tracking-tight mb-1">Redirecting to Dashboard...</p>
      <p className="text-xs font-semibold text-slate-400 tracking-wide">Loading your profile panel</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
