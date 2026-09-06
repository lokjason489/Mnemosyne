import confetti from 'canvas-confetti';
import { Eye, Minus, Play, Plus, RotateCcw, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';
import { GlowCard } from './ui/GlowCard';
import { SlidingNumber } from './ui/SlidingNumber';
import { TactileButton } from './ui/TactileButton';

interface Props {
  onClose?: React.Dispatch<React.SetStateAction<number>>;
}

interface Ball {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
}

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const isColliding = (
  x: number,
  y: number,
  radius: number,
  balls: { x: number; y: number; radius: number }[]
) => {
  for (const b of balls) {
    const dist = Math.sqrt((x - b.x) ** 2 + (y - b.y) ** 2);
    if (dist < radius + b.radius + 12) {
      return true;
    }
  }
  return false;
};

export const BallTest: React.FC<Props> = () => {
  const { t } = useTranslation();

  // Settings: [minBalls, maxBalls]
  const [ballRange, setBallRange] = useState<[number, number]>([7, 13]);
  const [actualBallCount, setActualBallCount] = useState<number>(0);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [userInput, setUserInput] = useState<number>(8);

  // Phases: 'ready' | 'showing' | 'input' | 'result'
  const [phase, setPhase] = useState<'ready' | 'showing' | 'input' | 'result'>('ready');
  const [timerProgress, setTimerProgress] = useState(100);

  const startTest = useCallback(() => {
    const targetCount = getRandomInt(ballRange[0], ballRange[1]);
    setActualBallCount(targetCount);
    setUserInput(Math.round((ballRange[0] + ballRange[1]) / 2));

    const width = 500;
    const height = 300;
    const radius = 18;
    const generatedBalls: Ball[] = [];

    // High contrast crisp palette
    const palette = [
      '#3b82f6', // Vivid Blue
      '#10b981', // Vivid Emerald
      '#f59e0b', // Vivid Amber
      '#ef4444', // Vivid Red
      '#8b5cf6', // Vivid Purple
      '#06b6d4', // Vivid Cyan
      '#ec4899', // Vivid Pink
    ];

    for (let i = 0; i < targetCount; i++) {
      let x = getRandomInt(radius + 15, width - radius - 15);
      let y = getRandomInt(radius + 15, height - radius - 15);
      let attempts = 0;

      while (isColliding(x, y, radius, generatedBalls) && attempts < 150) {
        x = getRandomInt(radius + 15, width - radius - 15);
        y = getRandomInt(radius + 15, height - radius - 15);
        attempts++;
      }

      generatedBalls.push({
        id: i,
        x,
        y,
        radius,
        color: palette[i % palette.length],
      });
    }

    setBalls(generatedBalls);
    setPhase('showing');
    setTimerProgress(100);
  }, [ballRange]);

  // Handle countdown during SHOWING phase
  useEffect(() => {
    if (phase !== 'showing') return;

    const duration = 1000; // 1.0 second
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.max(0, 100 - (elapsed / duration) * 100);
      setTimerProgress(progress);

      if (elapsed >= duration) {
        clearInterval(timer);
        setPhase('input');
      }
    }, 25);

    return () => clearInterval(timer);
  }, [phase]);

  const handleSubmit = () => {
    if (userInput === actualBallCount) {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    setPhase('result');
  };

  const diff = Math.abs(userInput - actualBallCount);

  return (
    <div className="w-full max-w-xl mx-auto">
      <GlowCard className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          {/* 1. READY PHASE */}
          {phase === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.12 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.05)] border border-white/50 dark:border-white/10">
                <Eye className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                  {t('BallTest')}
                </h2>
                <p className="text-xs md:text-sm font-semibold text-slate-800 dark:text-neutral-300 max-w-md leading-relaxed">
                  {t('Ball_desc')}
                </p>
              </div>

              {/* Liquid Glass Range Selector */}
              <div className="w-full max-w-sm liquid-glass-subtle p-1.5 rounded-2xl flex justify-between gap-1">
                {[
                  { label: t('easy'), range: [5, 8] as [number, number] },
                  { label: t('medium'), range: [7, 13] as [number, number] },
                  { label: t('difficult'), range: [12, 20] as [number, number] },
                ].map((item, idx) => {
                  const isSelected =
                    ballRange[0] === item.range[0] && ballRange[1] === item.range[1];
                  return (
                    <button
                      key={idx}
                      onClick={() => setBallRange(item.range)}
                      className={cn(
                        'flex-1 py-2 text-xs rounded-xl transition-all duration-200 cursor-pointer',
                        isSelected
                          ? 'bg-linear-to-b from-white to-white/95 dark:from-white/20 dark:to-white/10 text-indigo-700 dark:text-white shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_8px_rgba(15,23,42,0.12)] border border-slate-200/80 dark:border-white/20 font-black'
                          : 'text-slate-800 dark:text-slate-300 font-bold hover:text-slate-950 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
                      )}
                    >
                      {item.label} ({item.range[0]}-{item.range[1]})
                    </button>
                  );
                })}
              </div>

              <TactileButton
                variant="primary"
                size="lg"
                onClick={startTest}
                className="w-full max-w-xs mt-1"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t('start')}</span>
              </TactileButton>
            </motion.div>
          )}

          {/* 2. SHOWING PHASE */}
          {phase === 'showing' && (
            <motion.div
              key="showing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex flex-col items-center justify-center text-center gap-4"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/90 dark:bg-indigo-500/20 px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-500/40">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('Ball_memorize')}</span>
              </div>

              {/* Liquid Glass Canvas */}
              <div className="relative rounded-3xl overflow-hidden liquid-glass-card w-full max-w-lg aspect-video flex items-center justify-center">
                {/* Specular top rim */}
                <div className="absolute inset-x-6 top-0 h-[1.5px] bg-linear-to-r from-transparent via-white/90 dark:via-white/40 to-transparent pointer-events-none" />
                <svg
                  viewBox="0 0 500 300"
                  role="img"
                  aria-label={t('BallTest')}
                  className="w-full h-full block select-none pointer-events-none relative z-10"
                >
                  <title>{t('BallTest')}</title>
                  {balls.map((b) => (
                    <circle
                      key={b.id}
                      cx={b.x}
                      cy={b.y}
                      r={b.radius}
                      fill={b.color}
                      stroke="rgba(255,255,255,0.8)"
                      strokeWidth="1.5"
                    />
                  ))}
                </svg>
              </div>

              {/* Liquid Progress Bar */}
              <div className="w-full max-w-xs bg-slate-200/50 dark:bg-slate-800/50 h-2 rounded-full overflow-hidden border border-white/50 dark:border-white/10 mt-2 shadow-inner">
                <motion.div
                  className="bg-indigo-500 h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                  style={{ width: `${timerProgress}%` }}
                />
              </div>
            </motion.div>
          )}

          {/* 3. INPUT PHASE */}
          {phase === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.12 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-950 dark:text-white">
                  {t('inputNum')}
                </h3>
                <p className="text-xs font-bold text-slate-800 dark:text-neutral-300">
                  {t('yser_Input_Ball')}
                </p>
              </div>

              {/* Glass Stepper */}
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => setUserInput((prev) => Math.max(0, prev - 1))}
                  className="w-14 h-14 rounded-2xl liquid-glass-pill text-slate-950 dark:text-white hover:brightness-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                >
                  <Minus className="w-6 h-6" />
                </button>

                <div className="flex items-center justify-center w-36 h-20 rounded-3xl liquid-glass-pill text-5xl font-black text-slate-950 dark:text-white">
                  <SlidingNumber value={userInput} />
                </div>

                <button
                  onClick={() => setUserInput((prev) => prev + 1)}
                  className="w-14 h-14 rounded-2xl liquid-glass-pill text-slate-950 dark:text-white hover:brightness-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              {/* Glass Quick Jump Buttons */}
              <div className="flex gap-2.5 mt-1">
                {[-5, -2, +2, +5].map((delta) => (
                  <button
                    key={delta}
                    onClick={() => setUserInput((prev) => Math.max(0, prev + delta))}
                    className="px-4 py-2 text-xs font-black rounded-2xl liquid-glass-subtle text-slate-950 dark:text-slate-100 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                  >
                    {delta > 0 ? `+${delta}` : delta}
                  </button>
                ))}
              </div>

              <TactileButton
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                className="w-full max-w-xs mt-1"
              >
                <span>{t('submit')}</span>
              </TactileButton>
            </motion.div>
          )}

          {/* 4. RESULT PHASE */}
          {phase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.12 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-950 dark:text-white">
                  {diff === 0 ? t('Ball_perfect') : diff <= 2 ? t('Ball_close') : t('Ball_effort')}
                </h3>
                <p className="text-xs md:text-sm font-bold text-slate-800 dark:text-neutral-300">
                  {diff === 0 ? t('Ball_spot_on') : t('Ball_off_by', { count: diff })}
                </p>
              </div>

              {/* Glass Comparison Cards */}
              <div className="flex items-center gap-4 justify-center">
                <div className="flex flex-col items-center p-6 rounded-3xl liquid-glass-card min-w-32.5">
                  <span className="text-4xl font-black font-mono text-slate-950 dark:text-white mb-1">
                    <SlidingNumber value={userInput} />
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('yser_Input_Ball')}
                  </span>
                </div>

                <div className="text-lg font-black text-slate-700 dark:text-slate-400">vs</div>

                <div className="flex flex-col items-center p-6 rounded-3xl liquid-glass-card min-w-32.5">
                  <span className="text-4xl font-black font-mono text-indigo-700 dark:text-indigo-400 mb-1">
                    <SlidingNumber value={actualBallCount} />
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('display_Ball')}
                  </span>
                </div>
              </div>

              <TactileButton
                variant="secondary"
                size="lg"
                onClick={() => setPhase('ready')}
                className="w-full max-w-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('again')}</span>
              </TactileButton>
            </motion.div>
          )}
        </AnimatePresence>
      </GlowCard>
    </div>
  );
};

export default BallTest;
