/**
 * Activity recommendation data model
 * 
 * Represents a recommendation for a specific marine activity based on
 * current conditions, including a status, score, and explanatory reasons.
 */
export interface Recommendation {
  /** Type of marine activity */
  activityType: 'boating' | 'fishing' | 'diving';
  
  /** Overall recommendation status */
  status: 'Go' | 'Caution' | 'No-Go';
  
  /** Numerical score (0-100) indicating condition favorability */
  score: number;
  
  /** List of reasons supporting the recommendation */
  reasons: string[];
  
  /** List of caution flags or warnings */
  cautionFlags: string[];
}
