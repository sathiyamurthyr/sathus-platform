import * as React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/cn';

const alertIcons = {
  default: Info,
  destructive: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle2,
  info: Info,
};

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'warning' | 'success' | 'info';
  title?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', title, icon, action, children, ...props }, ref) => {
    const Icon = icon ? null : alertIcons[variant];
    
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'relative flex items-start gap-3 rounded-lg border p-4',
          variant === 'default' && 'border-border bg-background text-foreground',
          variant === 'destructive' && 'border-destructive/50 bg-destructive/10 text-destructive-foreground',
          variant === 'warning' && 'border-warning/50 bg-warning/10 text-foreground',
          variant === 'success' && 'border-success/50 bg-success/10 text-success-foreground',
          variant === 'info' && 'border-info/50 bg-info/10 text-foreground',
          className
        )}
        {...props}
      >
        {(icon || Icon) && (
          <span className="mt-0.5 shrink-0">
            {icon || (Icon && <Icon className="h-4 w-4" />)}
          </span>
        )}
        <div className="flex-1">
          {title && <h5 className="mb-1 text-sm font-semibold">{title}</h5>}
          <div className="text-sm opacity-90">{children}</div>
        </div>
        {action && <div className="ml-auto shrink-0">{action}</div>}
      </div>
    );
  }
);
Alert.displayName = 'Alert';

export { Alert };
