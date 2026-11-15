export interface SiteConfig {
  name: string;
  url: string;
  description: string;
  links: {
    github: string;
    twitter: string;
    linkedin: string;
  };
}

export interface NavItem {
  label: string;
  href: string;
  hasMega: boolean;
}

export interface MegaMenuSection {
  title: string;
  description: string;
  columns: MegaMenuColumn[];
  featured?: MegaMenuFeatured;
}

export interface MegaMenuColumn {
  title: string;
  icon: string;
  description: string;
  items: MegaMenuItem[];
  featured?: MegaMenuFeatured;
}

export interface MegaMenuItem {
  title: string;
  description: string;
  href: string;
  icon: string;
  badge?: string;
}

export interface MegaMenuFeatured {
  title: string;
  description: string;
  href: string;
  tag: string;
}

export interface FooterSection {
  title: string;
  links: { title: string; href: string }[];
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
  icon: string;
  shortcut: string[];
  action: () => void;
}
