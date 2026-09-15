import { KeyRound, ExternalLink } from "lucide-react";

export function AdminServiceRoleNotice() {
  const hasServiceRoleKey = 
    typeof process.env.SUPABASE_SERVICE_ROLE_KEY === "string" && 
    process.env.SUPABASE_SERVICE_ROLE_KEY.length > 20;

  if (hasServiceRoleKey) return null;

  return (
    <div className="mb-8 p-5 bg-amber-500/5 border border-amber-500/20 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <KeyRound className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-medium text-foreground">
            Database Service Role Key Required to Display Platform Records
          </span>
          <span className="text-[12px] text-muted-foreground leading-relaxed">
            Due to Supabase Row Level Security (RLS), add <code className="font-mono text-foreground px-1 bg-muted/40 rounded">SUPABASE_SERVICE_ROLE_KEY</code> to <code className="font-mono text-foreground px-1 bg-muted/40 rounded">apps/web/.env.local</code> to view all contributor data and submissions.
          </span>
        </div>
      </div>
      <a 
        href="https://supabase.com/dashboard/project/raaqrnucgmnowysaiprv/settings/api"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-500 hover:underline shrink-0 whitespace-nowrap"
      >
        Supabase API Keys <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
