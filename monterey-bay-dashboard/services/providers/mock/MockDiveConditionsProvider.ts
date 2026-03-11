/**
 * MockDiveConditionsProvider
 * 
 * Mock implementation of DiveConditionsProvider that reads from static JSON data.
 * Used for development and testing before live API integration.
 */

import { DiveConditionsProvider, DiveConditionsData } from '../DiveConditionsProvider';
import diveConditionsJson from '../../../data/dive-conditions.json';

interface DiveConditionsRecord {
  timestamp: string;
  estimatedVisibility: number;
  waterTemp: number;
  surgeRisk: 'low' | 'moderate' | 'high';
}

type DiveConditionsMap = Record<string, DiveConditionsRecord[]>;

export class MockDiveConditionsProvider implements DiveConditionsProvider {
  private data: DiveConditionsMap;

  constructor() {
    this.data = diveConditionsJson as DiveConditionsMap;
  }

  async getDiveConditions(locationId: string, timestamp: Date): Promise<DiveConditionsData> {
    const locationData = this.data[locationId];
    
    if (!locationData) {
      throw new Error(`No dive conditions data available for location: ${locationId}`);
    }

    // Find the closest timestamp match
    const record = this.findClosestRecord(locationData, timestamp);
    
    if (!record) {
      throw new Error(`No dive conditions data found for location ${locationId} at ${timestamp.toISOString()}`);
    }

    return {
      estimatedVisibility: record.estimatedVisibility,
      waterTemp: record.waterTemp,
      surgeRisk: record.surgeRisk,
    };
  }

  private findClosestRecord(records: DiveConditionsRecord[], targetTime: Date): DiveConditionsRecord | null {
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
