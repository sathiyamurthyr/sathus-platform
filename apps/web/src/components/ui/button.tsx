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
          'bg-[#A20A3A] text-white shadow-sm hover:bg-[#8C0832]',
        destructive:
          'bg-[#D64545] text-white shadow-sm hover:bg-[#D64545]/90',
        outline:
          'border border-[#E8E2E5] bg-white text-[#292329] shadow-xs hover:border-[#A20A3A] hover:text-[#A20A3A] hover:bg-[#FAF8F9]',
        secondary:
          'bg-[#FAF8F9] border border-[#E8E2E5] text-[#292329] shadow-xs hover:border-[#A20A3A] hover:text-[#A20A3A]',
        ghost: 'text-[#625B60] hover:bg-[#FAF8F9] hover:text-[#A20A3A]',
        link: 'text-[#A20A3A] underline-offset-4 hover:underline',
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
