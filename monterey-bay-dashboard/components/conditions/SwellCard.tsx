'use client';

import { useEffect, useState } from 'react';
import { NDBCBuoyProvider } from '@/services/providers/real';
import { SwellData } from '@/services/providers/SwellProvider';

interface SwellCardProps {
  locationId: string;
}

export function SwellCard({ locationId }: SwellCardProps) {
  const [swellData, setSwellData] = useState<SwellData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSwellData = async () => {
      setLoading(true);
      
      try {
        const provider = new NDBCBuoyProvider();
        const data = await provider.getSwellData(locationId, new Date());
        setSwellData(data);
      } catch (err) {
        console.error('Failed to load swell data:', err);
        setSwellData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSwellData();
  }, [locationId]);

  // Failover: Don't render if no data
  if (!loading && !swellData) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🌊</span>
          <h3 className="text-xl font-bold text-blue-900">Swell</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-blue-200 rounded w-3/4"></div>
          <div className="h-4 bg-blue-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-6 border border-blue-200 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🌊</span>
        <h3 className="text-xl font-bold text-blue-900">Swell</h3>
      </div>
      
      <div className="space-y-4">
        {/* Swell Height */}
        <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
          <span className="text-sm font-medium text-blue-700">Height</span>
          <span className="text-2xl font-bold text-blue-900">
            {swellData!.height} <span className="text-base">ft</span>
          </span>
        </div>

        {/* Swell Period */}
        <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
          <span className="text-sm font-medium text-blue-700">Period</span>
          <span className="text-2xl font-bold text-blue-900">
            {swellData!.period} <span className="text-base">sec</span>
          </span>
        </div>

        {/* Swell Direction */}
        <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
          <span className="text-sm font-medium text-blue-700">Direction</span>
          <span className="text-xl font-bold text-blue-900">
            {swellData!.direction}
          </span>
        </div>
      </div>
    </div>
  );
}
