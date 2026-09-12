"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkOnboarding() {
      // Don't run onboarding check if we're already on the onboarding page
      if (pathname === "/contributor/onboarding") {
        if (isMounted) setIsChecking(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (isMounted) setIsChecking(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("contributor_profiles")
        .select("onboarding_completed, onboarding_dismissed")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.warn("Contributor profile note:", error.message || error.code || "Profile check note");
      }

      const needsOnboarding = !profile || (!profile.onboarding_completed && !profile.onboarding_dismissed);

      if (needsOnboarding) {
        const query = searchParams.toString();
        const currentUrl = query ? `${pathname}?${query}` : pathname;
        router.replace(`/contributor/onboarding?next=${encodeURIComponent(currentUrl)}`);
      } else {
        if (isMounted) setIsChecking(false);
      }
    }

    checkOnboarding();

    return () => {
      isMounted = false;
    };
  }, [pathname, router, searchParams, supabase]);

  if (isChecking && pathname !== "/contributor/onboarding") {
    return (
      <div className="w-full flex justify-center py-24">
        <div className="w-4 h-4 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
