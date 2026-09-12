"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, LogOut, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useContributor } from "./ContributorProvider";

export function ContributorNavbar() {
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  const { user, isLoading, displayName, initial } = useContributor();
  
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Click outside & Escape handling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuOpen && 
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.replace("/contribute/login");
    } catch (err) {
      setIsLoggingOut(false);
    }
  };

  const isVerified = user?.email_confirmed_at != null;

  return (
    <header className="fixed top-0 z-50 w-full bg-background/85 backdrop-blur-md border-b border-border/50">
      <div className="mx-auto flex h-[72px] items-center justify-between px-6 max-w-[1440px]">
        
        {/* Left: Global & Personal Identity */}
        <div className="flex items-center gap-5 sm:gap-6">
          <Link
            href="/contributor"
            className="font-mono text-[11px] uppercase tracking-widest text-foreground font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-sm px-1 py-0.5 -ml-1"
          >
            LR
          </Link>
          
          <div className="w-[1px] h-6 bg-border/60 hidden sm:block" />
          
          <div className="flex flex-col">
            {isLoading ? (
              <>
                <div className="h-4 w-24 bg-muted/40 animate-pulse rounded-sm mb-1" />
                <div className="h-3 w-16 bg-muted/20 animate-pulse rounded-sm" />
              </>
            ) : (
              <>
                <span className="text-[14.5px] font-medium text-foreground truncate max-w-[140px] sm:max-w-[200px] leading-tight">
                  {displayName}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">
                  Contributor
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Global Controls */}
        <nav className="flex items-center gap-2 sm:gap-5">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground group relative"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>
          )}

          {user && !isLoading && (
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 text-foreground transition-all p-1 pl-2 pr-2 sm:pr-3 rounded-sm hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
              >
                <span className="hidden sm:inline text-[13.5px] font-medium truncate max-w-[100px]">
                  {displayName.split(' ')[0]}
                </span>
                <div className="w-7 h-7 sm:w-6 sm:h-6 bg-foreground text-background flex items-center justify-center rounded-sm font-medium text-[13px] sm:text-[11px] shrink-0">
                  {initial}
                </div>
              </button>

              {menuOpen && (
                <div 
                  ref={menuRef}
                  role="menu"
                  className="absolute right-0 mt-2 w-64 bg-background border border-border/40 shadow-xl rounded-sm py-2 px-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="px-4 py-3 border-b border-border/40 mb-2 flex flex-col gap-1 text-left">
                    <span className="text-[14px] font-medium text-foreground truncate">{displayName}</span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Contributor</span>
                    
                    <div className="mt-2 flex flex-col gap-0.5">
                      <span className="text-[13px] text-muted-foreground truncate">{user.email}</span>
                      {isVerified && (
                        <span className="text-[10px] text-green-600 dark:text-green-500 font-medium flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Email verified
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col px-1 gap-1">
                    <Link
                      href="/contributor/account"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between w-full text-left px-3 py-2 text-[13.5px] text-foreground hover:bg-muted/40 transition-colors rounded-sm focus-visible:outline-none focus-visible:bg-muted/40"
                    >
                      <span>Account Settings</span>
                      <span className="text-muted-foreground text-[10px] uppercase tracking-widest font-semibold">→</span>
                    </Link>
                  </div>

                  <div className="px-2 py-2">
                    <div className="h-[1px] w-full bg-border/40" />
                  </div>

                  <div className="flex flex-col px-1">
                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center justify-between w-full text-left px-3 py-2 text-[13.5px] text-foreground hover:bg-muted/40 transition-colors rounded-sm focus-visible:outline-none focus-visible:bg-muted/40 disabled:opacity-50"
                    >
                      <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
                      {!isLoggingOut && <LogOut className="w-3.5 h-3.5 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}