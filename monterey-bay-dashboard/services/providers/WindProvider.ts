/**
 * WindProvider Interface
 * 
 * Abstraction for wind data sources. This interface allows the application
 * to work with mock wind data during development and easily swap to live
 * API providers (e.g., NOAA buoy data, weather stations) in production.
 * 
 * The provider pattern decouples the data source from the UI and business logic,
 * making the system more testable and flexible.
 */

/**
 * Wind information for a specific location and time
 */
export interface WindData {
  /** Wind speed in knots */
  speed: number;
  /** Wind gust speed in knots */
  gust: number;
  /** Wind direction (e.g., 'NW', 'SE') */
  direction: string;
}

/**
 * Provider interface for wind data
 */
export interface WindProvider {
  /**
   * Get wind information for a specific location and timestamp
   * 
   * @param locationId - Unique identifier for the location (e.g., 'monterey-harbor')
   * @param timestamp - The time for which to retrieve wind data
   * @returns Promise resolving to wind data
   */
  getWindData(locationId: string, timestamp: Date): Promise<WindData>;
}
