import React, { useMemo, useState } from 'react';
import { MetricSnapshot } from '../types/typing';

interface PerformanceGraphProps {
  metrics?: MetricSnapshot[];
  duration?: number;
  height?: number;
  showLabels?: boolean;
}

export const PerformanceGraph: React.FC<PerformanceGraphProps> = ({
  metrics,
  duration = 30,
  height = 140,
  showLabels = true,
}) => {
  // Normalize metrics so there are always valid points plotted across the full duration
  const safeMetrics = useMemo(() => {
    const list = metrics && metrics.length > 0 ? [...metrics] : [];
    const maxSec = Math.max(1, duration || (list.length > 0 ? list[list.length - 1].second : 1));

    if (list.length === 0) {
      return [
        { second: 0, wpm: 0, rawWpm: 0, accuracy: 100, errors: 0 },
        { second: maxSec, wpm: 0, rawWpm: 0, accuracy: 100, errors: 0 },
      ];
    }

    if (list.length === 1) {
      const p = list[0];
      return [
        { 
          second: 0, 
          wpm: Math.max(0, Math.round(p.wpm * 0.8)), 
          rawWpm: Math.max(0, Math.round(p.rawWpm * 0.8)), 
          accuracy: p.accuracy, 
          errors: 0 
        },
        { 
          second: maxSec, 
          wpm: p.wpm, 
          rawWpm: p.rawWpm, 
          accuracy: p.accuracy, 
          errors: p.errors 
        },
      ];
    }

    // Ensure list starts from second 0
    if (list[0].second > 0) {
      list.unshift({
        second: 0,
        wpm: Math.max(0, Math.round(list[0].wpm * 0.8)),
        rawWpm: Math.max(0, Math.round(list[0].rawWpm * 0.8)),
        accuracy: list[0].accuracy,
        errors: 0,
      });
    }

    // Ensure list extends to the test duration
    const lastPoint = list[list.length - 1];
    if (lastPoint.second < maxSec) {
      list.push({
        second: maxSec,
        wpm: lastPoint.wpm,
        rawWpm: lastPoint.rawWpm,
        accuracy: lastPoint.accuracy,
        errors: lastPoint.errors,
      });
    }

    return list;
  }, [metrics, duration]);

  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; second: number; wpm: number; accuracy: number } | null>(null);

  const maxWpm = Math.max(50, ...safeMetrics.map((m) => Math.max(m.wpm || 0, m.rawWpm || 0))) + 15;
  const padding = 24;
  const graphWidth = 600;
  const graphHeight = height;

  const effectiveDuration = Math.max(
    1, 
    duration || safeMetrics[safeMetrics.length - 1].second
  );

  const points = safeMetrics.map((m) => {
    const x = padding + (m.second / effectiveDuration) * (graphWidth - padding * 2);
    const y = graphHeight - padding - ((m.wpm || 0) / maxWpm) * (graphHeight - padding * 2);
    return { x, y, ...m };
  });

  const rawPoints = safeMetrics.map((m) => {
    const x = padding + (m.second / effectiveDuration) * (graphWidth - padding * 2);
    const y = graphHeight - padding - ((m.rawWpm || 0) / maxWpm) * (graphHeight - padding * 2);
    return { x, y };
  });

  // SVG Path generator
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y} L ${pts[0].x} ${pts[0].y}`;
    return pts.reduce((acc, point, i, arr) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      const prev = arr[i - 1];
      const cpX = (prev.x + point.x) / 2;
      return `${acc} C ${cpX} ${prev.y}, ${cpX} ${point.y}, ${point.x} ${point.y}`;
    }, '');
  };

  const linePath = createSmoothPath(points);
  const rawLinePath = createSmoothPath(rawPoints);

  // Closed area path for gradient
  const areaPath = points.length > 1
    ? `${linePath} L ${points[points.length - 1].x} ${graphHeight - padding} L ${points[0].x} ${graphHeight - padding} Z`
    : '';

  return (
    <div className="w-full relative">
      <svg
        viewBox={`0 0 ${graphWidth} ${graphHeight}`}
        className="w-full h-auto overflow-visible select-none"
      >
        <defs>
          <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF5A00" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#FF5A00" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = graphHeight - padding - ratio * (graphHeight - padding * 2);
          const val = Math.round(ratio * maxWpm);
          return (
            <g key={ratio}>
              <line
                x1={padding}
                y1={y}
                x2={graphWidth - padding}
                y2={y}
                stroke="currentColor"
                className="text-[#D8D6D1] dark:text-[#242424]"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              {showLabels && (
                <text
                  x={padding - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-[#6F6F6F] dark:fill-[#888888] font-mono"
                >
                  {val}
                </text>
              )}
            </g>
          );
        })}

        {/* Area Fill */}
        {areaPath && (
          <path d={areaPath} fill="url(#wpmGradient)" />
        )}

        {/* Raw WPM Line (dashed soft orange line) */}
        {rawLinePath && (
          <path
            d={rawLinePath}
            fill="none"
            stroke="#FF6E1A"
            strokeWidth="1.5"
            strokeDasharray="2 3"
            opacity="0.8"
          />
        )}

        {/* Net WPM Line (bold primary orange stroke) */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="#FF5A00"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}

        {/* Data Points with Touch / Hover Hit Area */}
        {points.map((pt, i) => (
          <g key={i}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r="14"
              className="fill-transparent cursor-pointer"
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
              onTouchStart={() => setHoveredPoint(pt)}
            />
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredPoint?.second === pt.second ? '5' : '3'}
              className="fill-[#FF5A00] stroke-[#F7F6F2] dark:stroke-[#080808] stroke-2 pointer-events-none transition-all"
            />
          </g>
        ))}

        {/* Floating Tooltip */}
        {hoveredPoint && (
          <g className="pointer-events-none">
            <rect
              x={Math.max(padding, Math.min(graphWidth - padding - 100, hoveredPoint.x - 50))}
              y={Math.max(6, hoveredPoint.y - 30)}
              width="100"
              height="22"
              rx="4"
              className="fill-black/95 dark:fill-zinc-900/95 stroke"
              strokeWidth="1"
              stroke="#FF5A00"
            />
            <text
              x={Math.max(padding, Math.min(graphWidth - padding - 100, hoveredPoint.x - 50)) + 50}
              y={Math.max(6, hoveredPoint.y - 30) + 14}
              textAnchor="middle"
              className="text-[9px] fill-[#F5F5F5] font-mono font-bold"
            >
              {hoveredPoint.second}s: {hoveredPoint.wpm} wpm
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-end gap-4 text-[10px] font-mono text-[#6F6F6F] dark:text-[#888888] mt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 bg-[#FF5A00] inline-block rounded" />
          <span>Net WPM</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 bg-[#FF6E1A] inline-block border-b border-dashed" />
          <span>Raw WPM</span>
        </div>
      </div>
    </div>
  );
};
