/**
 * MockSwellProvider
 * 
 * Mock implementation of SwellProvider that reads from static JSON data.
 * Used for development and testing before live API integration.
 */

import { SwellProvider, SwellData } from '../SwellProvider';
import swellDataJson from '../../../data/swell-data.json';

interface SwellDataRecord {
  timestamp: string;
  height: number;
  period: number;
  direction: string;
}

type SwellDataMap = Record<string, SwellDataRecord[]>;

export class MockSwellProvider implements SwellProvider {
  private data: SwellDataMap;

  constructor() {
    this.data = swellDataJson as SwellDataMap;
  }

  async getSwellData(locationId: string, timestamp: Date): Promise<SwellData> {
    const locationData = this.data[locationId];
    
    if (!locationData) {
      throw new Error(`No swell data available for location: ${locationId}`);
    }

    // Find the closest timestamp match
    const record = this.findClosestRecord(locationData, timestamp);
    
    if (!record) {
      throw new Error(`No swell data found for location ${locationId} at ${timestamp.toISOString()}`);
    }

    return {
      height: record.height,
      period: record.period,
      direction: record.direction,
    };
  }

  private findClosestRecord(records: SwellDataRecord[], targetTime: Date): SwellDataRecord | null {
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
