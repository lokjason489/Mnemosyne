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
      'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 border-transparent font-bold',
    secondary:
      'bg-slate-100 hover:bg-slate-200/90 text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700 shadow-sm font-semibold',
    outline:
      'bg-white dark:bg-transparent border-2 border-indigo-600 dark:border-indigo-400 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 font-bold shadow-sm',
    danger:
      'bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-lg shadow-rose-600/25 border-transparent font-bold',
    success:
      'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-600/25 border-transparent font-bold',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-2xl gap-2',
    lg: 'px-7 py-3.5 text-base rounded-2xl gap-2.5',
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
        'focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none',
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
