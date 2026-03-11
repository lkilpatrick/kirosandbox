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
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
            Monterey Bay Conditions Dashboard
          </h1>
          <p className="text-base md:text-lg text-blue-700 mb-4">
            Ocean conditions and activity recommendations for Monterey Bay
          </p>
          
          {/* Location and Activity Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
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

      {/* Condition Cards */}
      <TideCard locationId={selectedLocation.id} />
      <WeatherCard locationId={selectedLocation.id} />
      <WindCard locationId={selectedLocation.id} />
      <SwellCard locationId={selectedLocation.id} />
      <DiveConditionsCard locationId={selectedLocation.id} />
      
      {/* What's Biting Card */}
      {selectedActivity === 'fishing' && (
        <WhatsBitingCard locationName={selectedLocation.name} />
      )}
    </DashboardLayout>
  );
}
