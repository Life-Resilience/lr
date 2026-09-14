export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 lg:py-12 animate-in fade-in duration-300">
      <div className="flex flex-col gap-5 mb-10">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground leading-none uppercase">
          Admin Settings
        </h1>
        <p className="text-[17px] text-muted-foreground leading-relaxed">
          Security and system preferences.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <div className="bg-surface border border-border/40 p-8 rounded-sm flex flex-col gap-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-foreground">Security</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center py-4 border-b border-border/40">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">MFA Status</span>
                <span className="text-sm text-muted-foreground">Multi-factor authentication is required for all admins.</span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 bg-green-500/10 text-green-500 rounded-sm">Active</span>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-border/40">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">Session Timeout</span>
                <span className="text-sm text-muted-foreground">Workspace locks after 15 minutes of inactivity.</span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 bg-muted/20 text-muted-foreground rounded-sm">15 Min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
