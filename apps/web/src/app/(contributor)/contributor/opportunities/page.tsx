"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, ArrowRight, Calendar } from "lucide-react";
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
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    async function init() {
      // Fetch available opportunities
      const { data: opps } = await supabase
        .from("available_opportunities")
        .select("*")
        .eq("status", "PUBLISHED")
        .order("created_at", { ascending: false });
        
      if (opps) {
        setAvailableOpps(opps);
      }

      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) {
        setAuthStatus("UNAUTHENTICATED");
        return;
      }
      
      setAuthStatus("AUTHENTICATED");
      
      // Load existing interests
      const { data: interestsData } = await supabase
        .from("opportunities") // The table used for participant interests
        .select("id, area, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      if (interestsData) {
        setInterests(interestsData);
      }

      // Load applications
      const { data: appsData } = await supabase
        .from("contributions")
        .select("id, status, created_at, metadata")
        .eq("user_id", user.id)
        .eq("type", "APPLICATION")
        .order("created_at", { ascending: false });

      if (appsData) {
        setApplications(appsData);
      }
    }
    init();
  }, [supabase]);

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

      <div className="flex flex-col gap-16">
        
        {/* OPEN OPPORTUNITIES */}
        <section className="flex flex-col gap-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-3">
            OPEN OPPORTUNITIES
          </h2>
          
          {availableOpps.length === 0 ? (
            <div className="border border-border/40 bg-muted/5 p-8 rounded-sm text-center flex flex-col items-center justify-center gap-4">
              <span className="text-[14px] font-medium text-foreground">No specific opportunities are currently open.</span>
              <span className="text-[13.5px] text-muted-foreground max-w-md mb-2">
                However, LR is always looking for relevant experiences. You can express your general interest below.
              </span>
              <Link href="/contributor/opportunities/interest" className="bg-foreground text-background px-6 h-10 rounded-sm text-[11px] font-semibold uppercase tracking-widest hover:bg-foreground/90 transition-all focus-visible:outline-none flex items-center justify-center">
                EXPRESS GENERAL INTEREST
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {availableOpps.map(opp => (
                <div key={opp.id} className="border border-border/40 bg-background p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-foreground/40 transition-colors">
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
                    <p className="text-[14px] text-muted-foreground max-w-xl line-clamp-2">{opp.description}</p>
                  </div>
                  <Link 
                    href={`/contributor/opportunities/${opp.id}`}
                    className="shrink-0 bg-background border border-border/60 text-foreground px-6 h-10 rounded-sm text-[11px] font-semibold uppercase tracking-widest hover:bg-muted/50 transition-all focus-visible:outline-none flex items-center justify-center"
                  >
                    VIEW DETAILS
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* EXPRESS INTEREST FALLBACK */}
        {availableOpps.length > 0 && (
          <section className="flex flex-col gap-4 border border-border/40 bg-muted/5 p-6 md:p-8 rounded-sm">
            <h2 className="text-[15px] font-medium text-foreground">Don&apos;t see a fit?</h2>
            <p className="text-[14px] text-muted-foreground max-w-2xl mb-2">
              If none of the open opportunities match your experience, you can submit a general interest form. We will contact you when a relevant research project begins.
            </p>
            <Link href="/contributor/opportunities/interest" className="w-fit text-[11px] font-semibold uppercase tracking-widest text-foreground flex items-center gap-2 hover:text-muted-foreground transition-colors">
              EXPRESS GENERAL INTEREST <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        )}

        {/* YOUR APPLICATIONS */}
        {applications.length > 0 && (
          <section className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                YOUR APPLICATIONS
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map(app => {
                const oppTitle = app.metadata?.opportunity_title || "Unknown Opportunity";
                return (
                  <Link key={app.id} href={`/contributor/contributions/${app.id}`} className="border border-border/40 bg-background p-6 rounded-sm flex flex-col gap-3 hover:border-foreground/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-[15px] font-medium text-foreground leading-tight">{oppTitle}</h3>
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500 shrink-0" />
                    </div>
                    <div className="flex flex-col gap-1 mt-auto pt-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">STATUS: {app.status}</span>
                      <span className="text-[13px] text-foreground">Applied on {formatDate(app.created_at)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* YOUR PARTICIPATION INTERESTS */}
        {interests.length > 0 && (
          <section className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                GENERAL INTERESTS
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interests.map(interest => (
                <div key={interest.id} className="border border-border/40 bg-background p-6 rounded-sm flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-[15px] font-medium text-foreground leading-tight">{interest.area}</h3>
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500 shrink-0" />
                  </div>
                  <div className="flex flex-col gap-1 mt-auto pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">STATUS: ON FILE</span>
                    <span className="text-[13px] text-foreground">Recorded on {formatDate(interest.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
