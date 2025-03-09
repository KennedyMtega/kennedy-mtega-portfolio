
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  animated?: boolean;
  onComplete?: () => void;
  delay?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  animated = true,
  onComplete,
  delay = 0,
}) => {
  const [displayText, setDisplayText] = useState(animated ? '' : text);

  useEffect(() => {
    if (!animated) {
      setDisplayText(text);
      return;
    }

    let currentIndex = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          if (onComplete) onComplete();
        }
      }, 30);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, animated, onComplete, delay]);

  return (
    <span className={cn('inline-block', className)}>
      {displayText}
      {animated && displayText.length < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

export default AnimatedText;
