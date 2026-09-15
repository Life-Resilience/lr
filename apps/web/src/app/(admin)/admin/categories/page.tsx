import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { FolderTree, ChevronRight } from "lucide-react";
import { AdminServiceRoleNotice } from "@/components/admin/AdminServiceRoleNotice";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  "EXPERIENCE",
  "OBSERVATION",
  "RESEARCH",
  "EVIDENCE",
  "IDEA",
  "QUESTION",
  "PATTERN",
  "OTHER"
];

export default async function CategoriesPage() {
  const supabase = await createAdminClient();
  
  const { data: contributions } = await supabase
    .from('contributions')
    .select('type, status');

  const categoryStats = CATEGORIES.map(cat => {
    const catContributions = (contributions || []).filter(c => c.type.toUpperCase() === cat);
    return {
      name: cat,
      total: catContributions.length,
      pending: catContributions.filter(c => c.status === 'SUBMITTED' || c.status === 'UNDER REVIEW').length,
      accepted: catContributions.filter(c => c.status === 'ACCEPTED').length,
      needsChanges: catContributions.filter(c => c.status === 'NEEDS CHANGES').length,
      rejected: catContributions.filter(c => c.status === 'REJECTED').length,
    };
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 lg:py-12 animate-in fade-in duration-300">
      <div className="flex flex-col gap-5 mb-10">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground leading-none uppercase">
          Categories
        </h1>
        <p className="text-[17px] text-muted-foreground leading-relaxed">
          Manage contribution categories and review submissions by type.
        </p>
      </div>

      <AdminServiceRoleNotice />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryStats.map((stat) => (
          <Link 
            key={stat.name}
            href={`/admin/categories/${stat.name.toLowerCase()}`}
            className="bg-surface border border-border/40 p-6 rounded-sm flex flex-col gap-6 hover:border-foreground/30 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-foreground">
                <FolderTree size={20} className="text-muted-foreground" />
                <span className="text-[14px] font-semibold uppercase tracking-widest">{stat.name}</span>
              </div>
              <ChevronRight size={18} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Total</span>
                <span className="text-xl font-medium text-foreground">{stat.total}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Pending</span>
                <span className="text-xl font-medium text-foreground">{stat.pending}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Accepted</span>
                <span className="text-xl font-medium text-green-500">{stat.accepted}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Needs Changes</span>
                <span className="text-xl font-medium text-yellow-500">{stat.needsChanges}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
