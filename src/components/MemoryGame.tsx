import confetti from 'canvas-confetti';
import { ArrowRight, Eye, Flame, Grid3X3, Play, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';
import { GlowCard } from './ui/GlowCard';
import { SlidingNumber } from './ui/SlidingNumber';
import { TactileButton } from './ui/TactileButton';

const GAME_STATE = {
  START: 'START',
  SHOWING: 'SHOWING',
  WAITING: 'WAITING',
  CHECKING: 'CHECKING',
  LEVEL_UP: 'LEVEL_UP',
  GAME_OVER: 'GAME_OVER',
} as const;

type GameStateType = (typeof GAME_STATE)[keyof typeof GAME_STATE];

export const MemoryGame: React.FC = () => {
  const { t } = useTranslation();
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gridSize, setGridSize] = useState(3);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [gameState, setGameState] = useState<GameStateType>(GAME_STATE.START);
  const [showingIndex, setShowingIndex] = useState(0);
  const [activeBlock, setActiveBlock] = useState<number | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);

  const startNextLevel = useCallback((lvl: number) => {
    setUserSequence([]);
    setShowingIndex(0);
    setActiveBlock(null);

    // Grid size starts at 3x3, expands with level
    const currentGridSize = Math.min(3 + Math.floor((lvl - 1) / 4), 6);
    setGridSize(currentGridSize);

    const totalCells = currentGridSize * currentGridSize;
    const newSequence: number[] = [];
    const seqLength = Math.min(2 + lvl, totalCells - 1);

    while (newSequence.length < seqLength) {
      const randomIndex = Math.floor(Math.random() * totalCells);
      if (!newSequence.includes(randomIndex)) {
        newSequence.push(randomIndex);
      }
    }

    setSequence(newSequence);
    setGameState(GAME_STATE.SHOWING);
    setIsPreparing(true);
  }, []);

  // Handle preparation delay before flashing the first block
  useEffect(() => {
    if (gameState === GAME_STATE.SHOWING && isPreparing) {
      const prepTimer = setTimeout(() => {
        setIsPreparing(false);
      }, 1000); // 1-second preparation buffer

      return () => clearTimeout(prepTimer);
    }
  }, [gameState, isPreparing]);

  // Play sequence during SHOWING phase after preparation
  useEffect(() => {
    if (gameState === GAME_STATE.SHOWING && !isPreparing) {
      if (showingIndex < sequence.length) {
        setActiveBlock(sequence[showingIndex]);
        const onTimer = setTimeout(() => {
          setActiveBlock(null);
          const offTimer = setTimeout(() => {
            setShowingIndex((prev) => prev + 1);
          }, 250); // Pause between blocks
          return () => clearTimeout(offTimer);
        }, 550); // Illumination duration

        return () => clearTimeout(onTimer);
      }

      // Finished showing sequence
      const waitTimer = setTimeout(() => {
        setActiveBlock(null);
        setGameState(GAME_STATE.WAITING);
      }, 300);
      return () => clearTimeout(waitTimer);
    }
  }, [gameState, isPreparing, showingIndex, sequence]);

  // Handle block clicking by user
  const handleBlockClick = (index: number) => {
    if (gameState !== GAME_STATE.WAITING) return;
    if (userSequence.includes(index)) return; // Prevent double-clicking already selected cell

    setActiveBlock(index);
    setTimeout(() => setActiveBlock(null), 150);

    const nextUserSeq = [...userSequence, index];
    setUserSequence(nextUserSeq);

    // Check if this step was correct immediately
    const currentIndexToCheck = nextUserSeq.length - 1;
    if (nextUserSeq[currentIndexToCheck] !== sequence[currentIndexToCheck]) {
      setGameState(GAME_STATE.GAME_OVER);
      return;
    }

    // If reached end of sequence -> Level up
    if (nextUserSeq.length === sequence.length) {
      setScore((prev) => prev + level * 15);
      const nextLvl = level + 1;
      setLevel(nextLvl);

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });

      setGameState(GAME_STATE.LEVEL_UP);
    }
  };

  const handleStartGame = () => {
    setLevel(1);
    setScore(0);
    startNextLevel(1);
  };

  const handleContinueNextLevel = () => {
    startNextLevel(level);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <GlowCard className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          {/* 1. START SCREEN */}
          {gameState === GAME_STATE.START && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/30 dark:to-purple-500/30 text-indigo-600 dark:text-indigo-400 border border-white/60 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] backdrop-blur-md">
                <Grid3X3 className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl md:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                  {t('MemoryGame')}
                </h2>
                <p className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-300 max-w-md leading-relaxed">
                  {t('Memory_desc')}
                </p>
              </div>

              <TactileButton
                variant="primary"
                size="lg"
                onClick={handleStartGame}
                className="w-full max-w-xs mt-1"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t('start')}</span>
              </TactileButton>
            </motion.div>
          )}

          {/* 2. PLAYING / WAITING / SHOWING */}
          {(gameState === GAME_STATE.SHOWING || gameState === GAME_STATE.WAITING) && (
            <motion.div
              key="gameplay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Stats Bar */}
              <div className="flex items-center justify-between w-full max-w-sm px-1">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-900 dark:text-slate-200 liquid-glass-pill px-4 py-2 rounded-full">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    {t('level')} <SlidingNumber value={level} />
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-900 dark:text-slate-200 liquid-glass-pill px-4 py-2 rounded-full">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    {t('Score')}: <SlidingNumber value={score} />
                  </span>
                </div>
              </div>

              {/* Status Hint */}
              <div className="text-xs font-bold flex items-center justify-center min-h-7">
                {gameState === GAME_STATE.SHOWING ? (
                  isPreparing ? (
                    <span className="flex items-center gap-1.5 text-slate-900 dark:text-slate-200 liquid-glass-pill px-4 py-1.5 rounded-full">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>{t('Memory_get_ready')}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400 bg-indigo-500/15 dark:bg-indigo-500/25 backdrop-blur-xl px-4 py-1.5 rounded-full border border-indigo-500/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] animate-pulse">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t('Memory_watch')}</span>
                    </span>
                  )
                ) : (
                  <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 dark:bg-emerald-500/25 backdrop-blur-xl px-4 py-1.5 rounded-full border border-emerald-500/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {t('Memory_repeat')}: {userSequence.length} / {sequence.length}
                    </span>
                  </span>
                )}
              </div>

              {/* Liquid Glass Memory Grid */}
              <div
                className="grid gap-3 w-full max-w-xs sm:max-w-sm aspect-square p-4 rounded-3xl liquid-glass-card relative overflow-hidden"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                }}
              >
                {/* Specular top sheen */}
                <div className="absolute inset-x-6 top-0 h-[1.5px] bg-linear-to-r from-transparent via-white/90 dark:via-white/40 to-transparent pointer-events-none" />
                {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                  const isIlluminated = activeBlock === index;
                  const isSelected = userSequence.includes(index);
                  return (
                    <button
                      key={index}
                      onClick={() => handleBlockClick(index)}
                      disabled={gameState !== GAME_STATE.WAITING || isSelected}
                      className={cn(
                        'rounded-2xl transition-all duration-150 aspect-square cursor-pointer',
                        isIlluminated
                          ? 'bg-linear-to-br from-indigo-500 via-indigo-600 to-violet-600 border border-white/70 shadow-[0_0_30px_rgba(99,102,241,0.7),inset_0_1.5px_2px_rgba(255,255,255,0.9)] scale-102 ring-2 ring-indigo-400/50'
                          : isSelected
                            ? 'liquid-glass-pill scale-98'
                            : 'liquid-glass-subtle hover:brightness-105 active:scale-96'
                      )}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 3. LEVEL UP */}
          {gameState === GAME_STATE.LEVEL_UP && (
            <motion.div
              key="levelup"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-br from-emerald-500/20 to-teal-500/20 dark:from-emerald-500/30 dark:to-teal-500/30 text-emerald-600 dark:text-emerald-400 border border-white/60 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] backdrop-blur-md">
                <Sparkles className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-950 dark:text-white">
                  {t('Memory_level_cleared', { level: level - 1 })}
                </h3>
                <p className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-300">
                  {t('Memory_current_score', { score })}
                </p>
              </div>

              <TactileButton
                variant="primary"
                size="lg"
                onClick={handleContinueNextLevel}
                className="w-full max-w-xs mt-1"
              >
                <span>{t('Memory_next_round')}</span>
                <ArrowRight className="w-4 h-4" />
              </TactileButton>
            </motion.div>
          )}

          {/* 4. GAME OVER */}
          {gameState === GAME_STATE.GAME_OVER && (
            <motion.div
              key="gameover"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-950 dark:text-white">
                  {t('Memory_game_over')}
                </h3>
                <p className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-300">
                  {t('Memory_game_over_desc', { level })}
                </p>
              </div>

              <div className="flex items-center gap-4 justify-center">
                <div className="flex flex-col items-center p-6 rounded-3xl liquid-glass-card min-w-32">
                  <span className="text-4xl font-black font-mono text-slate-950 dark:text-white mb-1">
                    <SlidingNumber value={level} />
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('level')}
                  </span>
                </div>

                <div className="flex flex-col items-center p-6 rounded-3xl liquid-glass-card min-w-32">
                  <span className="text-4xl font-black font-mono text-indigo-700 dark:text-indigo-400 mb-1">
                    <SlidingNumber value={score} />
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('Score')}
                  </span>
                </div>
              </div>

              <TactileButton
                variant="secondary"
                size="lg"
                onClick={handleStartGame}
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

export default MemoryGame;
