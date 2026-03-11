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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWindData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const provider = new NDBCBuoyProvider();
        const data = await provider.getWindData(locationId, new Date());
        setWindData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load wind data');
      } finally {
        setLoading(false);
      }
    };

    fetchWindData();
  }, [locationId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Wind</h3>
        <p className="text-sm text-gray-600">Loading wind data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Wind</h3>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!windData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Wind</h3>
        <p className="text-sm text-gray-600">No wind data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">Wind</h3>
      
      <div className="space-y-3">
        {/* Wind Speed */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Speed:</span>
          <span className="text-base font-semibold text-blue-900">
            {windData.speed} kts
          </span>
        </div>

        {/* Wind Gust */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Gust:</span>
          <span className="text-base font-semibold text-blue-900">
            {windData.gust} kts
          </span>
        </div>

        {/* Wind Direction */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">Direction:</span>
          <span className="text-base font-semibold text-blue-900">
            {windData.direction}
          </span>
        </div>
      </div>
    </div>
  );
}
