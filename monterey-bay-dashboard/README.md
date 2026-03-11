# Monterey Bay Conditions Dashboard

A responsive web dashboard that aggregates ocean conditions for Monterey Bay and provides activity-specific recommendations for boating, fishing, and diving.

## Features

- **Location Selection**: View conditions for multiple Monterey Bay locations (Monterey Harbor, Breakwater, Stillwater Cove, Sand City, Moss Landing)
- **Activity Recommendations**: Get go/caution/no-go guidance for boating, fishing, and diving
- **Comprehensive Conditions**: View tide, marine weather, wind, swell, and dive conditions in one place
- **Forecast Display**: See current and near-term forecast conditions
- **Responsive Design**: Mobile-first design for use at the dock or on the boat

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data**: Mock JSON data (v1), with provider abstraction for future API integration

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
monterey-bay-dashboard/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components (to be added)
├── lib/                   # Utility functions and services (to be added)
│   ├── models/           # TypeScript type definitions
│   ├── services/         # Data provider interfaces
│   └── mock-data/        # Mock data for development
└── public/               # Static assets
```

## Development Roadmap

### Phase 1: Project Setup ✓
- [x] Create app scaffold with Next.js
- [ ] Set up folder structure
- [ ] Create base responsive layout
- [ ] Add location selector component
- [ ] Add activity selector component

### Phase 2: Mock Data and Models
- [ ] Define TypeScript types
- [ ] Create mock location data
- [ ] Create mock condition data
- [ ] Build provider interfaces

### Phase 3: Conditions Dashboard
- [ ] Build condition card components
- [ ] Build forecast panel
- [ ] Integrate dashboard layout

### Phase 4: Recommendation Engine
- [ ] Implement rules-based scoring
- [ ] Add activity-specific thresholds
- [ ] Build recommendation card

### Phase 5: UX Polish
- [ ] Improve mobile responsiveness
- [ ] Add loading and empty states
- [ ] Add data freshness indicators

### Phase 6: Testing
- [ ] Test recommendation logic
- [ ] Test location/activity switching
- [ ] Test responsive behavior

### Phase 7: Future-Ready Integration
- [ ] Add API adapter layer
- [ ] Document external data contracts
- [ ] Add mock/live mode toggle

## Architecture

The dashboard uses a provider abstraction pattern to separate data sources from UI components:

- **Provider Interfaces**: Define contracts for tide, weather, wind, swell, and dive condition data
- **Mock Providers**: Return static sample data for development
- **Future Live Providers**: Will integrate with NOAA, NWS, and buoy data sources

This architecture allows the UI and recommendation logic to be developed and tested independently of external APIs.

## License

Private project
