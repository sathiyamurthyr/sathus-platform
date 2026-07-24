import { Shield } from 'lucide-react';

export function TrustHero() {
  return (
    <div className="pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Trust Center
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Our commitment to security, privacy, and compliance for enterprise customers.
          </p>
        </div>
      </div>
    </div>
  );
}