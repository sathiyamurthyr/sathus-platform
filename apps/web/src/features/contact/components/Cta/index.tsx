import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Cta() {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
      <h2 className="text-2xl font-semibold mb-4">Ready to get started?</h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Book a strategy session with our team to discuss your enterprise software needs.
      </p>
      <Button asChild>
        <Link href="/book-strategy-session">
          Book a Strategy Session
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </Button>
    </div>
  );
}