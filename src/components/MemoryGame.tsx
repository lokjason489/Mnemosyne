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

    // Grid size starts at 3x3, then expands with level
    const currentGridSize = Math.min(3 + Math.floor((lvl - 1) / 4), 6);
    setGridSize(currentGridSize);

    const totalCells = currentGridSize * currentGridSize;
    const newSequence: number[] = [];
    const seqLength = Math.min(2 + lvl, totalCells - 1); // sequence length increases with level

    // Ensure all cells in a single round are strictly UNIQUE (no duplicate blocks in the same round)
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

    // Light up block briefly on tap
    setActiveBlock(index);
    setTimeout(() => setActiveBlock(null), 200);

    const nextUserSeq = [...userSequence, index];
    setUserSequence(nextUserSeq);

    // Check if this step was correct immediately
    const currentIndexToCheck = nextUserSeq.length - 1;
    if (nextUserSeq[currentIndexToCheck] !== sequence[currentIndexToCheck]) {
      // Wrong move -> Game Over
      setGameState(GAME_STATE.GAME_OVER);
      return;
    }

    // If reached end of sequence -> Level up
    if (nextUserSeq.length === sequence.length) {
      setScore((prev) => prev + level * 15);
      const nextLvl = level + 1;
      setLevel(nextLvl);

      confetti({
        particleCount: 70,
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
      <GlowCard className="p-6 md:p-8" glowColor="rgba(245, 158, 11, 0.2)">
        <AnimatePresence mode="wait">
          {/* 1. START SCREEN */}
          {gameState === GAME_STATE.START && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-800 shadow-sm">
                <Grid3X3 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {t('MemoryGame')}
                </h2>
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium max-w-md">
                  Watch the glowing pattern and repeat the exact sequence of blocks.
                </p>
              </div>

              <TactileButton
                variant="primary"
                size="lg"
                onClick={handleStartGame}
                className="w-full max-w-xs mt-2 bg-linear-to-r from-amber-600 to-orange-600 hover:shadow-amber-500/30"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{t('start')}</span>
              </TactileButton>
            </motion.div>
          )}

          {/* 2. PLAYING / WAITING / SHOWING */}
          {(gameState === GAME_STATE.SHOWING || gameState === GAME_STATE.WAITING) && (
            <motion.div
              key="gameplay"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Stats Bar with High Contrast */}
              <div className="flex items-center justify-between w-full max-w-sm px-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-3.5 py-1.5 rounded-full border border-amber-300 dark:border-amber-800 shadow-sm">
                  <Flame className="w-3.5 h-3.5" />
                  <span>
                    {t('level')} <SlidingNumber value={level} />
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 shadow-sm">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    {t('Score')}: <SlidingNumber value={score} />
                  </span>
                </div>
              </div>

              {/* Status Hint with clear states */}
              <div className="text-xs font-bold uppercase tracking-wider flex items-center justify-center min-h-7">
                {gameState === GAME_STATE.SHOWING ? (
                  isPreparing ? (
                    <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800 animate-pulse">
                      <Sparkles className="w-4 h-4" />
                      <span>Get Ready...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold">
                      <Eye className="w-4 h-4" />
                      <span>Watch the Sequence...</span>
                    </span>
                  )
                ) : (
                  <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <Sparkles className="w-4 h-4" />
                    <span>
                      Repeat: {userSequence.length} / {sequence.length}
                    </span>
                  </span>
                )}
              </div>

              {/* Glowing Grid Blocks with Strong Contrast */}
              <div
                className="grid gap-2.5 w-full max-w-xs sm:max-w-sm aspect-square p-3 rounded-3xl bg-slate-200 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 shadow-xl"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                  const isIlluminated = activeBlock === index;
                  const isSelected = userSequence.includes(index);
                  return (
                    <motion.button
                      key={index}
                      whileTap={
                        gameState === GAME_STATE.WAITING && !isSelected
                          ? { scale: 0.92 }
                          : undefined
                      }
                      onClick={() => handleBlockClick(index)}
                      disabled={gameState !== GAME_STATE.WAITING || isSelected}
                      className={cn(
                        'rounded-2xl transition-all duration-150 aspect-square cursor-pointer border-2',
                        isIlluminated
                          ? 'bg-linear-to-tr from-amber-400 to-orange-500 border-amber-200 shadow-xl shadow-amber-500/70 scale-105 ring-4 ring-amber-400/50 z-10'
                          : isSelected
                            ? 'bg-linear-to-tr from-indigo-500 to-purple-600 border-indigo-400 text-white shadow-md shadow-indigo-500/30 scale-95'
                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50/40 dark:hover:bg-slate-750 shadow-sm'
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-400 shadow-lg shadow-emerald-500/20">
                <Sparkles className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-3xl font-black text-emerald-700 dark:text-emerald-400">
                  Level {level - 1} Cleared!
                </h3>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Current Score: {score} pts
                </p>
              </div>

              <TactileButton
                variant="success"
                size="lg"
                onClick={handleContinueNextLevel}
                className="w-full max-w-xs mt-2"
              >
                <span>Next Round</span>
                <ArrowRight className="w-5 h-5" />
              </TactileButton>
            </motion.div>
          )}

          {/* 4. GAME OVER */}
          {gameState === GAME_STATE.GAME_OVER && (
            <motion.div
              key="gameover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-rose-600 dark:text-rose-500">Game Over</h3>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  You reached Round {level} with a great memory performance!
                </p>
              </div>

              <div className="flex items-center gap-4 justify-center">
                <div className="flex flex-col items-center p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 min-w-30 shadow-sm">
                  <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
                    <SlidingNumber value={level} />
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1">
                    {t('level')}
                  </span>
                </div>

                <div className="flex flex-col items-center p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 min-w-30 shadow-sm">
                  <span className="text-3xl font-black text-amber-700 dark:text-amber-400">
                    <SlidingNumber value={score} />
                  </span>
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300 mt-1">
                    {t('Score')}
                  </span>
                </div>
              </div>

              <TactileButton
                variant="primary"
                size="lg"
                onClick={handleStartGame}
                className="w-full max-w-xs mt-2"
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

export default MemoryGame;
