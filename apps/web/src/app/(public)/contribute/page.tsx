import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Reveal } from "./Reveal";

export const dynamic = "force-dynamic";

export default async function ContributePage() {
  const supabase = await createClient();

  // Use the new RPC to get accurate and secure public stats
  const { data: stats } = await supabase.rpc('get_public_stats');
  
  // Fetch published community responses securely
  const { data: dbResponses } = await supabase
    .from('community_feedback')
    .select(`
      id, response, attribution_preference, 
      contributor_profiles(name),
      research_areas(title)
    `)
    .eq('status', 'PUBLISHED')
    .order('published_at', { ascending: false })
    .limit(5);

  const communityResponses = dbResponses || [];

  // Fetch public researchers securely
  const { data: publicResearchers } = await supabase
    .from('contributor_profiles')
    .select('id, name, field')
    .eq('primary_role', 'Researcher')
    .eq('profile_visibility', 'Public');

  const displayContributors = stats?.contributors || 0;
  const displayContributions = stats?.contributions || 0;
  const displayAreas = stats?.research_areas || 0;

  return (
    <div className="flex w-full flex-col bg-background selection:bg-foreground selection:text-background min-h-screen">
      
      {/* HEADER */}
      <section className="relative flex min-h-[60vh] flex-col justify-center pt-32 pb-24 border-b border-border/40">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal delay={0}>
            <div className="mb-16 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="text-foreground">LR / CONTRIBUTE</span>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <h1 className="mb-12 max-w-5xl text-5xl md:text-7xl font-medium leading-[1.05] tracking-tight text-foreground">
              Your experience can become part of the research.
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl mb-12">
              Cybersecurity is experienced by everyone, not only by security professionals. If you have encountered an attack, observed suspicious behavior, studied a threat, or learned something worth sharing, your experience can help LR understand the broader security landscape.
            </p>
            <Link 
              href="/contribute/signup?next=/contributor/opportunities"
              className="group w-fit flex items-center gap-3 text-[14px] font-medium uppercase tracking-[0.15em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
            >
              <span className="relative">
                Get Started
                <span className="absolute -bottom-1 left-0 h-px w-full bg-foreground opacity-40 transition-opacity group-hover:opacity-100" />
              </span>
              <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 01 INVITATION */}
      <section className="border-b border-border/40 py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-8 md:gap-16">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">01 — Anyone Can Contribute</h2>
              <div className="flex flex-col gap-8">
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">
                  Share what you know.
                </h3>
                <div className="flex flex-col gap-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  <p>
                    Share a cybersecurity experience, observation, research, suspicious activity, or idea. LR reviews contributions and uses relevant information to strengthen its research.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 02 CATEGORIES */}
      <section className="border-b border-border/40 py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-8 md:gap-16">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">02 — What You Can Contribute</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
                {[
                  { name: "EXPERIENCE", desc: "Share a first-hand encounter with a digital threat or scam." },
                  { name: "OBSERVATION", desc: "Report suspicious behavior or anomalies you've noticed." },
                  { name: "RESEARCH", desc: "Submit your own analysis, findings, or literature review." },
                  { name: "EVIDENCE", desc: "Provide technical artifacts, logs, screenshots, or samples." },
                  { name: "IDEA", desc: "Propose a new approach, defense mechanism, or hypothesis." },
                  { name: "QUESTION", desc: "Highlight an unknown area that needs further investigation." },
                  { name: "PATTERN", desc: "Connect multiple events to identify a broader trend." },
                  { name: "OTHER", desc: "Anything else that contributes to our understanding of security." }
                ].map((cat) => (
                  <div key={cat.name} className="flex flex-col gap-3">
                    <h3 className="font-mono text-[13px] uppercase tracking-[0.15em] text-foreground">{cat.name}</h3>
                    <p className="text-muted-foreground leading-relaxed">{cat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 03 HOW IT WORKS */}
      <section className="border-b border-border/40 py-24 md:py-32 bg-muted/20">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-8 md:gap-16">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">03 — How Contributing Works</h2>
              <div className="flex flex-col gap-12">
                {[
                  { step: "01", title: "CREATE AN ACCOUNT", desc: "Join LR to submit and manage contributions." },
                  { step: "02", title: "SHARE", desc: "Tell us what you experienced, observed, or researched." },
                  { step: "03", title: "REVIEW", desc: "LR reviews the contribution for research relevance." },
                  { step: "04", title: "RESEARCH", desc: "Useful contributions can inform LR's research." }
                ].map((phase) => (
                  <div key={phase.step} className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                    <span className="font-mono text-[13px] uppercase tracking-[0.15em] text-foreground w-48 shrink-0">
                      {phase.step} &nbsp; {phase.title}
                    </span>
                    <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                      {phase.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 04 COMMUNITY */}
      <section className="border-b border-border/40 py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-8 md:gap-16">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">04 — A Growing Community</h2>
              <div className="flex flex-col gap-16">
                
                <div className="flex flex-col gap-8">
                  <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">
                    A growing research community
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground flex-wrap">
                    <div className="flex flex-col gap-3 border-l border-border/40 pl-4">
                      <span className="text-2xl font-medium text-foreground tracking-tight">{displayContributors}</span>
                      <span>Contributors</span>
                    </div>
                    {(stats?.researchers || 0) > 0 && (
                      <div className="flex flex-col gap-3 border-l border-border/40 pl-4">
                        <span className="text-2xl font-medium text-foreground tracking-tight">{stats.researchers}</span>
                        <span>Researchers</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-3 border-l border-border/40 pl-4">
                      <span className="text-2xl font-medium text-foreground tracking-tight">{displayContributions}</span>
                      <span>Contributions Received</span>
                    </div>
                    <div className="flex flex-col gap-3 border-l border-border/40 pl-4">
                      <span className="text-2xl font-medium text-foreground tracking-tight">{displayAreas}</span>
                      <span>Research Areas</span>
                    </div>
                  </div>

                  {/* Public Researchers List */}
                  {publicResearchers && publicResearchers.length > 0 && (
                    <div className="flex flex-col gap-4 mt-4">
                      <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Our Researchers</h3>
                      <div className="flex flex-wrap gap-4">
                        {publicResearchers.map((r: any) => (
                          <div key={r.id} className="flex items-center gap-3 bg-muted/10 px-4 py-2 border border-border/40 rounded-sm">
                            <span className="text-[13px] font-medium text-foreground">{r.name}</span>
                            {r.field && <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">— {r.field}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(stats?.published_responses || 0) > 0 && (
                    <div className="flex flex-col gap-3 border-l border-border/40 pl-4">
                      <span className="text-2xl font-medium text-foreground tracking-tight">{stats.published_responses}</span>
                      <span>Community Responses</span>
                    </div>
                  )}
                  <p className="text-muted-foreground text-sm italic mt-2">
                    LR is growing through the experiences, observations, and perspectives shared by its contributors.
                  </p>
                </div>

                <div className="flex flex-col gap-6 border-t border-border/40 pt-16">
                  <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">
                    From the community
                  </h3>
                  
                  {communityResponses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 mt-4">
                      {communityResponses.map((r) => (
                        <div key={r.id} className="p-8 border border-border/40 bg-muted/5 flex flex-col gap-4 rounded-sm">
                          <p className="text-lg text-foreground leading-relaxed italic">
                            &quot;{r.response}&quot;
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/40">
                            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                              — {r.attribution_preference === 'Anonymous' ? 'Anonymous Contributor' : (r.contributor_profiles as any)?.name || 'Contributor'}
                            </span>
                            {(r.research_areas as any)?.title && (
                              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground bg-muted/20 px-2 py-1 rounded-sm border border-border/40">
                                AREA: {(r.research_areas as any).title}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 border border-border/40 bg-muted/5 mt-4 flex flex-col items-center justify-center text-center gap-6 rounded-sm">
                      <p className="text-muted-foreground text-lg italic max-w-xl">
                        LR is building a growing body of community experiences and perspectives.
                      </p>
                      <Link 
                        href="/contribute/signup?next=/contributor/feedback"
                        className="text-[12px] font-medium uppercase tracking-[0.15em] text-foreground hover:text-muted-foreground transition-colors border border-border/60 px-6 py-3 rounded-sm"
                      >
                        SHARE YOUR EXPERIENCE
                      </Link>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 05 CONTRIBUTE (INVERTED CTA) */}
      <section className="bg-foreground text-background py-32 md:py-48">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="mb-24 flex items-baseline justify-between border-b border-background/20 pb-6">
              <h2 className="text-lg font-medium tracking-wide">Contribute</h2>
              <span className="font-mono text-[10px] tracking-[0.2em] text-background/60">05</span>
            </div>
          </Reveal>
          <div className="flex flex-col gap-10">
            <Reveal delay={100}>
              <h3 className="text-4xl md:text-6xl font-medium tracking-tight leading-tight text-background">
                Have something worth sharing?
              </h3>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-xl font-light leading-relaxed text-background/80 md:text-2xl md:leading-relaxed max-w-2xl">
                You don&apos;t need to have all the answers. A single experience, observation, question, or piece of evidence can be the beginning of an investigation.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="flex flex-col gap-6 mt-8">
                <Link 
                  href="/contribute/signup?next=/contributor/opportunities"
                  className="group w-fit flex items-center gap-3 text-[14px] font-medium uppercase tracking-[0.15em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-4 focus-visible:ring-offset-foreground rounded-sm"
                >
                  <span className="relative">
                    Get Started
                    <span className="absolute -bottom-1 left-0 h-px w-full bg-background opacity-40 transition-opacity group-hover:opacity-100" />
                  </span>
                  <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
                </Link>
                <Link 
                  href="/contribute/login?next=/contributor/opportunities"
                  className="group w-fit flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.15em] text-background/60 hover:text-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-4 focus-visible:ring-offset-foreground rounded-sm"
                >
                  <span className="relative">
                    Already have an account? Log in
                    <span className="absolute -bottom-1 left-0 h-px w-full bg-background opacity-40 transition-opacity group-hover:opacity-100" />
                  </span>
                  <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}