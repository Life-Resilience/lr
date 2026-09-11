export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-medium text-foreground mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="p-6 bg-surface border border-border rounded-lg">
          <div className="text-sm font-medium text-muted mb-2">Research Areas</div>
          <div className="text-3xl font-medium text-foreground font-sans">06</div>
        </div>
        <div className="p-6 bg-surface border border-border rounded-lg">
          <div className="text-sm font-medium text-muted mb-2">Active Research</div>
          <div className="text-3xl font-medium text-foreground font-sans">02</div>
        </div>
        <div className="p-6 bg-surface border border-border rounded-lg">
          <div className="text-sm font-medium text-muted mb-2">Completed</div>
          <div className="text-3xl font-medium text-foreground font-sans">01</div>
        </div>
        <div className="p-6 bg-surface border border-border rounded-lg">
          <div className="text-sm font-medium text-muted mb-2">Questions</div>
          <div className="text-3xl font-medium text-foreground font-sans">42</div>
        </div>
        <div className="p-6 bg-surface border border-border rounded-lg">
          <div className="text-sm font-medium text-muted mb-2">Observations</div>
          <div className="text-3xl font-medium text-foreground font-sans">87</div>
        </div>
        <div className="p-6 bg-surface border border-border rounded-lg">
          <div className="text-sm font-medium text-muted mb-2">Evidence</div>
          <div className="text-3xl font-medium text-foreground font-sans">154</div>
        </div>
        <div className="p-6 bg-surface border border-border rounded-lg">
          <div className="text-sm font-medium text-muted mb-2">Sources</div>
          <div className="text-3xl font-medium text-foreground font-sans">198</div>
        </div>
        <div className="p-6 bg-surface border border-border rounded-lg">
          <div className="text-sm font-medium text-muted mb-2">Contributions</div>
          <div className="text-3xl font-medium text-foreground font-sans">23</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-lg font-medium text-foreground mb-4 border-b border-border pb-2">Recent Observations</h2>
          <div className="text-sm text-muted py-4">Waiting for API integration...</div>
        </section>
        <section>
          <h2 className="text-lg font-medium text-foreground mb-4 border-b border-border pb-2">Pending Contributions</h2>
          <div className="text-sm text-muted py-4">Waiting for API integration...</div>
        </section>
        <section>
          <h2 className="text-lg font-medium text-foreground mb-4 border-b border-border pb-2">Open Questions</h2>
          <div className="text-sm text-muted py-4">Waiting for API integration...</div>
        </section>
        <section>
          <h2 className="text-lg font-medium text-foreground mb-4 border-b border-border pb-2">Recently Updated Research</h2>
          <div className="text-sm text-muted py-4">Waiting for API integration...</div>
        </section>
      </div>
    </div>
  );
}
