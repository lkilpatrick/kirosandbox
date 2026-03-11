# Real Data Providers

This directory contains providers that fetch live data from public NOAA APIs.

## Data Sources

### 1. NOAA CO-OPS Tide API
**Provider**: `NOAATideProvider`
**API**: https://api.tidesandcurrents.noaa.gov/api/prod/
**Documentation**: https://tidesandcurrents.noaa.gov/web_services_info.html

- **Station**: 9413450 (Monterey Harbor)
- **Data**: Tide predictions (high/low times and heights)
- **Format**: JSON
- **API Key**: Not required
- **Rate Limits**: Standard NOAA limits apply
- **Update Frequency**: Predictions available 48 hours ahead

### 2. NOAA NDBC Buoy Data
**Provider**: `NDBCBuoyProvider`
**API**: https://www.ndbc.noaa.gov/data/realtime2/
**Documentation**: https://www.ndbc.noaa.gov/

- **Station**: 46042 (Monterey Bay - 36.785°N 122.396°W)
- **Data**: Wind speed/direction/gusts, wave height/period/direction, air/water temperature
- **Format**: Text (whitespace-delimited)
- **API Key**: Not required
- **Rate Limits**: Standard NOAA limits apply
- **Update Frequency**: Real-time (typically every 10-30 minutes)

### 3. National Weather Service API
**Provider**: `NWSWeatherProvider`
**API**: https://api.weather.gov
**Documentation**: https://www.weather.gov/documentation/services-web-api

- **Location**: Monterey Bay coordinates (36.6002°N, 121.8947°W)
- **Data**: Weather forecasts, temperature, conditions
- **Format**: JSON
- **API Key**: Not required
- **Rate Limits**: Standard NWS limits apply
- **Update Frequency**: Forecasts updated every 1-6 hours

### 4. Dive Conditions (Calculated)
**Provider**: `RealDiveConditionsProvider`
**Data Sources**: Combines NDBC buoy + NWS weather data

- **Visibility**: Calculated from swell height and marine layer presence
- **Water Temperature**: From NDBC buoy (when available)
- **Surge**: Calculated from swell height and period

## Usage

```typescript
import { 
  NOAATideProvider, 
  NDBCBuoyProvider, 
  NWSWeatherProvider,
  RealDiveConditionsProvider 
} from '@/services/providers/real';

// Tide data
const tideProvider = new NOAATideProvider();
const tideData = await tideProvider.getTideData('monterey-harbor', new Date());

// Wind data
const buoyProvider = new NDBCBuoyProvider();
const windData = await buoyProvider.getWindData('monterey-harbor', new Date());

// Weather data
const weatherProvider = new NWSWeatherProvider();
const weatherData = await weatherProvider.getWeatherData('monterey-harbor', new Date());

// Dive conditions
const diveProvider = new RealDiveConditionsProvider();
const diveConditions = await diveProvider.getDiveConditions('monterey-harbor', new Date());
```

## API Limitations

### NOAA CO-OPS
- Tide predictions limited to 10 years for high/low data
- No API key required but requests should include application identifier
- Standard rate limiting applies

### NDBC Buoy
- Real-time data only (historical data requires different endpoints)
- Text format requires parsing
- Buoy may be offline for maintenance (check station status)
- Missing data indicated by 99, 999, or 9999 values

### NWS Weather API
- Requires User-Agent header
- Rate limiting: ~5 requests per second per IP
- Forecast grid may change; use points API to get current grid
- Marine layer detection is heuristic-based

## Error Handling

All providers implement error handling for:
- Network failures
- API unavailability
- Invalid responses
- Missing data

Errors are thrown and should be caught by the calling component.

## Data Freshness

- **Tide**: Predictions are pre-calculated, always available
- **Buoy**: Real-time, typically 10-30 minute delay
- **Weather**: Forecasts updated 1-6 hours
- **Dive Conditions**: Calculated on-demand from current buoy/weather data

## Future Enhancements

Potential additional data sources:
- NOAA PORTS (Physical Oceanographic Real-Time System) for currents
- Surfline API for surf forecasts (requires API key)
- CDIP (Coastal Data Information Program) for additional wave data
- MBARI (Monterey Bay Aquarium Research Institute) for local oceanographic data

## Testing

To test the real providers:

```bash
# Run the dev server
npm run dev

# Check browser console for API responses
# Monitor Network tab for API calls
```

## Switching Between Mock and Real Data

To switch back to mock data, update the imports in the component files:

```typescript
// Real data
import { NOAATideProvider } from '@/services/providers/real';

// Mock data
import { MockTideProvider } from '@/services/providers/mock';
```

## Attribution

Data provided by:
- NOAA Center for Operational Oceanographic Products and Services (CO-OPS)
- NOAA National Data Buoy Center (NDBC)
- NOAA National Weather Service (NWS)

All data is public domain and provided free of charge.
