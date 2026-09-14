import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { approveContribution, rejectContribution, requestChanges, saveAdminNote } from "@/app/(admin)/admin/actions";
import { AdminReviewControls } from "./AdminReviewControls";

export const dynamic = "force-dynamic";

export default async function ContributionReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createAdminClient();

  const { data: contribution } = await supabase
    .from('contributions')
    .select('*')
    .eq('id', id)
    .single();

  if (!contribution) notFound();

  const { data: profile } = await supabase
    .from('contributor_profiles')
    .select('*')
    .eq('user_id', contribution.user_id)
    .single();

  const { data: adminNote } = await supabase
    .from('contribution_admin_notes')
    .select('internal_note')
    .eq('contribution_id', id)
    .single();

  const metadata = contribution.metadata || {};
  const cat = contribution.type.toLowerCase();

  const renderField = (label: string, value: string | undefined | null) => {
    if (!value) return null;
    return (
      <div className="flex flex-col gap-3 pb-8 border-b border-border/40 last:border-0 last:pb-0">
        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </label>
        <div className="text-[16px] text-foreground leading-relaxed whitespace-pre-wrap">
          {value}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 lg:py-12 animate-in fade-in duration-300">
      <Link href="/admin/review" className="inline-flex items-center gap-2 text-[11px] font-mono text-muted-foreground hover:text-foreground uppercase tracking-widest mb-8 transition-colors">
        <ArrowLeft className="w-3 h-3" /> Back to Queue
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">
            {contribution.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-mono uppercase tracking-widest bg-muted text-foreground">
              {contribution.type}
            </span>
            <span>Submitted {new Date(contribution.created_at).toLocaleDateString()}</span>
            <span>By <Link href={`/admin/contributors/${profile?.id}`} className="hover:text-foreground hover:underline">{profile?.preferred_name || profile?.name || 'Unknown'}</Link></span>
          </div>
        </div>
        
        <span className={`inline-flex items-center px-4 py-2 rounded-sm text-[12px] font-mono uppercase tracking-widest ${
          contribution.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' :
          contribution.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
          contribution.status === 'NEEDS_CHANGES' ? 'bg-yellow-500/10 text-yellow-600' :
          'bg-cyan-500/10 text-cyan-500'
        }`}>
          {contribution.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-surface border border-border/40 p-8 rounded-sm flex flex-col gap-8">
            
            {cat === "experience" && (
              <>
                {renderField("What happened / what did you experience?", contribution.content)}
                {renderField("When?", metadata.when)}
                {renderField("Where?", metadata.where)}
                {renderField("What made this worth sharing?", metadata.worth_sharing)}
              </>
            )}
            
            {cat === "observation" && (
              <>
                {renderField("What did you observe?", contribution.content)}
                {renderField("Where did you observe it?", metadata.where)}
                {renderField("When?", metadata.when)}
                {renderField("Why do you think it matters?", metadata.why_it_matters)}
              </>
            )}

            {cat === "research" && (
              <>
                {renderField("Research / findings", contribution.content)}
                {renderField("Method or context", metadata.method_or_context)}
                {renderField("Sources / references", metadata.sources)}
                {renderField("Key conclusion", metadata.conclusion)}
              </>
            )}

            {cat === "evidence" && (
              <>
                {renderField("What does this evidence show?", contribution.content)}
                {renderField("Evidence/context", metadata.evidence_context)}
                {renderField("Source/context if applicable", metadata.source)}
              </>
            )}

            {cat === "idea" && (
              <>
                {renderField("What problem or idea should LR investigate?", contribution.content)}
                {renderField("Why does it matter?", metadata.why_it_matters)}
                {renderField("Additional context", metadata.additional_context)}
              </>
            )}

            {cat === "question" && (
              <>
                {renderField("Question", contribution.content)}
                {renderField("Why should LR investigate it?", metadata.why_investigate)}
                {renderField("Context", metadata.context)}
              </>
            )}

            {cat === "pattern" && (
              <>
                {renderField("What pattern did you notice?", contribution.content)}
                {renderField("Where/when did you notice it?", metadata.where_when)}
                {renderField("Why does the pattern matter?", metadata.why_it_matters)}
              </>
            )}

            {cat === "other" && (
              <>
                {renderField("What would you like to share?", contribution.content)}
                {renderField("Context", metadata.context)}
              </>
            )}

            {metadata.file_path && (
              <div className="pt-8 border-t border-border/40 flex flex-col gap-4">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Supporting Material
                </label>
                <div className="flex items-center gap-4 bg-muted/10 border border-border/40 p-4 rounded-sm">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">{metadata.file_name || 'Attached File'}</span>
                  {/* File download logic would go here */}
                  <span className="text-xs text-muted-foreground ml-auto bg-muted px-2 py-1 rounded-sm">Requires Bucket Access</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="flex flex-col gap-6">
          <AdminReviewControls 
            contributionId={contribution.id} 
            initialStatus={contribution.status}
            initialFeedback={contribution.admin_response || ''}
            initialAdminNote={adminNote?.internal_note || ''}
          />
        </div>

      </div>
    </div>
  );
}
