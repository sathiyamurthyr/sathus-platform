'use client';

import * as React from 'react';
import { useInView, animate } from 'motion/react';

interface CountUpProps {
  value: string; // e.g. "99.95%", "6", "ISO 27001"
  className?: string;
}

export function CountUp({ value, className }: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = React.useState(value);

  React.useEffect(() => {
    if (!isInView) return;

    // Extract numeric part if present
    const numericMatch = value.match(/([0-9.]+)/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const numericVal = parseFloat(numericMatch[0]);
    const isDecimal = numericMatch[0].includes('.');
    const prefix = value.substring(0, numericMatch.index);
    const suffix = value.substring((numericMatch.index || 0) + numericMatch[0].length);

    const controls = animate(0, numericVal, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (latest) => {
        const formatted = isDecimal ? latest.toFixed(2) : Math.floor(latest).toString();
        setDisplayValue(`${prefix}${formatted}${suffix}`);
      },
    });

    return () => controls.stop();
  }, [isInView, value]);

  return <span ref={ref} className={className}>{displayValue}</span>;
}
