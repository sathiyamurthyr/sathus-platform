export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    label: string;
    href?: string;
    active?: boolean;
  }[];
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    id: string;
    label: string;
    content: React.ReactNode;
    disabled?: boolean;
  }[];
  defaultValue?: string;
  onValueChange?: (id: string) => void;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    id: string;
    title: string;
    content: React.ReactNode;
    disabled?: boolean;
  }[];
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    id: string;
    title: string;
    description?: string;
    date?: string;
    icon?: React.ReactNode;
    status?: 'completed' | 'active' | 'pending';
  }[];
}
