'use client';

import { useEffect, useState } from 'react';
import { NDBCBuoyProvider } from '@/services/providers/real';
import { WindData } from '@/services/providers/WindProvider';

interface WindCardProps {
  locationId: string;
}

export function WindCard({ locationId }: WindCardProps) {
  const [windData, setWindData] = useState<WindData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWindData = async () => {
      setLoading(true);
      
      try {
        const provider = new NDBCBuoyProvider();
        const data = await provider.getWindData(locationId, new Date());
        setWindData(data);
      } catch (err) {
        console.error('Failed to load wind data:', err);
        setWindData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWindData();
  }, [locationId]);

  // Failover: Don't render if no data
  if (!loading && !windData) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-cyan-50 to-teal-100 rounded-xl shadow-lg p-6 border border-cyan-200">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">💨</span>
          <h3 className="text-xl font-bold text-cyan-900">Wind</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-cyan-200 rounded w-3/4"></div>
          <div className="h-4 bg-cyan-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-teal-100 rounded-xl shadow-lg p-6 border border-cyan-200 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">💨</span>
        <h3 className="text-xl font-bold text-cyan-900">Wind</h3>
      </div>
      
      <div className="space-y-4">
        {/* Wind Speed */}
        <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
          <span className="text-sm font-medium text-cyan-700">Speed</span>
          <span className="text-2xl font-bold text-cyan-900">
            {windData!.speed} <span className="text-base">kts</span>
          </span>
        </div>

        {/* Wind Gust */}
        <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
          <span className="text-sm font-medium text-cyan-700">Gust</span>
          <span className="text-2xl font-bold text-cyan-900">
            {windData!.gust} <span className="text-base">kts</span>
          </span>
        </div>

        {/* Wind Direction */}
        <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
          <span className="text-sm font-medium text-cyan-700">Direction</span>
          <span className="text-xl font-bold text-cyan-900">
            {windData!.direction}
          </span>
        </div>
      </div>
    </div>
  );
}
