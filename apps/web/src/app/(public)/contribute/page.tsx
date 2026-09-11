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

// ============================================================
// PAGE COMPONENT
// ============================================================
export default function ContributePage() {
  // Mock routing state to demonstrate the complete UX flow
  // In a real application, these would be separate routes (e.g., /contribute, /login, /dashboard)
  const [view, setView] = useState<'public' | 'dashboard' | 'form' | 'success'>('public');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setView('form');
  };

  // ----------------------------------------------------------
  // VIEW: 01 PUBLIC PAGE
  // ----------------------------------------------------------
  if (view === 'public') {
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
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Cybersecurity is experienced by everyone, not only by security professionals. If you have encountered an attack, observed suspicious behavior, studied a threat, or learned something worth sharing, your experience can help LR understand the broader security landscape.
              </p>
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
                  ].map((phase, index) => (
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
                <button 
                  onClick={() => setView('dashboard')}
                  className="group w-fit flex items-center gap-3 text-[14px] font-medium uppercase tracking-[0.15em] text-background mt-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-4 focus-visible:ring-offset-foreground rounded-sm"
                >
                  <span className="relative">
                    Contribute to LR
                    <span className="absolute -bottom-1 left-0 h-px w-full bg-background opacity-40 transition-opacity group-hover:opacity-100" />
                  </span>
                  <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
                </button>
              </Reveal>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ----------------------------------------------------------
  // VIEW: 02 DASHBOARD (POST-LOGIN)
  // ----------------------------------------------------------
  if (view === 'dashboard') {
    return (
      <div className="flex w-full flex-col bg-background selection:bg-foreground selection:text-background min-h-screen">
        <header className="border-b border-border/40 pt-32 pb-16">
          <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
            <Reveal delay={0}>
              <div className="mb-12 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span className="text-foreground">LR / CONTRIBUTOR AREA</span>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-4">
                Welcome back.
              </h1>
            </Reveal>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-16 lg:gap-24 items-start">
            
            {/* Left: Action Selection */}
            <div className="flex flex-col gap-12">
              <Reveal>
                <h2 className="text-2xl font-medium tracking-tight text-foreground">
                  What would you like to contribute?
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <div className="flex flex-col border-t border-border/40">
                  {[
                    "Experience", "Observation", "Research", "Evidence", "Idea"
                  ].map((category) => (
                    <button 
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className="group flex items-center justify-between border-b border-border/40 py-6 text-left focus-visible:outline-none focus-visible:bg-muted/30 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:border-transparent rounded-sm px-2 -mx-2 transition-colors hover:border-foreground/30"
                    >
                      <span className="text-xl text-muted-foreground group-hover:text-foreground transition-colors">
                        {category}
                      </span>
                      <span className="opacity-0 -translate-x-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0" aria-hidden="true">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right: History */}
            <div className="flex flex-col gap-8 border-t border-border/40 lg:border-t-0 lg:border-l lg:pl-10 pt-10 lg:pt-0">
              <Reveal delay={200}>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground mb-8">
                  MY CONTRIBUTIONS
                </h3>
                <div className="flex flex-col gap-8">
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.15em]">
                      <span className="text-foreground">LR-C-001</span>
                      <span className="text-primary font-medium">UNDER REVIEW</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Phishing message I received
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-border/40 pt-8">
                    <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.15em]">
                      <span className="text-foreground">LR-C-002</span>
                      <span className="text-muted-foreground">REVIEWED</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Suspicious banking call
                    </p>
                  </div>

                </div>
              </Reveal>
            </div>

          </div>
        </main>
      </div>
    );
  }

  // ----------------------------------------------------------
  // VIEW: 03 CONTRIBUTION FORM
  // ----------------------------------------------------------
  if (view === 'form') {
    return (
      <div className="flex w-full flex-col bg-background selection:bg-foreground selection:text-background min-h-screen">
        <header className="border-b border-border/40 pt-32 pb-16">
          <div className="mx-auto w-full max-w-4xl px-6 sm:px-8 lg:px-10">
            <Reveal delay={0}>
              <div className="mb-12 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setView('dashboard')}
                    className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
                  >
                    ← CANCEL
                  </button>
                  <span className="text-foreground">LR / NEW CONTRIBUTION</span>
                </div>
                <span>{selectedCategory}</span>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-4">
                Tell us what happened.
              </h1>
            </Reveal>
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl px-6 sm:px-8 lg:px-10 py-16 md:py-24">
          <Reveal delay={200}>
            <form 
              className="flex flex-col gap-12"
              onSubmit={(e) => { e.preventDefault(); setView('success'); }}
            >
              
              <div className="flex flex-col gap-4">
                <label htmlFor="title" className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Title
                </label>
                <input 
                  id="title"
                  type="text" 
                  required
                  placeholder="What is this about?" 
                  className="w-full bg-transparent border-b border-border/40 py-3 text-lg md:text-xl focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40 rounded-none" 
                />
              </div>

              <div className="flex flex-col gap-4">
                <label htmlFor="contribution" className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Contribution
                </label>
                <textarea 
                  id="contribution"
                  required
                  rows={6}
                  placeholder="Share the details..." 
                  className="w-full bg-transparent border border-border/40 p-4 text-base focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40 resize-y rounded-sm" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="flex flex-col gap-4">
                  <label htmlFor="date" className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    When did this happen? (Optional)
                  </label>
                  <input 
                    id="date"
                    type="text" 
                    placeholder="e.g. Last week, Oct 2026..." 
                    className="w-full bg-transparent border-b border-border/40 py-3 text-base focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40 rounded-none" 
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <label htmlFor="location" className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Where did you encounter it? (Optional)
                  </label>
                  <input 
                    id="location"
                    type="text" 
                    placeholder="e.g. SMS, WhatsApp, Phone call..." 
                    className="w-full bg-transparent border-b border-border/40 py-3 text-base focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40 rounded-none" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-border/40 pt-12">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Supporting Material (Optional)
                </label>
                <div className="border border-dashed border-border/40 rounded-sm p-8 text-center bg-muted/10">
                  <span className="text-sm text-muted-foreground">
                    Click to attach screenshots, documents, or files.
                  </span>
                </div>
              </div>

              <div className="pt-8">
                <button 
                  type="submit"
                  className="group w-fit flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.15em] text-background bg-foreground px-8 py-4 rounded-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4"
                >
                  Submit Contribution
                  <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
                </button>
              </div>

            </form>
          </Reveal>
        </main>
      </div>
    );
  }

  // ----------------------------------------------------------
  // VIEW: 04 SUCCESS STATE
  // ----------------------------------------------------------
  if (view === 'success') {
    return (
      <div className="flex w-full flex-col bg-background selection:bg-foreground selection:text-background min-h-screen">
        <header className="border-b border-border/40 pt-32 pb-16">
          <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
            <Reveal delay={0}>
              <div className="mb-12 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span className="text-foreground">LR / SUBMISSION</span>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-8">
                Contribution received.
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Thank you for contributing to LR. Your submission will be reviewed before it is considered for research.
              </p>
            </Reveal>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10 py-24">
          <Reveal delay={200}>
            <div className="flex flex-col gap-12 max-w-2xl">
              
              <div className="flex flex-col items-start gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="w-2 h-2 rounded-full bg-foreground" aria-hidden="true" />
                  <span className="text-foreground font-medium">SUBMITTED</span>
                </div>
                <div className="pl-1 text-border/40" aria-hidden="true">↓</div>
                <div className="flex items-center gap-4 pl-[3px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-border" aria-hidden="true" />
                  <span>UNDER REVIEW</span>
                </div>
                <div className="pl-1 text-border/40" aria-hidden="true">↓</div>
                <div className="flex items-center gap-4 pl-[3px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-border" aria-hidden="true" />
                  <span>REVIEWED</span>
                </div>
              </div>

              <div className="border-l-2 border-foreground pl-6 py-1 mt-8">
                <p className="text-base text-muted-foreground italic">
                  Relevant contributions may inform future LR research.
                </p>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => setView('dashboard')}
                  className="group w-fit flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.15em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
                >
                  <span className="relative">
                    Return to Dashboard
                    <span className="absolute -bottom-1 left-0 h-px w-full bg-foreground opacity-40 transition-opacity group-hover:opacity-100" />
                  </span>
                  <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
                </button>
              </div>

            </div>
          </Reveal>
        </main>
      </div>
    );
  }

  // Fallback
  return null;
}