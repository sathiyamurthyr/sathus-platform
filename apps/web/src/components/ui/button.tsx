import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[#94003A] text-white shadow-md hover:bg-[#B5004A] hover:shadow-[0_10px_30px_rgba(148,0,58,0.45)]',
        destructive:
          'bg-[#D64545] text-white shadow-sm hover:bg-[#D64545]/90',
        outline:
          'border border-[#E7B631] bg-transparent text-[#E7B631] shadow-sm hover:bg-[#94003A] hover:text-white hover:border-[#94003A]',
        secondary:
          'bg-[#1A1418] border border-[#40202C] text-white shadow-sm hover:border-[#E7B631] hover:text-[#E7B631]',
        ghost: 'hover:bg-[#1A1418] hover:text-[#E7B631]',
        link: 'text-[#E7B631] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
