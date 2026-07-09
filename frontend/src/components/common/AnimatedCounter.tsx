import { useState, useEffect } from 'react';

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

export function AnimatedCounter({ value, duration = 1.2 }: AnimatedCounterProps) {
  // Extract number and any non-numeric suffixes (like %, hrs, +, etc.)
  const cleanString = value.replace(/,/g, '');
  const numericMatch = cleanString.match(/[0-9.]+/);
  const numericPart = numericMatch ? parseFloat(numericMatch[0]) : NaN;
  const suffix = cleanString.replace(/[0-9.]/g, '');

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isNaN(numericPart)) {
      return;
    }
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const currentVal = startValue + easeOutQuad * (numericPart - startValue);
      
      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(numericPart); // ensure exact final value
      }
    };

    requestAnimationFrame(animate);
  }, [numericPart, duration]);

  if (isNaN(numericPart)) {
    return <span>{value}</span>;
  }

  // Format count back with thousands separator if needed
  const isFloat = numericPart % 1 !== 0;
  const formattedCount = isFloat 
    ? count.toFixed(1)
    : Math.floor(count).toLocaleString();

  return (
    <span>
      {formattedCount}
      {suffix}
    </span>
  );
}
