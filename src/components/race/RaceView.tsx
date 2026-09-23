import React, { useState, useEffect } from 'react';
import { Zap, Users, ArrowRight, ShieldCheck, Play, Key, Sparkles } from 'lucide-react';
import { RaceRoom, TestDuration, Difficulty, Category } from '../../types/typing';
import { supabaseRace } from '../../services/supabaseRace';
import { RaceLobby } from './RaceLobby';
import { RaceStage } from './RaceStage';
import { RaceResults } from './RaceResults';

interface RaceViewProps {
  displayName: string;
  avatarStyle: string;
}

export const RaceView: React.FC<RaceViewProps> = ({ displayName, avatarStyle }) => {
  const [room, setRoom] = useState<RaceRoom | null>(null);
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [nameInput, setNameInput] = useState<string>(displayName || 'Racer');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState<boolean>(false);

  // Auto-fill from URL query param if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('room');
    if (codeParam) {
      setJoinCodeInput(codeParam.toUpperCase());
    }
  }, []);

  // Subscribe to realtime room updates
  useEffect(() => {
    const unsubscribe = supabaseRace.subscribe((updatedRoom) => {
      setRoom(updatedRoom);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateRoom = () => {
    setErrorMsg(null);
    const code = supabaseRace.createRoom(nameInput, avatarStyle, {
      duration: 30,
      difficulty: 'medium',
      category: 'general',
      testMode: 'time',
    });
  };

  const handleJoinRoom = async () => {
    if (!joinCodeInput.trim()) {
      setErrorMsg('Please enter a valid 5-character room code.');
      return;
    }
    setErrorMsg(null);
    setIsJoining(true);
    const success = await supabaseRace.joinRoom(joinCodeInput.trim(), nameInput, avatarStyle);
    setIsJoining(false);
    if (!success) {
      setErrorMsg('Could not find active race room with that code. Please verify and retry.');
    }
  };

  const localPlayerId = supabaseRace.getPlayerId();

  // If in Room, render appropriate stage
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
          onUpdateProgress={(prog, wpm, acc) => supabaseRace.updateProgress(prog, wpm, acc)}
          onFinishRace={(wpm, acc) => supabaseRace.finishRace(wpm, acc)}
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

  // Pre-Room Setup Menu
  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 animate-fadeIn font-mono">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Realtime 1v1 Arena</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          1v1 TYPING <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">RACE</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans max-w-md mx-auto mt-2">
          Challenge friends or rival typists in real time. Powered by Supabase Realtime Channels with local dual-tab fallback.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs text-center font-sans">
          {errorMsg}
        </div>
      )}

      {/* Name Input */}
      <div className="bg-white dark:bg-[#0f172a]/95 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm mb-6">
        <label className="text-xs text-slate-400 font-bold uppercase block mb-2">
          Your Racer Call-Sign:
        </label>
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          maxLength={18}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
          placeholder="Enter display name"
        />
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Create Room */}
        <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all">
          <div>
            <div className="p-3 w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create 1v1 Room</h3>
            <p className="text-xs text-slate-500 font-sans mt-1">
              Host a new match, configure duration and difficulty, and invite an opponent with a 5-digit code.
            </p>
          </div>

          <button
            onClick={handleCreateRoom}
            className="w-full mt-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>HOST RACE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Join Room */}
        <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all">
          <div>
            <div className="p-3 w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-4">
              <Key className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Join Existing Room</h3>
            <p className="text-xs text-slate-500 font-sans mt-1">
              Enter your opponent's 5-digit room code to join their lobby immediately.
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <input
              type="text"
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
              maxLength={5}
              placeholder="ROOM CODE (e.g. X7K92)"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-center text-sm font-bold text-cyan-400 tracking-widest uppercase focus:outline-none focus:border-cyan-500"
            />

            <button
              onClick={handleJoinRoom}
              disabled={isJoining}
              className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <span>{isJoining ? 'CONNECTING...' : 'JOIN RACE'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      <div className="mt-8 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-sans">
        <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
        <span>1v1 Synchronization via Supabase Realtime Channels. Dual-tab cross-window racing supported out of the box.</span>
      </div>
    </div>
  );
};
