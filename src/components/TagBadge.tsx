interface TagBadgeProps {
  tag: string;
  variant?: "default" | "primary" | "accent";
}

export function TagBadge({ tag, variant = "default" }: TagBadgeProps) {
  const variants = {
    default:
      "bg-background-secondary text-foreground-secondary border-border",
    primary: "bg-primary/10 text-primary border-primary/20",
    accent: "bg-accent/10 text-accent border-accent/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}
    >
      {tag}
    </span>
  );
}
