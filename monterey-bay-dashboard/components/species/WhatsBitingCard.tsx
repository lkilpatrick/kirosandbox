'use client';

import { useEffect, useState } from 'react';
import { Species } from '@/models/Species';
import { SpeciesService } from '@/services/species';

interface WhatsBitingCardProps {
  locationName: string;
}

export function WhatsBitingCard({ locationName }: WhatsBitingCardProps) {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const service = new SpeciesService();
    const biting = service.getWhatsBiting(locationName);
    setSpecies(biting.slice(0, 5)); // Show top 5
    setLoading(false);
  }, [locationName]);

  // Failover: Don't render if no species data
  if (!loading && species.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl shadow-lg p-6 border border-amber-200">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🎣</span>
          <h3 className="text-xl font-bold text-amber-900">What's Biting</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-16 bg-amber-200 rounded-lg"></div>
          <div className="h-16 bg-amber-200 rounded-lg"></div>
          <div className="h-16 bg-amber-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl shadow-lg p-6 border border-amber-200 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🎣</span>
        <h3 className="text-xl font-bold text-amber-900">What's Biting</h3>
      </div>

      <p className="text-sm text-amber-700 mb-4 font-medium">
        In season at {locationName}
      </p>

      <div className="space-y-3">
        {species.map((s) => (
          <div
            key={s.key}
            className="flex items-center gap-3 p-3 bg-white/70 rounded-lg hover:bg-white hover:scale-[1.02] transition-all cursor-pointer shadow-sm"
          >
            <span className="text-2xl">{s.emoji}</span>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-amber-900 text-sm truncate">
                {s.common_name}
              </h4>
              <p className="text-xs text-amber-700 truncate">
                {s.fishing_zone} • {s.depth_range_ft?.[0] || 0}-{s.depth_range_ft?.[1] || 0} ft
              </p>
            </div>
            <div className="text-xs font-bold text-amber-800 bg-amber-200 px-2 py-1 rounded">
              {s.cdfw_bag_limit?.split(' ')[0] || 'N/A'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
