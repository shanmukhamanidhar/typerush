import React, { useState, useCallback } from 'react';
import { GameModeType, GameDifficulty, GameResult, UserGameStats } from '../../types/game';
import { GameHub } from './GameHub';
import { FallingWordsGame } from './FallingWordsGame';
import { GameLeaderboardModal } from './GameLeaderboardModal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { validateGameSubmission } from '../../utils/gameEngine';

export const GameView: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<'hub' | 'playing'>('hub');
  const [activeMode, setActiveMode] = useState<GameModeType>('falling-words');
  const [activeDifficulty, setActiveDifficulty] = useState<GameDifficulty>('normal');
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);

  // Persistent User Game Stats
  const [gameStats, setGameStats] = useLocalStorage<UserGameStats>('typerush_game_stats', {
    gamesPlayed: 0,
    bestScore: 0,
    bestWpm: 0,
    bestAccuracy: 0,
    highestCombo: 0,
    totalWords: 0,
    totalXp: 0,
    longestSurvivalSeconds: 0,
    modeStats: {
      'falling-words': { bestScore: 0, gamesPlayed: 0, bestWpm: 0 },
      'time-attack': { bestScore: 0, gamesPlayed: 0, bestWpm: 0 },
      'survival': { bestScore: 0, gamesPlayed: 0, bestWpm: 0 },
      'zen': { bestScore: 0, gamesPlayed: 0, bestWpm: 0 },
    },
    history: [],
  });

  const handleLaunchGame = (mode: GameModeType, difficulty: GameDifficulty) => {
    setActiveMode(mode);
    setActiveDifficulty(difficulty);
    setActiveScreen('playing');
  };

  const handleFinishGame = useCallback((result: GameResult) => {
    // Validate score submission against anti-cheat bounds
    if (!validateGameSubmission(result)) {
      console.warn("Suspicious game submission rejected by anti-cheat validator.");
      return;
    }

    setGameStats(prev => {
      const modeKey = result.mode;
      const prevModeStats = prev.modeStats[modeKey] || { bestScore: 0, gamesPlayed: 0, bestWpm: 0 };

      return {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        bestScore: Math.max(prev.bestScore, result.score),
        bestWpm: Math.max(prev.bestWpm, result.wpm),
        bestAccuracy: Math.max(prev.bestAccuracy, result.accuracy),
        highestCombo: Math.max(prev.highestCombo, result.maxCombo),
        totalWords: prev.totalWords + result.wordsTyped,
        totalXp: prev.totalXp + result.xpEarned,
        longestSurvivalSeconds: Math.max(prev.longestSurvivalSeconds, result.timeSurvivedSeconds),
        modeStats: {
          ...prev.modeStats,
          [modeKey]: {
            gamesPlayed: prevModeStats.gamesPlayed + 1,
            bestScore: Math.max(prevModeStats.bestScore, result.score),
            bestWpm: Math.max(prevModeStats.bestWpm, result.wpm),
          },
        },
        history: [result, ...prev.history].slice(0, 50),
      };
    });
  }, [setGameStats]);

  return (
    <div className="w-full flex flex-col items-center">
      {activeScreen === 'hub' ? (
        <GameHub
          userStats={gameStats}
          onLaunchGame={handleLaunchGame}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        />
      ) : (
        <FallingWordsGame
          mode={activeMode}
          difficulty={activeDifficulty}
          highScore={gameStats.modeStats[activeMode]?.bestScore || 0}
          onFinishGame={handleFinishGame}
          onExit={() => setActiveScreen('hub')}
          onViewLeaderboard={() => setIsLeaderboardOpen(true)}
        />
      )}

      {/* Leaderboard Modal */}
      <GameLeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        userStats={gameStats}
        currentMode={activeMode}
      />
    </div>
  );
};
