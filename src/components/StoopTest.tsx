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
  textHex: string;
}

export const StoopTest: React.FC<Props> = () => {
  const { t } = useTranslation();

  const colors: ColorOption[] = useMemo(
    () => [
      { value: 'red', nameKey: 'red', hex: '#ef4444', textHex: '#ffffff' },
      { value: 'blue', nameKey: 'blue', hex: '#3b82f6', textHex: '#ffffff' },
      { value: 'green', nameKey: 'green', hex: '#10b981', textHex: '#ffffff' },
      { value: 'yellow', nameKey: 'yellow', hex: '#f59e0b', textHex: '#1e293b' },
      { value: 'purple', nameKey: 'purple', hex: '#8b5cf6', textHex: '#ffffff' },
      { value: 'orange', nameKey: 'orange', hex: '#f97316', textHex: '#ffffff' },
      { value: 'black', nameKey: 'black', hex: '#0f172a', textHex: '#ffffff' },
      { value: 'pink', nameKey: 'pink', hex: '#ec4899', textHex: '#ffffff' },
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

    // Rule: in normal mode, pick the INK color
    const isCorrect = selected.value === currentInk.value;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (round >= TOTAL_ROUNDS) {
      if (timerRef.current) clearInterval(timerRef.current);
      confetti({
        particleCount: 80,
        spread: 70,
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
    <div className="w-full max-w-2xl mx-auto">
      <GlowCard className="p-6 md:p-8" glowColor="rgba(236, 72, 153, 0.2)">
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
              <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-400 border-2 border-pink-300 dark:border-pink-800 shadow-sm">
                <Palette className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {t('StoopTest')}
                </h2>
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium max-w-md">
                  {t('Stoop_desc')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border-2 border-slate-300 dark:border-slate-700 text-xs md:text-sm text-slate-700 dark:text-slate-300 text-left space-y-2 max-w-md shadow-sm">
                <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>{t('Stoop_desc')}</span>
                </p>
                <p className="opacity-90 leading-relaxed text-xs">{t('Stoop_long_desc')}</p>
              </div>

              <TactileButton
                variant="danger"
                size="lg"
                onClick={startTest}
                className="w-full max-w-xs mt-2"
              >
                <Play className="w-5 h-5 fill-current" />
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center text-center gap-6"
            >
              {/* Header with Round & Timer */}
              <div className="flex items-center justify-between w-full max-w-md px-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-pink-800 dark:text-pink-300 bg-pink-100 dark:bg-pink-950/70 px-3.5 py-1.5 rounded-full border border-pink-300 dark:border-pink-800 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {t('level')}: {round} / {TOTAL_ROUNDS}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 shadow-sm">
                  <Timer className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{(elapsedMs / 1000).toFixed(1)}s</span>
                </div>
              </div>

              {/* High Contrast Dark Canvas for Stroop Word (Guarantees full legibility for yellow/cyan/orange in both light and dark modes) */}
              <div
                className="w-full max-w-md h-44 rounded-3xl flex items-center justify-center bg-slate-950 border-2 border-slate-300 dark:border-slate-700 shadow-2xl relative overflow-hidden"
                style={{
                  boxShadow: `0 20px 40px -15px ${currentInk.hex}40, 0 0 0 1px ${currentInk.hex}30 inset`,
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`${round}-${currentWord.nameKey}-${currentInk.nameKey}`}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.1, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="text-5xl md:text-6xl font-black tracking-tight select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                    style={{ color: currentInk.hex }}
                  >
                    {t(currentWord.nameKey)}
                  </motion.span>
                </AnimatePresence>
              </div>

              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Click the INK COLOR of the word above!
              </p>

              {/* 4 Choices Buttons */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {choices.map((choice) => (
                  <motion.button
                    key={choice.value}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleChoice(choice)}
                    className="h-14 rounded-2xl flex items-center justify-center gap-2 font-black text-base shadow-md border-2 border-slate-900/15 dark:border-white/10 cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
                    style={{
                      backgroundColor: choice.hex,
                      color: choice.textHex,
                    }}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white/90 shadow-sm" />
                    <span>{t(choice.nameKey)}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* 3. RESULT PHASE */}
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
                  {t('StoopTest_Result')}
                </h3>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {score >= 8
                    ? '⚡ Exceptional Cognitive Inhabitation!'
                    : 'Great training session!'}
                </p>
              </div>

              {/* Score Metric Cards with High Contrast */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                <div className="flex flex-col items-center p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 shadow-sm">
                  <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400">
                    <SlidingNumber value={score} />/{TOTAL_ROUNDS}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mt-1">
                    {t('correct_Ans')}
                  </span>
                </div>

                <div className="flex flex-col items-center p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-300 dark:border-indigo-800 shadow-sm">
                  <span className="text-3xl font-black text-indigo-700 dark:text-indigo-400">
                    <SlidingNumber value={(elapsedMs / 1000).toFixed(1)} />s
                  </span>
                  <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 mt-1">
                    {t('time')}
                  </span>
                </div>

                <div className="flex flex-col items-center p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/40 border-2 border-pink-300 dark:border-pink-800 shadow-sm">
                  <span className="text-3xl font-black text-pink-700 dark:text-pink-400">
                    <SlidingNumber value={avgReactionTimeSec} />s
                  </span>
                  <span className="text-xs font-bold text-pink-800 dark:text-pink-300 mt-1">
                    Avg / Round
                  </span>
                </div>
              </div>

              <TactileButton
                variant="danger"
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

export default StoopTest;
