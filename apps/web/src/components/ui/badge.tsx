import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border border-[#EDE1E6] bg-[#F9EEF2] text-[#A20A3A]',
        secondary: 'border border-[#EDE1E6] bg-[#FAF8F9] text-[#635861]',
        destructive: 'bg-[#D64545] text-white',
        outline: 'border border-[#EDE1E6] bg-white text-[#292329]',
        orange: 'border border-[#FFD9B3] bg-[#FFF4E8] text-[#C25E00]',
        gold: 'border border-[#EDC11E]/30 bg-[#EDC11E]/10 text-[#292329]',
        burgundy: 'border border-[#EDE1E6] bg-[#F9EEF2] text-[#A20A3A]',
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