import Link from "next/link";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/lr-logo.svg" alt="LR Logo" width={24} height={24} className="h-6 w-auto" />
            <span className="font-semibold text-sm tracking-wide text-foreground">
              LR Command Center
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
          <Link href="/admin" className="px-3 py-2 text-sm font-medium text-foreground bg-border/50 rounded-md">Dashboard</Link>
          <div className="mt-6 mb-2 px-3 text-xs font-bold tracking-widest uppercase text-muted">Research System</div>
          <Link href="/admin/areas" className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-border/30 rounded-md transition-colors">Research Areas</Link>
          <Link href="/admin/projects" className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-border/30 rounded-md transition-colors">Research Projects</Link>
          <Link href="/admin/questions" className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-border/30 rounded-md transition-colors">Questions</Link>
          
          <div className="mt-6 mb-2 px-3 text-xs font-bold tracking-widest uppercase text-muted">Data</div>
          <Link href="/admin/observations" className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-border/30 rounded-md transition-colors">Observations</Link>
          <Link href="/admin/evidence" className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-border/30 rounded-md transition-colors">Evidence</Link>
          <Link href="/admin/sources" className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-border/30 rounded-md transition-colors">Sources</Link>
          
          <div className="mt-6 mb-2 px-3 text-xs font-bold tracking-widest uppercase text-muted">Outputs</div>
          <Link href="/admin/findings" className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-border/30 rounded-md transition-colors">Findings</Link>
          <Link href="/admin/case-studies" className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-border/30 rounded-md transition-colors">Case Studies</Link>
          <Link href="/admin/attack-patterns" className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-border/30 rounded-md transition-colors">Attack Patterns</Link>
          
          <div className="mt-6 mb-2 px-3 text-xs font-bold tracking-widest uppercase text-muted">Community</div>
          <Link href="/admin/contributions" className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-border/30 rounded-md transition-colors">Contributions</Link>
        </nav>
        
        <div className="p-4 border-t border-border">
          <Link href="/admin/settings" className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground flex items-center gap-2">
            Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        <header className="h-16 flex items-center justify-end px-8 border-b border-border bg-surface/50">
          <div className="text-sm font-medium text-muted">Admin User</div>
        </header>
        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
