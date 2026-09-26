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
    { id: 'cyan', label: 'Precision Orange', gradient: 'from-[#FF5A00] to-[#D95400] shadow-[#FF5A00]/30' },
    { id: 'neon', label: 'Solar Orange', gradient: 'from-[#FF6E1A] to-[#FF5A00] shadow-[#FF6E1A]/30' },
    { id: 'purple', label: 'Dark Flame', gradient: 'from-[#FF6E1A] to-[#993C00] shadow-[#FF6E1A]/30' },
    { id: 'sunset', label: 'Solar Sunset', gradient: 'from-[#FFA347] to-[#D95400] shadow-[#D95400]/30' },
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
      <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-6 sm:p-8 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
          
          {/* Avatar with selected gradient */}
          <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${currentGradient} text-black font-black text-2xl flex items-center justify-center shadow-lg`}>
            {initials}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF5A00] bg-[#FF5A00]/10 border border-[#FF5A00]/30 px-2 py-0.5 rounded-full inline-block mb-1">
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
                    className="bg-[#F7F7F7] dark:bg-[#080808] border border-[#E5E5E5] dark:border-[#2A2A2A] px-3 py-1 rounded-lg text-lg font-bold text-[#111111] dark:text-white focus:outline-none focus:border-[#FF5A00]"
                    autoFocus
                  />
                  <button
                    onClick={saveName}
                    className="p-1.5 rounded-lg bg-[#FF5A00] text-black hover:brightness-110 font-bold"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-[#111111] dark:text-white">
                    {profile.displayName}
                  </h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 rounded-lg text-[#666666] dark:text-[#A1A1AA] hover:text-[#FF5A00] transition-colors"
                    title="Edit display name"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            <p className="text-xs text-[#666666] dark:text-[#A1A1AA] font-sans">
              Welcome back, {profile.displayName}. All performance telemetry is computed locally in this browser.
            </p>

            {/* Avatar Style Picker */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="text-[10px] text-[#666666] dark:text-[#71717A] uppercase font-bold">Avatar Color:</span>
              {avatarStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => onUpdateProfile({ avatarStyle: style.id })}
                  className={`w-5 h-5 rounded-full bg-gradient-to-br ${style.gradient} transition-transform ${
                    profile.avatarStyle === style.id ? 'scale-125 ring-2 ring-[#FF5A00]' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={style.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
          <div className="p-3 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] uppercase font-bold">Tests Completed</span>
            <div className="text-2xl font-black text-[#111111] dark:text-white mt-0.5">{testsCompleted}</div>
          </div>

          <div className="p-3 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] uppercase font-bold">Average Speed</span>
            <div className="text-2xl font-black text-[#FF5A00] mt-0.5">{avgWpm} <span className="text-xs text-[#666666] dark:text-[#71717A]">WPM</span></div>
          </div>

          <div className="p-3 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] uppercase font-bold">Average Accuracy</span>
            <div className="text-2xl font-black text-[#FF6E1A] mt-0.5">{avgAcc}%</div>
          </div>

          <div className="p-3 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] uppercase font-bold">Total Time Typing</span>
            <div className="text-2xl font-black text-[#111111] dark:text-white mt-0.5">{totalMinutes} <span className="text-xs text-[#666666] dark:text-[#71717A]">min</span></div>
          </div>
        </div>
      </div>

      {/* Personal Goal Progress Card */}
      <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-6 sm:p-8 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase text-[#111111] dark:text-white flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#FF5A00]" />
              Active Goal
            </h3>
            <span className="text-xs text-[#666666] dark:text-[#A1A1AA] font-sans">
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
                    ? 'bg-[#FF5A00] text-black border-[#FF5A00] shadow-sm font-black'
                    : 'bg-[#F7F7F7] dark:bg-[#080808] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                {g.title}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xs text-[#666666] dark:text-[#A1A1AA] font-bold">{selectedGoal.title}</span>
            <span className="text-sm font-black text-[#FF5A00]">
              CURRENT: {currentVal} {selectedGoal.type === 'wpm' ? 'WPM' : '%'} · GOAL: {selectedGoal.target} ({goalProgress}%)
            </span>
          </div>
          <div className="w-full bg-[#E5E5E5] dark:bg-[#2A2A2A] rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[#FF5A00] h-full rounded-full transition-all duration-300 shadow-sm shadow-[#FF5A00]/40"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Achievements Showcase */}
      <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
          <div>
            <h3 className="text-sm font-bold uppercase text-[#111111] dark:text-white flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-[#FF5A00]" />
              Achievements Showcase
            </h3>
            <span className="text-xs text-[#666666] dark:text-[#A1A1AA] font-sans">
              Unlocked based on verified local test telemetry.
            </span>
          </div>
          <span className="text-xs text-[#666666] dark:text-[#71717A]">
            {achievements.filter((a) => a.unlockedAt).length} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {achievements.map((item) => {
            const isUnlocked = Boolean(item.unlockedAt);
            return (
              <div
                key={item.id}
                className={`p-4 rounded-lg border transition-all ${
                  isUnlocked
                    ? 'bg-[#FF5A00]/10 border-[#FF5A00]/40 shadow-sm'
                    : 'bg-[#F7F7F7] dark:bg-[#080808] border-[#E5E5E5] dark:border-[#2A2A2A] opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-[#FF5A00]/20 text-[#FF5A00]' : 'bg-[#E5E5E5] dark:bg-[#2A2A2A] text-[#666666] dark:text-[#71717A]'}`}>
                    {isUnlocked ? <Sparkles className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <span className={`text-[9px] font-bold uppercase font-mono px-1.5 py-0.5 rounded border ${isUnlocked ? 'border-[#FF5A00]/40 text-[#FF5A00]' : 'border-[#E5E5E5] dark:border-[#2A2A2A] text-[#666666] dark:text-[#71717A]'}`}>
                    {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                </div>

                <div className="font-bold text-xs text-[#111111] dark:text-white mb-1">
                  {item.title}
                </div>
                <div className="text-[11px] text-[#666666] dark:text-[#A1A1AA] font-sans line-clamp-2">
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
