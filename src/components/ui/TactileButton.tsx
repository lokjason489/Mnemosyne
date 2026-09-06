import { type HTMLMotionProps, motion } from 'motion/react';
import type React from 'react';
import { cn } from '../../utils/cn';

interface TactileButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const TactileButton: React.FC<TactileButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.6),0_8px_24px_-4px_rgba(99,102,241,0.5)] hover:shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.7),0_12px_28px_-4px_rgba(99,102,241,0.6)] hover:brightness-105 border border-white/30 font-bold',
    secondary: 'liquid-glass-pill text-slate-950 dark:text-white hover:brightness-105 font-bold',
    outline:
      'liquid-glass-subtle text-slate-900 dark:text-slate-100 hover:brightness-105 font-bold',
    danger:
      'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.5),0_8px_20px_rgba(225,29,72,0.4)] border border-white/20 font-bold',
    success:
      'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.5),0_8px_20px_rgba(16,185,129,0.4)] border border-white/20 font-bold',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-2xl gap-2',
    lg: 'px-7 py-3.5 text-sm md:text-base rounded-2xl gap-2.5',
  };

  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.1 }}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center font-sans select-none cursor-pointer',
        'transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        'focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:outline-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default TactileButton;
