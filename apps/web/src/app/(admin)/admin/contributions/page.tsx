import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { FileStack, Search, ChevronRight } from "lucide-react";
import { AdminServiceRoleNotice } from "@/components/admin/AdminServiceRoleNotice";

export const dynamic = "force-dynamic";

export default async function ContributionsPage() {
  const supabase = await createAdminClient();
  
  const { data: contributions } = await supabase
    .from('contributions')
    .select('id, title, type, status, created_at, user_id')
    .order('created_at', { ascending: false });

  const userIds = [...new Set((contributions || []).map(c => c.user_id))];
  const { data: profiles } = await supabase
    .from('contributor_profiles')
    .select('user_id, name, preferred_name')
    .in('user_id', userIds);
    
  const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 lg:py-12 animate-in fade-in duration-300">
      <div className="flex flex-col gap-5 mb-10">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground leading-none uppercase">
          All Contributions
        </h1>
        <p className="text-[17px] text-muted-foreground leading-relaxed">
          Search and filter all contributions across the platform.
        </p>
      </div>

      <AdminServiceRoleNotice />

      <div className="bg-surface border border-border/40 rounded-sm">
        <div className="p-4 border-b border-border/40 flex items-center justify-between">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search contributions..." 
              className="w-full pl-9 pr-4 py-2 bg-background border border-border/60 rounded-sm text-sm focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
          <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
            {contributions?.length || 0} TOTAL
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/10">
                <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Title</th>
                <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Type</th>
                <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Contributor</th>
                <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Date</th>
                <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>
            <tbody>
              {(!contributions || contributions.length === 0) ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                    No contributions found.
                  </td>
                </tr>
              ) : (
                contributions.map((c) => {
                  const profile = profileMap.get(c.user_id);
                  const displayName = profile?.preferred_name || profile?.name || 'Unknown';
                  return (
                    <tr key={c.id} className="border-b border-border/40 last:border-0 hover:bg-muted/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-foreground truncate max-w-[250px]">{c.title}</div>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground text-sm uppercase font-mono tracking-widest">{c.type}</td>
                      <td className="py-4 px-6 text-muted-foreground text-sm truncate max-w-[150px]">{displayName}</td>
                      <td className="py-4 px-6 text-muted-foreground text-sm">{new Date(c.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-sm text-[10px] font-mono uppercase tracking-widest ${
                          c.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' :
                          c.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                          c.status === 'NEEDS_CHANGES' ? 'bg-yellow-500/10 text-yellow-600' :
                          'bg-cyan-500/10 text-cyan-500'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link 
                          href={`/admin/contributions/${c.id}`}
                          className="inline-flex p-2 text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-sm transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
