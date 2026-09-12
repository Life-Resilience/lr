"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  {
    id: "experience",
    name: "Experience",
    description: "Share something you personally experienced.",
  },
  {
    id: "observation",
    name: "Observation",
    description: "Share something you noticed or observed.",
  },
  {
    id: "research",
    name: "Research",
    description: "Share research, findings, or structured analysis.",
  },
  {
    id: "evidence",
    name: "Evidence",
    description: "Submit evidence supporting an existing problem or claim.",
  },
  {
    id: "idea",
    name: "Idea",
    description: "Propose a possible solution, concept, or direction.",
  },
  {
    id: "question",
    name: "Question",
    description: "Raise something that requires further investigation.",
  },
  {
    id: "pattern",
    name: "Pattern",
    description: "Describe a recurring behavior, friction, or pattern you have identified.",
  },
  {
    id: "other",
    name: "Other",
    description: "For contributions that do not fit the categories above.",
  },
];

export default function CategorySelectionPage() {
  const router = useRouter();

  return (
    <div className="p-6 lg:p-12 max-w-5xl">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-4">
          What would you like to contribute?
        </h1>
        <p className="text-lg text-muted-foreground">
          Select the type of contribution that best describes what you want to share.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORIES.map((cat, idx) => (
          <Link
            key={cat.id}
            href={`/contributor/contribute/${cat.id}`}
            className="group flex flex-col gap-3 border border-border/40 p-6 md:p-8 hover:border-foreground/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 rounded-sm bg-muted/5"
          >
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                0{idx + 1}
              </span>
              <span className="transition-transform duration-300 ease-out group-hover:translate-x-1 text-foreground" aria-hidden="true">
                →
              </span>
            </div>
            <h2 className="text-xl font-medium tracking-wide text-foreground group-hover:text-primary transition-colors">
              {cat.name}
            </h2>
            <p className="text-muted-foreground text-sm">
              {cat.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
