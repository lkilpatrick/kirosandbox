/**
 * SwellProvider Interface
 * 
 * Abstraction for swell data sources. This interface allows the application
 * to work with mock swell data during development and easily swap to live
 * API providers (e.g., NOAA buoy data, surf forecast APIs) in production.
 * 
 * The provider pattern decouples the data source from the UI and business logic,
 * making the system more testable and flexible.
 */

/**
 * Swell information for a specific location and time
 */
export interface SwellData {
  /** Swell height in feet */
  height: number;
  /** Swell period in seconds */
  period: number;
  /** Swell direction (e.g., 'NW', 'SW') */
  direction: string;
}

/**
 * Provider interface for swell data
 */
export interface SwellProvider {
  /**
   * Get swell information for a specific location and timestamp
   * 
   * @param locationId - Unique identifier for the location (e.g., 'monterey-harbor')
   * @param timestamp - The time for which to retrieve swell data
   * @returns Promise resolving to swell data
   */
  getSwellData(locationId: string, timestamp: Date): Promise<SwellData>;
}
