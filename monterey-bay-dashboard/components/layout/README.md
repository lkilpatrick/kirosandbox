# Layout Components

## DashboardLayout

Base responsive layout component for the Monterey Bay Conditions Dashboard.

### Features

- **Mobile-first responsive design**: Adapts seamlessly from mobile to desktop
- **Recommendation prominence**: Positions recommendation card at top for quick scanning
- **Flexible grid layout**: Responsive grid for condition cards (1 column mobile, 2 columns tablet, 3 columns desktop)
- **Clean visual hierarchy**: Header, recommendation, and condition cards clearly separated

### Usage

```tsx
import { DashboardLayout } from '@/components/layout';

export default function Page() {
  return (
    <DashboardLayout
      header={
        <div>
          <h1>Dashboard Title</h1>
          <p>Description</p>
        </div>
      }
      recommendation={
        <div>Recommendation card content</div>
      }
    >
      {/* Condition cards go here */}
      <div>Tide Card</div>
      <div>Weather Card</div>
      <div>Wind Card</div>
    </DashboardLayout>
  );
}
```

### Props

- `children`: React.ReactNode - Condition cards or other main content
- `header` (optional): React.ReactNode - Header content (title, description, selectors)
- `recommendation` (optional): React.ReactNode - Recommendation card content

### Responsive Breakpoints

- Mobile: 1 column grid
- Tablet (md): 2 column grid
- Desktop (lg): 3 column grid

### Requirements Validation

This component validates:
- Requirement 7.1: Responsive layout that adapts to mobile and desktop
- Requirement 7.2: Mobile-friendly card presentation
- Requirement 7.3: Recommendation summary visible without excessive scrolling
