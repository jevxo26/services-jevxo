"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { RoleProvider } from "@/context/RoleContext";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RoleProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 relative">
        {/* Tiled watermark backgrounds */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.16] z-0">
          <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: "url('/Group1.png')", backgroundSize: "800px 800px" }} />
          <div className="absolute inset-0 bg-repeat mix-blend-multiply" style={{ backgroundImage: "url('/Group2.png')", backgroundSize: "800px 800px", backgroundPosition: "400px 400px" }} />
        </div>

        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden relative z-10 bg-transparent">
          {/* Top Navbar */}
          <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

          {/* Page Content */}
          <main className="flex-1 overflow-auto bg-transparent p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </RoleProvider>
  );
}