import React, { useState } from 'react';
import { Copy, Check, Users, Play, LogOut, Shield, Zap, Sparkles } from 'lucide-react';
import { RaceRoom, TestDuration, Difficulty, Category } from '../../types/typing';

interface RaceLobbyProps {
  room: RaceRoom;
  localPlayerId: string;
  onSetReady: (ready: boolean) => void;
  onUpdateConfig: (config: Partial<RaceRoom>) => void;
  onStartCountdown: () => void;
  onLeaveRoom: () => void;
}

export const RaceLobby: React.FC<RaceLobbyProps> = ({
  room,
  localPlayerId,
  onSetReady,
  onUpdateConfig,
  onStartCountdown,
  onLeaveRoom,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const localPlayer = room.players[localPlayerId];
  const isHost = room.hostId === localPlayerId;
  const players = Object.values(room.players);
  const bothReady = players.length >= 2 && players.every((p) => p.isReady);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyInviteLink = () => {
    const inviteUrl = `${window.location.origin}${window.location.pathname}?room=${room.code}`;
    navigator.clipboard.writeText(`Join my TYPERUSH 1v1 Race! Room Code: ${room.code} - ${inviteUrl}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 animate-fadeIn font-mono">
      
      {/* Lobby Header */}
      <div className="bg-white dark:bg-[#0f172a]/95 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full inline-block mb-2">
              1v1 HEAD-TO-HEAD DUEL
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Race Lobby
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-1">
              Share the code with your opponent. Both players will race simultaneously on the exact same passage.
            </p>
          </div>

          {/* Room Code Box */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-bold">CODE:</span>
              <span className="text-2xl font-black text-cyan-500 tracking-widest">{room.code}</span>
              <button
                onClick={copyRoomCode}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-400 transition-colors"
                title="Copy Room Code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={copyInviteLink}
              className="text-[11px] text-cyan-500 hover:text-cyan-400 underline decoration-cyan-500/40"
            >
              {copiedLink ? 'Invite Link Copied!' : 'Copy Direct Invite Link'}
            </button>
          </div>
        </div>

        {/* Players Grid (1 v 1 Slots) */}
        <div className="py-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-500" />
              Competitors ({players.length} / 2)
            </span>
            <span className="text-xs text-slate-400">
              {players.filter((p) => p.isReady).length} / {players.length} Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Player 1 (Host) */}
            {players[0] && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-bold flex items-center justify-center shadow-md shadow-cyan-500/20">
                    {players[0].name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{players[0].name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/30 font-bold">
                        HOST
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-sans">
                      {players[0].id === localPlayerId ? 'You' : 'Opponent'}
                    </span>
                  </div>
                </div>

                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                  players[0].isReady 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {players[0].isReady ? 'READY' : 'NOT READY'}
                </span>
              </div>
            )}

            {/* Player 2 (Challenger) */}
            {players[1] ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-600 text-slate-950 font-bold flex items-center justify-center shadow-md shadow-purple-500/20">
                    {players[1].name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{players[1].name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                        CHALLENGER
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-sans">
                      {players[1].id === localPlayerId ? 'You' : 'Opponent'}
                    </span>
                  </div>
                </div>

                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                  players[1].isReady 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {players[1].isReady ? 'READY' : 'NOT READY'}
                </span>
              </div>
            ) : (
              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs text-slate-400 italic">
                Waiting for second player to enter code {room.code}...
              </div>
            )}
          </div>
        </div>

        {/* Host Configuration Panel */}
        <div className="py-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-cyan-500" />
            Race Configuration {isHost ? '(Host Controlled)' : '(Locked by Host)'}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block mb-1">Duration:</span>
              <div className="flex gap-1">
                {[15, 30, 60].map((d) => (
                  <button
                    key={d}
                    disabled={!isHost}
                    onClick={() => onUpdateConfig({ duration: d as TestDuration })}
                    className={`px-2.5 py-1 rounded-lg border font-bold ${
                      room.duration === d
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                    }`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">Difficulty:</span>
              <div className="flex gap-1">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    disabled={!isHost}
                    onClick={() => onUpdateConfig({ difficulty: diff })}
                    className={`px-2 py-1 rounded-lg border font-bold capitalize ${
                      room.difficulty === diff
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">Category:</span>
              <span className="font-bold text-slate-900 dark:text-white uppercase">
                {room.category}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">Passage Length:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {room.passage.split(' ').length} words
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onLeaveRoom}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            Leave Room
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isHost && (
              <button
                onClick={() => onSetReady(!localPlayer?.isReady)}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                  localPlayer?.isReady
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
                    : 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                }`}
              >
                {localPlayer?.isReady ? 'READY · CLICK TO UNREADY' : 'MARK READY'}
              </button>
            )}

            {isHost && (
              <button
                onClick={onStartCountdown}
                disabled={players.length < 2}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  players.length >= 2
                    ? 'bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{players.length < 2 ? 'WAITING FOR OPPONENT' : 'START 1V1 RACE'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
