# Provider Interfaces

This directory contains the provider interfaces for marine condition data sources.

## Overview

The provider pattern abstracts data sources behind interfaces, allowing the application to:
- Work with mock data during development
- Easily swap to live API providers in production
- Test components independently of data sources
- Support multiple data source implementations

## Provider Interfaces

### TideProvider
Provides tide information including next high/low tides and current trend.

**Method**: `getTideData(locationId: string, timestamp: Date): Promise<TideData>`

**Returns**: TideData with nextHigh, nextLow, and tideTrend

### MarineWeatherProvider
Provides marine weather conditions including summary, temperature, and marine layer status.

**Method**: `getWeatherData(locationId: string, timestamp: Date): Promise<MarineWeatherData>`

**Returns**: MarineWeatherData with summary, airTemp, and marineLayer

### WindProvider
Provides wind conditions including speed, gusts, and direction.

**Method**: `getWindData(locationId: string, timestamp: Date): Promise<WindData>`

**Returns**: WindData with speed, gust, and direction

### SwellProvider
Provides swell conditions including height, period, and direction.

**Method**: `getSwellData(locationId: string, timestamp: Date): Promise<SwellData>`

**Returns**: SwellData with height, period, and direction

### DiveConditionsProvider
Provides dive-specific conditions including visibility, water temperature, and surge risk.

**Method**: `getDiveConditions(locationId: string, timestamp: Date): Promise<DiveConditionsData>`

**Returns**: DiveConditionsData with estimatedVisibility, waterTemp, and surgeRisk

## Usage

```typescript
import { TideProvider, WindProvider } from './providers';

// Use with dependency injection
class MarineConditionsService {
  constructor(
    private tideProvider: TideProvider,
    private windProvider: WindProvider,
    // ... other providers
  ) {}
  
  async getConditions(locationId: string, timestamp: Date) {
    const tide = await this.tideProvider.getTideData(locationId, timestamp);
    const wind = await this.windProvider.getWindData(locationId, timestamp);
    // ... fetch other data
    
    return { tide, wind, /* ... */ };
  }
}
```

## Implementation

Provider implementations should be created in subdirectories:
- `mock/` - Mock implementations using static JSON data
- `live/` - Live API implementations (future)

## Data Type Alignment

All provider data types align with the corresponding sections of the `MarineConditions` interface:
- TideData → MarineConditions.tide
- MarineWeatherData → MarineConditions.weather
- WindData → MarineConditions.wind
- SwellData → MarineConditions.swell
- DiveConditionsData → MarineConditions.dive
