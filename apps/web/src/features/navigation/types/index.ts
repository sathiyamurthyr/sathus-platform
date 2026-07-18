// Navigation Platform Types

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  description?: string;
  badge?: string;
  children?: NavigationItem[];
}

export interface NavigationSection {
  id: string;
  label: string;
  items: NavigationItem[];
}

export interface FooterSection {
  id: string;
  label: string;
  links: NavigationItem[];
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}