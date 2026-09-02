import confetti from 'canvas-confetti';
import { Delete, Keyboard, Play, RotateCcw, Sparkles, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';
import { GlowCard } from './ui/GlowCard';
import { SlidingNumber } from './ui/SlidingNumber';
import { TactileButton } from './ui/TactileButton';

interface Props {
  onClose?: React.Dispatch<React.SetStateAction<number>>;
}

export const NumberTest: React.FC<Props> = () => {
  const { t } = useTranslation();
  const [level, setLevel] = useState<number>(8); // length of number sequence
  const [numbers, setNumbers] = useState<number[]>([]);
  const [userInputArray, setUserInputArray] = useState<number[]>([]);

  // Phases: 'ready' | 'memorizing' | 'input' | 'result'
  const [phase, setPhase] = useState<'ready' | 'memorizing' | 'input' | 'result'>('ready');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerProgress, setTimerProgress] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start the memorization sequence
  const startTest = () => {
    const seq: number[] = [];
    while (seq.length < level) {
      const num = Math.floor(Math.random() * 10);
      if (seq.length > 0 && seq[seq.length - 1] === num) {
        continue;
      }
      seq.push(num);
    }
    setNumbers(seq);
    setUserInputArray([]);
    setCurrentIndex(0);
    setTimerProgress(0);
    setPhase('memorizing');
  };

  // Timer loop for memorizing phase
  useEffect(() => {
    if (phase === 'memorizing') {
      setCurrentIndex(0);
      let count = 0;

      timerRef.current = setInterval(() => {
        count += 1;
        setCurrentIndex(count);
        setTimerProgress((count / level) * 100);

        if (count >= level) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('input');
        }
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [phase, level]);

  // Handle single digit input
  const handleDigitInput = useCallback(
    (digit: number) => {
      if (phase !== 'input') return;

      setUserInputArray((prev) => {
        const nextArray = [...prev, digit];
        if (nextArray.length === numbers.length) {
          let correct = 0;
          for (let i = 0; i < numbers.length; i++) {
            if (numbers[i] === nextArray[i]) correct++;
          }
          if (correct / numbers.length >= 0.7) {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });
          }
          setPhase('result');
        }
        return nextArray;
      });
    },
    [phase, numbers]
  );

  const handleDelete = useCallback(() => {
    setUserInputArray((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
  }, []);

  // Physical keyboard support
  useEffect(() => {
    if (phase !== 'input') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigitInput(parseInt(e.key, 10));
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, handleDigitInput, handleDelete]);

  // Score statistics
  const scoreStats = React.useMemo(() => {
    if (phase !== 'result') return { correct: 0, wrong: 0, accuracy: 0 };
    let correct = 0;
    numbers.forEach((num, i) => {
      if (num === userInputArray[i]) correct++;
    });
    const wrong = numbers.length - correct;
    const accuracy = Math.round((correct / numbers.length) * 100);
    return { correct, wrong, accuracy };
  }, [phase, numbers, userInputArray]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <GlowCard className="p-6 md:p-8">
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
              <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                <Zap className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  {t('NumberTest')}
                </h2>
                <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-md">
                  {t('Number_desc')}
                </p>
              </div>

              {/* Difficulty Selection Pills */}
              <div className="w-full max-w-md bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between gap-1">
                {[
                  { label: t('easy'), val: 6 },
                  { label: t('medium'), val: 8 },
                  { label: t('difficult'), val: 12 },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setLevel(item.val)}
                    className={cn(
                      'flex-1 py-2 text-xs md:text-sm font-bold rounded-xl transition-all cursor-pointer',
                      level === item.val
                        ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    {item.label} ({item.val})
                  </button>
                ))}
              </div>

              <TactileButton
                variant="primary"
                size="lg"
                onClick={startTest}
                className="w-full max-w-xs mt-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{t('start')}</span>
              </TactileButton>
            </motion.div>
          )}

          {/* 2. MEMORIZING PHASE */}
          {phase === 'memorizing' && (
            <motion.div
              key="memorizing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center min-h-[340px] text-center gap-6"
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {t('level')}: {currentIndex + 1} / {level}
                </span>
              </div>

              {/* Huge Flashing Digit Display */}
              <div className="relative flex items-center justify-center w-40 h-40 md:w-48 md:h-48 rounded-3xl bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-500/20 shadow-2xl backdrop-blur-md">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.5, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.2, y: -15 }}
                    transition={{ duration: 0.2 }}
                    className="text-7xl md:text-8xl font-black tracking-tighter bg-gradient-to-b from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-300 bg-clip-text text-transparent select-none font-mono"
                  >
                    {numbers[currentIndex] ?? '-'}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-xs bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full"
                  style={{ width: `${timerProgress}%` }}
                  transition={{ ease: 'linear' }}
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
                <p className="text-xs md:text-sm text-slate-400">
                  {userInputArray.length} / {numbers.length}
                </p>
              </div>

              {/* Entered Digits Display Slots */}
              <div className="flex flex-wrap justify-center gap-2 max-w-md min-h-[52px]">
                {numbers.map((_, i) => {
                  const entered = userInputArray[i];
                  return (
                    <div
                      key={i}
                      className={cn(
                        'w-10 h-12 md:w-11 md:h-14 rounded-xl border flex items-center justify-center font-mono text-xl font-bold transition-all',
                        entered !== undefined
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-sm'
                          : i === userInputArray.length
                            ? 'border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-slate-50 dark:bg-slate-800/60 animate-pulse'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400'
                      )}
                    >
                      {entered !== undefined ? entered : ''}
                    </div>
                  );
                })}
              </div>

              {/* Tactile Virtual Keypad */}
              <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs mt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <TactileButton
                    key={digit}
                    variant="secondary"
                    size="md"
                    onClick={() => handleDigitInput(digit)}
                    className="h-13 text-xl font-bold font-mono"
                  >
                    {digit}
                  </TactileButton>
                ))}

                <TactileButton
                  variant="outline"
                  size="md"
                  onClick={handleDelete}
                  className="h-13"
                  aria-label="Delete"
                >
                  <Delete className="w-5 h-5" />
                </TactileButton>

                <TactileButton
                  variant="secondary"
                  size="md"
                  onClick={() => handleDigitInput(0)}
                  className="h-13 text-xl font-bold font-mono"
                >
                  0
                </TactileButton>

                <div className="h-13 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>Type</span>
                </div>
              </div>
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
                <h3 className="text-2xl font-extrabold">{t('StoopTest_Result')}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {scoreStats.accuracy >= 80
                    ? '🌟 Excellent Memory Span!'
                    : 'Keep training every day!'}
                </p>
              </div>

              {/* Accuracy Badge */}
              <div className="flex items-center gap-6 justify-center">
                <div className="flex flex-col items-center p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    <SlidingNumber value={scoreStats.correct} />
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    {t('correct_Ans')}
                  </span>
                </div>

                <div className="flex flex-col items-center p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                  <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
                    <SlidingNumber value={scoreStats.wrong} />
                  </span>
                  <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                    {t('wrong_Ans')}
                  </span>
                </div>

                <div className="flex flex-col items-center p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                  <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    <SlidingNumber value={scoreStats.accuracy} />%
                  </span>
                  <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    {t('Score')}
                  </span>
                </div>
              </div>

              {/* Digit-by-Digit Breakdown */}
              <div className="w-full max-w-lg p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {numbers.map((num, i) => {
                    const isMatch = num === userInputArray[i];
                    return (
                      <div
                        key={i}
                        className={cn(
                          'flex items-center justify-between p-2 rounded-xl text-xs font-mono font-bold border',
                          isMatch
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                        )}
                      >
                        <span>{num}</span>
                        <span>→</span>
                        <span>{userInputArray[i] ?? '-'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Again Button */}
              <TactileButton
                variant="primary"
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

export default NumberTest;
