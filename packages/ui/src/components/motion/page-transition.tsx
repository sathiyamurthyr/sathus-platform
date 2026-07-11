'use client';

import * as React from 'react';
import { AnimatePresence, motion, type Transition } from 'motion/react';
import { cn } from '../../lib/cn';

interface PageTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  transition?: 'fade' | 'slide' | 'scale' | 'none';
  duration?: number;
  delay?: number;
  children: React.ReactNode;
}

const PageTransition = React.forwardRef<HTMLDivElement, PageTransitionProps>(
  ({ className, transition: transitionType = 'fade', duration = 0.3, delay = 0, children, ...props }, ref) => {
    const transition: Transition = { duration, delay };

    const variants = {
      fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      },
      slide: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      },
      scale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
      },
      none: {
        initial: {},
        animate: {},
        exit: {},
      },
    };

    if (transitionType === 'none') {
      return (
        <div ref={ref} className={cn(className)} {...props}>
          {children}
        </div>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          ref={ref}
          className={cn(className)}
          initial={variants[transitionType].initial}
          animate={variants[transitionType].animate}
          exit={variants[transitionType].exit}
          transition={transition}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }
);
PageTransition.displayName = 'PageTransition';

export { PageTransition };
