'use client';

import { useEffect, useState } from 'react';
import { NOAATideProvider } from '@/services/providers/real';
import { TideData } from '@/services/providers/TideProvider';
import { CardLoadingSkeleton } from '@/components/ui';

interface TideCardProps {
  locationId: string;
}

export function TideCard({ locationId }: TideCardProps) {
  const [tideData, setTideData] = useState<TideData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTideData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const provider = new NOAATideProvider();
        const data = await provider.getTideData(locationId, new Date());
        setTideData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tide data');
        console.error('Tide data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTideData();
  }, [locationId]);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return <CardLoadingSkeleton />;
  }

  if (error || !tideData) {
    return null; // Hide card if no data
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-blue-100 group">
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform">
          <span className="text-3xl">🌊</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-blue-900">Tide</h3>
          <p className="text-xs text-blue-600">NOAA CO-OPS Live Data</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Next High Tide */}
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-blue-700 flex items-center gap-2">
              <span>↑</span> Next High
            </span>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-900">
                {formatTime(tideData.nextHigh)}
              </div>
              <div className="text-xs text-blue-600">
                {formatDate(tideData.nextHigh)}
              </div>
            </div>
          </div>
        </div>

        {/* Next Low Tide */}
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-blue-700 flex items-center gap-2">
              <span>↓</span> Next Low
            </span>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-900">
                {formatTime(tideData.nextLow)}
              </div>
              <div className="text-xs text-blue-600">
                {formatDate(tideData.nextLow)}
              </div>
            </div>
          </div>
        </div>

        {/* Tide Trend */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-4 text-white">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Current Trend</span>
            <span className="text-lg font-bold capitalize flex items-center gap-2">
              {tideData.tideTrend === 'rising' ? '↑ Rising' : '↓ Falling'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
