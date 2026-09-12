"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Clock, CheckCircle2, MessageSquare, AlertTriangle, FileText } from "lucide-react";

export type ContributionStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'NEEDS_INFORMATION' 
  | 'REVIEWED' 
  | 'RESPONSE_AVAILABLE';

export interface Contribution {
  id: string;
  display_id: string;
  type: string;
  title: string;
  content: string;
  status: ContributionStatus | string;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  DRAFT: { label: "Draft", color: "text-muted-foreground", icon: FileText },
  SUBMITTED: { label: "Submitted", color: "text-foreground", icon: CheckCircle2 },
  UNDER_REVIEW: { label: "Under Review", color: "text-blue-500 dark:text-blue-400", icon: Clock },
  "UNDER REVIEW": { label: "Under Review", color: "text-blue-500 dark:text-blue-400", icon: Clock },
  NEEDS_INFORMATION: { label: "Action Required", color: "text-yellow-600 dark:text-yellow-500", icon: AlertTriangle },
  REVIEWED: { label: "Reviewed", color: "text-green-600 dark:text-green-500", icon: CheckCircle2 },
  RESPONSE_AVAILABLE: { label: "Response Available", color: "text-primary", icon: MessageSquare },
};

const formatDate = (dateStr: string) => {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(dateStr));
};

export default function ContributorWorkspacePage() {
  const supabase = createClient();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("Not authenticated");

        const { data, error: fetchError } = await supabase
          .from('contributions')
          .select('*')
          .eq('user_id', user.id) // Enforce ownership client-side in addition to RLS
          .order('updated_at', { ascending: false });
        
        if (fetchError) throw fetchError;
        setContributions(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load contributions.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [supabase]);

  // Derived state groupings
  const drafts = contributions.filter(c => c.status === 'DRAFT');
  const submitted = contributions.filter(c => c.status !== 'DRAFT');
  
  const attentionRequired = contributions.filter(c => 
    c.status === 'NEEDS_INFORMATION' || c.status === 'RESPONSE_AVAILABLE'
  );

  const activeCount = submitted.filter(c => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW' || c.status === 'UNDER REVIEW').length;
  const underReviewCount = submitted.filter(c => c.status === 'UNDER_REVIEW' || c.status === 'UNDER REVIEW').length;
  const responseCount = submitted.filter(c => c.status === 'RESPONSE_AVAILABLE').length;

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
          <h2 className="text-[14px] font-semibold uppercase tracking-widest text-foreground">Contributions Could Not Be Loaded</h2>
          <p className="text-[14.5px] text-muted-foreground">We couldn&apos;t retrieve your contribution activity. Please check your connection.</p>
          <button onClick={() => window.location.reload()} className="mt-2 text-[12px] font-semibold uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors border border-border/60 px-6 py-3 rounded-sm">
            TRY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-12 max-w-5xl mx-auto w-full pb-32 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div className="flex flex-col gap-3">
          <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground leading-none uppercase">
            Contributor Workspace
          </h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            Manage your contributions, track review progress, and participate in LR research.
          </p>
        </div>
        <Link 
          href="/contributor/contribute" 
          className="w-full md:w-auto bg-foreground text-background px-6 h-12 rounded-sm text-[12px] font-semibold uppercase tracking-widest hover:bg-foreground/90 transition-all flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground"
        >
          + NEW CONTRIBUTION
        </Link>
      </div>

      <div className="flex flex-col gap-16">
        
        {/* ATTENTION SECTION */}
        {(attentionRequired.length > 0 || drafts.length > 0) && (
          <section className="flex flex-col gap-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-3">
              ATTENTION
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Action/Response Needs */}
              {attentionRequired.map(c => {
                const isResponse = c.status === 'RESPONSE_AVAILABLE';
                return (
                  <Link key={c.id} href={`/contributor/contributions/${c.id}`} className={`p-6 border rounded-sm flex flex-col gap-4 transition-colors hover:bg-muted/5 ${isResponse ? 'border-primary/40 bg-primary/5' : 'border-yellow-500/40 bg-yellow-500/5'}`}>
                    <div className="flex flex-col gap-1">
                      <span className={`text-[11px] font-semibold uppercase tracking-widest ${isResponse ? 'text-primary' : 'text-yellow-600 dark:text-yellow-500'}`}>
                        {isResponse ? 'Response Available' : 'Action Required'}
                      </span>
                      <h3 className="text-[16px] font-medium text-foreground mt-1 line-clamp-1">{c.title || "Untitled Contribution"}</h3>
                      <p className="text-[13.5px] text-muted-foreground line-clamp-1 mt-1">
                        {isResponse ? 'LR has reviewed your contribution.' : 'LR requested additional context.'}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-foreground mt-2 flex items-center gap-1">
                      VIEW CONTRIBUTION <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                );
              })}

              {/* Drafts Summary */}
              {drafts.length > 0 && (
                <div className="p-6 border border-border/40 bg-muted/5 rounded-sm flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Draft In Progress
                    </span>
                    <h3 className="text-[16px] font-medium text-foreground mt-1 line-clamp-1">{drafts[0].title || "Untitled Draft"}</h3>
                    <p className="text-[13.5px] text-muted-foreground line-clamp-1 mt-1">
                      Last edited {formatDate(drafts[0].updated_at)}
                    </p>
                  </div>
                  <Link href={`/contributor/contribute/${drafts[0].type.toLowerCase()}`} className="text-[11px] font-semibold uppercase tracking-widest text-foreground mt-2 flex items-center gap-1 hover:text-muted-foreground transition-colors w-fit">
                    CONTINUE DRAFT <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ACTIVITY STATS */}
        <section className="flex flex-col gap-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-3">
            ACTIVITY
          </h2>
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-medium text-foreground">{activeCount.toString().padStart(2, '0')}</span>
              <span className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground leading-tight">Active</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-medium text-foreground">{underReviewCount.toString().padStart(2, '0')}</span>
              <span className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground leading-tight">Under<br/>Review</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-medium text-foreground">{responseCount.toString().padStart(2, '0')}</span>
              <span className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground leading-tight">Response<br/>Available</span>
            </div>
          </div>
        </section>

        {/* DRAFTS LIST */}
        {drafts.length > 1 && (
          <section className="flex flex-col gap-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-3">
              DRAFTS
            </h2>
            <div className="flex flex-col gap-4">
              {drafts.slice(1).map(draft => (
                <div key={draft.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border border-border/40 bg-background rounded-sm">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[16px] font-medium text-foreground">{draft.title || "Untitled Draft"}</h3>
                    <p className="text-[13px] text-muted-foreground">Last edited {formatDate(draft.updated_at)}</p>
                  </div>
                  <Link href={`/contributor/contribute/${draft.type.toLowerCase()}`} className="text-[11px] font-semibold uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors shrink-0">
                    CONTINUE →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTRIBUTIONS LIST */}
        <section className="flex flex-col gap-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-3">
            CONTRIBUTIONS
          </h2>
          
          {submitted.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-12 border border-border/40 bg-muted/5 rounded-sm gap-5">
              <div className="flex flex-col gap-2">
                <h3 className="text-[15px] font-medium text-foreground uppercase tracking-widest">No Contributions Yet</h3>
                <p className="text-[14px] text-muted-foreground max-w-sm mx-auto">
                  Your submitted contributions will appear here. Share a research observation, experience, or evidence with LR.
                </p>
              </div>
              <Link href="/contributor/contribute" className="text-[12px] font-semibold uppercase tracking-widest text-background bg-foreground px-6 h-12 rounded-sm flex items-center justify-center hover:bg-foreground/90 transition-colors mt-2">
                + MAKE YOUR FIRST CONTRIBUTION
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {submitted.map(c => {
                const statusMeta = STATUS_MAP[c.status] || STATUS_MAP.SUBMITTED;
                const displayId = c.display_id || `LR-C-${c.id.substring(0, 8).toUpperCase()}`;

                return (
                  <Link 
                    key={c.id} 
                    href={`/contributor/contributions/${c.id}`} 
                    className="group flex flex-col md:flex-row md:items-start justify-between gap-6 border border-border/40 bg-background p-6 md:p-8 rounded-sm hover:border-foreground/30 hover:bg-muted/5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] uppercase tracking-widest text-foreground font-medium">
                          {displayId}
                        </span>
                        <div className={`flex items-center gap-2 ${statusMeta.color}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
                          <span className="font-mono text-[10px] uppercase tracking-widest font-medium">
                            {statusMeta.label}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1 mt-1">
                        <h3 className="text-[18px] font-medium tracking-tight text-foreground group-hover:text-primary transition-colors">
                          {c.title || "Untitled Contribution"}
                        </h3>
                        <p className="text-[13.5px] text-muted-foreground font-mono uppercase tracking-widest mt-1">
                          {c.type}
                        </p>
                      </div>
                      
                      <p className="text-[13px] text-muted-foreground mt-2">
                        Submitted {formatDate(c.created_at)}
                      </p>
                    </div>

                    <div className="flex items-center md:items-start shrink-0">
                       <span className="text-[11px] font-semibold uppercase tracking-widest text-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 md:mt-1">
                        VIEW <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}