import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  GameModeType, 
  GameDifficulty, 
  FallingWord, 
  GameResult, 
  GameHUDState, 
  PowerUpType 
} from '../../types/game';
import { GameHUD } from './GameHUD';
import { GameParticles, ParticleController } from './GameParticles';
import { GamePauseModal } from './GamePauseModal';
import { GameOverModal } from './GameOverModal';
import { 
  generateSpawnWord, 
  calculateWordPoints, 
  calculateXpEarned, 
  POWER_UP_CONFIG 
} from '../../utils/gameEngine';
import { soundEngine } from '../../utils/audioSynth';
import { calculateWpm, calculateAccuracy } from '../../utils/typingMetrics';
import { Zap, Shield, Snowflake, Flame, AlertCircle } from 'lucide-react';

interface FallingWordsGameProps {
  mode: GameModeType;
  difficulty: GameDifficulty;
  highScore: number;
  onFinishGame: (result: GameResult) => void;
  onExit: () => void;
  onViewLeaderboard: () => void;
}

export const FallingWordsGame: React.FC<FallingWordsGameProps> = ({
  mode,
  difficulty,
  highScore,
  onFinishGame,
  onExit,
  onViewLeaderboard,
}) => {
  const arenaRef = useRef<HTMLDivElement>(null);
  const particleRef = useRef<ParticleController>(null);

  // Core Game State
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [maxLives] = useState<number>(3);
  const [level, setLevel] = useState<number>(1);
  const [wordsTyped, setWordsTyped] = useState<number>(0);
  const [wordsMissed, setWordsMissed] = useState<number>(0);
  const [totalCharactersTyped, setTotalCharactersTyped] = useState<number>(0);
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(mode === 'time-attack' ? 60 : 0);

  // Active Words & Input
  const [activeWords, setActiveWords] = useState<FallingWord[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [activePowerUps, setActivePowerUps] = useState<Partial<Record<PowerUpType, number>>>({});

  // Modals & FX
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [shakeScreen, setShakeScreen] = useState<boolean>(false);
  const [levelUpNotification, setLevelUpNotification] = useState<number | null>(null);
  const [lastCompletedResult, setLastCompletedResult] = useState<GameResult | null>(null);

  // Timing refs for 60 FPS animation loop
  const lastTimeRef = useRef<number>(performance.now());
  const lastSpawnTimeRef = useRef<number>(performance.now());
  const animFrameRef = useRef<number | null>(null);

  // Mutable refs to prevent closure staleness in rAF loop
  const stateRef = useRef({
    activeWords: [] as FallingWord[],
    score: 0,
    combo: 0,
    maxCombo: 0,
    lives: 3,
    level: 1,
    wordsTyped: 0,
    wordsMissed: 0,
    totalCharactersTyped: 0,
    totalErrors: 0,
    timeElapsed: 0,
    timeRemaining: mode === 'time-attack' ? 60 : 0,
    activePowerUps: {} as Partial<Record<PowerUpType, number>>,
    isPaused: false,
    isGameOver: false,
  });

  // Sync state with mutable ref
  stateRef.current.activeWords = activeWords;
  stateRef.current.score = score;
  stateRef.current.combo = combo;
  stateRef.current.maxCombo = maxCombo;
  stateRef.current.lives = lives;
  stateRef.current.level = level;
  stateRef.current.wordsTyped = wordsTyped;
  stateRef.current.wordsMissed = wordsMissed;
  stateRef.current.totalCharactersTyped = totalCharactersTyped;
  stateRef.current.totalErrors = totalErrors;
  stateRef.current.timeElapsed = timeElapsed;
  stateRef.current.timeRemaining = timeRemaining;
  stateRef.current.activePowerUps = activePowerUps;
  stateRef.current.isPaused = isPaused;
  stateRef.current.isGameOver = isGameOver;

  // Real-time WPM & Accuracy calculations
  const wpm = calculateWpm(totalCharactersTyped, timeElapsed);
  const accuracy = calculateAccuracy(totalCharactersTyped, totalCharactersTyped + totalErrors);

  // Trigger Game Over
  const handleTriggerGameOver = useCallback(() => {
    if (stateRef.current.isGameOver) return;
    setIsGameOver(true);
    soundEngine.playGameOver();

    const finalScore = stateRef.current.score;
    const finalWords = stateRef.current.wordsTyped;
    const finalMaxCombo = stateRef.current.maxCombo;
    const finalLevel = stateRef.current.level;
    const finalTime = Math.max(1, stateRef.current.timeElapsed);
    const finalWpm = calculateWpm(stateRef.current.totalCharactersTyped, finalTime);
    const finalAcc = calculateAccuracy(
      stateRef.current.totalCharactersTyped,
      stateRef.current.totalCharactersTyped + stateRef.current.totalErrors
    );
    const xp = calculateXpEarned(finalScore, finalWords, finalMaxCombo, finalLevel);
    const isNewHigh = finalScore > highScore;

    const result: GameResult = {
      id: `game-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      mode,
      difficulty,
      score: finalScore,
      wpm: finalWpm,
      accuracy: finalAcc,
      maxCombo: finalMaxCombo,
      level: finalLevel,
      wordsTyped: finalWords,
      wordsMissed: stateRef.current.wordsMissed,
      timeSurvivedSeconds: finalTime,
      xpEarned: xp,
      isNewHighScore: isNewHigh,
    };

    setLastCompletedResult(result);
    onFinishGame(result);
  }, [highScore, mode, difficulty, onFinishGame]);

  // Restart active game session
  const handleRestart = useCallback(() => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(3);
    setLevel(1);
    setWordsTyped(0);
    setWordsMissed(0);
    setTotalCharactersTyped(0);
    setTotalErrors(0);
    setTimeElapsed(0);
    setTimeRemaining(mode === 'time-attack' ? 60 : 0);
    setActiveWords([]);
    setCurrentInput('');
    setActivePowerUps({});
    setIsPaused(false);
    setIsGameOver(false);
    setLastCompletedResult(null);
    lastTimeRef.current = performance.now();
    lastSpawnTimeRef.current = performance.now();
  }, [mode]);

  // Activate Power-Up
  const activatePowerUp = useCallback((type: PowerUpType) => {
    soundEngine.playPowerUp();
    const config = POWER_UP_CONFIG[type];

    if (type === 'clear') {
      // Clear all active words and give points
      setActiveWords(prev => {
        prev.forEach(w => {
          const pts = calculateWordPoints(w.word, combo, level, difficulty, !!activePowerUps.double);
          setScore(s => s + pts);
          setWordsTyped(wt => wt + 1);
        });
        return [];
      });
      return;
    }

    if (type === 'shield') {
      setLives(l => Math.min(3, l + 1));
      return;
    }

    if (type === 'timeBonus') {
      setTimeRemaining(tr => tr + 15);
      return;
    }

    // Timed power-ups (freeze, slow, double)
    setActivePowerUps(prev => ({
      ...prev,
      [type]: config.durationMs,
    }));
  }, [combo, level, difficulty, activePowerUps.double]);

  // Main 60 FPS RequestAnimationFrame Game Loop
  useEffect(() => {
    const loop = (currentTime: number) => {
      const dt = Math.min(0.1, (currentTime - lastTimeRef.current) / 1000);
      lastTimeRef.current = currentTime;

      if (!stateRef.current.isPaused && !stateRef.current.isGameOver) {
        // Update Time Elapsed
        setTimeElapsed(t => t + dt);

        if (mode === 'time-attack') {
          setTimeRemaining(prev => {
            const next = prev - dt;
            if (next <= 0) {
              handleTriggerGameOver();
              return 0;
            }
            return next;
          });
        }

        // Update Timed Power-Ups
        setActivePowerUps(prev => {
          const updated: Partial<Record<PowerUpType, number>> = {};
          let changed = false;
          for (const [k, remaining] of Object.entries(prev)) {
            if (remaining && remaining > 0) {
              const nextVal = remaining - (dt * 1000);
              if (nextVal > 0) {
                updated[k as PowerUpType] = nextVal;
              }
              changed = true;
            }
          }
          return changed ? updated : prev;
        });

        // Compute speed factor based on buffs
        const isFrozen = (stateRef.current.activePowerUps.freeze || 0) > 0;
        const isSlowed = (stateRef.current.activePowerUps.slow || 0) > 0;
        const speedFactor = isFrozen ? 0 : (isSlowed ? 0.5 : 1.0);

        // Update word vertical positions
        setActiveWords(prevWords => {
          const nextWords: FallingWord[] = [];
          let lifeLostInFrame = false;

          for (const word of prevWords) {
            const newY = word.y + (word.speed * speedFactor * dt);

            // Reached bottom threshold (90%)
            if (newY >= 90) {
              // Missed word hit the ground!
              if (mode !== 'zen' && mode !== 'time-attack') {
                lifeLostInFrame = true;
              }
              setWordsMissed(m => m + 1);
            } else {
              nextWords.push({ ...word, y: newY });
            }
          }

          if (lifeLostInFrame) {
            soundEngine.playLifeLost();
            setShakeScreen(true);
            setTimeout(() => setShakeScreen(false), 350);
            setCombo(0); // Combo broken

            setLives(prevLives => {
              const nextLives = prevLives - 1;
              if (nextLives <= 0) {
                setTimeout(() => handleTriggerGameOver(), 50);
              }
              return Math.max(0, nextLives);
            });
          }

          return nextWords;
        });

        // Word Spawner Check
        const maxWordsForLevel = Math.min(5, Math.floor(1 + stateRef.current.level * 0.45));
        const spawnIntervalMs = Math.max(1200, 3200 - stateRef.current.level * 220);

        if (
          stateRef.current.activeWords.length < maxWordsForLevel &&
          currentTime - lastSpawnTimeRef.current >= spawnIntervalMs
        ) {
          lastSpawnTimeRef.current = currentTime;
          const newWord = generateSpawnWord(
            stateRef.current.level,
            stateRef.current.activeWords,
            difficulty
          );
          setActiveWords(prev => [...prev, newWord]);
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [mode, difficulty, handleTriggerGameOver]);

  // Handle Keystrokes & Matching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsPaused(prev => !prev);
        return;
      }

      if (isPaused) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        setCurrentInput(prev => prev.slice(0, -1));
        soundEngine.playKeyPress(false);
        return;
      }

      // Clear input buffer on Enter
      if (e.key === 'Enter') {
        e.preventDefault();
        setCurrentInput('');
        return;
      }

      // Ignore modifiers
      if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta' || e.key === 'Tab' || e.key === 'CapsLock') {
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();
        const char = e.key.toLowerCase();
        const testInput = currentInput + char;

        // Check if any word starts with testInput
        const matchingWord = activeWords.find(w => w.word.toLowerCase() === testInput);

        if (matchingWord) {
          // COMPLETE MATCH DETONATION!
          soundEngine.playWordDetonate();
          setTotalCharactersTyped(c => c + matchingWord.word.length);
          const pointsEarned = calculateWordPoints(
            matchingWord.word,
            combo,
            level,
            difficulty,
            !!activePowerUps.double
          );

          setScore(s => s + pointsEarned);
          setWordsTyped(w => {
            const nextWords = w + 1;
            // Level up every 10 completed words
            if (nextWords % 10 === 0) {
              setLevel(l => {
                const nextLevel = l + 1;
                soundEngine.playLevelUp();
                setLevelUpNotification(nextLevel);
                setTimeout(() => setLevelUpNotification(null), 2500);
                return nextLevel;
              });
            }
            return nextWords;
          });

          // Combo progression
          const nextCombo = combo + 1;
          setCombo(nextCombo);
          setMaxCombo(m => Math.max(m, nextCombo));

          if (nextCombo === 10 || nextCombo === 25 || nextCombo === 50) {
            soundEngine.playComboMilestone(nextCombo);
          }

          // Trigger Particle burst at word coordinate
          if (arenaRef.current && particleRef.current) {
            const arenaRect = arenaRef.current.getBoundingClientRect();
            const px = (matchingWord.x / 100) * arenaRect.width;
            const py = (matchingWord.y / 100) * arenaRect.height;
            const color = matchingWord.isSpecial ? '#FF6E1A' : '#FF5A00';
            particleRef.current.triggerBurst(px, py, color, `+${pointsEarned} (x${nextCombo})`);
          }

          // Trigger special power-up if present
          if (matchingWord.isSpecial && matchingWord.powerUp) {
            activatePowerUp(matchingWord.powerUp);
          }

          // Remove word
          setActiveWords(prev => prev.filter(w => w.id !== matchingWord.id));
          setCurrentInput('');
        } else {
          // Check if any word prefix matches testInput
          const hasPrefixMatch = activeWords.some(w => w.word.toLowerCase().startsWith(testInput));

          if (hasPrefixMatch) {
            setCurrentInput(testInput);
            setTotalCharactersTyped(c => c + 1);
            soundEngine.playKeyPress(false);
          } else {
            // Check if currentInput was empty, maybe user started a new word
            const hasInitialMatch = activeWords.some(w => w.word.toLowerCase().startsWith(char));
            if (hasInitialMatch) {
              setCurrentInput(char);
              setTotalCharactersTyped(c => c + 1);
              soundEngine.playKeyPress(false);
            } else {
              // Miskey error
              soundEngine.playError();
              setTotalErrors(err => err + 1);
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isGameOver, 
    isPaused, 
    currentInput, 
    activeWords, 
    combo, 
    level, 
    difficulty, 
    activePowerUps.double, 
    activatePowerUp
  ]);

  const hudState: GameHUDState = {
    score,
    highScore,
    combo,
    maxCombo,
    lives,
    maxLives,
    level,
    wpm,
    accuracy,
    wordsTyped,
    wordsMissed,
    timeElapsed,
    timeRemaining,
    activePowerUps,
  };

  return (
    <div className={`relative w-full max-w-5xl mx-auto flex flex-col bg-white dark:bg-[#111111] rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-2xl overflow-hidden font-mono select-none ${
      shakeScreen ? 'animate-bounce' : ''
    }`}>
      
      {/* Game HUD */}
      <GameHUD
        state={hudState}
        mode={mode}
        onPause={() => setIsPaused(true)}
      />

      {/* Main Falling Words Arena */}
      <div 
        ref={arenaRef}
        className="relative w-full h-[520px] sm:h-[580px] bg-[#F7F7F7] dark:bg-black overflow-hidden cursor-default"
      >
        {/* Background Grid Lines & Horizon */}
        <div className="absolute inset-0 bg-pattern-grid opacity-20 pointer-events-none" />

        {/* Canvas Particle Overlay */}
        <GameParticles ref={particleRef} />

        {/* Level Up Announcement Banner */}
        {levelUpNotification !== null && (
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none animate-bounce">
            <div className="px-6 py-3 rounded-xl bg-black/80 dark:bg-black/90 border-2 border-[#FF5A00] text-[#FF5A00] backdrop-blur-md shadow-2xl flex items-center gap-2.5">
              <Zap className="w-6 h-6 text-[#FF5A00] fill-current" />
              <span className="text-xl font-black tracking-widest uppercase">
                LEVEL UP! LEVEL {levelUpNotification}
              </span>
            </div>
          </div>
        )}

        {/* Danger Warning Horizon Line at 90% */}
        <div className="absolute bottom-[10%] left-0 right-0 h-0.5 bg-[#FF3B5C]/30 border-b border-[#FF3B5C]/50 pointer-events-none flex items-center justify-between px-4 text-[9px] text-[#FF3B5C] font-bold uppercase tracking-widest">
          <span>DANGER HORIZON</span>
          <span>IMPACT LINE</span>
        </div>

        {/* Render Falling Words */}
        {activeWords.map((item) => {
          const isTargeted = currentInput.length > 0 && item.word.toLowerCase().startsWith(currentInput);
          const typedLen = isTargeted ? currentInput.length : 0;
          const typedPart = item.word.slice(0, typedLen);
          const remainingPart = item.word.slice(typedLen);

          let borderStyle = isTargeted 
            ? 'border-2 border-[#FF5A00] ring-2 ring-[#FF5A00]/30 bg-white/95 dark:bg-[#111111]/95 shadow-lg shadow-[#FF5A00]/20 scale-105' 
            : 'border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white/90 dark:bg-[#080808]/90 shadow-sm';

          if (item.isSpecial) {
            borderStyle += ' border-[#FF6E1A] ring-1 ring-[#FF6E1A]/40 bg-[#FF6E1A]/10 shadow-[#FF6E1A]/20';
          }

          return (
            <div
              key={item.id}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute px-3 py-1.5 rounded-lg transition-all duration-75 select-none pointer-events-none flex items-center gap-1.5 ${borderStyle}`}
            >
              {item.isSpecial && item.powerUp && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#FF6E1A]/20 text-[#FF6E1A] border border-[#FF6E1A]/40 uppercase">
                  {POWER_UP_CONFIG[item.powerUp].label}
                </span>
              )}

              <span className="text-sm font-bold tracking-wider">
                <span className="text-[#FF5A00] font-black">
                  {typedPart}
                </span>
                <span className="text-[#111111] dark:text-white">
                  {remainingPart}
                </span>
              </span>
            </div>
          );
        })}

        {/* Bottom Interactive Typing Display */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-20">
          <div className="bg-white/95 dark:bg-[#080808]/95 border-2 border-[#FF5A00]/60 rounded-xl p-3 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#666666] dark:text-[#71717A] uppercase font-bold tracking-wider">
                INPUT:
              </span>
              <span className="text-lg font-black text-[#FF5A00] min-h-[28px] tracking-wide">
                {currentInput}
                <span className="inline-block w-2 h-5 bg-[#FF5A00] animate-pulse ml-0.5 align-middle" />
              </span>
            </div>

            <span className="text-[10px] text-[#666666] dark:text-[#71717A] font-sans hidden sm:inline">
              ESC to pause · ENTER to clear
            </span>
          </div>
        </div>

      </div>

      {/* Game Pause Modal */}
      <GamePauseModal
        isOpen={isPaused}
        state={hudState}
        onResume={() => setIsPaused(false)}
        onRestart={handleRestart}
        onExit={onExit}
      />

      {/* Game Over Modal */}
      {lastCompletedResult && (
        <GameOverModal
          isOpen={isGameOver}
          result={lastCompletedResult}
          onPlayAgain={handleRestart}
          onViewLeaderboard={onViewLeaderboard}
          onExit={onExit}
        />
      )}

    </div>
  );
};
