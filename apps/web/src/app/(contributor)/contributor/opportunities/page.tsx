"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { AlertTriangle, CheckCircle2, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

interface InterestRecord {
  id: string;
  area: string;
  created_at: string;
}

interface AvailableOpportunity {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  created_at: string;
}

const formatDate = (dateStr: string) => {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(dateStr));
};

export default function OpportunitiesPage() {
  const supabase = createClient();
  
  // State
  const [authStatus, setAuthStatus] = useState<"LOADING" | "AUTHENTICATED" | "UNAUTHENTICATED">("LOADING");
  const [interests, setInterests] = useState<InterestRecord[]>([]);
  const [availableOpps, setAvailableOpps] = useState<AvailableOpportunity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [reason, setReason] = useState("");
  const [experience, setExperience] = useState("");

  useEffect(() => {
    async function init() {
      // Fetch available opportunities
      const { data: opps } = await supabase
        .from("available_opportunities")
        .select("*")
        .eq("status", "OPEN")
        .order("created_at", { ascending: false });
        
      if (opps) {
        setAvailableOpps(opps);
        if (opps.length > 0) {
          setSelectedArea(opps[0].title);
        }
      }

      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) {
        setAuthStatus("UNAUTHENTICATED");
        return;
      }
      
      setAuthStatus("AUTHENTICATED");
      
      // Load existing interests
      const { data, error: fetchErr } = await supabase
        .from("opportunities")
        .select("id, area, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      if (!fetchErr && data) {
        setInterests(data);
      }
    }
    init();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArea || !reason.trim()) {
      setError("Please select an opportunity and explain your interest.");
      return;
    }

    // Duplicate protection
    if (interests.some(i => i.area === selectedArea)) {
      setError("You have already expressed interest in this opportunity.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required.");

      const { data, error: insertError } = await supabase
        .from("opportunities")
        .insert({
          user_id: user.id,
          area: selectedArea,
          reason,
          experience: experience || null
        })
        .select()
        .single();

      if (insertError) throw insertError;
      
      // Update local state smoothly
      setInterests(prev => [data, ...prev]);
      setShowForm(false);
      setReason("");
      setExperience("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError("We couldn't submit your interest. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authStatus === "LOADING") {
    return (
      <div className="p-6 lg:p-12 max-w-4xl mx-auto w-full animate-pulse flex flex-col gap-12 pb-32">
        <div className="h-12 w-64 bg-muted/40 rounded-sm" />
        <div className="h-40 w-full bg-muted/20 border border-border/40 rounded-sm" />
      </div>
    );
  }

  if (authStatus === "UNAUTHENTICATED") {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-300">
        <h1 className="text-2xl font-medium tracking-tight text-foreground uppercase mb-4">Sign In Required</h1>
        <p className="text-[15px] text-muted-foreground max-w-sm mb-8">Please sign in to view and express interest in LR opportunities.</p>
        <Link href="/contribute/login?next=/contributor/opportunities" className="text-[12px] font-semibold uppercase tracking-widest text-background bg-foreground px-8 py-4 rounded-sm hover:bg-foreground/90 transition-colors">
          SIGN IN →
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-12 max-w-4xl mx-auto w-full pb-32 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col gap-3 mb-16">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground leading-none uppercase">
          Opportunities
        </h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed max-w-2xl">
          Participate in LR research and collaboration when relevant opportunities become available.
        </p>
      </div>

      {!showForm ? (
        <div className="flex flex-col gap-16 animate-in fade-in duration-300">
          
          {/* OPEN OPPORTUNITIES */}
          <section className="flex flex-col gap-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-3">
              OPEN OPPORTUNITIES
            </h2>
            
            {availableOpps.length === 0 ? (
              <div className="border border-border/40 bg-muted/5 p-8 rounded-sm text-center flex flex-col items-center justify-center gap-3">
                <span className="text-[14px] font-medium text-foreground">No opportunities are currently open.</span>
                <span className="text-[13.5px] text-muted-foreground max-w-md">
                  New opportunities will appear here when research participation, interviews, or collaborations are available.
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {availableOpps.map(opp => (
                  <div key={opp.id} className="border border-border/40 bg-background p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-widest bg-muted text-foreground">
                          {opp.type}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(opp.created_at)}
                        </span>
                      </div>
                      <h3 className="text-[16px] font-medium text-foreground">{opp.title}</h3>
                      <p className="text-[14px] text-muted-foreground max-w-xl">{opp.description}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedArea(opp.title);
                        setShowForm(true);
                      }}
                      className="shrink-0 bg-foreground text-background px-6 h-10 rounded-sm text-[11px] font-semibold uppercase tracking-widest hover:bg-foreground/90 transition-all focus-visible:outline-none"
                    >
                      EXPRESS INTEREST
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* YOUR PARTICIPATION INTERESTS */}
          <section className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                YOUR EXPRESSED INTERESTS
              </h2>
            </div>
            
            {interests.length === 0 ? (
              <div className="flex flex-col gap-6 items-start">
                <p className="text-[14.5px] text-muted-foreground">You haven&apos;t expressed interest in any opportunities yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interests.map(interest => (
                  <div key={interest.id} className="border border-border/40 bg-background p-6 rounded-sm flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-[15px] font-medium text-foreground leading-tight">{interest.area}</h3>
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500 shrink-0" />
                    </div>
                    <div className="flex flex-col gap-1 mt-auto pt-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">STATUS</span>
                      <span className="text-[13px] text-foreground">Interest recorded on {formatDate(interest.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        /* EXPRESS INTEREST FORM */
        <div className="flex flex-col gap-10 animate-in slide-in-from-bottom-4 duration-300">
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => { setShowForm(false); setError(null); }}
              className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors w-fit mb-6"
            >
              ← BACK
            </button>
            <h2 className="text-[28px] font-medium tracking-tight text-foreground uppercase">
              Express Interest
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Tell LR why you&apos;d be a good fit for this opportunity.
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
            <div className="flex flex-col gap-5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-foreground border-b border-border/40 pb-3">
                SELECTED OPPORTUNITY
              </label>
              <div className="flex flex-col gap-3">
                {availableOpps.map(opp => (
                  <button
                    key={opp.id}
                    type="button"
                    onClick={() => { setSelectedArea(opp.title); setError(null); }}
                    className={`p-4 border rounded-sm text-left transition-all ${
                      selectedArea === opp.title 
                        ? 'border-foreground bg-foreground/5 shadow-sm' 
                        : 'border-border/60 bg-background hover:border-foreground/40'
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className={`text-[14px] font-medium ${selectedArea === opp.title ? 'text-foreground' : 'text-foreground'}`}>
                        {opp.title}
                      </span>
                      <span className="text-[13px] text-muted-foreground">
                        {opp.description}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Why Interested */}
            <div className="flex flex-col gap-3">
              <label htmlFor="reason" className="text-[11px] font-semibold uppercase tracking-widest text-foreground border-b border-border/40 pb-3">
                WHY ARE YOU INTERESTED?
              </label>
              <p className="text-[13px] text-muted-foreground mb-1">
                What makes you a good fit for this opportunity?
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
                onClick={() => { setShowForm(false); setError(null); }}
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
      )}
    </div>
  );
}
