import { Shield } from 'lucide-react';

export function TrustHero() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-6">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Trust Center
          </h1>
          <p className="text-lg text-muted-foreground">
            Our commitment to security, privacy, and compliance for enterprise customers.
          </p>
        </div>
      </div>
    </div>
  );
}