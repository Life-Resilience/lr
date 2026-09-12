"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [studyWork, setStudyWork] = useState("");
  const [studyWorkDetails, setStudyWorkDetails] = useState("");
  const [discoverySource, setDiscoverySource] = useState("");
  const [discoveryDetails, setDiscoveryDetails] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent, dismissed: boolean = false) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error: upsertError } = await supabase
        .from("contributor_profiles")
        .upsert({
          user_id: user.id,
          name: name || null,
          email: user.email,
          age: age || null,
          study_work: studyWork || null,
          study_work_details: studyWorkDetails || null,
          discovery_source: discoverySource || null,
          discovery_details: discoveryDetails || null,
          onboarding_completed: !dismissed,
          onboarding_dismissed: dismissed,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) throw upsertError;

      const rawNext = searchParams.get("next");
      const target = rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//') && rawNext !== '/contribute' && rawNext !== '/contribute/' && !rawNext.startsWith('/contributor/onboarding') ? rawNext : '/contributor';
      router.replace(target);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div className="p-12 animate-pulse text-muted-foreground font-mono text-[11px] uppercase tracking-[0.1em]">Loading...</div>;
  }

  return (
    <div className="p-6 lg:p-12 max-w-2xl">
      <div className="mb-12">
        <div className="mb-8 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="text-foreground">LR / PROFILE</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-4">
          Welcome to LR.
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Before you start contributing, please share a bit about yourself. This helps us understand the context of your contributions.
        </p>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="flex flex-col gap-10">
        {error && (
          <div className="text-red-500 font-mono text-[11px] uppercase tracking-[0.1em]">{error}</div>
        )}

        <div className="flex flex-col gap-4">
          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Email</label>
          <input
            type="text"
            disabled
            value={user.email || ""}
            className="w-full bg-transparent border-b border-border/40 py-3 text-lg focus:outline-none text-muted-foreground rounded-none"
          />
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">Confirmed via authentication</span>
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-transparent border-b border-border/40 py-3 text-lg focus:outline-none focus:border-foreground transition-colors rounded-none"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Age</label>
          <input
            type="text"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 25, 30-40"
            className="w-full bg-transparent border-b border-border/40 py-3 text-lg focus:outline-none focus:border-foreground transition-colors rounded-none"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Study / Work</label>
          <select 
            value={studyWork} 
            onChange={(e) => setStudyWork(e.target.value)}
            required
            className="w-full bg-transparent border-b border-border/40 py-3 text-lg focus:outline-none focus:border-foreground transition-colors rounded-none appearance-none"
          >
            <option value="" disabled>Select your primary focus</option>
            <option value="Student">Student</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Postgraduate">Postgraduate</option>
            <option value="Researcher">Researcher</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Engineer">Engineer</option>
            <option value="Professional">Professional</option>
            <option value="Entrepreneur">Entrepreneur</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        {studyWork && (
          <div className="flex flex-col gap-4">
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Additional details (Optional)</label>
            <input
              type="text"
              value={studyWorkDetails}
              onChange={(e) => setStudyWorkDetails(e.target.value)}
              placeholder="e.g. Computer Science, Freelance..."
              className="w-full bg-transparent border-b border-border/40 py-3 text-lg focus:outline-none focus:border-foreground transition-colors rounded-none"
            />
          </div>
        )}

        <div className="flex flex-col gap-4">
          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">How did you hear about LR?</label>
          <select 
            value={discoverySource} 
            onChange={(e) => setDiscoverySource(e.target.value)}
            required
            className="w-full bg-transparent border-b border-border/40 py-3 text-lg focus:outline-none focus:border-foreground transition-colors rounded-none appearance-none"
          >
            <option value="" disabled>Select an option</option>
            <option value="Friend / colleague">Friend / colleague</option>
            <option value="University / education">University / education</option>
            <option value="Search engine">Search engine</option>
            <option value="Social media">Social media</option>
            <option value="Research/article">Research/article</option>
            <option value="LR website">LR website</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {discoverySource === "Other" && (
          <div className="flex flex-col gap-4">
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Please specify</label>
            <input
              type="text"
              value={discoveryDetails}
              onChange={(e) => setDiscoveryDetails(e.target.value)}
              required
              className="w-full bg-transparent border-b border-border/40 py-3 text-lg focus:outline-none focus:border-foreground transition-colors rounded-none"
            />
          </div>
        )}

        <div className="pt-8 flex flex-col sm:flex-row sm:items-center gap-6">
          <button
            type="submit"
            disabled={isLoading}
            className="group w-fit flex items-center justify-center gap-3 text-[13px] font-medium uppercase tracking-[0.15em] text-background bg-foreground px-8 py-4 rounded-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Continue"}
            {!isLoading && (
              <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
            )}
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isLoading}
            className="text-[11px] font-mono uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors mt-4 sm:mt-0"
          >
            Do not ask me again
          </button>
        </div>
      </form>
    </div>
  );
}
