"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Briefcase,
  ClipboardList,
  Heart,
  Wallet,
  User,
  HelpCircle,
  Zap,
  ShoppingBag,
  Percent,
  LayoutGrid,
  Calendar,
  Gift
} from "lucide-react";
import { useState } from "react";
import { useRole, UserRole } from "@/context/RoleContext";

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
}

export function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { role, roleName } = useRole();

  // Dynamic menu items based on role
  const getMenuItems = (userRole: UserRole): MenuItem[] => {
    switch (userRole) {
      case "superadmin":
        return [
          { icon: LayoutGrid, label: "Admin Overview", href: "/dashbord" },
          { icon: Users, label: "Manage Users", href: "/dashbord/users" },
          { icon: BarChart3, label: "System Analytics", href: "/dashbord/analytics" },
          { icon: Settings, label: "System Settings", href: "/dashbord/settings" },
        ];
      case "agent":
        return [
          { icon: LayoutGrid, label: "Agent Overview", href: "/dashbord" },
          { icon: Zap, label: "Quick Booking", href: "/dashbord/quick-booking" },
          { icon: ShoppingBag, label: "Recent Orders", href: "/dashbord/orders" },
          { icon: Percent, label: "Commission Tracking", href: "/dashbord/commissions" },
          { icon: Settings, label: "Settings", href: "/dashbord/settings" },
          { icon: HelpCircle, label: "Support Desk", href: "/dashbord/support" },
        ];
      case "provider":
        return [
          { icon: Briefcase, label: "My Jobs", href: "/dashbord" },
          { icon: Settings, label: "Service Profile", href: "/dashbord/settings" },
        ];
      case "customer":
        return [
          { icon: LayoutGrid, label: "Dashboard", href: "/dashbord/overview" },
          { icon: Heart, label: "Saved Services", href: "/dashbord/saved" },
          { icon: Calendar, label: "My Bookings", href: "/dashbord/bookings" },
          { icon: Wallet, label: "Wallet", href: "/dashbord/wallet" },
          { icon: HelpCircle, label: "Help", href: "/dashbord/help" },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems(role);

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`bg-white/95 backdrop-blur-md md:bg-transparent text-slate-800 border-r border-slate-100 transition-all duration-300 flex flex-col h-screen fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${collapsed ? "w-20" : "w-64"} overflow-hidden`}
      >
        {/* Tiled watermark backgrounds inside sidebar */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.16] z-0">
          <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: "url('/Group1.png')", backgroundSize: "800px 800px" }} />
          <div className="absolute inset-0 bg-repeat mix-blend-multiply" style={{ backgroundImage: "url('/Group2.png')", backgroundSize: "800px 800px", backgroundPosition: "400px 400px" }} />
        </div>

        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#FF5B60] to-[#FF464C] rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md shadow-rose-500/20">
            R
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-slate-800">Rajseba</span>
              <span className="text-[10px] text-rose-500 font-bold tracking-wider uppercase -mt-0.5">{roleName}</span>
            </div>
          )}
        </Link>
        <button onClick={() => setCollapsed(!collapsed)} className="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
          <Menu size={18} />
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group border ${
                isActive
                  ? "bg-rose-50/70 border-rose-100/60 text-[#FF464C] font-bold shadow-sm shadow-rose-500/5"
                  : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-[#FF464C]" : "text-slate-400 group-hover:text-slate-600 transition-colors"} />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Refer & Earn Promo Card (For customer role in expanded state) */}
      {role === "customer" && !collapsed && (
        <div className="bg-white/80 backdrop-blur-md border border-slate-100 p-4 rounded-3xl shadow-sm mb-4 mx-4">
          <div className="w-9 h-9 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center text-[#FF464C] mx-auto">
            <Gift size={16} />
          </div>
          <h4 className="text-xs font-bold text-slate-800 text-center mt-2">Refer & Earn</h4>
          <p className="text-[10px] text-slate-400 text-center mt-1 max-w-[170px] mx-auto leading-relaxed">
            Invite friends and get 500 BDT off your next service.
          </p>
          <button className="mt-3 bg-gradient-to-r from-rose-500 to-[#FF464C] hover:opacity-95 text-white font-extrabold text-[10px] py-2 px-4 rounded-xl w-full text-center shadow-md shadow-rose-500/10 active:scale-[0.98] transition-all">
            Invite Now
          </button>
        </div>
      )}

      {/* Bottom Profile/Logout */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-rose-600 w-full rounded-xl hover:bg-rose-50/30 transition-all duration-200"
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-semibold">Logout</span>}
        </button>
      </div>
    </div>
  </>
  );
}