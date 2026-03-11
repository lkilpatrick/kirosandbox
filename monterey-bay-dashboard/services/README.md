# Services

This folder contains service provider interfaces and implementations for marine condition data.

## Provider Interfaces

- **TideProvider** - Provides tide data (high/low times, trends)
- **MarineWeatherProvider** - Provides marine weather forecasts
- **WindProvider** - Provides wind speed, gust, and direction data
- **SwellProvider** - Provides swell height, period, and direction data
- **DiveConditionsProvider** - Provides dive-specific conditions (visibility, water temp, surge risk)

## Implementation Strategy

- **Mock Providers** - Initial implementations using static/sample data
- **Live Providers** - Future implementations connecting to real APIs (NOAA, NWS, buoy data)
- **Provider Abstraction** - Allows swapping mock/live implementations without UI changes
