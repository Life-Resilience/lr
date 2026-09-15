import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminOpportunityDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createAdminClient();
  
  const { data: opp } = await supabase
    .from('opportunities')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!opp) {
    notFound();
  }

  const { data: profile } = await supabase
    .from('contributor_profiles')
    .select('*')
    .eq('user_id', opp.user_id)
    .single();

  const displayName = profile?.preferred_name || profile?.name || 'Unknown';

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-10 lg:py-12 animate-in fade-in duration-300">
      <Link href="/admin/opportunities" className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-10">
        <ChevronLeft className="w-4 h-4" />
        BACK TO OPPORTUNITIES
      </Link>

      <div className="flex flex-col gap-5 mb-12">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-sm text-[11px] font-mono uppercase tracking-widest bg-muted text-foreground">
            {opp.area}
          </span>
          <span className="text-[13px] text-muted-foreground">
            {new Date(opp.created_at).toLocaleDateString()}
          </span>
        </div>
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground leading-none">
          {displayName}&apos;s Interest
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-8">
          <div className="bg-surface border border-border/40 p-8 rounded-sm flex flex-col gap-6">
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-3 mb-4">
                WHY ARE THEY INTERESTED?
              </h2>
              <p className="text-[15px] text-foreground leading-relaxed whitespace-pre-wrap">
                {opp.reason}
              </p>
            </div>
            {opp.experience && (
              <div>
                <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-3 mb-4 mt-6">
                  RELEVANT EXPERIENCE
                </h2>
                <p className="text-[15px] text-foreground leading-relaxed whitespace-pre-wrap">
                  {opp.experience}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-surface border border-border/40 p-6 rounded-sm flex flex-col gap-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-3">
              CONTRIBUTOR PROFILE
            </h2>
            
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">NAME</span>
              <span className="text-[14px] font-medium text-foreground">{profile?.name || '—'}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">EMAIL</span>
              <span className="text-[14px] text-foreground">{profile?.email || '—'}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">LOCATION</span>
              <span className="text-[14px] text-foreground">{profile?.country || '—'}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">DISCOVERY SOURCE</span>
              <span className="text-[14px] text-foreground">{profile?.discovery_source || '—'}</span>
              {profile?.discovery_details && (
                <span className="text-[13px] text-muted-foreground mt-1">{profile.discovery_details}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
