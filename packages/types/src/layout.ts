export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'wide' | 'narrow' | 'full';
  padding?: 'default' | 'none' | 'sm' | 'lg';
  center?: boolean;
}

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'default' | 'sm' | 'lg' | 'xl';
  colsMd?: number;
  colsLg?: number;
  colsXl?: number;
}

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'vertical' | 'horizontal';
  gap?: 'default' | 'sm' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
}

export interface ColumnsProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number;
  span?: number;
  offset?: number;
  order?: number;
}

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  badge?: string;
  actions?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  size?: 'default' | 'lg' | 'xl';
}

export interface FeatureGridProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  badge?: string;
  items: React.ReactNode[];
  columns?: 2 | 3 | 4;
}

export interface ContentGridProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  items: React.ReactNode[];
  columns?: 1 | 2 | 3;
}

export interface PricingGridProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  items: React.ReactNode[];
  columns?: 1 | 2 | 3 | 4;
}

export interface DashboardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
  sidebarWidth?: 'default' | 'narrow' | 'wide';
}
