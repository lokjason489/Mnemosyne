import { motion } from 'motion/react';
import type React from 'react';
import { cn } from '../../utils/cn';

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className,
  glowColor = 'rgba(99, 102, 241, 0.15)',
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative rounded-3xl border border-slate-300 dark:border-slate-800/80',
        'bg-white dark:bg-slate-900/90 backdrop-blur-xl shadow-xl shadow-slate-200/60 dark:shadow-indigo-500/5',
        'transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10',
        'overflow-hidden',
        className
      )}
      style={{
        boxShadow: `0 10px 30px -10px ${glowColor}, 0 0 0 1px rgba(0, 0, 0, 0.04)`,
      }}
      {...(props as any)}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlowCard;
