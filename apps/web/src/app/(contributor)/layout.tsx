import { Suspense } from 'react';
import Link from 'next/link';
import { ContributorNavbar } from '@/components/contributor/ContributorNavbar';
import { ContributorSidebar } from '@/components/contributor/ContributorSidebar';

import { OnboardingGuard } from '@/components/contributor/OnboardingGuard';

export default function ContributorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-foreground selection:text-background">
      <ContributorNavbar />
      
      <div className="flex-1 flex flex-col md:flex-row pt-[72px]">
        <ContributorSidebar />
        
        <main className="flex-1 w-full relative">
          <Suspense fallback={<div className="w-full flex justify-center py-24"><div className="w-4 h-4 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" /></div>}>
            <OnboardingGuard>
              {children}
            </OnboardingGuard>
          </Suspense>
        </main>
      </div>

      <footer className="border-t border-border/40 py-6 px-6 lg:px-8 mt-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>Life & Resilience</span>
          <span>Contributor Workspace</span>
          <span>Secure Session</span>
        </div>
      </footer>
    </div>
  );
}
