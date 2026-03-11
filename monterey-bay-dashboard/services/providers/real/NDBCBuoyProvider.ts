/**
 * NDBC Buoy Data Provider
 * 
 * Fetches real buoy data from NOAA National Data Buoy Center
 * Station 46042: Monterey Bay (36.785 N 122.396 W)
 * 
 * Data format: https://www.ndbc.noaa.gov/data/realtime2/
 */

import { WindProvider, WindData } from '../WindProvider';
import { SwellProvider, SwellData } from '../SwellProvider';

interface NDBCStandardData {
  windSpeed: number;
  windDirection: number;
  windGust: number;
  waveHeight: number;
  dominantPeriod: number;
  averagePeriod: number;
  waveDirection: number;
  pressure: number;
  airTemp: number;
  waterTemp: number;
  timestamp: Date;
}

export class NDBCBuoyProvider implements WindProvider, SwellProvider {
  private readonly baseUrl = 'https://www.ndbc.noaa.gov/data/realtime2';
  private readonly stationId = '46042'; // Monterey Bay buoy

  async getWindData(locationId: string, date: Date): Promise<WindData> {
    const data = await this.fetchLatestBuoyData();
    
    return {
      speed: data.windSpeed,
      direction: this.degreesToDirection(data.windDirection),
      gust: data.windGust
    };
  }

  async getSwellData(locationId: string, date: Date): Promise<SwellData> {
    const data = await this.fetchLatestBuoyData();
    
    return {
      height: data.waveHeight,
      period: data.dominantPeriod,
      direction: this.degreesToDirection(data.waveDirection)
    };
  }

  private degreesToDirection(degrees: number): string {
    if (degrees < 0 || degrees > 360) return 'N/A';
    
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  private async fetchLatestBuoyData(): Promise<NDBCStandardData> {
    try {
      // Fetch standard meteorological data
      const url = `${this.baseUrl}/${this.stationId}.txt`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`NDBC API error: ${response.status}`);
      }

      const text = await response.text();
      const lines = text.trim().split('\n');
      
      // Skip header lines (first 2 lines)
      if (lines.length < 3) {
        throw new Error('Insufficient buoy data');
      }

      // Parse the most recent data line (line 2, after headers)
      const dataLine = lines[2].trim().split(/\s+/);
      
      // NDBC format: YY MM DD hh mm WDIR WSPD GST WVHT DPD APD MWD PRES ATMP WTMP
      const year = parseInt(dataLine[0]);
      const month = parseInt(dataLine[1]) - 1;
      const day = parseInt(dataLine[2]);
      const hour = parseInt(dataLine[3]);
      const minute = parseInt(dataLine[4]);
      
      const timestamp = new Date(year < 100 ? 2000 + year : year, month, day, hour, minute);
      
      const parseValue = (val: string): number => {
        const num = parseFloat(val);
        return (isNaN(num) || num === 99 || num === 999 || num === 9999) ? 0 : num;
      };

      return {
        windDirection: parseValue(dataLine[5]),
        windSpeed: parseValue(dataLine[6]) * 1.15078, // Convert m/s to knots
        windGust: parseValue(dataLine[7]) * 1.15078,
        waveHeight: parseValue(dataLine[8]) * 3.28084, // Convert meters to feet
        dominantPeriod: parseValue(dataLine[9]),
        averagePeriod: parseValue(dataLine[10]),
        waveDirection: parseValue(dataLine[11]),
        pressure: parseValue(dataLine[12]),
        airTemp: parseValue(dataLine[13]) * 9/5 + 32, // Convert C to F
        waterTemp: parseValue(dataLine[14]) * 9/5 + 32,
        timestamp
      };
    } catch (error) {
      console.error('Error fetching NDBC buoy data:', error);
      throw error;
    }
  }
}
