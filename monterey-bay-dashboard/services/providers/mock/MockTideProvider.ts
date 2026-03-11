/**
 * MockTideProvider
 * 
 * Mock implementation of TideProvider that reads from static JSON data.
 * Used for development and testing before live API integration.
 */

import { TideProvider, TideData } from '../TideProvider';
import tideDataJson from '../../../data/tide-data.json';

interface TideDataRecord {
  timestamp: string;
  nextHigh: string;
  nextLow: string;
  tideTrend: 'rising' | 'falling';
}

type TideDataMap = Record<string, TideDataRecord[]>;

export class MockTideProvider implements TideProvider {
  private data: TideDataMap;

  constructor() {
    this.data = tideDataJson as TideDataMap;
  }

  async getTideData(locationId: string, timestamp: Date): Promise<TideData> {
    const locationData = this.data[locationId];
    
    if (!locationData) {
      throw new Error(`No tide data available for location: ${locationId}`);
    }

    // Find the closest timestamp match
    const record = this.findClosestRecord(locationData, timestamp);
    
    if (!record) {
      throw new Error(`No tide data found for location ${locationId} at ${timestamp.toISOString()}`);
    }

    return {
      nextHigh: new Date(record.nextHigh),
      nextLow: new Date(record.nextLow),
      tideTrend: record.tideTrend,
    };
  }

  private findClosestRecord(records: TideDataRecord[], targetTime: Date): TideDataRecord | null {
    if (records.length === 0) return null;

    const targetTimestamp = targetTime.getTime();
    
    let closest = records[0];
    let minDiff = Math.abs(new Date(records[0].timestamp).getTime() - targetTimestamp);

    for (const record of records) {
      const recordTime = new Date(record.timestamp).getTime();
      const diff = Math.abs(recordTime - targetTimestamp);
      
      if (diff < minDiff) {
        minDiff = diff;
        closest = record;
      }
    }

    return closest;
  }
}
