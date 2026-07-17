'use client';

import * as React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { cn } from '@/lib/utils';

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  y?: number;
  as?: 'div' | 'section' | 'li' | 'article' | 'span';
  once?: boolean;
}

/**
 * Scroll-triggered reveal. Respects prefers-reduced-motion by rendering the
 * content immediately without transform/opacity animation.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  as = 'div',
  once = true,
  ...props
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduce) {
    const Tag = as;
    return (
      <Tag className={className} {...(props as React.HTMLAttributes<HTMLElement>)}>
        {children}
      </Tag>
    );
  }

  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <MotionTag
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-80px' }}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </MotionTag>
  );
}
