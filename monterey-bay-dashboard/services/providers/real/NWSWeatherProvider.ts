/**
 * National Weather Service API Provider
 * 
 * Fetches weather data from NWS API
 * API Documentation: https://www.weather.gov/documentation/services-web-api
 * 
 * Monterey Bay coordinates: 36.6002° N, 121.8947° W
 */

import { MarineWeatherProvider, MarineWeatherData } from '../MarineWeatherProvider';

interface NWSPoint {
  properties: {
    forecast: string;
    forecastHourly: string;
  };
}

interface NWSForecast {
  properties: {
    periods: Array<{
      temperature: number;
      temperatureUnit: string;
      shortForecast: string;
      detailedForecast: string;
    }>;
  };
}

export class NWSWeatherProvider implements MarineWeatherProvider {
  private readonly baseUrl = 'https://api.weather.gov';
  private readonly locationCoords: Record<string, { lat: number; lon: number }> = {
    'monterey-harbor': { lat: 36.6002, lon: -121.8947 },
    'moss-landing': { lat: 36.8042, lon: -121.7869 },
    'santa-cruz': { lat: 36.9741, lon: -122.0308 },
    'carmel': { lat: 36.5553, lon: -121.9233 },
  };

  async getWeatherData(locationId: string, date: Date): Promise<MarineWeatherData> {
    const coords = this.locationCoords[locationId] || this.locationCoords['monterey-harbor'];
    
    try {
      // Use API route to avoid CORS issues
      const url = `/api/weather?lat=${coords.lat.toFixed(4)}&lon=${coords.lon.toFixed(4)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const forecastData: NWSForecast = await response.json();
      
      if (!forecastData.properties.periods || forecastData.properties.periods.length === 0) {
        throw new Error('No forecast data available');
      }

      const currentPeriod = forecastData.properties.periods[0];
      
      // Convert temperature to Fahrenheit if needed
      let airTemp = currentPeriod.temperature;
      if (currentPeriod.temperatureUnit === 'C') {
        airTemp = airTemp * 9/5 + 32;
      }

      // Detect marine layer from forecast text
      const forecastText = currentPeriod.detailedForecast.toLowerCase();
      const marineLayer = forecastText.includes('fog') || 
                         forecastText.includes('marine layer') ||
                         forecastText.includes('overcast');

      return {
        summary: currentPeriod.shortForecast,
        airTemp,
        marineLayer
      };
    } catch (error) {
      console.error('Error fetching NWS weather data:', error);
      throw error;
    }
  }
}
