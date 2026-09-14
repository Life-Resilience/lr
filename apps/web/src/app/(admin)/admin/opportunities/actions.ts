"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createOpportunityAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;

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
      status: "OPEN"
    });

  if (error) {
    console.error("Error creating opportunity:", error);
    throw new Error("Failed to create opportunity");
  }

  revalidatePath("/admin/opportunities");
  return { success: true };
}
