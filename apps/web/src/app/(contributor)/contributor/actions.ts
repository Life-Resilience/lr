"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function resubmitContribution(id: string, updateText: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to update a contribution.");
  }

  // Verify ownership
  const { data: existing, error: fetchError } = await supabase
    .from('contributions')
    .select('content, metadata, user_id')
    .eq('id', id)
    .single();

  if (fetchError || !existing) {
    throw new Error("Contribution not found or access denied.");
  }

  if (existing.user_id !== user.id) {
    throw new Error("Unauthorized.");
  }

  // Update logic: append the update to metadata and reset status to SUBMITTED
  const newMetadata = { ...existing.metadata };
  if (!newMetadata.updates) {
    newMetadata.updates = [];
  }
  newMetadata.updates.push({
    date: new Date().toISOString(),
    content: updateText
  });

  const { createAdminClient } = await import('@/lib/supabase/admin');
  const adminSupabase = await createAdminClient();

  const { error: updateError } = await adminSupabase
    .from('contributions')
    .update({ 
      status: 'SUBMITTED', 
      metadata: newMetadata,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  revalidatePath(`/contributor/contributions/${id}`);
  revalidatePath(`/contributor/contributions`);
}
