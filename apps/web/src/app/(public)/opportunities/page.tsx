import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Reveal } from "../contribute/Reveal";

export const dynamic = "force-dynamic";

export default async function PublicOpportunitiesPage() {
  const supabase = await createClient();

  const { data: opportunities, error } = await supabase
    .from('available_opportunities')
    .select('*')
    .eq('status', 'PUBLISHED')
    .order('created_at', { ascending: false });

  return (
    <div className="flex w-full flex-col bg-background selection:bg-foreground selection:text-background min-h-screen">
      
      {/* HEADER */}
      <section className="relative flex flex-col justify-center pt-32 pb-24 border-b border-border/40">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal delay={0}>
            <div className="mb-16 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="text-foreground">LR / OPPORTUNITIES</span>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <h1 className="mb-8 max-w-4xl text-4xl md:text-6xl font-medium leading-[1.1] tracking-tight text-foreground">
              Active Research Opportunities
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground mb-12">
              LR publishes targeted requests for specific types of experiences, evidence, or research. Contributing to an active opportunity directly supports ongoing investigations.
            </p>
          </Reveal>
        </div>
      </section>

      {/* OPPORTUNITIES LIST */}
      <section className="py-24 border-b border-border/40 min-h-[50vh]">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="flex flex-col gap-6">
              {error ? (
                <div className="p-8 border border-red-500/20 bg-red-500/5 text-red-500 rounded-sm">
                  Failed to load opportunities.
                </div>
              ) : opportunities?.length === 0 ? (
                <div className="p-12 border border-border/40 bg-muted/5 rounded-sm flex flex-col items-center justify-center text-center gap-4">
                  <h3 className="text-xl font-medium text-foreground">No active opportunities</h3>
                  <p className="text-muted-foreground max-w-md">
                    There are currently no active public opportunities. However, you can still submit general contributions at any time.
                  </p>
                  <Link 
                    href="/contribute/signup?next=/contributor/contribute"
                    className="mt-4 text-[12px] font-medium uppercase tracking-[0.15em] text-foreground hover:text-muted-foreground transition-colors border border-border/60 px-6 py-3 rounded-sm"
                  >
                    MAKE A GENERAL CONTRIBUTION
                  </Link>
                </div>
              ) : (
                opportunities?.map((opp) => (
                  <div key={opp.id} className="group flex flex-col md:flex-row md:items-start justify-between gap-8 p-8 md:p-10 border border-border/40 bg-background hover:bg-muted/5 transition-all duration-300 rounded-sm">
                    <div className="flex flex-col gap-4 max-w-3xl">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground bg-muted/10 px-2 py-1 rounded-sm border border-border/40">
                          {opp.type}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {opp.title}
                      </h3>
                      <p className="text-[16px] text-muted-foreground leading-relaxed line-clamp-3">
                        {opp.description}
                      </p>
                    </div>
                    
                    <div className="shrink-0 flex items-center md:items-start">
                      <Link 
                        href={`/contribute/signup?next=/contributor/opportunities/${opp.id}`}
                        className="bg-foreground text-background px-6 py-3 rounded-sm text-[11px] font-semibold uppercase tracking-widest hover:bg-foreground/90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground whitespace-nowrap"
                      >
                        VIEW & APPLY
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-24">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10 text-center flex flex-col items-center gap-8">
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">
            Have a different experience?
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl">
            You don't need an active opportunity to contribute. LR accepts general submissions at any time.
          </p>
          <Link 
            href="/contribute/signup?next=/contributor/contribute"
            className="text-[13px] font-medium uppercase tracking-[0.15em] text-foreground hover:text-muted-foreground transition-colors"
          >
            BECOME A CONTRIBUTOR →
          </Link>
        </div>
      </section>
    </div>
  );
}
