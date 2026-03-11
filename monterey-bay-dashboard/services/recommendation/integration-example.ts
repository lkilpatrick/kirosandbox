/**
 * Integration Example
 * 
 * Demonstrates how to use RecommendationEngine with mock providers
 * to generate recommendations from real data sources.
 * 
 * This shows the complete flow:
 * 1. Fetch data from all providers
 * 2. Combine into MarineConditions object
 * 3. Generate recommendation
 */

import { RecommendationEngine } from './RecommendationEngine';
import { MarineConditions } from '@/models/MarineConditions';
import {
  MockTideProvider,
  MockMarineWeatherProvider,
  MockWindProvider,
  MockSwellProvider,
  MockDiveConditionsProvider
} from '@/services/providers/mock';

/**
 * Fetch complete marine conditions from all providers
 */
async function fetchMarineConditions(
  locationId: string,
  timestamp: Date
): Promise<MarineConditions> {
  // Initialize providers
  const tideProvider = new MockTideProvider();
  const weatherProvider = new MockMarineWeatherProvider();
  const windProvider = new MockWindProvider();
  const swellProvider = new MockSwellProvider();
  const diveProvider = new MockDiveConditionsProvider();
  
  // Fetch data from all providers in parallel
  const [tide, weather, wind, swell, dive] = await Promise.all([
    tideProvider.getTideData(locationId, timestamp),
    weatherProvider.getWeatherData(locationId, timestamp),
    windProvider.getWindData(locationId, timestamp),
    swellProvider.getSwellData(locationId, timestamp),
    diveProvider.getDiveConditions(locationId, timestamp)
  ]);
  
  // Combine into MarineConditions object
  return {
    timestamp,
    tide,
    weather,
    wind,
    swell,
    dive
  };
}

/**
 * Generate recommendations for all activities
 */
async function generateAllRecommendations(locationId: string, timestamp: Date) {
  const engine = new RecommendationEngine();
  
  // Fetch conditions
  console.log(`Fetching conditions for ${locationId}...`);
  const conditions = await fetchMarineConditions(locationId, timestamp);
  
  console.log('\nMarine Conditions:');
  console.log('- Wind:', `${conditions.wind.speed} knots ${conditions.wind.direction}`);
  console.log('- Swell:', `${conditions.swell.height} ft @ ${conditions.swell.period}s`);
  console.log('- Tide:', conditions.tide.tideTrend);
  console.log('- Visibility:', `${conditions.dive.estimatedVisibility} ft`);
  console.log('- Surge Risk:', conditions.dive.surgeRisk);
  
  // Generate recommendations for each activity
  console.log('\n=== Recommendations ===\n');
  
  const activities: Array<'boating' | 'fishing' | 'diving'> = ['boating', 'fishing', 'diving'];
  
  for (const activity of activities) {
    const recommendation = engine.generateRecommendation(conditions, activity);
    
    console.log(`${activity.toUpperCase()}:`);
    console.log(`  Status: ${recommendation.status}`);
    console.log(`  Score: ${recommendation.score}/100`);
    console.log(`  Reasons:`);
    recommendation.reasons.forEach(reason => console.log(`    - ${reason}`));
    
    if (recommendation.cautionFlags.length > 0) {
      console.log(`  Caution Flags:`);
      recommendation.cautionFlags.forEach(flag => console.log(`    ⚠️  ${flag}`));
    }
    console.log();
  }
}

// Example usage
if (require.main === module) {
  const locationId = 'monterey-harbor';
  const timestamp = new Date();
  
  generateAllRecommendations(locationId, timestamp)
    .then(() => console.log('Complete!'))
    .catch(error => console.error('Error:', error));
}

export { fetchMarineConditions, generateAllRecommendations };
