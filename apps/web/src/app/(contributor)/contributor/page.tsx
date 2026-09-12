/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ContributorOverview() {
  const supabase = createClient();
  const [contributions, setContributions] = useState<any[]>([]);
  const [counts, setCounts] = useState({ PENDING: 0, SUBMITTED: 0, REVIEWED: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase
        .from('contributions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setContributions(data);
        const newCounts = { PENDING: 0, SUBMITTED: 0, REVIEWED: 0 };
        data.forEach((c) => {
          if (c.status === "DRAFT" || c.status === "PENDING") newCounts.PENDING++;
          else if (c.status === "SUBMITTED" || c.status === "RECEIVED" || c.status === "UNDER REVIEW") newCounts.SUBMITTED++;
          else if (c.status === "REVIEWED") newCounts.REVIEWED++;
        });
        setCounts(newCounts);
      }
      setIsLoading(false);
    }
    loadData();
  }, [supabase]);

  return (
    <div className="p-6 lg:p-12 max-w-5xl">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-8 uppercase tracking-tight">
          WELCOME BACK.
        </h1>
        
        <Link 
          href="/contributor/contribute"
          className="group w-fit flex items-center justify-center gap-3 text-[13px] font-medium uppercase tracking-[0.15em] text-background bg-foreground px-8 py-4 rounded-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4"
        >
          + NEW CONTRIBUTION
        </Link>
      </div>

      <div className="mt-20">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground mb-8">
          MY CONTRIBUTIONS
        </h3>

        {isLoading ? (
          <div className="animate-pulse text-muted-foreground font-mono text-[11px] uppercase tracking-[0.1em]">Loading...</div>
        ) : (
          <div className="flex flex-col gap-12">
            <div className="grid grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">PENDING</span>
                <span className="text-3xl font-medium text-foreground">{counts.PENDING}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">SUBMITTED</span>
                <span className="text-3xl font-medium text-foreground">{counts.SUBMITTED}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">REVIEWED</span>
                <span className="text-3xl font-medium text-foreground">{counts.REVIEWED}</span>
              </div>
            </div>

            {contributions.length === 0 ? (
              <div className="flex flex-col gap-4 border-t border-border/40 pt-8">
                <p className="text-foreground text-lg">Your contributions will appear here.</p>
                <p className="text-muted-foreground">You have not submitted anything to LR yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-8 border-t border-border/40 pt-8">
                {contributions.map((c) => (
                  <Link key={c.id} href={`/contributor/contributions/${c.id}`} className="group flex flex-col gap-3">
                    <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.15em]">
                      <span className="text-foreground">{c.display_id || `LR-C-${c.id.substring(0, 8).toUpperCase()}`}</span>
                      <span className={c.status === "SUBMITTED" || c.status === "UNDER REVIEW" ? "text-primary" : "text-muted-foreground"}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                      {c.title}
                    </p>
                    <p className="text-muted-foreground/60 text-xs font-mono tracking-widest mt-1">
                      Submitted · {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <div className="border-b border-border/40 pt-4" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

