'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { LocationSelector, ActivitySelector, Activity } from '@/components/selectors';
import { TideCard, WeatherCard, WindCard, SwellCard, DiveConditionsCard } from '@/components/conditions';
import { RecommendationCard } from '@/components/recommendation';
import { SpeciesOfTheDayCard, WhatsBitingCard } from '@/components/species';
import { MONTEREY_BAY_LOCATIONS, DEFAULT_LOCATION, Location } from '@/models';
import { usePageView, trackLocationChange, trackActivityChange } from '@/lib/useAnalytics';

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<Location>(DEFAULT_LOCATION);
  const [selectedActivity, setSelectedActivity] = useState<Activity>('boating');

  // Track page view
  usePageView('Monterey Bay Dashboard');

  const handleLocationChange = (location: Location) => {
    setSelectedLocation(location);
    trackLocationChange(location.id, location.name);
  };

  const handleActivityChange = (activity: Activity) => {
    setSelectedActivity(activity);
    trackActivityChange(activity);
  };

  return (
    <DashboardLayout
      header={
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 opacity-10 rounded-2xl"></div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-5xl">🌊</span>
              <div>
                <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Monterey Bay Conditions
                </h1>
                <p className="text-base md:text-lg text-gray-600 mt-1">
                  Real-time ocean data • Live NOAA feeds • Updated continuously
                </p>
              </div>
            </div>
            
            {/* Location and Activity Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mt-6">
              <LocationSelector
                locations={MONTEREY_BAY_LOCATIONS}
                selectedLocation={selectedLocation}
                onChange={handleLocationChange}
              />
              <ActivitySelector
                selectedActivity={selectedActivity}
                onChange={handleActivityChange}
              />
            </div>
          </div>
        </div>
      }
      recommendation={
        <RecommendationCard 
          locationId={selectedLocation.id} 
          activityType={selectedActivity} 
        />
      }
    >
      {/* Species of the Day - Full Width */}
      <div className="col-span-full">
        <SpeciesOfTheDayCard />
      </div>

      {/* Condition Cards - Improved Grid */}
      <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TideCard locationId={selectedLocation.id} />
        <WeatherCard locationId={selectedLocation.id} />
        <WindCard locationId={selectedLocation.id} />
        <SwellCard locationId={selectedLocation.id} />
        <DiveConditionsCard locationId={selectedLocation.id} />
        
        {/* What's Biting Card */}
        {selectedActivity === 'fishing' && (
          <WhatsBitingCard locationName={selectedLocation.name} />
        )}
      </div>
    </DashboardLayout>
  );
}
