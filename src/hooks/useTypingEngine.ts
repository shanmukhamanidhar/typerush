import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { calculateWpm, calculateRawWpm, calculateAccuracy, calculateConsistency, calculateScore } from '../utils/typingMetrics';
import { 
  MetricSnapshot, 
  TestResult, 
  Difficulty, 
  DifficultyRule,
  Category, 
  TestMode, 
  CodeLanguage, 
  KeyHeatmapItem,
  LanguageCode,
  WordSetSize,
  StopOnError,
  QuoteLength,
  CharacterBreakdown,
  BurstSpeed
} from '../types/typing';
import { calculateSessionRating, analyzeWords, buildErrorAnalysis, generateSmartInsight } from '../utils/expandedAnalytics';
import { recordTestWeaknesses } from '../data/practiceEngine';
import { generateConfiguredPassage } from '../data/languages';
import { soundEngine } from '../utils/audioSynth';

interface UseTypingEngineProps {
  passage: string;
  mode: TestMode;
  duration?: number;
  wordCount?: number;
  difficulty: Difficulty;
  difficultyRule?: DifficultyRule;
  category: Category;
  language?: CodeLanguage;
  dictLanguage?: LanguageCode;
  wordSet?: WordSetSize;
  punctuation?: boolean;
  numbers?: boolean;
  quoteAuthor?: string;
  quoteLength?: QuoteLength;
  pastHistory?: TestResult[];
  pauseOnBlur?: boolean;
  // Advanced Rules
  confidenceMode?: boolean;
  stopOnError?: StopOnError;
  freedomMode?: boolean;
  strictSpace?: boolean;
  quickEnd?: boolean;
  blindMode?: boolean;
  // Conditions
  minWpm?: number;
  minAccuracy?: number;
  // Pace Caret
  paceWpm?: number;
  activeTags?: string[];
  onFinish?: (result: TestResult) => void;
  onFail?: (reason: string) => void;
}

export function useTypingEngine({
  passage: initialPassage,
  mode,
  duration = 30,
  wordCount = 25,
  difficulty,
  difficultyRule = 'normal',
  category,
  language,
  dictLanguage = 'en',
  wordSet = 200,
  punctuation = false,
  numbers = false,
  quoteAuthor,
  quoteLength,
  pastHistory = [],
  pauseOnBlur = false,
  confidenceMode = false,
  stopOnError = 'off',
  freedomMode = false,
  strictSpace = false,
  quickEnd = true,
  blindMode = false,
  minWpm = 0,
  minAccuracy = 0,
  paceWpm = 0,
  activeTags = [],
  onFinish,
  onFail,
}: UseTypingEngineProps) {
  const [passage, setPassage] = useState<string>(initialPassage);
  const [typedChars, setTypedChars] = useState<string>('');
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [failedReason, setFailedReason] = useState<string | null>(null);
  
  // Real-time error counts & streaks
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [extraChars, setExtraChars] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  
  // Active key state for virtual keyboard animation
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isKeyError, setIsKeyError] = useState<boolean>(false);
  const [capsLockActive, setCapsLockActive] = useState<boolean>(false);
  
  // Anti-cheat paste detection toast trigger
  const [pasteAttempted, setPasteAttempted] = useState<boolean>(false);

  // Time & Snapshot history
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const metricsHistoryRef = useRef<MetricSnapshot[]>([]);
  const burstSamplesRef = useRef<number[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeAccumulatorRef = useRef<number>(0);
  const lastPauseStartRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const heatmapRef = useRef<Record<string, KeyHeatmapItem>>({});
  
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;
  const onFailRef = useRef(onFail);
  onFailRef.current = onFail;

  // Latest refs to decouple timer interval and callbacks from keystroke renders
  const correctCountRef = useRef<number>(0);
  const incorrectCountRef = useRef<number>(0);
  const typedCharsRef = useRef<string>('');
  const totalErrorsRef = useRef<number>(0);
  const extraCharsRef = useRef<number>(0);
  const passageRef = useRef<string>(initialPassage);
  const durationRef = useRef<number>(duration);
  durationRef.current = duration;
  const modeRef = useRef<TestMode>(mode);
  modeRef.current = mode;
  const minWpmRef = useRef<number>(minWpm);
  minWpmRef.current = minWpm;
  const minAccuracyRef = useRef<number>(minAccuracy);
  minAccuracyRef.current = minAccuracy;

  // Sync initial passage when prop changes
  useEffect(() => {
    setPassage(initialPassage);
  }, [initialPassage]);

  // Cleanup on unmount or mode switch
  const resetEngine = useCallback((newPassage?: string) => {
    if (newPassage) {
      setPassage(newPassage);
    }
    setTypedChars('');
    setIsStarted(false);
    setIsFinished(false);
    setIsPaused(false);
    setIsFailed(false);
    setFailedReason(null);
    setTotalErrors(0);
    setExtraChars(0);
    setStreak(0);
    setMaxStreak(0);
    setActiveKey(null);
    setIsKeyError(false);
    setPasteAttempted(false);
    setElapsedSeconds(0);
    metricsHistoryRef.current = [];
    burstSamplesRef.current = [];
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

  // Keep latest refs in sync for timer interval and completion logic
  correctCountRef.current = correctCount;
  incorrectCountRef.current = incorrectCount;
  typedCharsRef.current = typedChars;
  totalErrorsRef.current = totalErrors;
  extraCharsRef.current = extraChars;
  passageRef.current = passage;

  // Words completed calculation
  const wordsCompleted = useMemo(() => {
    if (!typedChars.trim()) return 0;
    return typedChars.trim().split(/\s+/).filter(Boolean).length;
  }, [typedChars]);

  // Real-time stats
  const wpm = useMemo(() => {
    if (!isStarted || elapsedSeconds <= 0 || correctCount <= 0) return 0;
    return calculateWpm(correctCount, elapsedSeconds);
  }, [isStarted, correctCount, elapsedSeconds]);

  const rawWpm = useMemo(() => {
    if (!isStarted || elapsedSeconds <= 0 || typedChars.length <= 0) return 0;
    return calculateRawWpm(typedChars.length, elapsedSeconds);
  }, [isStarted, typedChars.length, elapsedSeconds]);

  const accuracy = useMemo(() => {
    if (!isStarted || typedChars.length <= 0) return 0;
    return calculateAccuracy(correctCount, typedChars.length);
  }, [isStarted, correctCount, typedChars.length]);
  
  // Pace Caret character position
  const paceCharIndex = useMemo(() => {
    if (!paceWpm || paceWpm <= 0 || elapsedSeconds <= 0) return -1;
    const targetChars = (paceWpm * 5 / 60) * elapsedSeconds;
    return Math.min(passage.length, Math.floor(targetChars));
  }, [paceWpm, elapsedSeconds, passage.length]);

  // Progress calculation based on mode
  const progress = useMemo(() => {
    if (mode === 'zen') {
      return 100; // Zen mode is infinite
    }
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
    if (!isStarted || isFinished || isFailed) return;
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
  }, [isStarted, isFinished, isFailed, isPaused]);

  // Tab / window blur handling
  useEffect(() => {
    if (!pauseOnBlur) return;
    const handleBlur = () => {
      if (isStarted && !isFinished && !isPaused && !isFailed) {
        togglePause(true);
      }
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [pauseOnBlur, isStarted, isFinished, isPaused, isFailed, togglePause]);

  // Trigger test early failure (e.g. Master/Expert mode or min thresholds)
  const failTest = useCallback((reason: string) => {
    if (isFinished || isFailed) return;
    setIsFailed(true);
    setFailedReason(reason);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    recordTestWeaknesses(passage, typedChars);

    if (onFailRef.current) {
      onFailRef.current(reason);
    }
  }, [isFinished, isFailed, passage, typedChars]);

  // Complete test logic
  const completeTest = useCallback(() => {
    if (isFinished || isFailed) return;
    setIsFinished(true);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const currPassage = passageRef.current;
    const currTyped = typedCharsRef.current;
    const currCorrect = correctCountRef.current;
    const currIncorrect = incorrectCountRef.current;
    const currErrors = totalErrorsRef.current;
    const currExtra = extraCharsRef.current;

    // Record weaknesses automatically into local drill bank
    recordTestWeaknesses(currPassage, currTyped);

    const totalPaused = pausedTimeAccumulatorRef.current;
    const exactElapsed = startTimeRef.current 
      ? Math.max(1, (Date.now() - startTimeRef.current - totalPaused) / 1000)
      : Math.max(1, elapsedSeconds);

    const finalWpm = calculateWpm(currCorrect, exactElapsed);
    const finalRawWpm = calculateRawWpm(currTyped.length, exactElapsed);
    const finalAccuracy = calculateAccuracy(currCorrect, currTyped.length);
    const finalConsistency = calculateConsistency(metricsHistoryRef.current);
    const finalScore = calculateScore(finalWpm, finalAccuracy, finalConsistency, difficulty);
    const sessionRating = calculateSessionRating(finalWpm, finalAccuracy, finalConsistency);
    const wordAnalysis = analyzeWords(currPassage, currTyped, exactElapsed);
    const errorAnalysis = buildErrorAnalysis(heatmapRef.current, currErrors, currTyped.length);
    const smartInsight = generateSmartInsight(
      { wpm: finalWpm, accuracy: finalAccuracy, errors: currErrors, consistency: finalConsistency },
      pastHistory,
      errorAnalysis.mostMistypedKey?.key
    );

    // Burst speed metrics - realistic human performance
    const validBurstValues = burstSamplesRef.current.filter(v => v > 0);
    const samplesToUse = validBurstValues.length > 0 ? validBurstValues : [finalWpm];
    const peakWpm = Math.max(...samplesToUse, finalWpm);
    const avgBurstWpm = Math.round(samplesToUse.reduce((a, b) => a + b, 0) / samplesToUse.length);
    const burstSpeed: BurstSpeed = { peakWpm, avgBurstWpm };

    // Missed characters calculation
    const missedChars = Math.max(0, currPassage.length - currTyped.length);
    const characterBreakdown: CharacterBreakdown = {
      correct: currCorrect,
      incorrect: currIncorrect,
      extra: currExtra,
      missed: missedChars,
    };

    // Ensure metricsHistory always has rich speed samples across the test duration for graph
    const finalSec = Math.max(1, Math.round(exactElapsed));
    if (metricsHistoryRef.current.length === 0) {
      metricsHistoryRef.current.push({
        second: 0,
        wpm: 0,
        rawWpm: 0,
        accuracy: 100,
        errors: 0,
      });
      metricsHistoryRef.current.push({
        second: finalSec,
        wpm: finalWpm,
        rawWpm: finalRawWpm,
        accuracy: finalAccuracy,
        errors: currErrors,
      });
    } else {
      const lastPoint = metricsHistoryRef.current[metricsHistoryRef.current.length - 1];
      if (lastPoint.second < finalSec) {
        metricsHistoryRef.current.push({
          second: finalSec,
          wpm: finalWpm,
          rawWpm: finalRawWpm,
          accuracy: finalAccuracy,
          errors: currErrors,
        });
      }
    }

    soundEngine.playCompletion();

    const result: TestResult = {
      id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      mode,
      duration: mode === 'time' ? duration : finalSec,
      wordCount: mode === 'words' ? wordCount : undefined,
      difficulty,
      difficultyRule,
      category,
      language,
      dictLanguage,
      wordSet,
      punctuationEnabled: punctuation,
      numbersEnabled: numbers,
      quoteAuthor,
      quoteLength,
      wpm: finalWpm,
      rawWpm: finalRawWpm,
      accuracy: finalAccuracy,
      errors: currErrors,
      correctChars: currCorrect,
      incorrectChars: currIncorrect,
      totalChars: currTyped.length,
      characterBreakdown,
      burstSpeed,
      score: finalScore,
      sessionRating,
      consistency: finalConsistency,
      metricsHistory: [...metricsHistoryRef.current],
      passageSnippet: currPassage.slice(0, 60) + '...',
      heatmap: { ...heatmapRef.current },
      wordAnalysis,
      errorAnalysis,
      smartInsight,
      tags: [...activeTags],
      isFailed: false,
    };

    if (onFinishRef.current) {
      onFinishRef.current(result);
    }
  }, [
    isFinished,
    isFailed,
    difficulty,
    difficultyRule,
    mode,
    duration,
    wordCount,
    category,
    language,
    dictLanguage,
    wordSet,
    punctuation,
    numbers,
    quoteAuthor,
    quoteLength,
    pastHistory,
    activeTags,
  ]);

  const completeTestRef = useRef(completeTest);
  completeTestRef.current = completeTest;
  const failTestRef = useRef(failTest);
  failTestRef.current = failTest;

  // Per-second sampler for live metrics & graph with stable 100ms timer tick
  useEffect(() => {
    if (!isStarted || isFinished || isPaused || isFailed) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    let lastSampleSecond = 0;
    let lastTypedCount = typedCharsRef.current.length;

    intervalRef.current = window.setInterval(() => {
      if (!startTimeRef.current) return;
      const totalPaused = pausedTimeAccumulatorRef.current;
      const exactElapsedSec = (Date.now() - startTimeRef.current - totalPaused) / 1000;
      const currentElapsed = Math.floor(exactElapsedSec);
      setElapsedSeconds(currentElapsed);

      // Auto-end for time-based mode
      if (modeRef.current === 'time' && exactElapsedSec >= durationRef.current) {
        completeTestRef.current();
        return;
      }

      // Record snapshot once per integer second
      if (currentElapsed > lastSampleSecond && currentElapsed > 0) {
        lastSampleSecond = currentElapsed;
        const currentTyped = typedCharsRef.current;
        const currentCorrect = correctCountRef.current;
        const currentErrors = totalErrorsRef.current;

        const currentWpm = calculateWpm(currentCorrect, currentElapsed);
        const currentRawWpm = calculateRawWpm(currentTyped.length, currentElapsed);
        const currentAccuracy = calculateAccuracy(currentCorrect, currentTyped.length);

        // 1-second burst speed calculation
        const charsInLastSecond = Math.max(0, currentTyped.length - lastTypedCount);
        lastTypedCount = currentTyped.length;
        const rawBurst = Math.round((charsInLastSecond / 5) * 60);
        // Clamped to realistic human upper limit (<= 200)
        const burstWpmNow = Math.min(200, rawBurst);
        if (burstWpmNow > 0) {
          burstSamplesRef.current.push(burstWpmNow);
        }

        metricsHistoryRef.current.push({
          second: currentElapsed,
          wpm: currentWpm,
          rawWpm: currentRawWpm,
          accuracy: currentAccuracy,
          errors: currentErrors,
        });

        // Minimum performance condition checks
        if (minWpmRef.current > 0 && currentElapsed >= 5 && currentWpm < minWpmRef.current) {
          failTestRef.current(`Pace fell below minimum requirement (${minWpmRef.current} WPM)`);
          return;
        }

        if (minAccuracyRef.current > 0 && currentTyped.length >= 10 && currentAccuracy < minAccuracyRef.current) {
          failTestRef.current(`Accuracy fell below minimum threshold (${minAccuracyRef.current}%)`);
          return;
        }
      }
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    isStarted, 
    isFinished, 
    isPaused, 
    isFailed
  ]);

  // Handle keystroke input
  // Process backspace (used by both hardware keys and mobile virtual keyboards)
  const handleBackspace = useCallback(() => {
    if (isFinished || isPaused || isFailed) return;
    if (confidenceMode) return;

    if (typedCharsRef.current.length > 0) {
      setTypedChars(prev => prev.slice(0, -1));
    }
  }, [isFinished, isPaused, isFailed, confidenceMode]);

  // Process single character entry (used by both hardware keys and mobile virtual keyboards)
  const handleInputChar = useCallback((charToCompare: string) => {
    if (isFinished || isPaused || isFailed) return;
    if (charToCompare.length !== 1) return;

    // Start timer on first valid character
    if (!isStarted) {
      setIsStarted(true);
      startTimeRef.current = Date.now();
    }

    // Sound and visual reaction
    soundEngine.playKeyPress(charToCompare === ' ');
    setActiveKey(charToCompare);
    setTimeout(() => setActiveKey(null), 140);

    const currPassage = passageRef.current;
    const currTyped = typedCharsRef.current;

    // Buffer wrap / append
    if (currTyped.length >= currPassage.length) {
      if (modeRef.current === 'zen' || modeRef.current === 'time') {
        const nextSegment = ' ' + generateConfiguredPassage({
          language: dictLanguage,
          wordSetSize: wordSet,
          wordCount: 25,
          punctuation,
          numbers
        });
        setPassage(prev => prev + nextSegment);
      } else {
        completeTestRef.current();
        return;
      }
    }

    const nextTargetChar = currPassage[currTyped.length];
    const isCorrect = charToCompare === nextTargetChar;

    // STOP ON ERROR: LETTER
    if (stopOnError === 'letter' && !isCorrect) {
      setIsKeyError(true);
      setTimeout(() => setIsKeyError(false), 200);
      setTotalErrors(err => err + 1);
      setStreak(0);
      return;
    }

    // STOP ON ERROR: WORD
    if (stopOnError === 'word' && charToCompare === ' ') {
      const lastSpaceIndex = currTyped.lastIndexOf(' ');
      const currentWordStart = lastSpaceIndex === -1 ? 0 : lastSpaceIndex + 1;
      const currentTypedWord = currTyped.slice(currentWordStart);
      const currentTargetWord = currPassage.slice(currentWordStart, currTyped.length);
      if (currentTypedWord !== currentTargetWord) {
        setIsKeyError(true);
        setTimeout(() => setIsKeyError(false), 200);
        return;
      }
    }

    // STRICT SPACE
    if (strictSpace && charToCompare === ' ' && nextTargetChar !== ' ') {
      return;
    }

    // DIFFICULTY RULE: MASTER
    if (difficultyRule === 'master' && !isCorrect) {
      failTestRef.current('Master Mode: Single miskey detected');
      return;
    }

    // DIFFICULTY RULE: EXPERT
    if (difficultyRule === 'expert' && charToCompare === ' ') {
      const lastSpaceIndex = currTyped.lastIndexOf(' ');
      const currentWordStart = lastSpaceIndex === -1 ? 0 : lastSpaceIndex + 1;
      const currentTypedWord = currTyped.slice(currentWordStart);
      const currentTargetWord = currPassage.slice(currentWordStart, currTyped.length);
      if (currentTypedWord !== currentTargetWord) {
        failTestRef.current('Expert Mode: Submitted mistyped word');
        return;
      }
    }

    // Heatmap tracking
    const targetLower = nextTargetChar ? nextTargetChar.toLowerCase() : ' ';
    if (!heatmapRef.current[targetLower]) {
      heatmapRef.current[targetLower] = { key: targetLower, typed: 0, correct: 0, errors: 0, mistakesTo: {} };
    }
    heatmapRef.current[targetLower].typed++;

    if (isCorrect) {
      heatmapRef.current[targetLower].correct++;
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

    const nextTyped = currTyped + charToCompare;
    setTypedChars(nextTyped);

    // In Zen or Time mode, append next segment when nearing end
    if ((modeRef.current === 'zen' || modeRef.current === 'time') && currPassage.length - nextTyped.length < 35) {
      const nextSegment = ' ' + generateConfiguredPassage({
        language: dictLanguage,
        wordSetSize: wordSet,
        wordCount: 25,
        punctuation,
        numbers
      });
      setPassage(prev => prev + nextSegment);
    }

    // Word mode completion check
    if (modeRef.current === 'words') {
      const wordsNow = nextTyped.trim().split(/\s+/).filter(Boolean).length;
      if (wordsNow >= (wordCount || 25)) {
        setTimeout(() => completeTestRef.current(), 40);
        return;
      }
    }

    // End of passage check
    if (nextTyped.length === currPassage.length) {
      if (modeRef.current !== 'zen' && modeRef.current !== 'time') {
        setTimeout(() => completeTestRef.current(), 40);
      }
    }
  }, [
    isFinished,
    isPaused,
    isFailed,
    isStarted,
    stopOnError,
    strictSpace,
    difficultyRule,
    dictLanguage,
    wordSet,
    punctuation,
    numbers,
    wordCount
  ]);

  // Handle hardware keyboard keystroke
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isFinished || isPaused || isFailed) return;

    // Detect CapsLock
    setCapsLockActive(e.getModifierState('CapsLock'));

    const key = e.key;

    // Ignore modifier and navigation keys
    if (key === 'Tab' || key === 'Alt' || key === 'Control' || key === 'Meta' || key === 'Escape' || key === 'CapsLock' || key === 'Shift') {
      return;
    }

    // Virtual keyboard on Android emits 'Unidentified' or keyCode 229: let handleInputEvent process it!
    if (key === 'Unidentified' || e.keyCode === 229) {
      return;
    }

    // Backspace
    if (key === 'Backspace') {
      e.preventDefault();
      handleBackspace();
      return;
    }

    // Enter in code mode translates to newline \n
    const charToCompare = key === 'Enter' ? '\n' : key;

    // Process single characters
    if (charToCompare.length === 1) {
      e.preventDefault();
      handleInputChar(charToCompare);
    }
  }, [isFinished, isPaused, isFailed, handleBackspace, handleInputChar]);

  // Handle mobile virtual keyboard input event (Android Gboard, iOS QuickType, composition)
  const handleInputEvent = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    if (isFinished || isPaused || isFailed) return;
    const native = (e.nativeEvent as any) || {};
    const inputType = native.inputType;
    const data = native.data;

    // Virtual keyboard Backspace
    if (inputType === 'deleteContentBackward' || inputType === 'deleteWordBackward') {
      handleBackspace();
      if (e.currentTarget) e.currentTarget.value = '';
      return;
    }

    // Virtual keyboard character input
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        handleInputChar(data[i]);
      }
      if (e.currentTarget) e.currentTarget.value = '';
      return;
    }

    // Fallback reading current value
    const val = e.currentTarget.value;
    if (val && val.length > 0) {
      for (let i = 0; i < val.length; i++) {
        handleInputChar(val[i]);
      }
      e.currentTarget.value = '';
    }
  }, [isFinished, isPaused, isFailed, handleBackspace, handleInputChar]);

  // Anti-cheat: prevent paste
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    setPasteAttempted(true);
    setTimeout(() => setPasteAttempted(false), 3000);
  }, []);

  return {
    passage,
    typedChars,
    charStatuses,
    correctCount,
    wpm,
    rawWpm,
    accuracy,
    progress,
    wordsCompleted,
    totalErrors,
    extraChars,
    streak,
    maxStreak,
    isStarted,
    isFinished,
    isPaused,
    isFailed,
    failedReason,
    elapsedSeconds,
    activeKey,
    isKeyError,
    expectedChar,
    paceCharIndex,
    capsLockActive,
    pasteAttempted,
    metricsHistory: metricsHistoryRef.current,
    heatmap: heatmapRef.current,
    handleKeyDown,
    handleInputEvent,
    handleInputChar,
    handleBackspace,
    handlePaste,
    togglePause,
    completeTest,
    resetEngine,
  };
}
