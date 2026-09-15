"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, FileText, Clock, CheckCircle2, MessageSquare } from "lucide-react";

// Types
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
  status: ContributionStatus | string; // Fallback for legacy DB strings
  admin_response: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  DRAFT: { label: "Draft", color: "text-muted-foreground", icon: FileText },
  SUBMITTED: { label: "Submitted", color: "text-foreground", icon: CheckCircle2 },
  "UNDER REVIEW": { label: "Under Review", color: "text-blue-500 dark:text-blue-400", icon: Clock },
  "NEEDS CHANGES": { label: "Needs Changes", color: "text-yellow-600 dark:text-yellow-500", icon: Clock },
  ACCEPTED: { label: "Accepted", color: "text-green-600 dark:text-green-500", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", color: "text-red-500", icon: CheckCircle2 },
};

const formatDate = (dateStr: string) => {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(dateStr));
};

function ContributionsContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const initialFilter = searchParams.get('filter') || "ALL";
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);

  useEffect(() => {
    async function loadData() {
      // The backend RLS policies MUST enforce that the user only fetches their own records.
      const { data, error } = await supabase
        .from('contributions')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (data && !error) {
        setContributions(data);
      }
      setIsLoading(false);
    }
    loadData();
  }, [supabase]);

  // Derived Stats
  const total = contributions.length;
  const underReview = contributions.filter(c => c.status === 'UNDER REVIEW').length;
  const needsChanges = contributions.filter(c => c.status === 'NEEDS CHANGES').length;
  const accepted = contributions.filter(c => c.status === 'ACCEPTED').length;
  const drafts = contributions.filter(c => c.status === 'DRAFT').length;

  // Filtering
  const filteredContributions = contributions.filter(c => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "PENDING" && ['SUBMITTED', 'UNDER REVIEW', 'NEEDS CHANGES'].includes(c.status)) return true;
    if (activeFilter === "REVIEWED" && ['ACCEPTED', 'REJECTED'].includes(c.status)) return true;
    if (activeFilter === "DRAFTS" && c.status === "DRAFT") return true;
    if (activeFilter === "SUBMITTED" && c.status === "SUBMITTED") return true;
    if (activeFilter === "UNDER REVIEW" && c.status === "UNDER REVIEW") return true;
    if (activeFilter === "NEEDS CHANGES" && c.status === "NEEDS CHANGES") return true;
    if (activeFilter === "ACCEPTED" && c.status === "ACCEPTED") return true;
    if (activeFilter === "REJECTED" && c.status === "REJECTED") return true;
    return false;
  });

  const FILTERS = ["ALL", "PENDING", "REVIEWED", "DRAFTS", "SUBMITTED", "UNDER REVIEW", "NEEDS CHANGES", "ACCEPTED", "REJECTED"];

  return (
    <div className="p-6 lg:p-12 max-w-5xl mx-auto w-full pb-32 animate-in fade-in duration-300">
      
      {/* Header & Primary CTA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex flex-col gap-3">
          <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground leading-none uppercase">
            My Contributions
          </h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            Track everything you&apos;ve shared with LR.
          </p>
        </div>
        <Link 
          href="/contributor/contribute" 
          className="w-full md:w-auto bg-foreground text-background px-6 h-12 rounded-sm text-[12px] font-semibold uppercase tracking-widest hover:bg-foreground/90 transition-all flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground"
        >
          + NEW CONTRIBUTION
        </Link>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        {[
          { label: "TOTAL", value: total },
          { label: "UNDER REVIEW", value: underReview },
          { label: "NEEDS CHANGES", value: needsChanges },
          { label: "ACCEPTED", value: accepted },
          { label: "DRAFTS", value: drafts },
        ].map((stat) => (
          <div key={stat.label} className="border border-border/40 bg-muted/5 p-5 flex flex-col gap-1 rounded-sm">
            <span className="text-2xl font-medium text-foreground">{isLoading ? "-" : stat.value}</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-6 mb-8 border-b border-border/40 pb-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`pb-3 border-b-2 transition-colors text-[11px] font-semibold uppercase tracking-widest ${
              activeFilter === f 
                ? "border-foreground text-foreground" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div>
        {isLoading ? (
          <div className="flex flex-col gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 border border-border/40 bg-muted/5 rounded-sm w-full" />
            ))}
          </div>
        ) : filteredContributions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 border border-border/40 bg-muted/5 rounded-sm gap-5">
            <div className="flex flex-col gap-2">
              <h3 className="text-[15px] font-medium text-foreground uppercase tracking-widest">No Contributions Yet</h3>
              <p className="text-[14px] text-muted-foreground max-w-sm mx-auto">
                {activeFilter === "ALL" 
                  ? "You haven't shared anything with LR yet. Have an experience, observation, idea, question, or piece of research worth sharing?" 
                  : `You have no contributions matching '${activeFilter}'.`}
              </p>
            </div>
            {activeFilter === "ALL" && (
              <Link 
                href="/contributor/contribute" 
                className="text-[12px] font-semibold uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors mt-2"
              >
                + MAKE YOUR FIRST CONTRIBUTION →
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredContributions.map((c) => {
              const statusMeta = STATUS_MAP[c.status] || STATUS_MAP.SUBMITTED;
              const excerpt = c.content?.length > 120 ? c.content.substring(0, 120) + "..." : c.content;
              const displayId = c.display_id || `LR-C-${c.id.substring(0, 8).toUpperCase()}`;

              return (
                <Link 
                  key={c.id} 
                  href={`/contributor/contributions/${c.id}`} 
                  className="group flex flex-col gap-4 border border-border/40 bg-background p-6 rounded-sm hover:border-foreground/30 hover:bg-muted/5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    
                    {/* Left Meta */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          {displayId}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          {c.type}
                        </span>
                      </div>
                      <h3 className="text-[18px] font-medium tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {c.title || "Untitled Contribution"}
                      </h3>
                      {c.content && (
                        <p className="text-[14px] text-muted-foreground line-clamp-2 mt-1 max-w-3xl">
                          {excerpt}
                        </p>
                      )}
                    </div>

                    {/* Right Meta (Status & Dates) */}
                    <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                      <div className={`flex items-center gap-2 ${statusMeta.color}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
                        <span className="font-mono text-[10px] uppercase tracking-widest font-medium">
                          {statusMeta.label}
                        </span>
                      </div>
                      <div className="flex flex-col items-start md:items-end text-[11px] text-muted-foreground font-mono uppercase tracking-widest gap-1">
                        <span>Updated {formatDate(c.updated_at)}</span>
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-2 flex items-center gap-1">
                        VIEW <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContributionsListPage() {
  return (
    <Suspense fallback={<div className="p-12 animate-pulse"><div className="h-10 w-48 bg-muted/20 mb-8 rounded-sm"/><div className="h-32 bg-muted/10 rounded-sm"/></div>}>
      <ContributionsContent />
    </Suspense>
  );
}