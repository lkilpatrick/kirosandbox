'use client';

import { useEffect, useState } from 'react';
import { RealDiveConditionsProvider } from '@/services/providers/real';
import { DiveConditionsData } from '@/services/providers/DiveConditionsProvider';

interface DiveConditionsCardProps {
  locationId: string;
}

export function DiveConditionsCard({ locationId }: DiveConditionsCardProps) {
  const [diveData, setDiveData] = useState<DiveConditionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiveData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const provider = new RealDiveConditionsProvider();
        const data = await provider.getDiveConditions(locationId, new Date());
        setDiveData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dive conditions');
      } finally {
        setLoading(false);
      }
    };

    fetchDiveData();
  }, [locationId]);

  const getSurgeRiskColor = (risk: 'low' | 'moderate' | 'high'): string => {
    switch (risk) {
      case 'low':
        return 'text-green-600';
      case 'moderate':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSurgeRiskBadgeColor = (risk: 'low' | 'moderate' | 'high'): string => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Dive Conditions</h3>
        <p className="text-sm text-gray-600">Loading dive conditions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Dive Conditions</h3>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!diveData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Dive Conditions</h3>
        <p className="text-sm text-gray-600">No dive conditions available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">Dive Conditions</h3>
      
      <div className="space-y-3">
        {/* Visibility */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Visibility:</span>
          <span className="text-base font-semibold text-blue-900">
            {diveData.estimatedVisibility} ft
          </span>
        </div>

        {/* Water Temperature */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Water Temp:</span>
          <span className="text-base font-semibold text-blue-900">
            {diveData.waterTemp}°F
          </span>
        </div>

        {/* Surge Risk */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">Surge Risk:</span>
          <span className={`text-base font-semibold capitalize px-3 py-1 rounded-full text-sm ${getSurgeRiskBadgeColor(diveData.surgeRisk)}`}>
            {diveData.surgeRisk}
          </span>
        </div>
      </div>
    </div>
  );
}
