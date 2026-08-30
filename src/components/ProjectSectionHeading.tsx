interface ProjectSectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  count: number;
  description?: string;
}

export function ProjectSectionHeading({
  index,
  eyebrow,
  title,
  count,
  description,
}: ProjectSectionHeadingProps) {
  return (
    <div className="mb-7 flex items-end gap-4">
      <span className="grid size-9 shrink-0 place-items-center border border-primary/25 font-mono text-[10px] text-primary">
        {index}
      </span>
      <div className="min-w-0">
        <p className="mb-1 font-mono text-[9px] tracking-[0.16em] text-primary">{eyebrow}</p>
        <h2 className="text-xl font-bold leading-none text-foreground sm:text-2xl">{title}</h2>
        {description && (
          <p className="mt-2 text-xs leading-5 text-foreground-secondary sm:text-sm">{description}</p>
        )}
      </div>
      <span aria-hidden="true" className="mb-1 hidden h-px flex-1 bg-border sm:block" />
      <span className="mb-0.5 shrink-0 font-mono text-[10px] text-foreground-secondary">
        {String(count).padStart(2, "0")} ITEMS
      </span>
    </div>
  );
}
