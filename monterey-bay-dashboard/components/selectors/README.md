# Selectors Components

This directory contains selector components for the Monterey Bay Conditions Dashboard.

## LocationSelector

The `LocationSelector` component allows users to switch between different Monterey Bay locations.

### Features

- Dropdown select interface for location selection
- Displays all available Monterey Bay locations
- Shows optional activity notes for the selected location
- Responsive design for mobile and desktop
- Accessible with proper labels and focus states

### Usage

```tsx
import { LocationSelector } from '@/components/selectors';
import { MONTEREY_BAY_LOCATIONS, DEFAULT_LOCATION } from '@/models';
import { useState } from 'react';

function MyComponent() {
  const [selectedLocation, setSelectedLocation] = useState(DEFAULT_LOCATION);

  return (
    <LocationSelector
      locations={MONTEREY_BAY_LOCATIONS}
      selectedLocation={selectedLocation}
      onChange={setSelectedLocation}
    />
  );
}
```

### Props

- `locations: Location[]` - Array of available locations to display
- `selectedLocation: Location` - Currently selected location
- `onChange: (location: Location) => void` - Callback fired when user selects a new location

### Validates Requirements

- Requirement 1.2: User can select a location
- Requirement 1.3: Supports at least five locations
- Requirement 7.1: Responsive layout
- Requirement 7.2: Mobile-friendly format
