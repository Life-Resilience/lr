"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifyAdminToken, getAdminConfig } from "@/lib/admin-auth";

async function requireAdmin() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('lr_admin_session')?.value;
  if (!sessionToken) throw new Error("Unauthorized");
  
  const { adminEmail } = getAdminConfig();
  const { valid, email } = verifyAdminToken(sessionToken);
  
  if (!valid || !adminEmail || email?.toLowerCase() !== adminEmail) {
    throw new Error("Unauthorized");
  }
}

async function appendHistory(supabase: any, id: string, entry: any) {
  const { data } = await supabase.from('contributions').select('metadata').eq('id', id).single();
  const metadata = data?.metadata || {};
  const history = metadata.history || [];
  history.push({ ...entry, date: new Date().toISOString() });
  return { ...metadata, history };
}

export async function markUnderReview(id: string) {
  await requireAdmin();
  const supabase = await createAdminClient();
  const metadata = await appendHistory(supabase, id, {
    actor: 'admin',
    action: 'STATUS_CHANGE',
    status: 'UNDER REVIEW'
  });
  
  const { error: updateError } = await supabase
    .from('contributions')
    .update({ 
      status: 'UNDER REVIEW', 
      updated_at: new Date().toISOString(),
      metadata
    })
    .eq('id', id);

  if (updateError) throw new Error(updateError.message);

  revalidatePath('/admin/contributions/' + id);
  revalidatePath('/admin/review');
  revalidatePath('/contributor', 'layout');
}

export async function acceptContribution(id: string, feedback?: string) {
  await requireAdmin();
  const supabase = await createAdminClient();
  const metadata = await appendHistory(supabase, id, {
    actor: 'admin',
    action: 'STATUS_CHANGE',
    status: 'ACCEPTED',
    message: feedback || null
  });
  
  const { error: updateError } = await supabase
    .from('contributions')
    .update({ 
      status: 'ACCEPTED', 
      reviewed_at: new Date().toISOString(),
      admin_response: feedback || null,
      metadata
    })
    .eq('id', id);

  if (updateError) throw new Error(updateError.message);

  revalidatePath('/admin/contributions/' + id);
  revalidatePath('/admin/review');
  revalidatePath('/contributor', 'layout');
}

export async function requestChanges(id: string, feedback: string) {
  await requireAdmin();
  const supabase = await createAdminClient();
  const metadata = await appendHistory(supabase, id, {
    actor: 'admin',
    action: 'STATUS_CHANGE',
    status: 'NEEDS CHANGES',
    message: feedback
  });
  
  const { error: updateError } = await supabase
    .from('contributions')
    .update({ 
      status: 'NEEDS CHANGES', 
      reviewed_at: new Date().toISOString(),
      admin_response: feedback,
      metadata
    })
    .eq('id', id);

  if (updateError) throw new Error(updateError.message);

  revalidatePath('/admin/contributions/' + id);
  revalidatePath('/admin/review');
  revalidatePath('/contributor', 'layout');
}

export async function rejectContribution(id: string, feedback: string) {
  await requireAdmin();
  const supabase = await createAdminClient();
  const metadata = await appendHistory(supabase, id, {
    actor: 'admin',
    action: 'STATUS_CHANGE',
    status: 'REJECTED',
    message: feedback
  });
  
  const { error: updateError } = await supabase
    .from('contributions')
    .update({ 
      status: 'REJECTED', 
      reviewed_at: new Date().toISOString(),
      admin_response: feedback,
      metadata
    })
    .eq('id', id);

  if (updateError) throw new Error(updateError.message);

  revalidatePath('/admin/contributions/' + id);
  revalidatePath('/admin/review');
  revalidatePath('/contributor', 'layout');
}

export async function saveAdminNote(id: string, note: string) {
  await requireAdmin();
  const supabase = await createAdminClient();
  
  const { error } = await supabase
    .from('contribution_admin_notes')
    .upsert({ 
      contribution_id: id,
      internal_note: note,
      updated_at: new Date().toISOString()
    });

  if (error) throw new Error(error.message);

  revalidatePath('/admin/contributions/' + id);
}

export async function updateFeedbackStatusAction(id: string, status: string, notes: string | null) {
  await requireAdmin();
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('community_feedback')
    .update({ 
      status, 
      admin_notes: notes,
      published_at: status === 'PUBLISHED' ? new Date().toISOString() : null
    })
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/feedback');
  revalidatePath('/contribute');
  revalidatePath('/contributor', 'layout');
}
