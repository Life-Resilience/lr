"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function OpportunitiesPage() {
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [area, setArea] = useState("RESEARCH PARTICIPATION");
  const [reason, setReason] = useState("");
  const [experience, setExperience] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("opportunities")
        .insert({
          user_id: user.id,
          area,
          reason,
          experience
        });

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-12 max-w-4xl">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-4">
          Opportunities
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Opportunities will appear here as LR opens research participation and collaboration opportunities.
        </p>
      </div>

      {!success ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-12 border-t border-border/40 pt-12">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-medium tracking-tight text-foreground">
              Express Interest
            </h2>
            <p className="text-muted-foreground">
              Let us know how you would like to participate in the future.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Area of interest
            </label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full bg-transparent border-b border-border/40 py-3 text-base focus:outline-none focus:border-foreground transition-colors rounded-none text-foreground"
            >
              <option value="RESEARCH PARTICIPATION" className="bg-background">Research Participation</option>
              <option value="RESEARCH ASSISTANCE" className="bg-background">Research Assistance</option>
              <option value="DATA / EVIDENCE CONTRIBUTION" className="bg-background">Data / Evidence Contribution</option>
              <option value="INTERVIEWS" className="bg-background">Interviews</option>
              <option value="OTHER COLLABORATION" className="bg-background">Other Collaboration</option>
            </select>
          </div>

          <div className="flex flex-col gap-4">
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Why you're interested
            </label>
            <textarea
              required
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Tell us why you want to participate..."
              className="w-full bg-transparent border border-border/40 p-4 text-base focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40 resize-y rounded-sm"
            />
          </div>

          <div className="flex flex-col gap-4">
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Relevant experience (Optional)
            </label>
            <textarea
              rows={3}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Any relevant background or experience..."
              className="w-full bg-transparent border border-border/40 p-4 text-base focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40 resize-y rounded-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-fit flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.15em] text-background bg-foreground px-8 py-4 rounded-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Interest"}
              {!isSubmitting && <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>}
            </button>
          </div>
        </form>
      ) : (
        <div className="border-t border-border/40 pt-12 flex flex-col gap-6">
          <h2 className="text-2xl font-medium tracking-tight text-foreground">
            Interest received.
          </h2>
          <div className="border-l-2 border-foreground pl-6 py-1">
            <p className="text-base text-muted-foreground italic max-w-xl leading-relaxed">
              Your interest has been recorded. If a relevant opportunity becomes available, LR may use this information when reviewing participation.
            </p>
          </div>
          <button 
            onClick={() => {
              setSuccess(false);
              setReason("");
              setExperience("");
            }}
            className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground mt-4 w-fit"
          >
            Submit Another →
          </button>
        </div>
      )}
    </div>
  );
}
