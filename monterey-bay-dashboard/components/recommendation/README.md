# Recommendation Components

This directory contains components for displaying activity-specific recommendations based on marine conditions.

## Components

### RecommendationCard

A prominent card component that displays a Go/Caution/No-Go recommendation for a specific marine activity.

**Features:**
- Fetches marine conditions from all providers (tide, weather, wind, swell, dive)
- Uses RecommendationEngine to generate activity-specific recommendations
- Displays status with color-coded visual indicators:
  - **Go** (Green): Favorable conditions
  - **Caution** (Yellow): Mixed conditions, manageable with experience
  - **No-Go** (Red): Unsafe conditions
- Shows numerical score (0-100)
- Lists contributing factors that influenced the recommendation
- Displays caution flags when present
- Responsive design for mobile and desktop
- Automatically updates when location or activity changes

**Props:**
- `locationId` (string): The location identifier (e.g., 'monterey-harbor')
- `activityType` (ActivityType): The activity type ('boating' | 'fishing' | 'diving')

**Usage:**
```tsx
import { RecommendationCard } from '@/components/recommendation';

function Dashboard() {
  return (
    <RecommendationCard 
      locationId="monterey-harbor" 
      activityType="boating" 
    />
  );
}
```

**States:**
- **Loading**: Shows "Analyzing conditions..." while fetching data
- **Error**: Displays error message if data fetch fails
- **Success**: Shows complete recommendation with status, score, reasons, and caution flags

**Integration:**
The component integrates with:
- All mock providers (Tide, Weather, Wind, Swell, DiveConditions)
- RecommendationEngine for scoring and status determination
- MarineConditions and Recommendation data models

**Styling:**
- Uses Tailwind CSS for responsive design
- Prominent shadow and border for visual emphasis
- Color-coded status badges for quick scanning
- Mobile-friendly layout with proper spacing

## Testing

Tests are located in `RecommendationCard.test.tsx` and cover:
- Loading states
- Status display (Go/Caution/No-Go) with correct styling
- Contributing factors display
- Caution flags display
- Activity-specific titles
- Location and activity type changes
- Error handling
- Score display

## Future Enhancements

- Add timestamp display for data freshness
- Add refresh button for manual updates
- Add animation for status changes
- Add detailed explanation modal
- Add historical trend indicators
- Support for custom user thresholds
