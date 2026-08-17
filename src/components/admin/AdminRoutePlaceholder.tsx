interface AdminRoutePlaceholderProps {
  title: string;
  description: string;
  nextStep: string;
}

export function AdminRoutePlaceholder({
  title,
  description,
  nextStep,
}: AdminRoutePlaceholderProps) {
  return (
    <div className="admin-placeholder-v2-page">
      <header className="admin-page-v2-header">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <span className="admin-planned-badge-v2">即将开放</span>
      </header>

      <section className="admin-card-v2 admin-placeholder-v2" aria-labelledby="feature-plan-title">
        <span className="admin-placeholder-icon-v2" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 4h14v16H5V4Zm4 5h6M9 13h6" /></svg>
        </span>
        <h2 id="feature-plan-title">功能规划</h2>
        <p>{nextStep}</p>
      </section>
    </div>
  );
}
