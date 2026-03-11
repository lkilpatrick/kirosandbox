/**
 * MockWindProvider
 * 
 * Mock implementation of WindProvider that reads from static JSON data.
 * Used for development and testing before live API integration.
 */

import { WindProvider, WindData } from '../WindProvider';
import windDataJson from '../../../data/wind-data.json';

interface WindDataRecord {
  timestamp: string;
  speed: number;
  gust: number;
  direction: string;
}

type WindDataMap = Record<string, WindDataRecord[]>;

export class MockWindProvider implements WindProvider {
  private data: WindDataMap;

  constructor() {
    this.data = windDataJson as WindDataMap;
  }

  async getWindData(locationId: string, timestamp: Date): Promise<WindData> {
    const locationData = this.data[locationId];
    
    if (!locationData) {
      throw new Error(`No wind data available for location: ${locationId}`);
    }

    // Find the closest timestamp match
    const record = this.findClosestRecord(locationData, timestamp);
    
    if (!record) {
      throw new Error(`No wind data found for location ${locationId} at ${timestamp.toISOString()}`);
    }

    return {
      speed: record.speed,
      gust: record.gust,
      direction: record.direction,
    };
  }

  private findClosestRecord(records: WindDataRecord[], targetTime: Date): WindDataRecord | null {
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
