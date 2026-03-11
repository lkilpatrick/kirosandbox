# Requirements Document

## Introduction

The Monterey Bay Conditions Dashboard aggregates ocean conditions for Monterey Bay and provides activity-specific recommendations for boating, fishing, and diving. The system consolidates tide, marine weather, wind, swell, and visibility data into a single dashboard with clear go/caution/no-go guidance.

## Glossary

- **System**: The Monterey Bay Conditions Dashboard web application
- **Location**: A specific geographic point in Monterey Bay (e.g., Monterey Harbor, Breakwater)
- **Activity**: A user-selected ocean activity type (boating, fishing, or diving)
- **Recommendation**: A go/caution/no-go assessment for a specific activity based on current conditions
- **Condition_Signal**: A specific marine data point (tide, wind, swell, weather, or dive conditions)
- **Provider**: A service interface that supplies marine condition data
- **Mock_Mode**: An operational mode using static sample data instead of live API sources
- **Forecast_Window**: A time period showing predicted future conditions (24-48 hours)

## Requirements

### Requirement 1: Location Selection and Display

**User Story:** As a user, I want to select a Monterey Bay location and see current and near-term conditions so I can decide whether to go out.

#### Acceptance Criteria

1. WHEN the user opens the dashboard, THE System SHALL display a default Monterey Bay location
2. WHEN the user selects a location, THE System SHALL display conditions for that location
3. THE System SHALL support at least five locations: Monterey Harbor, Breakwater, Stillwater Cove, Sand City, and Moss Landing

### Requirement 2: Marine Condition Data Display

**User Story:** As a user, I want to see the most important condition signals in one place so I do not need to check multiple sites.

#### Acceptance Criteria

1. THE System SHALL display tide times for the selected location
2. THE System SHALL display marine weather summary for the selected location
3. THE System SHALL display wind speed and direction for the selected location
4. THE System SHALL display swell height, period, and direction for the selected location
5. THE System SHALL display estimated dive condition indicators for the selected location
6. THE System SHALL group all condition signals into a single location dashboard

### Requirement 3: Activity-Specific Recommendations

**User Story:** As a user, I want a quick go/caution/no-go recommendation for my activity so I can make a fast decision.

#### Acceptance Criteria

1. WHEN the user selects boating, THE System SHALL display a recommendation for boating conditions
2. WHEN the user selects fishing, THE System SHALL display a recommendation for fishing conditions
3. WHEN the user selects diving, THE System SHALL display a recommendation for diving conditions
4. THE System SHALL classify each recommendation as Go, Caution, or No-Go
5. THE System SHALL provide a short explanation for each recommendation

### Requirement 4: Recommendation Transparency

**User Story:** As a user, I want to know what factors drove the recommendation so I can apply my own judgment.

#### Acceptance Criteria

1. THE System SHALL display which condition signals contributed to the recommendation
2. IF conditions are classified as Caution or No-Go, THEN THE System SHALL identify the main contributing factors
3. THE System SHALL display the timestamp of the latest data update
4. THE System SHALL identify factors such as strong wind, large swell, poor tide timing, or weak dive visibility estimate

### Requirement 5: Forecast Display

**User Story:** As a user, I want to see conditions for today and tomorrow so I can plan ahead.

#### Acceptance Criteria

1. THE System SHALL display current conditions for the selected location
2. THE System SHALL display forecast conditions for the next 24 to 48 hours
3. THE System SHALL allow the user to view at least two forecast periods

### Requirement 6: Mock Data Support

**User Story:** As a developer or tester, I want the app to work with mock data first so the UI and decision logic can be developed before API integration.

#### Acceptance Criteria

1. THE System SHALL support Mock_Mode for development and testing
2. THE System SHALL abstract data providers behind a service interface
3. THE System SHALL allow replacement of mock providers with live API providers without requiring UI rewrites

### Requirement 7: Responsive Layout

**User Story:** As a user, I want the dashboard to be usable on my phone at the dock or on the boat.

#### Acceptance Criteria

1. THE System SHALL use a responsive layout that adapts to mobile and desktop screen sizes
2. THE System SHALL present condition cards in a mobile-friendly format
3. THE System SHALL keep the recommendation summary visible without requiring excessive scrolling on mobile devices
