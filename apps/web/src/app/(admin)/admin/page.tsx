import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { ListChecks, Users, CheckCircle, Activity, UserPlus, AlertCircle, Inbox } from "lucide-react";
import { AdminServiceRoleNotice } from "@/components/admin/AdminServiceRoleNotice";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createAdminClient();
  
  // 30 days ago date
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString();

  // Parallel fetches for Dashboard
  const [
    { count: totalContributors },
    { count: newContributors },
    { count: totalContributions },
    { count: pendingReviews },
    { count: reviewedContributions },
    { data: activeProfiles },
    { data: recentActivity }
  ] = await Promise.all([
    // Total Contributors
    supabase.from('contributor_profiles').select('id', { count: 'exact', head: true }),
    
    // New Contributors (last 30 days)
    supabase.from('contributor_profiles').select('id', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgoStr),
    
    // Contributions Received
    supabase.from('contributions').select('id', { count: 'exact', head: true }),
    
    // Pending Reviews
    supabase.from('contributions').select('id', { count: 'exact', head: true }).in('status', ['SUBMITTED', 'UNDER REVIEW']),
    
    // Reviewed Contributions
    supabase.from('contributions').select('id', { count: 'exact', head: true }).in('status', ['ACCEPTED', 'REJECTED']),

    // Active Contributors (submitted something in last 30 days)
    supabase.from('contributions').select('user_id').gte('created_at', thirtyDaysAgoStr),
    
    // Recent Activity Feed
    supabase.from('contributions')
      .select('id, title, type, status, updated_at, user_id')
      .order('updated_at', { ascending: false })
      .limit(6)
  ]);

  // Calculate unique active contributors based on recent submissions
  const activeContributorsCount = activeProfiles ? new Set(activeProfiles.map(p => p.user_id)).size : 0;

  // Enhance recent activity with profile info
  let enrichedActivity = recentActivity || [];
  if (enrichedActivity.length > 0) {
    const userIds = [...new Set(enrichedActivity.map(c => c.user_id))];
    const { data: profiles } = await supabase
      .from('contributor_profiles')
      .select('user_id, name, preferred_name')
      .in('user_id', userIds);
    
    const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));
    
    enrichedActivity = enrichedActivity.map(c => {
      const profile = profileMap.get(c.user_id);
      return {
        ...c,
        displayName: profile?.preferred_name || profile?.name || 'A contributor'
      };
    });
  }

  // Contributions needing action (same as pending for now)
  const needingActionCount = pendingReviews || 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 lg:py-12 animate-in fade-in duration-300">
      <div className="flex flex-col gap-5 mb-12">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground leading-none uppercase">
          Command Center
        </h1>
        <p className="text-[17px] text-muted-foreground leading-relaxed">
          Overview of platform activity and review queue.
        </p>
      </div>

      <AdminServiceRoleNotice />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        
        {/* Contributor Stats */}
        <Link href="/admin/contributors" className="bg-surface border border-border/40 p-6 rounded-sm flex flex-col gap-4 hover:border-foreground/30 transition-colors">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Users size={18} />
            <span className="text-[11px] font-semibold uppercase tracking-widest">Total Contributors</span>
          </div>
          <span className="text-3xl font-medium text-foreground">{totalContributors || 0}</span>
        </Link>

        <Link href="/admin/contributors" className="bg-surface border border-border/40 p-6 rounded-sm flex flex-col gap-4 hover:border-foreground/30 transition-colors">
          <div className="flex items-center gap-3 text-muted-foreground">
            <UserPlus size={18} />
            <span className="text-[11px] font-semibold uppercase tracking-widest">New (30d)</span>
          </div>
          <span className="text-3xl font-medium text-foreground">{newContributors || 0}</span>
        </Link>

        <Link href="/admin/contributors" className="bg-surface border border-border/40 p-6 rounded-sm flex flex-col gap-4 hover:border-foreground/30 transition-colors">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Activity size={18} />
            <span className="text-[11px] font-semibold uppercase tracking-widest">Active (30d)</span>
          </div>
          <span className="text-3xl font-medium text-foreground">{activeContributorsCount}</span>
        </Link>

        {/* Contribution Stats */}
        <Link href="/admin/contributions" className="bg-surface border border-border/40 p-6 rounded-sm flex flex-col gap-4 hover:border-foreground/30 transition-colors">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Inbox size={18} />
            <span className="text-[11px] font-semibold uppercase tracking-widest">Received</span>
          </div>
          <span className="text-3xl font-medium text-foreground">{totalContributions || 0}</span>
        </Link>

        <Link href="/admin/contributions?status=pending" className="bg-surface border border-border/40 p-6 rounded-sm flex flex-col gap-4 hover:border-foreground/30 transition-colors">
          <div className="flex items-center gap-3 text-muted-foreground">
            <ListChecks size={18} />
            <span className="text-[11px] font-semibold uppercase tracking-widest">Pending Reviews</span>
          </div>
          <span className="text-3xl font-medium text-foreground">{pendingReviews || 0}</span>
        </Link>

        <Link href="/admin/contributions?status=reviewed" className="bg-surface border border-border/40 p-6 rounded-sm flex flex-col gap-4 hover:border-foreground/30 transition-colors">
          <div className="flex items-center gap-3 text-muted-foreground">
            <CheckCircle size={18} />
            <span className="text-[11px] font-semibold uppercase tracking-widest">Reviewed</span>
          </div>
          <span className="text-3xl font-medium text-foreground">{reviewedContributions || 0}</span>
        </Link>
        
        <Link href="/admin/review" className="bg-foreground text-background border border-foreground p-6 rounded-sm flex flex-col gap-4 hover:bg-foreground/90 transition-colors md:col-span-2 lg:col-span-2">
          <div className="flex items-center gap-3 text-background/80">
            <AlertCircle size={18} />
            <span className="text-[11px] font-semibold uppercase tracking-widest">Needs Action</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-medium">{needingActionCount}</span>
            <span className="text-[12px] font-semibold uppercase tracking-widest flex items-center gap-2">
              Open Review Queue →
            </span>
          </div>
        </Link>
      </div>

      <div className="mt-12 flex flex-col gap-6">
        <h2 className="text-[14px] font-semibold uppercase tracking-widest text-foreground">Recent Activity</h2>
        
        <div className="bg-surface border border-border/40 rounded-sm overflow-hidden">
          {enrichedActivity.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No recent activity found.
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {enrichedActivity.map((activity: any) => (
                <div key={activity.id} className="p-5 flex items-start gap-4 hover:bg-muted/5 transition-colors">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-foreground/40 shrink-0" />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[14px] font-medium text-foreground">
                      {activity.displayName} updated &quot;{activity.title}&quot;
                    </span>
                    <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                      <span className="bg-muted px-2 py-0.5 rounded-sm text-foreground">{activity.status}</span>
                      <span>{activity.type === 'APPLICATION' ? 'APPLICATION' : 'CONTRIBUTION'}</span>
                      <span>•</span>
                      <span>{new Date(activity.updated_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <Link href={`/admin/contributions/${activity.id}`} className="ml-auto text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground">
                    View →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
