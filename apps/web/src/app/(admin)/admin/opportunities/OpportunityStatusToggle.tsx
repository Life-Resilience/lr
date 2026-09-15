"use client";

import { useState } from "react";
import { updateOpportunityStatusAction } from "./actions";

export function OpportunityStatusToggle({ id, initialStatus }: { id: string, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    try {
      await updateOpportunityStatusAction(id, newStatus);
      setStatus(newStatus);
    } catch (err) {
      console.error(err);
      // revert on error
      e.target.value = status; 
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={status}
      onChange={handleStatusChange}
      disabled={isUpdating}
      className="text-[11px] font-semibold uppercase tracking-widest bg-background border border-border/60 rounded-sm px-3 py-1 focus:outline-none focus:border-foreground"
    >
      <option value="DRAFT">DRAFT</option>
      <option value="PUBLISHED">PUBLISHED</option>
      <option value="CLOSED">CLOSED</option>
    </select>
  );
}
