'use client';

import { useEffect, useState } from 'react';
import { RecommendationEngine, ActivityType } from '@/services/recommendation/RecommendationEngine';
import { MarineConditions } from '@/models/MarineConditions';
import { Recommendation } from '@/models/Recommendation';
import {
  MockTideProvider,
  MockMarineWeatherProvider,
  MockWindProvider,
  MockSwellProvider,
  MockDiveConditionsProvider
} from '@/services/providers/mock';

interface RecommendationCardProps {
  locationId: string;
  activityType: ActivityType;
}

export function RecommendationCard({ locationId, activityType }: RecommendationCardProps) {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateTime, setUpdateTime] = useState<string>('');

  useEffect(() => {
    const fetchAndGenerateRecommendation = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Initialize providers
        const tideProvider = new MockTideProvider();
        const weatherProvider = new MockMarineWeatherProvider();
        const windProvider = new MockWindProvider();
        const swellProvider = new MockSwellProvider();
        const diveProvider = new MockDiveConditionsProvider();
        
        const timestamp = new Date();
        
        // Fetch data from all providers in parallel
        const [tide, weather, wind, swell, dive] = await Promise.all([
          tideProvider.getTideData(locationId, timestamp),
          weatherProvider.getWeatherData(locationId, timestamp),
          windProvider.getWindData(locationId, timestamp),
          swellProvider.getSwellData(locationId, timestamp),
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
        setError(err instanceof Error ? err.message : 'Failed to generate recommendation');
      } finally {
        setLoading(false);
      }
    };

    fetchAndGenerateRecommendation();
  }, [locationId, activityType]);

  const getStatusColor = (status: 'Go' | 'Caution' | 'No-Go') => {
    switch (status) {
      case 'Go':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Caution':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'No-Go':
        return 'bg-red-100 text-red-800 border-red-300';
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Recommendation</h2>
        <p className="text-gray-600">Analyzing conditions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Recommendation</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Recommendation</h2>
        <p className="text-gray-600">No recommendation available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border-2 border-blue-200">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-blue-900">
          {activityType.charAt(0).toUpperCase() + activityType.slice(1)} Recommendation
        </h2>
        {updateTime && (
          <div className="text-xs text-gray-500">
            Updated {updateTime}
          </div>
        )}
      </div>
      
      {/* Status Badge */}
      <div className="mb-6">
        <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-lg border-2 ${getStatusColor(recommendation.status)}`}>
          <span className="text-3xl font-bold">{getStatusIcon(recommendation.status)}</span>
          <div>
            <div className="text-2xl font-bold">{recommendation.status}</div>
            <div className="text-sm font-medium">Score: {recommendation.score}/100</div>
          </div>
        </div>
      </div>

      {/* Reasons */}
      {recommendation.reasons.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Contributing Factors</h3>
          <ul className="space-y-2">
            {recommendation.reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span className="text-gray-700">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Caution Flags */}
      {recommendation.cautionFlags.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
            <span>⚠️</span>
            <span>Caution</span>
          </h3>
          <ul className="space-y-1">
            {recommendation.cautionFlags.map((flag, index) => (
              <li key={index} className="text-yellow-800 text-sm">
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
