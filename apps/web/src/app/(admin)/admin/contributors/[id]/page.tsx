import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Mail, Calendar, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ContributorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createAdminClient();

  const { data: profile } = await supabase
    .from('contributor_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (!profile) notFound();

  const { data: contributions } = await supabase
    .from('contributions')
    .select('*')
    .eq('user_id', profile.user_id)
    .order('created_at', { ascending: false });

  const stats = {
    total: contributions?.length || 0,
    approved: contributions?.filter(c => c.status === 'APPROVED').length || 0,
    inReview: contributions?.filter(c => c.status === 'IN_REVIEW' || c.status === 'SUBMITTED').length || 0,
    needsChanges: contributions?.filter(c => c.status === 'NEEDS_CHANGES').length || 0,
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 lg:py-12 animate-in fade-in duration-300">
      <Link href="/admin/contributors" className="inline-flex items-center gap-2 text-[11px] font-mono text-muted-foreground hover:text-foreground uppercase tracking-widest mb-8 transition-colors">
        <ArrowLeft className="w-3 h-3" /> Back to Contributors
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Info */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface border border-border/40 p-6 rounded-sm flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-medium text-foreground">{profile.preferred_name || profile.name || 'Unknown'}</h1>
              <span className="text-sm text-muted-foreground">{profile.primary_role || 'Contributor'}</span>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 shrink-0" />
                <a href={`mailto:${profile.email}`} className="hover:text-foreground hover:underline truncate">{profile.email}</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <User className="w-4 h-4 shrink-0" />
                <span>Status: <span className="text-foreground">{profile.onboarding_status}</span></span>
              </div>
            </div>
            
            <div className="h-[1px] w-full bg-border/40" />
            
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              {profile.country && <div className="flex justify-between"><span>Country</span><span className="text-foreground">{profile.country}</span></div>}
              {profile.language && <div className="flex justify-between"><span>Language</span><span className="text-foreground">{profile.language}</span></div>}
              {profile.field && <div className="flex justify-between"><span>Field</span><span className="text-foreground">{profile.field}</span></div>}
              {profile.experience_level && <div className="flex justify-between"><span>Experience Level</span><span className="text-foreground">{profile.experience_level}</span></div>}
            </div>
          </div>
        </div>

        {/* Right Column: Contributions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface border border-border/40 p-4 rounded-sm flex flex-col gap-2 text-center">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Total</span>
              <span className="text-2xl font-medium text-foreground">{stats.total}</span>
            </div>
            <div className="bg-surface border border-border/40 p-4 rounded-sm flex flex-col gap-2 text-center">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Approved</span>
              <span className="text-2xl font-medium text-green-500">{stats.approved}</span>
            </div>
            <div className="bg-surface border border-border/40 p-4 rounded-sm flex flex-col gap-2 text-center">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">In Review</span>
              <span className="text-2xl font-medium text-foreground">{stats.inReview}</span>
            </div>
            <div className="bg-surface border border-border/40 p-4 rounded-sm flex flex-col gap-2 text-center">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Needs Changes</span>
              <span className="text-2xl font-medium text-yellow-500">{stats.needsChanges}</span>
            </div>
          </div>

          <h2 className="text-[14px] font-semibold uppercase tracking-widest text-foreground mt-4">Contribution History</h2>
          
          <div className="bg-surface border border-border/40 rounded-sm overflow-hidden flex flex-col">
            {(!contributions || contributions.length === 0) ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No contributions found.</div>
            ) : (
              contributions.map((c) => (
                <Link 
                  key={c.id} 
                  href={`/admin/contributions/${c.id}`}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-border/40 last:border-0 hover:bg-muted/10 transition-colors gap-4"
                >
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <span className="text-sm font-medium text-foreground truncate">{c.title}</span>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                      <span>{c.type}</span>
                      <span>•</span>
                      <span>{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 md:w-32 md:shrink-0 justify-between md:justify-end">
                    <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-sm ${
                      c.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' :
                      c.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                      c.status === 'NEEDS_CHANGES' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {c.status}
                    </span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
