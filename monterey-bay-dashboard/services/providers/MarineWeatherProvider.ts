/**
 * MarineWeatherProvider Interface
 * 
 * Abstraction for marine weather data sources. This interface allows the application
 * to work with mock weather data during development and easily swap to live
 * API providers (e.g., NOAA marine forecasts, NWS) in production.
 * 
 * The provider pattern decouples the data source from the UI and business logic,
 * making the system more testable and flexible.
 */

/**
 * Marine weather information for a specific location and time
 */
export interface MarineWeatherData {
  /** Weather summary description */
  summary: string;
  /** Air temperature in Fahrenheit */
  airTemp: number;
  /** Whether marine layer is present */
  marineLayer: boolean;
}

/**
 * Provider interface for marine weather data
 */
export interface MarineWeatherProvider {
  /**
   * Get marine weather information for a specific location and timestamp
   * 
   * @param locationId - Unique identifier for the location (e.g., 'monterey-harbor')
   * @param timestamp - The time for which to retrieve weather data
   * @returns Promise resolving to marine weather data
   */
  getWeatherData(locationId: string, timestamp: Date): Promise<MarineWeatherData>;
}
