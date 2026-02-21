export function AuthCard({ title, subtitle, children }) {
  return (
    <div className="w-full max-w-md animate-[fade-in_0.5s_ease-out_forwards]">
      <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl">
        <div className="px-8 py-10">
          {/* Header */}
          <div className="mb-8 space-y-2 text-center">
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
