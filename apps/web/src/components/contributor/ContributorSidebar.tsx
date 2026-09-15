"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useContributor } from "./ContributorProvider";

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
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Compass, 
  User, 
  Clock,
  CheckCircle,
  PanelLeftClose, 
  PanelLeftOpen, 
  LogOut,
  Menu,
  X
} from "lucide-react";

const WORKSPACE_NAV = [
  { icon: LayoutDashboard, name: "OVERVIEW", href: "/contributor" },
  { icon: PlusCircle, name: "CONTRIBUTE", href: "/contributor/contribute" },
];

const CONTRIBUTIONS_NAV = [
  { icon: FileText, name: "ALL CONTRIBUTIONS", href: "/contributor/contributions" },
  { icon: Clock, name: "PENDING", href: "/contributor/pending" },
  { icon: CheckCircle, name: "REVIEWED", href: "/contributor/reviewed" },
];

const OPPORTUNITIES_NAV = [
  { icon: Compass, name: "OPPORTUNITIES", href: "/contributor/opportunities" },
];

const ACCOUNT_NAV = [
  { icon: User, name: "ACCOUNT", href: "/contributor/account" },
];

export function ContributorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { displayName, isLoading } = useContributor();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  useEffect(() => {
    const saved = localStorage.getItem("lr-sidebar-collapsed");
    if (saved) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem("lr-sidebar-collapsed", String(next));
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.replace("/contribute/login");
      router.refresh();
    } catch (err) {
      setIsLoggingOut(false);
    }
  };

  const NavItem = ({ item, collapsed }: { item: typeof WORKSPACE_NAV[0], collapsed: boolean }) => {
    const isActive = pathname === item.href || (item.href !== "/contributor" && pathname.startsWith(item.href));
    
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
      {/* Desktop Sidebar */}
      <aside className={`sticky top-[72px] h-[calc(100vh-72px)] border-r border-border/40 flex-shrink-0 flex-col justify-between transition-all duration-300 hidden md:flex bg-background z-40 overflow-x-hidden ${
        isCollapsed ? 'w-[72px]' : 'w-[280px]'
      }`}>
        <div className="flex flex-col gap-10 py-6 pr-4">
          
          {/* Header Controls: Logo / Favicon / Collapse Toggle */}
          <div className={`flex px-4 ${isCollapsed ? 'flex-col items-center gap-6' : 'items-center justify-between'}`}>
            {!isCollapsed && (
              <Link href="/contributor" className="focus-visible:outline-none opacity-90 hover:opacity-100 transition-opacity shrink-0 flex items-center">
                <SidebarLogo size={28} />
              </Link>
            )}
            
            <button 
              onClick={toggleCollapse} 
              className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-sm hover:bg-muted/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground shrink-0"
              aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              aria-expanded={!isCollapsed}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>

            {isCollapsed && (
              <Link href="/contributor" className="focus-visible:outline-none opacity-90 hover:opacity-100 transition-opacity shrink-0 flex items-center justify-center" title="LR Overview">
                <SidebarLogo size={22} />
              </Link>
            )}
          </div>

          {/* Navigation Groups */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              {!isCollapsed && (
                <span className="px-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Workspace
                </span>
              )}
              {WORKSPACE_NAV.map((item) => (
                <NavItem key={item.href} item={item} collapsed={isCollapsed} />
              ))}
            </div>

            <div className="flex flex-col gap-1">
              {!isCollapsed && (
                <span className="px-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Contributions
                </span>
              )}
              {CONTRIBUTIONS_NAV.map((item) => (
                <NavItem key={item.href} item={item} collapsed={isCollapsed} />
              ))}
            </div>

            <div className="flex flex-col gap-1">
              {!isCollapsed && (
                <span className="px-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Opportunities
                </span>
              )}
              {OPPORTUNITIES_NAV.map((item) => (
                <NavItem key={item.href} item={item} collapsed={isCollapsed} />
              ))}
            </div>

            <div className="flex flex-col gap-1">
              {!isCollapsed && (
                <span className="px-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Account
                </span>
              )}
              {ACCOUNT_NAV.map((item) => (
                <NavItem key={item.href} item={item} collapsed={isCollapsed} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Identity & Logout */}
        <div className={`py-6 pr-4 flex flex-col gap-2 ${isCollapsed ? 'items-center px-0' : 'px-4'}`}>
          <div className="h-[1px] w-full bg-border/40 mb-4 ml-4" />
          
          <Link 
            href="/contributor/account"
            className={`flex flex-col gap-0.5 p-2 hover:bg-muted/5 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground ${isCollapsed ? 'hidden' : 'block'}`}
          >
            {isLoading ? (
              <div className="h-4 w-32 bg-muted/40 animate-pulse rounded-sm mb-1" />
            ) : (
              <span className="text-[14px] font-medium text-foreground truncate w-full block">
                {displayName}
              </span>
            )}
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
              Contributor
            </span>
          </Link>
          
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex items-center gap-4 py-2.5 px-3 text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-muted/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground disabled:opacity-50 ${isCollapsed ? 'justify-center w-fit mx-auto' : 'w-full'}`}
            title={isCollapsed ? "Log Out" : undefined}
          >
            <LogOut size={18} className="shrink-0" />
            {!isCollapsed && (
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] font-medium whitespace-nowrap">
                {isLoggingOut ? "LOGGING OUT..." : "LOG OUT"}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden sticky top-[72px] z-30 w-full border-b border-border/40 bg-background/95 backdrop-blur-md px-6 py-3 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
          Workspace Menu
        </span>
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 -mr-2 text-foreground hover:text-muted-foreground transition-colors focus-visible:outline-none"
          aria-label="Open Workspace Menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Full-Screen Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-background flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-6 border-b border-border/40">
            <Link href="/contributor" onClick={() => setIsMobileOpen(false)} className="flex items-center">
              <SidebarLogo size={32} />
            </Link>
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="p-2 -mr-2 text-foreground hover:text-muted-foreground transition-colors focus-visible:outline-none"
              aria-label="Close Menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Workspace
              </span>
              {WORKSPACE_NAV.map((item) => (
                <NavItem key={item.href} item={item} collapsed={false} />
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Contributions
              </span>
              {CONTRIBUTIONS_NAV.map((item) => (
                <NavItem key={item.href} item={item} collapsed={false} />
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Opportunities
              </span>
              {OPPORTUNITIES_NAV.map((item) => (
                <NavItem key={item.href} item={item} collapsed={false} />
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Account
              </span>
              {ACCOUNT_NAV.map((item) => (
                <NavItem key={item.href} item={item} collapsed={false} />
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-border/40 flex flex-col gap-6">
            <Link 
              href="/contributor/account"
              onClick={() => setIsMobileOpen(false)}
              className="flex flex-col gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground rounded-sm"
            >
              <span className="text-[16px] font-medium text-foreground">{displayName}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Contributor</span>
            </Link>
            
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground w-fit rounded-sm"
            >
              <LogOut size={18} />
              <span className="font-mono text-[12px] uppercase tracking-[0.15em] font-medium">
                {isLoggingOut ? "LOGGING OUT..." : "LOG OUT"}
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}