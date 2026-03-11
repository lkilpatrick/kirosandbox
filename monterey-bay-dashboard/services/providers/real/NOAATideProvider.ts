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
  type?: string; // 'H' for high, 'L' for low (only in hilo mode)
}

interface NOAAResponse {
  predictions: NOAATidePrediction[];
}

interface TideChartData {
  points: Array<{
    time: Date;
    height: number;
    type?: 'H' | 'L';
  }>;
  currentHeight: number;
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
      
      // NOAA CO-OPS API supports CORS, so we can call directly
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

  /**
   * Get detailed tide chart data for 24-hour visualization
   */
  async getTideChartData(locationId: string, date: Date): Promise<TideChartData> {
    const stationId = this.stationMap[locationId] || '9413450';
    
    try {
      // Get hourly predictions for 24 hours
      const beginDate = this.formatDateTimeForAPI(date);
      const endDate = this.formatDateTimeForAPI(new Date(date.getTime() + 24 * 60 * 60 * 1000));
      
      // Fetch hourly data - NOAA CO-OPS supports CORS
      const hourlyUrl = `${this.baseUrl}?` + new URLSearchParams({
        begin_date: beginDate,
        end_date: endDate,
        station: stationId,
        product: 'predictions',
        datum: 'MLLW',
        time_zone: 'lst_ldt',
        interval: 'h', // hourly
        units: 'english',
        application: 'MontereyBayDashboard',
        format: 'json'
      });

      // Fetch high/low data
      const hiloUrl = `${this.baseUrl}?` + new URLSearchParams({
        begin_date: this.formatDate(date),
        end_date: this.formatDate(new Date(date.getTime() + 24 * 60 * 60 * 1000)),
        station: stationId,
        product: 'predictions',
        datum: 'MLLW',
        time_zone: 'lst_ldt',
        interval: 'hilo',
        units: 'english',
        application: 'MontereyBayDashboard',
        format: 'json'
      });

      const [hourlyResponse, hiloResponse] = await Promise.all([
        fetch(hourlyUrl),
        fetch(hiloUrl)
      ]);

      if (!hourlyResponse.ok || !hiloResponse.ok) {
        throw new Error('NOAA API error');
      }

      const hourlyData: NOAAResponse = await hourlyResponse.json();
      const hiloData: NOAAResponse = await hiloResponse.json();

      if (!hourlyData.predictions || hourlyData.predictions.length === 0) {
        throw new Error('No tide data available');
      }

      // Process hourly data
      const points = hourlyData.predictions.map(p => ({
        time: new Date(p.t),
        height: parseFloat(p.v),
        type: undefined as 'H' | 'L' | undefined
      }));

      // Mark high/low points
      if (hiloData.predictions) {
        hiloData.predictions.forEach(hilo => {
          const hiloTime = new Date(hilo.t).getTime();
          const point = points.find(p => Math.abs(p.time.getTime() - hiloTime) < 30 * 60 * 1000); // within 30 min
          if (point && hilo.type) {
            point.type = hilo.type as 'H' | 'L';
          }
        });
      }

      // Find current height (interpolate if needed)
      const now = date.getTime();
      let currentHeight = 0;
      
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        
        if (p1.time.getTime() <= now && p2.time.getTime() >= now) {
          // Linear interpolation
          const ratio = (now - p1.time.getTime()) / (p2.time.getTime() - p1.time.getTime());
          currentHeight = p1.height + (p2.height - p1.height) * ratio;
          break;
        }
      }

      return {
        points,
        currentHeight
      };
    } catch (error) {
      console.error('Error fetching NOAA tide chart data:', error);
      throw error;
    }
  }

  private formatDateTimeForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}${month}${day} ${hour}:${minute}`;
  }
}
