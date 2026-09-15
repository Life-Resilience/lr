import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { ArrowLeft, Search, ChevronRight } from "lucide-react";
import { AdminServiceRoleNotice } from "@/components/admin/AdminServiceRoleNotice";

export const dynamic = "force-dynamic";

export default async function CategorySubmissionsPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>,
  searchParams: { status?: string }
}) {
  const { id } = await params;
  const categoryName = id.toUpperCase();
  const currentStatus = searchParams.status || 'all';
  
  const supabase = await createAdminClient();
  
  let query = supabase
    .from('contributions')
    .select('id, title, status, created_at, user_id')
    .eq('type', categoryName)
    .order('created_at', { ascending: false });

  if (currentStatus === 'pending') {
    query = query.eq('status', 'SUBMITTED');
  } else if (currentStatus === 'under-review') {
    query = query.eq('status', 'UNDER REVIEW');
  } else if (currentStatus === 'accepted') {
    query = query.eq('status', 'ACCEPTED');
  } else if (currentStatus === 'needs-changes') {
    query = query.eq('status', 'NEEDS CHANGES');
  } else if (currentStatus === 'rejected') {
    query = query.eq('status', 'REJECTED');
  }

  const { data: contributions } = await query;

  const userIds = [...new Set((contributions || []).map(c => c.user_id))];
  const { data: profiles } = await supabase
    .from('contributor_profiles')
    .select('user_id, name, preferred_name')
    .in('user_id', userIds);
    
  const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 lg:py-12 animate-in fade-in duration-300">
      <Link href="/admin/categories" className="inline-flex items-center gap-2 text-[11px] font-mono text-muted-foreground hover:text-foreground uppercase tracking-widest mb-8 transition-colors">
        <ArrowLeft className="w-3 h-3" /> Back to Categories
      </Link>

      <div className="flex flex-col gap-5 mb-10">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground leading-none uppercase">
          {categoryName}
        </h1>
        <p className="text-[17px] text-muted-foreground leading-relaxed">
          Manage {categoryName.toLowerCase()} submissions.
        </p>
      </div>

      <AdminServiceRoleNotice />

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border/40 mb-8 overflow-x-auto pb-1">
        <Link 
          href={`/admin/categories/${id}?status=all`}
          className={`pb-3 text-[11px] font-semibold uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${
            currentStatus === 'all' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          ALL
        </Link>
        <Link 
          href={`/admin/categories/${id}?status=pending`}
          className={`pb-3 text-[11px] font-semibold uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${
            currentStatus === 'pending' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          PENDING
        </Link>
        <Link 
          href={`/admin/categories/${id}?status=under-review`}
          className={`pb-3 text-[11px] font-semibold uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${
            currentStatus === 'under-review' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          UNDER REVIEW
        </Link>
        <Link 
          href={`/admin/categories/${id}?status=needs-changes`}
          className={`pb-3 text-[11px] font-semibold uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${
            currentStatus === 'needs-changes' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          NEEDS CHANGES
        </Link>
        <Link 
          href={`/admin/categories/${id}?status=accepted`}
          className={`pb-3 text-[11px] font-semibold uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${
            currentStatus === 'accepted' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          ACCEPTED
        </Link>
        <Link 
          href={`/admin/categories/${id}?status=rejected`}
          className={`pb-3 text-[11px] font-semibold uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${
            currentStatus === 'rejected' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          REJECTED
        </Link>
      </div>

      <div className="bg-surface border border-border/40 rounded-sm">
        <div className="p-4 border-b border-border/40 flex items-center justify-between">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder={`Search ${categoryName.toLowerCase()}...`}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border/60 rounded-sm text-sm focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
          <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
            {contributions?.length || 0} TOTAL
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/10">
                <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">ID / Title</th>
                <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Contributor</th>
                <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Date</th>
                <th className="py-4 px-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>
            <tbody>
              {(!contributions || contributions.length === 0) ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground text-sm">
                    No submissions found.
                  </td>
                </tr>
              ) : (
                contributions.map((c) => {
                  const profile = profileMap.get(c.user_id);
                  const displayName = profile?.preferred_name || profile?.name || 'Unknown';
                  const shortId = `${c.id.split('-')[0]}-${c.id.split('-')[1]}`;
                  
                  return (
                    <tr key={c.id} className="border-b border-border/40 last:border-0 hover:bg-muted/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                            {shortId}
                          </span>
                          <span className="font-medium text-foreground truncate max-w-[250px]">{c.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground text-sm truncate max-w-[150px]">{displayName}</td>
                      <td className="py-4 px-6 text-muted-foreground text-sm">{new Date(c.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-sm text-[10px] font-mono uppercase tracking-widest ${
                          c.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-500' :
                          c.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                          c.status === 'NEEDS CHANGES' ? 'bg-yellow-500/10 text-yellow-600' :
                          c.status === 'UNDER REVIEW' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-cyan-500/10 text-cyan-500'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link 
                          href={`/admin/contributions/${c.id}`}
                          className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-background bg-foreground px-4 py-2 rounded-sm hover:bg-foreground/90 transition-colors"
                        >
                          REVIEW
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
