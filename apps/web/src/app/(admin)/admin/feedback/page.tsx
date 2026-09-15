import { createAdminClient } from "@/lib/supabase/admin";
import { AdminServiceRoleNotice } from "@/components/admin/AdminServiceRoleNotice";
import { MessageSquare, ExternalLink } from "lucide-react";
import Link from "next/link";
import FeedbackClientWrapper from "./FeedbackClientWrapper";

export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
  const supabase = await createAdminClient();
  const { data: feedbackList } = await supabase
    .from('community_feedback')
    .select(`
      id, response, attribution_preference, status, admin_notes, created_at,
      contributor_profiles(name, user_id),
      contributions(title, type),
      research_areas(title)
    `)
    .order('created_at', { ascending: false });

  const fbList = feedbackList || [];
  
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 lg:py-12 animate-in fade-in duration-300">
      <div className="flex flex-col gap-5 mb-10">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground leading-none uppercase">
          Community Feedback
        </h1>
        <p className="text-[17px] text-muted-foreground leading-relaxed">
          Review, moderate, and publish community feedback from contributors.
        </p>
      </div>

      <AdminServiceRoleNotice />

      <FeedbackClientWrapper feedbackList={fbList} />
    </div>
  );
}
