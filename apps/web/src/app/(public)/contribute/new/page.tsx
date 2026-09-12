import { Suspense } from "react";
import ContributeFormWrapper from "@/components/contributor/ContributeFormWrapper";

export default function PublicNewContributionPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 sm:px-8 lg:px-10 py-24 min-h-screen">
      <div className="mb-12">
        <div className="mb-8 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <a href="/contribute" className="hover:text-foreground transition-colors">
            ← BACK TO CONTRIBUTE
          </a>
        </div>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-4">
          New Contribution
        </h1>
        <p className="text-muted-foreground text-lg">
          Share your experience, observation, research, or idea. You can start writing now and save your draft.
        </p>
      </div>

      <Suspense fallback={<div className="animate-pulse">Loading form...</div>}>
        <ContributeFormWrapper />
      </Suspense>
    </div>
  );
}
