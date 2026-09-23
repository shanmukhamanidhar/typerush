import React, { useState } from 'react';
import { 
  User, 
  Trophy, 
  Award, 
  Target, 
  Gauge, 
  Clock, 
  Edit3, 
  Check, 
  Flame, 
  Sparkles, 
  Lock, 
  Terminal, 
  Calendar 
} from 'lucide-react';
import { UserProfile, Goal, Achievement, TestResult, PersonalBests } from '../types/typing';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (newProfile: Partial<UserProfile>) => void;
  history: TestResult[];
  personalBests: PersonalBests;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  history,
  personalBests,
}) => {
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(profile.displayName);

  const saveName = () => {
    if (nameInput.trim()) {
      onUpdateProfile({ displayName: nameInput.trim() });
    }
    setIsEditingName(false);
  };

  const avatarStyles: { id: UserProfile['avatarStyle']; label: string; gradient: string }[] = [
    { id: 'cyan', label: 'Electric Cyan', gradient: 'from-cyan-400 to-blue-600 shadow-cyan-500/30' },
    { id: 'neon', label: 'Neon Mint', gradient: 'from-teal-300 to-emerald-600 shadow-emerald-500/30' },
    { id: 'purple', label: 'Cosmic Violet', gradient: 'from-purple-400 to-indigo-600 shadow-purple-500/30' },
    { id: 'sunset', label: 'Solar Sunset', gradient: 'from-amber-400 to-rose-600 shadow-rose-500/30' },
  ];

  const currentGradient = avatarStyles.find((s) => s.id === profile.avatarStyle)?.gradient || avatarStyles[0].gradient;

  const initials = profile.displayName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'TR';

  // Lifetime Stats
  const testsCompleted = history.length;
  const avgWpm = testsCompleted > 0 ? Math.round(history.reduce((a, b) => a + b.wpm, 0) / testsCompleted) : 0;
  const avgAcc = testsCompleted > 0 ? parseFloat((history.reduce((a, b) => a + b.accuracy, 0) / testsCompleted).toFixed(1)) : 0;
  const totalChars = history.reduce((a, b) => a + b.totalChars, 0);
  const totalSeconds = history.reduce((a, b) => a + (b.duration || 30), 0);
  const totalMinutes = (totalSeconds / 60).toFixed(1);

  // Goals
  const availableGoals: Goal[] = [
    { id: 'g-80', title: 'Reach 80 WPM', type: 'wpm', target: 80 },
    { id: 'g-90', title: 'Reach 90 WPM', type: 'wpm', target: 90 },
    { id: 'g-100', title: 'Reach 100 WPM', type: 'wpm', target: 100 },
    { id: 'g-95acc', title: 'Maintain 95% Accuracy', type: 'accuracy', target: 95 },
  ];

  const selectedGoal = availableGoals.find((g) => g.id === profile.selectedGoalId) || availableGoals[0];
  
  let currentVal = 0;
  if (selectedGoal.type === 'wpm') currentVal = personalBests.bestWpm;
  if (selectedGoal.type === 'accuracy') currentVal = personalBests.bestAccuracy;
  const goalProgress = Math.min(100, Math.round((currentVal / selectedGoal.target) * 100));

  // Achievements Definition & Evaluation
  const achievements: Achievement[] = [
    {
      id: 'first_test',
      title: 'FIRST TEST',
      description: 'Complete your first typing test.',
      iconName: 'zap',
      unlockedAt: testsCompleted >= 1 ? 1 : undefined,
    },
    {
      id: 'speedster',
      title: 'SPEEDSTER',
      description: 'Reach 80 Net WPM in any test.',
      iconName: 'flame',
      unlockedAt: personalBests.bestWpm >= 80 ? 1 : undefined,
    },
    {
      id: 'lightning',
      title: 'LIGHTNING',
      description: 'Surpass 100 Net WPM.',
      iconName: 'award',
      unlockedAt: personalBests.bestWpm >= 100 ? 1 : undefined,
    },
    {
      id: 'precision',
      title: 'PRECISION',
      description: 'Achieve 98% or higher accuracy.',
      iconName: 'target',
      unlockedAt: personalBests.bestAccuracy >= 98 ? 1 : undefined,
    },
    {
      id: 'consistent',
      title: 'CONSISTENT',
      description: 'Complete 10 typing sessions.',
      iconName: 'clock',
      unlockedAt: testsCompleted >= 10 ? 1 : undefined,
    },
    {
      id: 'dedicated',
      title: 'DEDICATED',
      description: 'Complete 25 typing sessions.',
      iconName: 'trophy',
      unlockedAt: testsCompleted >= 25 ? 1 : undefined,
    },
    {
      id: 'code_master',
      title: 'CODE MASTER',
      description: 'Complete a Code Mode test.',
      iconName: 'terminal',
      unlockedAt: history.some((h) => h.mode === 'code') ? 1 : undefined,
    },
    {
      id: 'daily_champ',
      title: 'DAILY CHAMPION',
      description: 'Complete a Daily Challenge.',
      iconName: 'calendar',
      unlockedAt: history.some((h) => h.mode === 'daily') ? 1 : undefined,
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 animate-fadeIn font-mono">
      
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-[#0f172a]/95 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          
          {/* Avatar with selected gradient */}
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${currentGradient} text-slate-950 font-extrabold text-2xl flex items-center justify-center shadow-lg`}>
            {initials}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full inline-block mb-1">
              LOCAL COMPETITOR PROFILE
            </span>

            {/* Display Name Editor */}
            <div className="flex items-center justify-center sm:justify-start gap-2 my-1">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    maxLength={20}
                    className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-1 rounded-xl text-lg font-bold text-slate-900 dark:text-white"
                    autoFocus
                  />
                  <button
                    onClick={saveName}
                    className="p-1.5 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    {profile.displayName}
                  </h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 rounded-lg text-slate-400 hover:text-cyan-500 transition-colors"
                    title="Edit display name"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            <p className="text-xs text-slate-500 font-sans">
              Welcome back, {profile.displayName}. All performance telemetry is computed locally in this browser.
            </p>

            {/* Avatar Style Picker */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="text-[10px] text-slate-400 uppercase">Avatar Color:</span>
              {avatarStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => onUpdateProfile({ avatarStyle: style.id })}
                  className={`w-5 h-5 rounded-full bg-gradient-to-br ${style.gradient} transition-transform ${
                    profile.avatarStyle === style.id ? 'scale-125 ring-2 ring-cyan-400' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={style.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase">Tests Completed</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{testsCompleted}</div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase">Average Speed</span>
            <div className="text-2xl font-black text-cyan-500 mt-0.5">{avgWpm} <span className="text-xs text-slate-400">WPM</span></div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase">Average Accuracy</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{avgAcc}%</div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase">Total Time Typing</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{totalMinutes} <span className="text-xs text-slate-400">min</span></div>
          </div>
        </div>
      </div>

      {/* Personal Goal Progress Card */}
      <div className="bg-white dark:bg-[#0f172a]/95 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white flex items-center gap-1.5">
              <Target className="w-4 h-4 text-cyan-500" />
              Active Goal
            </h3>
            <span className="text-xs text-slate-400 font-sans">
              Choose your current objective to track automated progress.
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {availableGoals.map((g) => (
              <button
                key={g.id}
                onClick={() => onUpdateProfile({ selectedGoalId: g.id })}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                  selectedGoal.id === g.id
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {g.title}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xs text-slate-500 font-bold">{selectedGoal.title}</span>
            <span className="text-sm font-black text-cyan-500">
              CURRENT: {currentVal} {selectedGoal.type === 'wpm' ? 'WPM' : '%'} · GOAL: {selectedGoal.target} ({goalProgress}%)
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Achievements Showcase */}
      <div className="bg-white dark:bg-[#0f172a]/95 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              Achievements Showcase
            </h3>
            <span className="text-xs text-slate-400 font-sans">
              Unlocked based on verified local test telemetry.
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {achievements.filter((a) => a.unlockedAt).length} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {achievements.map((item) => {
            const isUnlocked = Boolean(item.unlockedAt);
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-cyan-500/10 border-cyan-500/40 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/60 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${isUnlocked ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                    {isUnlocked ? <Sparkles className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <span className="text-[9px] font-bold uppercase font-mono px-1.5 py-0.5 rounded border border-current opacity-70">
                    {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                </div>

                <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans line-clamp-2">
                  {item.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
