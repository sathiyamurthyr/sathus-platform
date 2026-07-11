export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';
  size?: 'default' | 'sm' | 'lg';
}

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'warning' | 'success' | 'info';
  title?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'default' | 'sm' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'spinner' | 'dots' | 'skeleton';
  size?: 'default' | 'sm' | 'lg';
  text?: string;
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}
