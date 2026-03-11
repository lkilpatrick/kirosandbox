'use client';

import React from 'react';
import { Location } from '@/models';

interface LocationSelectorProps {
  locations: Location[];
  selectedLocation: Location;
  onChange: (location: Location) => void;
}

/**
 * Location Selector Component
 * 
 * Allows users to switch between Monterey Bay locations.
 * Uses a dropdown select for mobile and desktop.
 * 
 * Validates: Requirements 1.2, 1.3, 7.1, 7.2
 * 
 * @param locations - Array of available locations
 * @param selectedLocation - Currently selected location
 * @param onChange - Callback when location changes
 */
export default function LocationSelector({
  locations,
  selectedLocation,
  onChange
}: LocationSelectorProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const location = locations.find(loc => loc.id === event.target.value);
    if (location) {
      onChange(location);
    }
  };

  return (
    <div className="w-full">
      <label 
        htmlFor="location-select" 
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Location
      </label>
      <select
        id="location-select"
        value={selectedLocation.id}
        onChange={handleChange}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base md:text-sm cursor-pointer transition-colors hover:border-gray-400"
      >
        {locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </select>
      
      {/* Optional: Display activity notes for selected location */}
      {selectedLocation.activityNotes && (
        <p className="mt-2 text-xs text-gray-600">
          {selectedLocation.activityNotes}
        </p>
      )}
    </div>
  );
}
