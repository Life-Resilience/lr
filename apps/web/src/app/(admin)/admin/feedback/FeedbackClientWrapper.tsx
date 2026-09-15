"use client";

import { useState, useTransition } from "react";
import { updateFeedbackStatusAction } from "../actions";

export default function FeedbackClientWrapper({ feedbackList }: { feedbackList: any[] }) {
  const [activeTab, setActiveTab] = useState("SUBMITTED");
  const [isPending, startTransition] = useTransition();

  const handleUpdateStatus = (id: string, status: string) => {
    startTransition(async () => {
      await updateFeedbackStatusAction(id, status, null);
    });
  };

  const filtered = feedbackList.filter(f => f.status === activeTab);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-6 border-b border-border/40">
        {['SUBMITTED', 'UNDER REVIEW', 'PUBLISHED', 'REJECTED'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[12px] font-semibold uppercase tracking-widest transition-colors relative ${
              activeTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {filtered.length === 0 ? (
          <div className="p-12 border border-border/40 text-center bg-muted/5 rounded-sm">
            <span className="text-muted-foreground text-[14px]">No feedback in this category.</span>
          </div>
        ) : (
          filtered.map(fb => (
            <div key={fb.id} className="p-6 border border-border/40 bg-card rounded-sm flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {new Date(fb.created_at).toLocaleString()}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 bg-muted/20 rounded-sm">
                    {fb.attribution_preference === 'Anonymous' ? 'ANONYMOUS' : 'PUBLIC NAME'}
                  </span>
                </div>
                <p className="text-lg text-foreground italic leading-relaxed">
                  "{fb.response}"
                </p>
                <div className="flex flex-col gap-1 text-[13px] text-muted-foreground border-t border-border/20 pt-4 mt-2">
                  <span className="font-medium text-foreground">Contributor: {fb.contributor_profiles?.name}</span>
                  {fb.contributions?.title && <span>Contribution: {fb.contributions.title} ({fb.contributions.type})</span>}
                  {fb.research_areas?.title && <span>Area: {fb.research_areas.title}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                {activeTab === 'SUBMITTED' && (
                  <button 
                    disabled={isPending}
                    onClick={() => handleUpdateStatus(fb.id, 'UNDER REVIEW')}
                    className="px-4 py-2 bg-muted text-foreground text-[11px] font-semibold uppercase tracking-widest rounded-sm hover:bg-muted/80 transition-colors disabled:opacity-50 border border-border/40"
                  >
                    MARK UNDER REVIEW
                  </button>
                )}
                {activeTab === 'UNDER REVIEW' && (
                  <button 
                    disabled={isPending}
                    onClick={() => handleUpdateStatus(fb.id, 'PUBLISHED')}
                    className="px-4 py-2 bg-foreground text-background text-[11px] font-semibold uppercase tracking-widest rounded-sm hover:bg-foreground/90 transition-colors disabled:opacity-50"
                  >
                    APPROVE & PUBLISH
                  </button>
                )}
                {(activeTab === 'SUBMITTED' || activeTab === 'UNDER REVIEW') && (
                  <button 
                    disabled={isPending}
                    onClick={() => handleUpdateStatus(fb.id, 'REJECTED')}
                    className="px-4 py-2 bg-red-500/10 text-red-500 text-[11px] font-semibold uppercase tracking-widest rounded-sm hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    REJECT
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
