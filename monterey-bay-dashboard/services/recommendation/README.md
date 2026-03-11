# Recommendation Service

Rules-based recommendation engine that generates activity-specific recommendations based on marine conditions.

## Overview

The `RecommendationEngine` evaluates marine conditions and produces a recommendation with:
- **Status**: Go, Caution, or No-Go
- **Score**: 0-100 numerical rating
- **Reasons**: List of factors supporting the recommendation
- **Caution Flags**: Warnings about specific hazards

## Usage

```typescript
import { RecommendationEngine } from '@/services/recommendation';
import { MarineConditions } from '@/models/MarineConditions';

const engine = new RecommendationEngine();
const conditions: MarineConditions = { /* ... */ };

const recommendation = engine.generateRecommendation(conditions, 'boating');
console.log(recommendation.status); // 'Go' | 'Caution' | 'No-Go'
console.log(recommendation.score); // 0-100
console.log(recommendation.reasons); // ['Light winds', 'Small swell', ...]
console.log(recommendation.cautionFlags); // ['Wind speed 20-25 knots', ...]
```

## Scoring Logic

### Status Thresholds
- **Go** (70-100): Favorable conditions
- **Caution** (40-69): Mixed conditions, manageable with experience
- **No-Go** (0-39): Unsafe conditions

### Evaluated Factors

#### Common Factors (All Activities)
- **Wind Speed**: 0-10 knots (excellent) to 25+ knots (unsafe)
- **Swell Height**: 0-3 feet (calm) to 10+ feet (very rough)
- **Swell Period**: Short period (<10s) to very long period (18+s)

#### Boating-Specific
- Tide timing (prefers slack tide for easier navigation)

#### Fishing-Specific
- Tide phase (prefers moving tides)
- Weather stability

#### Diving-Specific
- Surge risk (low/moderate/high)
- Visibility (30+ feet excellent, <10 feet poor)
- Tide timing (prefers slack tide for minimal current)

## Deterministic Behavior

The engine is deterministic - the same input conditions always produce the same recommendation. This ensures:
- Consistent results across multiple calls
- Predictable behavior for testing
- Reliable recommendations for users

## Future Enhancements

Tasks 4.2-4.4 will add:
- More sophisticated activity-specific thresholds
- Location-specific adjustments
- Seasonal considerations
- User skill level adjustments

## Testing

Run the demo script to verify functionality:
```bash
npx tsx services/recommendation/demo.ts
```

Unit tests are in `RecommendationEngine.test.ts` (requires Jest setup).
