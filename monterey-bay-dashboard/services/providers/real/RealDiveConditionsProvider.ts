/**
 * Real Dive Conditions Provider
 * 
 * Combines real data from multiple sources to calculate dive conditions
 * Uses NDBC buoy data and NWS weather data
 */

import { DiveConditionsProvider, DiveConditionsData } from '../DiveConditionsProvider';
import { NDBCBuoyProvider } from './NDBCBuoyProvider';
import { NWSWeatherProvider } from './NWSWeatherProvider';

export class RealDiveConditionsProvider implements DiveConditionsProvider {
  private buoyProvider: NDBCBuoyProvider;
  private weatherProvider: NWSWeatherProvider;

  constructor() {
    this.buoyProvider = new NDBCBuoyProvider();
    this.weatherProvider = new NWSWeatherProvider();
  }

  async getDiveConditions(locationId: string, date: Date): Promise<DiveConditionsData> {
    try {
      // Fetch data from multiple sources
      const [windData, swellData, weatherData] = await Promise.all([
        this.buoyProvider.getWindData(locationId, date),
        this.buoyProvider.getSwellData(locationId, date),
        this.weatherProvider.getWeatherData(locationId, date)
      ]);

      // Calculate visibility based on conditions
      // Good visibility: calm seas, no marine layer
      // Fair visibility: moderate seas or marine layer
      // Poor visibility: rough seas and marine layer
      let estimatedVisibility: number;
      
      if (swellData.height < 4 && !weatherData.marineLayer) {
        estimatedVisibility = 30; // Good visibility: 30+ feet
      } else if (swellData.height < 6 || weatherData.marineLayer) {
        estimatedVisibility = 15; // Fair visibility: 15-30 feet
      } else {
        estimatedVisibility = 8; // Poor visibility: <15 feet
      }

      // Estimate water temperature (Monterey Bay typically 50-60°F)
      // In real implementation, this would come from buoy data
      const waterTemp = 55;

      // Calculate surge based on swell height and period
      // Higher swell = more surge
      let surgeRisk: 'low' | 'moderate' | 'high';
      if (swellData.height < 3) {
        surgeRisk = 'low';
      } else if (swellData.height < 6) {
        surgeRisk = 'moderate';
      } else {
        surgeRisk = 'high';
      }

      return {
        estimatedVisibility,
        waterTemp,
        surgeRisk
      };
    } catch (error) {
      console.error('Error calculating dive conditions:', error);
      throw error;
    }
  }
}
