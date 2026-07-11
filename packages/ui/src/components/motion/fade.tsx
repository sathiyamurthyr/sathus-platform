'use client';

import * as React from 'react';
import { motion, type Transition } from 'motion/react';
import { cn } from '../../lib/cn';

interface FadeProps extends React.HTMLAttributes<HTMLDivElement> {
  show?: boolean;
  duration?: number;
  delay?: number;
}

const Fade = React.forwardRef<HTMLDivElement, FadeProps>(
  ({ className, show = true, duration = 0.3, delay = 0, children }, ref) => {
    const transition: Transition = { duration, delay };

    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }
);
Fade.displayName = 'Fade';

export { Fade };
