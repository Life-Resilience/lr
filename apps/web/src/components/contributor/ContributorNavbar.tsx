/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, User, LogOut } from "lucide-react";

export function ContributorNavbar() {
  const supabase = createClient();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/contribute/login");
    router.refresh();
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-background/85 backdrop-blur-md border-b border-border/50">
      <div className="mx-auto flex h-[72px] items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/contributor"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground flex flex-col gap-1"
          >
            <span>LR</span>
            <span className="text-muted-foreground text-[9px]">
              Contributor
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-6 relative">
          
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          )}

          {user && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                aria-label="Account menu"
              >
                <User size={16} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-background border border-border/40 shadow-lg rounded-sm py-2 px-1 z-50">
                  <div className="px-3 py-2 border-b border-border/40 mb-1">
                    <p className="font-mono text-[10px] text-muted-foreground truncate">{user.email}</p>
                  </div>
                  
                  <Link
                    href="/contributor/account"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted/30 transition-colors rounded-sm"
                  >
                    <span>Account</span>
                    <span className="text-muted-foreground">→</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-between w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted/30 transition-colors rounded-sm"
                  >
                    <span>Log out</span>
                    <LogOut size={14} className="text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

