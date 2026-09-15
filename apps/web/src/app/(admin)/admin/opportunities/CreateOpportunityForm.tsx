"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createOpportunityAction } from "./actions";

export function CreateOpportunityForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      await createOpportunityAction(formData);
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="text-[13px] text-red-500 bg-red-500/5 px-4 py-3 rounded-sm border border-red-500/20">
          {error}
        </div>
      )}
      {success && (
        <div className="text-[13px] text-green-600 bg-green-500/5 px-4 py-3 rounded-sm border border-green-500/20">
          Opportunity posted successfully.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Title</label>
          <input 
            id="title"
            name="title"
            required
            type="text" 
            placeholder="e.g. Remote Usability Testing" 
            className="w-full px-4 py-2 bg-background border border-border/60 rounded-sm text-[14px] focus:outline-none focus:border-foreground transition-colors"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="type" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Type</label>
          <select 
            id="type"
            name="type"
            className="w-full px-4 py-2 bg-background border border-border/60 rounded-sm text-[14px] focus:outline-none focus:border-foreground transition-colors appearance-none"
          >
            <option value="RESEARCH">Research</option>
            <option value="INTERVIEW">Interview</option>
            <option value="SURVEY">Survey</option>
            <option value="COLLABORATION">Collaboration</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="status" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Status</label>
          <select 
            id="status"
            name="status"
            className="w-full px-4 py-2 bg-background border border-border/60 rounded-sm text-[14px] focus:outline-none focus:border-foreground transition-colors appearance-none"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Description</label>
        <textarea 
          id="description"
          name="description"
          required
          rows={3}
          placeholder="Describe the opportunity and what kind of participants you're looking for..." 
          className="w-full px-4 py-3 bg-background border border-border/60 rounded-sm text-[14px] focus:outline-none focus:border-foreground transition-colors resize-y"
        />
      </div>
      
      <div className="flex justify-end mt-2">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-background bg-foreground px-6 py-3 rounded-sm hover:bg-foreground/90 transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {isSubmitting ? "SAVING..." : "SAVE OPPORTUNITY"}
        </button>
      </div>
    </form>
  );
}
