'use client';

import { useEffect, useRef, useState, useMemo, ReactNode } from 'react';
import Link from 'next/link';

// ============================================================
// SCROLL REVEAL ANIMATION COMPONENT
// ============================================================
function Reveal({ 
  children, 
  delay = 0, 
  className = "" 
}: { 
  children: ReactNode; 
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
// REUSABLE COMPONENTS
// ============================================================
function SectionHeader({ number, title }: { number?: string, title: string }) {
  return (
    <div className="mb-12 flex items-baseline gap-4 border-b border-border/40 pb-6">
      {number && (
        <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
          {number}
        </span>
      )}
      {number && <span className="text-muted-foreground/40">—</span>}
      <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-foreground">
        {title}
      </h2>
    </div>
  );
}

function FlowArrow() {
  return <div className="text-border text-lg py-2">↓</div>;
}

// ============================================================
// WORKS CITED DATA
// ============================================================
const WORKS_CITED = [
  { id: 1, text: "Scam centers in the Mekong region: a strategic challenge for the EU", url: "https://www.frstrategie.org/en/publications/notes/scam-centers-mekong-region-strategic-challenge-european-union-2026" },
  { id: 2, text: "Transnational Crime and Geopolitical Contestation along the Mekong", url: "https://www.crisisgroup.org/rpt/asia/south-east-asia/myanmar/332-transnational-crime-and-geopolitical-contestation-mekong" },
  { id: 3, text: "Scam States: The Cybercrime-Corruption Complex in Southeast Asia", url: "https://www.amlrightsource.com/resources/scam-states-the-cybercrime-corruption-complex-in-southeast-asia-and-the-collapse-of-anti-money-laundering-enforcement" },
  { id: 4, text: "NHRC flags ₹52,976 crore cyber fraud losses, seeks urgent action", url: "https://www.thehindu.com/sci-tech/technology/nhrc-flags-52976-crore-cyber-fraud-losses-seeks-urgent-action-against-digital-arrest-scams/article71081619.ece" },
  { id: 5, text: "Cybercrime in India 2025 - INSIGHTS IAS", url: "https://www.insightsonindia.com/2026/02/21/cybercrime-in-india/" },
  { id: 6, text: "\"Digital Arrest\" Scams & MHA Action - The Prayas India", url: "https://theprayasindia.com/digital-arrest-scams-mha-action/" },
  { id: 7, text: "National cybercrime response mechanism - PIB", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2287674" },
  { id: 8, text: "Sanchar Saathi App: Telecom Empowerment at Citizens' Fingertips", url: "https://www.pib.gov.in/PressNoteDetails.aspx?NoteId=156294&ModuleId=3&Reg=6&lang=1" },
  { id: 9, text: "Android Accessibility Suite Threat Protection | Guardsquare", url: "https://www.guardsquare.com/blog/protecting-against-android-accessibility-services-threats" },
  { id: 10, text: "Android Accessibility Service Abuse - Hack Tricks", url: "https://hacktricks.wiki/en/mobile-pentesting/android-app-pentesting/accessibility-services-abuse.html" },
  { id: 11, text: "Golden-hour zero liability: the exact RBI math for cyber fraud - RTI Wiki", url: "https://righttoinformation.wiki/golden-hour-zero-liability-cyber-fraud-rbi-india" },
  { id: 12, text: "Master Circulars Official Website of Reserve Bank of India", url: "https://www.rbi.org.in/Scripts/BS_CircularIndexDisplay.aspx?Id=11040" },
  { id: 13, text: "Sanchar Saathi Portal 2026: Block Lost Phones & Fake SIMS", url: "https://tech.getinfotoyou.com/sanchar-saathi-portal-2026-guide-block-lost-phones" },
  { id: 14, text: "Curbing Cyber Frauds in Digital India - PIB", url: "https://www.pib.gov.in/PressNoteDetails.aspx?NoteId=155384&ModuleId=3" },
  { id: 15, text: "What's New in Android Security and Privacy in 2026 - Google Blog", url: "https://blog.google/security/whats-new-in-android-security-privacy-2026/" },
  { id: 16, text: "Android 16 fights phone scams with AI and on-call restrictions", url: "https://indianexpress.com/article/technology/tech-news-technology/android-16-safety-and-security-features-10003881/" },
  { id: 17, text: "Deepfake Detection Based on MFCC, Audio-Text Disconsistency", url: null }, 
  { id: 18, text: "Deepfake Audio Detection in Voice Authentication: A Spectral and Hybrid Approach", url: "https://etasr.com/index.php/ETASR/article/download/13400/5932/72644" },
  { id: 19, text: "Detection of Social Engineering Attacks Through Natural Language Processing", url: "https://www.researchgate.net/publication/301710179_Detection_of_Social_Engineering_Attacks_Through_Natural_Language_Processing_of_Conversations" },
  { id: 20, text: "Hybrid CNN-BiLSTM for Deepfake Voice Detection - IIETA", url: "https://www.iieta.org/journals/ijsse/paper/10.18280/ijsse.150907" },
  { id: 21, text: "(PDF) NLP and Deep Learning for Phishing and Social Engineering Detection", url: "https://www.researchgate.net/publication/399730936_NLP_and_Deep_Learning_for_Phishing_and_Social_Engineering_Detection_A_Systematic_Review_2018-2026" },
  { id: 22, text: "Permissions and APIs that Access Sensitive Information - Google Help", url: "https://support.google.com/googleplay/android-developer/answer/16558241?hl=en-GB" },
  { id: 23, text: "Android 16: Confirmed features, codename, leaks, release date", url: "https://www.androidauthority.com/android-16-features-3484159/" },
  { id: 24, text: "InCallService | API reference - Android Developers", url: "https://developer.android.com/reference/android/telecom/InCallService" },
  { id: 25, text: "What is the DPDP Act, 2023? India's Data Privacy Law - mini Orange", url: "https://www.miniorange.com/blog/what-is-dpdp-act/" },
  { id: 26, text: "Meity notifies final Digital Personal Data Protection Rules 2025", url: "https://www.barandbench.com/law-firms/view-point/meity-notifies-final-digital-personal-data-protection-rules-2025" },
  { id: 27, text: "Module 1: Foundations of DPDPA", url: "https://www.dpdpa.com/dpdpa-module-1.html" },
];

function SourceItem({ source }: { source: any }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 font-mono text-[10px] md:text-[11px] tracking-[0.05em] text-muted-foreground">
      <span className="shrink-0 text-foreground">[{String(source.id).padStart(2, '0')}]</span>
      {source.url ? (
        <a 
          href={source.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="group hover:text-foreground transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
        >
          <span className="text-foreground/90 group-hover:underline underline-offset-4 decoration-border/50 transition-all">{source.text}</span>
          <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
        </a>
      ) : (
        <span className="text-foreground/90">{source.text}</span>
      )}
    </div>
  );
}

function SectionSourceControl({ sourceIds }: { sourceIds: number[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const sources = sourceIds.map(id => WORKS_CITED.find(s => s.id === id)).filter(Boolean);

  if (sources.length === 0) return null;

  return (
    <div className="mt-12 border-t border-border/40 pt-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-8 rounded-sm"
      >
        <span>SOURCES · {String(sources.length).padStart(2, '0')}</span>
        <span className="text-sm font-light leading-none">{isOpen ? '−' : '+'}</span>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-500 ease-out motion-reduce:transition-none ${
          isOpen ? 'max-h-[800px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'
        }`}
      >
        <div className="flex flex-col gap-4">
          {sources.map((source: any) => (
            <SourceItem key={source.id} source={source} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TaxonomyRow({ 
  number, 
  title, 
  desc, 
  sourceIds 
}: { 
  number: string; 
  title: string; 
  desc: ReactNode; 
  sourceIds: number[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const sources = sourceIds.map(id => WORKS_CITED.find(s => s.id === id)).filter(Boolean);

  return (
    <div className="border-b border-border/40 py-8">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full text-left group grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-6 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-8 rounded-sm transition-colors"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">
          {number} / {title}
        </span>
        <div className="flex flex-col gap-6 border-l-0 md:border-l border-transparent group-hover:border-border/30 transition-colors md:pl-4 -ml-4">
          <div className="text-lg text-muted-foreground group-hover:text-foreground/90 transition-colors">
            {desc}
          </div>
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-500 ease-out motion-reduce:transition-none ${isOpen ? 'max-h-[800px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
        <div className="md:ml-[224px]">
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
            <span>SOURCES · {String(sources.length).padStart(2, '0')}</span>
            <span className="text-sm font-light leading-none">−</span>
          </div>
          <div className="flex flex-col gap-4">
            {sources.map((source: any) => (
              <SourceItem key={source.id} source={source} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE COMPONENT
// ============================================================
export default function SocialEngineeringPage() {
  const [activeSection, setActiveSection] = useState<string>('summary');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showAllSources, setShowAllSources] = useState(false);

  // Define sections for ScrollSpy (Citations now fully integrated)
  const sections = useMemo(() => [
    { id: 'summary', title: 'Executive Summary', label: 'Executive Summary' },
    { id: 'scale', title: '01 Macro Scale', label: '01 Macro Scale' },
    { id: 'problem', title: '02 The Problem', label: '02 The Problem' },
    { id: 'journey', title: '03 Attack Journey', label: '03 Attack Journey' },
    { id: 'taxonomy', title: '04 Taxonomy', label: '04 Taxonomy' },
    { id: 'psychology', title: '05 Psychology', label: '05 Psychology' },
    { id: 'protection', title: '06 Protection', label: '06 Protection' },
    { id: 'gap', title: '07 Protection Gap', label: '07 Protection Gap' },
    { id: 'direction', title: '08 Research Direction', label: '08 Research Direction' },
    { id: 'feasibility', title: '09 Feasibility', label: '09 Feasibility' },
    { id: 'success', title: '10 Success Criteria', label: '10 Success Criteria' },
    { id: 'conclusion', title: '11 Conclusion', label: '11 Conclusion' },
    { id: 'citations', title: 'Works Cited', label: 'Works Cited', isCitation: true },
  ], []);

  // Reading Progress Logic
  useEffect(() => {
    const updateProgress = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress((scrollY / docHeight) * 100);
      }
    };
    
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  // ScrollSpy via IntersectionObserver
  useEffect(() => {
    const sectionIds = sections.map(s => s.id);
    
    const observer = new IntersectionObserver(
      (entries) => {
        // We only care about intersecting entries
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // If multiple are visible, pick the first one (top-most)
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      // Root margin triggers active state when section hits top 20% of screen, stays active until 60% up.
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      // Optimistically set active to prevent lag
      setActiveSection(id);
    }
  };

  const visibleWorksCited = showAllSources ? WORKS_CITED : WORKS_CITED.slice(0, 5);

  return (
    <div className="w-full bg-background selection:bg-foreground selection:text-background min-h-screen relative">
      
      {/* =========================================================
          READING PROGRESS
          ========================================================= */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-50 pointer-events-none bg-border/20">
        <div 
           className="h-full bg-foreground transition-all duration-150 ease-out"
           style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* =========================================================
          PAGE HEADER
          ========================================================= */}
      <header className="border-b border-border/40 pt-32 pb-16">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-12">
          <Reveal delay={0}>
            <div className="mb-12 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <Link href="/research" className="w-fit hover:text-foreground transition-colors mb-6 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm">
                ← BACK TO RESEARCH
              </Link>
              <div className="flex gap-4">
                <span className="text-foreground">LR / RESEARCH</span>
                <span>LR-01</span>
              </div>
            </div>
          </Reveal>
          
          <Reveal delay={100}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-foreground mb-12 leading-[1.05] max-w-4xl">
              Social Engineering & Impersonation Attacks In India
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 font-mono text-[10px] uppercase tracking-[0.2em]">
              <div className="flex flex-col gap-2 border-l border-border/60 pl-4">
                <span className="text-muted-foreground">Research Status</span>
                <span className="text-foreground font-medium">COMPLETED</span>
              </div>
              <div className="flex flex-col gap-2 border-l border-border/60 pl-4">
                <span className="text-muted-foreground">Validation</span>
                <span className="text-foreground font-medium">26 Aug 2026</span>
              </div>
              <div className="flex flex-col gap-2 border-l border-border/60 pl-4">
                <span className="text-muted-foreground">Scope</span>
                <span className="text-foreground font-medium">India</span>
              </div>
              <div className="flex flex-col gap-2 border-l border-border/60 pl-4">
                <span className="text-muted-foreground">Attack Types</span>
                <span className="text-foreground font-medium">05</span>
              </div>
              <div className="flex flex-col gap-2 border-l border-border/60 pl-4">
                <span className="text-muted-foreground">Sources</span>
                <a href="#citations" onClick={(e) => handleNavClick(e, 'citations')} className="text-foreground font-medium hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm w-fit">27 ↗</a>
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      {/* =========================================================
          MAIN LAYOUT (SIDEBAR + CONTENT)
          ========================================================= */}
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-12 pt-16 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-16 lg:gap-24 relative">
          
          {/* DESKTOP SIDEBAR INDEX */}
          <aside className="hidden lg:block">
            <nav className="sticky top-32 flex flex-col gap-4 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
              <span className="text-foreground font-medium mb-4 tracking-[0.2em]">Contents</span>
              {sections.map(section => {
                const isActive = activeSection === section.id;
                
                // Special styling for Citations Section to maintain editorial separation
                if (section.isCitation) {
                  return (
                    <a 
                      key={section.id}
                      href={`#${section.id}`} 
                      onClick={(e) => handleNavClick(e, section.id)} 
                      className="flex items-center gap-2 mt-8 border-t border-border/40 pt-4 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
                    >
                       <span className="inline-block w-3 text-center transition-colors duration-300">
                         {isActive ? <span className="text-foreground">●</span> : ''}
                       </span>
                       <span className={`transition-colors duration-300 ${isActive ? 'border-b border-foreground/30 pb-[1px] text-foreground' : 'text-muted-foreground group-hover:text-foreground/70'}`}>
                         {section.label}
                       </span>
                    </a>
                  );
                }

                return (
                  <a 
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(e) => handleNavClick(e, section.id)}
                    className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
                  >
                    <span className="inline-block w-3 text-center transition-colors duration-300">
                      {isActive ? <span className="text-foreground">●</span> : ''}
                    </span>
                    <span className={`transition-colors duration-300 ${isActive ? 'border-b border-foreground/30 pb-[1px] text-foreground' : 'text-muted-foreground group-hover:text-foreground/70'}`}>
                      {section.label}
                    </span>
                  </a>
                );
              })}
            </nav>
          </aside>

          {/* MOBILE INDEX */}
          <Reveal className="lg:hidden mb-12">
            <div className="border border-border/40 p-6 flex flex-col gap-4 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
              <span className="text-foreground font-medium tracking-[0.2em] border-b border-border/40 pb-4">Contents</span>
              {sections.map(section => {
                const isActive = activeSection === section.id;
                
                // Special styling for Citations Section on mobile
                if (section.isCitation) {
                  return (
                    <a 
                      key={section.id}
                      href={`#${section.id}`} 
                      onClick={(e) => handleNavClick(e, section.id)} 
                      className="flex items-center gap-2 mt-2 border-t border-border/40 pt-4 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
                    >
                      <span className="inline-block w-3 text-center transition-colors duration-300">
                        {isActive ? <span className="text-foreground">●</span> : ''}
                      </span>
                      <span className={`transition-colors duration-300 ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground/70'}`}>
                        {section.label}
                      </span>
                    </a>
                  );
                }

                return (
                  <a 
                    key={section.id}
                    href={`#${section.id}`} 
                    onClick={(e) => handleNavClick(e, section.id)}
                    className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
                  >
                    <span className="inline-block w-3 text-center transition-colors duration-300">
                      {isActive ? <span className="text-foreground">●</span> : ''}
                    </span>
                    <span className={`transition-colors duration-300 ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground/70'}`}>
                      {section.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </Reveal>

          {/* CONTENT SECTIONS */}
          <main className="flex flex-col gap-24 md:gap-32">
            
            {/* EXECUTIVE SUMMARY */}
            <section id="summary" className="scroll-mt-32">
              <Reveal>
                <SectionHeader title="Executive Summary" />
                <h3 className="text-2xl md:text-4xl font-medium tracking-tight leading-tight text-foreground mb-8">
                  Social engineering is not fundamentally a problem of broken encryption, vulnerable servers, or malware.
                </h3>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  It is a problem in which an attacker persuades a legitimate user to perform the dangerous action themselves. That action may involve giving an OTP, revealing a PIN or password, transferring money, installing an APK, granting remote access, opening a fraudulent website, or approving a UPI transaction.
                </p>
                <SectionSourceControl sourceIds={[1]} />
              </Reveal>
            </section>

            {/* 01 MACRO SCALE */}
            <section id="scale" className="scroll-mt-32 border-t border-border/40 pt-16">
              <Reveal>
                <SectionHeader number="01" title="The Scale of the Crisis" />
                <div className="mb-12">
                   <h3 className="text-[clamp(3rem,8vw,6rem)] font-medium text-foreground leading-none tracking-tight">
                     ₹52,976
                   </h3>
                   <span className="block text-2xl md:text-3xl font-medium text-foreground tracking-widest mt-2 mb-4">CRORE</span>
                   <p className="text-lg md:text-xl text-muted-foreground max-w-lg">Cumulative cyber-enabled fraud losses over six years.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-16 border-t border-border/40 pt-12">
                  <div className="flex flex-col gap-2">
                    <span className="text-3xl md:text-4xl font-medium text-foreground">₹22,495 <span className="text-xl">CRORE</span></span>
                    <span className="text-sm font-mono uppercase tracking-[0.1em] text-muted-foreground mt-2">Reported losses in 2025</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-3xl md:text-4xl font-medium text-foreground">₹1,935.51 <span className="text-xl">CRORE</span></span>
                    <span className="text-sm font-mono uppercase tracking-[0.1em] text-muted-foreground mt-2">Digital Arrest losses in 2024</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-3xl md:text-4xl font-medium text-foreground">53.8L+ <span className="text-xl">COMPLAINTS</span></span>
                    <span className="text-sm font-mono uppercase tracking-[0.1em] text-muted-foreground mt-2">FY2023–24 → FY2025–26</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-3xl md:text-4xl font-medium text-foreground">₹56,087 <span className="text-xl">CRORE+</span></span>
                    <span className="text-sm font-mono uppercase tracking-[0.1em] text-muted-foreground mt-2">Reported amounts (FY23-24 to 25-26)</span>
                  </div>
                </div>

                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground flex flex-col gap-2 border-l border-primary pl-4">
                  <span>28.15 LAKH CASES · 2025</span>
                </div>
                
                <SectionSourceControl sourceIds={[4, 5, 6]} />
              </Reveal>
            </section>

            {/* 02 THE PROBLEM */}
            <section id="problem" className="scroll-mt-32 border-t border-border/40 pt-16">
              <Reveal>
                <SectionHeader number="02" title="The Problem" />
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12">
                  These attacks are not entirely independent problems, but rather variants of a common manipulation architecture. The attack operates across four primary layers:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 font-mono text-[13px] uppercase tracking-[0.1em] text-foreground">
                  <div className="border-t border-border/40 pt-4">Identity Manipulation</div>
                  <div className="border-t border-border/40 pt-4">Credential Manipulation</div>
                  <div className="border-t border-border/40 pt-4">Device Manipulation</div>
                  <div className="border-t border-border/40 pt-4">Financial Manipulation</div>
                </div>
              </Reveal>
            </section>

            {/* 03 ATTACK JOURNEY */}
            <section id="journey" className="scroll-mt-32 border-t border-border/40 pt-16">
              <Reveal>
                <SectionHeader number="03" title="Attack Journey" />
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-16">
                  The attack rarely consists of one malicious event; it is a carefully constructed sequence designed to establish credibility, create pressure, and convert that pressure into a concrete action.
                </p>
                <div className="flex flex-col items-center text-center font-mono text-[13px] uppercase tracking-[0.2em] text-muted-foreground">
                  <div>01 CONTACT</div>
                  <FlowArrow />
                  <div>02 IDENTITY CLAIM</div>
                  <FlowArrow />
                  <div>03 PROBLEM CREATED</div>
                  <FlowArrow />
                  <div>04 AUTHORITY</div>
                  <FlowArrow />
                  <div>05 FEAR / URGENCY</div>
                  <FlowArrow />
                  <div className="text-foreground font-medium">06 ISOLATION</div>
                  <FlowArrow />
                  <div>07 INFORMATION</div>
                  <FlowArrow />
                  <div>08 DEVICE / ACCOUNT</div>
                  <FlowArrow />
                  <div>09 FINANCIAL ACTION</div>
                  <FlowArrow />
                  <div className="text-foreground font-bold text-base md:text-lg tracking-[0.25em] mt-4 border-b border-foreground pb-2">10 MONEY MOVEMENT</div>
                </div>
              </Reveal>
              
              <Reveal delay={200}>
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                  <div className="border-t border-border/40 pt-6">
                     <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-4">LEVEL 01 / INFORMATION</span>
                     <p className="text-sm text-foreground">[Aadhaar Redacted], PAN, OTP, Credentials</p>
                  </div>
                  <div className="border-t border-border/40 pt-6">
                     <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-4">LEVEL 02 / DEVICE ACCESS</span>
                     <p className="text-sm text-foreground">Remote access, APK, Accessibility</p>
                  </div>
                  <div className="border-t border-border/40 pt-6">
                     <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary font-medium block mb-4">LEVEL 03 / FINANCIAL ACTION</span>
                     <p className="text-sm text-foreground">UPI, RTGS, Bank transfer</p>
                  </div>
                </div>
                <div className="mt-8 text-center md:text-right">
                   <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">ULTIMATE OBJECTIVE: Rapid liquidation of available assets</p>
                </div>
              </Reveal>
            </section>

            {/* 04 ATTACK TAXONOMY */}
            <section id="taxonomy" className="scroll-mt-32 border-t border-border/40 pt-16">
              <Reveal>
                <SectionHeader number="04" title="Attack Taxonomy" />
                <div className="flex flex-col border-t border-border/40">
                  <TaxonomyRow 
                    number="01" 
                    title="DIGITAL ARREST" 
                    desc="Escalation from an unknown call through impersonation, video calls, isolation and eventually financial demands." 
                    sourceIds={[6]}
                  />
                  <TaxonomyRow 
                    number="02" 
                    title="FAKE KYC" 
                    desc={
                      <div className="flex flex-col gap-6">
                        <p>Leverages cross-channel movement to bypass singular security views.</p>
                        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground">
                          <span>SMS</span><span className="text-border">→</span>
                          <span>Call</span><span className="text-border">→</span>
                          <span>WhatsApp</span><span className="text-border">→</span>
                          <span>Website</span><span className="text-border">→</span>
                          <span>Payment</span>
                        </div>
                      </div>
                    }
                    sourceIds={[13]}
                  />
                  <TaxonomyRow 
                    number="03" 
                    title="OTP THEFT" 
                    desc="Bypassing MFA through real-time deception." 
                    sourceIds={[10]}
                  />
                  <TaxonomyRow 
                    number="04" 
                    title="GOV IMPERSONATION" 
                    desc="Exploiting trust and bureaucratic authority." 
                    sourceIds={[7]}
                  />
                  <TaxonomyRow 
                    number="05" 
                    title="REMOTE COERCION" 
                    desc="Using legitimate screen-sharing and remote administration tools precisely as designed, rendering malware detection ineffective." 
                    sourceIds={[9, 10]}
                  />
                </div>
              </Reveal>
            </section>

            {/* 05 HUMAN PSYCHOLOGY */}
            <section id="psychology" className="scroll-mt-32 border-t border-border/40 pt-16">
              <Reveal>
                <SectionHeader number="05" title="Human Psychology" />
                <div className="flex flex-wrap items-center gap-4 text-xl md:text-3xl font-medium tracking-widest uppercase text-foreground mb-16">
                  <span>AUTHORITY</span>
                  <span className="text-muted-foreground font-light">+</span>
                  <span>FEAR</span>
                  <span className="text-muted-foreground font-light">+</span>
                  <span>URGENCY</span>
                  <span className="text-muted-foreground font-light">+</span>
                  <span className="text-foreground border-b-2 border-foreground pb-1">ISOLATION</span>
                </div>
                
                <div className="border-l-2 border-foreground pl-6 py-2 mb-8">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-4">THE CRITICAL VARIABLE</span>
                  <h3 className="text-2xl md:text-3xl font-medium text-foreground mb-6 tracking-tight">ISOLATION</h3>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    The attacker doesn&apos;t only create fear. They remove the victim&apos;s ability to independently verify reality by telling them not to contact family, banks, or anyone else. 
                  </p>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-4 italic">
                    The victim is no longer asking &quot;Should I send money?&quot; but rather &quot;How do I prove that I am innocent?&quot;
                  </p>
                </div>
              </Reveal>
            </section>

            {/* 06 EXISTING PROTECTION */}
            <section id="protection" className="scroll-mt-32 border-t border-border/40 pt-16">
              <Reveal>
                <SectionHeader number="06" title="Existing Protection Landscape" />
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-16 max-w-3xl">
                  India&apos;s protection environment is stronger and more rapidly evolving than it is sometimes portrayed. Institutional interventions are actively preventing and recovering significant financial losses.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                  <div className="p-8 border border-border/40 flex flex-col gap-3">
                    <span className="text-3xl md:text-4xl font-medium text-foreground">₹11,158 <span className="text-xl">CRORE</span></span>
                    <span className="text-sm font-mono uppercase tracking-[0.1em] text-muted-foreground mt-2">Saved via CFCFRMS/1930 helpline across 32.80 lakh+ interventions</span>
                  </div>
                  <div className="p-8 border border-border/40 flex flex-col gap-3">
                    <span className="text-3xl md:text-4xl font-medium text-foreground">₹475 <span className="text-xl">CRORE</span></span>
                    <span className="text-sm font-mono uppercase tracking-[0.1em] text-muted-foreground mt-2">Losses prevented through DoT&apos;s Financial Fraud Risk Indicator (FRI)</span>
                  </div>
                  <div className="p-8 border border-border/40 flex flex-col gap-3">
                    <span className="text-3xl md:text-4xl font-medium text-foreground">3.19 <span className="text-xl">LAKH+</span></span>
                    <span className="text-sm font-mono uppercase tracking-[0.1em] text-muted-foreground mt-2">Devices disconnected via Sanchar Saathi</span>
                  </div>
                </div>

                <div className="flex flex-col gap-12 font-mono text-[12px] uppercase tracking-[0.15em] relative pl-4 border-l border-border/40">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-foreground" />
                    <span className="text-muted-foreground block mb-2">TELECOM</span>
                    <span className="text-foreground text-sm">DoT / Sanchar Saathi / FRI</span>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-foreground" />
                    <span className="text-muted-foreground block mb-2">IDENTITY / CYBERCRIME</span>
                    <span className="text-foreground text-sm">I4C / NCRP / 1930 / CFCFRMS</span>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-foreground" />
                    <span className="text-muted-foreground block mb-2">DEVICE</span>
                    <span className="text-foreground text-sm">Android / Google</span>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-foreground" />
                    <span className="text-muted-foreground block mb-2">CALLER INTELLIGENCE</span>
                    <span className="text-foreground text-sm">Truecaller</span>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-foreground" />
                    <span className="text-muted-foreground block mb-2">FINANCIAL</span>
                    <span className="text-foreground text-sm">Banks / UPI</span>
                  </div>
                </div>
                
                <p className="mt-16 text-lg text-muted-foreground italic border-t border-border/40 pt-8 max-w-2xl">
                  These systems are valuable, but they operate at different points in the attack.
                </p>
                <SectionSourceControl sourceIds={[7, 8, 11, 14, 15, 16]} />
              </Reveal>
            </section>

            {/* 07 THE ACTUAL PROTECTION GAP */}
            <section id="gap" className="scroll-mt-32 bg-muted/20 -mx-6 md:-mx-10 lg:-mx-12 px-6 md:px-10 lg:px-12 py-16 lg:py-32 border-y border-border/40">
              <Reveal>
                <SectionHeader number="07" title="The Protection Gap" />
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight text-foreground mb-24 max-w-4xl">
                  Who protects the user while the scammer is actively talking to them?
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                  
                  <div className="flex flex-col items-center justify-center gap-4 text-center font-mono text-[11px] sm:text-[13px] uppercase tracking-[0.2em] text-muted-foreground border border-border/40 p-12 bg-background">
                    <div>CALL</div>
                    <FlowArrow />
                    <div>PRESSURE</div>
                    <FlowArrow />
                    <div>ISOLATION</div>
                    <FlowArrow />
                    <div>REMOTE ACCESS</div>
                    <FlowArrow />
                    <div>BANKING</div>
                    <FlowArrow />
                    <div className="text-foreground font-medium">TRANSFER</div>
                  </div>

                  <div className="flex flex-col justify-center h-full gap-16">
                     <div>
                       <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-4 border-b border-border/40 pb-2">EXISTING SYSTEMS</span>
                       <p className="text-xl md:text-2xl text-foreground">individual signals</p>
                     </div>
                     
                     <div className="text-2xl font-mono text-border pl-4 border-l border-border/40">VS.</div>
                     
                     <div>
                       <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground block mb-4 border-b border-foreground/40 pb-2">UNRESOLVED PROBLEM</span>
                       <p className="text-xl md:text-2xl text-foreground">the complete manipulation journey</p>
                     </div>
                  </div>
                </div>
              </Reveal>
            </section>

            {/* 08 RESEARCH DIRECTION */}
            <section id="direction" className="scroll-mt-32 border-t border-border/40 pt-16">
              <Reveal>
                <SectionHeader number="08" title="Research Direction" />
                <div className="flex flex-col gap-12 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-[150px_minmax(0,1fr)] gap-4 sm:gap-8 items-baseline">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">OBSERVED PROBLEM</span>
                    <p>Existing cybersecurity systems are increasingly effective at identifying individual malicious signals.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-[150px_minmax(0,1fr)] gap-4 sm:gap-8 items-baseline">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">RESEARCH HYPOTHESIS</span>
                    <p>The unresolved challenge is recognizing when those individual signals combine into a manipulation journey designed to change a person&apos;s decision.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-[150px_minmax(0,1fr)] gap-4 sm:gap-8 items-baseline border-t border-border/40 pt-8">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">RESEARCH DIRECTION</span>
                    <div className="flex items-center gap-4 font-mono text-[12px] md:text-[14px] uppercase tracking-[0.2em] text-foreground">
                      <span>Sequence</span>
                      <span className="text-border">→</span>
                      <span>Context</span>
                      <span className="text-border">→</span>
                      <span>Risk</span>
                    </div>
                  </div>
                  
                </div>
              </Reveal>
            </section>

            {/* 09 TECHNICAL FEASIBILITY */}
            <section id="feasibility" className="scroll-mt-32 border-t border-border/40 pt-16">
              <Reveal>
                <SectionHeader number="09" title="Technical Feasibility" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
                  <div className="border border-border/40 p-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">SIGNAL 01</span>
                    <h4 className="text-sm font-medium uppercase tracking-[0.1em] text-foreground">Acoustic / Deepfake Indicators</h4>
                  </div>
                  <div className="border border-border/40 p-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">SIGNAL 02</span>
                    <h4 className="text-sm font-medium uppercase tracking-[0.1em] text-foreground">Coercive Language</h4>
                  </div>
                  <div className="border border-border/40 p-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">SIGNAL 03</span>
                    <h4 className="text-sm font-medium uppercase tracking-[0.1em] text-foreground">Call Duration</h4>
                  </div>
                  <div className="border border-border/40 p-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">SIGNAL 04</span>
                    <h4 className="text-sm font-medium uppercase tracking-[0.1em] text-foreground">VoIP Context</h4>
                  </div>
                  <div className="border border-border/40 p-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">SIGNAL 05</span>
                    <h4 className="text-sm font-medium uppercase tracking-[0.1em] text-foreground">Banking-App Access</h4>
                  </div>
                  <div className="border border-border/40 p-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">SIGNAL 06</span>
                    <h4 className="text-sm font-medium uppercase tracking-[0.1em] text-foreground">Cross-Channel Behaviour</h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border/40 pt-12">
                  <div>
                    <h4 className="text-sm font-mono uppercase tracking-[0.15em] text-foreground mb-4">On-Device</h4>
                    <p className="text-sm text-muted-foreground">On-device inference is technically feasible. Sensitive contextual inference should remain local.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-mono uppercase tracking-[0.15em] text-foreground mb-4">Privacy</h4>
                    <p className="text-sm text-muted-foreground">Send intelligence to the device; do not send the user&apos;s private life to the intelligence engine.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-mono uppercase tracking-[0.15em] text-foreground mb-4">Platform Boundaries</h4>
                    <p className="text-sm text-muted-foreground">Work within platform security boundaries rather than depending on unrestricted access to full cellular call audio or core AccessibilityService dependencies.</p>
                  </div>
                </div>
                
                <SectionSourceControl sourceIds={[18, 19, 20, 21, 22, 23, 24, 25, 26]} />
              </Reveal>
            </section>

            {/* 10 WHAT SUCCESS MEANS */}
            <section id="success" className="scroll-mt-32 border-t border-border/40 pt-16">
              <Reveal>
                <SectionHeader number="10" title="What Success Means" />
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground mb-12">
                  Prevented<br/>irreversible actions.
                </h3>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                  Success is not measured by detection alone, but by stopping the irreversible action, whether that action is an OTP disclosure, a high-value transfer, or an APK installation.
                </p>
              </Reveal>
            </section>

            {/* 11 CONCLUSION */}
            <section id="conclusion" className="scroll-mt-32 border-t border-border/40 pt-16 pb-16">
              <Reveal>
                <SectionHeader number="11" title="Conclusion" />
                <div className="flex flex-col gap-16 md:gap-24 text-center items-center">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 text-xl md:text-3xl font-medium tracking-tight text-muted-foreground">
                    <span>What is technically happening?</span>
                    <span className="text-border">VS</span>
                    <span className="text-foreground">What is happening to the person?</span>
                  </div>
                  
                  <div className="w-full max-w-sm h-px bg-border/40 my-4" />
                  
                  <h2 className="text-[clamp(2rem,6vw,5.5rem)] font-medium leading-[1.05] tracking-tight text-foreground max-w-5xl">
                    Make the person pause before the irreversible action.
                  </h2>
                </div>
              </Reveal>
            </section>

            {/* WORKS CITED */}
            <section id="citations" className="scroll-mt-32 border-t border-border/40 pt-16">
              <Reveal>
                <div className="mb-12 flex items-baseline gap-4 border-b border-border/40 pb-6">
                  <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-foreground">
                    Works Cited
                  </h2>
                  <span className="text-muted-foreground/40">—</span>
                  <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
                    {WORKS_CITED.length} SOURCES
                  </span>
                </div>
                
                <div className="flex flex-col gap-4">
                  {visibleWorksCited.map((source) => (
                    <div key={source.id} className="pb-2">
                       <SourceItem source={source} />
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-4">
                  <button 
                    onClick={() => setShowAllSources(!showAllSources)}
                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
                  >
                    {showAllSources ? 'SHOW FEWER SOURCES' : `SHOW ALL SOURCES · ${WORKS_CITED.length}`}
                  </button>
                </div>
              </Reveal>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}