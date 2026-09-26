import React, { useState } from 'react';
import { Copy, Check, Users, Play, LogOut, Radio } from 'lucide-react';
import { RaceRoom, TestDuration, Difficulty } from '../../types/typing';

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
  const maxCapacity = room.maxPlayers || 6;
  const readyCount = players.filter((p) => p.isReady).length;
  const canStart = players.length >= 2;

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyInviteLink = () => {
    const inviteUrl = `${window.location.origin}${window.location.pathname}?room=${room.code}#/multiplayer`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 select-none font-mono animate-fadeIn text-[#111111] dark:text-[#F5F5F5]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E5E5E5] dark:border-[#222222]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Radio className="w-3.5 h-3.5 text-[#FF5A00] animate-pulse" />
            <span className="text-[11px] uppercase tracking-widest text-[#FF5A00] font-bold">
              Multiplayer Lobby
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Room {room.code}
          </h1>
          <p className="text-xs text-[#646669] dark:text-[#A1A1A1] mt-1">
            Share this code. All competitors type the identical test passage simultaneously.
          </p>
        </div>

        {/* Room Code Display */}
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-lg border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.02] dark:bg-white/[0.02] flex items-center gap-3">
            <span className="text-xs text-[#646669] dark:text-[#A1A1A1] uppercase font-bold">CODE:</span>
            <span className="text-xl font-black text-[#FF5A00] tracking-widest">{room.code}</span>
          </div>

          <button
            onClick={copyRoomCode}
            className="p-2.5 rounded-lg border border-[#E5E5E5] dark:border-[#222222] hover:text-[#FF5A00] transition-colors cursor-pointer"
            title="Copy room code"
          >
            {copiedCode ? <Check className="w-4 h-4 text-[#FF5A00]" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={copyInviteLink}
            className="px-3 py-2 rounded-lg border border-[#E5E5E5] dark:border-[#222222] text-xs hover:text-[#FF5A00] transition-colors cursor-pointer"
          >
            {copiedLink ? 'Link Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Connected Players Roster */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="text-[#646669] dark:text-[#A1A1A1] font-bold flex items-center gap-1.5 uppercase">
            <Users className="w-4 h-4 text-[#FF5A00]" />
            Racers ({players.length} / {maxCapacity})
          </span>
          <span className="text-[#FF5A00] font-bold">
            {readyCount} of {players.length} Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {players.map((p, idx) => {
            const isLocal = p.id === localPlayerId;
            const isConnected = p.isConnected !== false;

            return (
              <div
                key={p.id}
                className={`p-3.5 rounded-xl border transition-colors flex items-center justify-between ${
                  isLocal
                    ? 'border-[#FF5A00] bg-[#FF5A00]/5'
                    : 'border-[#E5E5E5] dark:border-[#222222] bg-black/[0.01] dark:bg-white/[0.01]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isLocal ? 'bg-[#FF5A00] text-black' : 'bg-black/10 dark:bg-white/10 text-[#111111] dark:text-[#F5F5F5]'
                  }`}>
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs truncate max-w-[110px]">
                        {p.name}
                      </span>
                      {p.isHost && (
                        <span className="text-[9px] uppercase px-1 rounded border border-[#FF5A00]/40 text-[#FF5A00] font-bold">
                          host
                        </span>
                      )}
                      {isLocal && (
                        <span className="text-[9px] uppercase px-1 rounded bg-[#FF5A00]/15 text-[#FF5A00] font-bold">
                          you
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-[#646669] mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-[#FF5A00]' : 'bg-[#646669]'}`} />
                      <span>{isConnected ? 'connected' : 'disconnected'}</span>
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  p.isReady
                    ? 'border-[#FF5A00] text-[#FF5A00] bg-[#FF5A00]/10'
                    : 'border-[#E5E5E5] dark:border-[#333333] text-[#646669]'
                }`}>
                  {p.isReady ? '● Ready' : '○ Waiting'}
                </span>
              </div>
            );
          })}

          {/* Empty slot placeholders */}
          {Array.from({ length: Math.max(0, maxCapacity - players.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="p-3.5 rounded-xl border border-dashed border-[#E5E5E5] dark:border-[#222222] flex items-center gap-2.5 text-xs text-[#646669] opacity-40"
            >
              <div className="w-8 h-8 rounded-lg border border-dashed border-[#646669] flex items-center justify-center text-[10px]">
                {players.length + i + 1}
              </div>
              <span className="italic text-[11px]">waiting for competitor...</span>
            </div>
          ))}
        </div>
      </div>

      {/* Match Configuration */}
      <div className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.01] dark:bg-white/[0.01] mb-8">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-[#646669] uppercase">
            Match Rules {isHost ? '(Host Configurable)' : '(Locked by Host)'}
          </span>
          <span className="text-[#646669] text-[11px]">
            {room.passage ? room.passage.split(' ').length : 0} words
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[11px] text-[#646669] block mb-1">Duration:</span>
            <div className="flex gap-1.5">
              {[15, 30, 60, 120].map((d) => (
                <button
                  key={d}
                  disabled={!isHost}
                  onClick={() => onUpdateConfig({ duration: d as TestDuration })}
                  className={`px-2 py-1 rounded border font-bold text-xs ${
                    room.duration === d
                      ? 'bg-[#FF5A00] text-black border-[#FF5A00]'
                      : 'border-[#E5E5E5] dark:border-[#222222] text-[#646669]'
                  } ${isHost ? 'cursor-pointer hover:border-[#FF5A00]' : 'cursor-default'}`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] text-[#646669] block mb-1">Difficulty:</span>
            <div className="flex gap-1.5">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  disabled={!isHost}
                  onClick={() => onUpdateConfig({ difficulty: diff })}
                  className={`px-2 py-1 rounded border font-bold text-xs capitalize ${
                    room.difficulty === diff
                      ? 'bg-[#FF5A00] text-black border-[#FF5A00]'
                      : 'border-[#E5E5E5] dark:border-[#222222] text-[#646669]'
                  } ${isHost ? 'cursor-pointer hover:border-[#FF5A00]' : 'cursor-default'}`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] text-[#646669] block mb-1">Mode:</span>
            <span className="font-bold text-xs capitalize">Timed Passage</span>
          </div>
        </div>
      </div>

      {/* Lobby Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E5E5E5] dark:border-[#222222]">
        <button
          onClick={onLeaveRoom}
          className="text-xs text-[#646669] hover:text-[#FF3B5C] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Leave Room</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isHost && (
            <button
              onClick={() => onSetReady(!localPlayer?.isReady)}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                localPlayer?.isReady
                  ? 'border-[#FF5A00] text-[#FF5A00] bg-[#FF5A00]/10'
                  : 'bg-[#FF5A00] text-black border-[#FF5A00] hover:opacity-90'
              }`}
            >
              {localPlayer?.isReady ? 'Ready (Click to unready)' : 'Mark Ready'}
            </button>
          )}

          {isHost && (
            <button
              onClick={onStartCountdown}
              disabled={!canStart}
              className={`w-full sm:w-auto px-8 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                canStart
                  ? 'bg-[#FF5A00] text-black hover:opacity-90 cursor-pointer'
                  : 'border border-[#E5E5E5] dark:border-[#222222] text-[#646669] cursor-not-allowed opacity-50'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{players.length < 2 ? 'Waiting for Competitor (Min 2)' : `Start Race (${players.length} Racers)`}</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
