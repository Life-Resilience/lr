"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 h-[72px] bg-background/95 backdrop-blur-md border-b border-border/40 z-50 px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-12">
        <Link href="/" className="font-semibold text-foreground tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-sm">
          Life & Resilience
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/admin" className={`text-sm font-medium transition-colors ${pathname === '/admin' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            Command Center
          </Link>
          <a href="/" target="_blank" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            View Public Site ↗
          </a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            ADMIN ACTIVE
          </span>
        </div>
      </div>
    </nav>
  );
}
