"use client";

import { useSearchParams, useRouter } from "next/navigation";
import ContributionForm from "./ContributionForm";

export default function ContributeFormWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category") || "Experience";

  return (
    <ContributionForm
      initialCategory={category}
      onCancel={() => router.push("/contributor")}
    />
  );
}
