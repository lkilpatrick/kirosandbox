# Mock Provider Implementations

This directory contains mock implementations of all provider interfaces for development and testing purposes.

## Overview

Mock providers read from static JSON data files located in the `data/` directory. They implement the same interfaces as live API providers, making them interchangeable without requiring changes to the UI or business logic.

## Available Providers

### MockTideProvider
- **Interface**: `TideProvider`
- **Data Source**: `data/tide-data.json`
- **Returns**: Tide information including next high/low times and tide trend

### MockMarineWeatherProvider
- **Interface**: `MarineWeatherProvider`
- **Data Source**: `data/weather-data.json`
- **Returns**: Marine weather summary, air temperature, and marine layer status

### MockWindProvider
- **Interface**: `WindProvider`
- **Data Source**: `data/wind-data.json`
- **Returns**: Wind speed, gust speed, and direction

### MockSwellProvider
- **Interface**: `SwellProvider`
- **Data Source**: `data/swell-data.json`
- **Returns**: Swell height, period, and direction

### MockDiveConditionsProvider
- **Interface**: `DiveConditionsProvider`
- **Data Source**: `data/dive-conditions.json`
- **Returns**: Estimated visibility, water temperature, and surge risk

## Usage

```typescript
import {
  MockTideProvider,
  MockMarineWeatherProvider,
  MockWindProvider,
  MockSwellProvider,
  MockDiveConditionsProvider,
} from '@/services/providers/mock';

// Create provider instances
const tideProvider = new MockTideProvider();
const weatherProvider = new MockMarineWeatherProvider();
const windProvider = new MockWindProvider();
const swellProvider = new MockSwellProvider();
const diveProvider = new MockDiveConditionsProvider();

// Fetch data for a location and timestamp
const timestamp = new Date('2024-01-15T08:00:00Z');
const locationId = 'monterey-harbor';

const tideData = await tideProvider.getTideData(locationId, timestamp);
const weatherData = await weatherProvider.getWeatherData(locationId, timestamp);
const windData = await windProvider.getWindData(locationId, timestamp);
const swellData = await swellProvider.getSwellData(locationId, timestamp);
const diveData = await diveProvider.getDiveConditions(locationId, timestamp);
```

## Timestamp Matching

All mock providers use a "closest timestamp" matching algorithm:

1. When you request data for a specific timestamp, the provider searches through all available data points for that location
2. It finds the data point with the timestamp closest to your requested time
3. This allows flexibility in querying data without requiring exact timestamp matches

**Example:**
- Available data points: 08:00, 14:00, 20:00
- Request for 11:00 → Returns data from 08:00 (closest match)
- Request for 16:00 → Returns data from 14:00 (closest match)

## Supported Locations

All mock providers support the following Monterey Bay locations:
- `monterey-harbor`
- `breakwater`
- `stillwater-cove`
- `sand-city`
- `moss-landing`

## Error Handling

Mock providers throw errors in the following cases:
- **Invalid location**: When requesting data for a location not in the mock data
- **Empty data**: When no data points exist for a location (shouldn't happen with current mock data)

## Testing

Run the verification scripts to test the mock providers:

```bash
# Verify all providers work correctly
npx tsx services/providers/mock/verify-providers.ts

# Verify timestamp matching logic
npx tsx services/providers/mock/verify-timestamp-matching.ts
```

## Transitioning to Live APIs

When ready to integrate live APIs:

1. Create new provider implementations (e.g., `LiveTideProvider`) that implement the same interfaces
2. Update your dependency injection or provider factory to use live providers instead of mock providers
3. No changes needed to UI components or business logic that consume the providers

**Example:**

```typescript
// Before (development)
const tideProvider = new MockTideProvider();

// After (production)
const tideProvider = new LiveTideProvider(apiKey, apiEndpoint);

// Usage remains the same
const data = await tideProvider.getTideData(locationId, timestamp);
```

## Data Format

Each JSON data file follows this structure:

```json
{
  "location-id": [
    {
      "timestamp": "ISO 8601 timestamp",
      // ... provider-specific fields
    }
  ]
}
```

See the individual JSON files in `data/` for complete schemas.
