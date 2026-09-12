/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ContributionsListPage() {
  const supabase = createClient();
  const [contributions, setContributions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase
        .from('contributions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setContributions(data);
      setIsLoading(false);
    }
    loadData();
  }, [supabase]);

  return (
    <div className="p-6 lg:p-12 max-w-5xl">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-4">
          My Contributions
        </h1>
      </div>

      <div>
        {isLoading ? (
          <div className="animate-pulse text-muted-foreground font-mono text-[11px] uppercase tracking-[0.1em]">Loading...</div>
        ) : contributions.length === 0 ? (
          <div className="flex flex-col gap-4">
            <p className="text-foreground text-lg">Your contributions will appear here.</p>
            <p className="text-muted-foreground">You have not submitted anything to LR yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {contributions.map((c) => (
              <Link key={c.id} href={`/contributor/contributions/${c.id}`} className="group flex flex-col gap-4">
                <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.15em]">
                  <span className="text-foreground">{c.display_id || `LR-C-${c.id.substring(0, 8).toUpperCase()}`}</span>
                  <span className={c.status === "SUBMITTED" || c.status === "UNDER REVIEW" ? "text-primary" : "text-muted-foreground"}>
                    {c.status}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-foreground text-lg group-hover:text-muted-foreground transition-colors">
                    {c.title}
                  </p>
                  <p className="text-muted-foreground text-sm font-mono uppercase tracking-[0.1em]">
                    {c.type} • {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="border-b border-border/40 pt-4" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

