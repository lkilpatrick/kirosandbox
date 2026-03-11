'use client';

import React from 'react';

export type Activity = 'boating' | 'fishing' | 'diving';

interface ActivitySelectorProps {
  selectedActivity: Activity;
  onChange: (activity: Activity) => void;
}

/**
 * Activity Selector Component
 * 
 * Allows users to choose between Boating, Fishing, and Diving activities.
 * Uses a segmented button group for visual selection.
 * 
 * Validates: Requirements 3.1, 3.2, 3.3, 7.1, 7.2
 * 
 * @param selectedActivity - Currently selected activity
 * @param onChange - Callback when activity changes
 */
export default function ActivitySelector({
  selectedActivity,
  onChange
}: ActivitySelectorProps) {
  const activities: { value: Activity; label: string; icon: string }[] = [
    { value: 'boating', label: 'Boating', icon: '⛵' },
    { value: 'fishing', label: 'Fishing', icon: '🎣' },
    { value: 'diving', label: 'Diving', icon: '🤿' }
  ];

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Activity
      </label>
      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        {activities.map((activity) => {
          const isSelected = selectedActivity === activity.value;
          const buttonClasses = `flex-1 min-w-[100px] px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isSelected
              ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`;
          
          return (
            <button
              key={activity.value}
              onClick={() => onChange(activity.value)}
              className={buttonClasses}
              aria-pressed={isSelected}
              aria-label={`Select ${activity.label}`}
            >
              <span className="mr-2" aria-hidden="true">{activity.icon}</span>
              {activity.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
