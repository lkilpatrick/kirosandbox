# Firebase Analytics Integration

## Overview

Firebase Analytics is integrated into the Monterey Bay Dashboard to track user interactions and provide insights into how the dashboard is being used.

## Configuration

Firebase is configured in `lib/firebase.ts` with your project credentials:

- **Project ID**: montereydashboard
- **Measurement ID**: G-83V49J0P14
- **App ID**: 1:880796508508:web:06fcd38b698a2a5d29e199

## Tracked Events

### Automatic Events

Firebase automatically tracks:
- Page views
- User engagement
- Session duration
- Device/browser information
- Geographic location

### Custom Events

The dashboard tracks these custom events:

#### 1. Page Views
```typescript
usePageView('Monterey Bay Dashboard')
```
Tracked on every page load with:
- Page title
- Page location (URL)
- Page path

#### 2. Location Selection
```typescript
trackLocationChange(locationId, locationName)
```
Tracked when user selects a different location:
- `location_id`: e.g., "monterey-harbor"
- `location_name`: e.g., "Monterey Harbor"

#### 3. Activity Selection
```typescript
trackActivityChange(activity)
```
Tracked when user changes activity type:
- `activity_type`: "boating", "diving", "fishing", "surfing"

#### 4. Data Loading
```typescript
trackDataLoad(dataType, success)
```
Can be used to track API data loading:
- `data_type`: "tide", "weather", "wind", "swell", "dive"
- `success`: true/false

## Usage in Components

### Page-level Tracking

```typescript
import { usePageView } from '@/lib/useAnalytics';

export default function MyPage() {
  usePageView('My Page Name');
  // ... rest of component
}
```

### Event Tracking

```typescript
import { trackEvent } from '@/lib/useAnalytics';

function handleButtonClick() {
  trackEvent('button_clicked', {
    button_name: 'refresh_data',
    location: 'header'
  });
}
```

### Custom Tracking Functions

```typescript
import { 
  trackLocationChange, 
  trackActivityChange, 
  trackDataLoad 
} from '@/lib/useAnalytics';

// Track location change
trackLocationChange('monterey-harbor', 'Monterey Harbor');

// Track activity change
trackActivityChange('diving');

// Track data loading
trackDataLoad('tide', true);
```

## Viewing Analytics

### Firebase Console

1. Go to https://console.firebase.google.com/u/0/project/montereydashboard
2. Click "Analytics" in the left sidebar
3. View dashboards for:
   - Real-time users
   - User engagement
   - Events
   - Conversions
   - User properties

### Key Metrics to Monitor

- **Active Users**: Daily/weekly/monthly active users
- **Session Duration**: How long users stay on the dashboard
- **Popular Locations**: Which locations are viewed most
- **Popular Activities**: Which activities are selected most
- **Device Breakdown**: Desktop vs mobile usage
- **Geographic Distribution**: Where users are located

## Privacy & Compliance

### Data Collection

Firebase Analytics collects:
- Anonymous usage data
- Device information
- Geographic location (city-level)
- User interactions

### GDPR Compliance

To be GDPR compliant, consider:
1. Adding a cookie consent banner
2. Providing opt-out mechanism
3. Adding privacy policy
4. Documenting data collection in terms of service

### Disable Analytics (Optional)

To disable analytics for development:

```typescript
// In lib/firebase.ts, comment out analytics initialization
// analytics = getAnalytics(app);
```

Or set environment variable:
```bash
NEXT_PUBLIC_DISABLE_ANALYTICS=true
```

## Testing Analytics

### Local Testing

Analytics events are sent in development mode. Check browser console for:
```
Firebase Analytics: Event logged: page_view
```

### Debug View

Enable debug mode in Firebase Console:
1. Go to Analytics → DebugView
2. Install Chrome extension: Google Analytics Debugger
3. View real-time events as they're sent

### Verify Events

After deployment:
1. Visit your live site
2. Interact with the dashboard
3. Check Firebase Console → Analytics → Events
4. Events appear within 24 hours (real-time in DebugView)

## Performance Impact

Firebase Analytics is:
- Lightweight (~30KB gzipped)
- Loaded asynchronously
- Cached by browser
- Minimal performance impact

## Advanced Features

### User Properties

Set custom user properties:
```typescript
import { setUserProperties } from 'firebase/analytics';
import { analytics } from '@/lib/firebase';

if (analytics) {
  setUserProperties(analytics, {
    preferred_location: 'monterey-harbor',
    preferred_activity: 'diving'
  });
}
```

### Conversion Tracking

Track conversions (e.g., sharing dashboard):
```typescript
trackEvent('share', {
  method: 'social',
  content_type: 'dashboard',
  item_id: 'monterey-bay'
});
```

### Custom Dimensions

Add custom dimensions in Firebase Console to segment data by:
- Location
- Activity type
- Device type
- Time of day

## Troubleshooting

### Analytics Not Working

1. **Check browser console** for errors
2. **Verify Firebase config** in `lib/firebase.ts`
3. **Check ad blockers** - they may block analytics
4. **Wait 24 hours** - data processing takes time
5. **Use DebugView** for real-time verification

### Events Not Appearing

1. **Check event names** - must be valid (lowercase, underscores)
2. **Verify analytics is initialized** - check browser console
3. **Check network tab** - look for requests to google-analytics.com
4. **Enable debug mode** - see events in real-time

## Best Practices

1. **Event Naming**: Use lowercase with underscores (e.g., `button_clicked`)
2. **Parameter Naming**: Use descriptive names (e.g., `location_id` not `loc`)
3. **Limit Parameters**: Max 25 parameters per event
4. **Consistent Naming**: Use same names across similar events
5. **Document Events**: Keep this file updated with new events

## Resources

- [Firebase Analytics Docs](https://firebase.google.com/docs/analytics)
- [Event Reference](https://firebase.google.com/docs/reference/js/analytics)
- [Best Practices](https://firebase.google.com/docs/analytics/best-practices)
- [Privacy & Compliance](https://firebase.google.com/support/privacy)

## Next Steps

1. Deploy the app to see analytics in action
2. Monitor key metrics in Firebase Console
3. Set up custom dashboards for important metrics
4. Configure alerts for unusual activity
5. Use insights to improve the dashboard

Your analytics are ready to track! 📊
