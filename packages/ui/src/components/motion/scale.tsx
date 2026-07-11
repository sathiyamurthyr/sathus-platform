'use client';

import * as React from 'react';
import { motion, type Transition } from 'motion/react';
import { cn } from '../../lib/cn';

interface ScaleProps extends React.HTMLAttributes<HTMLDivElement> {
  show?: boolean;
  from?: number;
  to?: number;
  duration?: number;
  delay?: number;
}

const Scale = React.forwardRef<HTMLDivElement, ScaleProps>(
  ({ className, show = true, from = 0.95, to = 1, duration = 0.2, delay = 0, children }, ref) => {
    const transition: Transition = { duration, delay };

    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        initial={{ opacity: 0, scale: from }}
        animate={{ opacity: show ? 1 : 0, scale: show ? to : from }}
        exit={{ opacity: 0, scale: from }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }
);
Scale.displayName = 'Scale';

export { Scale };
