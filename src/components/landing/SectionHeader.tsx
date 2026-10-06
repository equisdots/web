export function SectionHeader({
  index,
  label,
  title,
  subtitle,
}: {
  index: string;
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="border-t border-border pt-6">
      <div className="flex items-baseline gap-3">
        <span className="index">{index}</span>
        <span className="label">{label}</span>
      </div>
      <h2 className="mt-3 text-2xl font-normal tracking-tight sm:text-3xl">{title}</h2>
      {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{subtitle}</p> : null}
    </header>
  );
}
