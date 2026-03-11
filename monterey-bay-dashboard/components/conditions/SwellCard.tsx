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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSwellData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const provider = new NDBCBuoyProvider();
        const data = await provider.getSwellData(locationId, new Date());
        setSwellData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load swell data');
      } finally {
        setLoading(false);
      }
    };

    fetchSwellData();
  }, [locationId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Swell</h3>
        <p className="text-sm text-gray-600">Loading swell data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Swell</h3>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!swellData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Swell</h3>
        <p className="text-sm text-gray-600">No swell data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">Swell</h3>
      
      <div className="space-y-3">
        {/* Swell Height */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Height:</span>
          <span className="text-base font-semibold text-blue-900">
            {swellData.height} ft
          </span>
        </div>

        {/* Swell Period */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Period:</span>
          <span className="text-base font-semibold text-blue-900">
            {swellData.period} sec
          </span>
        </div>

        {/* Swell Direction */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">Direction:</span>
          <span className="text-base font-semibold text-blue-900">
            {swellData.direction}
          </span>
        </div>
      </div>
    </div>
  );
}
