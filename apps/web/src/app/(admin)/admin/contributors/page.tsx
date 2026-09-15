import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { Users, ChevronRight, Search } from "lucide-react";
import { AdminServiceRoleNotice } from "@/components/admin/AdminServiceRoleNotice";

export const dynamic = "force-dynamic";

export default async function ContributorsPage() {
  const supabase = await createAdminClient();
  
  const { data: profiles } = await supabase
    .from('contributor_profiles')
    .select('id, user_id, name, preferred_name, email, onboarding_status, created_at, primary_role, discovery_source, discovery_details, country')
    .order('created_at', { ascending: false });

  // Fetch all contributions to calculate metrics
  const { data: contributions } = await supabase
    .from('contributions')
    .select('id, user_id, status, updated_at');

  const contributorMetrics = new Map();
  if (contributions) {
    contributions.forEach(c => {
      const current = contributorMetrics.get(c.user_id) || { count: 0, lastActivity: null };
      current.count += 1;
      
      const cDate = new Date(c.updated_at);
      if (!current.lastActivity || cDate > new Date(current.lastActivity)) {
        current.lastActivity = c.updated_at;
      }
      
      contributorMetrics.set(c.user_id, current);
    });
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 lg:py-12 animate-in fade-in duration-300">
      <div className="flex flex-col gap-5 mb-10">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground leading-none uppercase">
          Contributors
        </h1>
        <p className="text-[17px] text-muted-foreground leading-relaxed">
          Manage and view contributor profiles, their submissions, and activity.
        </p>
      </div>

      <AdminServiceRoleNotice />

      <div className="bg-surface border border-border/40 rounded-sm">
        <div className="p-4 border-b border-border/40 flex items-center justify-between">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search contributors..." 
              className="w-full pl-9 pr-4 py-2 bg-background border border-border/60 rounded-sm text-sm focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
          <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
            {profiles?.length || 0} TOTAL
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/10">
                <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Name / Email</th>
                <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest text-center">Submissions</th>
                <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Last Activity</th>
                <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Joined</th>
                <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>
            <tbody>
              {(!profiles || profiles.length === 0) ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                    No contributors yet.
                  </td>
                </tr>
              ) : (
                profiles.map((p) => {
                  const metrics = contributorMetrics.get(p.user_id) || { count: 0, lastActivity: null };
                  
                  return (
                    <tr key={p.id} className="border-b border-border/40 last:border-0 hover:bg-muted/5 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-foreground">{p.preferred_name || p.name || 'Unknown'}</span>
                          <span className="text-[12px] text-muted-foreground">{p.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted/50 text-[12px] font-medium text-foreground">
                          {metrics.count}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground text-sm">
                        {metrics.lastActivity ? new Date(metrics.lastActivity).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-4 px-6 text-muted-foreground text-sm">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-sm text-[10px] font-mono uppercase tracking-widest ${
                          p.onboarding_status === 'COMPLETED' ? 'bg-green-500/10 text-green-600 dark:text-green-500' : 'bg-muted text-muted-foreground'
                        }`}>
                          {p.onboarding_status || 'PENDING'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link 
                          href={`/admin/contributors/${p.id}`}
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
