'use client';

import { useEffect, useState } from 'react';
import { NWSWeatherProvider } from '@/services/providers/real';
import { MarineWeatherData } from '@/services/providers/MarineWeatherProvider';

interface WeatherCardProps {
  locationId: string;
}

export function WeatherCard({ locationId }: WeatherCardProps) {
  const [weatherData, setWeatherData] = useState<MarineWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const provider = new NWSWeatherProvider();
        const data = await provider.getWeatherData(locationId, new Date());
        setWeatherData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [locationId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Marine Weather</h3>
        <p className="text-sm text-gray-600">Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Marine Weather</h3>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Marine Weather</h3>
        <p className="text-sm text-gray-600">No weather data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">Marine Weather</h3>
      
      <div className="space-y-3">
        {/* Weather Summary */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Conditions:</span>
          <span className="text-base font-semibold text-blue-900 text-right">
            {weatherData.summary}
          </span>
        </div>

        {/* Air Temperature */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Air Temp:</span>
          <span className="text-base font-semibold text-blue-900">
            {weatherData.airTemp}°F
          </span>
        </div>

        {/* Marine Layer */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">Marine Layer:</span>
          <span className="text-base font-semibold text-blue-900">
            {weatherData.marineLayer ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
    </div>
  );
}
