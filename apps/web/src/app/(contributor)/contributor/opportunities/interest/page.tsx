"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlertTriangle, ArrowRight } from "lucide-react";

export default function ExpressInterestPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [area, setArea] = useState("");
  const [reason, setReason] = useState("");
  const [experience, setExperience] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!area.trim() || !reason.trim()) {
      setError("Please provide an area of interest and explain why you're interested.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required.");

      const { error: insertError } = await supabase
        .from("opportunities") // The table used for Participant Interests
        .insert({
          user_id: user.id,
          area: area.trim(),
          reason: reason.trim(),
          experience: experience.trim() || null
        });

      if (insertError) throw insertError;
      
      router.push("/contributor/opportunities?success=interest");
    } catch (err: any) {
      setError("We couldn't submit your interest. Please check your connection and try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-12 max-w-3xl mx-auto w-full pb-32 animate-in fade-in duration-300">
      
      <div className="flex flex-col gap-2 mb-10">
        <button 
          onClick={() => router.back()}
          className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors w-fit mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-sm"
        >
          ← BACK TO OPPORTUNITIES
        </button>
        <h1 className="text-[28px] md:text-[36px] font-medium tracking-tight text-foreground leading-none uppercase">
          Express General Interest
        </h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed mt-2">
          Don't see a specific opportunity that matches your background? Tell us what you're interested in, and we'll keep your profile on file for future research.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-12">
        
        {error && (
          <div className="flex items-center gap-3 text-[13px] text-red-500 bg-red-500/5 px-4 py-3 rounded-sm border border-red-500/20" role="alert">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Area Selection */}
        <div className="flex flex-col gap-3">
          <label htmlFor="area" className="text-[11px] font-semibold uppercase tracking-widest text-foreground border-b border-border/40 pb-3">
            AREA OF INTEREST
          </label>
          <p className="text-[13px] text-muted-foreground mb-1">
            What topics, threats, or research areas are you most interested in contributing to?
          </p>
          <input
            id="area"
            type="text"
            required
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g., Social Engineering, Malware Analysis, Policy..."
            className="w-full bg-background border border-border/60 px-4 h-14 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Why Interested */}
        <div className="flex flex-col gap-3">
          <label htmlFor="reason" className="text-[11px] font-semibold uppercase tracking-widest text-foreground border-b border-border/40 pb-3">
            WHY ARE YOU INTERESTED?
          </label>
          <p className="text-[13px] text-muted-foreground mb-1">
            Why do you want to participate in research related to this area?
          </p>
          <textarea
            id="reason"
            required
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Briefly explain your interest..."
            className="w-full bg-background border border-border/60 p-4 h-32 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all resize-y rounded-sm text-[15px] text-foreground placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Experience */}
        <div className="flex flex-col gap-3">
          <label htmlFor="experience" className="text-[11px] font-semibold uppercase tracking-widest text-foreground border-b border-border/40 pb-3 flex items-center justify-between">
            <span>RELEVANT EXPERIENCE</span>
            <span className="text-muted-foreground font-normal">OPTIONAL</span>
          </label>
          <p className="text-[13px] text-muted-foreground mb-1">
            Do you have any relevant background or prior experience?
          </p>
          <textarea
            id="experience"
            rows={3}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Briefly describe your relevant background..."
            className="w-full bg-background border border-border/60 p-4 h-24 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all resize-y rounded-sm text-[15px] text-foreground placeholder:text-muted-foreground/50"
          />
        </div>

        <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <button 
            type="button"
            onClick={() => router.back()}
            className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none order-2 sm:order-1"
          >
            CANCEL
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-foreground text-background px-8 h-12 rounded-sm text-[12px] font-semibold uppercase tracking-widest hover:bg-foreground/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 order-1 sm:order-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground"
          >
            {isSubmitting ? "SUBMITTING..." : "SUBMIT INTEREST"}
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
