import React from 'react';
import { MetricSnapshot } from '../types/typing';

interface PerformanceGraphProps {
  metrics: MetricSnapshot[];
  duration: number;
  height?: number;
  showLabels?: boolean;
}

export const PerformanceGraph: React.FC<PerformanceGraphProps> = ({
  metrics,
  duration,
  height = 140,
  showLabels = true,
}) => {
  if (!metrics || metrics.length === 0) {
    return (
      <div 
        style={{ height }} 
        className="w-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 font-mono border border-dashed border-slate-200 dark:border-slate-800 rounded-xl"
      >
        Waiting for speed samples...
      </div>
    );
  }

  const maxWpm = Math.max(60, ...metrics.map((m) => Math.max(m.wpm, m.rawWpm))) + 15;
  const padding = 24;
  const graphWidth = 600;
  const graphHeight = height;

  const points = metrics.map((m) => {
    const x = padding + (m.second / duration) * (graphWidth - padding * 2);
    const y = graphHeight - padding - (m.wpm / maxWpm) * (graphHeight - padding * 2);
    return { x, y, ...m };
  });

  const rawPoints = metrics.map((m) => {
    const x = padding + (m.second / duration) * (graphWidth - padding * 2);
    const y = graphHeight - padding - (m.rawWpm / maxWpm) * (graphHeight - padding * 2);
    return { x, y };
  });

  // SVG Path generator
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
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
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
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
                className="text-slate-200 dark:text-slate-800"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              {showLabels && (
                <text
                  x={padding - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-slate-400 font-mono"
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

        {/* Raw WPM Line (subtle dashed sky line) */}
        {rawLinePath && (
          <path
            d={rawLinePath}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="2 3"
            opacity="0.6"
          />
        )}

        {/* Net WPM Line (bold cyan stroke) */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="#00f0ff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}

        {/* Data Points */}
        {points.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r="3"
            className="fill-cyan-400 stroke-slate-900 stroke-2"
          />
        ))}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-end gap-4 text-[10px] font-mono text-slate-400 mt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 bg-cyan-400 inline-block rounded" />
          <span>Net WPM</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 bg-sky-400 inline-block border-b border-dashed" />
          <span>Raw WPM</span>
        </div>
      </div>
    </div>
  );
};
