# Monterey Bay Conditions Dashboard - Folder Structure

This document describes the folder organization for the project.

## Directory Structure

```
monterey-bay-dashboard/
├── app/                    # Next.js app directory (existing)
├── components/             # React components
│   ├── selectors/         # Location and Activity selector components
│   ├── conditions/        # Condition card components (tide, weather, wind, swell, dive)
│   ├── recommendation/    # Recommendation card and related components
│   ├── forecast/          # Forecast panel components
│   └── layout/            # Layout and dashboard components
├── services/              # Service layer
│   ├── providers/         # Provider interfaces and implementations
│   └── recommendation/    # Recommendation engine and scoring logic
├── models/                # TypeScript type definitions
├── data/                  # Mock data for development
└── public/                # Static assets (existing)
```

## Folder Purposes

### `/components`
Contains all React UI components organized by functionality:
- **selectors/** - Location and Activity selector components
- **conditions/** - Individual condition cards (tide, weather, wind, swell, dive)
- **recommendation/** - Recommendation card showing Go/Caution/No-Go status
- **forecast/** - Forecast panel for current and near-term conditions
- **layout/** - Dashboard layout and structural components

### `/services`
Service layer for data providers and business logic:
- **providers/** - Provider interfaces (TideProvider, MarineWeatherProvider, WindProvider, SwellProvider, DiveConditionsProvider) and their implementations (mock and future live API adapters)
- **recommendation/** - Rules-based recommendation engine and activity-specific scoring logic

### `/models`
TypeScript type definitions and interfaces:
- Location types
- MarineConditions types
- Recommendation types
- Provider interface definitions

### `/data`
Mock data for development and testing:
- locations.json - Monterey Bay locations
- tide-data.json - Sample tide predictions
- weather-data.json - Sample marine weather
- wind-data.json - Sample wind conditions
- swell-data.json - Sample swell forecasts
- dive-conditions.json - Sample dive condition estimates

## Design Principles

1. **Separation of Concerns**: Components, services, models, and data are clearly separated
2. **Provider Abstraction**: Service layer uses provider pattern to allow easy swapping between mock and live data sources
3. **Type Safety**: All data structures defined in models/ for TypeScript type checking
4. **Scalability**: Structure supports future expansion with live API integrations
5. **Testability**: Mock data enables development and testing without external dependencies

## Next Steps

- Task 2.1: Define TypeScript types in models/
- Task 2.2-2.7: Create mock data files in data/
- Task 2.8-2.9: Build provider interfaces and implementations in services/providers/
- Task 3.x: Implement UI components in components/
- Task 4.x: Build recommendation engine in services/recommendation/
