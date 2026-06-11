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
} from "lucide-react";
import { useState } from "react";
import { useRole, UserRole } from "@/context/RoleContext";

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { role, roleName } = useRole();

  // Dynamic menu items based on role
  const getMenuItems = (userRole: UserRole): MenuItem[] => {
    switch (userRole) {
      case "superadmin":
        return [
          { icon: Home, label: "Admin Overview", href: "/dashbord" },
          { icon: Users, label: "Manage Users", href: "/dashbord/users" },
          { icon: BarChart3, label: "System Analytics", href: "/dashbord/analytics" },
          { icon: Settings, label: "System Settings", href: "/dashbord/settings" },
        ];
      case "operator":
        return [
          { icon: Home, label: "Operator Desk", href: "/dashbord" },
          { icon: Users, label: "Verify Providers", href: "/dashbord/users" },
          { icon: BarChart3, label: "Dispatch Analytics", href: "/dashbord/analytics" },
          { icon: Settings, label: "Desk Settings", href: "/dashbord/settings" },
        ];
      case "agent":
        return [
          { icon: Home, label: "Agent Overview", href: "/dashbord" },
          { icon: Zap, label: "Quick Booking", href: "/dashbord/quick-booking" },
          { icon: ShoppingBag, label: "Recent Orders", href: "/dashbord/orders" },
          { icon: Percent, label: "Commission Tracking", href: "/dashbord/commissions" },
          { icon: HelpCircle, label: "Support Desk", href: "/dashbord/support" },
        ];
      case "provider":
        return [
          { icon: Briefcase, label: "My Jobs", href: "/dashbord" },
          { icon: Settings, label: "Service Profile", href: "/dashbord/settings" },
        ];
      case "customer":
        return [
          { icon: Home, label: "Overview", href: "/dashbord/overview" },
          { icon: ClipboardList, label: "My Bookings", href: "/dashbord/bookings" },
          { icon: Heart, label: "Saved Services", href: "/dashbord/saved" },
          { icon: Wallet, label: "Wallet", href: "/dashbord/wallet" },
          { icon: User, label: "Profile", href: "/dashbord/profile" },
          { icon: HelpCircle, label: "Help Center", href: "/dashbord/help" },
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
    <div className={`bg-slate-900 text-white transition-all duration-300 ${collapsed ? "w-20" : "w-64"} flex flex-col h-screen`}>
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between border-b border-slate-800">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-[#FF5A5F] rounded-xl flex items-center justify-center font-bold text-lg shadow-md shadow-rose-500/20">
            R
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-white">Rajseba</span>
              <span className="text-[10px] text-rose-400 font-medium tracking-wider uppercase -mt-0.5">{roleName}</span>
            </div>
          )}
        </Link>
        <button onClick={() => setCollapsed(!collapsed)} className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-800 rounded-lg transition-colors">
          <Menu size={18} />
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-rose-500 text-white font-medium shadow-lg shadow-rose-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-white" : "text-slate-400 group-hover:text-white transition-colors"} />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile/Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 w-full rounded-xl hover:bg-rose-50/10 transition-all duration-200"
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}