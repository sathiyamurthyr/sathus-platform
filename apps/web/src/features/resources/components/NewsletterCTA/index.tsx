import { Button } from '@/components/ui/button';

export function NewsletterCTA() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="rounded-lg border border-border bg-muted/30 p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get the latest resources, tutorials, and insights delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
}