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

export default function AboutPage() {
  return (
    <div className="flex w-full flex-col bg-background selection:bg-foreground selection:text-background">
      
      {/* 01 WHO WE ARE */}
      <section className="relative flex min-h-[70vh] flex-col justify-center pt-32 pb-24">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal delay={0}>
            <div className="mb-16 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="text-foreground">ABOUT / 01</span>
              <span>WHO WE ARE</span>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <h1 className="mb-12 max-w-4xl text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.05] tracking-tight text-foreground">
              We are a research initiative working to make digital security understandable, practical, and accessible to everyone.
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed">
              Life & Resilience (LR) studies the mechanisms behind modern cyber threats, with particular attention to the people and systems exposed to them. We begin with research — understanding how attacks work, why they succeed, and where existing defenses fall short.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 02 WHY LR EXISTS */}
      <section className="border-t border-border/40 py-32 md:py-40">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="mb-24 flex items-baseline justify-between border-b border-border/40 pb-6">
              <h2 className="text-lg font-medium tracking-wide">Why LR Exists</h2>
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">02</span>
            </div>
          </Reveal>

          <Reveal>
            <h3 className="mb-16 max-w-3xl text-3xl font-medium leading-tight tracking-tight text-foreground md:text-5xl">
              Technology has advanced faster than our collective understanding of security.
            </h3>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Billions of people now depend on digital systems without necessarily understanding the risks behind them. Attackers exploit this gap through deception, manipulation, technical vulnerabilities, and increasingly complex digital systems. <br/><br/>
              LR exists to understand that gap — and to research ways of making security more accessible to the people who need it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 03 OUR APPROACH */}
      <section className="border-t border-border/40 py-32 md:py-40 bg-muted/20">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="mb-24 flex items-baseline justify-between border-b border-border/40 pb-6">
              <h2 className="text-lg font-medium tracking-wide">Our Approach</h2>
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">03</span>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="flex flex-col gap-6">
                <span className="font-mono text-[10px] tracking-[0.15em] text-foreground">OBSERVATION</span>
                <p className="text-muted-foreground leading-relaxed">We observe real-world attacks, incidents, behaviors, and failures to understand what is actually happening.</p>
              </div>
              <div className="flex flex-col gap-6">
                <span className="font-mono text-[10px] tracking-[0.15em] text-foreground">ANALYSIS</span>
                <p className="text-muted-foreground leading-relaxed">We investigate how attacks work, why they succeed, and which technical, human, and systemic weaknesses they exploit.</p>
              </div>
              <div className="flex flex-col gap-6">
                <span className="font-mono text-[10px] tracking-[0.15em] text-foreground">TRANSLATION</span>
                <p className="text-muted-foreground leading-relaxed">We translate research into knowledge, frameworks, tools, and eventually technologies that can strengthen digital security.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 04 RESEARCH PHILOSOPHY & SECURITY FOR EVERYONE */}
      <section className="border-t border-border/40 py-32 md:py-40">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="mb-24 flex items-baseline justify-between border-b border-border/40 pb-6">
              <h2 className="text-lg font-medium tracking-wide">Research Philosophy</h2>
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">04</span>
            </div>
          </Reveal>

          <Reveal>
            <h3 className="mb-12 max-w-3xl text-3xl font-medium leading-tight tracking-tight text-foreground md:text-5xl">
              We build from understanding, not assumptions.
            </h3>
            <p className="max-w-2xl text-xl font-light leading-relaxed text-muted-foreground md:text-2xl md:leading-relaxed">
              Research comes first. Tools, frameworks, and products come later. We believe meaningful security begins with understanding the problem — the technology, the attacker, the system, and the person on the other side of it.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-32 border-l-2 border-foreground pl-6 md:pl-10 py-2">
              <h4 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground mb-10 leading-tight">
                Security should not belong only to security professionals.
              </h4>
              <p className="text-xl md:text-2xl font-medium text-foreground mb-6 tracking-wide">
                Security should be understandable to everyone.
              </p>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Cybersecurity is often written for professionals. The people most exposed to digital threats are not always security professionals. LR researches the gap between expert knowledge and everyday digital life.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 05 WHAT WE STUDY */}
      <section className="border-t border-border/40 py-32 md:py-40">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="mb-24 flex items-baseline justify-between border-b border-border/40 pb-6">
              <h2 className="text-lg font-medium tracking-wide">What We Study</h2>
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">05</span>
            </div>
          </Reveal>

          <Reveal>
            <h3 className="mb-12 max-w-3xl text-3xl font-medium leading-tight tracking-tight text-foreground md:text-4xl">
              We study the threats, behaviors, systems, and vulnerabilities that shape digital security.
            </h3>
            <p className="mb-16 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Our research begins with understanding how people experience cyber threats — and extends into the technologies, systems, and security mechanisms surrounding them.
            </p>
            <Link 
              href="/research" 
              className="group flex w-fit items-center gap-3 text-[12px] font-medium uppercase tracking-[0.15em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
            >
              <span className="relative">
                View All Research Areas
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground opacity-0 transition-all duration-300 group-hover:w-full group-hover:opacity-40" />
              </span>
              <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 06 LONG-TERM DIRECTION */}
      <section className="border-t border-border/40 py-32 md:py-40">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="mb-24 flex items-baseline justify-between border-b border-border/40 pb-6">
              <h2 className="text-lg font-medium tracking-wide">Long-Term Direction</h2>
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">06</span>
            </div>
          </Reveal>

          <Reveal>
            <h3 className="max-w-4xl text-3xl font-medium leading-tight tracking-tight text-foreground md:text-4xl">
              We aim to build a body of security research that can become knowledge, frameworks, tools, and technologies for a more resilient digital world.
            </h3>
          </Reveal>

          <div className="mt-32 flex flex-col items-start md:items-center gap-8 md:gap-12 font-mono text-[13px] uppercase tracking-[0.2em] md:text-sm pl-4 md:pl-0 border-l border-border/40 md:border-l-0">
            <Reveal delay={100}><span className="text-muted-foreground">RESEARCH</span></Reveal>
            <Reveal delay={200}><span className="text-border" aria-hidden="true">↓</span></Reveal>
            <Reveal delay={300}><span className="text-muted-foreground">KNOWLEDGE</span></Reveal>
            <Reveal delay={400}><span className="text-border" aria-hidden="true">↓</span></Reveal>
            <Reveal delay={500}><span className="text-muted-foreground">FRAMEWORKS</span></Reveal>
            <Reveal delay={600}><span className="text-border" aria-hidden="true">↓</span></Reveal>
            <Reveal delay={700}><span className="text-muted-foreground">TOOLS</span></Reveal>
            <Reveal delay={800}><span className="text-border" aria-hidden="true">↓</span></Reveal>
            <Reveal delay={900}><span className="text-muted-foreground">TECHNOLOGY</span></Reveal>
            <Reveal delay={1000}><span className="text-border" aria-hidden="true">↓</span></Reveal>
            <Reveal delay={1100}>
              <span className="text-xl font-medium tracking-[0.1em] text-foreground md:text-2xl">
                RESILIENCE
              </span>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 07 CURRENT STATUS */}
      <section className="border-t border-border/40 bg-foreground text-background py-32 md:py-40">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="mb-24 flex items-baseline justify-between border-b border-background/20 pb-6">
              <h2 className="text-lg font-medium tracking-wide">Current Status</h2>
              <span className="font-mono text-[10px] tracking-[0.2em] text-background/60">07</span>
            </div>
          </Reveal>

          <Reveal>
            <h3 className="mb-12 max-w-3xl text-3xl font-medium leading-tight tracking-tight text-background md:text-5xl">
              LR is currently focused on research — building the foundational knowledge from which future frameworks, tools, and technologies can emerge.
            </h3>
            <Link 
              href="/progress" 
              className="group flex w-fit items-center gap-3 text-[13px] font-medium uppercase tracking-[0.15em] text-background mt-16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-4 focus-visible:ring-offset-foreground rounded-sm"
            >
              <span className="relative">
                View Research Progress
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-background opacity-0 transition-all duration-300 group-hover:w-full group-hover:opacity-40" />
              </span>
              <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

    </div>
  );
}