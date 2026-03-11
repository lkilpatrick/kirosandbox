/**
 * DiveConditionsProvider Interface
 * 
 * Abstraction for dive-specific condition data sources. This interface allows
 * the application to work with mock dive condition data during development and
 * easily swap to live API providers or calculated estimates in production.
 * 
 * Dive conditions include visibility estimates, water temperature, and surge risk,
 * which may be derived from multiple sources or calculated based on other marine data.
 * 
 * The provider pattern decouples the data source from the UI and business logic,
 * making the system more testable and flexible.
 */

/**
 * Dive-specific condition information for a specific location and time
 */
export interface DiveConditionsData {
  /** Estimated underwater visibility in feet */
  estimatedVisibility: number;
  /** Water temperature in Fahrenheit */
  waterTemp: number;
  /** Surge risk level */
  surgeRisk: 'low' | 'moderate' | 'high';
}

/**
 * Provider interface for dive conditions data
 */
export interface DiveConditionsProvider {
  /**
   * Get dive conditions for a specific location and timestamp
   * 
   * @param locationId - Unique identifier for the location (e.g., 'monterey-harbor')
   * @param timestamp - The time for which to retrieve dive conditions
   * @returns Promise resolving to dive conditions data
   */
  getDiveConditions(locationId: string, timestamp: Date): Promise<DiveConditionsData>;
}
