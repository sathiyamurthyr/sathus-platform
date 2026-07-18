import { Mail, Phone, MessageCircle } from 'lucide-react';

export function ContactMethods() {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Contact Methods
      </h3>
      <div className="space-y-3">
        <a
          href="mailto:hello@sathus.in"
          className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
        >
          <Mail className="h-4 w-4" />
          hello@sathus.in
        </a>
        <a
          href="tel:+1-415-555-0123"
          className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
        >
          <Phone className="h-4 w-4" />
          +1 (415) 555-0123
        </a>
        <a
          href="https://calendly.com/sathus/strategy-session"
          className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="h-4 w-4" />
          Book a strategy session
        </a>
      </div>
    </div>
  );
}