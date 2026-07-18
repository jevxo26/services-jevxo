"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
// import { RoleProvider } from "@/context/RoleContext";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";

/* ── Premium full-screen loading spinner ───────────────────────────────── */
function DashboardLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#EEF2FF]">
      {/* Soft background blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-[#1E4E8C]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[280px] h-[280px] rounded-full bg-rose-200/20 blur-[80px] pointer-events-none" />

      {/* Spinner stack */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer slow ring */}
        <span
          className="absolute w-24 h-24 rounded-full border-[3px] border-transparent"
          style={{
            borderTopColor: "#1E4E8C",
            borderRightColor: "#1E4E8C",
            animation: "spin 1.6s linear infinite",
            opacity: 0.25,
          }}
        />
        {/* Middle ring */}
        <span
          className="absolute w-16 h-16 rounded-full border-[3px] border-transparent"
          style={{
            borderTopColor: "#1E4E8C",
            borderLeftColor: "#1E4E8C",
            animation: "spin 1s linear infinite reverse",
            opacity: 0.5,
          }}
        />
        {/* Inner solid dot */}
        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E4E8C] to-rose-500 shadow-lg shadow-rose-300/40" />
      </div>

      {/* Brand wordmark */}
      <p className="text-base font-black text-slate-800 tracking-tight mb-1">Jevxo Services</p>
      <p className="text-xs font-semibold text-slate-400 tracking-wide">Loading your dashboard…</p>

      {/* Keyframes via inline style */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

import { ConfirmProvider } from "@/context/ConfirmDialogContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isAuthLoading = useAppSelector((state) => state.auth.isLoading);

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add("dashboard-html");

    // Mutation observer to detect when a modal (custom or Radix UI) is open in the DOM
    const checkModalState = () => {
      const hasCustomModal = !!document.querySelector(".fixed.inset-0.z-50, .fixed.inset-0.z-\\[50\\], .fixed.inset-0.z-\\[9999\\]");
      const hasRadixModal = document.body.hasAttribute("data-scroll-locked");
      if (hasCustomModal || hasRadixModal) {
        document.documentElement.classList.add("modal-open");
        document.body.classList.add("modal-open");
      } else {
        document.documentElement.classList.remove("modal-open");
        document.body.classList.remove("modal-open");
      }
    };

    // Run once initially
    checkModalState();

    const observer = new MutationObserver(checkModalState);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-scroll-locked"],
    });

    return () => {
      document.documentElement.classList.remove("dashboard-html");
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
      observer.disconnect();
    };
  }, []);

  /* Show global spinner while auth state is hydrating from localStorage */
  if (!mounted || isAuthLoading) {
    return <DashboardLoader />;
  }

  return (
    <ConfirmProvider>
      <div className="flex h-screen overflow-hidden bg-[#EEF2FF] text-slate-900 relative">
        {/* Repeating background icons pattern */}
        <div
          className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
          style={{ backgroundSize: 'auto' }}
        />

        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden relative z-10 bg-transparent">
          {/* Top Navbar */}
          <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

          {/* Page Content */}
          <main className="flex-1 overflow-auto bg-transparent p-4 pb-8 sm:p-6 sm:pb-12 md:pb-12">
            {children}
          </main>
        </div>
      </div>
    </ConfirmProvider>
  );
}