# Design Document

## Goal

Build a responsive web dashboard that summarizes ocean conditions for Monterey Bay and converts them into activity-specific recommendations for boating, fishing, and diving.

## Architecture

Use a simple frontend-heavy architecture for v1:

- **Frontend**: React or Next.js web application
- **Data layer**: Mock JSON data initially
- **Service layer**: Provider abstraction for tides, weather, wind, swell, and dive conditions
- **Recommendation engine**: Local rules-based scoring module
- **Future-ready**: Swap mock services for real API adapters

## Main Components

1. **Location Selector** - Allows users to switch between Monterey Bay spots
2. **Activity Selector** - Allows users to choose: Boating, Fishing, Diving
3. **Conditions Summary Cards** - Display: Tide, Marine weather, Wind, Swell, Dive conditions
4. **Recommendation Card** - Shows: Go/Caution/No-Go, short explanation, top contributing factors
5. **Forecast Panel** - Shows current and near-term forecast windows
6. **Data Source Status** - Shows: last updated time, mock/live mode, source health in future versions

## Data Model

### Location
```typescript
{
  id: string
  name: string
  latitude: number
  longitude: number
  activityNotes?: string
}
```

### MarineConditions
```typescript
{
  timestamp: Date
  tide: {
    nextHigh: Date
    nextLow: Date
    tideTrend: 'rising' | 'falling'
  }
  weather: {
    summary: string
    airTemp: number
    marineLayer: boolean
  }
  wind: {
    speed: number
    gust: number
    direction: string
  }
  swell: {
    height: number
    period: number
    direction: string
  }
  dive: {
    estimatedVisibility: number
    waterTemp: number
    surgeRisk: 'low' | 'moderate' | 'high'
  }
}
```

### Recommendation
```typescript
{
  activityType: 'boating' | 'fishing' | 'diving'
  status: 'Go' | 'Caution' | 'No-Go'
  score: number
  reasons: string[]
  cautionFlags: string[]
}
```

## Recommendation Logic

Use a simple rules-based scoring model in v1.

### Boating Factors
- Wind speed
- Swell height
- Swell period
- Tide timing
- Weather advisories

### Fishing Factors
- Wind
- Swell
- Tide phase
- Weather stability

### Diving Factors
- Swell height
- Swell period
- Surge risk
- Estimated visibility
- Wind exposure
- Tide timing

### Example Status Thresholds
- **Go**: Stable, favorable conditions
- **Caution**: Mixed conditions, manageable with experience
- **No-Go**: Strong wind, large swell, poor visibility, or unsafe combinations

## API Abstraction

### Provider Interfaces
- `TideProvider`
- `MarineWeatherProvider`
- `WindProvider`
- `SwellProvider`
- `DiveConditionsProvider`

### Initial Implementation
Mock providers returning static or seeded sample data

### Future Implementation
- NOAA tide data
- NWS marine forecast
- Buoy data sources
- Surf forecast APIs

## UI Notes

- Clean dashboard layout
- Responsive cards
- Emphasis on quick scanning
- Recommendation card at top
- Mobile-first consideration for real dockside use

## Risks and Tradeoffs

- Dive conditions are partly inferred and may not be perfectly reliable
- Different activities require different thresholds by location
- Real API normalization will be more complex than mock mode

## Future Enhancements

- Favorite locations
- Trip planning by date/time
- Alerts
- Harbor-specific notes
- User skill level adjustment
- Custom thresholds for advanced users

## Correctness Properties

### Property 1: Recommendation Consistency
FOR ALL valid marine conditions, generating a recommendation twice SHALL produce the same result (deterministic scoring)

### Property 2: Threshold Monotonicity
IF condition A has worse values than condition B across all factors, THEN condition A SHALL NOT have a better recommendation status than condition B

### Property 3: Provider Interface Compliance
FOR ALL provider implementations (mock or live), the data structure returned SHALL conform to the defined interface contract

### Property 4: Location Data Integrity
FOR ALL supported locations, the location data SHALL include valid latitude and longitude coordinates within Monterey Bay bounds

### Property 5: Timestamp Ordering
FOR ALL forecast windows, the timestamps SHALL be in chronological order with no gaps or overlaps

### Property 6: Activity Coverage
FOR ALL supported activities (boating, fishing, diving), the recommendation engine SHALL produce a valid recommendation given any valid marine conditions input
