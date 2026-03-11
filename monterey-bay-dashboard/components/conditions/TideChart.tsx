'use client';

import { useEffect, useState } from 'react';
import { NOAATideProvider } from '@/services/providers/real';

interface TidePoint {
  time: Date;
  height: number;
  type?: 'H' | 'L';
}

interface TideChartProps {
  locationId: string;
}

export function TideChart({ locationId }: TideChartProps) {
  const [tidePoints, setTidePoints] = useState<TidePoint[]>([]);
  const [currentHeight, setCurrentHeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTideData = async () => {
      setLoading(true);
      
      try {
        const provider = new NOAATideProvider();
        const data = await provider.getTideChartData(locationId, new Date());
        setTidePoints(data.points);
        setCurrentHeight(data.currentHeight);
      } catch (err) {
        console.error('Failed to load tide chart data:', err);
        setTidePoints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTideData();
  }, [locationId]);

  // Failover: Don't render if no data
  if (!loading && tidePoints.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 rounded-2xl shadow-xl p-8 border-2 border-blue-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-xl shadow-lg">
            <span className="text-4xl">🌊</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-blue-900">24-Hour Tide Chart</h2>
            <p className="text-sm text-blue-600 mt-1">NOAA CO-OPS Live Data</p>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-blue-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Chart dimensions
  const width = 1000;
  const height = 300;
  const padding = { top: 40, right: 60, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find min/max heights for scaling
  const heights = tidePoints.map(p => p.height);
  const minHeight = Math.min(...heights);
  const maxHeight = Math.max(...heights);
  const heightRange = maxHeight - minHeight;

  // Time range (24 hours)
  const startTime = tidePoints[0].time.getTime();
  const endTime = tidePoints[tidePoints.length - 1].time.getTime();
  const timeRange = endTime - startTime;

  // Scale functions
  const scaleX = (time: Date) => {
    return padding.left + ((time.getTime() - startTime) / timeRange) * chartWidth;
  };

  const scaleY = (height: number) => {
    return padding.top + chartHeight - ((height - minHeight) / heightRange) * chartHeight;
  };

  // Generate SVG path for tide curve
  const generatePath = () => {
    const points = tidePoints.map((p, i) => {
      const x = scaleX(p.time);
      const y = scaleY(p.height);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    });
    return points.join(' ');
  };

  // Generate area fill path
  const generateAreaPath = () => {
    const path = generatePath();
    const lastX = scaleX(tidePoints[tidePoints.length - 1].time);
    const firstX = scaleX(tidePoints[0].time);
    const bottomY = padding.top + chartHeight;
    return `${path} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  // Current time marker
  const now = new Date();
  const currentX = scaleX(now);
  const currentY = currentHeight !== null ? scaleY(currentHeight) : null;

  // Format time for labels
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  };

  // Generate time labels (every 4 hours)
  const timeLabels = [];
  for (let i = 0; i <= 24; i += 4) {
    const time = new Date(startTime + i * 60 * 60 * 1000);
    timeLabels.push({
      time,
      x: scaleX(time),
      label: formatTime(time)
    });
  }

  // Generate height labels
  const heightLabels = [];
  const heightStep = Math.ceil(heightRange / 4);
  for (let h = Math.floor(minHeight); h <= Math.ceil(maxHeight); h += heightStep) {
    heightLabels.push({
      height: h,
      y: scaleY(h),
      label: `${h.toFixed(1)}ft`
    });
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 rounded-2xl shadow-xl p-8 border-2 border-blue-200 hover:shadow-2xl transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-xl shadow-lg">
            <span className="text-4xl">🌊</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-blue-900">24-Hour Tide Chart</h2>
            <p className="text-sm text-blue-600 mt-1">NOAA CO-OPS Live Data • Updated Hourly</p>
          </div>
        </div>
        {currentHeight !== null && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 border-2 border-blue-300 shadow-lg">
            <div className="text-xs text-blue-600 font-semibold">Current Tide</div>
            <div className="text-3xl font-bold text-blue-900">{currentHeight.toFixed(1)}<span className="text-lg">ft</span></div>
          </div>
        )}
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-blue-200">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          style={{ maxHeight: '400px' }}
        >
          {/* Grid lines */}
          <defs>
            <linearGradient id="tideGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Horizontal grid lines */}
          {heightLabels.map((label, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={label.y}
                x2={width - padding.right}
                y2={label.y}
                stroke="#cbd5e1"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 10}
                y={label.y + 4}
                textAnchor="end"
                className="text-xs fill-blue-700 font-medium"
              >
                {label.label}
              </text>
            </g>
          ))}

          {/* Vertical grid lines */}
          {timeLabels.map((label, i) => (
            <g key={i}>
              <line
                x1={label.x}
                y1={padding.top}
                x2={label.x}
                y2={height - padding.bottom}
                stroke="#cbd5e1"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={label.x}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                className="text-xs fill-blue-700 font-medium"
              >
                {label.label}
              </text>
            </g>
          ))}

          {/* Area fill */}
          <path
            d={generateAreaPath()}
            fill="url(#tideGradient)"
          />

          {/* Tide curve */}
          <path
            d={generatePath()}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* High/Low tide markers */}
          {tidePoints.filter(p => p.type).map((point, i) => {
            const x = scaleX(point.time);
            const y = scaleY(point.height);
            const isHigh = point.type === 'H';
            
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill={isHigh ? '#10b981' : '#ef4444'}
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y={isHigh ? y - 15 : y + 20}
                  textAnchor="middle"
                  className="text-xs font-bold"
                  fill={isHigh ? '#10b981' : '#ef4444'}
                >
                  {isHigh ? 'HIGH' : 'LOW'}
                </text>
                <text
                  x={x}
                  y={isHigh ? y - 28 : y + 33}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-blue-900"
                >
                  {point.height.toFixed(1)}ft
                </text>
              </g>
            );
          })}

          {/* Current time marker */}
          {currentY !== null && (
            <g>
              <line
                x1={currentX}
                y1={padding.top}
                x2={currentX}
                y2={height - padding.bottom}
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="6 3"
              />
              <circle
                cx={currentX}
                cy={currentY}
                r="8"
                fill="#f59e0b"
                stroke="white"
                strokeWidth="3"
                filter="url(#glow)"
              />
              <text
                x={currentX}
                y={padding.top - 10}
                textAnchor="middle"
                className="text-sm font-bold fill-amber-600"
              >
                NOW
              </text>
            </g>
          )}

          {/* Axis labels */}
          <text
            x={width / 2}
            y={height - 10}
            textAnchor="middle"
            className="text-sm font-bold fill-blue-900"
          >
            Time
          </text>
          <text
            x={20}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90 20 ${height / 2})`}
            className="text-sm font-bold fill-blue-900"
          >
            Tide Height (feet)
          </text>
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
            <span className="text-blue-900 font-medium">High Tide</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
            <span className="text-blue-900 font-medium">Low Tide</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white"></div>
            <span className="text-blue-900 font-medium">Current Time</span>
          </div>
        </div>
      </div>
    </div>
  );
}
