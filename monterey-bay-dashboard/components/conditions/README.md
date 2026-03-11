# Conditions Components

This directory contains components that display marine condition data for Monterey Bay locations.

## TideCard

Displays tide information including next high tide, next low tide, and current tide trend.

### Props

- `locationId` (string, required): The location identifier (e.g., 'monterey-harbor', 'breakwater')

### Features

- Fetches tide data using MockTideProvider
- Displays next high and low tide times in user-friendly format
- Shows current tide trend (rising/falling) with visual indicators
- Responsive design for mobile and desktop
- Loading and error states
- Automatically refetches data when location changes

### Usage

```tsx
import { TideCard } from '@/components/conditions';

<TideCard locationId="monterey-harbor" />
```

### Data Source

The component uses `MockTideProvider` which reads from `data/tide-data.json`. In production, this can be swapped with a live API provider without changing the component.

### Styling

The component matches the existing card styling pattern:
- White background with rounded corners and shadow
- Blue color scheme for headings and emphasis
- Responsive padding (p-4 on mobile, p-6 on desktop)
- Clear visual hierarchy with proper spacing
