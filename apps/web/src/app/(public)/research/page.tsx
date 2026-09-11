'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

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
// RESEARCH DATA MODEL
// ============================================================
type ResearchStatus = 'COMPLETED' | 'IN PROGRESS' | 'PENDING';

interface ResearchEntry {
  id: string;
  title: string;
  status: ResearchStatus;
  progress?: number;
  updated?: string;
  description: string;
  topics?: string[];
  href: string;
}

const RESEARCH_DATA: ResearchEntry[] = [
  {
    id: 'LR-01',
    title: 'Social Engineering & Impersonation Attacks',
    status: 'COMPLETED',
    progress: 100,
    updated: 'SEP 2026',
    description: 'An investigation into how attackers manipulate human psychology to bypass technical security controls.',
    topics: ['Digital Arrest', 'Fake KYC', 'OTP Theft'],
    href: '/research/social-engineering',
  },
  {
    id: 'LR-02',
    title: 'Phishing',
    status: 'IN PROGRESS',
    progress: 40,
    updated: 'ACTIVE',
    description: 'Analyzing the evolution of deceptive communications across email, SMS, and messaging platforms.',
    href: '/research/phishing',
  },
  {
    id: 'LR-03',
    title: 'Malware',
    status: 'PENDING',
    description: 'Studying the deployment vectors and execution patterns of malicious software affecting end users.',
    href: '/research/malware',
  },
  {
    id: 'LR-04',
    title: 'Digital Fraud',
    status: 'PENDING',
    description: 'Examining the systemic mechanisms behind financial exploitation, payment vulnerabilities, and synthetic fraud at scale.',
    href: '/research/digital-fraud',
  },
  {
    id: 'LR-05',
    title: 'Identity Security',
    status: 'PENDING',
    description: 'Investigating vulnerabilities in authentication protocols, credential theft, and decentralized access management.',
    href: '/research/identity-security',
  },
];

// ============================================================
// RESEARCH ROW COMPONENT
// ============================================================
function ResearchRow({ entry }: { entry: ResearchEntry }) {
  const isCompleted = entry.status === 'COMPLETED';
  const isPlanned = entry.status === 'PENDING';
  
  const content = (
    <div className={`grid grid-cols-1 md:grid-cols-[80px_minmax(0,1fr)_180px] lg:grid-cols-[100px_minmax(0,1fr)_220px] gap-8 md:gap-12 py-12 md:py-16 border-t border-border/40 transition-colors duration-300 hover:border-foreground/30`}>
      
      {/* LEFT: Metadata */}
      <div className="flex flex-row md:flex-col gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span>{entry.id}</span>
      </div>

      {/* CENTER: Core Content */}
      <div className="flex flex-col">
        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight mb-6 transition-colors duration-300 ${
          isPlanned 
            ? 'text-muted-foreground group-hover:text-foreground' 
            : isCompleted 
              ? 'text-foreground group-hover:text-primary' 
              : 'text-foreground group-hover:text-foreground/80'
        }`}>
          {entry.title}
        </h2>
        
        <p className={`text-lg md:text-xl leading-relaxed max-w-2xl ${
          isPlanned ? 'text-muted-foreground/70' : 'text-muted-foreground'
        }`}>
          {entry.description}
        </p>

        {entry.topics && (
          <div className="mt-10">
            <span className="block mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Key Topics
            </span>
            <div className="flex flex-col gap-2 border-l border-border/60 pl-5">
              {entry.topics.map(topic => (
                <span key={topic} className="text-base text-muted-foreground tracking-wide">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Status & Progress */}
      <div className="flex flex-col justify-between h-full pt-2 md:pt-0">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            {isCompleted && <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />}
            <span className={`font-mono text-[10px] uppercase tracking-[0.2em] font-medium ${
              isPlanned ? 'text-muted-foreground/70' : 'text-foreground'
            }`}>
              {entry.status}
            </span>
          </div>

          {/* Render progress bar ONLY if there is a percentage (not planned) */}
          {!isPlanned && entry.progress !== undefined && (
            <div className="flex flex-col gap-2">
              <div className="h-px w-full bg-border/40 relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-foreground transition-all duration-1000 ease-out" 
                  style={{ width: `${entry.progress}%` }} 
                />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {entry.progress}%
              </span>
            </div>
          )}
        </div>

        {/* Bottom Right Alignment (Updated + Arrow) */}
        <div className="mt-12 md:mt-auto flex items-end justify-between md:justify-end md:flex-col md:items-start gap-4">
          {entry.updated && (
            <div className="flex flex-col">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-1">
                Updated
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {entry.updated}
              </span>
            </div>
          )}

          {/* Desktop Arrow */}
          <div className="hidden md:flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.15em] text-foreground mt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Read <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
          </div>
          
          {/* Mobile Arrow */}
          <div className="md:hidden flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-foreground">
            Read <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Link 
      href={entry.href} 
      className="group block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-8"
    >
      {content}
    </Link>
  );
}

// ============================================================
// PAGE COMPONENT
// ============================================================
export default function ResearchPage() {
  // Compute index statistics dynamically
  const stats = {
    total: String(RESEARCH_DATA.length).padStart(2, '0'),
    completed: String(RESEARCH_DATA.filter(r => r.status === 'COMPLETED').length).padStart(2, '0'),
    inProgress: String(RESEARCH_DATA.filter(r => r.status === 'IN PROGRESS').length).padStart(2, '0'),
    pending: String(RESEARCH_DATA.filter(r => r.status === 'PENDING').length).padStart(2, '0'),
  };

  return (
    <div className="w-full bg-background selection:bg-foreground selection:text-background min-h-screen">
      <main className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-12 pt-32 pb-16">
        
        {/* =========================================================
            01. INTRODUCTION
            ========================================================= */}
        <header className="mb-24">
          <Reveal delay={0}>
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-8 flex items-center gap-2">
              <Link 
                href="/" 
                className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
              >
                HOME
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-foreground">RESEARCH</span>
            </nav>
          </Reveal>
          
          <Reveal delay={100}>
            <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-medium tracking-tight text-foreground mb-8 leading-[1.05]">
              Research
            </h1>
          </Reveal>
          
          <Reveal delay={200}>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              We investigate the mechanisms, behaviors, and systems behind modern digital threats.
            </p>
          </Reveal>
        </header>

        {/* =========================================================
            02. RESEARCH INDEX
            ========================================================= */}
        <Reveal delay={300}>
          <div className="flex flex-col sm:flex-row gap-12 md:gap-16 lg:gap-24 mt-24 mb-32 pt-8 border-t border-border/40 font-mono text-[10px] uppercase tracking-[0.2em]">
            <div className="flex flex-col">
              <span className="text-foreground font-medium text-xl md:text-2xl mb-2">{stats.total}</span> 
              <span className="text-muted-foreground">RESEARCH AREAS</span>
            </div>
            <div className="flex flex-col">
              <span className="text-foreground font-medium text-xl md:text-2xl mb-2">{stats.completed}</span> 
              <span className="text-muted-foreground">COMPLETED</span>
            </div>
            <div className="flex flex-col">
              <span className="text-foreground font-medium text-xl md:text-2xl mb-2">{stats.inProgress}</span> 
              <span className="text-muted-foreground">IN PROGRESS</span>
            </div>
            <div className="flex flex-col">
              <span className="text-foreground font-medium text-xl md:text-2xl mb-2">{stats.pending}</span> 
              <span className="text-muted-foreground">PENDING</span>
            </div>
          </div>
        </Reveal>

        {/* =========================================================
            03. RESEARCH PROGRAM
            ========================================================= */}
        <section className="mb-32">
          <Reveal>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-12">
              RESEARCH PROGRAM
            </div>
          </Reveal>

          <div className="flex flex-col border-b border-border/40">
            {RESEARCH_DATA.map((entry, index) => (
              <Reveal key={entry.id} delay={index * 150}>
                <ResearchRow entry={entry} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* =========================================================
            04. EDITORIAL CLOSING / CTA
            ========================================================= */}
        <section className="pt-24 pb-32">
          <Reveal>
            <p className="text-xl md:text-2xl font-light text-muted-foreground mb-10 max-w-2xl">
              Research is the foundation. Understanding comes before intervention.
            </p>
            
            <div className="border-t border-border/40 pt-10">
              <p className="text-base text-foreground mb-6">
                Have an observation worth investigating?
              </p>
              <Link 
                href="/contribute" 
                className="group inline-flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.15em] text-foreground transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
              >
                <span>Contribute to LR</span>
                <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </section>

      </main>
    </div>
  );
}