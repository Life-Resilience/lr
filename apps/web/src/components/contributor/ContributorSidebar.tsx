/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { LayoutDashboard, PlusCircle, FolderGit2, Sparkles, User, PanelLeftClose, PanelLeftOpen, LogOut } from "lucide-react";

export function ContributorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  
  useEffect(() => {
    // Load preference
    const saved = localStorage.getItem("lr-sidebar-collapsed");
    if (saved) {
      setIsCollapsed(saved === "true");
    }

    // Load user profile
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("contributor_profiles")
          .select("name")
          .eq("user_id", user.id)
          .single();
        
        if (data?.name) {
          setUserName(data.name);
        } else {
          setUserName(user.email || "Contributor");
        }
      }
    }
    fetchUser();
  }, [supabase]);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem("lr-sidebar-collapsed", String(next));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/contribute/login");
    router.refresh();
  };

  const navItems = [
    { icon: LayoutDashboard, name: "OVERVIEW", href: "/contributor" },
    { icon: PlusCircle, name: "CONTRIBUTE", href: "/contributor/contribute" },
    { icon: FolderGit2, name: "MY CONTRIBUTIONS", href: "/contributor/contributions" },
    { icon: Sparkles, name: "OPPORTUNITIES", href: "/contributor/opportunities" },
    { icon: User, name: "ACCOUNT", href: "/contributor/account" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto border-r border-border/40 flex-shrink-0 flex-col justify-between transition-all duration-300 hidden md:flex ${isCollapsed ? 'w-20 p-4' : 'w-64 lg:w-72 p-6 lg:p-8'}`}>
        <div className="flex flex-col gap-10">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && (
              <Link href="/contributor" className="flex items-center w-fit focus-visible:outline-none opacity-80 hover:opacity-100 transition-opacity">
                <Image
                  src="/lr-logo-light.svg"
                  alt="Life & Resilience Logo"
                  width={48}
                  height={48}
                  className="logo-light"
                />
                <Image
                  src="/lr-logo-dark.svg"
                  alt="Life & Resilience Logo"
                  width={48}
                  height={48}
                  className="logo-dark"
                />
              </Link>
            )}
            
            <button 
              onClick={toggleCollapse} 
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted/50"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/contributor" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 group p-2 rounded-md focus-visible:outline-none ${isActive ? "text-foreground bg-muted/30" : "text-muted-foreground hover:text-foreground hover:bg-muted/10 transition-colors"}`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!isCollapsed && (
                    <span className="font-mono text-[11px] uppercase tracking-[0.15em] font-medium whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className={`mt-10 pt-6 border-t border-border/40 flex flex-col gap-4 ${isCollapsed ? 'items-center' : 'items-start'}`}>
          <div className={`flex items-center gap-3 w-full ${isCollapsed ? 'justify-center' : ''}`}>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-foreground truncate w-full" title={userName || ""}>
                  {userName || "Loading..."}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                  LR Contributor
                </span>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted/10 ${isCollapsed ? 'justify-center' : 'w-full'}`}
            title={isCollapsed ? "Log Out" : undefined}
          >
            <LogOut size={18} className="shrink-0" />
            {!isCollapsed && (
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] font-medium whitespace-nowrap">
                Log Out
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Top/Horizontal Nav */}
      <aside className="w-full md:hidden border-b border-border/40 p-4 flex-shrink-0">
        <nav className="flex gap-6 overflow-x-auto pb-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/contributor" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 group whitespace-nowrap p-2 rounded-md focus-visible:outline-none ${isActive ? "text-foreground bg-muted/30" : "text-muted-foreground hover:text-foreground transition-colors"}`}
              >
                <item.icon size={16} />
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
