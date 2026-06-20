type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  illustration?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  illustration,
  action,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={`app-page-header px-4 sm:px-5 pt-8 pb-6 ${className}`}
      style={{ paddingTop: "calc(2rem + var(--app-safe-top))" }}
    >
      {eyebrow ? <p className="app-eyebrow mb-2">{eyebrow}</p> : null}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {illustration}
          <div className="min-w-0">
            <h1 className="app-page-title">{title}</h1>
            {subtitle ? (
              <p className="text-sm text-[var(--app-muted)] mt-1">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {action}
      </div>
    </div>
  );
}
