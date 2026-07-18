import Link from 'next/link';
import { footerNavigation } from '../../config/navigation.config';

export function FooterNavigation() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {footerNavigation.map((section) => (
            <div key={section.id}>
              <h3 className="font-semibold mb-4">{section.label}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.id}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Sathus Technology. All rights reserved.
        </div>
      </div>
    </footer>
  );
}