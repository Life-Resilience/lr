"use client";

import { useParams, useRouter } from "next/navigation";
import ContributionForm from "@/components/contributor/ContributionForm";
import Link from "next/link";

export default function ContributionCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = (params.category as string).toLowerCase();

  const validCategories = ["experience", "observation", "research", "evidence", "idea", "question", "pattern", "other"];

  if (!validCategories.includes(category)) {
    return (
      <div className="p-12">
        <h1 className="text-xl font-medium text-foreground mb-4">Invalid Category</h1>
        <Link href="/contributor/contribute" className="text-muted-foreground hover:text-foreground underline underline-offset-4">
          Return to category selection
        </Link>
      </div>
    );
  }

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="p-6 lg:p-12 max-w-4xl">
      <div className="mb-12">
        <button 
          onClick={() => router.push('/contributor/contribute')}
          className="mb-8 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none"
        >
          ← Back to Categories
        </button>
        <div className="mb-8 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="text-foreground">LR / NEW CONTRIBUTION</span>
          <span>TYPE: {category.toUpperCase()}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-4">
          {categoryName}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Please fill out the form below. Your progress will be saved automatically.
        </p>
      </div>

      <ContributionForm 
        initialCategory={categoryName} 
        onCancel={() => router.push('/contributor/contribute')}
      />
    </div>
  );
}
