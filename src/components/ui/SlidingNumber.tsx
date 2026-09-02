import { motion } from 'motion/react';
import type React from 'react';

interface SlidingNumberProps {
  value: number | string;
  className?: string;
  padZero?: number;
}

export const SlidingNumber: React.FC<SlidingNumberProps> = ({
  value,
  className = '',
  padZero = 0,
}) => {
  const strVal =
    typeof value === 'number' && padZero > 0 ? String(value).padStart(padZero, '0') : String(value);

  return (
    <div
      className={`inline-flex items-center overflow-hidden font-mono tracking-wider ${className}`}
    >
      {strVal.split('').map((char, i) => {
        if (Number.isNaN(Number(char)) || char === ' ') {
          return (
            <span key={i} className="inline-block">
              {char}
            </span>
          );
        }

        const digit = parseInt(char, 10);

        return (
          <div
            key={i}
            className="relative h-[1.2em] w-[0.65em] overflow-hidden inline-block text-center"
          >
            <motion.div
              animate={{ y: `-${digit * 10}%` }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className="absolute left-0 top-0 flex flex-col items-center w-full"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <span
                  key={n}
                  className="h-[1.2em] leading-[1.2em] flex items-center justify-center"
                >
                  {n}
                </span>
              ))}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

export default SlidingNumber;
