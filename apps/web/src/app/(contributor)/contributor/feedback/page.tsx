"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function FeedbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contribution_id = searchParams.get('contribution_id');
  const [response, setResponse] = useState("");
  const [attribution, setAttribution] = useState("Anonymous");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim()) {
      setError("Please provide your feedback.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const supabase = createClient();
    
    // Get contributor_id
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not authenticated.");
      setIsSubmitting(false);
      return;
    }

    const { data: profile } = await supabase
      .from('contributor_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      setError("Profile not found.");
      setIsSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase
      .from('community_feedback')
      .insert({
        contributor_id: profile.id,
        contribution_id: contribution_id || null,
        response: response,
        attribution_preference: attribution,
        status: 'SUBMITTED'
      });

    if (insertError) {
      setError(insertError.message);
      setIsSubmitting(false);
    } else {
      router.push("/contributor?feedback=success");
      router.refresh();
    }
  };

  return (
    <div className="p-6 lg:p-12 max-w-2xl mx-auto w-full animate-in fade-in duration-300 pb-32">
      <div className="mb-10 flex flex-col gap-3">
        <h1 className="text-3xl font-medium tracking-tight text-foreground uppercase">
          Share Your Experience
        </h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed">
          How was your experience contributing to LR? What did you learn? Your feedback helps us improve and may be published to inspire the broader community.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 text-[13px] rounded-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Your Response
          </label>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="w-full min-h-[160px] p-4 bg-background border border-border/60 rounded-sm focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground resize-y text-[15px]"
            placeholder="Share your thoughts..."
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Attribution Preference
          </label>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3">
              <input 
                type="radio" 
                name="attribution" 
                value="Anonymous" 
                checked={attribution === "Anonymous"} 
                onChange={() => setAttribution("Anonymous")}
                className="w-4 h-4 accent-foreground"
              />
              <span className="text-[14px]">Anonymous (Don't show my name)</span>
            </label>
            <label className="flex items-center gap-3">
              <input 
                type="radio" 
                name="attribution" 
                value="My name" 
                checked={attribution === "My name"} 
                onChange={() => setAttribution("My name")}
                className="w-4 h-4 accent-foreground"
              />
              <span className="text-[14px]">Use my name</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-border/40">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 h-12 text-[12px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            disabled={isSubmitting}
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 h-12 bg-foreground text-background text-[12px] font-semibold uppercase tracking-widest rounded-sm hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "SUBMITTING..." : "SUBMIT FEEDBACK"}
          </button>
        </div>
      </form>
    </div>
  );
}
