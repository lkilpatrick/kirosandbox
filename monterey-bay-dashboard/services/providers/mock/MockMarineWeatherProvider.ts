/**
 * MockMarineWeatherProvider
 * 
 * Mock implementation of MarineWeatherProvider that reads from static JSON data.
 * Used for development and testing before live API integration.
 */

import { MarineWeatherProvider, MarineWeatherData } from '../MarineWeatherProvider';
import weatherDataJson from '../../../data/weather-data.json';

interface WeatherDataRecord {
  timestamp: string;
  summary: string;
  airTemp: number;
  marineLayer: boolean;
}

type WeatherDataMap = Record<string, WeatherDataRecord[]>;

export class MockMarineWeatherProvider implements MarineWeatherProvider {
  private data: WeatherDataMap;

  constructor() {
    this.data = weatherDataJson as WeatherDataMap;
  }

  async getWeatherData(locationId: string, timestamp: Date): Promise<MarineWeatherData> {
    const locationData = this.data[locationId];
    
    if (!locationData) {
      throw new Error(`No weather data available for location: ${locationId}`);
    }

    // Find the closest timestamp match
    const record = this.findClosestRecord(locationData, timestamp);
    
    if (!record) {
      throw new Error(`No weather data found for location ${locationId} at ${timestamp.toISOString()}`);
    }

    return {
      summary: record.summary,
      airTemp: record.airTemp,
      marineLayer: record.marineLayer,
    };
  }

  private findClosestRecord(records: WeatherDataRecord[], targetTime: Date): WeatherDataRecord | null {
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
