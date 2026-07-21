export interface SiteConfig {
  name: string;
  url: string;
  description: string;
  links: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface NavItem {
  label: string;
  href: string;
  hasMega?: boolean;
  children?: NavItem[];
}

export interface MegaMenuColumn {
  title: string;
  icon?: string;
  description?: string;
  items: {
    title: string;
    description?: string;
    href: string;
    icon?: string;
    badge?: string;
  }[];
  featured?: {
    title: string;
    description: string;
    href: string;
    tag?: string;
  };
  recentUpdates?: {
    title: string;
    date: string;
    href: string;
  }[];
}

export interface MegaMenuSection {
  title: string;
  description?: string;
  columns: MegaMenuColumn[];
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

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  href: string;
}

export interface SearchResult {
  title: string;
  description: string;
  href: string;
  category: string;
}

export interface CommandAction {
  id: string;
  label: string;
  description: string;
  icon?: string;
  shortcut?: string[];
  action: () => void;
}
