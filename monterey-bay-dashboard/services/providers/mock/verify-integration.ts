/**
 * Integration verification script for all mock providers
 * Demonstrates how to use all providers together to fetch complete marine conditions
 * Run with: npx tsx services/providers/mock/verify-integration.ts
 */

import {
  MockTideProvider,
  MockMarineWeatherProvider,
  MockWindProvider,
  MockSwellProvider,
  MockDiveConditionsProvider,
} from './index';

async function verifyIntegration() {
  console.log('='.repeat(60));
  console.log('Mock Providers Integration Test');
  console.log('='.repeat(60));

  // Initialize all providers
  const tideProvider = new MockTideProvider();
  const weatherProvider = new MockMarineWeatherProvider();
  const windProvider = new MockWindProvider();
  const swellProvider = new MockSwellProvider();
  const diveProvider = new MockDiveConditionsProvider();

  const locations = ['monterey-harbor', 'breakwater', 'stillwater-cove', 'sand-city', 'moss-landing'];
  const timestamp = new Date('2024-01-15T14:00:00Z');

  console.log(`\nFetching conditions for: ${timestamp.toISOString()}\n`);

  for (const locationId of locations) {
    try {
      console.log(`\n${'─'.repeat(60)}`);
      console.log(`Location: ${locationId.toUpperCase().replace(/-/g, ' ')}`);
      console.log('─'.repeat(60));

      // Fetch all data in parallel
      const [tideData, weatherData, windData, swellData, diveData] = await Promise.all([
        tideProvider.getTideData(locationId, timestamp),
        weatherProvider.getWeatherData(locationId, timestamp),
        windProvider.getWindData(locationId, timestamp),
        swellProvider.getSwellData(locationId, timestamp),
        diveProvider.getDiveConditions(locationId, timestamp),
      ]);

      // Display consolidated conditions
      console.log('\n📊 MARINE CONDITIONS:');
      console.log(`  Tide: ${tideData.tideTrend} (Next High: ${tideData.nextHigh.toLocaleTimeString()})`);
      console.log(`  Weather: ${weatherData.summary} (${weatherData.airTemp}°F)`);
      console.log(`  Wind: ${windData.speed}kt gusting to ${windData.gust}kt from ${windData.direction}`);
      console.log(`  Swell: ${swellData.height}ft @ ${swellData.period}s from ${swellData.direction}`);
      console.log(`  Dive: ${diveData.estimatedVisibility}ft visibility, ${diveData.waterTemp}°F, ${diveData.surgeRisk} surge risk`);

      // Simple condition assessment
      const isFavorable = 
        windData.speed < 15 && 
        swellData.height < 5 && 
        diveData.surgeRisk === 'low';

      console.log(`\n🎯 Quick Assessment: ${isFavorable ? '✅ FAVORABLE' : '⚠️  CAUTION'}`);

    } catch (error) {
      console.error(`❌ Error fetching data for ${locationId}:`, error);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Integration test completed successfully!');
  console.log('='.repeat(60));
}

verifyIntegration();
