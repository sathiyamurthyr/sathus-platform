const TECHNOLOGIES = [
  'Azure',
  'AWS',
  'Databricks',
  'Snowflake',
  'OpenAI',
  '.NET',
  'Python',
  'React',
];

const METRICS = [
  { value: '12+', label: 'Years in market' },
  { value: '50+', label: 'Enterprise projects' },
  { value: '99.95%', label: 'Availability target' },
  { value: '24×7', label: 'Support coverage' },
];

export function TrustMetricsStrip() {
  const techRow = [...TECHNOLOGIES];

  return (
    <section className="border-y border-border bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8 py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="flex-1">
            <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground lg:text-left">
              Trusted technologies we design, build and operate on
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:justify-start">
              {techRow.map((tech) => (
                <span
                  key={tech}
                  className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-muted-foreground/80"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-t border-border pt-8 lg:grid-cols-4 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0">
            {METRICS.map((metric) => (
              <div key={metric.label}>
                <div className="font-display text-2xl text-foreground sm:text-3xl">
                  {metric.value}
                </div>
                <div className="mt-1 text-xs leading-snug text-muted-foreground">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
