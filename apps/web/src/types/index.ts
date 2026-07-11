export interface SiteConfig {
  name: string;
  url: string;
  description: string;
  links: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface NavItem {
  label: string;
  href: string;
  hasMega?: boolean;
  children?: NavItem[];
}

export interface MegaMenuSection {
  title: string;
  description?: string;
  items: MegaMenuItem[];
}

export interface MegaMenuItem {
  title: string;
  description: string;
  href: string;
  icon?: string;
}

export interface FooterLink {
  title: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}
