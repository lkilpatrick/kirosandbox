/**
 * Marine conditions data model
 * 
 * Represents real-time marine and weather conditions for a specific
 * location in Monterey Bay, including tide, weather, wind, swell, and dive conditions.
 */
export interface MarineConditions {
  /** Timestamp when conditions were recorded */
  timestamp: Date;
  
  /** Tide information */
  tide: {
    /** Next high tide time */
    nextHigh: Date;
    /** Next low tide time */
    nextLow: Date;
    /** Current tide trend */
    tideTrend: 'rising' | 'falling';
  };
  
  /** Weather conditions */
  weather: {
    /** Weather summary description */
    summary: string;
    /** Air temperature in Fahrenheit */
    airTemp: number;
    /** Whether marine layer is present */
    marineLayer: boolean;
  };
  
  /** Wind conditions */
  wind: {
    /** Wind speed in knots */
    speed: number;
    /** Wind gust speed in knots */
    gust: number;
    /** Wind direction (e.g., 'NW', 'SE') */
    direction: string;
  };
  
  /** Swell conditions */
  swell: {
    /** Swell height in feet */
    height: number;
    /** Swell period in seconds */
    period: number;
    /** Swell direction (e.g., 'NW', 'SW') */
    direction: string;
  };
  
  /** Diving-specific conditions */
  dive: {
    /** Estimated underwater visibility in feet */
    estimatedVisibility: number;
    /** Water temperature in Fahrenheit */
    waterTemp: number;
    /** Surge risk level */
    surgeRisk: 'low' | 'moderate' | 'high';
  };
}
