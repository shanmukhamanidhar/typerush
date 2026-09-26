import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  Play, 
  Key, 
  PlusCircle, 
  LogIn, 
  Sliders, 
  RotateCw, 
  History, 
  Zap,
  Globe,
  Radio
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { RaceRoom, TestDuration, Difficulty } from '../../types/typing';
import { supabaseRace, MultiplayerMatchHistoryItem } from '../../services/supabaseRace';
import { UserProfileData } from '../../services/authService';
import { RaceLobby } from './RaceLobby';
import { RaceStage } from './RaceStage';
import { RaceResults } from './RaceResults';

interface RaceViewProps {
  displayName: string;
  avatarStyle: string;
  currentUser?: User | null;
  currentProfile?: UserProfileData | null;
}

export const RaceView: React.FC<RaceViewProps> = ({ 
  displayName, 
  avatarStyle,
  currentUser,
  currentProfile
}) => {
  const [room, setRoom] = useState<RaceRoom | null>(null);
  const [activeTab, setActiveTab] = useState<'quick' | 'create' | 'join' | 'history'>('quick');
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const initialName = currentProfile?.username || displayName || 'Racer';
  const [nameInput, setNameInput] = useState<string>(initialName);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [matchHistory, setMatchHistory] = useState<MultiplayerMatchHistoryItem[]>([]);

  // Room creation settings
  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [duration, setDuration] = useState<TestDuration>(30);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  // Load match history
  useEffect(() => {
    setMatchHistory(supabaseRace.getMatchHistory());
  }, [room]);

  // Sync authenticated player details
  useEffect(() => {
    if (currentUser?.id) {
      supabaseRace.setAuthenticatedUser(currentUser.id);
    }
    const targetName = currentProfile?.username || displayName;
    if (targetName) {
      setNameInput(targetName);
    }
  }, [currentUser, currentProfile, displayName]);

  // Auto-fill from URL query param if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('room');
    if (codeParam) {
      setJoinCodeInput(codeParam.toUpperCase());
      setActiveTab('join');
    }
  }, []);

  // Subscribe to realtime room updates
  useEffect(() => {
    const unsubscribe = supabaseRace.subscribe((updatedRoom) => {
      setRoom(updatedRoom);
    });
    return () => unsubscribe();
  }, []);

  const handleQuickMatch = async () => {
    if (!nameInput.trim()) {
      setErrorMsg('Please enter a display name to join multiplayer.');
      return;
    }
    setErrorMsg(null);
    setInfoMsg(null);
    setIsSearching(true);

    const result = await supabaseRace.findQuickMatch(nameInput.trim(), avatarStyle);
    setIsSearching(false);

    if (!result.success) {
      setInfoMsg(result.message || 'No active opponents found in queue.');
    }
  };

  const handleCreateRoom = () => {
    if (!nameInput.trim()) {
      setErrorMsg('Please enter a display name.');
      return;
    }
    setErrorMsg(null);
    setInfoMsg(null);
    supabaseRace.createRoom(nameInput.trim(), avatarStyle, {
      duration,
      difficulty,
      category: 'general',
      testMode: 'time',
      maxPlayers,
    });
  };

  const handleJoinRoom = async () => {
    if (!nameInput.trim()) {
      setErrorMsg('Please enter a display name.');
      return;
    }
    if (!joinCodeInput.trim() || joinCodeInput.trim().length < 4) {
      setErrorMsg('Please enter a valid 5-character room code.');
      return;
    }
    setErrorMsg(null);
    setInfoMsg(null);
    setIsJoining(true);
    const success = await supabaseRace.joinRoom(joinCodeInput.trim(), nameInput.trim(), avatarStyle);
    setIsJoining(false);
    if (!success) {
      setErrorMsg('Could not find active room with that code. Please verify code or ensure host is online.');
    }
  };

  const localPlayerId = supabaseRace.getPlayerId();
  const connectionMode = supabaseRace.getConnectionMode();

  // If currently in a room, render the corresponding stage
  if (room) {
    if (room.status === 'lobby') {
      return (
        <RaceLobby
          room={room}
          localPlayerId={localPlayerId}
          onSetReady={(ready) => supabaseRace.setReady(ready)}
          onUpdateConfig={(config) => supabaseRace.updateConfig(config)}
          onStartCountdown={() => supabaseRace.startRaceCountdown()}
          onLeaveRoom={() => supabaseRace.leaveRoom()}
        />
      );
    }

    if (room.status === 'countdown' || room.status === 'racing') {
      return (
        <RaceStage
          room={room}
          localPlayerId={localPlayerId}
          onUpdateProgress={(prog, wpm, acc, sec) => supabaseRace.updateProgress(prog, wpm, acc, sec)}
          onFinishRace={(wpm, acc, metrics) => supabaseRace.finishRace(wpm, acc, metrics)}
        />
      );
    }

    if (room.status === 'completed') {
      return (
        <RaceResults
          room={room}
          localPlayerId={localPlayerId}
          onRequestRematch={() => supabaseRace.requestRematch()}
          onLeaveRoom={() => supabaseRace.leaveRoom()}
        />
      );
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8 font-mono select-none animate-fadeIn text-[#111111] dark:text-[#F5F5F5]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E5E5E5] dark:border-[#222222]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Radio className="w-4 h-4 text-[#FF5A00] animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-[#FF5A00] font-bold">
              Real-Time Multiplayer
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Typing Arena
          </h1>
          <p className="text-xs text-[#646669] dark:text-[#A1A1A1] mt-1">
            Synchronized countdowns, identical passages, and live progress tracking with zero fake bots.
          </p>
        </div>

        {/* Connection Status Badge */}
        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.02] dark:bg-white/[0.02]">
            <span className="w-2 h-2 rounded-full bg-[#FF5A00]" />
            <span className="text-[#646669] dark:text-[#A1A1A1]">
              {connectionMode === 'supabase' ? 'Supabase Realtime' : 'Local Multi-tab Network'}
            </span>
          </div>
        </div>
      </div>

      {/* Racer Call-Sign / Name Input */}
      <div className="mb-6 p-4 rounded-xl border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.01] dark:bg-white/[0.01]">
        <label className="text-[11px] text-[#646669] dark:text-[#A1A1A1] uppercase tracking-wider font-bold block mb-1.5">
          Your Call-sign
        </label>
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          maxLength={18}
          className="w-full bg-transparent border-b border-[#E5E5E5] dark:border-[#333333] pb-1 text-sm font-bold text-[#111111] dark:text-[#F5F5F5] focus:outline-none focus:border-[#FF5A00] transition-colors"
          placeholder="Enter display name"
        />
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-3 mb-6 rounded-lg border border-[#FF3B5C]/30 bg-[#FF3B5C]/10 text-[#FF3B5C] text-xs font-bold text-center">
          {errorMsg}
        </div>
      )}
      {infoMsg && (
        <div className="p-3 mb-6 rounded-lg border border-[#FF5A00]/30 bg-[#FF5A00]/10 text-[#FF5A00] text-xs font-bold text-center">
          {infoMsg}
        </div>
      )}

      {/* Mode Navigation Tabs */}
      <div className="flex border-b border-[#E5E5E5] dark:border-[#222222] mb-8 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => { setActiveTab('quick'); setErrorMsg(null); setInfoMsg(null); }}
          className={`pb-3 px-4 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'quick'
              ? 'border-[#FF5A00] text-[#FF5A00]'
              : 'border-transparent text-[#646669] dark:text-[#A1A1A1] hover:text-[#111111] dark:hover:text-[#F5F5F5]'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Quick Match</span>
        </button>

        <button
          onClick={() => { setActiveTab('create'); setErrorMsg(null); setInfoMsg(null); }}
          className={`pb-3 px-4 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'create'
              ? 'border-[#FF5A00] text-[#FF5A00]'
              : 'border-transparent text-[#646669] dark:text-[#A1A1A1] hover:text-[#111111] dark:hover:text-[#F5F5F5]'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Create Room</span>
        </button>

        <button
          onClick={() => { setActiveTab('join'); setErrorMsg(null); setInfoMsg(null); }}
          className={`pb-3 px-4 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'join'
              ? 'border-[#FF5A00] text-[#FF5A00]'
              : 'border-transparent text-[#646669] dark:text-[#A1A1A1] hover:text-[#111111] dark:hover:text-[#F5F5F5]'
          }`}
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Join Room</span>
        </button>

        <button
          onClick={() => { setActiveTab('history'); setErrorMsg(null); setInfoMsg(null); }}
          className={`pb-3 px-4 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'history'
              ? 'border-[#FF5A00] text-[#FF5A00]'
              : 'border-transparent text-[#646669] dark:text-[#A1A1A1] hover:text-[#111111] dark:hover:text-[#F5F5F5]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Match History</span>
        </button>
      </div>

      {/* TAB 1: QUICK MATCH */}
      {activeTab === 'quick' && (
        <div className="p-6 sm:p-8 rounded-xl border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.01] dark:bg-white/[0.01] space-y-6">
          <div>
            <h2 className="text-base font-bold mb-1">Instant Matchmaking</h2>
            <p className="text-xs text-[#646669] dark:text-[#A1A1A1] leading-relaxed">
              Find an open room waiting for opponents. TypeRush connects strictly with real connected competitors.
            </p>
          </div>

          <div className="py-6 text-center border-y border-[#E5E5E5] dark:border-[#222222]">
            {isSearching ? (
              <div className="space-y-3">
                <RotateCw className="w-6 h-6 text-[#FF5A00] animate-spin mx-auto" />
                <span className="text-xs uppercase tracking-widest text-[#FF5A00] font-bold block">
                  Searching for open lobbies...
                </span>
                <p className="text-[11px] text-[#646669]">Checking active Supabase channels and local tabs</p>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-xs text-[#646669] block">
                  Click below to scan for available lobbies
                </span>
                <button
                  onClick={handleQuickMatch}
                  className="px-6 py-3 rounded-lg bg-[#FF5A00] text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Find Match</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-[#646669] pt-2">
            <span>Prefer a private game?</span>
            <button
              onClick={() => setActiveTab('create')}
              className="text-[#FF5A00] hover:underline cursor-pointer font-bold"
            >
              Host a room →
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CREATE ROOM */}
      {activeTab === 'create' && (
        <div className="p-6 sm:p-8 rounded-xl border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.01] dark:bg-white/[0.01] space-y-6">
          <div>
            <h2 className="text-base font-bold mb-1">Host a Room</h2>
            <p className="text-xs text-[#646669] dark:text-[#A1A1A1]">
              Generate a unique 5-letter room code to share with friends or another browser window.
            </p>
          </div>

          {/* Duration Selector */}
          <div>
            <label className="text-[11px] text-[#646669] dark:text-[#A1A1A1] uppercase tracking-wider font-bold block mb-2">
              Race Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 30, 60, 120].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d as TestDuration)}
                  className={`py-2 rounded border font-mono font-bold text-xs transition-colors cursor-pointer ${
                    duration === d
                      ? 'bg-[#FF5A00] text-black border-[#FF5A00]'
                      : 'border-[#E5E5E5] dark:border-[#222222] text-[#646669] hover:text-[#111111] dark:hover:text-[#F5F5F5]'
                  }`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-[11px] text-[#646669] dark:text-[#A1A1A1] uppercase tracking-wider font-bold block mb-2">
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 rounded border font-mono font-bold text-xs capitalize transition-colors cursor-pointer ${
                    difficulty === diff
                      ? 'bg-[#FF5A00] text-black border-[#FF5A00]'
                      : 'border-[#E5E5E5] dark:border-[#222222] text-[#646669] hover:text-[#111111] dark:hover:text-[#F5F5F5]'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Max Competitors */}
          <div>
            <label className="text-[11px] text-[#646669] dark:text-[#A1A1A1] uppercase tracking-wider font-bold block mb-2">
              Max Competitors
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 4, 6].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setMaxPlayers(p)}
                  className={`py-2 rounded border font-mono font-bold text-xs transition-colors cursor-pointer ${
                    maxPlayers === p
                      ? 'bg-[#FF5A00] text-black border-[#FF5A00]'
                      : 'border-[#E5E5E5] dark:border-[#222222] text-[#646669] hover:text-[#111111] dark:hover:text-[#F5F5F5]'
                  }`}
                >
                  {p} Players
                </button>
              ))}
            </div>
          </div>

          {/* Action */}
          <button
            onClick={handleCreateRoom}
            className="w-full py-3 rounded-lg bg-[#FF5A00] text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Create Lobby</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 3: JOIN ROOM */}
      {activeTab === 'join' && (
        <div className="p-6 sm:p-8 rounded-xl border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.01] dark:bg-white/[0.01] space-y-6">
          <div>
            <h2 className="text-base font-bold mb-1">Enter Room Code</h2>
            <p className="text-xs text-[#646669] dark:text-[#A1A1A1]">
              Enter the 5-character code provided by the host.
            </p>
          </div>

          <div>
            <input
              type="text"
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
              maxLength={5}
              placeholder="e.g. X7K9P"
              className="w-full bg-transparent border-b-2 border-[#E5E5E5] dark:border-[#333333] py-2 text-center text-2xl font-black text-[#FF5A00] tracking-widest uppercase focus:outline-none focus:border-[#FF5A00] transition-colors"
            />
          </div>

          <button
            onClick={handleJoinRoom}
            disabled={isJoining}
            className="w-full py-3 rounded-lg bg-[#FF5A00] text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isJoining ? 'Connecting...' : 'Join Room'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 4: MATCH HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#646669]">
            <span>Recent Multiplayer Matches</span>
            <span>{matchHistory.length} recorded</span>
          </div>

          {matchHistory.length > 0 ? (
            <div className="overflow-x-auto border border-[#E5E5E5] dark:border-[#222222] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E5E5E5] dark:border-[#222222] text-[10px] text-[#646669] uppercase">
                    <th className="py-2.5 px-3">Room</th>
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">Speed</th>
                    <th className="py-2.5 px-3">Accuracy</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]/50 dark:divide-[#222222]/50">
                  {matchHistory.map((item) => (
                    <tr key={item.id} className="hover:text-[#FF5A00] transition-colors">
                      <td className="py-2.5 px-3 font-bold text-[#FF5A00]">{item.roomCode}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          item.rank === 1 ? 'bg-[#FF5A00]/15 text-[#FF5A00]' : 'text-[#646669]'
                        }`}>
                          #{item.rank} of {item.totalPlayers}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold">{item.wpm} WPM</td>
                      <td className="py-2.5 px-3">{item.accuracy.toFixed(1)}%</td>
                      <td className="py-2.5 px-3 text-[#646669]">{item.duration}s</td>
                      <td className="py-2.5 px-3 text-right text-[#646669]">
                        {new Date(item.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center rounded-xl border border-[#E5E5E5] dark:border-[#222222] text-xs text-[#646669]">
              No multiplayer matches recorded yet. Complete a match to view history.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
