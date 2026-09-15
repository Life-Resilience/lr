"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitApplication(opportunityId: string, opportunityTitle: string, coverLetter: string, experience: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to apply.");
  }

  // Generate a display ID (e.g. LR-C-XXXX) - normally handled by a DB trigger, but we'll let the frontend derive it if missing, or we can just use uuid substring like other contributions.
  // We'll insert it directly.
  
  const metadata = {
    opportunity_id: opportunityId,
    opportunity_title: opportunityTitle,
    experience: experience || null
  };

  const { error: insertError } = await supabase
    .from('contributions')
    .insert({
      user_id: user.id,
      type: 'APPLICATION',
      title: `Application: ${opportunityTitle}`,
      content: coverLetter,
      metadata,
      status: 'SUBMITTED'
    });

  if (insertError) {
    throw new Error("Failed to submit application: " + insertError.message);
  }

  revalidatePath("/contributor/opportunities");
  revalidatePath("/contributor");
}
