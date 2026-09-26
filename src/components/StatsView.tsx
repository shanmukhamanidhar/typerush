import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Target, 
  Clock, 
  RotateCcw 
} from 'lucide-react';
import { TestResult, PersonalBests } from '../types/typing';

interface StatsViewProps {
  history: TestResult[];
  personalBests: PersonalBests;
  onStartTest: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  history,
  personalBests,
  onStartTest,
}) => {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Filter out any corrupted historical records from prior buggy sessions (>220 WPM)
  const validHistory = useMemo(() => {
    return (history || []).filter(item => item && item.wpm > 0 && item.wpm <= 220 && (!item.burstSpeed?.peakWpm || item.burstSpeed.peakWpm <= 250));
  }, [history]);

  // Compute authentic aggregated stats
  const stats = useMemo(() => {
    if (validHistory.length === 0) {
      return null;
    }

    const totalWpm = validHistory.reduce((sum, item) => sum + item.wpm, 0);
    const totalAcc = validHistory.reduce((sum, item) => sum + item.accuracy, 0);
    const validConsistencyItems = validHistory.filter(item => typeof item.consistency === 'number' && item.consistency > 0);
    const totalCons = validConsistencyItems.reduce((sum, item) => sum + (item.consistency || 0), 0);
    
    const validPeaks = validHistory.map(item => Math.max(item.wpm, Math.min(220, item.burstSpeed?.peakWpm || 0)));
    const validPb = personalBests?.bestWpm && personalBests.bestWpm <= 220 ? personalBests.bestWpm : 0;
    const peakWpm = Math.max(...validPeaks, validPb);
    const totalWords = validHistory.reduce((sum, item) => sum + (item.wordCount || Math.round((item.duration || 30) * 1.5)), 0);
    const totalTime = validHistory.reduce((sum, item) => sum + (item.duration || 30), 0);

    return {
      avgWpm: Math.round(totalWpm / validHistory.length),
      peakWpm,
      avgAccuracy: parseFloat((totalAcc / validHistory.length).toFixed(1)),
      avgConsistency: validConsistencyItems.length > 0 ? Math.round(totalCons / validConsistencyItems.length) : null,
      totalTests: validHistory.length,
      totalWords,
      totalTimeSeconds: totalTime,
    };
  }, [validHistory, personalBests]);

  const activeSession = useMemo(() => {
    if (validHistory.length === 0) return null;
    if (selectedSessionId) {
      return validHistory.find(h => h.id === selectedSessionId) || validHistory[0];
    }
    return validHistory[0];
  }, [validHistory, selectedSessionId]);

  // Strictly real graph data - zero synthetic sine waves
  const graphData = useMemo(() => {
    if (!activeSession) return null;
    if (activeSession.metricsHistory && activeSession.metricsHistory.length >= 2) {
      return activeSession.metricsHistory;
    }
    // If only final WPM was stored for this test, provide honest start and end boundary points
    const dur = activeSession.duration || 30;
    return [
      { second: 1, wpm: activeSession.wpm, accuracy: activeSession.accuracy },
      { second: dur, wpm: activeSession.wpm, accuracy: activeSession.accuracy },
    ];
  }, [activeSession]);

  const svgConfig = useMemo(() => {
    if (!graphData || graphData.length === 0) return null;
    const width = 800;
    const height = 240;
    const paddingX = 40;
    const paddingY = 30;

    const maxWpm = Math.max(60, ...graphData.map(p => p.wpm)) + 10;
    const maxTime = Math.max(15, activeSession?.duration || graphData[graphData.length - 1].second);

    const coords = graphData.map(p => ({
      x: paddingX + (p.second / maxTime) * (width - paddingX * 2),
      y: height - paddingY - (p.wpm / maxWpm) * (height - paddingY * 2),
      wpm: p.wpm,
      second: p.second,
    }));

    const pathD = coords.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = arr[i - 1];
      const cpX = (prev.x + pt.x) / 2;
      return `${acc} C ${cpX} ${prev.y}, ${cpX} ${pt.y}, ${pt.x} ${pt.y}`;
    }, '');

    const areaD = coords.length > 1
      ? `${pathD} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`
      : '';

    return { width, height, paddingX, paddingY, maxWpm, maxTime, coords, pathD, areaD };
  }, [graphData, activeSession]);

  return (
    <div className="w-full max-w-5xl mx-auto py-8 select-none font-mono animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#D8D6D1] dark:border-[#242424]">
        <h1 className="text-xl font-bold text-[#111111] dark:text-[#F5F5F5]">
          stats
        </h1>
        <button
          onClick={onStartTest}
          className="text-xs text-[#FF5A00] hover:underline cursor-pointer"
        >
          return to test
        </button>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
        <div>
          <span className="text-xs text-[#646669] block mb-1">average wpm</span>
          <span className="text-4xl font-black text-[#111111] dark:text-[#F5F5F5]">
            {stats ? stats.avgWpm : '—'}
          </span>
        </div>
        <div>
          <span className="text-xs text-[#646669] block mb-1">peak wpm</span>
          <span className="text-4xl font-black text-[#FF5A00]">
            {stats && stats.peakWpm > 0 ? stats.peakWpm : '—'}
          </span>
        </div>
        <div>
          <span className="text-xs text-[#646669] block mb-1">accuracy</span>
          <span className="text-4xl font-black text-[#111111] dark:text-[#F5F5F5]">
            {stats ? `${stats.avgAccuracy}%` : '—'}
          </span>
        </div>
        <div>
          <span className="text-xs text-[#646669] block mb-1">tests completed</span>
          <span className="text-4xl font-black text-[#111111] dark:text-[#F5F5F5]">
            {stats ? stats.totalTests : '0'}
          </span>
        </div>
      </div>

      {/* Speed Curve Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-3 text-xs text-[#646669]">
          <span>session speed curve</span>
          {activeSession && (
            <span>
              {activeSession.wpm} wpm · {activeSession.accuracy.toFixed(1)}% acc ({activeSession.duration || 30}s)
            </span>
          )}
        </div>

        {validHistory.length === 0 ? (
          <div className="py-16 text-center rounded-xl border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.01] dark:bg-white/[0.01]">
            <span className="text-xs uppercase tracking-widest text-[#FF5A00] font-bold block mb-2">
              No Test Sessions Recorded
            </span>
            <p className="text-xs text-[#646669] dark:text-[#A1A1A1] max-w-sm mx-auto mb-5">
              Complete a typing test to view your authentic session speed curve and performance metrics.
            </p>
            <button
              onClick={onStartTest}
              className="px-5 py-2 rounded border border-[#FF5A00] text-[#FF5A00] hover:bg-[#FF5A00] hover:text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Start Test
            </button>
          </div>
        ) : svgConfig ? (
          <div className="w-full overflow-x-auto py-2">
            <svg
              viewBox={`0 0 ${svgConfig.width} ${svgConfig.height}`}
              className="w-full h-auto max-h-[220px] overflow-visible select-none"
            >
              <defs>
                <linearGradient id="statsMinimalGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF5A00" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#FF5A00" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0.25, 0.5, 0.75, 1.0].map((ratio) => {
                const y = svgConfig.height - svgConfig.paddingY - ratio * (svgConfig.height - svgConfig.paddingY * 2);
                const wpmVal = Math.round(ratio * svgConfig.maxWpm);
                return (
                  <g key={ratio}>
                    <line
                      x1={svgConfig.paddingX}
                      y1={y}
                      x2={svgConfig.width - svgConfig.paddingX}
                      y2={y}
                      stroke="currentColor"
                      className="text-[#D8D6D1] dark:text-[#242424]"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={svgConfig.paddingX - 8}
                      y={y + 3}
                      textAnchor="end"
                      className="text-[9px] fill-[#646669]"
                    >
                      {wpmVal}
                    </text>
                  </g>
                );
              })}

              {svgConfig.areaD && (
                <path d={svgConfig.areaD} fill="url(#statsMinimalGlow)" />
              )}

              {svgConfig.pathD && (
                <path
                  d={svgConfig.pathD}
                  fill="none"
                  stroke="#FF5A00"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {svgConfig.coords.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  className="fill-[#FF5A00] stroke-[#F7F6F2] dark:stroke-[#080808] stroke-2"
                />
              ))}

              {svgConfig.coords.map((pt, idx) => (
                <text
                  key={idx}
                  x={pt.x}
                  y={svgConfig.height - 6}
                  textAnchor="middle"
                  className="text-[9px] fill-[#646669]"
                >
                  {pt.second}s
                </text>
              ))}
            </svg>
          </div>
        ) : null}
      </div>

      {/* Session History Table */}
      <div>
        <div className="flex items-center justify-between mb-4 text-xs text-[#646669]">
          <span>history</span>
          <span>{validHistory.length} tests</span>
        </div>

        {validHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#D8D6D1] dark:border-[#242424] text-[10px] text-[#646669] uppercase">
                  <th className="py-2 px-2">wpm</th>
                  <th className="py-2 px-2">accuracy</th>
                  <th className="py-2 px-2">mode</th>
                  <th className="py-2 px-2">duration</th>
                  <th className="py-2 px-2">consistency</th>
                  <th className="py-2 px-2 text-right">date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D6D1]/40 dark:divide-[#242424]/40">
                {validHistory.slice(0, 15).map(session => {
                  const isSelected = activeSession?.id === session.id;
                  const dateStr = session.timestamp 
                    ? new Date(session.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })
                    : '—';

                  return (
                    <tr
                      key={session.id}
                      onClick={() => setSelectedSessionId(session.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? 'text-[#FF5A00] font-bold' 
                          : 'text-[#111111] dark:text-[#F5F5F5] hover:text-[#FF5A00]'
                      }`}
                    >
                      <td className="py-2.5 px-2 font-bold">{session.wpm}</td>
                      <td className="py-2.5 px-2">{session.accuracy ? `${session.accuracy.toFixed(1)}%` : '—'}</td>
                      <td className="py-2.5 px-2 text-[#646669]">{session.mode || '—'}</td>
                      <td className="py-2.5 px-2 text-[#646669]">
                        {session.duration ? `${session.duration}s` : session.wordCount ? `${session.wordCount}w` : '—'}
                      </td>
                      <td className="py-2.5 px-2 text-[#646669]">
                        {typeof session.consistency === 'number' ? `${session.consistency}%` : '—'}
                      </td>
                      <td className="py-2.5 px-2 text-right text-[#646669]">{dateStr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-[#646669]">
            no tests recorded yet
          </div>
        )}
      </div>

    </div>
  );
};
