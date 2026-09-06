import confetti from 'canvas-confetti';
import { Delete, Hash, Keyboard, Play, RotateCcw, Sparkles } from 'lucide-react';
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
    if (phase !== 'memorizing') return;

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
              particleCount: 70,
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
        handleDigitInput(Number.parseInt(e.key, 10));
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
                <Hash className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                  {t('NumberTest')}
                </h2>
                <p className="text-xs md:text-sm font-semibold text-slate-800 dark:text-neutral-300 max-w-md leading-relaxed">
                  {t('Number_desc')}
                </p>
              </div>

              {/* Liquid Glass Range Selector */}
              <div className="w-full max-w-sm liquid-glass-subtle p-1.5 rounded-2xl flex justify-between gap-1">
                {[
                  { label: t('easy'), val: 6 },
                  { label: t('medium'), val: 8 },
                  { label: t('difficult'), val: 12 },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setLevel(item.val)}
                    className={cn(
                      'flex-1 py-2 text-xs rounded-xl transition-all duration-200 cursor-pointer',
                      level === item.val
                        ? 'bg-linear-to-b from-white to-white/95 dark:from-white/20 dark:to-white/10 text-indigo-700 dark:text-white shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_8px_rgba(15,23,42,0.12)] border border-slate-200/80 dark:border-white/20 font-black'
                        : 'text-slate-800 dark:text-slate-300 font-bold hover:text-slate-950 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
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
                className="w-full max-w-xs mt-1"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t('start')}</span>
              </TactileButton>
            </motion.div>
          )}

          {/* 2. MEMORIZING PHASE */}
          {phase === 'memorizing' && (
            <motion.div
              key="memorizing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex flex-col items-center justify-center min-h-75 text-center gap-6"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/90 dark:bg-indigo-500/20 px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-500/40">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {t('currNum')}: {currentIndex + 1} / {level}
                </span>
              </div>

              {/* Liquid Glass Display Frame */}
              <div className="relative flex items-center justify-center w-44 h-44 md:w-52 md:h-52 rounded-3xl liquid-glass-card">
                {/* Specular top sheen */}
                <div className="absolute inset-x-6 top-0 h-[1.5px] bg-linear-to-r from-transparent via-white/90 dark:via-white/40 to-transparent pointer-events-none" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.85, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
                    transition={{ duration: 0.15 }}
                    className="text-8xl font-black tracking-tighter text-indigo-700 dark:text-indigo-400 font-mono select-none drop-shadow-md"
                  >
                    {numbers[currentIndex] ?? '-'}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Liquid Progress Line */}
              <div className="w-full max-w-xs bg-slate-200/50 dark:bg-slate-800/50 h-2 rounded-full overflow-hidden border border-white/50 dark:border-white/10 shadow-inner mt-2">
                <motion.div
                  className="bg-indigo-500 h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
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
                  {userInputArray.length} / {numbers.length}
                </p>
              </div>

              {/* Glass Digit Slots */}
              <div className="flex flex-wrap justify-center gap-2 max-w-md min-h-13">
                {numbers.map((_, i) => {
                  const entered = userInputArray[i];
                  const isCurrent = i === userInputArray.length;
                  return (
                    <div
                      key={i}
                      className={cn(
                        'w-10 h-13 md:w-12 md:h-16 rounded-xl flex items-center justify-center font-mono text-2xl font-black transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]',
                        entered !== undefined
                          ? 'bg-white/95 dark:bg-white/15 text-indigo-700 dark:text-white border border-slate-300 dark:border-white/20 shadow-sm'
                          : isCurrent
                            ? 'bg-white/70 dark:bg-black/40 border-2 border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/30 text-indigo-700 dark:text-white'
                            : 'bg-slate-200/40 dark:bg-black/20 border border-slate-300/80 dark:border-white/10 text-slate-400'
                      )}
                    >
                      {entered !== undefined ? entered : ''}
                    </div>
                  );
                })}
              </div>

              {/* Liquid Glass Keypad */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-xs mt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleDigitInput(digit)}
                    className="h-14 text-2xl font-mono font-black rounded-2xl liquid-glass-pill text-slate-950 dark:text-white hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                  >
                    {digit}
                  </button>
                ))}

                <button
                  onClick={handleDelete}
                  className="h-14 flex items-center justify-center rounded-2xl liquid-glass-pill text-slate-950 dark:text-white hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                  aria-label="Delete"
                >
                  <Delete className="w-6 h-6" />
                </button>

                <button
                  onClick={() => handleDigitInput(0)}
                  className="h-14 text-2xl font-mono font-black rounded-2xl liquid-glass-pill text-slate-950 dark:text-white hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                >
                  0
                </button>

                <div className="h-14 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 liquid-glass-subtle rounded-2xl">
                  <Keyboard className="w-4 h-4" />
                  <span>{t('Number_keyboard_hint')}</span>
                </div>
              </div>
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
                  {t('NumberTest_Result')}
                </h3>
                <p className="text-xs md:text-sm font-bold text-slate-800 dark:text-neutral-300">
                  {scoreStats.accuracy >= 80 ? t('Number_excellent') : t('Number_keep_training')}
                </p>
              </div>

              {/* Liquid Glass Metric Cards */}
              <div className="flex flex-wrap items-center gap-4 justify-center">
                <div className="flex flex-col items-center p-6 rounded-3xl liquid-glass-card min-w-30">
                  <span className="text-4xl font-black font-mono text-emerald-700 dark:text-emerald-400 mb-1">
                    <SlidingNumber value={scoreStats.correct} />
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('correct_Ans')}
                  </span>
                </div>

                <div className="flex flex-col items-center p-6 rounded-3xl liquid-glass-card min-w-30">
                  <span className="text-4xl font-black font-mono text-rose-600 dark:text-rose-400 mb-1">
                    <SlidingNumber value={scoreStats.wrong} />
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('wrong_Ans')}
                  </span>
                </div>

                <div className="flex flex-col items-center p-6 rounded-3xl liquid-glass-card min-w-30">
                  <span className="text-4xl font-black font-mono text-indigo-700 dark:text-indigo-400 mb-1">
                    <SlidingNumber value={scoreStats.accuracy} />%
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('accuracy')}
                  </span>
                </div>
              </div>

              {/* Digit-by-Digit Breakdown */}
              <div className="w-full max-w-md p-4 rounded-3xl liquid-glass-subtle">
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {numbers.map((num, i) => {
                    const isMatch = num === userInputArray[i];
                    return (
                      <div
                        key={i}
                        className={cn(
                          'flex items-center justify-between p-2 rounded-xl text-xs font-mono font-bold border',
                          isMatch
                            ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                            : 'border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400'
                        )}
                      >
                        <span>{num}</span>
                        <span className="opacity-50">→</span>
                        <span>{userInputArray[i] ?? '-'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Again Button */}
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

export default NumberTest;
