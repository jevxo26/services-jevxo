"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  BarChart3,
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
  Percent,
  LayoutGrid,
  Calendar,
  Gift,
  Wrench,
  Layers,
  Package,
  MapPin,
  History,
  MessageSquare,
  Mail,
  Search,
  X,
  ChevronDown
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { UserRole, getRoleName, logout as authLogout } from "@/redux/features/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarGroup {
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  children?: {
    label: string;
    href: string;
    icon?: React.ComponentType<any>;
  }[];
}

export function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const rawRole = useAppSelector((state) => state.auth.role) || "superadmin";
  const role = (typeof rawRole === 'string' ? rawRole.toLowerCase().replace(/\s+/g, '') : "client") as UserRole;
  const roleName = getRoleName(role);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamic grouped menu items based on role (Accordion Tree structure)
  const getSidebarGroups = (userRole: UserRole): SidebarGroup[] => {
    const homeItem = { label: "Home Page", icon: Home, href: "/" };

    switch (userRole) {
      case "superadmin":
        return [
          homeItem,
          { label: "Overview", icon: LayoutGrid, href: "/dashbord" },
          {
            label: "Operations",
            icon: Calendar,
            children: [
              { label: "Manage Bookings", href: "/dashbord/manage-bookings", icon: ClipboardList },
              { label: "Withdraw Requests", href: "/dashbord/withdraw", icon: Wallet }
            ]
          },
          {
            label: "User Directory",
            icon: Users,
            children: [
              { label: "Manage Users", href: "/dashbord/users", icon: Users },
              { label: "Manage Vendors", href: "/dashbord/vendors", icon: Briefcase },
              { label: "Manage Agents", href: "/dashbord/agents", icon: Zap },
              { label: "Manage Employees", href: "/dashbord/employees", icon: UserPlus },
              { label: "Role Management", href: "/dashbord/role", icon: Briefcase }
            ]
          },
          {
            label: "Service Catalog",
            icon: Wrench,
            children: [
              { label: "Categories", href: "/dashbord/category", icon: ClipboardList },
              { label: "Locations", href: "/dashbord/locations", icon: MapPin },
              { label: "Services", href: "/dashbord/services", icon: Wrench },
              { label: "Nested Services", href: "/dashbord/nested-services", icon: Layers },
              { label: "Sub Services", href: "/dashbord/sub-services", icon: Layers },
              { label: "Packages", href: "/dashbord/packages", icon: Package }
            ]
          },
          {
            label: "Marketing",
            icon: Percent,
            children: [
              { label: "Coupons", href: "/dashbord/coupons", icon: Percent },
              { label: "Analytics", href: "/dashbord/analytics", icon: BarChart3 }
            ]
          },
          {
            label: "Support Desk",
            icon: Mail,
            children: [
              { label: "Contacts", href: "/dashbord/contacts", icon: Mail },
              { label: "Live Chat", href: "/dashbord/live-chat", icon: MessageSquare }
            ]
          },
          {
            label: "Settings",
            icon: User,
            children: [
              { label: "My Profile", href: "/dashbord/profile", icon: User }
            ]
          }
        ];
      case "agent":
        return [
          homeItem,
          { label: "Overview", icon: LayoutGrid, href: "/dashbord" },
          {
            label: "Operations",
            icon: Calendar,
            children: [
              { label: "Manage Bookings", href: "/dashbord/manage-bookings", icon: ClipboardList },
              { label: "Wallet & Earnings", href: "/dashbord/vendor-wallet", icon: Wallet }
            ]
          },
          {
            label: "Directories",
            icon: Users,
            children: [
              { label: "Manage Clients", href: "/dashbord/users", icon: Users },
              { label: "Services", href: "/dashbord/services", icon: Wrench }
            ]
          },
          {
            label: "Support & Profile",
            icon: MessageSquare,
            children: [
              { label: "Live Chat", href: "/dashbord/live-chat", icon: MessageSquare },
              { label: "My Profile", href: "/dashbord/profile", icon: User }
            ]
          }
        ];
      case "vendor":
        return [
          homeItem,
          { label: "Overview", icon: LayoutGrid, href: "/dashbord" },
          {
            label: "Bookings",
            icon: Calendar,
            children: [
              { label: "Manage Bookings", href: "/dashbord/manage-bookings", icon: ClipboardList },
              { label: "Wallet & Earnings", href: "/dashbord/vendor-wallet", icon: Wallet }
            ]
          },
          {
            label: "Services",
            icon: Wrench,
            children: [
              { label: "My Services", href: "/dashbord/vendor-services", icon: Wrench },
              { label: "Nested Services", href: "/dashbord/nested-services", icon: Layers },
              { label: "Sub-Services", href: "/dashbord/sub-services", icon: Layers },
              { label: "Packages", href: "/dashbord/vendor-packages", icon: Package }
            ]
          },
          {
            label: "Team & Clients",
            icon: Users,
            children: [
              { label: "My Employees", href: "/dashbord/employees", icon: UserPlus },
              { label: "My Clients", href: "/dashbord/users", icon: Users }
            ]
          },
          {
            label: "Support & Profile",
            icon: MessageSquare,
            children: [
              { label: "Live Chat", href: "/dashbord/live-chat", icon: MessageSquare },
              { label: "My Profile", href: "/dashbord/profile", icon: User }
            ]
          }
        ];
      case "client":
        return [
          homeItem,
          { label: "Overview", icon: LayoutGrid, href: "/dashbord/overview" },
          { label: "My Bookings", icon: Calendar, href: "/dashbord/bookings" },
          { label: "Saved Services", icon: Heart, href: "/dashbord/saved" },
          { label: "Help Center", icon: HelpCircle, href: "/dashbord/help" },
          { label: "My Profile", icon: User, href: "/dashbord/profile" }
        ];
      default:
        return [];
    }
  };

  // Filter sidebar groups based on search query
  const sidebarGroups = useMemo(() => {
    const groups = getSidebarGroups(role);
    if (!searchQuery) return groups;

    const query = searchQuery.toLowerCase();
    return groups
      .map(group => {
        if (group.children) {
          const matchedChildren = group.children.filter(child =>
            child.label.toLowerCase().includes(query)
          );
          if (matchedChildren.length > 0) {
            return { ...group, children: matchedChildren };
          }
        }
        if (group.label.toLowerCase().includes(query)) {
          return group;
        }
        return null;
      })
      .filter((g): g is SidebarGroup => g !== null);
  }, [role, searchQuery]);

  // Auto-expand group that contains active link or matching search
  useEffect(() => {
    const groups = getSidebarGroups(role);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchedGroup = groups.find(group =>
        group.children?.some(c => c.label.toLowerCase().includes(query))
      );
      if (matchedGroup) {
        setExpandedGroup(matchedGroup.label);
      }
    } else {
      const activeGroup = groups.find(group =>
        group.children?.some(child => pathname === child.href)
      );
      if (activeGroup) {
        setExpandedGroup(activeGroup.label);
      }
    }
  }, [pathname, role, searchQuery]);

  const handleLogout = () => {
    dispatch(authLogout());
  };

  if (!mounted) {
    return null;
  }

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
        className={`bg-[#FFF8F4] text-slate-800 border-r-[2px] border-[#FF6014]/15 shadow-[6px_0_24px_rgba(255,96,20,0.02)] transition-all duration-300 flex flex-col h-screen fixed inset-y-0 left-0 z-[60] md:relative md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${collapsed ? "w-20" : "w-64"} overflow-hidden`}
      >
        {/* Repeating background icons pattern inside sidebar */}
        <div
          className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
          style={{ backgroundSize: 'auto' }}
        />

        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100 relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FF6014] to-[#FF7C71] rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md shadow-[#FF6014]/20">
              R
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight tracking-tight text-slate-800">Rajseba</span>
                <span className="text-[10px] text-[#FF6014] font-bold tracking-wider uppercase -mt-0.5">{roleName}</span>
              </div>
            )}
          </Link>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        {!collapsed && (
          <div className="px-4 pt-4 pb-2 relative z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200/80 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-700 placeholder:text-slate-400/80 outline-none focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 transition-all shadow-sm focus:shadow-[0_0_20px_-3px_rgba(255,96,20,0.15)]"
              />
            </div>
          </div>
        )}

        {/* Accordion Tree Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto relative z-10">
          {sidebarGroups.map((group, index) => {
            const hasChildren = group.children && group.children.length > 0;
            const isExpanded = expandedGroup === group.label;

            // Check if active item is inside this group
            const containsActive = hasChildren && group.children?.some(c => pathname === c.href);
            const isDirectActive = !hasChildren && group.href && pathname === group.href;

            const handleToggle = () => {
              if (hasChildren) {
                setExpandedGroup(isExpanded ? null : group.label);
              }
            };

            return (
              <div key={index} className="space-y-1">
                {/* Parent Row Button / Link */}
                {group.href ? (
                  <Link
                    href={group.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group border relative ${
                      isDirectActive
                        ? "bg-gradient-to-r from-[#FF6014] to-[#FF7C71] text-white font-extrabold shadow-md shadow-[#FF6014]/20 scale-[1.01] border-transparent"
                        : "border-transparent text-slate-600 hover:bg-slate-50/70 hover:text-slate-900 hover:translate-x-1 font-semibold"
                    }`}
                  >
                    {isDirectActive && (
                      <div className="absolute left-1.5 w-1 h-5 bg-white rounded-full" />
                    )}
                    <group.icon size={18} className={isDirectActive ? "text-white" : "text-slate-400 group-hover:text-slate-600 transition-colors"} />
                    {!collapsed && <span className="text-[13px]">{group.label}</span>}
                  </Link>
                ) : (
                  <button
                    onClick={handleToggle}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group border relative ${
                      containsActive
                        ? "bg-[#FFF8F4] border-[#FF6014]/15 text-[#FF6014] font-extrabold shadow-sm"
                        : "border-transparent text-slate-600 hover:bg-slate-50/70 hover:text-slate-900 hover:translate-x-1 font-semibold"
                    }`}
                  >
                    {containsActive && (
                      <div className="absolute left-1.5 w-1 h-5 bg-[#FF6014] rounded-full" />
                    )}
                    <div className="flex items-center gap-3">
                      <group.icon size={18} className={containsActive ? "text-[#FF6014]" : "text-slate-400 group-hover:text-slate-600 transition-colors"} />
                      {!collapsed && <span className="text-[13px]">{group.label}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronDown
                        size={14}
                        className={`text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>
                )}

                {/* Collapsible Sub-menu (Tree branch hierarchy) */}
                {hasChildren && group.children && (
                  <AnimatePresence initial={false}>
                    {isExpanded && !collapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="relative pl-6 space-y-1 overflow-hidden"
                      >
                        {/* Parent vertical timeline trunk */}
                        <div className="absolute left-[27px] top-0 bottom-4 w-[1.5px] bg-[#FF6014]/25" />

                        {group.children.map((child, cIdx) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={cIdx}
                              href={child.href}
                              onClick={onClose}
                              className={`flex items-center gap-2.5 pl-9 pr-3 py-2.5 rounded-xl text-[12px] font-bold transition-all relative group border ${
                                isChildActive
                                  ? "bg-gradient-to-r from-[#FF6014] to-[#FF7C71] text-white shadow-md shadow-[#FF6014]/15 border-transparent scale-[1.01]"
                                  : "border-transparent text-slate-500 hover:bg-slate-50/50 hover:text-slate-800 hover:translate-x-1.5"
                              }`}
                            >
                              {/* Branch hook curve SVG-style path connector */}
                              <div className="absolute left-[27px] top-0 w-3.5 h-[22px] border-l-[1.5px] border-b-[1.5px] border-[#FF6014]/30 rounded-bl-lg pointer-events-none" />

                              {isChildActive && (
                                <div className="absolute left-[25px] top-[14px] w-1.5 h-1.5 bg-[#FF7C71] rounded-full ring-2 ring-white z-10" />
                              )}

                              {child.icon && (
                                <child.icon
                                  size={14}
                                  className={isChildActive ? "text-white" : "text-slate-400 group-hover:text-slate-500 transition-colors"}
                                />
                              )}
                              <span>{child.label}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </nav>

        {/* Refer & Earn Promo Card (For client role in expanded state) */}
        {role === "client" && !collapsed && (
          <div className="bg-[#FFF8F4]/80 backdrop-blur-md border border-slate-100 p-4 rounded-3xl shadow-sm mb-4 mx-4 relative z-10">
            <div className="w-9 h-9 bg-[#FFF8F4] border border-[#FFF0EB] rounded-full flex items-center justify-center text-[#FF6014] mx-auto">
              <Gift size={16} />
            </div>
            <h4 className="text-xs font-bold text-slate-800 text-center mt-2">Refer & Earn</h4>
            <p className="text-[10px] text-slate-400 text-center mt-1 max-w-[170px] mx-auto leading-relaxed">
              Invite friends and get 500 BDT off your next service.
            </p>
            <button className="mt-3 bg-[#FF6014] hover:opacity-95 text-white font-extrabold text-[10px] py-2 px-4 rounded-xl w-full text-center shadow-md shadow-[#FF6014]/10 active:scale-[0.98] transition-all">
              Invite Now
            </button>
          </div>
        )}

        {/* Bottom Profile/Logout */}
        <div className="p-4 border-t border-slate-100 relative z-10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-[#E0530A] w-full rounded-xl hover:bg-[#FFF8F4]/30 transition-all duration-200"
          >
            <LogOut size={20} />
            {!collapsed && <span className="text-sm font-semibold">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}