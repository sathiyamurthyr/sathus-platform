'use client';

import * as React from 'react';
import { motion, type Transition } from 'motion/react';
import { cn } from '../../lib/cn';

interface SlideProps extends React.HTMLAttributes<HTMLDivElement> {
  show?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  delay?: number;
}

const Slide = React.forwardRef<HTMLDivElement, SlideProps>(
  ({ className, show = true, direction = 'up', distance = 20, duration = 0.3, delay = 0, children }, ref) => {
    const transition: Transition = { duration, delay };
    const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
    const initialOffset = distance;

    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        initial={{ opacity: 0, [axis]: initialOffset }}
        animate={{ opacity: show ? 1 : 0, [axis]: show ? 0 : initialOffset }}
        exit={{ opacity: 0, [axis]: initialOffset }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }
);
Slide.displayName = 'Slide';

export { Slide };
