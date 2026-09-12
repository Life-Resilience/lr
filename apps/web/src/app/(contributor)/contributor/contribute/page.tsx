// app/contributor/contribute/page.tsx
"use client";

import Link from "next/link";

const CATEGORY_GROUPS = [
  {
    title: "Your Experience",
    items: [
      {
        id: "experience",
        number: "01",
        name: "Experience",
        description: "Share something you personally experienced.",
      },
      {
        id: "observation",
        number: "02",
        name: "Observation",
        description: "Share something you noticed or observed, but did not necessarily experience yourself.",
      },
    ],
  },
  {
    title: "Research & Evidence",
    items: [
      {
        id: "research",
        number: "03",
        name: "Research",
        description: "Share findings, studies, analysis, or structured research.",
      },
      {
        id: "evidence",
        number: "04",
        name: "Evidence",
        description: "Submit evidence that helps validate an existing problem or claim.",
      },
      {
        id: "pattern",
        number: "07",
        name: "Pattern",
        description: "Describe a recurring behavior, friction, or pattern you've identified.",
      },
    ],
  },
  {
    title: "Ideas & Questions",
    items: [
      {
        id: "idea",
        number: "05",
        name: "Idea",
        description: "Propose a solution, concept, or possible direction.",
      },
      {
        id: "question",
        number: "06",
        name: "Question",
        description: "Raise something that deserves further investigation.",
      },
    ],
  },
  {
    title: "Other",
    items: [
      {
        id: "other",
        number: "08",
        name: "Other",
        description: "Share something that doesn't fit the categories above.",
      },
    ],
  },
];

export default function CategorySelectionPage() {
  return (
    <div className="p-6 lg:p-12 max-w-5xl mx-auto w-full pb-32 animate-in fade-in duration-300">
      {/* Progress Indicator */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-widest mb-12">
        <span className="text-foreground font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground" /> Choose Type
        </span>
        <span className="text-border">/</span>
        <span className="text-muted-foreground">Share</span>
        <span className="text-border">/</span>
        <span className="text-muted-foreground">Review</span>
        <span className="text-border">/</span>
        <span className="text-muted-foreground">Submit</span>
      </div>

      <div className="mb-16">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground mb-4 uppercase">
          New Contribution
        </h1>
        <p className="text-[16px] text-muted-foreground max-w-2xl leading-relaxed">
          Choose the type that best describes what you want to share. You can change your choice before submitting.
        </p>
      </div>

      <div className="flex flex-col gap-16">
        {CATEGORY_GROUPS.map((group) => (
          <section key={group.title} className="flex flex-col gap-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-3">
              {group.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {group.items.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/contributor/contribute/${cat.id}`}
                  className="group flex flex-col justify-between gap-6 border border-border/40 bg-muted/5 p-6 md:p-8 rounded-sm hover:border-foreground/30 hover:bg-muted/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99]"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      {cat.number}
                    </span>
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 transform group-hover:translate-x-1" aria-hidden="true">
                      →
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[18px] font-medium tracking-tight text-foreground uppercase">
                      {cat.name}
                    </h3>
                    <p className="text-[14px] text-muted-foreground leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Escape Hatch / Help Section */}
      <div className="mt-20 pt-8 border-t border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-muted/20 p-6 md:p-8 rounded-sm">
        <div className="flex flex-col gap-1.5">
          <span className="text-[14px] font-medium text-foreground">Not sure which type to choose?</span>
          <span className="text-[13.5px] text-muted-foreground">
            Choose <strong className="text-foreground font-medium">Other</strong> — you can describe what you&apos;re trying to share and LR can classify it later.
          </span>
        </div>
        <Link 
          href="/contributor/contribute/other" 
          className="text-[12px] font-semibold uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors whitespace-nowrap"
        >
          START OTHER →
        </Link>
      </div>
    </div>
  );
}