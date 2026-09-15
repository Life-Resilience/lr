"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  LayoutDashboard, 
  ListChecks, 
  Users, 
  FileStack,
  FolderTree,
  Settings,
  MessageSquare,
  Globe,
  PanelLeftClose, 
  PanelLeftOpen, 
  LogOut,
  Lock,
  Menu,
  X
} from "lucide-react";

function SidebarLogo({ size = 32 }: { size?: number }) {
  return (
    <div className="relative shrink-0 flex items-center justify-center">
      <Image
        src="/lr-logo-light.svg"
        alt="LR Logo"
        width={size}
        height={size}
        className="logo-light w-auto object-contain"
        style={{ height: `${size}px` }}
        priority
      />
      <Image
        src="/lr-logo-dark.svg"
        alt="LR Logo"
        width={size}
        height={size}
        className="logo-dark w-auto object-contain"
        style={{ height: `${size}px` }}
        priority
      />
    </div>
  );
}

const WORKSPACE_NAV = [
  { icon: LayoutDashboard, name: "OVERVIEW", href: "/admin" },
  { icon: ListChecks, name: "REVIEW QUEUE", href: "/admin/review" },
];

const PEOPLE_NAV = [
  { icon: Users, name: "CONTRIBUTORS", href: "/admin/contributors" },
  { icon: Globe, name: "OPPORTUNITIES", href: "/admin/opportunities" },
  { icon: MessageSquare, name: "COMMUNITY FEEDBACK", href: "/admin/feedback" },
];

const CONTRIBUTIONS_NAV = [
  { icon: FileStack, name: "ALL CONTRIBUTIONS", href: "/admin/contributions" },
  { icon: FolderTree, name: "CATEGORIES", href: "/admin/categories" },
];

const SYSTEM_NAV = [
  { icon: Globe, name: "SITE", href: "/admin/site" },
  { icon: Settings, name: "SETTINGS", href: "/admin/settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  useEffect(() => {
    const saved = localStorage.getItem("lr-admin-sidebar-collapsed");
    if (saved) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem("lr-admin-sidebar-collapsed", String(next));
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const { adminLogoutAction } = await import("@/app/(auth)/admin/auth-actions");
      await adminLogoutAction();
      await supabase.auth.signOut();
      document.cookie = "lr_admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "lr_admin_pending_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "lr-admin-locked=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.replace("/admin/login");
      router.refresh();
    } catch (err) {
      setIsLoggingOut(false);
    }
  };

  const handleLock = () => {
    document.cookie = "lr-admin-locked=true; path=/";
    router.replace("/admin/mfa");
    router.refresh();
  };

  const NavItem = ({ item, collapsed }: { item: any, collapsed: boolean }) => {
    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
    
    return (
      <Link
        href={item.href}
        onClick={() => setIsMobileOpen(false)}
        className={`flex items-center gap-4 group py-3 px-3 rounded-r-sm border-l-2 transition-all focus-visible:outline-none focus-visible:bg-muted/30 ${
          isActive 
            ? "border-foreground bg-muted/10 text-foreground" 
            : "border-transparent text-muted-foreground hover:bg-muted/5 hover:text-foreground hover:border-border/60"
        }`}
        title={collapsed ? item.name : undefined}
      >
        <item.icon size={18} className="shrink-0" />
        {!collapsed && (
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] font-medium whitespace-nowrap opacity-100 transition-opacity">
            {item.name}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      <aside className={`sticky top-[72px] h-[calc(100vh-72px)] border-r border-border/40 flex-shrink-0 flex-col justify-between transition-all duration-300 hidden md:flex bg-background z-40 overflow-x-hidden ${
        isCollapsed ? 'w-[72px]' : 'w-[280px]'
      }`}>
        <div className="flex flex-col gap-8 py-6 pr-4">
          <div className={`flex px-4 ${isCollapsed ? 'flex-col items-center gap-6' : 'items-center justify-between'}`}>
            {!isCollapsed && (
              <Link href="/admin" className="focus-visible:outline-none opacity-90 hover:opacity-100 transition-opacity shrink-0 flex items-center">
                <SidebarLogo size={28} />
              </Link>
            )}
            
            <button 
              onClick={toggleCollapse} 
              className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-sm hover:bg-muted/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground shrink-0"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>

            {isCollapsed && (
              <Link href="/admin" className="focus-visible:outline-none opacity-90 hover:opacity-100 transition-opacity shrink-0 flex items-center justify-center">
                <SidebarLogo size={22} />
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              {!isCollapsed && (
                <span className="px-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Workspace</span>
              )}
              {WORKSPACE_NAV.map((item) => <NavItem key={item.href} item={item} collapsed={isCollapsed} />)}
            </div>

            <div className="flex flex-col gap-1">
              {!isCollapsed && (
                <span className="px-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">People</span>
              )}
              {PEOPLE_NAV.map((item) => <NavItem key={item.href} item={item} collapsed={isCollapsed} />)}
            </div>

            <div className="flex flex-col gap-1">
              {!isCollapsed && (
                <span className="px-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Contributions</span>
              )}
              {CONTRIBUTIONS_NAV.map((item) => <NavItem key={item.href} item={item} collapsed={isCollapsed} />)}
            </div>
            
            <div className="flex flex-col gap-1">
              {!isCollapsed && (
                <span className="px-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">System</span>
              )}
              {SYSTEM_NAV.map((item) => <NavItem key={item.href} item={item} collapsed={isCollapsed} />)}
            </div>
          </div>
        </div>

        <div className={`py-6 pr-4 flex flex-col gap-2 ${isCollapsed ? 'items-center px-0' : 'px-4'}`}>
          <div className="h-[1px] w-full bg-border/40 mb-4 ml-4" />
          
          <div className={`flex flex-col gap-0.5 p-2 ${isCollapsed ? 'hidden' : 'block'}`}>
            <span className="text-[14px] font-medium text-foreground truncate w-full block">Admin User</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Admin Workspace</span>
          </div>
          
          <button 
            onClick={handleLock}
            className={`flex items-center gap-4 py-2.5 px-3 text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-muted/5 focus-visible:outline-none ${isCollapsed ? 'justify-center w-fit mx-auto' : 'w-full'}`}
            title={isCollapsed ? "Lock Session" : undefined}
          >
            <Lock size={18} className="shrink-0" />
            {!isCollapsed && <span className="font-mono text-[11px] uppercase tracking-[0.15em] font-medium whitespace-nowrap">LOCK SESSION</span>}
          </button>

          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex items-center gap-4 py-2.5 px-3 text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-muted/5 focus-visible:outline-none disabled:opacity-50 ${isCollapsed ? 'justify-center w-fit mx-auto' : 'w-full'}`}
            title={isCollapsed ? "Log Out" : undefined}
          >
            <LogOut size={18} className="shrink-0" />
            {!isCollapsed && <span className="font-mono text-[11px] uppercase tracking-[0.15em] font-medium whitespace-nowrap">{isLoggingOut ? "LOGGING OUT..." : "LOG OUT"}</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden sticky top-[72px] z-30 w-full border-b border-border/40 bg-background/95 backdrop-blur-md px-6 py-3 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Admin Menu</span>
        <button onClick={() => setIsMobileOpen(true)} className="p-2 -mr-2 text-foreground">
          <Menu size={20} />
        </button>
      </div>

      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-background flex flex-col animate-in fade-in duration-200">
          <div className="flex items-center justify-between p-6 border-b border-border/40">
            <SidebarLogo size={32} />
            <button onClick={() => setIsMobileOpen(false)} className="p-2 -mr-2 text-foreground">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-10">
            {/* Same Nav Groups for Mobile ... */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Workspace</span>
              {WORKSPACE_NAV.map((item) => <NavItem key={item.href} item={item} collapsed={false} />)}
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">People & Contributions</span>
              {PEOPLE_NAV.map((item) => <NavItem key={item.href} item={item} collapsed={false} />)}
              {CONTRIBUTIONS_NAV.map((item) => <NavItem key={item.href} item={item} collapsed={false} />)}
            </div>
          </div>
          <div className="p-6 border-t border-border/40 flex flex-col gap-6">
            <button onClick={handleLock} className="flex items-center gap-3 text-muted-foreground">
              <Lock size={18} />
              <span className="font-mono text-[12px] uppercase tracking-[0.15em] font-medium">LOCK SESSION</span>
            </button>
            <button onClick={handleLogout} className="flex items-center gap-3 text-muted-foreground">
              <LogOut size={18} />
              <span className="font-mono text-[12px] uppercase tracking-[0.15em] font-medium">LOG OUT</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
