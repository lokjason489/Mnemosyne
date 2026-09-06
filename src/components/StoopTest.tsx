import confetti from 'canvas-confetti';
import { Palette, Play, RotateCcw, Sparkles, Timer, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlowCard } from './ui/GlowCard';
import { SlidingNumber } from './ui/SlidingNumber';
import { TactileButton } from './ui/TactileButton';

interface Props {
  onClose?: React.Dispatch<React.SetStateAction<number>>;
}

interface ColorOption {
  value: string;
  nameKey: string;
  hex: string;
}

export const StoopTest: React.FC<Props> = () => {
  const { t } = useTranslation();

  const colors: ColorOption[] = useMemo(
    () => [
      { value: 'red', nameKey: 'red', hex: '#ef4444' },
      { value: 'blue', nameKey: 'blue', hex: '#3b82f6' },
      { value: 'green', nameKey: 'green', hex: '#10b981' },
      { value: 'yellow', nameKey: 'yellow', hex: '#f59e0b' },
      { value: 'purple', nameKey: 'purple', hex: '#8b5cf6' },
      { value: 'orange', nameKey: 'orange', hex: '#f97316' },
      { value: 'black', nameKey: 'black', hex: '#171717' },
      { value: 'pink', nameKey: 'pink', hex: '#ec4899' },
    ],
    []
  );

  const TOTAL_ROUNDS = 10;

  // Phases: 'ready' | 'playing' | 'result'
  const [phase, setPhase] = useState<'ready' | 'playing' | 'result'>('ready');

  // Current problem
  const [round, setRound] = useState(1);
  const [currentWord, setCurrentWord] = useState<ColorOption>(colors[0]);
  const [currentInk, setCurrentInk] = useState<ColorOption>(colors[1]);
  const [choices, setChoices] = useState<ColorOption[]>([]);

  // Scoring
  const [score, setScore] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const generateProblem = useCallback(() => {
    // Pick random word and different ink color
    const wordIdx = Math.floor(Math.random() * colors.length);
    let inkIdx = Math.floor(Math.random() * colors.length);
    while (inkIdx === wordIdx) {
      inkIdx = Math.floor(Math.random() * colors.length);
    }

    const word = colors[wordIdx];
    const ink = colors[inkIdx];
    setCurrentWord(word);
    setCurrentInk(ink);

    // Pick 4 choices including the correct ink color
    const choiceSet = new Set<ColorOption>([ink, word]);
    while (choiceSet.size < 4) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      choiceSet.add(randomColor);
    }

    // Shuffle
    setChoices(Array.from(choiceSet).sort(() => Math.random() - 0.5));
  }, [colors]);

  const startTest = () => {
    setRound(1);
    setScore(0);
    setElapsedMs(0);
    setPhase('playing');
    startTimeRef.current = Date.now();
    generateProblem();

    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleChoice = (selected: ColorOption) => {
    if (phase !== 'playing') return;

    // Rule: pick the INK color
    const isCorrect = selected.value === currentInk.value;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (round >= TOTAL_ROUNDS) {
      if (timerRef.current) clearInterval(timerRef.current);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      setPhase('result');
    } else {
      setRound((prev) => prev + 1);
      generateProblem();
    }
  };

  const avgReactionTimeSec = (elapsedMs / 1000 / TOTAL_ROUNDS).toFixed(2);

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
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/30 dark:to-purple-500/30 text-indigo-600 dark:text-indigo-400 border border-white/60 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] backdrop-blur-md">
                <Palette className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                  {t('StoopTest')}
                </h2>
                <p className="text-xs md:text-sm font-medium text-slate-800 dark:text-slate-300 max-w-md leading-relaxed">
                  {t('Stoop_desc')}
                </p>
              </div>

              <div className="p-4 rounded-2xl liquid-glass-subtle text-xs text-slate-800 dark:text-slate-300 text-left space-y-1.5 max-w-md">
                <p className="font-bold text-slate-950 dark:text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>{t('Stoop_desc')}</span>
                </p>
                <p className="opacity-90 leading-relaxed text-[11px]">{t('Stoop_long_desc')}</p>
              </div>

              <TactileButton
                variant="primary"
                size="lg"
                onClick={startTest}
                className="w-full max-w-xs mt-1"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {t('start')} ({TOTAL_ROUNDS} {t('level')})
                </span>
              </TactileButton>
            </motion.div>
          )}

          {/* 2. PLAYING PHASE */}
          {phase === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex flex-col items-center text-center gap-6"
            >
              {/* Header with Round & Timer */}
              <div className="flex items-center justify-between w-full max-w-md px-1">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-900 dark:text-slate-200 liquid-glass-pill px-4 py-2 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>
                    {t('level')}: {round} / {TOTAL_ROUNDS}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-900 dark:text-slate-200 liquid-glass-pill px-4 py-2 rounded-full">
                  <Timer className="w-3.5 h-3.5 text-slate-700 dark:text-slate-400" />
                  <span>{(elapsedMs / 1000).toFixed(1)}s</span>
                </div>
              </div>

              {/* Clean Viewport for Stroop Word */}
              <div className="w-full max-w-md h-44 rounded-3xl flex items-center justify-center liquid-glass-card relative overflow-hidden">
                {/* Specular top sheen */}
                <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 dark:via-white/40 to-transparent pointer-events-none" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`${round}-${currentWord.nameKey}-${currentInk.nameKey}`}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.12 }}
                    className="text-6xl font-black tracking-tight select-none drop-shadow-sm"
                    style={{ color: currentInk.hex }}
                  >
                    {t(currentWord.nameKey)}
                  </motion.span>
                </AnimatePresence>
              </div>

              <p className="text-xs text-slate-900 dark:text-slate-200 font-bold">
                {t('Stoop_hint')}
              </p>

              {/* Liquid Glass Choices Buttons */}
              <div className="grid grid-cols-2 gap-2.5 w-full max-w-md">
                {choices.map((choice) => (
                  <button
                    key={choice.value}
                    onClick={() => handleChoice(choice)}
                    className="h-14 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-sm liquid-glass-pill text-slate-950 dark:text-white hover:brightness-105 active:scale-98 transition-all cursor-pointer"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/20 shadow-sm shrink-0"
                      style={{ backgroundColor: choice.hex }}
                    />
                    <span>{t(choice.nameKey)}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* 3. RESULT PHASE */}
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
                  {t('StoopTest_Result')}
                </h3>
                <p className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-300">
                  {score >= 8 ? t('Stoop_exceptional') : t('Stoop_great_session')}
                </p>
              </div>

              {/* Liquid Glass Metric Cards */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                <div className="flex flex-col items-center p-5 rounded-3xl liquid-glass-card">
                  <span className="text-3xl font-black font-mono text-slate-950 dark:text-white">
                    <SlidingNumber value={score} />/{TOTAL_ROUNDS}
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                    {t('correct_Ans')}
                  </span>
                </div>

                <div className="flex flex-col items-center p-5 rounded-3xl liquid-glass-card">
                  <span className="text-3xl font-black font-mono text-slate-950 dark:text-white">
                    <SlidingNumber value={(elapsedMs / 1000).toFixed(1)} />s
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                    {t('time')}
                  </span>
                </div>

                <div className="flex flex-col items-center p-5 rounded-3xl liquid-glass-card">
                  <span className="text-3xl font-black font-mono text-slate-950 dark:text-white">
                    <SlidingNumber value={avgReactionTimeSec} />s
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                    {t('avg_per_round')}
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

export default StoopTest;
