import * as React from 'react';
import { cn } from '../../lib/cn';

interface StatisticCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

const StatisticCard = React.forwardRef<HTMLDivElement, StatisticCardProps>(
  ({ className, label, value, change, changeType = 'neutral', icon, ...props }, ref) => {
    const changeColor = {
      positive: 'text-success',
      negative: 'text-destructive',
      neutral: 'text-muted-foreground',
    }[changeType];

    return (
      <div
        ref={ref}
        className={cn('rounded-lg border bg-card p-6 shadow-sm', className)}
        {...props}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {icon && (
            <div className="text-muted-foreground">{icon}</div>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-3xl font-bold text-card-foreground">{value}</p>
          {change && (
            <span className={cn('text-sm font-medium', changeColor)}>
              {change}
            </span>
          )}
        </div>
      </div>
    );
  }
);
StatisticCard.displayName = 'StatisticCard';

export { StatisticCard };
