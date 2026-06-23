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
  UserPlus,
  HelpCircle,
  Zap,
  ShoppingBag,
  Percent,
  LayoutGrid,
  Calendar,
  Gift,
  Wrench,
  Layers,
  Package,
  MapPin
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { UserRole, setRole as setAuthRole, getRoleName, logout as authLogout } from "@/redux/features/auth/authSlice";

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
}

export function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rawRole = useAppSelector((state) => state.auth.role) || "superadmin";
  const role = (typeof rawRole === 'string' ? rawRole.toLowerCase().replace(/\s+/g, '') : "client") as UserRole;
  const roleName = getRoleName(role);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamic menu items based on role
  const getMenuItems = (userRole: UserRole): MenuItem[] => {
    switch (userRole) {
      case "superadmin":
        return [
          { icon: LayoutGrid, label: "Overview", href: "/dashbord" },
          { icon: Calendar, label: "Manage Bookings", href: "/dashbord/manage-bookings" },
          { icon: Users, label: "Manage Users", href: "/dashbord/users" },
          { icon: Briefcase, label: "Manage Vendors", href: "/dashbord/vendors" },
          { icon: Zap, label: "Manage Agents", href: "/dashbord/agents" },
          { icon: UserPlus, label: "Manage Employees", href: "/dashbord/employees" },
          { icon: Briefcase, label: "Role Management", href: "/dashbord/role" },
          { icon: ClipboardList, label: "Manage Categories", href: "/dashbord/category" },
          { icon: MapPin, label: "Manage Locations", href: "/dashbord/locations" },
          { icon: Wrench, label: "Manage Services", href: "/dashbord/services" },
          { icon: Layers, label: "Nested Services", href: "/dashbord/nested-services" },
          { icon: Package, label: "Manage Packages", href: "/dashbord/packages" },
          { icon: BarChart3, label: "System Analytics", href: "/dashbord/analytics" },
          { icon: Wallet, label: "Withdraw Requests", href: "/dashbord/withdraw" },
          { icon: User, label: "My Profile", href: "/dashbord/profile" },
          { icon: Settings, label: "Settings", href: "/dashbord/settings" },
        ];
      case "agent":
        return [
          { icon: LayoutGrid, label: "Overview", href: "/dashbord" },
          { icon: Calendar, label: "Manage Bookings", href: "/dashbord/manage-bookings" },
          { icon: Zap, label: "Quick Booking", href: "/dashbord/quick-booking" },
          { icon: ShoppingBag, label: "Recent Orders", href: "/dashbord/orders" },
          { icon: Percent, label: "Commission Tracking", href: "/dashbord/commissions" },
          { icon: HelpCircle, label: "Support Desk", href: "/dashbord/support" },
          { icon: User, label: "My Profile", href: "/dashbord/profile" },
          { icon: Settings, label: "Settings", href: "/dashbord/settings" },
        ];
      case "vendor":
        return [
          { icon: LayoutGrid, label: "Overview", href: "/dashbord" },
          { icon: Calendar, label: "Manage Bookings", href: "/dashbord/manage-bookings" },
          { icon: Wrench, label: "My Services", href: "/dashbord/vendor-services" },
          { icon: Layers, label: "My Sub-Services", href: "/dashbord/nested-services" },
          { icon: Package, label: "My Packages", href: "/dashbord/vendor-packages" },
          { icon: UserPlus, label: "My Employees", href: "/dashbord/employees" },
          { icon: Users, label: "My Clients", href: "/dashbord/users" },
          { icon: Wallet, label: "Withdraw Money", href: "/dashbord/withdraw" },
          { icon: User, label: "My Profile", href: "/dashbord/profile" },
          { icon: Settings, label: "Settings", href: "/dashbord/settings" },
        ];
      case "client":
        return [
          { icon: LayoutGrid, label: "Overview", href: "/dashbord/overview" },
          { icon: Heart, label: "Saved Services", href: "/dashbord/saved" },
          { icon: Calendar, label: "My Bookings", href: "/dashbord/bookings" },
          { icon: Wallet, label: "Wallet", href: "/dashbord/wallet" },
          { icon: HelpCircle, label: "Help", href: "/dashbord/help" },
          { icon: User, label: "My Profile", href: "/dashbord/profile" },
          { icon: Settings, label: "Settings", href: "/dashbord/settings" },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems(role);

  const handleLogout = () => {
    dispatch(authLogout());
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch by skipping render until mounted
  }

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      />

      <div
        className={`bg-[#FFF8F7]/95 backdrop-blur-md md:bg-transparent text-slate-800 border-r border-slate-100 transition-all duration-300 flex flex-col h-screen fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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
            <div className="w-8 h-8 bg-gradient-to-br from-[#FF7C71] to-[#FF7C71] rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md shadow-[#FF7C71]/20">
              R
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight tracking-tight text-slate-800">Rajseba</span>
                <span className="text-[10px] text-[#FF7C71] font-bold tracking-wider uppercase -mt-0.5">{roleName}</span>
              </div>
            )}
          </Link>
          <button onClick={() => setCollapsed(!collapsed)} className="md:hidden text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
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
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group border ${isActive
                  ? "bg-white border-slate-100/60 text-[#FF7C71] font-extrabold shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] scale-[1.01]"
                  : "border-transparent text-slate-500 hover:bg-slate-50/60 hover:text-slate-900"
                  }`}
              >
                <item.icon size={20} className={isActive ? "text-[#FF7C71]" : "text-slate-400 group-hover:text-slate-600 transition-colors"} />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Refer & Earn Promo Card (For client role in expanded state) */}
        {role === "client" && !collapsed && (
          <div className="bg-[#FFF8F7]/80 backdrop-blur-md border border-slate-100 p-4 rounded-3xl shadow-sm mb-4 mx-4">
            <div className="w-9 h-9 bg-[#FFF8F7] border border-[#FFEBE9] rounded-full flex items-center justify-center text-[#FF7C71] mx-auto">
              <Gift size={16} />
            </div>
            <h4 className="text-xs font-bold text-slate-800 text-center mt-2">Refer & Earn</h4>
            <p className="text-[10px] text-slate-400 text-center mt-1 max-w-[170px] mx-auto leading-relaxed">
              Invite friends and get 500 BDT off your next service.
            </p>
            <button className="mt-3 bg-[#FF7C71] hover:opacity-95 text-white font-extrabold text-[10px] py-2 px-4 rounded-xl w-full text-center shadow-md shadow-[#FF7C71]/10 active:scale-[0.98] transition-all">
              Invite Now
            </button>
          </div>
        )}

        {/* Bottom Profile/Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-[#E5675D] w-full rounded-xl hover:bg-[#FFF8F7]/30 transition-all duration-200"
          >
            <LogOut size={20} />
            {!collapsed && <span className="text-sm font-semibold">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}