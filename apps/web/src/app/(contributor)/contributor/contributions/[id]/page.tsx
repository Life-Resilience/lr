"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ContributionDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const isSuccess = searchParams.get('success') === 'true';
  const supabase = createClient();
  const [contribution, setContribution] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase
        .from('contributions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
        setContribution(data);
        if (data.metadata?.file_path) {
          const { data: urlData } = await supabase.storage
            .from('contributions')
            .createSignedUrl(data.metadata.file_path, 3600);
          if (urlData) {
            setFileUrl(urlData.signedUrl);
          }
        }
      }
      setIsLoading(false);
    }
    loadData();
  }, [supabase, id]);

  if (isLoading) {
    return <div className="p-6 lg:p-12 animate-pulse font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Loading...</div>;
  }

  if (!contribution) {
    return <div className="p-6 lg:p-12 text-foreground">Contribution not found.</div>;
  }

  return (
    <div className="p-6 lg:p-12 max-w-4xl">
      {isSuccess ? (
        <div className="mb-12">
          <div className="mb-8 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span className="text-foreground">LR / SUBMISSION</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-4">
            Contribution received.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Thank you for contributing to LR. Your submission will be reviewed before it is considered for research.
          </p>
          <div className="border-b border-border/40 pb-12 mt-12" />
        </div>
      ) : (
        <div className="mb-12">
          <button 
            onClick={() => router.push('/contributor/contributions')}
            className="mb-8 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Contributions
          </button>
        </div>
      )}

      <div className="mb-12 flex flex-col gap-8">
        <div className="flex flex-col items-start gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className={`w-2 h-2 rounded-full ${contribution.status === 'SUBMITTED' ? 'bg-foreground' : 'bg-border'}`} aria-hidden="true" />
            <span className={contribution.status === 'SUBMITTED' ? 'text-foreground font-medium' : ''}>SUBMITTED</span>
          </div>
          <div className="pl-1 text-border/40" aria-hidden="true">↓</div>
          <div className="flex items-center gap-4 pl-[3px]">
            <span className={`w-1.5 h-1.5 rounded-full ${contribution.status === 'UNDER REVIEW' ? 'bg-foreground' : 'bg-border'}`} aria-hidden="true" />
            <span className={contribution.status === 'UNDER REVIEW' ? 'text-foreground font-medium' : ''}>UNDER REVIEW</span>
          </div>
          <div className="pl-1 text-border/40" aria-hidden="true">↓</div>
          <div className="flex items-center gap-4 pl-[3px]">
            <span className={`w-1.5 h-1.5 rounded-full ${contribution.status === 'REVIEWED' ? 'bg-foreground' : 'bg-border'}`} aria-hidden="true" />
            <span className={contribution.status === 'REVIEWED' ? 'text-foreground font-medium' : ''}>REVIEWED</span>
          </div>
        </div>

        <div className="border-l-2 border-foreground pl-6 py-4 mt-4 bg-muted/5">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground mb-4">LR RESPONSE</h3>
          {contribution.admin_response ? (
            <p className="text-base text-foreground whitespace-pre-wrap">
              {contribution.admin_response}
            </p>
          ) : (
            <p className="text-base text-muted-foreground italic">
              LR has received your contribution. A response will appear here if the research team adds one.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">ID</span>
          <span className="text-foreground font-mono">{contribution.display_id || `LR-C-${contribution.id.substring(0, 8).toUpperCase()}`}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Type</span>
          <span className="text-foreground">{contribution.type}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Title</span>
          <span className="text-xl text-foreground font-medium">{contribution.title}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Content</span>
          <p className="text-foreground whitespace-pre-wrap leading-relaxed bg-muted/10 p-6 border border-border/40 rounded-sm">
            {contribution.content}
          </p>
        </div>
        
        {contribution.metadata && Object.entries(contribution.metadata).map(([key, value]) => {
          if (key === 'file_name' || key === 'file_path' || !value) return null;
          return (
            <div key={key} className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{key.replace(/_/g, ' ')}</span>
              <span className="text-foreground whitespace-pre-wrap">{value as string}</span>
            </div>
          );
        })}

        {contribution.metadata?.file_name && fileUrl && (
          <div className="flex flex-col gap-2 mt-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Supporting Material</span>
            <a 
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline decoration-border/40 hover:decoration-foreground underline-offset-4"
            >
              {contribution.metadata.file_name}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
