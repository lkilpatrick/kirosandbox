# Tasks

## Phase 1: Project Setup

- [x] 1.1 Create app scaffold with React or Next.js
- [x] 1.2 Set up folder structure for components, services, models, and mock data
- [x] 1.3 Create base responsive layout
- [x] 1.4 Add location selector component
- [x] 1.5 Add activity selector component

## Phase 2: Mock Data and Models

- [x] 2.1 Define TypeScript types for Location, MarineConditions, and Recommendation
- [x] 2.2 Create mock Monterey Bay locations data (Monterey Harbor, Breakwater, Stillwater Cove, Sand City, Moss Landing)
- [x] 2.3 Create mock tide data
- [x] 2.4 Create mock weather data
- [x] 2.5 Create mock wind data
- [x] 2.6 Create mock swell data
- [x] 2.7 Create mock dive condition data
- [x] 2.8 Build provider interfaces (TideProvider, MarineWeatherProvider, WindProvider, SwellProvider, DiveConditionsProvider)
- [x] 2.9 Implement mock provider implementations

## Phase 3: Conditions Dashboard

- [x] 3.1 Build tide card component
- [x] 3.2 Build marine weather card component
- [x] 3.3 Build wind card component
- [x] 3.4 Build swell card component
- [x] 3.5 Build dive conditions card component
- [x] 3.6 Build forecast panel component
- [x] 3.7 Integrate all condition cards into dashboard layout

## Phase 4: Recommendation Engine

- [x] 4.1 Implement rules-based recommendation scoring logic
- [x] 4.2 Add activity-specific thresholds for boating
- [x] 4.3 Add activity-specific thresholds for fishing
- [x] 4.4 Add activity-specific thresholds for diving
- [x] 4.5 Build recommendation summary card component
- [x] 4.6 Display recommendation explanation
- [x] 4.7 Display caution factors and contributing conditions

## Phase 5: UX Polish

- [~] 5.1 Improve mobile responsiveness for all components
- [~] 5.2 Add loading states
- [~] 5.3 Add empty states
- [~] 5.4 Add timestamps and data freshness indicators
- [~] 5.5 Improve layout hierarchy for quick scanning
- [~] 5.6 Ensure recommendation card is prominently positioned

## Phase 6: Testing

- [~] 6.1 Test recommendation logic across mock scenarios (favorable conditions)
- [~] 6.2 Test recommendation logic across mock scenarios (caution conditions)
- [~] 6.3 Test recommendation logic across mock scenarios (no-go conditions)
- [~] 6.4 Test location switching functionality
- [~] 6.5 Test activity switching functionality
- [~] 6.6 Test responsive behavior on mobile devices
- [~] 6.7 Test responsive behavior on desktop devices
- [~] 6.8 Validate that mock/live provider interfaces are interchangeable

## Phase 7: Future-Ready Integration Hooks

- [~] 7.1 Add placeholder API adapter layer
- [~] 7.2 Document expected external data contract for tide API
- [~] 7.3 Document expected external data contract for weather API
- [~] 7.4 Document expected external data contract for wind/swell API
- [~] 7.5 Prepare environment config structure for live data sources
- [~] 7.6 Add configuration toggle for mock vs live mode
