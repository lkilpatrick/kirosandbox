/**
 * NOAA CO-OPS Tide Provider
 * 
 * Fetches real tide data from NOAA CO-OPS API
 * API Documentation: https://api.tidesandcurrents.noaa.gov/api/prod/
 * 
 * Station IDs for Monterey Bay:
 * - 9413450: Monterey Harbor
 * - 9414290: San Francisco (backup)
 */

import { TideProvider, TideData } from '../TideProvider';

interface NOAATidePrediction {
  t: string; // timestamp
  v: string; // value (height in feet)
  type: string; // 'H' for high, 'L' for low
}

interface NOAAResponse {
  predictions: NOAATidePrediction[];
}

export class NOAATideProvider implements TideProvider {
  private readonly baseUrl = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';
  private readonly stationMap: Record<string, string> = {
    'monterey-harbor': '9413450',
    'moss-landing': '9413450', // Use Monterey as proxy
    'santa-cruz': '9413450', // Use Monterey as proxy
    'carmel': '9413450', // Use Monterey as proxy
  };

  async getTideData(locationId: string, date: Date): Promise<TideData> {
    const stationId = this.stationMap[locationId] || '9413450';
    
    try {
      // Get tide predictions for next 48 hours
      const beginDate = this.formatDate(date);
      const endDate = this.formatDate(new Date(date.getTime() + 48 * 60 * 60 * 1000));
      
      const url = `${this.baseUrl}?` + new URLSearchParams({
        begin_date: beginDate,
        end_date: endDate,
        station: stationId,
        product: 'predictions',
        datum: 'MLLW',
        time_zone: 'lst_ldt',
        interval: 'hilo',
        units: 'english',
        application: 'MontereyBayDashboard',
        format: 'json'
      });

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`NOAA API error: ${response.status}`);
      }

      const data: NOAAResponse = await response.json();
      
      if (!data.predictions || data.predictions.length === 0) {
        throw new Error('No tide predictions available');
      }

      // Find next high and low tides
      const now = date.getTime();
      const predictions = data.predictions
        .map(p => ({
          time: new Date(p.t),
          height: parseFloat(p.v),
          type: p.type
        }))
        .filter(p => p.time.getTime() > now);

      const nextHigh = predictions.find(p => p.type === 'H');
      const nextLow = predictions.find(p => p.type === 'L');

      if (!nextHigh || !nextLow) {
        throw new Error('Could not determine next high/low tides');
      }

      // Determine tide trend (rising if next event is high tide)
      const tideTrend = nextHigh.time < nextLow.time ? 'rising' : 'falling';

      return {
        nextHigh: nextHigh.time,
        nextLow: nextLow.time,
        tideTrend
      };
    } catch (error) {
      console.error('Error fetching NOAA tide data:', error);
      throw error;
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }
}
