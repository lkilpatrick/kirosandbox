'use client';

import { useEffect, useState } from 'react';
import { Species } from '@/models/Species';
import { SpeciesService } from '@/services/species';
import { CardLoadingSkeleton } from '@/components/ui';

export function SpeciesOfTheDayCard() {
  const [species, setSpecies] = useState<Species | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInSeason, setIsInSeason] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allSpecies, setAllSpecies] = useState<Species[]>([]);

  useEffect(() => {
    const service = new SpeciesService();
    const inSeasonSpecies = service.getSpeciesInSeason();
    
    if (inSeasonSpecies.length > 0) {
      setAllSpecies(inSeasonSpecies);
      const speciesOfDay = service.getSpeciesOfTheDay();
      const dayIndex = inSeasonSpecies.findIndex(s => s.key === speciesOfDay.key);
      setCurrentIndex(dayIndex >= 0 ? dayIndex : 0);
      setSpecies(inSeasonSpecies[dayIndex >= 0 ? dayIndex : 0]);
      
      // Check season client-side to avoid hydration mismatch
      const currentMonth = new Date().getMonth() + 1;
      setIsInSeason(speciesOfDay?.months_best?.includes(currentMonth) || speciesOfDay?.cdfw_always_open || false);
    }
    
    setLoading(false);
  }, []);

  const handleNext = () => {
    if (allSpecies.length === 0) return;
    const nextIndex = (currentIndex + 1) % allSpecies.length;
    setCurrentIndex(nextIndex);
    setSpecies(allSpecies[nextIndex]);
    
    const currentMonth = new Date().getMonth() + 1;
    setIsInSeason(allSpecies[nextIndex]?.months_best?.includes(currentMonth) || allSpecies[nextIndex]?.cdfw_always_open || false);
  };

  const handlePrevious = () => {
    if (allSpecies.length === 0) return;
    const prevIndex = currentIndex === 0 ? allSpecies.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setSpecies(allSpecies[prevIndex]);
    
    const currentMonth = new Date().getMonth() + 1;
    setIsInSeason(allSpecies[prevIndex]?.months_best?.includes(currentMonth) || allSpecies[prevIndex]?.cdfw_always_open || false);
  };

  if (loading) {
    return <CardLoadingSkeleton />;
  }

  if (!species) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-2xl shadow-2xl p-6 md:p-8 border border-blue-400/30 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Header with navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-5xl drop-shadow-lg">{species.emoji}</span>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">Featured Species</h2>
              <p className="text-sm text-blue-100">In season now • {currentIndex + 1} of {allSpecies.length}</p>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Previous species"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Next species"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all"></div>
            <img
              src={species.image_url}
              alt={species.common_name}
              className="relative w-full h-56 md:h-72 object-cover rounded-xl shadow-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%234299e1" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23ffffff" font-size="20"%3ENo image%3C/text%3E%3C/svg%3E';
              }}
            />
            {isInSeason && (
              <div className="absolute top-3 right-3 bg-green-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm flex items-center gap-2 animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                IN SEASON
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-3xl font-bold text-white drop-shadow-md">{species.common_name}</h3>
              <p className="text-sm italic text-blue-100">{species.scientific_name}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {species.max_size && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <span className="text-xs font-semibold text-blue-100 block mb-1">Max Size</span>
                  <p className="text-white font-bold">{species.max_size}</p>
                </div>
              )}
              {species.depth_range_ft && species.depth_range_ft.length === 2 && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <span className="text-xs font-semibold text-blue-100 block mb-1">Depth</span>
                  <p className="text-white font-bold">{species.depth_range_ft[0]}-{species.depth_range_ft[1]} ft</p>
                </div>
              )}
              {species.fishing_zone && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <span className="text-xs font-semibold text-blue-100 block mb-1">Zone</span>
                  <p className="text-white font-bold">{species.fishing_zone}</p>
                </div>
              )}
              {species.cdfw_bag_limit && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <span className="text-xs font-semibold text-blue-100 block mb-1">Bag Limit</span>
                  <p className="text-white font-bold">{species.cdfw_bag_limit}</p>
                </div>
              )}
            </div>

            {/* Best Spots */}
            {species.best_spots && species.best_spots.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-blue-100 block mb-2">📍 Best Spots</span>
                <div className="flex flex-wrap gap-2">
                  {species.best_spots?.slice(0, 3).map((spot, i) => (
                    <span key={i} className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-white/30">
                      {spot}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tip */}
            {species.tips && (
              <div className="bg-white/15 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <div className="flex items-start gap-2">
                  <span className="text-xl">💡</span>
                  <div>
                    <span className="font-semibold text-white text-sm block mb-1">Pro Tip</span>
                    <p className="text-sm text-blue-50 leading-relaxed">{species.tips}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gear Section */}
        {species.gear && (species.gear?.rod || species.gear?.bait_or_lure) && (
          <div className="mt-6 pt-6 border-t border-white/20">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">🎣</span>
              Recommended Gear
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {species.gear?.rod && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <span className="text-xs font-semibold text-blue-100 block mb-2">Rod</span>
                  <p className="text-white text-sm">{species.gear.rod}</p>
                </div>
              )}
              {species.gear?.bait_or_lure && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <span className="text-xs font-semibold text-blue-100 block mb-2">Bait/Lure</span>
                  <p className="text-white text-sm">{species.gear.bait_or_lure}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
