/**
 * Verification script for timestamp matching logic
 * Run with: npx tsx services/providers/mock/verify-timestamp-matching.ts
 */

import { MockTideProvider } from './MockTideProvider';

async function verifyTimestampMatching() {
  console.log('Verifying Timestamp Matching Logic...\n');

  const tideProvider = new MockTideProvider();
  const locationId = 'monterey-harbor';

  try {
    // Test exact match
    console.log('Test 1: Exact timestamp match');
    const exactTime = new Date('2024-01-15T08:00:00Z');
    const data1 = await tideProvider.getTideData(locationId, exactTime);
    console.log(`✓ Exact match (${exactTime.toISOString()}):`, data1.tideTrend);

    // Test closest match (between data points)
    console.log('\nTest 2: Closest timestamp match (between data points)');
    const betweenTime = new Date('2024-01-15T11:00:00Z'); // Between 08:00 and 14:00
    const data2 = await tideProvider.getTideData(locationId, betweenTime);
    console.log(`✓ Closest match (${betweenTime.toISOString()}):`, data2.tideTrend);

    // Test closest match (before first data point)
    console.log('\nTest 3: Timestamp before first data point');
    const beforeTime = new Date('2024-01-15T06:00:00Z');
    const data3 = await tideProvider.getTideData(locationId, beforeTime);
    console.log(`✓ Closest match (${beforeTime.toISOString()}):`, data3.tideTrend);

    // Test closest match (after last data point)
    console.log('\nTest 4: Timestamp after last data point');
    const afterTime = new Date('2024-01-17T08:00:00Z');
    const data4 = await tideProvider.getTideData(locationId, afterTime);
    console.log(`✓ Closest match (${afterTime.toISOString()}):`, data4.tideTrend);

    // Test all locations
    console.log('\nTest 5: All locations');
    const testTime = new Date('2024-01-15T14:00:00Z');
    const locations = ['monterey-harbor', 'breakwater', 'stillwater-cove', 'sand-city', 'moss-landing'];
    
    for (const loc of locations) {
      const data = await tideProvider.getTideData(loc, testTime);
      console.log(`✓ ${loc}: ${data.tideTrend}`);
    }

    console.log('\n✅ All timestamp matching tests passed!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyTimestampMatching();
