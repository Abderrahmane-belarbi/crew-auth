export function SectionCard({ title, subtitle, children, icon }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl p-6">
      <div className="mb-6 flex items-start gap-4">
        {icon && <div className="mt-1">{icon}</div>}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}
