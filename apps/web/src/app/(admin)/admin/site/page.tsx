export const dynamic = "force-dynamic";

export default function SiteControlsPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 lg:py-12 animate-in fade-in duration-300">
      <div className="flex flex-col gap-5 mb-10">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground leading-none uppercase">
          Site Controls
        </h1>
        <p className="text-[17px] text-muted-foreground leading-relaxed">
          Manage public website state and visibility.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface border border-border/40 p-8 rounded-sm flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-[14px] font-medium text-foreground">Maintenance Mode</h3>
            <p className="text-sm text-muted-foreground">Temporarily disable public access while performing upgrades.</p>
          </div>
          <button disabled className="w-fit text-[11px] font-semibold uppercase tracking-widest text-background bg-foreground px-6 py-3 rounded-sm opacity-50 cursor-not-allowed">
            Enable Maintenance Mode
          </button>
        </div>

        <div className="bg-surface border border-border/40 p-8 rounded-sm flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-[14px] font-medium text-foreground">Contribution System Status</h3>
            <p className="text-sm text-muted-foreground">Pause new incoming contributions.</p>
          </div>
          <button disabled className="w-fit text-[11px] font-semibold uppercase tracking-widest text-background bg-foreground px-6 py-3 rounded-sm opacity-50 cursor-not-allowed">
            Pause Submissions
          </button>
        </div>
      </div>
    </div>
  );
}
