import { Mail, Phone, MessageCircle } from 'lucide-react';
import { companyConfig } from '@/config/company';

export function ContactMethods() {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Contact Methods
      </h3>
      <div className="space-y-3">
        <a
          href={`mailto:${companyConfig.email}`}
          className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
        >
          <Mail className="h-4 w-4 text-primary" />
          {companyConfig.email}
        </a>
        <a
          href={`tel:${companyConfig.phoneRaw}`}
          className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
        >
          <Phone className="h-4 w-4 text-primary" />
          {companyConfig.phone}
        </a>
        <a
          href="/book-strategy-session"
          className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
        >
          <MessageCircle className="h-4 w-4 text-primary" />
          Book a strategy session
        </a>
      </div>
    </div>
  );
}