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

  useEffect(() => {
    const fetchDiveData = async () => {
      setLoading(true);
      
      try {
        const provider = new RealDiveConditionsProvider();
        const data = await provider.getDiveConditions(locationId, new Date());
        setDiveData(data);
      } catch (err) {
        console.error('Failed to load dive conditions:', err);
        setDiveData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDiveData();
  }, [locationId]);

  // Failover: Don't render if no data
  if (!loading && !diveData) {
    return null;
  }

  const getSurgeRiskColor = (risk: 'low' | 'moderate' | 'high'): string => {
    switch (risk) {
      case 'low':
        return 'bg-green-200 text-green-800';
      case 'moderate':
        return 'bg-yellow-200 text-yellow-800';
      case 'high':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-teal-50 to-emerald-100 rounded-xl shadow-lg p-6 border border-teal-200">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🤿</span>
          <h3 className="text-xl font-bold text-teal-900">Dive Conditions</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-teal-200 rounded w-3/4"></div>
          <div className="h-4 bg-teal-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-teal-50 to-emerald-100 rounded-xl shadow-lg p-6 border border-teal-200 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🤿</span>
        <h3 className="text-xl font-bold text-teal-900">Dive Conditions</h3>
      </div>
      
      <div className="space-y-4">
        {/* Visibility */}
        <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
          <span className="text-sm font-medium text-teal-700">Visibility</span>
          <span className="text-2xl font-bold text-teal-900">
            {diveData!.estimatedVisibility} <span className="text-base">ft</span>
          </span>
        </div>

        {/* Water Temperature */}
        <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
          <span className="text-sm font-medium text-teal-700">Water Temp</span>
          <span className="text-2xl font-bold text-teal-900">
            {diveData!.waterTemp}°F
          </span>
        </div>

        {/* Surge Risk */}
        <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
          <span className="text-sm font-medium text-teal-700">Surge Risk</span>
          <span className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${getSurgeRiskColor(diveData!.surgeRisk)}`}>
            {diveData!.surgeRisk}
          </span>
        </div>
      </div>
    </div>
  );
}
