export default function FeatureGrid({ title, content, Icon, color="text-primary" }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-xl p-5">
      <Icon className={`h-6 w-6 ${color} mx-auto mb-3`}/>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{content}</p>
    </div>
  );
}
