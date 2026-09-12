"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Reveal({ 
  children, 
  delay = 0, 
  className = "" 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

export default function ContributePage() {
  const router = useRouter();

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
            <button 
              onClick={() => router.push('/contribute/signup?next=/contributor')}
              className="group w-fit flex items-center gap-3 text-[14px] font-medium uppercase tracking-[0.15em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
            >
              <span className="relative">
                Get Started
                <span className="absolute -bottom-1 left-0 h-px w-full bg-foreground opacity-40 transition-opacity group-hover:opacity-100" />
              </span>
              <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
            </button>
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

      {/* 02 HOW IT WORKS */}
      <section className="border-b border-border/40 py-24 md:py-32 bg-muted/20">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-8 md:gap-16">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">02 — How Contributing Works</h2>
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

      {/* 03 COMMUNITY */}
      <section className="border-b border-border/40 py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-8 md:gap-16">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">03 — A Growing Community</h2>
              <div className="flex flex-col gap-16">
                
                <div className="flex flex-col gap-8">
                  <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">
                    A growing research community
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    <div className="flex flex-col gap-3 border-l border-border/40 pl-4">
                      <span className="text-2xl font-medium text-foreground tracking-tight">—</span>
                      <span>Contributors</span>
                    </div>
                    <div className="flex flex-col gap-3 border-l border-border/40 pl-4">
                      <span className="text-2xl font-medium text-foreground tracking-tight">—</span>
                      <span>Contributions</span>
                    </div>
                    <div className="flex flex-col gap-3 border-l border-border/40 pl-4">
                      <span className="text-2xl font-medium text-foreground tracking-tight">—</span>
                      <span>Research Areas</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm italic">
                    Building our first contributor community.
                  </p>
                </div>

                <div className="flex flex-col gap-6 border-t border-border/40 pt-16">
                  <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">
                    From the community
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                    Contributors are helping LR build a broader understanding of digital security.
                  </p>
                  <div className="p-8 border border-border/40 bg-muted/10 mt-4">
                    <p className="text-muted-foreground italic">
                      Community responses will appear here as the contributor community grows.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 04 CONTRIBUTE (INVERTED CTA) */}
      <section className="bg-foreground text-background py-32 md:py-48">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="mb-24 flex items-baseline justify-between border-b border-background/20 pb-6">
              <h2 className="text-lg font-medium tracking-wide">Contribute</h2>
              <span className="font-mono text-[10px] tracking-[0.2em] text-background/60">04</span>
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
                <button 
                  onClick={() => router.push('/contribute/signup?next=/contributor')}
                  className="group w-fit flex items-center gap-3 text-[14px] font-medium uppercase tracking-[0.15em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-4 focus-visible:ring-offset-foreground rounded-sm"
                >
                  <span className="relative">
                    Get Started
                    <span className="absolute -bottom-1 left-0 h-px w-full bg-background opacity-40 transition-opacity group-hover:opacity-100" />
                  </span>
                  <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
                </button>
                <button 
                  onClick={() => router.push('/contribute/login?next=/contributor')}
                  className="group w-fit flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.15em] text-background/60 hover:text-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-4 focus-visible:ring-offset-foreground rounded-sm"
                >
                  <span className="relative">
                    Already have an account? Log in
                    <span className="absolute -bottom-1 left-0 h-px w-full bg-background opacity-40 transition-opacity group-hover:opacity-100" />
                  </span>
                  <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}