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
  glow: string;
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

    const palette = [
      { color: '#6366f1', glow: '#4338ca' }, // Indigo
      { color: '#a855f7', glow: '#7e22ce' }, // Purple
      { color: '#ec4899', glow: '#be185d' }, // Pink
      { color: '#06b6d4', glow: '#0e7490' }, // Cyan
      { color: '#10b981', glow: '#047857' }, // Emerald
      { color: '#f59e0b', glow: '#b45309' }, // Amber
      { color: '#ef4444', glow: '#b91c1c' }, // Red
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

      const pal = palette[i % palette.length];
      generatedBalls.push({
        id: i,
        x,
        y,
        radius,
        color: pal.color,
        glow: pal.glow,
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
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    setPhase('result');
  };

  const diff = Math.abs(userInput - actualBallCount);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <GlowCard className="p-6 md:p-8" glowColor="rgba(16, 185, 129, 0.2)">
        <AnimatePresence mode="wait">
          {/* 1. READY PHASE */}
          {phase === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-sm">
                <Eye className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {t('BallTest')}
                </h2>
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium max-w-md">
                  {t('Ball_desc')}
                </p>
              </div>

              {/* Range Selector Pills with high contrast */}
              <div className="w-full max-w-md bg-slate-200/90 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-700 flex justify-between gap-1 shadow-inner">
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
                        'flex-1 py-2 text-xs md:text-sm font-bold rounded-xl transition-all cursor-pointer',
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/50'
                      )}
                    >
                      {item.label} ({item.range[0]}-{item.range[1]})
                    </button>
                  );
                })}
              </div>

              <TactileButton
                variant="success"
                size="lg"
                onClick={startTest}
                className="w-full max-w-xs mt-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{t('start')}</span>
              </TactileButton>
            </motion.div>
          )}

          {/* 2. SHOWING PHASE - Guaranteed SVG Rendering */}
          {phase === 'showing' && (
            <motion.div
              key="showing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center text-center gap-4"
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 px-3.5 py-1.5 rounded-full border-2 border-emerald-300 dark:border-emerald-800">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Memorize the Ball Count!</span>
              </div>

              {/* Viewport Frame with deep dark background for maximum ball contrast in both themes */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 shadow-2xl bg-slate-950 w-full max-w-lg aspect-video flex items-center justify-center">
                <svg
                  viewBox="0 0 500 300"
                  role="img"
                  aria-label="Ball count memory canvas"
                  className="w-full h-full block select-none pointer-events-none"
                >
                  <title>Ball Count</title>
                  <defs>
                    {balls.map((b) => (
                      <radialGradient
                        key={`grad-${b.id}`}
                        id={`grad-${b.id}`}
                        cx="35%"
                        cy="35%"
                        r="65%"
                      >
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="30%" stopColor={b.color} />
                        <stop offset="100%" stopColor={b.glow} />
                      </radialGradient>
                    ))}
                    <filter id="ball-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.4" />
                    </filter>
                  </defs>

                  {balls.map((b) => (
                    <circle
                      key={b.id}
                      cx={b.x}
                      cy={b.y}
                      r={b.radius}
                      fill={`url(#grad-${b.id})`}
                      filter="url(#ball-glow)"
                    />
                  ))}
                </svg>
              </div>

              {/* Countdown Bar */}
              <div className="w-full max-w-xs bg-slate-300 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-1 border border-slate-300/80">
                <motion.div
                  className="bg-linear-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                  style={{ width: `${timerProgress}%` }}
                />
              </div>
            </motion.div>
          )}

          {/* 3. INPUT PHASE */}
          {phase === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                  {t('inputNum')}
                </h3>
                <p className="text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-400">
                  {t('yser_Input_Ball')}
                </p>
              </div>

              {/* Number Stepper Counter with High Contrast */}
              <div className="flex items-center gap-4">
                <TactileButton
                  variant="secondary"
                  size="md"
                  onClick={() => setUserInput((prev) => Math.max(0, prev - 1))}
                  className="w-12 h-12 rounded-2xl p-0 flex items-center justify-center border-2 border-slate-300 dark:border-slate-700"
                >
                  <Minus className="w-6 h-6" />
                </TactileButton>

                <div className="flex items-center justify-center w-28 h-20 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-mono text-4xl font-black text-emerald-700 dark:text-emerald-400 shadow-sm">
                  <SlidingNumber value={userInput} />
                </div>

                <TactileButton
                  variant="secondary"
                  size="md"
                  onClick={() => setUserInput((prev) => prev + 1)}
                  className="w-12 h-12 rounded-2xl p-0 flex items-center justify-center border-2 border-slate-300 dark:border-slate-700"
                >
                  <Plus className="w-6 h-6" />
                </TactileButton>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex gap-2">
                {[-5, -2, +2, +5].map((delta) => (
                  <button
                    key={delta}
                    onClick={() => setUserInput((prev) => Math.max(0, prev + delta))}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm cursor-pointer"
                  >
                    {delta > 0 ? `+${delta}` : delta}
                  </button>
                ))}
              </div>

              <TactileButton
                variant="success"
                size="lg"
                onClick={handleSubmit}
                className="w-full max-w-xs mt-2"
              >
                <span>{t('submit')}</span>
              </TactileButton>
            </motion.div>
          )}

          {/* 4. RESULT PHASE */}
          {phase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {diff === 0 ? '🎉 Perfect Count!' : diff <= 2 ? '⚡ Very Close!' : 'Good Effort!'}
                </h3>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  {diff === 0
                    ? 'Your spatial working memory is spot on.'
                    : `Off by only ${diff} balls.`}
                </p>
              </div>

              {/* Compare Cards with High Contrast */}
              <div className="flex items-center gap-4 justify-center">
                <div className="flex flex-col items-center p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 min-w-30 shadow-sm">
                  <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
                    <SlidingNumber value={userInput} />
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1">
                    {t('yser_Input_Ball')}
                  </span>
                </div>

                <div className="text-2xl font-black text-slate-400">vs</div>

                <div className="flex flex-col items-center p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 min-w-30 shadow-sm">
                  <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400">
                    <SlidingNumber value={actualBallCount} />
                  </span>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mt-1">
                    {t('display_Ball')}
                  </span>
                </div>
              </div>

              <TactileButton
                variant="success"
                size="lg"
                onClick={() => setPhase('ready')}
                className="w-full max-w-xs"
              >
                <RotateCcw className="w-5 h-5" />
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
