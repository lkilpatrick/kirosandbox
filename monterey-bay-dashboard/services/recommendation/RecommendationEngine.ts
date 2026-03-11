/**
 * Recommendation Engine
 * 
 * Rules-based scoring system that generates activity-specific recommendations
 * based on marine conditions. Uses deterministic scoring to ensure consistent
 * results for the same input conditions.
 */

import { MarineConditions } from '@/models/MarineConditions';
import { Recommendation } from '@/models/Recommendation';

export type ActivityType = 'boating' | 'fishing' | 'diving';

/**
 * Factor evaluation result
 */
interface FactorScore {
  score: number; // 0-100
  reason?: string;
  cautionFlag?: string;
}

/**
 * RecommendationEngine generates activity-specific recommendations
 * based on marine conditions using a rules-based scoring approach.
 */
export class RecommendationEngine {
  /**
   * Generate a recommendation for a specific activity based on marine conditions
   * 
   * @param conditions - Current marine conditions
   * @param activityType - Type of activity (boating, fishing, diving)
   * @returns Recommendation with status, score, reasons, and caution flags
   */
  generateRecommendation(
    conditions: MarineConditions,
    activityType: ActivityType
  ): Recommendation {
    // Evaluate all relevant factors for the activity
    const factorScores = this.evaluateFactors(conditions, activityType);
    
    // Calculate overall score (average of all factor scores)
    const overallScore = this.calculateOverallScore(factorScores);
    
    // Determine status based on score thresholds
    const status = this.determineStatus(overallScore);
    
    // Extract reasons and caution flags
    const reasons = factorScores
      .filter(f => f.reason)
      .map(f => f.reason!);
    
    const cautionFlags = factorScores
      .filter(f => f.cautionFlag)
      .map(f => f.cautionFlag!);
    
    return {
      activityType,
      status,
      score: Math.round(overallScore),
      reasons,
      cautionFlags
    };
  }
  
  /**
   * Evaluate all relevant factors for the given activity
   */
  private evaluateFactors(
    conditions: MarineConditions,
    activityType: ActivityType
  ): FactorScore[] {
    const scores: FactorScore[] = [];
    
    // Common factors evaluated for all activities
    scores.push(this.evaluateWindSpeed(conditions.wind.speed, conditions.wind.gust));
    scores.push(this.evaluateSwellHeight(conditions.swell.height));
    scores.push(this.evaluateSwellPeriod(conditions.swell.period));
    
    // Activity-specific factors
    switch (activityType) {
      case 'boating':
        scores.push(this.evaluateTideTimingForBoating(conditions.tide));
        break;
      case 'fishing':
        scores.push(this.evaluateTidePhaseForFishing(conditions.tide));
        scores.push(this.evaluateWeatherStability(conditions.weather));
        break;
      case 'diving':
        scores.push(this.evaluateSurgeRisk(conditions.dive.surgeRisk));
        scores.push(this.evaluateVisibility(conditions.dive.estimatedVisibility));
        scores.push(this.evaluateTideTimingForDiving(conditions.tide));
        break;
    }
    
    return scores;
  }
  
  /**
   * Calculate overall score from individual factor scores
   */
  private calculateOverallScore(factorScores: FactorScore[]): number {
    if (factorScores.length === 0) return 50;
    
    const sum = factorScores.reduce((acc, f) => acc + f.score, 0);
    return sum / factorScores.length;
  }
  
  /**
   * Determine status based on overall score
   * 
   * Thresholds:
   * - Go: 70-100 (favorable conditions)
   * - Caution: 40-69 (mixed conditions, manageable with experience)
   * - No-Go: 0-39 (unsafe conditions)
   */
  private determineStatus(score: number): 'Go' | 'Caution' | 'No-Go' {
    if (score >= 70) return 'Go';
    if (score >= 40) return 'Caution';
    return 'No-Go';
  }
  
  // ========== Factor Evaluation Methods ==========
  
  /**
   * Evaluate wind speed factor
   */
  private evaluateWindSpeed(speed: number, gust: number): FactorScore {
    // Wind speed thresholds (knots)
    // Excellent: 0-10, Good: 10-15, Moderate: 15-20, Poor: 20-25, Unsafe: 25+
    
    if (speed <= 10) {
      return {
        score: 100,
        reason: 'Light winds'
      };
    } else if (speed <= 15) {
      return {
        score: 80,
        reason: 'Moderate winds'
      };
    } else if (speed <= 20) {
      return {
        score: 50,
        reason: 'Fresh winds',
        cautionFlag: 'Wind speed 15-20 knots'
      };
    } else if (speed <= 25) {
      return {
        score: 25,
        reason: 'Strong winds',
        cautionFlag: 'Wind speed 20-25 knots'
      };
    } else {
      return {
        score: 0,
        reason: 'Very strong winds',
        cautionFlag: `Wind speed ${speed} knots - unsafe`
      };
    }
  }
  
  /**
   * Evaluate swell height factor
   */
  private evaluateSwellHeight(height: number): FactorScore {
    // Swell height thresholds (feet)
    // Calm: 0-3, Moderate: 3-6, Rough: 6-10, Very rough: 10+
    
    if (height <= 3) {
      return {
        score: 100,
        reason: 'Small swell'
      };
    } else if (height <= 6) {
      return {
        score: 70,
        reason: 'Moderate swell'
      };
    } else if (height <= 10) {
      return {
        score: 35,
        reason: 'Large swell',
        cautionFlag: `Swell height ${height} feet`
      };
    } else {
      return {
        score: 0,
        reason: 'Very large swell',
        cautionFlag: `Swell height ${height} feet - unsafe`
      };
    }
  }
  
  /**
   * Evaluate swell period factor
   * Longer periods indicate more powerful swells
   */
  private evaluateSwellPeriod(period: number): FactorScore {
    // Swell period thresholds (seconds)
    // Short period (wind swell): <10, Medium: 10-14, Long period (ground swell): 14+
    
    if (period < 10) {
      return {
        score: 90,
        reason: 'Short period swell (choppy)'
      };
    } else if (period <= 14) {
      return {
        score: 70,
        reason: 'Medium period swell'
      };
    } else if (period <= 18) {
      return {
        score: 50,
        reason: 'Long period swell',
        cautionFlag: 'Long period swell - more powerful'
      };
    } else {
      return {
        score: 30,
        reason: 'Very long period swell',
        cautionFlag: `${period}s period - very powerful swell`
      };
    }
  }
  
  /**
   * Evaluate tide timing for boating
   */
  private evaluateTideTimingForBoating(tide: MarineConditions['tide']): FactorScore {
    // For boating, we prefer stable tide conditions
    // This is a simplified evaluation - future tasks will add more sophisticated logic
    
    const now = new Date();
    const hoursToNextHigh = (tide.nextHigh.getTime() - now.getTime()) / (1000 * 60 * 60);
    const hoursToNextLow = (tide.nextLow.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    // Prefer times near slack tide (between tides)
    const minHours = Math.min(Math.abs(hoursToNextHigh), Math.abs(hoursToNextLow));
    
    if (minHours < 1) {
      return {
        score: 90,
        reason: 'Near slack tide'
      };
    } else if (minHours < 2) {
      return {
        score: 70,
        reason: 'Moderate tidal current'
      };
    } else {
      return {
        score: 50,
        reason: 'Strong tidal current',
        cautionFlag: 'Peak tidal flow'
      };
    }
  }
  
  /**
   * Evaluate tide phase for fishing
   */
  private evaluateTidePhaseForFishing(tide: MarineConditions['tide']): FactorScore {
    // For fishing, moving tides are often better than slack
    
    if (tide.tideTrend === 'rising') {
      return {
        score: 85,
        reason: 'Rising tide (good for fishing)'
      };
    } else {
      return {
        score: 80,
        reason: 'Falling tide (good for fishing)'
      };
    }
  }
  
  /**
   * Evaluate weather stability for fishing
   */
  private evaluateWeatherStability(weather: MarineConditions['weather']): FactorScore {
    // Marine layer can indicate stable conditions
    // This is simplified - future tasks will add more sophisticated logic
    
    if (weather.marineLayer) {
      return {
        score: 75,
        reason: 'Stable marine layer present'
      };
    } else {
      return {
        score: 70,
        reason: 'Clear weather'
      };
    }
  }
  
  /**
   * Evaluate surge risk for diving
   */
  private evaluateSurgeRisk(surgeRisk: 'low' | 'moderate' | 'high'): FactorScore {
    switch (surgeRisk) {
      case 'low':
        return {
          score: 100,
          reason: 'Low surge risk'
        };
      case 'moderate':
        return {
          score: 50,
          reason: 'Moderate surge',
          cautionFlag: 'Moderate surge conditions'
        };
      case 'high':
        return {
          score: 0,
          reason: 'High surge risk',
          cautionFlag: 'High surge - unsafe for diving'
        };
    }
  }
  
  /**
   * Evaluate visibility for diving
   */
  private evaluateVisibility(visibility: number): FactorScore {
    // Visibility thresholds (feet)
    // Excellent: 30+, Good: 20-30, Fair: 10-20, Poor: <10
    
    if (visibility >= 30) {
      return {
        score: 100,
        reason: 'Excellent visibility'
      };
    } else if (visibility >= 20) {
      return {
        score: 80,
        reason: 'Good visibility'
      };
    } else if (visibility >= 10) {
      return {
        score: 50,
        reason: 'Fair visibility',
        cautionFlag: 'Limited visibility'
      };
    } else {
      return {
        score: 20,
        reason: 'Poor visibility',
        cautionFlag: `Only ${visibility} feet visibility`
      };
    }
  }
  
  /**
   * Evaluate tide timing for diving
   */
  private evaluateTideTimingForDiving(tide: MarineConditions['tide']): FactorScore {
    // For diving, slack tide is preferred (minimal current)
    
    const now = new Date();
    const hoursToNextHigh = (tide.nextHigh.getTime() - now.getTime()) / (1000 * 60 * 60);
    const hoursToNextLow = (tide.nextLow.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    const minHours = Math.min(Math.abs(hoursToNextHigh), Math.abs(hoursToNextLow));
    
    if (minHours < 0.5) {
      return {
        score: 100,
        reason: 'Slack tide - ideal for diving'
      };
    } else if (minHours < 1.5) {
      return {
        score: 70,
        reason: 'Moderate current'
      };
    } else {
      return {
        score: 40,
        reason: 'Strong current',
        cautionFlag: 'Strong tidal current'
      };
    }
  }
}
