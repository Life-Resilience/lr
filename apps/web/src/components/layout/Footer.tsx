'use client';

import Link from 'next/link';
import Image from 'next/image';

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

function ThemeLogo() {
  return (
    <>
      <Image
        src="/lr-logo-light.svg"
        alt="LR"
        width={44}
        height={44}
        className="h-13 w-auto logo-light"
      />
      <Image
        src="/lr-logo-dark.svg"
        alt="LR"
        width={44}
        height={44}
        className="h-13 w-auto logo-dark"
      />
    </>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex w-fit items-center text-[13px] text-muted-foreground transition-colors duration-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="ml-2 -translate-x-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
      >
        →
      </span>
    </Link>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background pb-12 pt-20 md:pb-16 md:pt-24">
      <div className="mx-auto flex max-w-[1320px] flex-col px-6 sm:px-8 lg:px-10">
        
        {/* =========================================================
            TOP SECTION: BRAND & NAVIGATION
            ========================================================= */}
        <div className="flex flex-col justify-between gap-16 md:flex-row md:gap-8">
          
          {/* Brand & Mission */}
          <div className="flex max-w-sm flex-col items-start">
            <Link
              href="/"
              aria-label="LR Research — Home"
              className="mb-8 block transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
            >

              <ThemeLogo />
            </Link>
            
            <div className="flex flex-col gap-2">
              <span className="text-[12px] font-medium tracking-[0.08em] text-foreground">
                LR RESEARCH
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">
                A growing body of security research focused on understanding digital threats, human vulnerability, and the systems around them.
              </p>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="flex flex-col gap-12 sm:flex-row sm:gap-24 md:gap-16 lg:gap-32">
            
            {/* Navigation Column */}
            <div className="flex flex-col gap-5">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-foreground">
                Navigation
              </span>
              <nav className="flex flex-col gap-3" aria-label="Footer Navigation">
                <FooterLink href="/research">Research</FooterLink>
                <FooterLink href="/opportunities">Opportunities</FooterLink>
                <FooterLink href="/about">About</FooterLink>
                <FooterLink href="/progress">Progress</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
                <FooterLink href="/contribute">Contribute</FooterLink>
              </nav>
            </div>

            {/* Research Areas Column */}
            <div className="flex flex-col gap-5">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-foreground">
                Research Areas
              </span>
              <nav className="flex flex-col gap-3" aria-label="Footer Research Areas">
                {RESEARCH_AREAS.map((area) => (
                  <FooterLink key={area.id} href={`/research/${area.slug}`}>
                    {area.number} {area.title}
                  </FooterLink>
                ))}
              </nav>
            </div>

            {/* Authentication Column */}
            <div className="flex flex-col gap-5">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-foreground">
                Join LR
              </span>
              <nav className="flex flex-col gap-3" aria-label="Footer Authentication">
                <FooterLink href="/contribute/signup">Join LR / Sign Up</FooterLink>
                <FooterLink href="/contribute/login">Log In</FooterLink>
              </nav>
            </div>
          </div>
        </div>

        {/* =========================================================
            BOTTOM SECTION: LEGAL & STATUS
            ========================================================= */}
        <div className="mt-20 flex flex-col items-start justify-between gap-8 border-t border-border/40 pt-8 md:flex-row md:items-end">
          
          {/* Copyright & Legal */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <p className="text-[12px] text-muted-foreground">
              © {currentYear} Life & Resilience.
            </p>
            <div className="flex items-center gap-6 text-[12px]">
              <Link 
                href="/privacy" 
                className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
              >
                Privacy
              </Link>
              <Link 
                href="/terms" 
                className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm"
              >
                Terms
              </Link>
            </div>
          </div>

          {/* Research Status Identity */}
          <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.12em] text-muted-foreground md:pb-1">
            <span>RESEARCH STATUS</span>
            <span className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5 items-center justify-center" aria-hidden="true">
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-foreground opacity-80"></span>
              </span>
              <span className="text-foreground font-medium">IN PROGRESS</span>
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}