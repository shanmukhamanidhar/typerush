import React, { useState, useMemo } from 'react';
import { StatisticsService, WpmDistributionBucket } from '../../services/statisticsService';
import { TestResult } from '../../types/typing';

interface WpmDistributionChartProps {
  history?: TestResult[];
  userWpm?: number;
}

export const WpmDistributionChart: React.FC<WpmDistributionChartProps> = ({ 
  history = [], 
  userWpm 
}) => {
  const [hoveredBucket, setHoveredBucket] = useState<WpmDistributionBucket | null>(null);

  const buckets = useMemo(() => {
    return StatisticsService.getWpmDistribution(history, userWpm);
  }, [history, userWpm]);

  const maxCount = useMemo(() => {
    if (buckets.length === 0) return 0;
    return Math.max(...buckets.map(b => b.count), 1);
  }, [buckets]);

  if (buckets.length === 0 || history.length === 0) {
    return (
      <div className="py-12 text-center font-mono select-none">
        <span className="text-xs uppercase tracking-widest text-[#FF5A00] font-semibold block mb-1">
          No Distribution Samples
        </span>
        <p className="text-xs text-[#646669] dark:text-[#A1A1A1] max-w-sm mx-auto">
          Complete typing tests to generate your authentic personal WPM distribution curve.
        </p>
      </div>
    );
  }

  const chartHeight = 160;
  const paddingX = 20;
  const barGap = 10;
  const totalBars = buckets.length;
  const barWidth = 28;
  const chartWidth = paddingX * 2 + totalBars * (barWidth + barGap);

  return (
    <div className="w-full relative select-none font-mono">
      
      {/* Tooltip Header if hovered */}
      <div className="flex items-center justify-between text-xs h-6 mb-2">
        <span className="text-[#646669] dark:text-[#A1A1A1]">
          Personal Speed Distribution ({history.length} verified tests)
        </span>
        {hoveredBucket ? (
          <span className="text-[#FF5A00] font-bold">
            {hoveredBucket.range} WPM: {hoveredBucket.count} test{hoveredBucket.count !== 1 ? 's' : ''} ({hoveredBucket.percentage}%)
          </span>
        ) : userWpm && userWpm > 0 ? (
          <span className="text-[#FF5A00]">
            Personal Best: {userWpm} WPM
          </span>
        ) : (
          <span className="text-[#646669] dark:text-[#A1A1A1] text-[11px]">
            Hover over bars to inspect speed frequency
          </span>
        )}
      </div>

      {/* SVG Bar Chart */}
      <div className="w-full overflow-x-auto">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight + 35}`}
          className="w-full h-auto overflow-visible"
        >
          {/* Subtle horizontal grid lines */}
          {[0.25, 0.5, 0.75, 1.0].map((ratio) => {
            const y = chartHeight - ratio * (chartHeight - 20);
            return (
              <line
                key={ratio}
                x1={paddingX}
                y1={y}
                x2={chartWidth - paddingX}
                y2={y}
                stroke="currentColor"
                className="text-[#E5E5E5] dark:text-[#222222]"
                strokeDasharray="2 3"
                strokeWidth="1"
              />
            );
          })}

          {/* Interactive Bars */}
          {buckets.map((b, i) => {
            const h = b.count > 0 ? Math.max(6, (b.count / maxCount) * (chartHeight - 30)) : 2;
            const x = paddingX + i * (barWidth + barGap);
            const y = chartHeight - h;
            const isHovered = hoveredBucket?.range === b.range;
            const isUser = b.isUserBucket;

            let fill = '#646669';
            let opacity = b.count > 0 ? '0.4' : '0.15';

            if (isUser && b.count > 0) {
              fill = '#FF5A00';
              opacity = '1.0';
            } else if (isHovered) {
              fill = '#FF5A00';
              opacity = '0.85';
            }

            return (
              <g 
                key={b.range}
                onMouseEnter={() => setHoveredBucket(b)}
                onMouseLeave={() => setHoveredBucket(null)}
                className="cursor-pointer"
              >
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={h}
                  rx={2}
                  fill={fill}
                  opacity={opacity}
                  className="transition-all duration-150"
                />

                {/* X-axis labels */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 18}
                  textAnchor="middle"
                  className="text-[9px] fill-[#646669] dark:fill-[#A1A1A1] font-mono"
                >
                  {b.range}
                </text>

                {/* Count above bar if count > 0 */}
                {b.count > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 5}
                    textAnchor="middle"
                    className="text-[9px] fill-[#FF5A00] font-mono font-bold"
                  >
                    {b.count}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Axis Footer */}
      <div className="flex items-center justify-between text-[10px] text-[#646669] dark:text-[#A1A1A1] pt-2 border-t border-[#E5E5E5] dark:border-[#222222] mt-2">
        <span>0–19 WPM</span>
        <span>Speed Range (WPM)</span>
        <span>160+ WPM</span>
      </div>

    </div>
  );
};
