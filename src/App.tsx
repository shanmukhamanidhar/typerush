import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { TopNav, NavTab } from './components/TopNav';
import { MainTypingView } from './components/MainTypingView';
import { StatsView } from './components/StatsView';
import { PracticeView } from './components/PracticeView';
import { CustomTextView } from './components/CustomTextView';
import { KeyboardTesterView } from './components/keyboardTester/KeyboardTesterView';
import { RaceView } from './components/race/RaceView';
import { ResultsPanel } from './components/ResultsPanel';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { OnboardingModal } from './components/OnboardingModal';
import { CommandPalette } from './components/CommandPalette';
import { PracticeModal } from './components/PracticeModal';

// Monkeytype-style Feature Expansion Components
import { LeaderboardPage } from './components/leaderboard/LeaderboardPage';
import { AboutPage } from './components/about/AboutPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { LanguageSelectorModal } from './components/language/LanguageSelectorModal';

// Supabase Authentication & Cloud Multi-User Services
import { User } from '@supabase/supabase-js';
import { authService, UserProfileData } from './services/authService';
import { CloudTypingService } from './services/cloudTypingService';
import { AuthModal } from './components/auth/AuthModal';
import { DataMigrationBanner } from './components/auth/DataMigrationBanner';
import { supabaseRace } from './services/supabaseRace';

import { useLocalStorage } from './hooks/useLocalStorage';
import { useTypingEngine } from './hooks/useTypingEngine';
import { 
  generateConfiguredPassage, 
  getQuotesByLength, 
  getCodeByLanguage 
} from './data/languages';
import { LanguageService } from './services/languageService';
import { DEFAULT_USER_SETTINGS } from './services/settingsService';
import { soundEngine } from './utils/audioSynth';
import { generateMissedWordsDrill } from './data/practiceEngine';
import { applyTheme } from './utils/themeEngine';
import { 
  Difficulty, 
  DifficultyRule,
  Category, 
  TestMode, 
  CodeLanguage, 
  QuoteLength,
  LanguageCode,
  WordSetSize,
  UserSettings, 
  TestResult, 
  PersonalBests, 
  UserProfile, 
  DailyChallengeRecord,
  LanguagePack
} from './types/typing';

export const App: React.FC = () => {
  // Navigation & Screen View
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [testPhase, setTestPhase] = useState<'typing' | 'results'>('typing');

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState<boolean>(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);

  // Pre-test countdown state
  const [preTestCountdown, setPreTestCountdown] = useState<number | null>(null);

  // Achievement unlock notification toast
  const [unlockedAchievement, setUnlockedAchievement] = useState<string | null>(null);

  // Configuration
  const [mode, setMode] = useState<TestMode>('time');
  const [duration, setDuration] = useState<number>(30);
  const [wordCount, setWordCount] = useState<number>(25);
  const [quoteLength, setQuoteLength] = useState<QuoteLength>('medium');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [difficultyRule, setDifficultyRule] = useState<DifficultyRule>('normal');
  const [category, setCategory] = useState<Category>('general');
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>('javascript');
  const [dictLanguage, setDictLanguage] = useState<LanguageCode>('en');
  const [wordSet, setWordSet] = useState<WordSetSize>(200);
  const [punctuation, setPunctuation] = useState<boolean>(false);
  const [numbers, setNumbers] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  const [quoteAuthor, setQuoteAuthor] = useState<string | undefined>(undefined);

  // Persistent User Settings
  const [rawSettings, setSettings] = useLocalStorage<UserSettings>('typerush_settings', DEFAULT_USER_SETTINGS);
  
  // Safe settings merged with defaults to protect against missing keys in existing local storage
  const settings: UserSettings = useMemo(() => {
    return {
      ...DEFAULT_USER_SETTINGS,
      ...rawSettings,
      hideElements: {
        ...DEFAULT_USER_SETTINGS.hideElements,
        ...(rawSettings?.hideElements || {}),
      },
    };
  }, [rawSettings]);

  // Persistent User Profile
  const [profile, setProfile] = useLocalStorage<UserProfile>('typerush_profile', {
    displayName: 'SHANMUKH',
    avatarStyle: 'orange',
    selectedGoalId: 'g-80',
    hasCompletedOnboarding: false,
  });

  // Persistent History & Personal Bests (LocalStorage fallback / offline cache)
  const [history, setHistory] = useLocalStorage<TestResult[]>('typerush_history', []);
  const [personalBests, setPersonalBests] = useLocalStorage<PersonalBests>('typerush_pb', {
    bestWpm: 0,
    bestAccuracy: 0,
    bestScore: 0,
    best15s: 0,
    best30s: 0,
    best60s: 0,
    best120s: 0,
    bestWords10: 0,
    bestWords25: 0,
    bestWords50: 0,
    bestWords100: 0,
    bestWords200: 0,
  });

  // Supabase Authentication & Remote Cloud State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentProfile, setCurrentProfile] = useState<UserProfileData | null>(null);
  const [cloudHistory, setCloudHistory] = useState<TestResult[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [showMigrationBanner, setShowMigrationBanner] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Active Authoritative History (Supabase cloud results when authenticated)
  const activeHistory = useMemo(() => {
    if (currentUser && cloudHistory.length > 0) {
      return cloudHistory;
    }
    return history;
  }, [currentUser, cloudHistory, history]);

  // Active Authoritative Personal Bests
  const activePersonalBests = useMemo(() => {
    if (currentUser && cloudHistory.length > 0) {
      return CloudTypingService.calculatePersonalBests(cloudHistory);
    }
    return personalBests;
  }, [currentUser, cloudHistory, personalBests]);

  // Daily Challenge History
  const [dailyRecords, setDailyRecords] = useLocalStorage<Record<string, DailyChallengeRecord>>('typerush_daily', {});

  // URL Hash synchronization
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (['home', 'multiplayer', 'leaderboards', 'stats', 'about', 'settings', 'practice', 'custom', 'tester'].includes(hash)) {
        setActiveTab(hash as NavTab);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleTabChange = useCallback((tab: NavTab) => {
    setActiveTab(tab);
    window.location.hash = `#/${tab}`;
  }, []);

  // Configure Sound Engine
  useEffect(() => {
    soundEngine.configure({
      enabled: settings.soundEnabled,
      volume: settings.soundVolume,
      profile: settings.typingSound,
      errorSound: settings.errorSound,
      completionSound: settings.completionSound,
    });
  }, [settings.soundEnabled, settings.soundVolume, settings.typingSound, settings.errorSound, settings.completionSound]);

  // Sanitize any corrupted historical records from prior buggy sessions (>220 WPM)
  useEffect(() => {
    let historyCorrupted = false;
    const cleanHistory = history.filter(item => {
      const isClean = item.wpm > 0 && item.wpm <= 220 && (!item.burstSpeed?.peakWpm || item.burstSpeed.peakWpm <= 250);
      if (!isClean) historyCorrupted = true;
      return isClean;
    });

    if (historyCorrupted) {
      setHistory(cleanHistory);
    }

    if (personalBests.bestWpm > 220 || personalBests.best30s > 220 || personalBests.best15s > 220 || personalBests.best60s > 220) {
      const validWpms = cleanHistory.map(h => h.wpm);
      const newBest = validWpms.length > 0 ? Math.max(...validWpms) : 0;
      setPersonalBests(prev => ({
        ...prev,
        bestWpm: newBest,
        best15s: Math.min(prev.best15s, 220),
        best30s: Math.min(prev.best30s, 220),
        best60s: Math.min(prev.best60s, 220),
      }));
    }
  }, []);

  // Last completed result for Results screen
  const [lastResult, setLastResult] = useState<TestResult | null>(null);

  // Current passage
  const [currentPassage, setCurrentPassage] = useState<string>(() => {
    return LanguageService.generatePassage('english', 80, { punctuation: false, numbers: false });
  });

  // Calculate Pace Caret target WPM
  const computedPaceWpm = useMemo(() => {
    if (settings.paceCaret === 'off') return 0;
    if (settings.paceCaret === 'pb') return activePersonalBests.bestWpm || 60;
    if (settings.paceCaret === 'average') {
      return activeHistory.length > 0 
        ? Math.round(activeHistory.reduce((a, b) => a + b.wpm, 0) / activeHistory.length) 
        : 50;
    }
    if (settings.paceCaret === 'custom') return settings.paceWpm || 80;
    return 0;
  }, [settings.paceCaret, settings.paceWpm, activePersonalBests.bestWpm, activeHistory]);

  // Synchronize Themes
  useEffect(() => {
    applyTheme(settings.themeId || 'graphite-cyan', settings.customColors, 'solid', settings.theme);
  }, [settings.theme, settings.themeId, settings.customColors]);

  // Supabase Auth and Remote Session Synchronization
  useEffect(() => {
    let isCancelled = false;

    // Fetch initial active session
    authService.getSession().then(async (session) => {
      const user = session?.user ?? null;
      if (isCancelled) return;
      setCurrentUser(user);

      if (user) {
        supabaseRace.setAuthenticatedUser(user.id);
        const prof = await authService.getProfile(user.id);
        if (!isCancelled) setCurrentProfile(prof);

        const cloudRes = await CloudTypingService.getUserHistory(user.id);
        if (!isCancelled && cloudRes.length > 0) {
          setCloudHistory(cloudRes);
        }

        const migrationKey = `typerush_migrated_${user.id}`;
        if (localStorage.getItem(migrationKey) !== 'true' && history.length > 0) {
          if (!isCancelled) setShowMigrationBanner(true);
        }
      }
    });

    // Listen for auth state transitions (login, logout, token refresh)
    const unsubscribe = authService.onAuthStateChange(async (user, profile) => {
      setCurrentUser(user);
      setCurrentProfile(profile);

      if (user) {
        supabaseRace.setAuthenticatedUser(user.id);
        const cloudRes = await CloudTypingService.getUserHistory(user.id);
        if (cloudRes.length > 0) {
          setCloudHistory(cloudRes);
        }

        const migrationKey = `typerush_migrated_${user.id}`;
        if (localStorage.getItem(migrationKey) !== 'true' && history.length > 0) {
          setShowMigrationBanner(true);
        }
      } else {
        setCloudHistory([]);
        setShowMigrationBanner(false);
      }
    });

    return () => {
      isCancelled = true;
      unsubscribe();
    };
  }, [history.length]);

  const handleMigrateData = useCallback(async () => {
    if (!currentUser) return;
    const result = await CloudTypingService.migrateLocalHistory(currentUser.id, history);
    if (result.success) {
      const migrationKey = `typerush_migrated_${currentUser.id}`;
      localStorage.setItem(migrationKey, 'true');
      setShowMigrationBanner(false);
      const fresh = await CloudTypingService.getUserHistory(currentUser.id);
      setCloudHistory(fresh);
    } else {
      setSyncError(result.error || 'Failed to sync local tests to cloud.');
      setTimeout(() => setSyncError(null), 6000);
    }
  }, [currentUser, history]);

  const handleDismissMigration = useCallback(() => {
    if (currentUser) {
      localStorage.setItem(`typerush_migrated_${currentUser.id}`, 'true');
    }
    setShowMigrationBanner(false);
  }, [currentUser]);

  const handleSignOut = useCallback(async () => {
    await authService.signOut();
    setCurrentUser(null);
    setCurrentProfile(null);
    setCloudHistory([]);
    setShowMigrationBanner(false);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, [setSettings]);

  const updateProfile = useCallback((newProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
  }, [setProfile]);

  // Handle test completion
  const handleTestFinished = useCallback(async (result: TestResult) => {
    setLastResult(result);
    setTestPhase('results');

    // Update Local History
    setHistory(prev => [result, ...prev]);

    // Update Local Personal Bests
    setPersonalBests(prev => {
      const next = { ...prev };
      if (result.wpm > next.bestWpm) next.bestWpm = result.wpm;
      if (result.accuracy > next.bestAccuracy) next.bestAccuracy = result.accuracy;
      if (result.score > next.bestScore) next.bestScore = result.score;

      if (result.mode === 'time') {
        if (result.duration === 15 && result.wpm > next.best15s) next.best15s = result.wpm;
        if (result.duration === 30 && result.wpm > next.best30s) next.best30s = result.wpm;
        if (result.duration === 60 && result.wpm > next.best60s) next.best60s = result.wpm;
      }
      return next;
    });

    // Cloud persistence for authenticated users
    if (currentUser) {
      const saveRes = await CloudTypingService.saveResult(result, currentUser.id);
      if (saveRes.success) {
        setCloudHistory(prev => [result, ...prev]);
        setSyncError(null);
      } else {
        setSyncError('Connection lost. Result could not be synced to cloud.');
        setTimeout(() => setSyncError(null), 6000);
      }
    }

    // Achievement unlock check
    if (result.wpm >= 120) {
      setUnlockedAchievement('TITAN · 120+ WPM');
      setTimeout(() => setUnlockedAchievement(null), 4000);
    } else if (result.wpm >= 100) {
      setUnlockedAchievement('LIGHTNING · 100+ WPM');
      setTimeout(() => setUnlockedAchievement(null), 4000);
    } else if (result.wpm >= 80 && activePersonalBests.bestWpm < 80) {
      setUnlockedAchievement('SPEEDSTER · 80+ WPM');
      setTimeout(() => setUnlockedAchievement(null), 4000);
    } else if (result.accuracy >= 98 && activePersonalBests.bestAccuracy < 98) {
      setUnlockedAchievement('PRECISION · 98% Accuracy');
      setTimeout(() => setUnlockedAchievement(null), 4000);
    }
  }, [currentUser, activePersonalBests, setHistory, setPersonalBests]);

  // Hook typing engine instance
  const typingEngine = useTypingEngine({
    passage: currentPassage,
    mode,
    duration,
    wordCount,
    difficulty,
    difficultyRule: settings.difficultyRule || difficultyRule,
    category,
    language: codeLanguage,
    dictLanguage,
    wordSet,
    punctuation,
    numbers,
    quoteAuthor,
    quoteLength,
    pastHistory: activeHistory,
    pauseOnBlur: settings.pauseOnBlur,
    confidenceMode: settings.confidenceMode,
    stopOnError: settings.stopOnError,
    freedomMode: settings.freedomMode,
    strictSpace: settings.strictSpace,
    quickEnd: settings.quickEnd,
    blindMode: settings.blindMode,
    minWpm: settings.minWpm,
    minAccuracy: settings.minAccuracy,
    paceWpm: computedPaceWpm,
    activeTags: settings.activeTags,
    onFinish: handleTestFinished,
  });

  // Start a fresh test with selected configuration
  const startFreshTest = useCallback((
    customMode?: TestMode,
    customDuration?: number,
    customDiff?: Difficulty,
    customCat?: Category,
    customWordCount?: number,
    explicitPassage?: string,
    explicitAuthor?: string,
    explicitLang?: string
  ) => {
    const targetMode = customMode || mode;
    const dur = customDuration || duration;
    const diff = customDiff || difficulty;
    const cat = customCat || category;
    const wc = customWordCount || wordCount;
    const langId = explicitLang || settings.language || 'english';

    if (customMode) setMode(customMode);
    if (customDuration) setDuration(customDuration);
    if (customDiff) setDifficulty(customDiff);
    if (customCat) setCategory(customCat);
    if (customWordCount) setWordCount(customWordCount);

    let freshPassage = '';
    let author: string | undefined = undefined;

    if (explicitPassage) {
      freshPassage = explicitPassage;
      author = explicitAuthor;
    } else if (targetMode === 'quote' || cat === 'quotes') {
      const q = getQuotesByLength(quoteLength);
      freshPassage = q.text;
      author = q.author;
    } else if (targetMode === 'code' || cat === 'programming') {
      const c = getCodeByLanguage(codeLanguage);
      freshPassage = c.code;
    } else if (targetMode === 'custom') {
      freshPassage = customText.trim() || 'The quick brown fox jumps over the lazy dog.';
    } else {
      // Standard time / words mode: generate words from selected language pack
      const estimatedWords = targetMode === 'words' ? wc : Math.max(80, Math.round(dur * 3.5));
      freshPassage = LanguageService.generatePassage(langId, estimatedWords, {
        punctuation,
        numbers: numbers || cat === 'numbers',
      });
    }

    setQuoteAuthor(author);
    setCurrentPassage(freshPassage);
    typingEngine.resetEngine(freshPassage);
    setTestPhase('typing');
  }, [
    mode, 
    duration, 
    difficulty, 
    category, 
    wordCount, 
    quoteLength, 
    codeLanguage, 
    punctuation,
    numbers,
    customText, 
    settings.language,
    typingEngine
  ]);

  // Restart active test
  const handleRestart = useCallback(() => {
    startFreshTest(mode, duration, difficulty, category, wordCount);
  }, [startFreshTest, mode, duration, difficulty, category, wordCount]);

  // Practice Missed Words shortcut from Results Panel
  const handlePracticeMissedFromResults = useCallback(() => {
    const drill = generateMissedWordsDrill();
    startFreshTest('practice', 60, difficulty, category, undefined, drill.passage, 'Missed Words Targeted Drill');
    handleTabChange('home');
  }, [startFreshTest, difficulty, category, handleTabChange]);

  // Handle drill launch from Practice tab
  const handleStartDrill = useCallback((drillPassage: string, drillTitle: string) => {
    startFreshTest('practice', 60, difficulty, category, undefined, drillPassage, drillTitle);
    handleTabChange('home');
  }, [startFreshTest, difficulty, category, handleTabChange]);

  // Handle Custom Text launch
  const handleStartCustomTest = useCallback((text: string) => {
    setCustomText(text);
    startFreshTest('custom', 60, difficulty, category, undefined, text);
    handleTabChange('home');
  }, [startFreshTest, difficulty, category, handleTabChange]);

  // Update tags on finished test
  const handleUpdateTestTags = useCallback((testId: string, tags: string[]) => {
    setHistory(prev => prev.map(item => item.id === testId ? { ...item, tags } : item));
    setCloudHistory(prev => prev.map(item => item.id === testId ? { ...item, tags } : item));
    if (lastResult && lastResult.id === testId) {
      setLastResult(prev => prev ? { ...prev, tags } : null);
    }
  }, [lastResult, setHistory]);

  // Danger Zone Handlers
  const handleResetSettings = useCallback(() => {
    setSettings(DEFAULT_USER_SETTINGS);
  }, [setSettings]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    setCloudHistory([]);
    setLastResult(null);
  }, [setHistory]);

  const handleClearStats = useCallback(() => {
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
  }, [setPersonalBests]);

  const handleResetAll = useCallback(() => {
    localStorage.clear();
    setSettings(DEFAULT_USER_SETTINGS);
    setHistory([]);
    setLastResult(null);
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
    window.location.reload();
  }, [setSettings, setHistory, setPersonalBests]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Command Palette (Ctrl+Shift+P or Ctrl+K)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K' || (e.shiftKey && (e.key === 'p' || e.key === 'P')))) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      // Language Palette (Ctrl+Shift+L or Alt+L)
      if ((e.altKey && (e.key === 'l' || e.key === 'L')) || ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'l' || e.key === 'L'))) {
        e.preventDefault();
        setIsLanguageModalOpen(prev => !prev);
        return;
      }

      // Escape closes modals or triggers quick restart if configured
      if (e.key === 'Escape') {
        if (isLanguageModalOpen) {
          setIsLanguageModalOpen(false);
          return;
        }
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
          return;
        }
        if (isPracticeModalOpen) {
          setIsPracticeModalOpen(false);
          return;
        }
        if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false);
          return;
        }
        if (settings.quickRestart === 'esc' && activeTab === 'home') {
          e.preventDefault();
          handleRestart();
          return;
        }
      }

      // Quick restart via Tab or Enter if enabled
      if (activeTab === 'home' && !typingEngine.isStarted && testPhase === 'typing') {
        if (e.key === 'Tab' && settings.quickRestart === 'tab') {
          e.preventDefault();
          handleRestart();
        } else if (e.key === 'Enter' && settings.quickRestart === 'enter') {
          e.preventDefault();
          handleRestart();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    isLanguageModalOpen, 
    isSettingsOpen, 
    isPracticeModalOpen, 
    isCommandPaletteOpen, 
    settings.quickRestart, 
    activeTab, 
    typingEngine.isStarted, 
    testPhase, 
    handleRestart
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] dark:bg-[#000000] text-[#111111] dark:text-[#FFFFFF] transition-colors duration-150">
      
      {/* Maximum Width Workspace Container */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col flex-1">
        
        {/* Top Minimal Navigation Bar */}
        {!settings.hideElements?.header && (
          <TopNav
            currentTab={activeTab}
            onSelectTab={handleTabChange}
            settings={settings}
            profile={profile}
            currentUser={currentUser}
            currentProfile={currentProfile}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onSignOut={handleSignOut}
            onUpdateSettings={updateSettings}
            onOpenSettings={() => handleTabChange('settings')}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            isTestActive={typingEngine.isStarted && !typingEngine.isFinished}
          />
        )}

        {/* Supabase Data Migration Banner */}
        {currentUser && showMigrationBanner && history.length > 0 && (
          <div className="mt-2 mb-2 animate-fadeIn">
            <DataMigrationBanner
              userId={currentUser.id}
              localHistory={history}
              onMigrationComplete={async () => {
                localStorage.setItem(`typerush_migrated_${currentUser.id}`, 'true');
                setShowMigrationBanner(false);
                const fresh = await CloudTypingService.getUserHistory(currentUser.id);
                setCloudHistory(fresh);
              }}
              onDismiss={handleDismissMigration}
            />
          </div>
        )}

        {/* Sync / Offline Notification Toast */}
        {syncError && (
          <div className="mt-2 mb-2 px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono flex items-center justify-between animate-fadeIn">
            <span>⚠️ {syncError}</span>
            <button 
              onClick={() => setSyncError(null)} 
              className="text-red-400 hover:text-white font-bold ml-2 cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* Achievement Notification Banner */}
        {unlockedAchievement && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-[#FF5A00] text-black font-mono font-bold text-xs shadow-lg animate-bounce flex items-center gap-2">
            <span>🏆</span>
            <span>ACHIEVEMENT UNLOCKED: {unlockedAchievement}</span>
          </div>
        )}

        {/* Pre-Test Countdown Overlay (3-2-1-GO) */}
        {preTestCountdown !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md font-mono">
            <div className="text-center animate-bounce">
              <span className="text-9xl font-black text-[#FF5A00] drop-shadow-[0_0_50px_rgba(255,90,0,0.7)]">
                {preTestCountdown}
              </span>
              <p className="text-xs font-bold text-[#888888] uppercase tracking-widest mt-4">
                Prepare fingers...
              </p>
            </div>
          </div>
        )}

        <main className="flex-1 p-2 sm:p-4 lg:p-6 flex flex-col justify-center">
          
          {/* TAB: HOME / MAIN TYPING TEST */}
          {activeTab === 'home' && (
            testPhase === 'results' && lastResult ? (
              <ResultsPanel
                result={lastResult}
                personalBests={activePersonalBests}
                history={activeHistory}
                onTryAgain={() => startFreshTest(mode, duration, difficulty, category, wordCount)}
                onChangeMode={() => setTestPhase('typing')}
                onViewHistory={() => handleTabChange('stats')}
                onPracticeMissedWords={handlePracticeMissedFromResults}
                onUpdateTags={handleUpdateTestTags}
              />
            ) : (
              <MainTypingView
                passage={typingEngine.passage}
                typedChars={typingEngine.typedChars}
                charStatuses={typingEngine.charStatuses}
                wpm={typingEngine.wpm}
                rawWpm={typingEngine.rawWpm}
                accuracy={typingEngine.accuracy}
                elapsedSeconds={typingEngine.elapsedSeconds}
                totalErrors={typingEngine.totalErrors}
                correctCount={typingEngine.correctCount}
                isStarted={typingEngine.isStarted}
                isFinished={typingEngine.isFinished}
                isPaused={typingEngine.isPaused}
                mode={mode}
                duration={duration}
                wordCount={wordCount}
                quoteLength={quoteLength}
                punctuation={punctuation}
                numbers={numbers}
                languageName={LanguageService.getPack(settings.language || 'english').name}
                settings={settings}
                difficulty={difficulty}
                category={category}
                onSelectMode={(m) => {
                  setMode(m);
                  startFreshTest(m, duration, difficulty, category, wordCount);
                }}
                onSelectDuration={(d) => {
                  setDuration(d);
                  startFreshTest(mode, d, difficulty, category, wordCount);
                }}
                onSelectWordCount={(w) => {
                  setWordCount(w);
                  startFreshTest('words', duration, difficulty, category, w);
                }}
                onSelectQuoteLength={(q) => {
                  setQuoteLength(q);
                  startFreshTest('quote', duration, difficulty, category, wordCount);
                }}
                onTogglePunctuation={() => {
                  setPunctuation(p => {
                    const next = !p;
                    startFreshTest(mode, duration, difficulty, category, wordCount);
                    return next;
                  });
                }}
                onToggleNumbers={() => {
                  setNumbers(n => {
                    const next = !n;
                    startFreshTest(mode, duration, difficulty, category, wordCount);
                    return next;
                  });
                }}
                onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
                onSelectDifficulty={(diff) => {
                  setDifficulty(diff);
                  startFreshTest(mode, duration, diff, category, wordCount);
                }}
                onSelectCategory={(cat) => {
                  setCategory(cat);
                  startFreshTest(mode, duration, difficulty, cat, wordCount);
                }}
                onKeyDown={typingEngine.handleKeyDown}
                onInput={typingEngine.handleInputEvent}
                onPaste={typingEngine.handlePaste}
                onRestart={handleRestart}
                quoteAuthor={quoteAuthor}
                metricsHistory={typingEngine.metricsHistory}
              />
            )
          )}

          {/* TAB: TIME TRIAL (Dedicated sprint duration test) */}
          {activeTab === 'timetrial' && (
            <MainTypingView
              passage={typingEngine.passage}
              typedChars={typingEngine.typedChars}
              charStatuses={typingEngine.charStatuses}
              wpm={typingEngine.wpm}
              rawWpm={typingEngine.rawWpm}
              accuracy={typingEngine.accuracy}
              elapsedSeconds={typingEngine.elapsedSeconds}
              totalErrors={typingEngine.totalErrors}
              correctCount={typingEngine.correctCount}
              isStarted={typingEngine.isStarted}
              isFinished={typingEngine.isFinished}
              isPaused={typingEngine.isPaused}
              mode="time"
              duration={duration}
              wordCount={wordCount}
              quoteLength={quoteLength}
              punctuation={punctuation}
              numbers={numbers}
              languageName={LanguageService.getPack(settings.language || 'english').name}
              settings={settings}
              difficulty={difficulty}
              category={category}
              onSelectDuration={(d) => {
                setDuration(d);
                startFreshTest('time', d, difficulty, category, wordCount);
              }}
              onSelectDifficulty={(diff) => {
                setDifficulty(diff);
                startFreshTest('time', duration, diff, category, wordCount);
              }}
              onSelectCategory={(cat) => {
                setCategory(cat);
                startFreshTest('time', duration, difficulty, cat, wordCount);
              }}
              onKeyDown={typingEngine.handleKeyDown}
              onInput={typingEngine.handleInputEvent}
              onPaste={typingEngine.handlePaste}
              onRestart={handleRestart}
              quoteAuthor={quoteAuthor}
              metricsHistory={typingEngine.metricsHistory}
            />
          )}

          {/* TAB: LEADERBOARD PAGE */}
          {activeTab === 'leaderboards' && (
            <LeaderboardPage
              userHistory={activeHistory}
              userDisplayName={currentProfile?.username || profile.displayName}
              currentUserId={currentUser?.id}
              isUserAuthenticated={!!currentUser}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              onStartTest={() => {
                handleTabChange('home');
                startFreshTest();
              }}
            />
          )}

          {/* TAB: ABOUT PAGE */}
          {activeTab === 'about' && (
            <AboutPage
              history={activeHistory}
              personalBests={activePersonalBests}
            />
          )}

          {/* TAB: SETTINGS PAGE */}
          {activeTab === 'settings' && (
            <SettingsPage
              settings={settings}
              onUpdateSettings={updateSettings}
              onResetSettings={handleResetSettings}
              onClearHistory={handleClearHistory}
              onClearStats={handleClearStats}
              onResetAll={handleResetAll}
            />
          )}

          {/* TAB: STATS VIEW */}
          {activeTab === 'stats' && (
            <StatsView
              history={activeHistory}
              personalBests={activePersonalBests}
              onStartTest={() => {
                handleTabChange('home');
                startFreshTest(mode, duration, difficulty, category, wordCount);
              }}
            />
          )}

          {/* TAB: PRACTICE VIEW */}
          {activeTab === 'practice' && (
            <PracticeView
              onStartDrill={handleStartDrill}
              onCancel={() => handleTabChange('home')}
            />
          )}

          {/* TAB: CUSTOM TEXT */}
          {activeTab === 'custom' && (
            <CustomTextView
              onStartCustomTest={handleStartCustomTest}
              onCancel={() => handleTabChange('home')}
            />
          )}

          {/* TAB: MULTIPLAYER RACE */}
          {(activeTab === 'multiplayer' || activeTab === 'leaderboard') && (
            <RaceView
              displayName={currentProfile?.username || profile.displayName}
              avatarStyle={profile.avatarStyle}
              currentUser={currentUser}
              currentProfile={currentProfile}
            />
          )}

          {/* TAB: KEYBOARD TESTER */}
          {activeTab === 'tester' && (
            <KeyboardTesterView />
          )}

        </main>

        {/* Minimal Distraction-Free Footer */}
        {!settings.hideElements?.footer && (
          <footer className="w-full py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#646669] dark:text-[#646669] select-none border-t border-[#E5E5E5]/50 dark:border-[#222222]/50">
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => handleTabChange('about')}
                className="hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
              >
                about
              </button>
              <button 
                onClick={() => handleTabChange('multiplayer')}
                className="hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
              >
                multiplayer
              </button>
              <button 
                onClick={() => handleTabChange('leaderboards')}
                className="hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
              >
                leaderboards
              </button>
              <button 
                onClick={() => handleTabChange('settings')}
                className="hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
              >
                settings
              </button>
              <button 
                onClick={() => setIsHelpOpen(true)} 
                className="hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
              >
                support
              </button>
              <button 
                onClick={() => setIsCommandPaletteOpen(true)} 
                className="hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
              >
                shortcuts (⌘k)
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleTabChange('settings')} 
                className="hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
              >
                theme
              </button>
              <span>v3.0</span>
            </div>
          </footer>
        )}

      </div>

      {/* Language Selector Modal (Ctrl+Shift+L / Alt+L or Config Bar Trigger) */}
      <LanguageSelectorModal
        isOpen={isLanguageModalOpen}
        currentLanguageId={settings.language || 'english'}
        onSelectLanguage={(pack: LanguagePack) => {
          updateSettings({ language: pack.id });
          startFreshTest(mode, duration, difficulty, category, wordCount, undefined, undefined, pack.id);
        }}
        onClose={() => setIsLanguageModalOpen(false)}
      />

      {/* Command Palette Modal (Ctrl+Shift+P / Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectMode={(m, dur, wc) => {
          if (dur) setDuration(dur);
          if (wc) setWordCount(wc);
          startFreshTest(m, dur, difficulty, category, wc);
          handleTabChange('home');
        }}
        onSelectLanguage={setDictLanguage}
        onSelectTheme={(t) => updateSettings({ themeId: t })}
        onToggleSound={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
        onSelectSoundPack={(p) => updateSettings({ soundPack: p })}
        onTogglePunctuation={() => setPunctuation(p => !p)}
        onToggleNumbers={() => setNumbers(n => !n)}
        onToggleBlindMode={() => updateSettings({ blindMode: !settings.blindMode })}
        onToggleConfidenceMode={() => updateSettings({ confidenceMode: !settings.confidenceMode })}
        onSelectKeymap={(layout) => updateSettings({ keymapLayout: layout })}
        onSelectDifficultyRule={setDifficultyRule}
        onNavigateTab={(tab) => {
          if (tab === 'test') handleTabChange('home');
          else if (tab === 'tester') handleTabChange('tester');
          else if (tab === 'race') handleTabChange('multiplayer');
          else if (tab === 'history') handleTabChange('stats');
          else if (tab === 'profile') handleTabChange('stats');
        }}
        onRestartTest={handleRestart}
        onOpenSettings={() => handleTabChange('settings')}
      />

      {/* Practice Lab Modal */}
      <PracticeModal
        isOpen={isPracticeModalOpen}
        onClose={() => setIsPracticeModalOpen(false)}
        onStartDrill={handleStartDrill}
      />

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

      {/* Settings Modal (Quick drawer) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetAllData={handleResetAll}
        history={activeHistory}
        personalBests={activePersonalBests}
        profile={profile}
      />

      {/* Supabase Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={async (user, prof) => {
          setCurrentUser(user);
          setCurrentProfile(prof);
          supabaseRace.setAuthenticatedUser(user.id);
          const cloudRes = await CloudTypingService.getUserHistory(user.id);
          if (cloudRes.length > 0) {
            setCloudHistory(cloudRes);
          }
          const migrationKey = `typerush_migrated_${user.id}`;
          if (localStorage.getItem(migrationKey) !== 'true' && history.length > 0) {
            setShowMigrationBanner(true);
          }
        }}
      />

    </div>
  );
};

export default App;
