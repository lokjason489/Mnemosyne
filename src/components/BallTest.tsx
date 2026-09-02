import confetti from 'canvas-confetti';
import { Eye, Minus, Play, Plus, RotateCcw, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type React from 'react';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';
import { GlowCard } from './ui/GlowCard';
import { SlidingNumber } from './ui/SlidingNumber';
import { TactileButton } from './ui/TactileButton';

interface Props {
  onClose?: React.Dispatch<React.SetStateAction<number>>;
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
    if (dist < radius + b.radius + 8) {
      return true;
    }
  }
  return false;
};

export const BallTest: React.FC<Props> = () => {
  const { t } = useTranslation();

  // Settings: [minBalls, maxBalls]
  const [ballRange, setBallRange] = useState<[number, number]>([6, 12]);
  const [actualBallCount, setActualBallCount] = useState<number>(0);
  const [userInput, setUserInput] = useState<number>(8);

  // Phases: 'ready' | 'showing' | 'input' | 'result'
  const [phase, setPhase] = useState<'ready' | 'showing' | 'input' | 'result'>('ready');
  const [timerProgress, setTimerProgress] = useState(100);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startTest = useCallback(() => {
    const targetCount = getRandomInt(ballRange[0], ballRange[1]);
    setActualBallCount(targetCount);
    setUserInput(Math.round((ballRange[0] + ballRange[1]) / 2));
    setPhase('showing');
    setTimerProgress(100);

    // Give time for canvas to mount, then render
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const ballRadius = 18;
      const balls: { x: number; y: number; radius: number; color: string }[] = [];

      const colors = [
        '#6366f1', // Indigo
        '#a855f7', // Purple
        '#ec4899', // Pink
        '#06b6d4', // Cyan
        '#10b981', // Emerald
        '#f59e0b', // Amber
      ];

      for (let i = 0; i < targetCount; i++) {
        let x = getRandomInt(ballRadius + 10, width - ballRadius - 10);
        let y = getRandomInt(ballRadius + 10, height - ballRadius - 10);
        let attempts = 0;

        while (isColliding(x, y, ballRadius, balls) && attempts < 100) {
          x = getRandomInt(ballRadius + 10, width - ballRadius - 10);
          y = getRandomInt(ballRadius + 10, height - ballRadius - 10);
          attempts++;
        }

        const color = colors[i % colors.length];
        balls.push({ x, y, radius: ballRadius, color });

        // Draw glossy gradient ball
        const grad = ctx.createRadialGradient(
          x - ballRadius * 0.3,
          y - ballRadius * 0.3,
          ballRadius * 0.1,
          x,
          y,
          ballRadius
        );
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, color);
        grad.addColorStop(1, '#1e1b4b');

        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }, 50);

    // Countdown 1200ms then transition to input
    const startTime = Date.now();
    const duration = 1200;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setTimerProgress(remaining);

      if (elapsed >= duration) {
        clearInterval(interval);
        setPhase('input');
      }
    }, 30);
  }, [ballRange]);

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
      <GlowCard className="p-6 md:p-8" glowColor="rgba(16, 185, 129, 0.15)">
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
              <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <Eye className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  {t('BallTest')}
                </h2>
                <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-md">
                  {t('Ball_desc')}
                </p>
              </div>

              {/* Range Selector Pills */}
              <div className="w-full max-w-md bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between gap-1">
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
                          ? 'bg-white dark:bg-emerald-600 text-emerald-600 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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

          {/* 2. SHOWING PHASE */}
          {phase === 'showing' && (
            <motion.div
              key="showing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center text-center gap-4"
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Memorize the Ball Count!</span>
              </div>

              {/* Canvas Frame */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl bg-slate-950/90 w-full max-w-lg aspect-video flex items-center justify-center">
                <canvas ref={canvasRef} width={500} height={280} className="w-full h-full block" />
              </div>

              {/* Countdown Bar */}
              <div className="w-full max-w-xs bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                <motion.div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
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
                <h3 className="text-xl md:text-2xl font-bold">{t('inputNum')}</h3>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                  {t('yser_Input_Ball')}
                </p>
              </div>

              {/* Number Stepper Counter */}
              <div className="flex items-center gap-4">
                <TactileButton
                  variant="secondary"
                  size="md"
                  onClick={() => setUserInput((prev) => Math.max(0, prev - 1))}
                  className="w-12 h-12 rounded-2xl p-0 flex items-center justify-center"
                >
                  <Minus className="w-6 h-6" />
                </TactileButton>

                <div className="flex items-center justify-center w-28 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 shadow-inner">
                  <SlidingNumber value={userInput} />
                </div>

                <TactileButton
                  variant="secondary"
                  size="md"
                  onClick={() => setUserInput((prev) => prev + 1)}
                  className="w-12 h-12 rounded-2xl p-0 flex items-center justify-center"
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
                    className="px-3 py-1 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
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
                <h3 className="text-2xl font-extrabold">
                  {diff === 0 ? '🎉 Perfect Count!' : diff <= 2 ? '⚡ Very Close!' : 'Good Effort!'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {diff === 0
                    ? 'Your spatial working memory is spot on.'
                    : `Off by only ${diff} balls.`}
                </p>
              </div>

              {/* Compare Cards */}
              <div className="flex items-center gap-4 justify-center">
                <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 min-w-[120px]">
                  <span className="text-3xl font-extrabold text-slate-700 dark:text-slate-300">
                    <SlidingNumber value={userInput} />
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {t('yser_Input_Ball')}
                  </span>
                </div>

                <div className="text-2xl font-bold text-slate-400">vs</div>

                <div className="flex flex-col items-center p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 min-w-[120px]">
                  <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    <SlidingNumber value={actualBallCount} />
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
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
