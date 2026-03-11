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

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      
      try {
        const provider = new NWSWeatherProvider();
        const data = await provider.getWeatherData(locationId, new Date());
        setWeatherData(data);
      } catch (err) {
        console.error('Failed to load weather data:', err);
        setWeatherData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [locationId]);

  // Failover: Don't render if no data
  if (!loading && !weatherData) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-xl shadow-lg p-6 border border-sky-200">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">☁️</span>
          <h3 className="text-xl font-bold text-sky-900">Marine Weather</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-sky-200 rounded w-3/4"></div>
          <div className="h-4 bg-sky-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-xl shadow-lg p-6 border border-sky-200 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">☁️</span>
        <h3 className="text-xl font-bold text-sky-900">Marine Weather</h3>
      </div>
      
      <div className="space-y-4">
        {/* Weather Summary */}
        <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
          <span className="text-sm font-medium text-sky-700">Conditions</span>
          <span className="text-base font-bold text-sky-900 text-right">
            {weatherData!.summary}
          </span>
        </div>

        {/* Air Temperature */}
        <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
          <span className="text-sm font-medium text-sky-700">Air Temp</span>
          <span className="text-2xl font-bold text-sky-900">
            {weatherData!.airTemp}°F
          </span>
        </div>

        {/* Marine Layer */}
        <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
          <span className="text-sm font-medium text-sky-700">Marine Layer</span>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
            weatherData!.marineLayer 
              ? 'bg-gray-200 text-gray-800' 
              : 'bg-green-200 text-green-800'
          }`}>
            {weatherData!.marineLayer ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
    </div>
  );
}
