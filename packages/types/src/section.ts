export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  badge?: string;
  align?: 'left' | 'center' | 'right';
}

export interface SectionContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div';
  size?: 'default' | 'wide' | 'narrow';
  padding?: 'default' | 'none' | 'sm' | 'lg';
}

export interface SectionDividerProps extends React.HTMLAttributes<HTMLHRElement> {
  variant?: 'default' | 'subtle' | 'gradient';
}

export interface SectionBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'subtle';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}
