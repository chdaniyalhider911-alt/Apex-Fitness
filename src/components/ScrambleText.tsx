import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ScrambleTextProps {
  text: string;
  className?: string;
  scrambleOnMount?: boolean;
  mountDelay?: number;
}

export default function ScrambleText({ text, className = '', scrambleOnMount = true, mountDelay = 300 }: ScrambleTextProps) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startScramble = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let iteration = 0;
    intervalRef.current = setInterval(() => {
      const newText = text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      setDisplayText(newText);
      iteration += 0.5;
      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 30);
  }, [text]);

  useEffect(() => {
    if (scrambleOnMount) {
      const timer = setTimeout(() => {
        startScramble();
      }, mountDelay);
      return () => clearTimeout(timer);
    }
  }, [scrambleOnMount, mountDelay, startScramble]);

  return (
    <motion.span
      className={`whitespace-pre-wrap ${className}`}
      onMouseEnter={startScramble}
      onTouchStart={startScramble}
      whileTap={{ scale: 0.95 }}
    >
      {displayText}
    </motion.span>
  );
}
