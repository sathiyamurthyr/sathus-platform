import * as React from 'react';
import { cn } from '../../lib/cn';

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'vertical' | 'horizontal';
  gap?: 'default' | 'sm' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
}

const gapClasses = {
  sm: 'gap-2',
  default: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

const alignClasses: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyClasses: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, direction = 'vertical', gap = 'default', align, justify, wrap = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          direction === 'vertical' ? 'flex-col' : 'flex-row',
          gapClasses[gap],
          align && alignClasses[align],
          justify && justifyClasses[justify],
          wrap && 'flex-wrap',
          className
        )}
        {...props}
      />
    );
  }
);
Stack.displayName = 'Stack';

export { Stack };
