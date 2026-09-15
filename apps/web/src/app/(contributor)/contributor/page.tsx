"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Clock, CheckCircle2, MessageSquare, AlertTriangle, FileText, Search } from "lucide-react";

export type ContributionStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER REVIEW' | 'NEEDS CHANGES' | 'ACCEPTED' | 'REJECTED';

export interface Contribution {
  id: string;
  display_id: string;
  type: string;
  title: string;
  content: string;
  status: ContributionStatus;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  DRAFT: { label: "Draft", color: "text-muted-foreground", icon: FileText },
  SUBMITTED: { label: "Submitted", color: "text-foreground", icon: CheckCircle2 },
  "UNDER REVIEW": { label: "Under Review", color: "text-blue-500 dark:text-blue-400", icon: Clock },
  "NEEDS CHANGES": { label: "Needs Changes", color: "text-yellow-600 dark:text-yellow-500", icon: AlertTriangle },
  ACCEPTED: { label: "Accepted", color: "text-green-600 dark:text-green-500", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", color: "text-red-500", icon: CheckCircle2 },
};

const formatDate = (dateStr: string) => {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(dateStr));
};

export default function ContributorDashboardPage() {
  const supabase = createClient();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [applications, setApplications] = useState<Contribution[]>([]);
  const [interestsCount, setInterestsCount] = useState(0);
  const [availableOppsCount, setAvailableOppsCount] = useState(0);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("Not authenticated");

        // Fetch contributions
        const { data: allData, error: fetchError } = await supabase
          .from('contributions')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
        
        if (fetchError) throw fetchError;
        
        const all = allData || [];
        setContributions(all.filter(c => c.type !== 'APPLICATION'));
        setApplications(all.filter(c => c.type === 'APPLICATION'));

        // Fetch interests count
        const { count: iCount, error: iError } = await supabase
          .from('opportunities') // which stores participant interests
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);
        if (!iError) setInterestsCount(iCount || 0);

        // Fetch available opportunities count
        const { count: oppCount, error: oppError } = await supabase
          .from('available_opportunities')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'OPEN');
        if (!oppError) setAvailableOppsCount(oppCount || 0);

      } catch (err: any) {
        setError(err.message || "Failed to load dashboard.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-12 max-w-5xl mx-auto w-full animate-pulse flex flex-col gap-12 pb-32">
        <div className="h-12 w-64 bg-muted/40 rounded-sm" />
        <div className="h-40 w-full bg-muted/20 border border-border/40 rounded-sm" />
        <div className="h-40 w-full bg-muted/20 border border-border/40 rounded-sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-12 max-w-3xl mx-auto w-full pb-32 animate-in fade-in duration-300">
        <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-sm flex flex-col gap-4 text-center items-center">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <h2 className="text-[14px] font-semibold uppercase tracking-widest text-foreground">Dashboard Could Not Be Loaded</h2>
          <p className="text-[14.5px] text-muted-foreground">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-2 text-[12px] font-semibold uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors border border-border/60 px-6 py-3 rounded-sm">
            TRY AGAIN
          </button>
        </div>
      </div>
    );
  }

  // Overview Stats for Contributions
  const total = contributions.length;
  const submitted = contributions.filter(c => c.status === 'SUBMITTED').length;
  const underReview = contributions.filter(c => c.status === 'UNDER REVIEW').length;
  const needsChanges = contributions.filter(c => c.status === 'NEEDS CHANGES').length;
  const accepted = contributions.filter(c => c.status === 'ACCEPTED').length;
  const rejected = contributions.filter(c => c.status === 'REJECTED').length;

  // Opportunity Stats
  const activeApps = applications.filter(a => ['SUBMITTED', 'UNDER REVIEW', 'NEEDS CHANGES'].includes(a.status)).length;

  // Encouragement Decision Logic
  let encouragement = { title: "Start contributing to LR.", desc: "Start your first contribution by exploring available opportunities.", cta: "Explore Opportunities", link: "/contributor/opportunities" };
  
  if (needsChanges > 0) {
    encouragement = { title: "Action Required", desc: "You have a contribution that needs your attention.", cta: "Review Changes", link: "/contributor/contributions" };
  } else if (accepted > 0) {
    encouragement = { title: "Great Work!", desc: "Your contribution was accepted. Explore another opportunity to continue contributing.", cta: "Explore Opportunities", link: "/contributor/opportunities" };
  } else if (underReview > 0) {
    encouragement = { title: "Under Review", desc: "Your contribution is currently under review. Explore another opportunity while you wait.", cta: "View Contribution", link: "/contributor/contributions" };
  } else if (submitted > 0) {
    encouragement = { title: "Received", desc: "Your contribution has been received and is awaiting review. You can explore other available opportunities while you wait.", cta: "View Contribution", link: "/contributor/contributions" };
  } else if (total > 0) {
    encouragement = { title: "Keep Building", desc: "You've already contributed to LR. Continue exploring opportunities that match your interests.", cta: "Explore Opportunities", link: "/contributor/opportunities" };
  }

  // Collect recent activity
  const allActivity = [...contributions, ...applications]
    .filter(item => item.status !== 'DRAFT')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 lg:p-12 max-w-5xl mx-auto w-full pb-32 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div className="flex flex-col gap-3">
          <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground leading-none uppercase">
            Contributor Workspace
          </h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            Manage your contributions, track applications, and explore LR opportunities.
          </p>
        </div>
        <Link 
          href="/contributor/opportunities" 
          className="w-full md:w-auto bg-foreground text-background px-6 h-12 rounded-sm text-[12px] font-semibold uppercase tracking-widest hover:bg-foreground/90 transition-all flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground"
        >
          EXPLORE OPPORTUNITIES
        </Link>
      </div>

      <div className="flex flex-col gap-16">
        
        {/* Dynamic Encouragement */}
        <div className="bg-surface border border-border/40 p-6 md:p-8 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-[15px] font-medium uppercase tracking-widest text-foreground">{encouragement.title}</h3>
            <p className="text-[14.5px] text-muted-foreground max-w-xl">{encouragement.desc}</p>
          </div>
          <Link href={encouragement.link} className="shrink-0 text-[11px] font-semibold uppercase tracking-widest text-foreground border border-border/60 px-6 py-3 rounded-sm hover:text-muted-foreground transition-colors flex items-center justify-center">
            {encouragement.cta}
          </Link>
        </div>

        {/* Overview Stats */}
        <section className="flex flex-col gap-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-3">
            OVERVIEW
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "TOTAL", value: total },
              { label: "SUBMITTED", value: submitted },
              { label: "UNDER REVIEW", value: underReview },
              { label: "NEEDS CHANGES", value: needsChanges },
              { label: "ACCEPTED", value: accepted },
              { label: "REJECTED", value: rejected },
            ].map((stat) => (
              <div key={stat.label} className="border border-border/40 bg-muted/5 p-5 flex flex-col gap-1 rounded-sm">
                <span className="text-2xl font-medium text-foreground">{stat.value}</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground leading-tight">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Opportunities Stats */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              OPPORTUNITIES
            </h2>
            <Link href="/contributor/opportunities" className="text-[10px] font-semibold uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors">
              VIEW ALL →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "AVAILABLE", value: availableOppsCount },
              { label: "APPLIED", value: applications.length },
              { label: "INTERESTED", value: interestsCount },
              { label: "ACTIVE", value: activeApps },
            ].map((stat) => (
              <div key={stat.label} className="border border-border/40 bg-muted/5 p-5 flex flex-col gap-1 rounded-sm">
                <span className="text-2xl font-medium text-foreground">{stat.value}</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="flex flex-col gap-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-3">
            RECENT ACTIVITY
          </h2>
          
          {allActivity.length === 0 ? (
            <div className="p-8 border border-border/40 bg-muted/5 rounded-sm text-center text-[14px] text-muted-foreground">
              Your recent activity will appear here.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {allActivity.map(act => {
                const isApp = act.type === 'APPLICATION';
                const actionLabel = act.status === 'ACCEPTED' ? 'was accepted' : act.status === 'REJECTED' ? 'was rejected' : act.status === 'NEEDS CHANGES' ? 'needs changes' : 'was updated';
                const prefix = isApp ? 'Application for' : 'Contribution';
                const idDisplay = act.display_id || `LR-C-${act.id.substring(0,8).toUpperCase()}`;

                return (
                  <div key={act.id} className="flex items-center gap-4 p-4 border border-border/40 bg-background rounded-sm hover:bg-muted/5 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center shrink-0">
                      {isApp ? <Search className="w-4 h-4 text-foreground" /> : <FileText className="w-4 h-4 text-foreground" />}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[14px] font-medium text-foreground">
                        {prefix} <span className="font-mono text-[12px] bg-muted/20 px-1 py-0.5 rounded-sm ml-1">{idDisplay}</span> {actionLabel}.
                      </span>
                      <span className="text-[12px] text-muted-foreground">{formatDate(act.updated_at)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}