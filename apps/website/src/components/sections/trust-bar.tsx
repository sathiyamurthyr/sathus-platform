const TECHNOLOGIES = [
  'Azure',
  'AWS',
  'Databricks',
  'Snowflake',
  'Microsoft',
  'OpenAI',
  'PostgreSQL',
  '.NET',
  'Python',
  'React',
];

export function TrustBar() {
  const row = [...TECHNOLOGIES, ...TECHNOLOGIES];

  return (
    <section
      aria-label="Technologies we engineer with"
      className="border-y border-border bg-muted/30 py-10"
    >
      <div className="container mx-auto px-4">
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Trusted technologies we design, build and operate on
        </p>
      </div>
      <div className="group relative overflow-hidden marquee-mask">
        <div className="marquee-track flex w-max items-center gap-12 px-6">
          {row.map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="flex items-center gap-3 whitespace-nowrap text-lg font-medium text-muted-foreground/80"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
