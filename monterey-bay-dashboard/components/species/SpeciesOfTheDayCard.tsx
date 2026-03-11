'use client';

import { useEffect, useState } from 'react';
import { Species } from '@/models/Species';
import { SpeciesService } from '@/services/species';
import { CardLoadingSkeleton } from '@/components/ui';

export function SpeciesOfTheDayCard() {
  const [species, setSpecies] = useState<Species | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInSeason, setIsInSeason] = useState(false);

  useEffect(() => {
    const service = new SpeciesService();
    const speciesOfDay = service.getSpeciesOfTheDay();
    setSpecies(speciesOfDay);
    
    // Check season client-side to avoid hydration mismatch
    const currentMonth = new Date().getMonth() + 1;
    setIsInSeason(speciesOfDay?.months_best?.includes(currentMonth) || speciesOfDay?.cdfw_always_open || false);
    
    setLoading(false);
  }, []);

  if (loading) {
    return <CardLoadingSkeleton />;
  }

  if (!species) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow-lg p-6 md:p-8 border-2 border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{species.emoji}</span>
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Species of the Day</h2>
          <p className="text-sm text-blue-700">Daily rotating featured species</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Image */}
        <div className="relative">
          <img
            src={species.image_url}
            alt={species.common_name}
            className="w-full h-48 md:h-64 object-cover rounded-lg shadow-md"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%236b7280" font-size="20"%3ENo image%3C/text%3E%3C/svg%3E';
            }}
          />
          {isInSeason && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              IN SEASON
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{species.common_name}</h3>
            <p className="text-sm italic text-gray-600">{species.scientific_name}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Max Size:</span>
              <p className="text-gray-600">{species.max_size || 'N/A'}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Depth:</span>
              <p className="text-gray-600">
                {species.depth_range_ft && species.depth_range_ft.length === 2 
                  ? `${species.depth_range_ft[0]}-${species.depth_range_ft[1]} ft`
                  : 'N/A'}
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Zone:</span>
              <p className="text-gray-600">{species.fishing_zone || 'N/A'}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Bag Limit:</span>
              <p className="text-gray-600">{species.cdfw_bag_limit || 'N/A'}</p>
            </div>
          </div>

          {/* Best Spots */}
          {species.best_spots && species.best_spots.length > 0 && (
            <div>
              <span className="font-semibold text-gray-700 text-sm">Best Spots:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {species.best_spots?.slice(0, 3).map((spot, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {spot}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tip */}
          {species.tips && (
            <div className="bg-white/70 p-3 rounded-lg">
              <span className="font-semibold text-gray-700 text-sm">💡 Tip:</span>
              <p className="text-sm text-gray-700 mt-1">{species.tips}</p>
            </div>
          )}
        </div>
      </div>

      {/* Gear Section */}
      {species.gear && (
        <div className="mt-6 pt-6 border-t border-blue-200">
          <h4 className="font-semibold text-gray-800 mb-3">🎣 Recommended Gear</h4>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            {species.gear?.rod && (
              <div>
                <span className="font-medium text-gray-700">Rod:</span>
                <p className="text-gray-600">{species.gear.rod}</p>
              </div>
            )}
            {species.gear?.bait_or_lure && (
              <div>
                <span className="font-medium text-gray-700">Bait/Lure:</span>
                <p className="text-gray-600">{species.gear.bait_or_lure}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
