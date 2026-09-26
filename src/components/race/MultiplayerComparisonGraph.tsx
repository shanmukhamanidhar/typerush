import React, { useState, useMemo, useRef } from 'react';
import { Trophy, TrendingUp, Zap, Clock, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { RacePlayer } from '../../types/typing';

interface MultiplayerComparisonGraphProps {
  players: RacePlayer[];
  localPlayerId: string;
  duration: number;
}

const RACER_PALETTES = [
  { stroke: '#FF5A00', fill: 'rgba(255,90,0,0.15)', name: 'Orange (You)' },
  { stroke: '#38BDF8', fill: 'rgba(56,189,248,0.10)', name: 'Sky Blue' },
  { stroke: '#A78BFA', fill: 'rgba(167,139,250,0.10)', name: 'Soft Purple' },
  { stroke: '#34D399', fill: 'rgba(52,211,153,0.10)', name: 'Mint' },
  { stroke: '#F472B6', fill: 'rgba(244,114,182,0.10)', name: 'Pink' },
  { stroke: '#FBBF24', fill: 'rgba(251,191,36,0.10)', name: 'Amber' },
];

export const MultiplayerComparisonGraph: React.FC<MultiplayerComparisonGraphProps> = ({
  players,
  localPlayerId,
  duration,
}) => {
  const [hoveredSecond, setHoveredSecond] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Normalize and sort players by rank
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      if (a.isFinished && b.isFinished) {
        if (a.rank && b.rank) return a.rank - b.rank;
        return (b.wpm || 0) - (a.wpm || 0);
      }
      if (a.isFinished) return -1;
      if (b.isFinished) return 1;
      return (b.progress || 0) - (a.progress || 0);
    });
  }, [players]);

  const maxTime = Math.max(15, duration || 30);

  // Build clean metrics history points for each player
  const playerCurves = useMemo(() => {
    return sortedPlayers.map((player, index) => {
      const isLocal = player.id === localPlayerId;
      const palette = isLocal ? RACER_PALETTES[0] : RACER_PALETTES[(index % (RACER_PALETTES.length - 1)) + 1];

      let rawPoints: { second: number; wpm: number }[] = [];

      if (player.metricsHistory && player.metricsHistory.length >= 2) {
        rawPoints = player.metricsHistory.map(p => ({
          second: Math.min(maxTime, Math.max(1, p.second)),
          wpm: Math.max(0, p.wpm),
        }));
      } else {
        // Fallback realistic interpolation based on final WPM and duration
        const finalWpm = player.wpm || 0;
        const dur = Math.min(maxTime, Math.max(5, player.finishTime ? Math.round((player.finishTime - (Date.now() - duration * 1000)) / 1000) : maxTime));
        const intervals = 6;
        for (let i = 1; i <= intervals; i++) {
          const sec = Math.round((dur / intervals) * i);
          const ratio = i / intervals;
          // Natural typing speed ramp up to final speed
          const wpmVal = Math.round(finalWpm * (0.65 + ratio * 0.35));
          rawPoints.push({ second: sec, wpm: wpmVal });
        }
      }

      // Ensure points are sorted by second
      rawPoints.sort((a, b) => a.second - b.second);

      // Remove duplicate seconds if any
      const uniquePoints: { second: number; wpm: number }[] = [];
      rawPoints.forEach(pt => {
        const last = uniquePoints[uniquePoints.length - 1];
        if (!last || last.second !== pt.second) {
          uniquePoints.push(pt);
        } else {
          last.wpm = pt.wpm;
        }
      });

      // Calculate stats
      const peakWpm = Math.max(...uniquePoints.map(p => p.wpm), player.wpm || 0);
      const avgWpm = Math.round(uniquePoints.reduce((acc, p) => acc + p.wpm, 0) / Math.max(1, uniquePoints.length));

      return {
        player,
        isLocal,
        palette,
        points: uniquePoints,
        peakWpm,
        avgWpm,
        finalWpm: player.wpm || 0,
      };
    });
  }, [sortedPlayers, localPlayerId, maxTime, duration]);

  // Overall Max WPM for Y-Axis scaling
  const maxWpm = useMemo(() => {
    let peak = 60;
    playerCurves.forEach(pc => {
      pc.points.forEach(pt => {
        if (pt.wpm > peak) peak = pt.wpm;
      });
      if (pc.peakWpm > peak) peak = pc.peakWpm;
    });
    return Math.ceil((peak + 15) / 10) * 10;
  }, [playerCurves]);

  // Graph dimensions
  const width = 800;
  const height = 260;
  const paddingX = 45;
  const paddingY = 35;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  // Convert points to SVG coordinates
  const svgCurves = useMemo(() => {
    return playerCurves.map(pc => {
      const coords = pc.points.map(pt => ({
        x: paddingX + (pt.second / maxTime) * graphWidth,
        y: height - paddingY - (pt.wpm / maxWpm) * graphHeight,
        wpm: pt.wpm,
        second: pt.second,
      }));

      // Smooth cubic bezier path
      const pathD = coords.reduce((acc, pt, i, arr) => {
        if (i === 0) return `M ${pt.x} ${pt.y}`;
        const prev = arr[i - 1];
        const cpX = (prev.x + pt.x) / 2;
        return `${acc} C ${cpX} ${prev.y}, ${cpX} ${pt.y}, ${pt.x} ${pt.y}`;
      }, '');

      const areaD = coords.length > 1
        ? `${pathD} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`
        : '';

      return {
        ...pc,
        coords,
        pathD,
        areaD,
      };
    });
  }, [playerCurves, maxTime, maxWpm, graphWidth, graphHeight, paddingX, paddingY, height]);

  // Handle Mouse movement across SVG for hover tooltip
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgX = (mouseX / rect.width) * width;
    const clampedX = Math.max(paddingX, Math.min(width - paddingX, svgX));
    const sec = Math.round(((clampedX - paddingX) / graphWidth) * maxTime);
    setHoveredSecond(Math.max(1, Math.min(maxTime, sec)));
  };

  const handleMouseLeave = () => {
    setHoveredSecond(null);
  };

  // Find data at hovered second for tooltip
  const tooltipData = useMemo(() => {
    if (hoveredSecond === null) return null;
    const localCurve = svgCurves.find(c => c.isLocal);
    const localPt = localCurve ? (localCurve.coords.find(c => c.second === hoveredSecond) || localCurve.coords[localCurve.coords.length - 1]) : null;
    const localWpm = localPt ? localPt.wpm : 0;

    const items = svgCurves.map(c => {
      // Find closest point to hoveredSecond
      let closest = c.coords[0];
      let minDiff = 999;
      c.coords.forEach(pt => {
        const diff = Math.abs(pt.second - hoveredSecond);
        if (diff < minDiff) {
          minDiff = diff;
          closest = pt;
        }
      });

      const diffWpm = closest ? closest.wpm - localWpm : 0;
      return {
        name: c.player.name,
        isLocal: c.isLocal,
        color: c.palette.stroke,
        wpm: closest ? closest.wpm : c.finalWpm,
        diffWpm,
      };
    });

    return {
      second: hoveredSecond,
      items,
    };
  }, [hoveredSecond, svgCurves]);

  // Comparison Highlights
  const highestBurstRacer = useMemo(() => {
    if (playerCurves.length === 0) return null;
    return [...playerCurves].sort((a, b) => b.peakWpm - a.peakWpm)[0];
  }, [playerCurves]);

  const winner = playerCurves[0];
  const runnerUp = playerCurves[1];
  const speedGap = winner && runnerUp ? Math.max(0, winner.finalWpm - runnerUp.finalWpm) : 0;

  return (
    <div className="w-full font-mono select-none space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E5E5] dark:border-[#222222]">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#FF5A00]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111] dark:text-[#F5F5F5]">
              Head-to-Head Speed Comparison
            </h3>
          </div>
          <p className="text-xs text-[#646669] dark:text-[#A1A1A1] mt-0.5">
            Synchronized WPM trajectory across match duration ({maxTime}s).
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {svgCurves.map(c => (
            <div key={c.player.id} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: c.palette.stroke }}
              />
              <span className={`text-[11px] font-bold ${c.isLocal ? 'text-[#FF5A00]' : 'text-[#646669] dark:text-[#A1A1A1]'}`}>
                {c.player.name} {c.isLocal ? '(You)' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative p-3 sm:p-5 rounded-xl border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.01] dark:bg-white/[0.01] overflow-hidden">
        
        {/* Tooltip Overlay if hovering */}
        {tooltipData && (
          <div className="absolute top-4 right-4 z-10 p-3 rounded-lg border border-[#E5E5E5] dark:border-[#222222] bg-white/95 dark:bg-[#0A0A0A]/95 shadow-lg backdrop-blur-sm text-xs min-w-[190px] space-y-1.5 pointer-events-none animate-fadeIn">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#E5E5E5] dark:border-[#222222] font-bold text-[#646669]">
              <span>TIME: {tooltipData.second}s</span>
              <Clock className="w-3 h-3 text-[#FF5A00]" />
            </div>

            {tooltipData.items.map(item => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 truncate max-w-[110px]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className={`truncate ${item.isLocal ? 'font-bold text-[#FF5A00]' : 'text-[#111111] dark:text-[#F5F5F5]'}`}>
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-bold font-mono">
                  <span>{item.wpm} WPM</span>
                  {!item.isLocal && item.diffWpm !== 0 && (
                    <span className={`text-[10px] ${item.diffWpm > 0 ? 'text-[#FF5A00]' : 'text-[#646669]'}`}>
                      {item.diffWpm > 0 ? `+${item.diffWpm}` : item.diffWpm}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SVG Drawing */}
        <div className="w-full overflow-x-auto">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto max-h-[260px] overflow-visible cursor-crosshair select-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              <linearGradient id="multiplayerUserGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF5A00" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#FF5A00" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines */}
            {[0.25, 0.5, 0.75, 1.0].map((ratio) => {
              const y = height - paddingY - ratio * graphHeight;
              const wpmVal = Math.round(ratio * maxWpm);
              return (
                <g key={ratio}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="currentColor"
                    className="text-[#E5E5E5] dark:text-[#222222]"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] fill-[#646669] font-mono"
                  >
                    {wpmVal}
                  </text>
                </g>
              );
            })}

            {/* Vertical Time Axis Grid Lines */}
            {[0.25, 0.5, 0.75, 1.0].map((ratio) => {
              const x = paddingX + ratio * graphWidth;
              const secVal = Math.round(ratio * maxTime);
              return (
                <g key={ratio}>
                  <line
                    x1={x}
                    y1={paddingY}
                    x2={x}
                    y2={height - paddingY}
                    stroke="currentColor"
                    className="text-[#E5E5E5] dark:text-[#222222]"
                    strokeDasharray="2 4"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={height - paddingY + 16}
                    textAnchor="middle"
                    className="text-[9px] fill-[#646669] font-mono"
                  >
                    {secVal}s
                  </text>
                </g>
              );
            })}

            {/* User Glow Area */}
            {svgCurves.map(c => {
              if (!c.isLocal || !c.areaD) return null;
              return <path key={`area-${c.player.id}`} d={c.areaD} fill="url(#multiplayerUserGlow)" />;
            })}

            {/* Opponent Curves */}
            {svgCurves.map(c => {
              if (c.isLocal || !c.pathD) return null;
              return (
                <g key={`curve-${c.player.id}`}>
                  <path
                    d={c.pathD}
                    fill="none"
                    stroke={c.palette.stroke}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.75"
                  />
                  {c.coords.map((pt, idx) => (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r="2.5"
                      fill={c.palette.stroke}
                      opacity="0.8"
                    />
                  ))}
                </g>
              );
            })}

            {/* Local Player Curve (Rendered on top for prominence) */}
            {svgCurves.map(c => {
              if (!c.isLocal || !c.pathD) return null;
              return (
                <g key={`local-curve-${c.player.id}`}>
                  <path
                    d={c.pathD}
                    fill="none"
                    stroke="#FF5A00"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {c.coords.map((pt, idx) => (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r="3.5"
                      className="fill-[#FF5A00] stroke-white dark:stroke-black stroke-2"
                    />
                  ))}
                </g>
              );
            })}

            {/* Vertical Hover Crosshair */}
            {hoveredSecond !== null && (
              <line
                x1={paddingX + (hoveredSecond / maxTime) * graphWidth}
                y1={paddingY}
                x2={paddingX + (hoveredSecond / maxTime) * graphWidth}
                y2={height - paddingY}
                stroke="#FF5A00"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            )}
          </svg>
        </div>

        {/* Graph Footer Axis Label */}
        <div className="flex items-center justify-between text-[10px] text-[#646669] pt-2 mt-2 border-t border-[#E5E5E5] dark:border-[#222222]">
          <span>0s (Start)</span>
          <span>Hover graph to inspect speed differences over time</span>
          <span>{maxTime}s (Finish)</span>
        </div>
      </div>

      {/* Head-to-Head Speed Metric Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card 1: Burst Speed Peak */}
        <div className="p-4 rounded-xl border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.01] dark:bg-white/[0.01] space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[#646669]">
            <Zap className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span className="uppercase font-bold">Highest Burst Speed</span>
          </div>
          {highestBurstRacer ? (
            <div>
              <span className="text-2xl font-black text-[#FF5A00]">
                {highestBurstRacer.peakWpm} <span className="text-xs text-[#646669]">WPM</span>
              </span>
              <span className="text-xs text-[#646669] block">
                Achieved by <strong>{highestBurstRacer.player.name}</strong> {highestBurstRacer.isLocal && '(You)'}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold">—</span>
          )}
        </div>

        {/* Card 2: 1st vs 2nd Speed Delta */}
        <div className="p-4 rounded-xl border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.01] dark:bg-white/[0.01] space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[#646669]">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span className="uppercase font-bold">Winner Margin</span>
          </div>
          <div>
            <span className="text-2xl font-black text-[#111111] dark:text-[#F5F5F5]">
              +{speedGap} <span className="text-xs text-[#646669]">WPM</span>
            </span>
            <span className="text-xs text-[#646669] block">
              Gap between 1st ({winner?.player.name}) and 2nd place
            </span>
          </div>
        </div>

        {/* Card 3: Total Competitors */}
        <div className="p-4 rounded-xl border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.01] dark:bg-white/[0.01] space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[#646669]">
            <Users className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span className="uppercase font-bold">Field Size</span>
          </div>
          <div>
            <span className="text-2xl font-black text-[#111111] dark:text-[#F5F5F5]">
              {players.length} <span className="text-xs text-[#646669]">Racers</span>
            </span>
            <span className="text-xs text-[#646669] block">
              All typed the identical passage simultaneously
            </span>
          </div>
        </div>

      </div>

      {/* Detailed Comparison Table */}
      <div className="border border-[#E5E5E5] dark:border-[#222222] rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-black/[0.02] dark:bg-white/[0.02] border-b border-[#E5E5E5] dark:border-[#222222] text-[#646669] uppercase text-[10px]">
              <th className="py-2.5 px-3">Racer</th>
              <th className="py-2.5 px-3 text-right">Final WPM</th>
              <th className="py-2.5 px-3 text-right">Peak WPM</th>
              <th className="py-2.5 px-3 text-right">Avg Pace</th>
              <th className="py-2.5 px-3 text-right">Accuracy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]/50 dark:divide-[#222222]/50">
            {playerCurves.map(pc => (
              <tr
                key={pc.player.id}
                className={pc.isLocal ? 'bg-[#FF5A00]/5 text-[#FF5A00] font-bold' : 'hover:bg-black/[0.01] dark:hover:bg-white/[0.01]'}
              >
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: pc.palette.stroke }} />
                    <span className="truncate max-w-[120px]">{pc.player.name}</span>
                    {pc.isLocal && (
                      <span className="text-[9px] uppercase px-1 rounded bg-[#FF5A00]/15 text-[#FF5A00] font-bold">
                        you
                      </span>
                    )}
                    {pc.player.isHost && (
                      <span className="text-[9px] uppercase px-1 rounded border border-[#FF5A00]/40 text-[#FF5A00] font-bold">
                        host
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold">{pc.finalWpm}</td>
                <td className="py-2.5 px-3 text-right font-mono text-[#646669] dark:text-[#A1A1A1]">{pc.peakWpm}</td>
                <td className="py-2.5 px-3 text-right font-mono text-[#646669] dark:text-[#A1A1A1]">{pc.avgWpm}</td>
                <td className="py-2.5 px-3 text-right font-mono">{pc.player.accuracy ? `${pc.player.accuracy.toFixed(1)}%` : '100%'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
