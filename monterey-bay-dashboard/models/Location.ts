/**
 * Location data model for Monterey Bay spots
 * 
 * Represents a specific geographic point in Monterey Bay
 * with optional activity-specific notes.
 */
export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  activityNotes?: string;
}

/**
 * Hardcoded Monterey Bay locations
 * 
 * Validates: Requirements 1.3
 * Supports: Monterey Harbor, Breakwater, Stillwater Cove, Sand City, and Moss Landing
 */
export const MONTEREY_BAY_LOCATIONS: Location[] = [
  {
    id: 'monterey-harbor',
    name: 'Monterey Harbor',
    latitude: 36.6002,
    longitude: -121.8947,
    activityNotes: 'Protected harbor, good for all activities'
  },
  {
    id: 'breakwater',
    name: 'Breakwater',
    latitude: 36.6069,
    longitude: -121.8897,
    activityNotes: 'Popular dive site, sheltered by breakwater'
  },
  {
    id: 'stillwater-cove',
    name: 'Stillwater Cove',
    latitude: 36.5658,
    longitude: -121.9442,
    activityNotes: 'Scenic cove, good for kayaking and diving'
  },
  {
    id: 'sand-city',
    name: 'Sand City',
    latitude: 36.6177,
    longitude: -121.8494,
    activityNotes: 'Beach access, good for shore fishing'
  },
  {
    id: 'moss-landing',
    name: 'Moss Landing',
    latitude: 36.8042,
    longitude: -121.7874,
    activityNotes: 'Harbor and jetty, excellent fishing spot'
  }
];

/**
 * Default location for initial dashboard display
 * 
 * Validates: Requirements 1.1
 */
export const DEFAULT_LOCATION = MONTEREY_BAY_LOCATIONS[0]; // Monterey Harbor
