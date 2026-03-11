/**
 * TideProvider Interface
 * 
 * Abstraction for tide data sources. This interface allows the application
 * to work with mock tide data during development and easily swap to live
 * API providers (e.g., NOAA tide predictions) in production.
 * 
 * The provider pattern decouples the data source from the UI and business logic,
 * making the system more testable and flexible.
 */

/**
 * Tide information for a specific location and time
 */
export interface TideData {
  /** Next high tide time */
  nextHigh: Date;
  /** Next low tide time */
  nextLow: Date;
  /** Current tide trend */
  tideTrend: 'rising' | 'falling';
}

/**
 * Provider interface for tide data
 */
export interface TideProvider {
  /**
   * Get tide information for a specific location and timestamp
   * 
   * @param locationId - Unique identifier for the location (e.g., 'monterey-harbor')
   * @param timestamp - The time for which to retrieve tide data
   * @returns Promise resolving to tide data
   */
  getTideData(locationId: string, timestamp: Date): Promise<TideData>;
}
