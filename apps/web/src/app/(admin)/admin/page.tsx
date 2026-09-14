import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { ListChecks, Users, Clock, CheckCircle } from "lucide-react";
import { AdminServiceRoleNotice } from "@/components/admin/AdminServiceRoleNotice";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
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

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h2 className="text-[14px] font-semibold uppercase tracking-widest text-foreground">Recent Activity</h2>
          <RecentActivityFeed />
        </div>
        
        <div className="flex flex-col gap-6">
          <h2 className="text-[14px] font-semibold uppercase tracking-widest text-foreground">Action Required</h2>
          <div className="bg-surface border border-border/40 p-6 rounded-sm">
            <PendingReviewsPreview />
            <Link 
              href="/admin/review" 
              className="mt-6 block text-center text-[11px] font-semibold uppercase tracking-widest text-background bg-foreground px-4 py-3 rounded-sm transition-all hover:bg-foreground/90"
            >
              Open Review Queue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

async function StatsCards() {
  const supabase = await createAdminClient();
  
  const [
    { count: reviewCount },
    { count: approvedCount },
    { count: usersCount }
  ] = await Promise.all([
    supabase.from('contributions').select('id', { count: 'exact', head: true }).in('status', ['SUBMITTED', 'IN_REVIEW']),
    supabase.from('contributions').select('id', { count: 'exact', head: true }).eq('status', 'APPROVED'),
    supabase.from('contributor_profiles').select('id', { count: 'exact', head: true })
  ]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-surface border border-border/40 p-6 rounded-sm flex flex-col gap-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <ListChecks size={18} />
          <span className="text-[11px] font-semibold uppercase tracking-widest">Needs Review</span>
        </div>
        <span className="text-3xl font-medium text-foreground">{reviewCount || 0}</span>
      </div>
      
      <div className="bg-surface border border-border/40 p-6 rounded-sm flex flex-col gap-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Clock size={18} />
          <span className="text-[11px] font-semibold uppercase tracking-widest">In Review</span>
        </div>
        <span className="text-3xl font-medium text-foreground">0</span>
      </div>
      
      <div className="bg-surface border border-border/40 p-6 rounded-sm flex flex-col gap-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <CheckCircle size={18} />
          <span className="text-[11px] font-semibold uppercase tracking-widest">Approved</span>
        </div>
        <span className="text-3xl font-medium text-foreground">{approvedCount || 0}</span>
      </div>
      
      <div className="bg-surface border border-border/40 p-6 rounded-sm flex flex-col gap-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Users size={18} />
          <span className="text-[11px] font-semibold uppercase tracking-widest">Contributors</span>
        </div>
        <span className="text-3xl font-medium text-foreground">{usersCount || 0}</span>
      </div>
    </div>
  );
}

async function RecentActivityFeed() {
  const supabase = await createAdminClient();
  const { data: contributions } = await supabase
    .from('contributions')
    .select('id, title, type, status, updated_at, user_id')
    .order('updated_at', { ascending: false })
    .limit(5);

  if (!contributions || contributions.length === 0) {
    return <div className="text-sm text-muted-foreground bg-surface border border-border/40 p-8 text-center rounded-sm">No recent activity.</div>;
  }

  const userIds = [...new Set(contributions.map(c => c.user_id))];
  const { data: profiles } = await supabase
    .from('contributor_profiles')
    .select('user_id, name, preferred_name')
    .in('user_id', userIds);

  const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));

  return (
    <div className="flex flex-col gap-4">
      {contributions.map((c) => {
        const profile = profileMap.get(c.user_id);
        const displayName = profile?.preferred_name || profile?.name || 'A contributor';
        return (
          <div key={c.id} className="bg-surface border border-border/40 p-5 rounded-sm flex items-start gap-4">
            <div className="mt-1 w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-foreground">
                {displayName} updated &quot;{c.title}&quot;
              </span>
              <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                <span>{c.type}</span>
                <span>•</span>
                <span>{c.status}</span>
                <span>•</span>
                <span>{new Date(c.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

async function PendingReviewsPreview() {
  const supabase = await createAdminClient();
  const { data: contributions } = await supabase
    .from('contributions')
    .select('id, title, type, created_at')
    .in('status', ['SUBMITTED', 'IN_REVIEW'])
    .order('created_at', { ascending: true })
    .limit(3);

  if (!contributions || contributions.length === 0) {
    return <div className="text-sm text-muted-foreground text-center py-4">Queue is empty.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {contributions.map((c) => (
        <div key={c.id} className="flex flex-col gap-1 pb-4 border-b border-border/40 last:border-0 last:pb-0">
          <span className="text-[13px] font-medium text-foreground truncate">{c.title}</span>
          <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">{c.type}</span>
        </div>
      ))}
    </div>
  );
}
