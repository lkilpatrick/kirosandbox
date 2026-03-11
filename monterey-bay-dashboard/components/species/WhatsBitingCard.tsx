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
            className="bg-white/70 rounded-lg hover:bg-white hover:scale-[1.01] transition-all cursor-pointer shadow-sm border border-amber-200/50 overflow-hidden"
          >
            <div className="flex items-start gap-3 p-4">
              <span className="text-3xl flex-shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-bold text-amber-900 text-base">{s.common_name}</h4>
                    <p className="text-xs italic text-amber-700">{s.scientific_name}</p>
                  </div>
                  {s.cdfw_bag_limit && (
                    <div className="text-xs font-bold text-amber-800 bg-amber-200 px-3 py-1 rounded-full whitespace-nowrap">
                      {s.cdfw_bag_limit.split(' ')[0]} bag
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {s.fishing_zone && (
                    <div className="flex items-center gap-1 text-amber-700">
                      <span>📍</span>
                      <span className="capitalize">{s.fishing_zone}</span>
                    </div>
                  )}
                  {s.depth_range_ft && s.depth_range_ft.length === 2 && (
                    <div className="flex items-center gap-1 text-amber-700">
                      <span>⬇️</span>
                      <span>{s.depth_range_ft[0]}-{s.depth_range_ft[1]} ft</span>
                    </div>
                  )}
                  {s.max_size && (
                    <div className="flex items-center gap-1 text-amber-700">
                      <span>📏</span>
                      <span>{s.max_size}</span>
                    </div>
                  )}
                  {s.cdfw_season && (
                    <div className="flex items-center gap-1 text-amber-700">
                      <span>📅</span>
                      <span className="truncate">{s.cdfw_season.split('(')[0].trim()}</span>
                    </div>
                  )}
                </div>

                {s.tips && (
                  <div className="mt-3 pt-3 border-t border-amber-200">
                    <p className="text-xs text-amber-800 leading-relaxed line-clamp-2">
                      💡 {s.tips}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
