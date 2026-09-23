import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header, AppTab } from './components/Header';
import { TestSetup } from './components/TestSetup';
import { MetricsBar } from './components/MetricsBar';
import { TypingArea } from './components/TypingArea';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { PerformanceGraph } from './components/PerformanceGraph';
import { ResultsPanel } from './components/ResultsPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { ProfileView } from './components/ProfileView';
import { DailyChallengeView } from './components/DailyChallengeView';
import { KeyboardTesterView } from './components/keyboardTester/KeyboardTesterView';
import { RaceView } from './components/race/RaceView';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { OnboardingModal } from './components/OnboardingModal';

import { useLocalStorage } from './hooks/useLocalStorage';
import { useTimer } from './hooks/useTimer';
import { useTypingEngine } from './hooks/useTypingEngine';
import { getRandomPassage, getPassageForDuration } from './data/passages';
import { getQuote, getCodeSnippet, getWordsPassage } from './data/expandedPassages';
import { soundEngine } from './utils/audioSynth';
import { 
  TestDuration, 
  WordCountOption, 
  Difficulty, 
  Category, 
  TestMode, 
  CodeLanguage, 
  UserSettings, 
  TestResult, 
  PersonalBests, 
  UserProfile, 
  DailyChallengeRecord 
} from './types/typing';

export const App: React.FC = () => {
  // Navigation & Screen View
  const [currentTab, setCurrentTab] = useState<AppTab>('test');
  const [testPhase, setTestPhase] = useState<'setup' | 'typing' | 'results'>('setup');

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Fullscreen State
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Pre-test countdown state
  const [preTestCountdown, setPreTestCountdown] = useState<number | null>(null);

  // Achievement unlock notification toast
  const [unlockedAchievement, setUnlockedAchievement] = useState<string | null>(null);

  // Configuration (Default per Section 39: Dark, 30s, Medium, General)
  const [mode, setMode] = useState<TestMode>('time');
  const [duration, setDuration] = useState<TestDuration>(30);
  const [wordCount, setWordCount] = useState<WordCountOption>(25);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [category, setCategory] = useState<Category>('general');
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>('javascript');
  const [customText, setCustomText] = useState<string>('');
  const [quoteAuthor, setQuoteAuthor] = useState<string | undefined>(undefined);

  // Persistent User Settings
  const [settings, setSettings] = useLocalStorage<UserSettings>('typerush_settings', {
    theme: 'dark',
    soundEnabled: false,
    keyboardVisible: true,
    liveGraphVisible: true,
    cursorStyle: 'line',
    countdownEnabled: false,
    pauseOnBlur: true,
    focusMode: false,
  });

  // Persistent User Profile
  const [profile, setProfile] = useLocalStorage<UserProfile>('typerush_profile', {
    displayName: 'SHANMUKH',
    avatarStyle: 'cyan',
    selectedGoalId: 'g-80',
    hasCompletedOnboarding: false,
  });

  // Persistent History & Personal Bests
  const [history, setHistory] = useLocalStorage<TestResult[]>('typerush_history', []);
  const [personalBests, setPersonalBests] = useLocalStorage<PersonalBests>('typerush_pb', {
    bestWpm: 0,
    bestAccuracy: 0,
    bestScore: 0,
    best15s: 0,
    best30s: 0,
    best60s: 0,
    bestWords10: 0,
    bestWords25: 0,
    bestWords50: 0,
    bestWords100: 0,
  });

  // Daily Challenge History
  const [dailyRecords, setDailyRecords] = useLocalStorage<Record<string, DailyChallengeRecord>>('typerush_daily', {});

  // Last completed result for Results screen
  const [lastResult, setLastResult] = useState<TestResult | null>(null);

  // Current passage
  const [currentPassage, setCurrentPassage] = useState<string>(() => {
    return getPassageForDuration('general', 'medium', 30).text;
  });

  // Synchronize document dark class with settings
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    soundEngine.setEnabled(settings.soundEnabled);
  }, [settings.theme, settings.soundEnabled]);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, [setSettings]);

  const updateProfile = useCallback((newProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
  }, [setProfile]);

  // Handle test completion
  const handleTestFinished = useCallback((result: TestResult) => {
    setLastResult(result);
    setTestPhase('results');

    // Update History
    setHistory(prev => [result, ...prev]);

    // Update Personal Bests
    setPersonalBests(prev => {
      const next = { ...prev };
      if (result.wpm > next.bestWpm) next.bestWpm = result.wpm;
      if (result.accuracy > next.bestAccuracy) next.bestAccuracy = result.accuracy;
      if (result.score > next.bestScore) next.bestScore = result.score;

      if (result.mode === 'time') {
        if (result.duration === 15 && result.wpm > next.best15s) next.best15s = result.wpm;
        if (result.duration === 30 && result.wpm > next.best30s) next.best30s = result.wpm;
        if (result.duration === 60 && result.wpm > next.best60s) next.best60s = result.wpm;
      } else if (result.mode === 'words') {
        if (result.wordCount === 10 && result.wpm > next.bestWords10) next.bestWords10 = result.wpm;
        if (result.wordCount === 25 && result.wpm > next.bestWords25) next.bestWords25 = result.wpm;
        if (result.wordCount === 50 && result.wpm > next.bestWords50) next.bestWords50 = result.wpm;
        if (result.wordCount === 100 && result.wpm > next.bestWords100) next.bestWords100 = result.wpm;
      }

      return next;
    });

    // Update Daily Challenge Record if in daily mode
    if (result.mode === 'daily') {
      const todayStr = new Date().toISOString().split('T')[0];
      setDailyRecords(prev => {
        const existing = prev[todayStr] || { date: todayStr, attempts: 0, bestWpm: 0, bestAccuracy: 0, bestScore: 0, completed: false };
        return {
          ...prev,
          [todayStr]: {
            date: todayStr,
            attempts: existing.attempts + 1,
            bestWpm: Math.max(existing.bestWpm, result.wpm),
            bestAccuracy: Math.max(existing.bestAccuracy, result.accuracy),
            bestScore: Math.max(existing.bestScore, result.score),
            completed: true,
          }
        };
      });
    }

    // Achievement unlock check
    if (result.wpm >= 100) {
      setUnlockedAchievement('LIGHTNING · 100+ WPM');
      soundEngine.playAchievement();
      setTimeout(() => setUnlockedAchievement(null), 4000);
    } else if (result.wpm >= 80 && personalBests.bestWpm < 80) {
      setUnlockedAchievement('SPEEDSTER · 80+ WPM');
      soundEngine.playAchievement();
      setTimeout(() => setUnlockedAchievement(null), 4000);
    } else if (result.accuracy >= 98 && personalBests.bestAccuracy < 98) {
      setUnlockedAchievement('PRECISION · 98% Accuracy');
      soundEngine.playAchievement();
      setTimeout(() => setUnlockedAchievement(null), 4000);
    }
  }, [setHistory, setPersonalBests, setDailyRecords, personalBests]);

  // Typing Engine instance
  const typingEngine = useTypingEngine({
    passage: currentPassage,
    mode,
    duration,
    wordCount,
    difficulty,
    category,
    language: mode === 'code' ? codeLanguage : undefined,
    quoteAuthor,
    pastHistory: history,
    pauseOnBlur: settings.pauseOnBlur,
    onFinish: handleTestFinished,
  });

  // Countdown Timer instance
  const timer = useTimer({
    initialDuration: duration,
    onTimeUp: () => {
      if (mode === 'time') {
        typingEngine.completeTest();
      }
    },
  });

  // Sync Timer start when user begins typing
  useEffect(() => {
    if (typingEngine.isStarted && !timer.isActive && !timer.isFinished && testPhase === 'typing' && !typingEngine.isPaused) {
      timer.startTimer();
    }
  }, [typingEngine.isStarted, timer, testPhase, typingEngine.isPaused]);

  // Start a fresh test with selected configuration
  const startFreshTest = useCallback((
    customMode?: TestMode,
    customDuration?: TestDuration,
    customDiff?: Difficulty,
    customCat?: Category,
    customWordCount?: WordCountOption
  ) => {
    const targetMode = customMode || mode;
    const dur = customDuration || duration;
    const diff = customDiff || difficulty;
    const cat = customCat || category;
    const wc = customWordCount || wordCount;

    if (customMode) setMode(customMode);
    if (customDuration) setDuration(customDuration);
    if (customDiff) setDifficulty(customDiff);
    if (customCat) setCategory(customCat);
    if (customWordCount) setWordCount(customWordCount);

    let freshPassage = '';
    let author: string | undefined = undefined;

    if (targetMode === 'quote') {
      const q = getQuote();
      freshPassage = q.text;
      author = q.author;
    } else if (targetMode === 'code') {
      const c = getCodeSnippet(codeLanguage);
      freshPassage = c.code;
    } else if (targetMode === 'words') {
      freshPassage = getWordsPassage(wc);
    } else if (targetMode === 'custom') {
      freshPassage = customText.trim() || 'The quick brown fox jumps over the lazy dog.';
    } else {
      freshPassage = getPassageForDuration(cat, diff, dur).text;
    }

    setQuoteAuthor(author);
    setCurrentPassage(freshPassage);
    timer.resetTimer(dur);
    typingEngine.resetEngine(freshPassage);

    // If pre-test countdown is enabled in settings
    if (settings.countdownEnabled) {
      setPreTestCountdown(3);
      soundEngine.playCountdown(false);
      const countdownInterval = setInterval(() => {
        setPreTestCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownInterval);
            soundEngine.playCountdown(true);
            setPreTestCountdown(null);
            setTestPhase('typing');
            return null;
          }
          soundEngine.playCountdown(false);
          return prev - 1;
        });
      }, 1000);
    } else {
      setTestPhase('typing');
    }

    setCurrentTab('test');
  }, [mode, duration, difficulty, category, wordCount, codeLanguage, customText, settings.countdownEnabled, timer, typingEngine]);

  // Quick Test CTA (15s sprint)
  const handleQuickTest = useCallback(() => {
    startFreshTest('time', 15, 'easy', 'general');
  }, [startFreshTest]);

  // Restart active test
  const handleRestart = useCallback(() => {
    startFreshTest(mode, duration, difficulty, category, wordCount);
  }, [startFreshTest, mode, duration, difficulty, category, wordCount]);

  // Launch daily challenge
  const handleStartDailyChallenge = useCallback((passage: string, diff: 'medium' | 'hard', cat: any) => {
    setMode('daily');
    setDifficulty(diff);
    setCategory(cat);
    setCurrentPassage(passage);
    setQuoteAuthor(undefined);
    timer.resetTimer(30);
    typingEngine.resetEngine(passage);
    setTestPhase('typing');
    setCurrentTab('test');
  }, [timer, typingEngine]);

  // Clear all history
  const handleClearHistory = useCallback(() => {
    setHistory([]);
    setPersonalBests({
      bestWpm: 0,
      bestAccuracy: 0,
      bestScore: 0,
      best15s: 0,
      best30s: 0,
      best60s: 0,
      bestWords10: 0,
      bestWords25: 0,
      bestWords50: 0,
      bestWords100: 0,
    });
  }, [setHistory, setPersonalBests]);

  // Reset ALL local data (history, PB, profile, daily records, settings)
  const handleResetAllData = useCallback(() => {
    localStorage.removeItem('typerush_history');
    localStorage.removeItem('typerush_pb');
    localStorage.removeItem('typerush_profile');
    localStorage.removeItem('typerush_daily');
    localStorage.removeItem('typerush_settings');
    window.location.reload();
  }, []);

  // Fullscreen API toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Escape resets test, exits focus mode, or closes modals
      if (e.key === 'Escape') {
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
        } else if (isHelpOpen) {
          setIsHelpOpen(false);
        } else if (settings.focusMode) {
          updateSettings({ focusMode: false });
        } else if (testPhase === 'typing') {
          typingEngine.togglePause();
        }
      }

      // Enter on Setup screen starts test
      if (e.key === 'Enter' && testPhase === 'setup' && !isSettingsOpen && !isHelpOpen && currentTab === 'test') {
        e.preventDefault();
        startFreshTest(mode, duration, difficulty, category, wordCount);
      }

      // Enter on Results screen immediately triggers Try Again
      if (e.key === 'Enter' && testPhase === 'results' && !isSettingsOpen && !isHelpOpen && currentTab === 'test') {
        e.preventDefault();
        startFreshTest(mode, duration, difficulty, category, wordCount);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    testPhase, 
    isSettingsOpen, 
    isHelpOpen, 
    currentTab, 
    settings.focusMode, 
    updateSettings, 
    typingEngine, 
    startFreshTest, 
    mode, 
    duration, 
    difficulty, 
    category, 
    wordCount
  ]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = dailyRecords[todayStr];

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors ${
      settings.focusMode ? 'focus-mode-active' : ''
    }`}>
      
      {/* Universal Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'test' && testPhase === 'results') {
            setTestPhase('setup');
          }
        }}
        settings={settings}
        profile={profile}
        onUpdateSettings={updateSettings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        isTestActive={testPhase === 'typing' && typingEngine.isStarted}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Achievement Unlock Toast Notification */}
      {unlockedAchievement && (
        <div className="fixed top-20 right-6 z-50 bg-cyan-500 text-slate-950 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 font-mono text-xs font-bold animate-bounce">
          <span>🏆 ACHIEVEMENT UNLOCKED:</span>
          <span>{unlockedAchievement}</span>
        </div>
      )}

      {/* Pre-Test Countdown Overlay (3-2-1-GO) */}
      {preTestCountdown !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md font-mono">
          <div className="text-center animate-bounce">
            <span className="text-9xl font-black text-cyan-400 drop-shadow-[0_0_50px_rgba(0,240,255,0.7)]">
              {preTestCountdown}
            </span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">
              Prepare fingers...
            </p>
          </div>
        </div>
      )}

      {/* Main Interactive Stage */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-6 w-full max-w-7xl mx-auto">
        
        {/* TAB 1: TYPING EXPERIENCE */}
        {currentTab === 'test' && (
          <div className="w-full flex flex-col items-center">
            
            {/* STAGE A: SETUP */}
            {testPhase === 'setup' && (
              <TestSetup
                mode={mode}
                onSelectMode={setMode}
                duration={duration}
                onSelectDuration={(d) => {
                  setDuration(d);
                  timer.resetTimer(d);
                }}
                wordCount={wordCount}
                onSelectWordCount={setWordCount}
                difficulty={difficulty}
                onSelectDifficulty={setDifficulty}
                category={category}
                onSelectCategory={setCategory}
                codeLanguage={codeLanguage}
                onSelectCodeLanguage={setCodeLanguage}
                customText={customText}
                onChangeCustomText={setCustomText}
                onStartTest={() => startFreshTest(mode, duration, difficulty, category, wordCount)}
                onQuickTest={handleQuickTest}
              />
            )}

            {/* STAGE B: ACTIVE TYPING ENGINE */}
            {testPhase === 'typing' && (
              <div className="w-full flex flex-col items-center animate-fadeIn">
                
                {/* Real-time HUD Metrics */}
                <MetricsBar
                  wpm={typingEngine.wpm}
                  rawWpm={typingEngine.rawWpm}
                  accuracy={typingEngine.accuracy}
                  errors={typingEngine.totalErrors}
                  formattedTime={timer.formattedTime}
                  isLowTime={mode === 'time' && timer.isLowTime}
                  progress={typingEngine.progress}
                  streak={typingEngine.streak}
                />

                {/* Primary Typing Passage */}
                <TypingArea
                  passage={currentPassage}
                  typedChars={typingEngine.typedChars}
                  charStatuses={typingEngine.charStatuses}
                  cursorStyle={settings.cursorStyle}
                  isStarted={typingEngine.isStarted}
                  isFinished={typingEngine.isFinished}
                  isPaused={typingEngine.isPaused}
                  mode={mode}
                  quoteAuthor={quoteAuthor}
                  wordsProgressText={mode === 'words' ? `${typingEngine.wordsCompleted} / ${wordCount} words` : undefined}
                  pasteAttempted={typingEngine.pasteAttempted}
                  onKeyDown={typingEngine.handleKeyDown}
                  onPaste={typingEngine.handlePaste}
                  onRestart={handleRestart}
                  onTogglePause={typingEngine.togglePause}
                />

                {/* Optional Live Speed Curve */}
                {settings.liveGraphVisible && typingEngine.isStarted && !settings.focusMode && (
                  <div className="w-full max-w-4xl mt-4 px-2">
                    <div className="bg-white/60 dark:bg-[#0f172a]/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 backdrop-blur-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                        <span>LIVE WPM TRACKER</span>
                        <span>{typingEngine.wpm} WPM</span>
                      </div>
                      <PerformanceGraph
                        metrics={typingEngine.metricsHistory}
                        duration={duration}
                        height={70}
                        showLabels={false}
                      />
                    </div>
                  </div>
                )}

                {/* Optional Virtual Keyboard Visualization */}
                {settings.keyboardVisible && !settings.focusMode && (
                  <VirtualKeyboard
                    activeKey={typingEngine.activeKey}
                    isKeyError={typingEngine.isKeyError}
                    expectedChar={typingEngine.expectedChar}
                  />
                )}
              </div>
            )}

            {/* STAGE C: RESULTS SCREEN */}
            {testPhase === 'results' && lastResult && (
              <ResultsPanel
                result={lastResult}
                personalBests={personalBests}
                history={history}
                onTryAgain={() => startFreshTest(mode, duration, difficulty, category, wordCount)}
                onChangeMode={() => setTestPhase('setup')}
                onViewHistory={() => setCurrentTab('history')}
              />
            )}

          </div>
        )}

        {/* TAB 2: KEYBOARD TESTER */}
        {currentTab === 'tester' && (
          <KeyboardTesterView />
        )}

        {/* TAB 3: 1V1 REALTIME RACE */}
        {currentTab === 'race' && (
          <RaceView
            displayName={profile.displayName}
            avatarStyle={profile.avatarStyle}
          />
        )}

        {/* TAB 4: DAILY CHALLENGE */}
        {currentTab === 'daily' && (
          <DailyChallengeView
            todayRecord={todayRecord}
            onStartChallenge={handleStartDailyChallenge}
          />
        )}

        {/* TAB 5: SEARCHABLE HISTORY */}
        {currentTab === 'history' && (
          <HistoryPanel
            history={history}
            onClearHistory={handleClearHistory}
            onStartTest={() => {
              setCurrentTab('test');
              setTestPhase('setup');
            }}
          />
        )}

        {/* TAB 6: PROFILE, STATS & ACHIEVEMENTS */}
        {currentTab === 'profile' && (
          <ProfileView
            profile={profile}
            onUpdateProfile={updateProfile}
            history={history}
            personalBests={personalBests}
          />
        )}

      </main>

      {/* Footer */}
      {!settings.focusMode && (
        <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400 dark:text-slate-500 font-mono transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600 dark:text-slate-400">TYPERUSH</span>
              <span>·</span>
              <span>Precision Typing & Hardware Diagnostics Platform</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span>1v1 Supabase Realtime Engine</span>
              <span>·</span>
              <button 
                onClick={() => setIsHelpOpen(true)}
                className="hover:text-cyan-500 transition-colors"
              >
                Help & Shortcuts
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* First-Time Onboarding Modal */}
      <OnboardingModal
        isOpen={!profile.hasCompletedOnboarding}
        onComplete={() => updateProfile({ hasCompletedOnboarding: true })}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetAllData={handleResetAllData}
      />

    </div>
  );
};

export default App;
