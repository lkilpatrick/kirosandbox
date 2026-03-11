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

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🌊</span>
          <h3 className="text-lg font-semibold text-blue-900">Tide</h3>
        </div>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!tideData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🌊</span>
          <h3 className="text-lg font-semibold text-blue-900">Tide</h3>
        </div>
        <p className="text-sm text-gray-600">No tide data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🌊</span>
        <h3 className="text-lg font-semibold text-blue-900">Tide</h3>
      </div>
      
      <div className="space-y-3">
        {/* Next High Tide */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Next High:</span>
          <div className="text-right">
            <div className="text-base font-semibold text-blue-900">
              {formatTime(tideData.nextHigh)}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(tideData.nextHigh)}
            </div>
          </div>
        </div>

        {/* Next Low Tide */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Next Low:</span>
          <div className="text-right">
            <div className="text-base font-semibold text-blue-900">
              {formatTime(tideData.nextLow)}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(tideData.nextLow)}
            </div>
          </div>
        </div>

        {/* Tide Trend */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">Current Trend:</span>
          <span className="text-base font-semibold text-blue-900 capitalize">
            {tideData.tideTrend === 'rising' ? '↑ Rising' : '↓ Falling'}
          </span>
        </div>
      </div>
    </div>
  );
}
