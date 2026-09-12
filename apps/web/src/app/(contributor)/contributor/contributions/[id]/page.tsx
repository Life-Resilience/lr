"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Copy, FileText, CheckCircle2, Clock, Check, AlertTriangle } from "lucide-react";

export type ContributionStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'NEEDS_INFORMATION' | 'REVIEWED' | 'RESPONSE_AVAILABLE';

const STATUS_MAP: Record<string, { label: string; desc: string }> = {
  DRAFT: { label: "Draft", desc: "This contribution hasn't been submitted yet." },
  SUBMITTED: { label: "Submitted", desc: "Waiting for LR review" },
  UNDER_REVIEW: { label: "Under Review", desc: "LR is currently reviewing this contribution" },
  "UNDER REVIEW": { label: "Under Review", desc: "LR is currently reviewing this contribution" }, // legacy fallback
  NEEDS_INFORMATION: { label: "Needs Information", desc: "LR requires more details" },
  REVIEWED: { label: "Reviewed", desc: "Review complete. Waiting for final response if applicable." },
  RESPONSE_AVAILABLE: { label: "Response Available", desc: "A response from LR has been added." },
};

const formatDate = (dateStr: string) => {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(dateStr));
};

const formatKey = (key: string) => {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function ContributionDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const isSuccess = searchParams.get('success') === 'true';
  const supabase = createClient();
  
  const [contribution, setContribution] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const { data, error: fetchError } = await supabase
          .from('contributions')
          .select('*')
          .eq('id', id)
          .single(); // RLS must guarantee ownership here
        
        if (fetchError) throw fetchError;
        if (!data) throw new Error("Not found");

        setContribution(data);
        
        if (data.metadata?.file_path) {
          const { data: urlData } = await supabase.storage
            .from('contributions')
            .createSignedUrl(data.metadata.file_path, 3600);
          if (urlData) {
            setFileUrl(urlData.signedUrl);
          }
        }
      } catch (err) {
        setError("We couldn't find this contribution. It may have been removed, or you may not have permission to view it.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [supabase, id]);

  const copyId = (displayId: string) => {
    navigator.clipboard.writeText(displayId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-12 max-w-4xl mx-auto w-full animate-pulse flex flex-col gap-10 pb-32">
        <div className="h-4 w-32 bg-muted/40 rounded-sm" />
        <div className="flex flex-col gap-4 mt-6">
          <div className="h-12 w-3/4 bg-muted/20 rounded-sm" />
          <div className="h-6 w-48 bg-muted/20 rounded-sm" />
        </div>
        <div className="h-24 w-full bg-muted/10 rounded-sm border border-border/40 mt-6" />
        <div className="h-64 w-full bg-muted/10 rounded-sm border border-border/40 mt-6" />
      </div>
    );
  }

  if (error || !contribution) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-300">
        <h1 className="text-2xl font-medium tracking-tight text-foreground uppercase mb-4">Contribution Not Found</h1>
        <p className="text-[15px] text-muted-foreground max-w-md mb-8">{error || "Something went wrong while loading your contribution."}</p>
        <Link href="/contributor/contributions" className="text-[12px] font-semibold uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors bg-muted/10 border border-border/40 px-6 py-3 rounded-sm">
          ← BACK TO MY CONTRIBUTIONS
        </Link>
      </div>
    );
  }

  const displayId = contribution.display_id || `LR-C-${contribution.id.substring(0, 8).toUpperCase()}`;
  const cStatus = contribution.status === "UNDER REVIEW" ? "UNDER_REVIEW" : contribution.status;
  const statusMeta = STATUS_MAP[cStatus] || STATUS_MAP.SUBMITTED;

  // Determine timeline progress natively
  const timelineSteps = [
    { key: "SUBMITTED", label: "Submitted" },
    { key: "UNDER_REVIEW", label: "Under Review" },
    { key: "REVIEWED", label: "Reviewed" }
  ];
  
  let currentStepIndex = 0;
  if (cStatus === "UNDER_REVIEW") currentStepIndex = 1;
  if (cStatus === "REVIEWED" || cStatus === "RESPONSE_AVAILABLE") currentStepIndex = 2;
  if (cStatus === "NEEDS_INFORMATION") currentStepIndex = 1;

  return (
    <div className="p-6 lg:p-12 max-w-4xl mx-auto w-full pb-32 animate-in fade-in duration-300">
      
      {isSuccess ? (
        <div className="mb-16 border-b border-border/40 pb-16">
          <div className="mb-8 flex flex-col gap-1 font-mono text-[11px] uppercase tracking-widest text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />
            <span className="text-green-600 dark:text-green-500">CONTRIBUTION RECEIVED</span>
          </div>
          <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground mb-6 uppercase">
            Thank you for contributing.
          </h1>
          <p className="text-[16px] text-muted-foreground max-w-2xl leading-relaxed mb-10">
            Your contribution has been successfully submitted and is now in the LR review queue.
          </p>
          
          <div className="bg-muted/5 border border-border/40 p-6 md:p-8 rounded-sm">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-6">What happens next</h3>
            <ol className="flex flex-col gap-5 text-[14.5px] text-foreground">
              <li className="flex gap-4"><span className="text-muted-foreground font-mono">01</span> LR receives your contribution</li>
              <li className="flex gap-4"><span className="text-muted-foreground font-mono">02</span> The research team reviews it</li>
              <li className="flex gap-4"><span className="text-muted-foreground font-mono">03</span> A response may be added</li>
              <li className="flex gap-4"><span className="text-muted-foreground font-mono">04</span> You can track its status here</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="mb-12">
          <Link 
            href="/contributor/contributions"
            className="inline-block font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none rounded-sm"
          >
            ← BACK TO MY CONTRIBUTIONS
          </Link>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {contribution.type}
          </span>
          <h1 className="text-[28px] md:text-[36px] font-medium tracking-tight text-foreground leading-snug">
            {contribution.title || "Untitled Contribution"}
          </h1>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-2">
            <div className="flex items-center gap-2 bg-muted/10 px-3 py-1.5 rounded-sm border border-border/40 w-fit">
              <span className="font-mono text-[11px] uppercase tracking-widest text-foreground">{displayId}</span>
              <button 
                onClick={() => copyId(displayId)}
                className="text-muted-foreground hover:text-foreground transition-colors ml-1 focus-visible:outline-none"
                aria-label="Copy ID"
                title="Copy ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-foreground" aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-widest font-medium text-foreground">
                {statusMeta.label}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-[13px] text-muted-foreground">
          <span>Submitted on {formatDate(contribution.created_at)}</span>
          {contribution.updated_at !== contribution.created_at && (
            <span>Last updated {formatDate(contribution.updated_at)}</span>
          )}
        </div>
      </div>

      {/* Status Timeline */}
      {cStatus !== "DRAFT" && (
        <div className="mb-16 border border-border/40 rounded-sm p-6 md:p-8 bg-muted/5">
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-8">Status Progress</h3>
          
          {/* Desktop Horizontal Timeline */}
          <div className="hidden md:flex items-center justify-between relative">
            <div className="absolute left-0 top-3 w-full h-[1px] bg-border/40 -z-10" />
            <div 
              className="absolute left-0 top-3 h-[1px] bg-foreground -z-10 transition-all duration-500" 
              style={{ width: `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%` }} 
            />
            
            {timelineSteps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isActive = idx === currentStepIndex;
              return (
                <div key={step.key} className="flex flex-col items-center gap-3 bg-muted/5 px-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isActive ? 'border-foreground bg-background' : 
                    isCompleted ? 'border-foreground bg-foreground text-background' : 
                    'border-border/40 bg-background'
                  }`}>
                    {isCompleted && !isActive ? <Check className="w-3.5 h-3.5" /> : <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-foreground' : 'bg-transparent'}`} />}
                  </div>
                  <span className={`text-[11px] font-mono uppercase tracking-widest ${isCompleted ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mobile Vertical Timeline */}
          <div className="flex md:hidden flex-col gap-6 relative pl-3">
            <div className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-border/40 -z-10" />
            <div 
              className="absolute left-[15px] top-2 w-[1px] bg-foreground -z-10 transition-all duration-500" 
              style={{ height: `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%` }} 
            />

            {timelineSteps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isActive = idx === currentStepIndex;
              return (
                <div key={step.key} className="flex items-center gap-5 bg-muted/5 py-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors ${
                    isActive ? 'border-foreground bg-background' : 
                    isCompleted ? 'border-foreground bg-foreground text-background' : 
                    'border-border/40 bg-background'
                  }`}>
                    {isCompleted && !isActive ? <Check className="w-3 h-3" /> : <span className={`w-1 h-1 rounded-full ${isActive ? 'bg-foreground' : 'bg-transparent'}`} />}
                  </div>
                  <span className={`text-[12px] font-mono uppercase tracking-widest ${isCompleted ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-[13.5px] text-muted-foreground">
            {statusMeta.desc}
          </p>
        </div>
      )}

      {/* Needs Info State */}
      {cStatus === "NEEDS_INFORMATION" && (
        <div className="mb-16 border border-yellow-600/30 bg-yellow-600/5 p-6 md:p-8 rounded-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-yellow-600 dark:text-yellow-500 font-semibold">Needs Information</h3>
          </div>
          <p className="text-[14.5px] text-foreground mb-6 leading-relaxed">
            LR has requested additional information about this contribution. Please check the response below.
          </p>
          <button className="bg-foreground text-background px-6 h-10 rounded-sm text-[11px] font-semibold uppercase tracking-widest hover:bg-foreground/90 transition-colors">
            PROVIDE INFORMATION →
          </button>
        </div>
      )}

      {/* LR Response Section */}
      <div className="mb-16">
        <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-3 mb-6">
          LR RESPONSE
        </h2>
        
        {contribution.admin_response ? (
          <div className="bg-background border border-border/40 rounded-sm p-6 md:p-8 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-[12px] font-medium text-foreground uppercase tracking-widest">Response Available</span>
            </div>
            <p className="text-[15px] text-foreground whitespace-pre-wrap leading-relaxed">
              {contribution.admin_response}
            </p>
          </div>
        ) : (
          <div className="bg-muted/5 border border-border/40 rounded-sm p-6 md:p-8 text-center flex flex-col items-center justify-center gap-3">
            <Clock className="w-5 h-5 text-muted-foreground mb-1" />
            <span className="text-[14px] font-medium text-foreground">Waiting for LR review</span>
            <span className="text-[13.5px] text-muted-foreground max-w-sm">
              No response has been added yet. If the research team has something to share, it will appear here.
            </span>
          </div>
        )}
      </div>

      {/* The Contribution Content */}
      <div className="mb-16">
        <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-3 mb-6">
          YOUR CONTRIBUTION
        </h2>
        
        <div className="flex flex-col gap-10">
          {/* Main Content */}
          <div className="flex flex-col gap-3">
            <p className="text-[16px] text-foreground whitespace-pre-wrap leading-relaxed">
              {contribution.content || <span className="text-muted-foreground italic">No description provided.</span>}
            </p>
          </div>
          
          {/* Metadata/Context */}
          {contribution.metadata && Object.keys(contribution.metadata).length > 0 && (
            <div className="flex flex-col gap-8 pt-8 border-t border-border/20">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Context & Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                {Object.entries(contribution.metadata).map(([key, value]) => {
                  if (key === 'file_name' || key === 'file_path' || !value) return null;
                  return (
                    <div key={key} className="flex flex-col gap-2">
                      <span className="text-[12px] font-medium text-muted-foreground">{formatKey(key)}</span>
                      <span className="text-[15px] text-foreground whitespace-pre-wrap leading-relaxed">{String(value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Supporting Material */}
      {contribution.metadata?.file_name && fileUrl && (
        <div className="mb-16">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-3 mb-6">
            SUPPORTING MATERIAL
          </h2>
          
          <div className="border border-border/40 rounded-sm p-6 bg-muted/5 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-background border border-border/60 rounded-sm flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-foreground" />
              </div>
              <div className="flex flex-col gap-1 overflow-hidden">
                <span className="text-[14px] font-medium text-foreground truncate">{contribution.metadata.file_name}</span>
                <span className="text-[12px] text-muted-foreground">Attached Document</span>
              </div>
            </div>
            
            <a 
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 text-[11px] font-semibold uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors border border-border/60 bg-background px-4 py-2 rounded-sm text-center"
            >
              OPEN FILE →
            </a>
          </div>
        </div>
      )}

      {/* Bottom Actions Loop */}
      <div className="mt-20 pt-10 border-t border-border/40 flex flex-col items-center justify-center gap-4 text-center">
        <span className="text-[14.5px] text-muted-foreground">Want to share something else?</span>
        <Link 
          href="/contributor/contribute" 
          className="text-[12px] font-semibold uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors border border-foreground/20 px-6 py-3 rounded-sm hover:border-foreground/50"
        >
          + NEW CONTRIBUTION
        </Link>
      </div>

    </div>
  );
}