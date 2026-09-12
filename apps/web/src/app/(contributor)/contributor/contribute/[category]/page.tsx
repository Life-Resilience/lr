// app/contributor/contribute/[category]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ContributionForm from "@/components/contributor/ContributionForm";

const CATEGORY_META: Record<string, { title: string; hint: string }> = {
  experience: {
    title: "Experience",
    hint: "Tell us about something you experienced. Focus on what happened and why it mattered.",
  },
  observation: {
    title: "Observation",
    hint: "Share something you noticed or observed. Describe the context and who/what was involved.",
  },
  research: {
    title: "Research",
    hint: "Share findings, analysis, or structured research. Include your methods and sources.",
  },
  evidence: {
    title: "Evidence",
    hint: "Submit evidence that helps validate an existing problem or claim.",
  },
  idea: {
    title: "Idea",
    hint: "Propose a solution or direction. Explain how it would work and who might benefit.",
  },
  question: {
    title: "Question",
    hint: "Raise something that deserves further investigation. What remains unclear?",
  },
  pattern: {
    title: "Pattern",
    hint: "Describe a recurring behavior or friction. Where does it occur and how frequently?",
  },
  other: {
    title: "Other",
    hint: "Share something that doesn't fit the standard categories. Tell us why it matters.",
  },
};

export default function ContributionCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = (params.category as string).toLowerCase();
  
  // Mock save state for UI illustration purposes
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("saved");

  useEffect(() => {
    // Conceptual autosave simulation interval
    const interval = setInterval(() => {
      setSaveState("saving");
      setTimeout(() => setSaveState("saved"), 800);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!CATEGORY_META[categoryId]) {
    return (
      <div className="p-6 lg:p-12 max-w-3xl mx-auto w-full text-center flex flex-col items-center justify-center min-h-[50vh] gap-6 animate-in fade-in duration-300">
        <h1 className="text-2xl font-medium text-foreground uppercase tracking-tight">Contribution Type Not Found</h1>
        <p className="text-muted-foreground text-[15px]">This contribution type doesn&apos;t exist or is no longer available.</p>
        <div className="flex gap-6 mt-2">
          <Link href="/contributor/contribute" className="text-[12px] font-semibold uppercase tracking-widest text-background bg-foreground px-6 py-3 rounded-sm hover:bg-foreground/90 transition-colors">
            VIEW TYPES →
          </Link>
          <Link href="/contributor" className="text-[12px] font-semibold uppercase tracking-widest text-foreground hover:text-muted-foreground px-6 py-3 transition-colors">
            RETURN TO DASHBOARD
          </Link>
        </div>
      </div>
    );
  }

  const meta = CATEGORY_META[categoryId];

  const handleBackNavigation = () => {
    if (confirm("Leave contribution? Your progress is saved as a draft.")) {
      router.push('/contributor/contribute');
    }
  };

  return (
    <div className="p-6 lg:p-12 max-w-4xl mx-auto w-full pb-32 animate-in fade-in duration-300">
      
      {/* Top Navigation & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
        <button 
          onClick={handleBackNavigation}
          className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none w-fit"
        >
          ← BACK TO CONTRIBUTION TYPES
        </button>
        
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {saveState === "saving" ? (
            <span className="flex items-center gap-2 text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" /> Saving...
            </span>
          ) : saveState === "saved" ? (
            <span className="flex items-center gap-2 text-green-600 dark:text-green-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-500" /> Saved just now
            </span>
          ) : null}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-widest mb-12">
        <span className="text-muted-foreground flex items-center gap-2">
          <span className="text-foreground">✓</span> Choose Type
        </span>
        <span className="text-border">/</span>
        <span className="text-foreground font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground" /> Share
        </span>
        <span className="text-border">/</span>
        <span className="text-muted-foreground">Review</span>
        <span className="text-border">/</span>
        <span className="text-muted-foreground">Submit</span>
      </div>

      {/* Header */}
      <div className="mb-12 border-b border-border/40 pb-12">
        <div className="mb-6 flex flex-col gap-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          <span className="text-foreground">NEW CONTRIBUTION</span>
          <span>02 / 04</span>
        </div>
        <h1 className="text-[32px] md:text-[48px] font-medium tracking-tight text-foreground mb-4 uppercase">
          {meta.title}
        </h1>
        <p className="text-[16px] text-muted-foreground leading-relaxed max-w-2xl">
          {meta.hint}
        </p>
      </div>

      {/* Main Form Shell */}
      <div className="flex flex-col gap-8">
        <ContributionForm 
          initialCategory={meta.title} 
          onCancel={handleBackNavigation}
        />
        
        {/* Action Bar (Conceptual mapping for form controls) */}
        <div className="mt-8 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <button 
            onClick={() => router.push('/contributor')}
            className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors order-2 sm:order-1"
          >
            SAVE & EXIT
          </button>
          <button 
            onClick={() => console.log('Proceed to review')}
            className="w-full sm:w-auto bg-foreground text-background px-8 h-12 rounded-sm text-[12px] font-semibold uppercase tracking-widest hover:bg-foreground/90 transition-all flex items-center justify-center order-1 sm:order-2"
          >
            REVIEW CONTRIBUTION →
          </button>
        </div>
      </div>
      
    </div>
  );
}