# Monterey Bay Conditions Dashboard 🌊

A real-time ocean conditions dashboard for Monterey Bay, California. Get live tide predictions, wind/swell data, weather forecasts, and activity recommendations for boating, diving, fishing, and surfing.

[![Deploy to Firebase](https://github.com/lkilpatrick/kirosandbox/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/lkilpatrick/kirosandbox/actions/workflows/firebase-hosting-merge.yml)

## 🚀 Live Demo

**Visit the dashboard**: [https://montereydashboard.web.app](https://montereydashboard.web.app)

## ✨ Features

### Real-Time Ocean Data
- **Tide Predictions** - High/low tide times from NOAA CO-OPS (Station 9413450)
- **Wind Conditions** - Live wind speed, direction, and gusts from NDBC Buoy 46042
- **Swell Data** - Wave height, period, and direction from NDBC Buoy 46042
- **Weather Forecasts** - Current conditions and forecasts from National Weather Service
- **Dive Conditions** - Calculated visibility, water temperature, and surge risk

### Smart Recommendations
- **Activity-Based** - Tailored recommendations for boating, diving, fishing, and surfing
- **Go/Caution/No-Go** - Clear safety ratings based on current conditions
- **Location-Specific** - Data for Monterey Harbor, Moss Landing, Santa Cruz, and Carmel

### Marine Life Information
- **Species of the Day** - Daily rotating featured fish species with photos and details
- **What's Biting** - Current in-season species for fishing enthusiasts
- **89 Species Database** - Comprehensive Monterey Bay fish information

### User Experience
- **Mobile Responsive** - Works perfectly on phones, tablets, and desktops
- **Real-Time Updates** - Live data from NOAA APIs
- **Firebase Analytics** - Track usage and improve the experience
- **Fast Loading** - Static site generation for optimal performance

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with React 19
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Hosting**: [Firebase Hosting](https://firebase.google.com/docs/hosting)
- **Analytics**: [Firebase Analytics](https://firebase.google.com/docs/analytics)
- **Data Sources**: 
  - [NOAA CO-OPS API](https://tidesandcurrents.noaa.gov/) (Tides)
  - [NOAA NDBC](https://www.ndbc.noaa.gov/) (Buoy Data)
  - [National Weather Service API](https://www.weather.gov/documentation/services-web-api) (Weather)
- **Deployment**: GitHub Actions CI/CD

## 📁 Project Structure

```
kirosandbox/
├── monterey-bay-dashboard/          # Main Next.js application
│   ├── app/                         # Next.js app directory
│   ├── components/                  # React components
│   │   ├── conditions/              # Condition cards (tide, wind, etc.)
│   │   ├── recommendation/          # Recommendation engine UI
│   │   ├── selectors/               # Location & activity selectors
│   │   ├── species/                 # Species information cards
│   │   └── ui/                      # Shared UI components
│   ├── services/                    # Business logic & data providers
│   │   ├── providers/               # Data provider interfaces
│   │   │   ├── real/                # Real NOAA API providers
│   │   │   └── mock/                # Mock data for development
│   │   ├── recommendation/          # Recommendation engine
│   │   └── species/                 # Species data service
│   ├── models/                      # TypeScript interfaces
│   ├── data/                        # Static data (species, locations)
│   ├── lib/                         # Firebase & analytics
│   └── public/                      # Static assets
├── .github/workflows/               # GitHub Actions CI/CD
└── .kiro/specs/                     # Project specifications
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn
- Firebase account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/lkilpatrick/kirosandbox.git
   cd kirosandbox/monterey-bay-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

This creates a static export in the `out/` directory.

## 🌐 Deployment

### Automatic Deployment (GitHub Actions)

Every push to the `main` branch automatically:
1. Builds the Next.js app
2. Deploys to Firebase Hosting
3. Updates the live site

### Manual Deployment

```bash
cd monterey-bay-dashboard
npm run deploy
```

## 📊 Data Sources

All data is sourced from free, public NOAA APIs:

| Data Type | Source | Station/Location | Update Frequency |
|-----------|--------|------------------|------------------|
| Tides | NOAA CO-OPS | 9413450 (Monterey Harbor) | Predictions available 48h ahead |
| Wind | NDBC Buoy | 46042 (Monterey Bay) | Real-time, ~10-30 min |
| Swell | NDBC Buoy | 46042 (Monterey Bay) | Real-time, ~10-30 min |
| Weather | NWS API | Monterey Bay coordinates | Updated 1-6 hours |
| Species | Static JSON | Monterey Bay fish database | Static data |

## 🎯 Use Cases

- **Boaters** - Check wind, swell, and weather before heading out
- **Divers** - Assess visibility, surge, and water temperature
- **Fishermen** - See what's biting and when species are in season
- **Surfers** - Check swell height, period, and direction
- **Marine Enthusiasts** - Learn about Monterey Bay species

## 📱 Screenshots

*Coming soon - add screenshots of the dashboard*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **NOAA** - For providing free, public ocean data APIs
- **Firebase** - For hosting and analytics
- **Next.js** - For the amazing React framework
- **Monterey Bay Aquarium** - For marine life inspiration

## 📞 Contact

- **Live Site**: [montereydashboard.web.app](https://montereydashboard.web.app)
- **GitHub**: [lkilpatrick/kirosandbox](https://github.com/lkilpatrick/kirosandbox)
- **Issues**: [Report a bug](https://github.com/lkilpatrick/kirosandbox/issues)

## 📚 Documentation

- [Deployment Guide](monterey-bay-dashboard/DEPLOYMENT.md)
- [Firebase Setup](monterey-bay-dashboard/FIREBASE_COMPLETE.md)
- [Real Data Integration](monterey-bay-dashboard/REAL_DATA_INTEGRATION.md)
- [Analytics Guide](monterey-bay-dashboard/FIREBASE_ANALYTICS.md)

---

**Built with ❤️ for the Monterey Bay community**

*Helping people safely enjoy the beautiful waters of Monterey Bay* 🌊
