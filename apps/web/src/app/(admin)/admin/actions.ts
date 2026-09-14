"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function approveContribution(id: string, feedback?: string) {
  const supabase = await createAdminClient();
  
  const { error: updateError } = await supabase
    .from('contributions')
    .update({ 
      status: 'APPROVED', 
      reviewed_at: new Date().toISOString(),
      admin_response: feedback || null
    })
    .eq('id', id);

  if (updateError) throw new Error(updateError.message);

  revalidatePath(`/admin/contributions/${id}`);
  revalidatePath(`/admin/review`);
}

export async function requestChanges(id: string, feedback: string) {
  const supabase = await createAdminClient();
  
  const { error: updateError } = await supabase
    .from('contributions')
    .update({ 
      status: 'NEEDS_CHANGES', 
      reviewed_at: new Date().toISOString(),
      admin_response: feedback
    })
    .eq('id', id);

  if (updateError) throw new Error(updateError.message);

  revalidatePath(`/admin/contributions/${id}`);
  revalidatePath(`/admin/review`);
}

export async function rejectContribution(id: string, feedback: string) {
  const supabase = await createAdminClient();
  
  const { error: updateError } = await supabase
    .from('contributions')
    .update({ 
      status: 'REJECTED', 
      reviewed_at: new Date().toISOString(),
      admin_response: feedback
    })
    .eq('id', id);

  if (updateError) throw new Error(updateError.message);

  revalidatePath(`/admin/contributions/${id}`);
  revalidatePath(`/admin/review`);
}

export async function saveAdminNote(id: string, note: string) {
  const supabase = await createAdminClient();
  
  const { error } = await supabase
    .from('contribution_admin_notes')
    .upsert({ 
      contribution_id: id,
      internal_note: note,
      updated_at: new Date().toISOString()
    });

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/contributions/${id}`);
}
