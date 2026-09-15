import { createAdminClient } from "@/lib/supabase/admin";
import { AdminServiceRoleNotice } from "@/components/admin/AdminServiceRoleNotice";
import Link from "next/link";
import { Search, Plus, Calendar } from "lucide-react";
import { CreateOpportunityForm } from "./CreateOpportunityForm";
import { OpportunityStatusToggle } from "./OpportunityStatusToggle";

export const dynamic = "force-dynamic";

export default async function AdminOpportunitiesPage({
  searchParams
}: {
  searchParams: { tab?: string }
}) {
  const supabase = await createAdminClient();
  const currentTab = searchParams.tab || 'posted';
  
  // Fetch participant interests
  const { data: interests } = await supabase
    .from('opportunities')
    .select('id, user_id, area, reason, experience, created_at')
    .order('created_at', { ascending: false });

  const userIds = [...new Set((interests || []).map(o => o.user_id))];
  const { data: profiles } = await supabase
    .from('contributor_profiles')
    .select('id, user_id, name, preferred_name, email, discovery_source, discovery_details, country')
    .in('user_id', userIds);
    
  const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));

  // Fetch posted opportunities
  const { data: postedOpps } = await supabase
    .from('available_opportunities')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 lg:py-12 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div className="flex flex-col gap-5">
          <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground leading-none uppercase">
            Opportunities
          </h1>
          <p className="text-[17px] text-muted-foreground leading-relaxed max-w-xl">
            Post new research opportunities and review participants who have expressed interest.
          </p>
        </div>
      </div>

      <AdminServiceRoleNotice />

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border/40 mb-8">
        <Link 
          href="/admin/opportunities?tab=posted"
          className={`pb-3 text-[11px] font-semibold uppercase tracking-widest border-b-2 transition-colors ${
            currentTab === 'posted' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          POSTED OPPORTUNITIES
        </Link>
        <Link 
          href="/admin/opportunities?tab=interests"
          className={`pb-3 text-[11px] font-semibold uppercase tracking-widest border-b-2 transition-colors ${
            currentTab === 'interests' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          PARTICIPANT INTERESTS
        </Link>
      </div>

      {currentTab === 'posted' && (
        <div className="flex flex-col gap-8">
          <div className="bg-surface border border-border/40 p-6 rounded-sm mb-4">
            <h2 className="text-[14px] font-medium text-foreground mb-4">Post New Opportunity</h2>
            <CreateOpportunityForm />
          </div>

          <div className="bg-surface border border-border/40 rounded-sm">
            <div className="p-4 border-b border-border/40 flex items-center justify-between bg-muted/5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                ALL POSTED OPPORTUNITIES
              </span>
              <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                {postedOpps?.length || 0} TOTAL
              </span>
            </div>
            
            <div className="divide-y divide-border/40">
              {(!postedOpps || postedOpps.length === 0) ? (
                <div className="p-12 text-center text-muted-foreground text-sm">
                  No opportunities posted yet.
                </div>
              ) : (
                postedOpps.map((opp) => (
                  <div key={opp.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-widest ${opp.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-600 dark:text-green-500' : 'bg-muted text-muted-foreground'}`}>
                          {opp.status}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                          {opp.type}
                        </span>
                      </div>
                      <h3 className="text-[16px] font-medium text-foreground">{opp.title}</h3>
                      <p className="text-[14px] text-muted-foreground max-w-2xl">{opp.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-[12px] text-muted-foreground flex items-center gap-1.5 mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(opp.created_at).toLocaleDateString()}
                      </span>
                      <OpportunityStatusToggle id={opp.id} initialStatus={opp.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {currentTab === 'interests' && (
        <div className="bg-surface border border-border/40 rounded-sm">
          <div className="p-4 border-b border-border/40 flex items-center justify-between">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search interests..." 
                className="w-full pl-9 pr-4 py-2 bg-background border border-border/60 rounded-sm text-sm focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
              {interests?.length || 0} TOTAL
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 bg-muted/10">
                  <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest min-w-[200px]">Contributor</th>
                  <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Area of Interest</th>
                  <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Discovery / Location</th>
                  <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Date</th>
                  <th className="py-4 px-6"></th>
                </tr>
              </thead>
              <tbody>
                {(!interests || interests.length === 0) ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground text-sm">
                      No interests expressed yet.
                    </td>
                  </tr>
                ) : (
                  interests.map((opp) => {
                    const profile = profileMap.get(opp.user_id);
                    const displayName = profile?.preferred_name || profile?.name || 'Unknown';
                    const discoveryText = [profile?.discovery_source, profile?.country].filter(Boolean).join(" • ");

                    return (
                      <tr key={opp.id} className="border-b border-border/40 last:border-0 hover:bg-muted/5 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-foreground">{displayName}</span>
                            <span className="text-[12px] text-muted-foreground">{profile?.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2 py-1 rounded-sm text-[10px] font-mono uppercase tracking-widest bg-muted text-foreground">
                            {opp.area}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground text-[13px]">
                          {discoveryText || '—'}
                        </td>
                        <td className="py-4 px-6 text-muted-foreground text-[13px]">
                          {new Date(opp.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link 
                            href={`/admin/opportunities/${opp.id}`}
                            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-background bg-foreground px-4 py-2 rounded-sm hover:bg-foreground/90 transition-colors"
                          >
                            VIEW
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
      )}
    </div>
  );
}
