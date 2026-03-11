# Models

This folder contains TypeScript type definitions and interfaces for the application.

## Core Types

### Location
Represents a specific geographic point in Monterey Bay with coordinates and metadata.

### MarineConditions
Comprehensive marine condition data including:
- Tide information (high/low times, trends)
- Weather summary (air temp, marine layer)
- Wind data (speed, gust, direction)
- Swell data (height, period, direction)
- Dive conditions (visibility, water temp, surge risk)

### Recommendation
Activity-specific recommendation with:
- Activity type (boating, fishing, diving)
- Status (Go, Caution, No-Go)
- Score and reasoning
- Caution flags and contributing factors
