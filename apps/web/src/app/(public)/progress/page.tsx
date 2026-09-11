"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ============================================================
// SCROLL REVEAL ANIMATION COMPONENT
// ============================================================
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

export default function ProgressPage() {
  return (
    <div className="flex w-full flex-col bg-background selection:bg-foreground selection:text-background">
      
      {/* 01 CURRENT STATUS */}
      <section className="relative flex min-h-[70vh] flex-col justify-center pt-32 pb-24">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal delay={0}>
            <div className="mb-16 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="text-foreground">PROGRESS / 01</span>
              <span>CURRENT STATUS</span>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <h1 className="mb-12 max-w-4xl text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.05] tracking-tight text-foreground">
              We are building the foundation for a broader body of security research.
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed">
              LR is currently focused on understanding how digital threats work, why they succeed, and how people and systems can become more resilient. Our research begins with human-centered attacks and will expand across the broader cybersecurity landscape.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 02 RESEARCH PROGRESS */}
      <section className="border-t border-border/40 py-32 md:py-40 bg-muted/20">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="mb-24 flex items-baseline justify-between border-b border-border/40 pb-6">
              <h2 className="text-lg font-medium tracking-wide">Research Progress</h2>
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">02</span>
            </div>
          </Reveal>
          <Reveal>
            <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-24 mb-12">
               <div className="flex flex-col gap-2">
                 <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Completed</span>
                 <span className="text-4xl md:text-5xl font-medium text-foreground">01</span>
               </div>
               <div className="flex flex-col gap-2">
                 <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">In Progress</span>
                 <span className="text-4xl md:text-5xl font-medium text-foreground">01</span>
               </div>
               <div className="flex flex-col gap-2">
                 <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Pending</span>
                 <span className="text-4xl md:text-5xl font-medium text-muted-foreground">03</span>
               </div>
            </div>
            
            <p className="text-lg text-muted-foreground mb-12 max-w-xl">
              Five initial research areas form the current research program.
            </p>

            <Link 
              href="/research" 
              className="group flex w-fit items-center gap-3 text-[12px] font-medium uppercase tracking-[0.15em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
            >
              <span className="relative">
                View All Research
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground opacity-0 transition-all duration-300 group-hover:w-full group-hover:opacity-40" />
              </span>
              <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 03 MILESTONES */}
      <section className="border-t border-border/40 py-32 md:py-40">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="mb-24 flex items-baseline justify-between border-b border-border/40 pb-6">
              <h2 className="text-lg font-medium tracking-wide">Milestones</h2>
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">03</span>
            </div>
          </Reveal>
          <div className="flex flex-col">
            {[
              { status: "ACHIEVED", title: "Establish Research Foundation", desc: "Define the initial research structure, taxonomies, and methodology for investigating digital threats." },
              { status: "ACHIEVED", title: "Complete Initial Research", desc: "Complete foundational research into social engineering and impersonation attacks." },
              { status: "IN PROGRESS", title: "Expand Active Research", desc: "Continue investigation into phishing and expand the evidence base across emerging attack patterns." },
              { status: "PENDING", title: "Broaden Research Coverage", desc: "Extend the research program into malware, digital fraud, and identity security." }
            ].map((m, i) => (
              <Reveal key={m.title} delay={i * 100}>
                <div className="border-b border-border/40 py-8 grid grid-cols-1 md:grid-cols-[160px_minmax(0,1fr)] gap-6 items-start">
                  <span className={`font-mono text-[10px] uppercase tracking-[0.2em] pt-1 ${m.status === "ACHIEVED" ? "text-foreground font-medium" : m.status === "IN PROGRESS" ? "text-foreground/70" : "text-muted-foreground"}`}>
                    {m.status}
                  </span>
                  <div className="flex flex-col gap-3">
                    <h3 className={`text-xl md:text-2xl font-medium tracking-wide ${m.status === "PENDING" ? "text-muted-foreground" : "text-foreground"}`}>
                      {m.title}
                    </h3>
                    <p className={`max-w-2xl leading-relaxed ${m.status === "PENDING" ? "text-muted-foreground/60" : "text-muted-foreground"}`}>
                      {m.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 04 ROADMAP */}
      <section className="border-t border-border/40 py-32 md:py-40">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="mb-24 flex items-baseline justify-between border-b border-border/40 pb-6">
              <h2 className="text-lg font-medium tracking-wide">Roadmap</h2>
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">04</span>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            
            <Reveal delay={0}>
              <div className="flex flex-col gap-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">PAST</span>
                <h3 className="text-2xl font-medium tracking-tight text-foreground">Research Foundation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Established the initial research structure, taxonomies, and methodology, including foundational research into social engineering and impersonation attacks.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="flex flex-col gap-6 border-l-2 border-foreground pl-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">PRESENT</span>
                <h3 className="text-2xl font-medium tracking-tight text-foreground">Active Research</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Investigating phishing and other human-centered attack mechanisms while building the evidence base and research infrastructure needed for continued study.
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="flex flex-col gap-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">NEXT</span>
                <h3 className="text-2xl font-medium tracking-tight text-foreground">Broader Security Research</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Expand research across malware, digital fraud, identity security, and other areas of the cybersecurity landscape.
                </p>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-col gap-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">LONG TERM</span>
                <h3 className="text-2xl font-medium tracking-tight text-foreground">From Research to Resilience</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Translate validated research into practical knowledge, frameworks, tools, and eventually technologies that can strengthen digital security for people and organizations.
                </p>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* 05 THE LONG-TERM MODEL (INVERTED CLOSING) */}
      <section className="border-t border-border/40 bg-foreground text-background py-32 md:py-48">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          
          <Reveal>
            <div className="mb-32 flex items-baseline justify-between border-b border-background/20 pb-6">
              <h2 className="text-lg font-medium tracking-wide">The Long-Term Model</h2>
              <span className="font-mono text-[10px] tracking-[0.2em] text-background/60">05</span>
            </div>
          </Reveal>

          <div className="flex flex-col md:flex-row gap-24 md:gap-16 lg:gap-32">
            {/* Left: Progression */}
            <Reveal delay={100} className="shrink-0">
              <div className="flex flex-col items-start gap-8 font-mono text-[13px] uppercase tracking-[0.2em] md:text-sm pl-4 md:pl-0 border-l border-background/20 md:border-l-0">
                <span className="text-background/70">RESEARCH</span>
                <span className="text-background/30" aria-hidden="true">↓</span>
                <span className="text-background/70">KNOWLEDGE</span>
                <span className="text-background/30" aria-hidden="true">↓</span>
                <span className="text-background/70">FRAMEWORKS</span>
                <span className="text-background/30" aria-hidden="true">↓</span>
                <span className="text-background/70">TOOLS</span>
                <span className="text-background/30" aria-hidden="true">↓</span>
                <span className="text-background/70">TECHNOLOGY</span>
                <span className="text-background/30" aria-hidden="true">↓</span>
                <span className="text-xl font-medium tracking-[0.1em] text-background md:text-2xl">
                  RESILIENCE
                </span>
              </div>
            </Reveal>

            {/* Right: Editorial Context */}
            <div className="flex flex-col justify-between max-w-2xl">
              <Reveal delay={300}>
                <h3 className="text-3xl md:text-5xl font-medium tracking-tight leading-tight text-background mb-10">
                  Research comes first.
                </h3>
                <p className="text-xl font-light leading-relaxed text-background/80 md:text-2xl md:leading-relaxed mb-24">
                  LR&apos;s future work will emerge from what the research reveals. We do not begin by deciding what to build. We begin by understanding what needs to be solved.
                </p>
              </Reveal>

              <Reveal delay={500}>
                <div className="border-t border-background/20 pt-12">
                  <p className="text-lg md:text-xl font-light leading-relaxed text-background/70 mb-10">
                    The objective is not simply to understand cybersecurity. It is to make security knowledge more accessible, practical, and useful to everyone.
                  </p>
                  <p className="text-2xl md:text-3xl font-medium text-background leading-tight">
                    Security should not belong only to security professionals.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}