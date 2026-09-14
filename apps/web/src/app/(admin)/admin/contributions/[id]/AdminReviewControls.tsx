"use client";

import { useState } from "react";
import { Check, X, MessageSquare, Save } from "lucide-react";
import { approveContribution, rejectContribution, requestChanges, saveAdminNote } from "../../actions";

export function AdminReviewControls({ 
  contributionId, 
  initialStatus, 
  initialFeedback, 
  initialAdminNote 
}: { 
  contributionId: string, 
  initialStatus: string, 
  initialFeedback: string,
  initialAdminNote: string
}) {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [adminNote, setAdminNote] = useState(initialAdminNote);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await approveContribution(contributionId, feedback);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!feedback.trim()) {
      setError("Feedback is required to request changes.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await requestChanges(contributionId, feedback);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!feedback.trim()) {
      setError("Rejection reason is required.");
      return;
    }
    if (!confirm("Are you sure you want to reject this contribution?")) return;
    setIsLoading(true);
    setError(null);
    try {
      await rejectContribution(contributionId, feedback);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await saveAdminNote(contributionId, adminNote);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Review Actions */}
      <div className="bg-surface border border-border/40 p-6 rounded-sm flex flex-col gap-6">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-foreground">Review Action</h2>
        
        {error && <div className="text-red-500 text-xs bg-red-500/10 p-2 rounded-sm">{error}</div>}

        <div className="flex flex-col gap-3">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Feedback to Contributor (Required for Changes/Reject)
          </label>
          <textarea
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What should the contributor improve?"
            className="w-full bg-background border border-border/60 p-4 text-sm focus:outline-none focus:border-foreground transition-colors resize-y rounded-sm"
          />
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button 
            onClick={handleApprove}
            disabled={isLoading || initialStatus === 'APPROVED'}
            className="flex items-center justify-center gap-2 w-full text-[11px] font-semibold uppercase tracking-widest text-green-600 bg-green-500/10 hover:bg-green-500/20 px-4 py-3 rounded-sm transition-colors disabled:opacity-50"
          >
            <Check className="w-4 h-4" /> Approve
          </button>
          <button 
            onClick={handleRequestChanges}
            disabled={isLoading || initialStatus === 'NEEDS_CHANGES'}
            className="flex items-center justify-center gap-2 w-full text-[11px] font-semibold uppercase tracking-widest text-yellow-600 bg-yellow-500/10 hover:bg-yellow-500/20 px-4 py-3 rounded-sm transition-colors disabled:opacity-50"
          >
            <MessageSquare className="w-4 h-4" /> Request Changes
          </button>
          <button 
            onClick={handleReject}
            disabled={isLoading || initialStatus === 'REJECTED'}
            className="flex items-center justify-center gap-2 w-full text-[11px] font-semibold uppercase tracking-widest text-red-600 bg-red-500/10 hover:bg-red-500/20 px-4 py-3 rounded-sm transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" /> Reject
          </button>
        </div>
      </div>

      {/* Internal Notes */}
      <div className="bg-surface border border-border/40 p-6 rounded-sm flex flex-col gap-6">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-foreground">Internal Notes</h2>
        
        <div className="flex flex-col gap-3">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Admin Only (Not visible to contributor)
          </label>
          <textarea
            rows={4}
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Add internal context..."
            className="w-full bg-background border border-border/60 p-4 text-sm focus:outline-none focus:border-foreground transition-colors resize-y rounded-sm"
          />
        </div>

        <button 
          onClick={handleSaveNote}
          disabled={isLoading || adminNote === initialAdminNote}
          className="flex items-center justify-center gap-2 w-full text-[11px] font-semibold uppercase tracking-widest text-foreground bg-muted/20 hover:bg-muted/40 border border-border/60 px-4 py-3 rounded-sm transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> Save Note
        </button>
      </div>

    </div>
  );
}
