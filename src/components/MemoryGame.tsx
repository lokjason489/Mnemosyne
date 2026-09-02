import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import './MemoryGame.css';

const GAME_STATE = {
  START: 'START',
  SHOWING: 'SHOWING',
  WAITING: 'WAITING',
  CHECKING: 'CHECKING',
  LEVEL_UP: 'LEVEL_UP',
  GAME_OVER: 'GAME_OVER',
};

const MemoryGame: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gridSize, setGridSize] = useState(3);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [gameState, setGameState] = useState(GAME_STATE.START);
  const [showingIndex, setShowingIndex] = useState(0);

  const startNextLevel = useCallback(() => {
    setGameState(GAME_STATE.SHOWING);
    setUserSequence([]);
    setShowingIndex(0);

    const currentGridSize = Math.min(3 + Math.floor((level - 1) / 5), 9);
    setGridSize(currentGridSize);

    const newSequence: number[] = [];
    while (newSequence.length < level) {
      const randomIndex = Math.floor(Math.random() * (currentGridSize * currentGridSize));
      if (!newSequence.includes(randomIndex)) {
        newSequence.push(randomIndex);
      }
    }
    setSequence(newSequence);
  }, [level]);

  useEffect(() => {
    if (gameState === GAME_STATE.SHOWING && showingIndex < sequence.length) {
      const timer = setTimeout(() => {
        setShowingIndex(showingIndex + 1);
      }, 500); // Show each block for 0.5 seconds
      return () => clearTimeout(timer);
    } else if (gameState === GAME_STATE.SHOWING && showingIndex >= sequence.length) {
      const timer = setTimeout(() => {
        setGameState(GAME_STATE.WAITING);
      }, 500);
      return () => clearTimeout(timer);
    }

    if (gameState === GAME_STATE.CHECKING) {
      const isCorrect =
        sequence.length === userSequence.length &&
        sequence.every((val, index) => val === userSequence[index]);

      if (isCorrect) {
        setScore(score + level * 10);
        setLevel(level + 1);
        setGameState(GAME_STATE.LEVEL_UP);
      } else {
        setGameState(GAME_STATE.GAME_OVER);
      }
    }
  }, [gameState, sequence, userSequence, level, score, showingIndex]);

  const handleBlockClick = (index: number) => {
    if (gameState !== GAME_STATE.WAITING || userSequence.includes(index)) {
      return;
    }

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    if (newUserSequence.length === sequence.length) {
      setGameState(GAME_STATE.CHECKING);
    }
  };

  const handleStartGame = () => {
    setLevel(1);
    setScore(0);
    startNextLevel();
  };

  const handleNextLevel = () => {
    startNextLevel();
  };

  const renderGrid = () => {
    const totalBlocks = gridSize * gridSize;
    return Array.from({ length: totalBlocks }).map((_, index) => {
      const isHighlighted =
        gameState === GAME_STATE.SHOWING && sequence[showingIndex] === index;
      const isSelected = userSequence.includes(index);
      let className = 'block';
      if (isHighlighted) className += ' highlighted';
      if (isSelected) className += ' selected';

      return (
        <div
          key={index}
          className={className}
          style={{
            backgroundColor: isHighlighted
              ? theme.palette.secondary.main
              : isSelected
              ? theme.palette.primary.main
              : theme.palette.background.paper,
            border: `2px solid ${theme.palette.primary.main}`,
          }}
          onClick={() => handleBlockClick(index)}
        />
      );
    });
  };

  return (
    <div className="memory-game-container" style={{ backgroundColor: theme.palette.background.default }}>
      <h2 style={{ color: theme.palette.text.primary }}>{t('MemoryGame')}</h2>
      <div className="stats" style={{ color: theme.palette.text.secondary }}>
        <span>{t('level')}: {level}</span>
        <span>{t('Score')}: {score}</span>
      </div>
      <div className="grid-container" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
        {renderGrid()}
      </div>
      {gameState === GAME_STATE.START && (
        <button onClick={handleStartGame} style={{ backgroundColor: theme.palette.primary.main, color: theme.palette.getContrastText(theme.palette.primary.main) }}>
          {t('start')}
        </button>
      )}
      {gameState === GAME_STATE.LEVEL_UP && (
        <div className="feedback">
          <p style={{ color: theme.palette.text.primary }}>{t('correct_Ans')}</p>
          <button onClick={handleNextLevel} style={{ backgroundColor: theme.palette.primary.main, color: theme.palette.getContrastText(theme.palette.primary.main) }}>
            {t('again')}
          </button>
        </div>
      )}
      {gameState === GAME_STATE.GAME_OVER && (
        <div className="feedback">
          <h3 style={{ color: theme.palette.error.main }}>{t('wrong_Ans')}</h3>
          <p style={{ color: theme.palette.text.secondary }}>
            Your final score: {score}
          </p>
          <button onClick={handleStartGame} style={{ backgroundColor: theme.palette.primary.main, color: theme.palette.getContrastText(theme.palette.primary.main) }}>
            {t('again')}
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
