'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// ============================================================
// METADATA (Move this to your layout.tsx or a server component)
// ============================================================
/*
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LR — Life & Resilience',
  description: 'Life & Resilience studies how people and organizations become exposed to digital threats, translating observations into foundational security insights.',
  openGraph: {
    title: 'LR — Life & Resilience',
    description: 'Studying human-centered digital vulnerabilities to build foundational security insights.',
    type: 'website',
    url: 'https://...',
    siteName: 'Life & Resilience',
  },
  robots: {
    index: true,
    follow: true,
  }
};
*/

// ============================================================
// SHARED DATA: SINGLE SOURCE OF TRUTH FOR RESEARCH AREAS
// ============================================================
const RESEARCH_AREAS = [
  { id: 'social-engineering', number: '01', title: 'Social Engineering', slug: 'social-engineering', status: 'COMPLETED' },
  { id: 'phishing', number: '02', title: 'Phishing', slug: 'phishing', status: 'IN PROGRESS' },
  { id: 'malware', number: '03', title: 'Malware', slug: 'malware', status: 'PENDING' },
  { id: 'digital-fraud', number: '04', title: 'Digital Fraud', slug: 'digital-fraud', status: 'PENDING' },
  { id: 'identity-security', number: '05', title: 'Identity Security', slug: 'identity-security', status: 'PENDING' }
];

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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}

// ============================================================
// PAGE COMPONENT
// ============================================================
export default function HomePage() {
  return (
    <div className="flex w-full flex-col bg-background selection:bg-foreground selection:text-background">
      
      {/* =========================================================
          01. INTRODUCTION (HERO)
          ========================================================= */}
      <section className="relative flex min-h-[90vh] flex-col justify-center pt-32 pb-24">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          
          <Reveal delay={0}>
            <div className="mb-16 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="text-foreground">LR RESEARCH / 01</span>
              <span>CURRENT FOCUS / HUMAN-CENTERED THREATS</span>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <h1 className="mb-12 max-w-4xl text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.05] tracking-tight text-foreground">
              Technology is evolving faster than our ability to understand its risks.
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="mb-20 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed">
              <strong className="font-medium text-foreground">Life & Resilience</strong> studies how people and organizations become exposed to digital threats—and translates those observations into foundational security insights.
            </p>
          </Reveal>

          <Reveal delay={450}>
            <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-12">
              <Link 
                href="/research" 
                className="group flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.15em] text-foreground transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
              >
                <span>Explore Research</span>
                <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
              <Link 
                href="/contribute" 
                className="group flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
              >
                <span>Contribute</span>
                <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">↗</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================
          02. DIGITAL SURFACE (THE REALITY)
          ========================================================= */}
      <section className="border-t border-border/40 py-32 md:py-40">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          
          <Reveal>
            <div className="mb-24 flex items-baseline justify-between border-b border-border/40 pb-6">
              <h2 className="text-lg font-medium tracking-wide">The Digital Surface</h2>
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">02</span>
            </div>
          </Reveal>

          <div className="mb-32 grid grid-cols-2 gap-x-8 gap-y-16 md:grid-cols-3 lg:gap-x-16">
            {[
              'Email', 'SMS', 'Phone Calls', 
              'Websites', 'QR Codes', 'Downloads', 
              'Applications', 'Payments', 'Social Platforms'
            ].map((item, i) => (
              <Reveal key={item} delay={i * 50}>
                <div className="flex flex-col gap-4 border-t border-border/20 pt-4">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground">
                    0{i + 1}
                  </span>
                  <span className="text-lg tracking-wide text-foreground md:text-xl">
                    {item}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <h3 className="max-w-3xl text-3xl font-medium leading-tight tracking-tight text-foreground md:text-5xl">
              Every interaction creates an opportunity for trust—or exploitation.
            </h3>
          </Reveal>
        </div>
      </section>

      {/* =========================================================
          03. OUR APPROACH
          ========================================================= */}
      <section className="border-t border-border/40 py-32 md:py-40">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          
          <Reveal>
            <div className="mb-24 flex items-baseline justify-between border-b border-border/40 pb-6">
              <h2 className="text-lg font-medium tracking-wide">Our Approach</h2>
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">03</span>
            </div>
          </Reveal>

          {/* Pipeline */}
          <div className="mb-32 flex flex-col gap-6 md:flex-row md:items-center md:gap-4 lg:gap-8">
            {[
              { num: '01', label: 'Observe' },
              { num: '02', label: 'Research' },
              { num: '03', label: 'Understand' },
              { num: '04', label: 'Validate' },
              { num: '05', label: 'Build' },
              { num: '06', label: 'Protect', active: true },
            ].map((step, i, arr) => (
              <Reveal key={step.label} delay={i * 100} className="flex flex-col md:flex-row md:items-center md:gap-4 lg:gap-8">
                <div className="flex items-baseline gap-3">
                  <span className={`font-mono text-[10px] tracking-[0.15em] ${step.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.num}
                  </span>
                  <span className={`text-sm tracking-[0.1em] uppercase ${step.active ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'}`}>
                    {step.label}
                  </span>
                </div>
                {i !== arr.length - 1 && (
                  <span className="mt-4 text-muted-foreground/40 md:mt-0 md:text-foreground/20 md:rotate-0 rotate-90 w-fit" aria-hidden="true">
                    →
                  </span>
                )}
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="max-w-2xl text-2xl font-light leading-relaxed text-muted-foreground md:text-3xl md:leading-relaxed">
              We don&apos;t begin with a product. <br />
              <strong className="font-medium text-foreground">We begin with a problem.</strong>
            </p>
          </Reveal>
        </div>
      </section>

      {/* =========================================================
          04. CURRENT STATUS (What we are doing now)
          ========================================================= */}
      <section className="border-t border-border/40 bg-muted/20 py-32 md:py-40">
        <div className="mx-auto w-full max-w-5xl px-6 sm:px-8 lg:px-10">
          
          <Reveal>
            <div className="mb-12 flex items-baseline justify-between border-b border-border/40 pb-6">
              <h2 className="text-lg font-medium tracking-wide">Current Status</h2>
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">04</span>
            </div>
          </Reveal>
          
          <Reveal>
            <h3 className="mb-24 max-w-2xl text-xl font-light leading-relaxed text-muted-foreground md:text-2xl">
              Tracking the active investigations, experiments, and published documentation currently progressing through the LR system.
            </h3>
          </Reveal>

          <div className="flex flex-col gap-16 md:gap-24">
            {RESEARCH_AREAS.map((area, index) => (
              <Reveal key={area.id} delay={index * 100}>
                <Link 
                  href={`/research/${area.slug}`} 
                  className="group flex flex-col items-start gap-4 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-8 transition-colors"
                >
                  <h3 className="uppercase text-2xl md:text-4xl font-medium leading-tight tracking-widest text-foreground group-hover:text-primary transition-colors">
                    {area.title}
                  </h3>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">
                    {area.status}
                  </div>
                  <div className="mt-4 flex w-fit items-center gap-3 text-[12px] font-medium uppercase tracking-[0.15em] text-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-2">
                    <span className="relative">
                      Explore
                      <span className="absolute -bottom-1 left-0 h-px w-full bg-foreground opacity-40" />
                    </span>
                    <span aria-hidden="true">→</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          05. RESEARCH AREAS (What we study)
          ========================================================= */}
      <section className="border-t border-border/40 py-32 md:py-40">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          
          <Reveal>
            <div className="mb-12 flex items-baseline justify-between border-b border-border/40 pb-6">
              <h2 className="text-lg font-medium tracking-wide">Research Areas</h2>
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">05</span>
            </div>
          </Reveal>

          <Reveal>
            <h3 className="mb-24 max-w-2xl text-xl font-light leading-relaxed text-muted-foreground md:text-2xl">
              The fundamental domains that define our study of human-centered vulnerabilities and defensive resilience.
            </h3>
          </Reveal>

          <div className="flex flex-col">
            {RESEARCH_AREAS.map((area, i) => (
              <Reveal key={area.id} delay={i * 50}>
                <Link 
                  href={`/research/${area.slug}`}
                  className="group flex items-center justify-between border-b border-border/40 py-8 transition-colors duration-300 hover:border-foreground/40 md:py-10 focus-visible:outline-none focus-visible:bg-muted/30 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:border-transparent rounded-sm px-2 -mx-2"
                >
                  <div className="flex items-baseline gap-6 transition-transform duration-300 ease-out group-hover:translate-x-2 md:gap-12">
                    <span className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground group-hover:text-foreground">
                      {area.number}
                    </span>
                    <span className="text-xl font-medium tracking-wide text-muted-foreground transition-colors duration-300 group-hover:text-foreground md:text-3xl">
                      {area.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className={`font-mono text-[10px] tracking-[0.15em] ${area.status === 'COMPLETED' ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                      {area.status}
                    </span>
                    <span className="hidden opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100 md:block" aria-hidden="true">
                      →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          06. THE RESEARCH SYSTEM (Purely Informational)
          ========================================================= */}
      <section className="border-t border-border/40 py-32 md:py-40">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          
          <Reveal>
            <div className="mb-24 flex items-baseline justify-between border-b border-border/40 pb-6">
              <h2 className="text-lg font-medium tracking-wide">The Research System</h2>
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">06</span>
            </div>
          </Reveal>

          <Reveal>
            <h3 className="mb-20 max-w-2xl text-2xl font-light leading-relaxed text-muted-foreground md:text-3xl md:leading-relaxed">
              LR continuously collects and structures data from the real world to build a comprehensive map of digital threats.
            </h3>
          </Reveal>

          <div className="grid grid-cols-1 gap-x-16 gap-y-0 md:grid-cols-2">
            {[
              'OBSERVATIONS', 'FINDINGS',
              'EVIDENCE', 'QUESTIONS',
              'ATTACK PATTERNS', 'EXPERIMENTS',
              'CASE STUDIES', 'OPEN PROBLEMS'
            ].map((node, i) => (
              <Reveal key={node} delay={i * 50}>
                <div className="flex cursor-default items-center justify-between border-b border-border/30 py-6">
                  <div className="flex items-baseline gap-6">
                    <span className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-medium tracking-[0.1em] text-foreground">
                      {node}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          07. CONTRIBUTE (INVERTED EDITORIAL SECTION)
          ========================================================= */}
      <section className="bg-foreground text-background py-32 md:py-40">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          
          <Reveal>
            <div className="mb-24 flex items-baseline justify-between border-b border-background/20 pb-6">
              <h2 className="text-lg font-medium tracking-wide">Contribute</h2>
              <span className="font-mono text-[10px] tracking-[0.2em] text-background/60">07</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h3 className="mb-12 max-w-4xl text-[clamp(2rem,5vw,4rem)] font-medium leading-[1.1] tracking-tight text-background">
              Security knowledge shouldn&apos;t belong only to security experts.
            </h3>
          </Reveal>

          <Reveal delay={200}>
            <p className="mb-20 max-w-2xl text-xl font-light leading-relaxed text-background/70 md:text-2xl md:leading-relaxed">
              Anyone can contribute an observation or experience. Real-world accounts are the foundation of our research.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <Link 
              href="/contribute" 
              className="group mb-32 flex w-fit items-center gap-3 text-[13px] font-medium uppercase tracking-[0.15em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-4 focus-visible:ring-offset-foreground rounded-sm"
            >
              <span className="relative">
                Share an Observation
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-background opacity-0 transition-all duration-300 group-hover:w-full group-hover:opacity-40" />
              </span>
              <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
          </Reveal>

          {/* Process Flow */}
          <Reveal delay={400}>
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-4 lg:gap-8">
              {[
                'PUBLIC', 'CONTRIBUTION', 'REVIEW', 
                'VALIDATION', 'RESEARCH DATABASE', 'INSIGHT'
              ].map((step, i, arr) => (
                <div key={step} className="flex flex-col md:flex-row md:items-center md:gap-4 lg:gap-8">
                  <span className={`font-mono text-[10px] uppercase tracking-[0.15em] ${i === arr.length - 1 ? 'font-bold text-background' : 'text-background/60'}`}>
                    {step}
                  </span>
                  {i !== arr.length - 1 && (
                    <span className="mt-4 text-background/30 md:mt-0 md:rotate-0 rotate-90 w-fit" aria-hidden="true">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================
          08. THE FUTURE (CINEMATIC)
          ========================================================= */}
      <section className="border-t border-border/40 py-40 md:py-64">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-6 text-center sm:px-8 lg:px-10">
          
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              08 — THE FUTURE
            </span>
          </Reveal>

          <div className="mt-24 flex flex-col items-center gap-16 font-mono text-[13px] uppercase tracking-[0.2em] md:text-sm">
            
            <Reveal delay={100}><span className="text-muted-foreground">RESEARCH</span></Reveal>
            
            <Reveal delay={200}><span className="text-border" aria-hidden="true">↓</span></Reveal>
            
            <Reveal delay={300}><span className="text-muted-foreground">INTELLIGENCE</span></Reveal>
            
            <Reveal delay={400}><span className="text-border" aria-hidden="true">↓</span></Reveal>
            
            <Reveal delay={500}><span className="text-muted-foreground">PRACTICAL SOLUTIONS</span></Reveal>
            
            <Reveal delay={600}><span className="text-border" aria-hidden="true">↓</span></Reveal>
            
            <Reveal delay={700}>
              <span className="text-xl font-medium tracking-[0.1em] text-foreground md:text-2xl">
                REAL-WORLD PROTECTION
              </span>
            </Reveal>

          </div>
        </div>
      </section>

      {/* =========================================================
          09. CONCLUSION
          ========================================================= */}
      <section className="border-t border-border/40 py-32 md:py-48">
        <div className="mx-auto w-full max-w-5xl px-6 sm:px-8 lg:px-10 text-center flex flex-col items-center">
          
          <Reveal>
            <h2 className="mb-16 text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[1.05] tracking-tight text-foreground">
              A safer digital world begins with understanding how people become vulnerable.
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-16">
              <Link 
                href="/research" 
                className="group flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.15em] text-foreground transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
              >
                <span>Explore LR Research</span>
                <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
              <Link 
                href="/contribute" 
                className="group flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
              >
                <span>Contribute to the Research</span>
                <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">↗</span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-32 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
              09 / 09
            </div>
          </Reveal>

        </div>
      </section>

    </div>
  );
}