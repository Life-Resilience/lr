"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Check, Shield, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

// --- Types ---
type OnboardingStep = 0 | 1 | 2 | 3 | 4;

interface OnboardingData {
  // Identity
  fullName: string;
  preferredName: string;
  ageRange: string;
  country: string;
  language: string;
  
  // Background
  primaryRole: string;
  field: string;
  experienceLevel: string;
  organizationType: string;
  
  // Research Context
  whyLR: string;
  researchInterests: string[];
  contributionExperience: string;
  discoverySource: string;
  
  // Security & Privacy
  profileVisibility: string;
  contributionAttribution: string;
  privacyAcknowledged: boolean;
}

const INITIAL_DATA: OnboardingData = {
  fullName: "",
  preferredName: "",
  ageRange: "",
  country: "",
  language: "",
  primaryRole: "",
  field: "",
  experienceLevel: "",
  organizationType: "",
  whyLR: "",
  researchInterests: [],
  contributionExperience: "",
  discoverySource: "",
  profileVisibility: "LR administrators only",
  contributionAttribution: "My name",
  privacyAcknowledged: false,
};

// --- Options Arrays ---
const AGE_RANGES = ["18–24", "25–34", "35–44", "45–54", "55+", "Prefer not to say"];
const PRIMARY_ROLES = ["Student", "Researcher", "Developer", "Designer", "Engineer", "Security Professional", "Product / Business", "Educator", "Entrepreneur", "Professional", "Other"];
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert", "Prefer not to say"];
const ORG_TYPES = ["University", "Company", "Independent", "Government", "Non-profit", "Research institution", "Other"];
const WHY_LR_OPTIONS = ["Research", "Share an experience", "Report a problem", "Improve an existing system", "Explore an idea", "Help others", "Other"];
const INTERESTS = ["Human-Computer Interaction", "Accessibility", "Cybersecurity", "Privacy", "Artificial Intelligence", "Software", "Operating Systems", "Web", "Mobile", "Education", "Productivity", "Digital Wellbeing", "Other"];
const CONTRIB_EXP = ["Never", "A few times", "Regularly", "Frequently"];
const DISCOVERY = ["Friend / colleague", "University / education", "Search engine", "Social media", "Research / article", "LR website", "Other"];
const VISIBILITY_OPTIONS = ["LR administrators only", "Other contributors", "Public"];
const ATTRIBUTION_OPTIONS = ["My name", "Contributor ID", "Anonymous"];

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const [user, setUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<"LOADING" | "AUTHENTICATED" | "UNAUTHENTICATED">("LOADING");
  
  const [step, setStep] = useState<OnboardingStep>(0);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setAuthStatus("UNAUTHENTICATED");
        return;
      }
      
      setUser(user);
      
      // Check if already completed
      const { data: profile } = await supabase
        .from("contributor_profiles")
        .select("onboarding_status")
        .eq("user_id", user.id)
        .single();
        
      if (profile?.onboarding_status === 'COMPLETED') {
        const rawNext = searchParams.get("next");
        const target = rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//') && rawNext !== '/contribute' && rawNext !== '/contribute/' ? rawNext : '/contributor';
        router.replace(target);
      } else {
        setAuthStatus("AUTHENTICATED");
      }
    }
    
    checkAuth();
  }, [supabase, router, searchParams]);

  const updateData = (fields: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  const toggleInterest = (interest: string) => {
    setData(prev => ({
      ...prev,
      researchInterests: prev.researchInterests.includes(interest)
        ? prev.researchInterests.filter(i => i !== interest)
        : [...prev.researchInterests, interest]
    }));
  };

  const handleNext = () => {
    if (step === 0 && !data.fullName.trim()) {
      setError("Full name is required to continue.");
      return;
    }
    if (step === 3 && !data.privacyAcknowledged) {
      setError("Please acknowledge the privacy policy to continue.");
      return;
    }
    setError(null);
    setStep(s => (s + 1) as OnboardingStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setError(null);
    setStep(s => (s - 1) as OnboardingStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComplete = async (dismissed: boolean = false) => {
    if (!user) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: upsertError } = await supabase
        .from("contributor_profiles")
        .upsert({
          user_id: user.id,
          name: data.fullName || null,
          preferred_name: data.preferredName || null,
          email: user.email,
          age_range: data.ageRange || null,
          country: data.country || null,
          language: data.language || null,
          
          primary_role: data.primaryRole || null,
          field: data.field || null,
          experience_level: data.experienceLevel || null,
          organization_type: data.organizationType || null,
          
          research_interests: data.researchInterests,
          why_lr: data.whyLR || null,
          contribution_experience: data.contributionExperience || null,
          discovery_source: data.discoverySource || null,
          
          profile_visibility: data.profileVisibility,
          attribution_preference: data.contributionAttribution,
          
          onboarding_status: dismissed ? 'DISMISSED' : 'COMPLETED',
          onboarding_completed: !dismissed,
          onboarding_dismissed: dismissed,
          onboarding_completed_at: dismissed ? null : new Date().toISOString(),
          onboarding_dismissed_at: dismissed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) throw upsertError;
      
      if (dismissed) {
        router.replace('/contributor');
      } else {
        setStep(4); // Show success screen
      }
    } catch (err: any) {
      setError(err.message || "Failed to save profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (authStatus === "LOADING") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-pulse font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground flex flex-col items-center gap-4">
          <Shield className="w-6 h-6 text-border" />
          Securing Session...
        </div>
      </div>
    );
  }

  if (authStatus === "UNAUTHENTICATED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
        <div className="max-w-md w-full flex flex-col items-center text-center gap-6 animate-in fade-in duration-500">
          <Lock className="w-8 h-8 text-muted-foreground" />
          <h1 className="text-2xl font-medium tracking-tight text-foreground uppercase">Session Expired</h1>
          <p className="text-[15px] text-muted-foreground">Please sign in again to continue setting up your contributor profile.</p>
          <button onClick={() => router.push('/contribute/login')} className="w-full text-[13px] font-semibold uppercase tracking-widest text-background bg-foreground px-8 py-4 rounded-sm transition-all hover:bg-foreground/90 mt-2">
            Sign In →
          </button>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 zoom-in-95">
        <div className="max-w-xl w-full flex flex-col items-center text-center gap-8">
          <div className="w-16 h-16 bg-green-600/10 rounded-full flex items-center justify-center mb-2">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-500" />
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-[28px] md:text-[36px] font-medium tracking-tight text-foreground leading-tight uppercase">
              Contributor Profile Provisioned
            </h1>
            <p className="text-[16px] text-muted-foreground leading-relaxed">
              Welcome to LR. Your contributor workspace is ready. You can now contribute research, experiences, and observations.
            </p>
          </div>
          <button 
            onClick={() => router.replace('/contributor')}
            className="mt-4 w-full md:w-auto text-[13px] font-semibold uppercase tracking-widest text-background bg-foreground px-12 h-14 rounded-sm transition-all hover:bg-foreground/90 flex items-center justify-center gap-3"
          >
            Enter LR <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const STEPS_LABEL = ["IDENTITY", "BACKGROUND", "RESEARCH CONTEXT", "SECURITY & REVIEW"];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans animate-in fade-in duration-300">
      
      {/* Secure Header Shell */}
      <header className="fixed top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-widest text-foreground font-semibold">LR</span>
            <span className="w-[1px] h-4 bg-border/60" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Contributor Provisioning</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="hidden sm:inline">Secure Session</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 pt-32 pb-24">
        
        {/* Progress System */}
        <div className="mb-12 flex flex-col gap-6">
          <div className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>{`0${step + 1} / 04`}</span>
            <span className="text-[13px] text-foreground font-semibold">{STEPS_LABEL[step]}</span>
          </div>
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-[2px] bg-border/40 relative overflow-hidden rounded-full">
                <div 
                  className={`absolute top-0 left-0 h-full bg-foreground transition-all duration-500 ${
                    i < step ? 'w-full' : i === step ? 'w-full animate-pulse' : 'w-0'
                  }`} 
                />
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-8 text-[13px] text-red-500 bg-red-500/5 px-4 py-3 rounded-sm border border-red-500/20" role="alert">
            {error}
          </div>
        )}

        {/* --- STEP 0: IDENTITY --- */}
        {step === 0 && (
          <div className="flex flex-col gap-10 animate-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-medium tracking-tight text-foreground">Let&apos;s establish your contributor profile.</h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed">A few details help us understand the context behind your research and contributions.</p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Full Name *</label>
                <input
                  type="text"
                  value={data.fullName}
                  onChange={(e) => updateData({ fullName: e.target.value })}
                  placeholder="Your legal or given name"
                  className="w-full bg-background border border-border/60 px-4 h-14 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground"
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Preferred Name</label>
                <input
                  type="text"
                  value={data.preferredName}
                  onChange={(e) => updateData({ preferredName: e.target.value })}
                  placeholder="How should we address you?"
                  className="w-full bg-background border border-border/60 px-4 h-14 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground"
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground flex justify-between">
                  Email <span className="text-green-600 dark:text-green-500 flex items-center gap-1"><Check className="w-3 h-3"/> Verified</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.email || ""}
                  className="w-full bg-muted/10 border border-border/40 px-4 h-14 rounded-sm text-[15px] text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Age Range</label>
                  <select
                    value={data.ageRange}
                    onChange={(e) => updateData({ ageRange: e.target.value })}
                    className="w-full bg-background border border-border/60 px-4 h-14 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground appearance-none"
                  >
                    <option value="" disabled>Select range</option>
                    {AGE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Country / Region</label>
                  <input
                    type="text"
                    value={data.country}
                    onChange={(e) => updateData({ country: e.target.value })}
                    placeholder="e.g. India, United States"
                    className="w-full bg-background border border-border/60 px-4 h-14 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Primary Language</label>
                <input
                  type="text"
                  value={data.language}
                  onChange={(e) => updateData({ language: e.target.value })}
                  placeholder="e.g. English, Hindi, Spanish"
                  className="w-full bg-background border border-border/60 px-4 h-14 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground"
                />
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 1: BACKGROUND --- */}
        {step === 1 && (
          <div className="flex flex-col gap-10 animate-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-medium tracking-tight text-foreground">What context do you usually work or learn in?</h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed">This helps LR structure relevant research opportunities for you.</p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Primary Role</label>
                <select
                  value={data.primaryRole}
                  onChange={(e) => updateData({ primaryRole: e.target.value })}
                  className="w-full bg-background border border-border/60 px-4 h-14 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground appearance-none"
                >
                  <option value="" disabled>Select your role</option>
                  {PRIMARY_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Field / Discipline</label>
                <input
                  type="text"
                  value={data.field}
                  onChange={(e) => updateData({ field: e.target.value })}
                  placeholder="e.g. Computer Science, HCI, Philosophy..."
                  className="w-full bg-background border border-border/60 px-4 h-14 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Experience Level</label>
                  <select
                    value={data.experienceLevel}
                    onChange={(e) => updateData({ experienceLevel: e.target.value })}
                    className="w-full bg-background border border-border/60 px-4 h-14 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground appearance-none"
                  >
                    <option value="" disabled>Select level</option>
                    {EXPERIENCE_LEVELS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Organization Type</label>
                  <select
                    value={data.organizationType}
                    onChange={(e) => updateData({ organizationType: e.target.value })}
                    className="w-full bg-background border border-border/60 px-4 h-14 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground appearance-none"
                  >
                    <option value="" disabled>Select type</option>
                    {ORG_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 2: RESEARCH CONTEXT --- */}
        {step === 2 && (
          <div className="flex flex-col gap-10 animate-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-medium tracking-tight text-foreground">Why are you joining LR?</h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed">Let us know what drives your contributions and where your interests lie.</p>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">What brings you to LR?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {WHY_LR_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => updateData({ whyLR: opt })}
                      className={`text-left px-4 py-3 border rounded-sm transition-all text-[14px] ${
                        data.whyLR === opt 
                          ? 'border-foreground bg-foreground text-background font-medium' 
                          : 'border-border/60 bg-transparent text-foreground hover:border-foreground/40'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Areas you care about (Select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(interest => {
                    const isSelected = data.researchInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 border rounded-full text-[13px] transition-all ${
                          isSelected 
                            ? 'border-foreground bg-foreground/5 text-foreground font-medium' 
                            : 'border-border/40 bg-transparent text-muted-foreground hover:border-border/80 hover:text-foreground'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 inline-block mr-1.5 mb-0.5" />}
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Have you contributed to research or open projects before?</label>
                <select
                  value={data.contributionExperience}
                  onChange={(e) => updateData({ contributionExperience: e.target.value })}
                  className="w-full bg-background border border-border/60 px-4 h-14 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground appearance-none"
                >
                  <option value="" disabled>Select experience</option>
                  {CONTRIB_EXP.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">How did you discover LR?</label>
                <select
                  value={data.discoverySource}
                  onChange={(e) => updateData({ discoverySource: e.target.value })}
                  className="w-full bg-background border border-border/60 px-4 h-14 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground appearance-none"
                >
                  <option value="" disabled>Select source</option>
                  {DISCOVERY.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 3: SECURITY & REVIEW --- */}
        {step === 3 && (
          <div className="flex flex-col gap-10 animate-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-medium tracking-tight text-foreground">Protect your contributor identity.</h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed">LR uses your account identity to associate contributions with you and protect access to your submissions.</p>
            </div>

            <div className="flex flex-col gap-8">
              
              {/* Security Status Block */}
              <div className="border border-border/60 rounded-sm bg-muted/5 p-6 flex flex-col gap-5">
                <h3 className="font-mono text-[11px] uppercase tracking-widest text-foreground font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" /> Account Security
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] text-muted-foreground">Email Status</span>
                    <span className="text-[14px] text-foreground font-medium">{user?.email}</span>
                    <span className="text-[12px] text-green-600 dark:text-green-500 flex items-center gap-1 mt-0.5"><Check className="w-3 h-3"/> Verified</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] text-muted-foreground">Authentication</span>
                    <span className="text-[14px] text-foreground font-medium">Password Configured</span>
                    <span className="text-[12px] text-green-600 dark:text-green-500 flex items-center gap-1 mt-0.5"><Check className="w-3 h-3"/> Session Active</span>
                  </div>
                </div>
              </div>

              {/* Privacy Controls */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Profile Visibility</label>
                  <p className="text-[13px] text-muted-foreground mb-1">Who can see your contributor profile?</p>
                  <select
                    value={data.profileVisibility}
                    onChange={(e) => updateData({ profileVisibility: e.target.value })}
                    className="w-full bg-background border border-border/60 px-4 h-14 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground appearance-none"
                  >
                    {VISIBILITY_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-2.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Contribution Attribution</label>
                  <p className="text-[13px] text-muted-foreground mb-1">How should your contributions be attributed by default?</p>
                  <select
                    value={data.contributionAttribution}
                    onChange={(e) => updateData({ contributionAttribution: e.target.value })}
                    className="w-full bg-background border border-border/60 px-4 h-14 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground appearance-none"
                  >
                    {ATTRIBUTION_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              {/* Final Review & Consent */}
              <div className="mt-4 pt-8 border-t border-border/40 flex flex-col gap-6">
                <h3 className="font-mono text-[11px] uppercase tracking-widest text-foreground font-semibold">
                  YOUR DATA
                </h3>
                <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                  Information provided during onboarding is used to maintain your contributor profile and provide context for contributions. You can review or update your profile later from your Account settings.
                </p>
                
                <label className="flex items-start gap-4 cursor-pointer group mt-2">
                  <div className={`w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                    data.privacyAcknowledged 
                      ? 'bg-foreground border-foreground text-background' 
                      : 'bg-transparent border-border/60 group-hover:border-foreground/50'
                  }`}>
                    {data.privacyAcknowledged && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={data.privacyAcknowledged}
                    onChange={(e) => updateData({ privacyAcknowledged: e.target.checked })}
                  />
                  <span className="text-[14px] text-foreground select-none">
                    I understand how my contributor information is used by LR.
                  </span>
                </label>
              </div>

            </div>
          </div>
        )}

        {/* --- Navigation Footer --- */}
        <div className="mt-12 pt-8 border-t border-border/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {step > 0 ? (
            <button 
              onClick={handleBack}
              className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none order-2 sm:order-1 w-fit"
            >
              ← Back
            </button>
          ) : <div className="hidden sm:block order-1" />}
          
          <button 
            onClick={step === 3 ? () => handleComplete(false) : handleNext}
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-foreground text-background px-8 h-12 rounded-sm text-[12px] font-semibold uppercase tracking-widest hover:bg-foreground/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 order-1 sm:order-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground"
          >
            {isSubmitting ? "Provisioning..." : step === 3 ? "Complete Setup →" : "Continue →"}
          </button>
        </div>

        {/* Global Skip Hatch */}
        {!isSubmitting && (
          <div className="mt-16 flex justify-center opacity-60 hover:opacity-100 transition-opacity">
            <button 
              onClick={() => handleComplete(true)}
              className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none underline underline-offset-4 decoration-border/40 hover:decoration-foreground/60"
            >
              Skip onboarding for now
            </button>
          </div>
        )}

      </main>
    </div>
  );
}