import { Palette, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';

export interface GlowColorPreset {
  id: string;
  nameKey: string;
  hex: string;
  lightGradient: string;
  darkGradient: string;
}

export const GLOW_PRESETS: GlowColorPreset[] = [
  {
    id: 'indigo',
    nameKey: 'color_indigo',
    hex: '#6366f1',
    lightGradient:
      'radial-gradient(circle at center, rgba(99,102,241,0.55) 0%, rgba(139,92,246,0.32) 32%, rgba(56,189,248,0.15) 60%, transparent 75%)',
    darkGradient:
      'radial-gradient(circle at center, rgba(99,102,241,0.45) 0%, rgba(168,85,247,0.28) 35%, rgba(6,182,212,0.15) 65%, transparent 75%)',
  },
  {
    id: 'cyan',
    nameKey: 'color_cyan',
    hex: '#06b6d4',
    lightGradient:
      'radial-gradient(circle at center, rgba(6,182,212,0.55) 0%, rgba(59,130,246,0.32) 35%, rgba(99,102,241,0.15) 65%, transparent 75%)',
    darkGradient:
      'radial-gradient(circle at center, rgba(6,182,212,0.45) 0%, rgba(37,99,235,0.28) 35%, rgba(79,70,229,0.15) 65%, transparent 75%)',
  },
  {
    id: 'emerald',
    nameKey: 'color_emerald',
    hex: '#10b981',
    lightGradient:
      'radial-gradient(circle at center, rgba(16,185,129,0.55) 0%, rgba(20,184,166,0.32) 35%, rgba(56,189,248,0.15) 65%, transparent 75%)',
    darkGradient:
      'radial-gradient(circle at center, rgba(16,185,129,0.45) 0%, rgba(13,148,136,0.28) 35%, rgba(14,165,233,0.15) 65%, transparent 75%)',
  },
  {
    id: 'amber',
    nameKey: 'color_amber',
    hex: '#f59e0b',
    lightGradient:
      'radial-gradient(circle at center, rgba(245,158,11,0.55) 0%, rgba(249,115,22,0.32) 35%, rgba(236,72,153,0.15) 65%, transparent 75%)',
    darkGradient:
      'radial-gradient(circle at center, rgba(245,158,11,0.45) 0%, rgba(234,88,12,0.28) 35%, rgba(244,63,94,0.15) 65%, transparent 75%)',
  },
  {
    id: 'rose',
    nameKey: 'color_rose',
    hex: '#f43f5e',
    lightGradient:
      'radial-gradient(circle at center, rgba(244,63,94,0.55) 0%, rgba(217,70,239,0.32) 35%, rgba(168,85,247,0.15) 65%, transparent 75%)',
    darkGradient:
      'radial-gradient(circle at center, rgba(244,63,94,0.45) 0%, rgba(192,38,211,0.28) 35%, rgba(139,92,246,0.15) 65%, transparent 75%)',
  },
];

interface FloatingAmbientControlProps {
  enabled: boolean;
  onToggle: () => void;
  selectedColorId: string;
  onSelectColor: (id: string) => void;
}

export const FloatingAmbientControl: React.FC<FloatingAmbientControlProps> = ({
  enabled,
  onToggle,
  selectedColorId,
  onSelectColor,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activePreset = GLOW_PRESETS.find((p) => p.id === selectedColorId) || GLOW_PRESETS[0];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40" ref={containerRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="!absolute bottom-16 right-0 w-72 p-4 rounded-3xl liquid-glass-dropdown shadow-2xl space-y-4"
          >
            {/* Header with Title and Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{ backgroundColor: activePreset.hex }}
                />
                <span className="text-sm font-black text-slate-950 dark:text-white">
                  {t('ambient_glow')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Switch */}
                <button
                  type="button"
                  onClick={onToggle}
                  aria-label={t('ambient_glow_toggle')}
                  className={cn(
                    'w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer outline-none',
                    enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  )}
                >
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 600, damping: 30 }}
                    className={cn(
                      'w-5 h-5 rounded-full bg-white shadow-md',
                      enabled ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Color Selection Palette */}
            {enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 pt-1 border-t border-black/5 dark:border-white/10"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{t('ambient_color')}</span>
                  <span className="text-[11px] font-medium opacity-80">
                    {t(activePreset.nameKey)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-1.5 pt-1">
                  {GLOW_PRESETS.map((preset) => {
                    const isSelected = preset.id === selectedColorId;
                    return (
                      <button
                        type="button"
                        key={preset.id}
                        onClick={() => onSelectColor(preset.id)}
                        className={cn(
                          'relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer group',
                          isSelected
                            ? 'scale-110 ring-2 ring-indigo-500/80 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-md'
                            : 'hover:scale-105 opacity-80 hover:opacity-100'
                        )}
                        style={{ backgroundColor: preset.hex }}
                        title={t(preset.nameKey)}
                      >
                        {/* Inner specular gloss */}
                        <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.7)] pointer-events-none" />
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer shadow-xl transition-all relative overflow-hidden',
          'liquid-glass-card text-slate-950 dark:text-white',
          isOpen && 'ring-2 ring-indigo-500/60 shadow-indigo-500/20'
        )}
        aria-label={t('ambient_glow')}
        title={t('ambient_glow')}
      >
        {/* Subtle glowing halo matching the active color */}
        <div
          className="absolute inset-0 opacity-20 dark:opacity-30 rounded-[inherit] pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${activePreset.hex} 0%, transparent 70%)`,
          }}
        />
        {enabled ? (
          <Sparkles
            className="w-5 h-5 transition-colors relative z-10"
            style={{ color: activePreset.hex }}
          />
        ) : (
          <Palette className="w-5 h-5 text-slate-400 dark:text-slate-500 relative z-10" />
        )}
      </motion.button>
    </div>
  );
};
