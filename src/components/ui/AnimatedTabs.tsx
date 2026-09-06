import { motion } from 'motion/react';
import type React from 'react';
import { cn } from '../../utils/cn';

export interface TabItem {
  id: number;
  label: string;
  icon?: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  activeTab: number;
  onChange: (id: number) => void;
  className?: string;
}

export const AnimatedTabs: React.FC<AnimatedTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative flex items-center p-1 rounded-2xl liquid-glass-border-only overflow-x-auto no-scrollbar',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative z-10 flex items-center justify-center gap-1.5 px-4 py-2 text-xs md:text-sm rounded-xl',
              'transition-colors duration-150 select-none whitespace-nowrap outline-none cursor-pointer font-bold',
              'focus-visible:ring-2 focus-visible:ring-indigo-500',
              isActive
                ? 'text-indigo-700 dark:text-white font-black'
                : 'text-slate-800 dark:text-slate-300 font-bold hover:text-slate-950 dark:hover:text-white'
            )}
          >
            {tab.icon && <span className="text-sm">{tab.icon}</span>}
            <span>{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="active-pill"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                className="absolute inset-0 z-[-1] rounded-xl bg-white dark:bg-white/20 shadow-sm border border-black/5 dark:border-white/20"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default AnimatedTabs;
