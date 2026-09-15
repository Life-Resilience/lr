"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlertTriangle, ArrowRight, Calendar, Info } from "lucide-react";
import Link from "next/link";
import { submitApplication } from "./actions";

export default function OpportunityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const supabase = createClient();
  
  const [opp, setOpp] = useState<any>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showApply, setShowApply] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [experience, setExperience] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('available_opportunities')
        .select('*')
        .eq('id', id)
        .single();
        
      if (data) setOpp(data);

      if (user && data) {
        // Check if already applied
        const { data: appData } = await supabase
          .from('contributions')
          .select('id')
          .eq('user_id', user.id)
          .eq('type', 'APPLICATION')
          .contains('metadata', { opportunity_id: data.id })
          .single();
          
        if (appData) {
          setHasApplied(true);
        }
      }
      setIsLoading(false);
    }
    init();
  }, [id, supabase]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter.trim()) {
      setError("Please explain why you're a good fit.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await submitApplication(opp.id, opp.title, coverLetter, experience);
      setHasApplied(true);
      setShowApply(false);
    } catch (err: any) {
      setError(err.message || "Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-12 max-w-4xl mx-auto w-full animate-pulse flex flex-col gap-12 pb-32">
        <div className="h-12 w-64 bg-muted/40 rounded-sm" />
        <div className="h-64 w-full bg-muted/20 border border-border/40 rounded-sm" />
      </div>
    );
  }

  if (!opp) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-300">
        <h1 className="text-2xl font-medium tracking-tight text-foreground uppercase mb-4">Opportunity Not Found</h1>
        <p className="text-[15px] text-muted-foreground max-w-md mb-8">This opportunity may have been closed or removed.</p>
        <Link href="/contributor/opportunities" className="text-[12px] font-semibold uppercase tracking-widest text-background bg-foreground px-8 py-4 rounded-sm hover:bg-foreground/90 transition-colors">
          VIEW OPEN OPPORTUNITIES
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-12 max-w-4xl mx-auto w-full pb-32 animate-in fade-in duration-300">
      
      <div className="mb-12">
        <button 
          onClick={() => router.back()}
          className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-sm"
        >
          ← BACK
        </button>
      </div>

      <div className="flex flex-col gap-10">
        
        {/* Opp Header */}
        <div className="flex flex-col gap-6 border-b border-border/40 pb-10">
          <div className="flex items-center gap-3">
            <span className={`px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-widest ${opp.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-600 dark:text-green-500' : 'bg-muted text-muted-foreground'}`}>
              {opp.status}
            </span>
            <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-widest bg-muted/50 text-foreground">
              {opp.type}
            </span>
            <span className="text-[11px] text-muted-foreground font-mono uppercase tracking-widest flex items-center gap-1.5 ml-auto">
              <Calendar className="w-3.5 h-3.5" />
              Posted {new Date(opp.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground leading-none">
            {opp.title}
          </h1>
          
          <p className="text-[16px] text-foreground leading-relaxed max-w-3xl whitespace-pre-wrap mt-4">
            {opp.description}
          </p>

          {!showApply && opp.status === 'PUBLISHED' && (
            <div className="mt-6 flex items-center gap-4">
              {hasApplied ? (
                <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-500 px-6 py-4 rounded-sm flex items-center gap-3 w-fit">
                  <Info className="w-4 h-4" />
                  <span className="text-[12px] font-semibold uppercase tracking-widest">You have applied for this opportunity</span>
                </div>
              ) : (
                <button 
                  onClick={() => setShowApply(true)}
                  className="bg-foreground text-background px-8 h-12 rounded-sm text-[12px] font-semibold uppercase tracking-widest hover:bg-foreground/90 transition-all focus-visible:outline-none flex items-center justify-center gap-2"
                >
                  APPLY NOW
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Apply Flow */}
        {showApply && (
          <div className="flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-300 bg-muted/5 border border-border/40 p-6 md:p-10 rounded-sm">
            <div className="flex flex-col gap-2">
              <h2 className="text-[24px] font-medium tracking-tight text-foreground">
                Apply for this opportunity
              </h2>
              <p className="text-[14px] text-muted-foreground">
                Tell us why you are a good fit for {opp.title}.
              </p>
            </div>

            <form onSubmit={handleApply} className="flex flex-col gap-8">
              {error && (
                <div className="flex items-center gap-3 text-[13px] text-red-500 bg-red-500/5 px-4 py-3 rounded-sm border border-red-500/20" role="alert">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <label htmlFor="coverLetter" className="text-[11px] font-semibold uppercase tracking-widest text-foreground">
                  WHY ARE YOU A GOOD FIT?
                </label>
                <textarea
                  id="coverLetter"
                  required
                  rows={5}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Explain your interest and what you can bring to this research..."
                  className="w-full bg-background border border-border/60 p-4 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all resize-y rounded-sm text-[15px] text-foreground"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="experience" className="text-[11px] font-semibold uppercase tracking-widest text-foreground flex items-center justify-between">
                  <span>RELEVANT EXPERIENCE</span>
                  <span className="text-muted-foreground font-normal">OPTIONAL</span>
                </label>
                <textarea
                  id="experience"
                  rows={3}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Describe any relevant background..."
                  className="w-full bg-background border border-border/60 p-4 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all resize-y rounded-sm text-[15px] text-foreground"
                />
              </div>

              <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <button 
                  type="button"
                  onClick={() => setShowApply(false)}
                  className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none order-2 sm:order-1"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-foreground text-background px-8 h-12 rounded-sm text-[12px] font-semibold uppercase tracking-widest hover:bg-foreground/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 order-1 sm:order-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground"
                >
                  {isSubmitting ? "SUBMITTING..." : "SUBMIT APPLICATION"}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
