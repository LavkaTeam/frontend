import { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  formatter: (value: number) => string;
  durationMs?: number;
  className?: string;
  precision?: 'exact' | 'tenth' | 'integer';
}

const getRoundedValue = (
  value: number,
  precision: NonNullable<AnimatedNumberProps['precision']>,
) => {
  if (precision === 'integer') {
    return Math.round(value);
  }

  if (precision === 'tenth') {
    return Math.round(value * 10) / 10;
  }

  return value;
};

const AnimatedNumber = ({
  value,
  formatter,
  durationMs = 900,
  className,
  precision = 'exact',
}: AnimatedNumberProps) => {
  const frameRef = useRef<number | null>(null);
  const previousValueRef = useRef(0);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const startValue = previousValueRef.current;
    const delta = value - startValue;
    const startTime = performance.now();

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    const tick = (timestamp: number) => {
      const progress = Math.min((timestamp - startTime) / durationMs, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + delta * easedProgress;

      setDisplayValue(
        progress < 1 ? getRoundedValue(nextValue, precision) : value,
      );

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        previousValueRef.current = value;
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [durationMs, precision, value]);

  return <span className={className}>{formatter(displayValue)}</span>;
};

export { AnimatedNumber };
