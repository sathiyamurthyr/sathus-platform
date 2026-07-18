import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Cta() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="rounded-lg border border-border bg-muted/30 p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Contact our team to discuss how Memomes Cloud can secure your file sharing.
          </p>
          <Button asChild>
            <Link href="/contact">
              Contact Sales
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}