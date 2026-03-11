'use client';

import { useEffect, useState } from 'react';
import { RecommendationEngine, ActivityType } from '@/services/recommendation/RecommendationEngine';
import { MarineConditions } from '@/models/MarineConditions';
import { Recommendation } from '@/models/Recommendation';
import {
  NOAATideProvider,
  NWSWeatherProvider,
  NDBCBuoyProvider,
  RealDiveConditionsProvider
} from '@/services/providers/real';

interface RecommendationCardProps {
  locationId: string;
  activityType: ActivityType;
}

export function RecommendationCard({ locationId, activityType }: RecommendationCardProps) {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateTime, setUpdateTime] = useState<string>('');

  useEffect(() => {
    const fetchAndGenerateRecommendation = async () => {
      setLoading(true);
      
      try {
        // Initialize real providers
        const tideProvider = new NOAATideProvider();
        const weatherProvider = new NWSWeatherProvider();
        const buoyProvider = new NDBCBuoyProvider();
        const diveProvider = new RealDiveConditionsProvider();
        
        const timestamp = new Date();
        
        // Fetch data from all providers in parallel
        const [tide, weather, wind, swell, dive] = await Promise.all([
          tideProvider.getTideData(locationId, timestamp),
          weatherProvider.getWeatherData(locationId, timestamp),
          buoyProvider.getWindData(locationId, timestamp),
          buoyProvider.getSwellData(locationId, timestamp),
          diveProvider.getDiveConditions(locationId, timestamp)
        ]);
        
        // Combine into MarineConditions object
        const conditions: MarineConditions = {
          timestamp,
          tide,
          weather,
          wind,
          swell,
          dive
        };
        
        // Generate recommendation
        const engine = new RecommendationEngine();
        const rec = engine.generateRecommendation(conditions, activityType);
        setRecommendation(rec);
        
        // Set update time after data is loaded (client-side only)
        setUpdateTime(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
      } catch (err) {
        console.error('Failed to generate recommendation:', err);
        setRecommendation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAndGenerateRecommendation();
  }, [locationId, activityType]);

  const getStatusColor = (status: 'Go' | 'Caution' | 'No-Go') => {
    switch (status) {
      case 'Go':
        return 'from-green-100 to-emerald-200 border-green-300';
      case 'Caution':
        return 'from-yellow-100 to-amber-200 border-yellow-300';
      case 'No-Go':
        return 'from-red-100 to-rose-200 border-red-300';
    }
  };

  const getStatusBadgeColor = (status: 'Go' | 'Caution' | 'No-Go') => {
    switch (status) {
      case 'Go':
        return 'bg-green-600 text-white';
      case 'Caution':
        return 'bg-yellow-600 text-white';
      case 'No-Go':
        return 'bg-red-600 text-white';
    }
  };

  const getStatusIcon = (status: 'Go' | 'Caution' | 'No-Go') => {
    switch (status) {
      case 'Go':
        return '✓';
      case 'Caution':
        return '⚠';
      case 'No-Go':
        return '✕';
    }
  };

  // Failover: Don't render if no data
  if (!loading && !recommendation) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl shadow-xl p-8 border-2 border-slate-300">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          {activityType.charAt(0).toUpperCase() + activityType.slice(1)} Recommendation
        </h2>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-slate-200 rounded-lg"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br ${getStatusColor(recommendation!.status)} rounded-xl shadow-xl p-8 border-2 hover:shadow-2xl transition-shadow`}>
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {activityType.charAt(0).toUpperCase() + activityType.slice(1)} Recommendation
        </h2>
        {updateTime && (
          <div className="text-xs text-slate-600 font-medium bg-white/60 px-3 py-1 rounded-full">
            Updated {updateTime}
          </div>
        )}
      </div>
      
      {/* Status Badge */}
      <div className="mb-6">
        <div className={`inline-flex items-center gap-4 px-8 py-5 rounded-xl ${getStatusBadgeColor(recommendation!.status)} shadow-lg`}>
          <span className="text-4xl font-bold">{getStatusIcon(recommendation!.status)}</span>
          <div>
            <div className="text-3xl font-bold">{recommendation!.status}</div>
            <div className="text-sm font-semibold opacity-90">Score: {recommendation!.score}/100</div>
          </div>
        </div>
      </div>

      {/* Reasons */}
      {recommendation!.reasons.length > 0 && (
        <div className="mb-6 bg-white/60 rounded-lg p-4">
          <h3 className="text-lg font-bold text-slate-800 mb-3">Contributing Factors</h3>
          <ul className="space-y-2">
            {recommendation!.reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-slate-600 mt-1 font-bold">•</span>
                <span className="text-slate-700 font-medium">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Caution Flags */}
      {recommendation!.cautionFlags.length > 0 && (
        <div className="bg-white/80 border-l-4 border-amber-500 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold text-amber-900 mb-2 flex items-center gap-2">
            <span>⚠️</span>
            <span>Caution</span>
          </h3>
          <ul className="space-y-1">
            {recommendation!.cautionFlags.map((flag, index) => (
              <li key={index} className="text-amber-800 text-sm font-medium">
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
