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

export default function ContactPage() {
  return (
    <div className="flex w-full flex-col bg-background selection:bg-foreground selection:text-background min-h-screen">
      
      {/* HEADER */}
      <section className="relative flex min-h-[50vh] flex-col justify-center pt-32 pb-24 border-b border-border/40">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal delay={0}>
            <div className="mb-16 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="text-foreground">LR / CONTACT</span>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <h1 className="mb-12 max-w-4xl text-5xl md:text-7xl font-medium leading-[1.05] tracking-tight text-foreground">
              Contact LR
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Life & Resilience is currently focused on research. For research discussions, security findings, collaboration opportunities, or other serious inquiries, contact us directly.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 01 RESEARCH & SECURITY */}
      <section className="border-b border-border/40 py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-8 md:gap-16">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">01 — Research & Security</h2>
              <div className="flex flex-col gap-6">
                <p className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">
                  Research, findings, and collaboration.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  Share a research finding, report a security observation, discuss an area of investigation, or explore a potential collaboration with LR.
                </p>
                <a 
                  href="mailto:lr.lifeandresilence@gmail.com" 
                  className="group w-fit flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.15em] text-foreground mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-8 rounded-sm"
                >
                  <span className="relative">
                    lr.lifeandresilence@gmail.com
                    <span className="absolute -bottom-1 left-0 h-px w-full bg-foreground opacity-40 transition-opacity group-hover:opacity-100" />
                  </span>
                  <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 02 WHAT TO CONTACT US ABOUT */}
      <section className="border-b border-border/40 py-24 md:py-32 bg-muted/20">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-8 md:gap-16">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">02 — Subject Areas</h2>
              <div className="flex flex-col gap-12">
                <p className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">
                  We welcome serious inquiries.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 font-mono text-[12px] md:text-[13px] uppercase tracking-[0.1em] text-foreground">
                  <div className="border-t border-border/40 pt-4">Research findings</div>
                  <div className="border-t border-border/40 pt-4">Security observations</div>
                  <div className="border-t border-border/40 pt-4">Research collaboration</div>
                  <div className="border-t border-border/40 pt-4">Academic or institutional discussions</div>
                  <div className="border-t border-border/40 pt-4">Responsible disclosure</div>
                  <div className="border-t border-border/40 pt-4">Media and public-interest inquiries</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 03 BEFORE YOU WRITE */}
      <section className="border-b border-border/40 py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-8 md:gap-16">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">03 — Before You Write</h2>
              <div className="flex flex-col gap-6">
                <p className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">
                  Help us understand the context.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  When possible, include the subject, relevant context, supporting evidence, and what you would like LR to investigate or discuss.
                </p>
                <div className="mt-6 border-l-2 border-foreground pl-5 py-1">
                  <p className="text-base font-medium text-foreground max-w-xl leading-relaxed">
                    Please do not send passwords, authentication codes, private credentials, or other sensitive personal information by email.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 04 CURRENT STAGE */}
      <section className="py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-8 md:gap-16">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">04 — Current Stage</h2>
              <div className="flex flex-col gap-6">
                <p className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">
                  LR is currently research-led.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-4">
                  Our primary focus is building the research foundation. Future frameworks, tools, and technologies will emerge from the problems and evidence identified through that work.
                </p>
                <Link 
                  href="/research" 
                  className="group w-fit flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.15em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-8 rounded-sm"
                >
                  <span className="relative">
                    Explore Research
                    <span className="absolute -bottom-1 left-0 h-px w-full bg-foreground opacity-40 transition-opacity group-hover:opacity-100" />
                  </span>
                  <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}