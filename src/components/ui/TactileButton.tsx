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
      'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 border-transparent',
    secondary:
      'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700',
    outline:
      'bg-transparent border-2 border-indigo-500/30 dark:border-indigo-400/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30',
    danger:
      'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/25 border-transparent',
    success:
      'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 border-transparent',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-semibold rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-sm font-semibold rounded-2xl gap-2',
    lg: 'px-7 py-3.5 text-base font-bold rounded-2xl gap-2.5',
  };

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center border font-sans select-none cursor-pointer',
        'transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
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
