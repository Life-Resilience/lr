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

export async function createOpportunityAction(formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;
  const status = formData.get("status") as string || "DRAFT";

  if (!title || !description || !type) {
    throw new Error("Missing required fields");
  }

  const supabase = await createAdminClient();
  
  const { error } = await supabase
    .from("available_opportunities")
    .insert({
      title,
      description,
      type,
      status
    });

  if (error) {
    console.error("Error creating opportunity:", error);
    throw new Error("Failed to create opportunity");
  }

  revalidatePath("/admin/opportunities");
  return { success: true };
}

export async function updateOpportunityStatusAction(id: string, newStatus: string) {
  await requireAdmin();
  const supabase = await createAdminClient();
  
  const { error } = await supabase
    .from("available_opportunities")
    .update({ status: newStatus })
    .eq('id', id);

  if (error) {
    console.error("Error updating opportunity status:", error);
    throw new Error("Failed to update status");
  }

  revalidatePath("/admin/opportunities");
  return { success: true };
}
