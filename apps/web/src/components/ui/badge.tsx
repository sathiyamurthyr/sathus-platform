import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border border-[rgba(231,182,49,0.20)] bg-[rgba(148,0,58,0.15)] text-[#E7B631]',
        secondary: 'border border-[#40202C] bg-[#1A1418] text-[#B7B7B7]',
        destructive: 'bg-[#D64545] text-white',
        outline: 'border border-[rgba(231,182,49,0.30)] bg-transparent text-[#E7B631]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };