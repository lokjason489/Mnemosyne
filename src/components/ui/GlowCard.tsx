import { motion } from 'motion/react';
import type React from 'react';
import { cn } from '../../utils/cn';

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const GlowCard: React.FC<GlowCardProps> = ({ children, className, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={cn(
        'relative rounded-3xl p-6 md:p-8 transition-all duration-300',
        'liquid-glass-card',
        'text-slate-950 dark:text-white',
        className
      )}
      {...(props as any)}
    >
      {/* Specular fluid light reflections */}
      <div className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden">
        {/* Soft curved reflection sheen */}
        <div className="absolute -top-[50%] -left-[15%] w-[130%] h-[90%] rounded-full bg-gradient-to-b from-white/35 via-white/5 to-transparent dark:from-white/10 pointer-events-none" />
        {/* Top edge crisp specular light rim */}
        <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 dark:via-white/40 to-transparent" />
      </div>

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlowCard;
