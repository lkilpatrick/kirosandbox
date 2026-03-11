/**
 * Manual verification script for mock providers
 * Run with: npx tsx services/providers/mock/verify-providers.ts
 */

import { MockTideProvider } from './MockTideProvider';
import { MockMarineWeatherProvider } from './MockMarineWeatherProvider';
import { MockWindProvider } from './MockWindProvider';
import { MockSwellProvider } from './MockSwellProvider';
import { MockDiveConditionsProvider } from './MockDiveConditionsProvider';

async function verifyProviders() {
  console.log('Verifying Mock Providers...\n');

  const timestamp = new Date('2024-01-15T08:00:00Z');
  const locationId = 'monterey-harbor';

  try {
    // Test TideProvider
    console.log('Testing MockTideProvider...');
    const tideProvider = new MockTideProvider();
    const tideData = await tideProvider.getTideData(locationId, timestamp);
    console.log('✓ Tide data:', tideData);

    // Test MarineWeatherProvider
    console.log('\nTesting MockMarineWeatherProvider...');
    const weatherProvider = new MockMarineWeatherProvider();
    const weatherData = await weatherProvider.getWeatherData(locationId, timestamp);
    console.log('✓ Weather data:', weatherData);

    // Test WindProvider
    console.log('\nTesting MockWindProvider...');
    const windProvider = new MockWindProvider();
    const windData = await windProvider.getWindData(locationId, timestamp);
    console.log('✓ Wind data:', windData);

    // Test SwellProvider
    console.log('\nTesting MockSwellProvider...');
    const swellProvider = new MockSwellProvider();
    const swellData = await swellProvider.getSwellData(locationId, timestamp);
    console.log('✓ Swell data:', swellData);

    // Test DiveConditionsProvider
    console.log('\nTesting MockDiveConditionsProvider...');
    const diveProvider = new MockDiveConditionsProvider();
    const diveData = await diveProvider.getDiveConditions(locationId, timestamp);
    console.log('✓ Dive conditions:', diveData);

    console.log('\n✅ All providers verified successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyProviders();
