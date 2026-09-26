import React, { useMemo } from 'react';
import { RotateCcw, LogOut, Users, Trophy } from 'lucide-react';
import { RaceRoom } from '../../types/typing';
import { MultiplayerComparisonGraph } from './MultiplayerComparisonGraph';

interface RaceResultsProps {
  room: RaceRoom;
  localPlayerId: string;
  onRequestRematch: () => void;
  onLeaveRoom: () => void;
}

export const RaceResults: React.FC<RaceResultsProps> = ({
  room,
  localPlayerId,
  onRequestRematch,
  onLeaveRoom,
}) => {
  const localPlayer = room.players[localPlayerId];
  const allPlayers = Object.values(room.players);

  // Sort players by rank, then WPM, then progress
  const leaderboard = useMemo(() => {
    return [...allPlayers].sort((a, b) => {
      if (a.isFinished && b.isFinished) {
        if (a.rank && b.rank) return a.rank - b.rank;
        return (b.wpm || 0) - (a.wpm || 0);
      }
      if (a.isFinished) return -1;
      if (b.isFinished) return 1;
      return (b.progress || 0) - (a.progress || 0);
    });
  }, [allPlayers]);

  const userRank = leaderboard.findIndex((p) => p.id === localPlayerId) + 1;
  const isWinner = userRank === 1;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 font-mono select-none animate-fadeIn text-[#111111] dark:text-[#F5F5F5] space-y-8">
      
      {/* Header Summary */}
      <div className="pb-6 border-b border-[#E5E5E5] dark:border-[#222222]">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-4 h-4 text-[#FF5A00]" />
          <span className="text-xs uppercase tracking-widest text-[#FF5A00] font-bold">
            {isWinner ? '1st Place Finish' : 'Match Completed'}
          </span>
        </div>
        <h1 className="text-3xl font-black tracking-tight">
          {isWinner ? 'Victory' : `Ranked #${userRank} of ${allPlayers.length}`}
        </h1>
        <p className="text-xs text-[#646669] dark:text-[#A1A1A1] mt-1">
          Multiplayer match in room <strong>{room.code}</strong> completed.
        </p>
      </div>

      {/* User Primary Result Card */}
      <div className="p-6 rounded-xl border border-[#FF5A00] bg-[#FF5A00]/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5A00] block mb-1">
              Your Performance
            </span>
            <span className="text-lg font-bold">
              {localPlayer?.name || 'You'}
            </span>
          </div>

          <div className="flex items-center gap-8">
            <div>
              <span className="text-[10px] text-[#646669] uppercase font-bold block mb-0.5">Speed</span>
              <span className="text-3xl font-black text-[#FF5A00]">{localPlayer?.wpm || 0}</span>
              <span className="text-xs text-[#646669] ml-1">WPM</span>
            </div>

            <div>
              <span className="text-[10px] text-[#646669] uppercase font-bold block mb-0.5">Accuracy</span>
              <span className="text-3xl font-black text-[#111111] dark:text-[#F5F5F5]">
                {localPlayer?.accuracy ? localPlayer.accuracy.toFixed(1) : 100}%
              </span>
            </div>

            <div>
              <span className="text-[10px] text-[#646669] uppercase font-bold block mb-0.5">Rank</span>
              <span className="text-3xl font-black text-[#FF5A00]">#{userRank}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Head-to-Head Speed Comparison Graph */}
      <div>
        <MultiplayerComparisonGraph
          players={allPlayers}
          localPlayerId={localPlayerId}
          duration={room.duration || 30}
        />
      </div>

      {/* Standings Table */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-[#646669] uppercase flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#FF5A00]" />
            Official Standings
          </span>
          <span className="text-[#646669]">{allPlayers.length} Competitors</span>
        </div>

        <div className="border border-[#E5E5E5] dark:border-[#222222] rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E5E5] dark:border-[#222222] text-[10px] text-[#646669] uppercase bg-black/[0.02] dark:bg-white/[0.02]">
                <th className="py-2.5 px-4">Rank</th>
                <th className="py-2.5 px-4">Racer</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Speed</th>
                <th className="py-2.5 px-4 text-right">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]/50 dark:divide-[#222222]/50">
              {leaderboard.map((player, index) => {
                const isLocal = player.id === localPlayerId;

                return (
                  <tr
                    key={player.id}
                    className={`transition-colors ${
                      isLocal ? 'bg-[#FF5A00]/5 text-[#FF5A00] font-bold' : ''
                    }`}
                  >
                    <td className="py-2.5 px-4 font-bold">
                      #{index + 1}
                    </td>

                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span>{player.name}</span>
                        {isLocal && (
                          <span className="text-[9px] uppercase px-1 rounded bg-[#FF5A00]/15 text-[#FF5A00] font-bold">
                            you
                          </span>
                        )}
                        {player.isHost && (
                          <span className="text-[9px] uppercase px-1 rounded border border-[#FF5A00]/40 text-[#FF5A00] font-bold">
                            host
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-4 text-center">
                      {player.isFinished ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded border border-[#FF5A00]/40 text-[#FF5A00]">
                          Finished
                        </span>
                      ) : player.isConnected === false ? (
                        <span className="text-[10px] text-[#646669]">DNF</span>
                      ) : (
                        <span className="text-[10px] text-[#646669]">Timeout</span>
                      )}
                    </td>

                    <td className="py-2.5 px-4 text-right font-bold font-mono">
                      {player.wpm || 0} WPM
                    </td>

                    <td className="py-2.5 px-4 text-right font-mono text-[#646669]">
                      {player.accuracy ? `${player.accuracy.toFixed(1)}%` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#E5E5E5] dark:border-[#222222]">
        <button
          onClick={onRequestRematch}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#FF5A00] text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Rematch (Same Room)</span>
        </button>

        <button
          onClick={onLeaveRoom}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-[#E5E5E5] dark:border-[#222222] text-[#646669] hover:text-[#111111] dark:hover:text-[#F5F5F5] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Return to Multiplayer</span>
        </button>
      </div>

    </div>
  );
};
