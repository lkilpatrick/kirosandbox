'use client';

import { useEffect, useState } from 'react';
import { Species } from '@/models/Species';
import { SpeciesService } from '@/services/species';
import { CardLoadingSkeleton } from '@/components/ui';

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

  if (loading) {
    return <CardLoadingSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🎣</span>
        <h3 className="text-lg font-semibold text-blue-900">What's Biting</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Species in season at {locationName}
      </p>

      <div className="space-y-3">
        {species.map((s) => (
          <div
            key={s.key}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <span className="text-2xl">{s.emoji}</span>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm truncate">
                {s.common_name}
              </h4>
              <p className="text-xs text-gray-600 truncate">
                {s.fishing_zone} • {s.depth_range_ft?.[0] || 0}-{s.depth_range_ft?.[1] || 0} ft
              </p>
            </div>
            <div className="text-xs text-gray-500 text-right">
              {s.cdfw_bag_limit?.split(' ')[0] || 'N/A'}
            </div>
          </div>
        ))}
      </div>

      {species.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No species data available for this location
        </p>
      )}
    </div>
  );
}
