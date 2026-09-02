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
        'relative flex items-center p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80',
        'border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-md overflow-x-auto no-scrollbar',
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
              'relative z-10 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl',
              'transition-colors duration-200 select-none whitespace-nowrap outline-none cursor-pointer',
              isActive
                ? 'text-indigo-600 dark:text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            )}
          >
            {tab.icon && <span className="text-base">{tab.icon}</span>}
            <span>{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="active-pill"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="absolute inset-0 z-[-1] rounded-xl bg-white dark:bg-indigo-600/90 shadow-md shadow-slate-900/5 dark:shadow-indigo-500/20"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default AnimatedTabs;
