import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { calculateWpm, calculateRawWpm, calculateAccuracy, calculateConsistency, calculateScore } from '../utils/typingMetrics';
import { 
  MetricSnapshot, 
  TestResult, 
  TestDuration, 
  WordCountOption, 
  Difficulty, 
  Category, 
  TestMode, 
  CodeLanguage, 
  KeyHeatmapItem 
} from '../types/typing';
import { soundEngine } from '../utils/audioSynth';
import { calculateSessionRating, analyzeWords, buildErrorAnalysis, generateSmartInsight } from '../utils/expandedAnalytics';

interface UseTypingEngineProps {
  passage: string;
  mode: TestMode;
  duration?: TestDuration;
  wordCount?: WordCountOption;
  difficulty: Difficulty;
  category: Category;
  language?: CodeLanguage;
  quoteAuthor?: string;
  pastHistory?: TestResult[];
  pauseOnBlur?: boolean;
  onFinish?: (result: TestResult) => void;
}

export function useTypingEngine({
  passage,
  mode,
  duration = 30,
  wordCount = 25,
  difficulty,
  category,
  language,
  quoteAuthor,
  pastHistory = [],
  pauseOnBlur = false,
  onFinish,
}: UseTypingEngineProps) {
  const [typedChars, setTypedChars] = useState<string>('');
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  // Real-time error counts
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  
  // Active key state for virtual keyboard animation
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isKeyError, setIsKeyError] = useState<boolean>(false);
  
  // Anti-cheat paste detection toast trigger
  const [pasteAttempted, setPasteAttempted] = useState<boolean>(false);

  // Time & Snapshot history
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const metricsHistoryRef = useRef<MetricSnapshot[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeAccumulatorRef = useRef<number>(0);
  const lastPauseStartRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const heatmapRef = useRef<Record<string, KeyHeatmapItem>>({});
  
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  // Cleanup on unmount or mode switch
  const resetEngine = useCallback((_newPassage?: string) => {
    setTypedChars('');
    setIsStarted(false);
    setIsFinished(false);
    setIsPaused(false);
    setTotalErrors(0);
    setStreak(0);
    setMaxStreak(0);
    setActiveKey(null);
    setIsKeyError(false);
    setPasteAttempted(false);
    setElapsedSeconds(0);
    metricsHistoryRef.current = [];
    startTimeRef.current = null;
    pausedTimeAccumulatorRef.current = 0;
    lastPauseStartRef.current = null;
    heatmapRef.current = {};
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Compute character breakdown
  const { correctCount, incorrectCount, charStatuses } = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    const statuses: ('correct' | 'incorrect' | 'current' | 'pending')[] = [];

    for (let i = 0; i < passage.length; i++) {
      if (i < typedChars.length) {
        if (typedChars[i] === passage[i]) {
          correct++;
          statuses.push('correct');
        } else {
          incorrect++;
          statuses.push('incorrect');
        }
      } else if (i === typedChars.length) {
        statuses.push('current');
      } else {
        statuses.push('pending');
      }
    }

    return { correctCount: correct, incorrectCount: incorrect, charStatuses: statuses };
  }, [passage, typedChars]);

  // Words completed calculation
  const wordsCompleted = useMemo(() => {
    if (!typedChars.trim()) return 0;
    return typedChars.trim().split(/\s+/).filter(Boolean).length;
  }, [typedChars]);

  // Real-time stats
  const wpm = useMemo(() => calculateWpm(correctCount, elapsedSeconds), [correctCount, elapsedSeconds]);
  const rawWpm = useMemo(() => calculateRawWpm(typedChars.length, elapsedSeconds), [typedChars.length, elapsedSeconds]);
  const accuracy = useMemo(() => calculateAccuracy(correctCount, typedChars.length), [correctCount, typedChars.length]);
  
  // Progress calculation based on mode
  const progress = useMemo(() => {
    if (mode === 'words') {
      return Math.min(100, Math.round((wordsCompleted / wordCount) * 100));
    }
    if (passage.length === 0) return 0;
    return Math.min(100, Math.round((typedChars.length / passage.length) * 100));
  }, [mode, wordsCompleted, wordCount, passage.length, typedChars.length]);

  // Expected next key
  const expectedChar = useMemo(() => {
    if (typedChars.length < passage.length) {
      return passage[typedChars.length];
    }
    return '';
  }, [passage, typedChars.length]);

  // Pause toggle
  const togglePause = useCallback((forceState?: boolean) => {
    if (!isStarted || isFinished) return;
    const nextPaused = forceState !== undefined ? forceState : !isPaused;
    setIsPaused(nextPaused);

    if (nextPaused) {
      lastPauseStartRef.current = Date.now();
    } else {
      if (lastPauseStartRef.current) {
        pausedTimeAccumulatorRef.current += (Date.now() - lastPauseStartRef.current);
        lastPauseStartRef.current = null;
      }
    }
  }, [isStarted, isFinished, isPaused]);

  // Tab / window blur handling
  useEffect(() => {
    if (!pauseOnBlur) return;
    const handleBlur = () => {
      if (isStarted && !isFinished && !isPaused) {
        togglePause(true);
      }
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [pauseOnBlur, isStarted, isFinished, isPaused, togglePause]);

  // Complete test logic
  const completeTest = useCallback(() => {
    if (isFinished) return;
    setIsFinished(true);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    soundEngine.playCompletion();

    const finalElapsed = Math.max(1, elapsedSeconds);
    const finalWpm = calculateWpm(correctCount, finalElapsed);
    const finalRawWpm = calculateRawWpm(typedChars.length, finalElapsed);
    const finalAccuracy = calculateAccuracy(correctCount, typedChars.length);
    const finalConsistency = calculateConsistency(metricsHistoryRef.current);
    const finalScore = calculateScore(finalWpm, finalAccuracy, finalConsistency, difficulty);
    const sessionRating = calculateSessionRating(finalWpm, finalAccuracy, finalConsistency);
    const wordAnalysis = analyzeWords(passage, typedChars, finalElapsed);
    const errorAnalysis = buildErrorAnalysis(heatmapRef.current, totalErrors, typedChars.length);
    const smartInsight = generateSmartInsight(
      { wpm: finalWpm, accuracy: finalAccuracy, errors: totalErrors, consistency: finalConsistency },
      pastHistory,
      errorAnalysis.mostMistypedKey?.key
    );

    const result: TestResult = {
      id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      mode,
      duration: mode === 'time' ? duration : undefined,
      wordCount: mode === 'words' ? wordCount : undefined,
      difficulty,
      category,
      language,
      quoteAuthor,
      wpm: finalWpm,
      rawWpm: finalRawWpm,
      accuracy: finalAccuracy,
      errors: totalErrors,
      correctChars: correctCount,
      incorrectChars: incorrectCount,
      totalChars: typedChars.length,
      score: finalScore,
      sessionRating,
      consistency: finalConsistency,
      metricsHistory: [...metricsHistoryRef.current],
      passageSnippet: passage.slice(0, 60) + '...',
      heatmap: { ...heatmapRef.current },
      wordAnalysis,
      errorAnalysis,
      smartInsight,
    };

    if (onFinishRef.current) {
      onFinishRef.current(result);
    }
  }, [
    isFinished,
    elapsedSeconds,
    correctCount,
    typedChars,
    difficulty,
    mode,
    duration,
    wordCount,
    category,
    language,
    quoteAuthor,
    totalErrors,
    incorrectCount,
    passage,
    pastHistory,
  ]);

  // Per-second sampler for live metrics & graph
  useEffect(() => {
    if (!isStarted || isFinished || isPaused) return;

    intervalRef.current = window.setInterval(() => {
      if (!startTimeRef.current) return;
      const totalPaused = pausedTimeAccumulatorRef.current;
      const currentElapsed = Math.floor((Date.now() - startTimeRef.current - totalPaused) / 1000);
      setElapsedSeconds(currentElapsed);

      // Auto-end for time-based mode
      if (mode === 'time' && currentElapsed >= duration) {
        completeTest();
        return;
      }

      // Record snapshot
      const currentWpm = calculateWpm(correctCount, currentElapsed);
      const currentRawWpm = calculateRawWpm(typedChars.length, currentElapsed);
      const currentAccuracy = calculateAccuracy(correctCount, typedChars.length);

      metricsHistoryRef.current.push({
        second: currentElapsed,
        wpm: currentWpm,
        rawWpm: currentRawWpm,
        accuracy: currentAccuracy,
        errors: totalErrors,
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isStarted, isFinished, isPaused, mode, duration, correctCount, typedChars.length, totalErrors, completeTest]);

  // Handle keystroke input
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isFinished || isPaused) return;

    const key = e.key;

    // Ignore modifier and navigation keys except Backspace and Enter
    if (key === 'Tab' || key === 'Alt' || key === 'Control' || key === 'Meta' || key === 'Escape' || key === 'CapsLock' || key === 'Shift') {
      return;
    }

    // Start timer on first valid keystroke
    if (!isStarted) {
      setIsStarted(true);
      startTimeRef.current = Date.now();
    }

    // Virtual keyboard key visual trigger
    setActiveKey(key);
    setTimeout(() => setActiveKey(null), 140);

    if (key === 'Backspace') {
      e.preventDefault();
      if (typedChars.length > 0) {
        setTypedChars(prev => prev.slice(0, -1));
        soundEngine.playKeyPress(false);
      }
      return;
    }

    // Enter in code mode translates to newline \n
    const charToCompare = key === 'Enter' ? '\n' : key;

    // Only process single characters or Enter newline
    if (charToCompare.length === 1) {
      e.preventDefault();

      if (typedChars.length >= passage.length) {
        completeTest();
        return;
      }

      const nextTargetChar = passage[typedChars.length];
      const isCorrect = charToCompare === nextTargetChar;

      // Heatmap tracking
      const targetLower = nextTargetChar.toLowerCase();
      if (!heatmapRef.current[targetLower]) {
        heatmapRef.current[targetLower] = { key: targetLower, typed: 0, correct: 0, errors: 0, mistakesTo: {} };
      }
      heatmapRef.current[targetLower].typed++;

      if (isCorrect) {
        heatmapRef.current[targetLower].correct++;
        soundEngine.playKeyPress(charToCompare === ' ' || charToCompare === '\n');
        setIsKeyError(false);
        setStreak(prev => {
          const next = prev + 1;
          setMaxStreak(m => Math.max(m, next));
          return next;
        });
      } else {
        heatmapRef.current[targetLower].errors++;
        const pressedLower = charToCompare.toLowerCase();
        heatmapRef.current[targetLower].mistakesTo[pressedLower] = (heatmapRef.current[targetLower].mistakesTo[pressedLower] || 0) + 1;

        soundEngine.playError();
        setIsKeyError(true);
        setTimeout(() => setIsKeyError(false), 200);
        setTotalErrors(err => err + 1);
        setStreak(0);
      }

      const nextTyped = typedChars + charToCompare;
      setTypedChars(nextTyped);

      // Check for Word Mode completion
      if (mode === 'words') {
        const wordsNow = nextTyped.trim().split(/\s+/).filter(Boolean).length;
        if (wordsNow >= wordCount) {
          setTimeout(() => completeTest(), 50);
          return;
        }
      }

      // Check for passage end
      if (nextTyped.length === passage.length) {
        setTimeout(() => completeTest(), 50);
      }
    }
  }, [isFinished, isPaused, isStarted, typedChars, passage, completeTest, mode, wordCount]);

  // Anti-cheat: prevent paste
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    setPasteAttempted(true);
    setTimeout(() => setPasteAttempted(false), 3000);
  }, []);

  return {
    typedChars,
    charStatuses,
    wpm,
    rawWpm,
    accuracy,
    progress,
    wordsCompleted,
    totalErrors,
    streak,
    maxStreak,
    isStarted,
    isFinished,
    isPaused,
    elapsedSeconds,
    activeKey,
    isKeyError,
    expectedChar,
    pasteAttempted,
    metricsHistory: metricsHistoryRef.current,
    heatmap: heatmapRef.current,
    handleKeyDown,
    handlePaste,
    togglePause,
    completeTest,
    resetEngine,
  };
}
