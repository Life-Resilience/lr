import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { ListChecks, ChevronRight } from "lucide-react";
import { AdminServiceRoleNotice } from "@/components/admin/AdminServiceRoleNotice";

export const dynamic = "force-dynamic";

export default async function ReviewQueuePage() {
  const supabase = await createAdminClient();
  
  const { data: contributions } = await supabase
    .from('contributions')
    .select('id, title, type, status, created_at, user_id')
    .in('status', ['SUBMITTED', 'IN_REVIEW'])
    .order('created_at', { ascending: true });

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
          Review Queue
        </h1>
        <p className="text-[17px] text-muted-foreground leading-relaxed">
          Contributions requiring your attention.
        </p>
      </div>

      <AdminServiceRoleNotice />

      <div className="bg-surface border border-border/40 rounded-sm overflow-hidden">
        <div className="p-4 border-b border-border/40 flex items-center justify-between bg-muted/5">
          <div className="flex items-center gap-3">
            <ListChecks className="w-4 h-4 text-muted-foreground" />
            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
              {contributions?.length || 0} ITEMS IN QUEUE
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/10">
                <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Title</th>
                <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Type</th>
                <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Contributor</th>
                <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Submitted</th>
                <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {(!contributions || contributions.length === 0) ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                    The queue is currently empty.
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
                        <span className="inline-flex items-center px-2 py-1 rounded-sm text-[10px] font-mono uppercase tracking-widest bg-cyan-500/10 text-cyan-500">
                          {c.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link 
                          href={`/admin/contributions/${c.id}`}
                          className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-background bg-foreground px-4 py-2 rounded-sm hover:bg-foreground/90 transition-colors"
                        >
                          REVIEW
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
