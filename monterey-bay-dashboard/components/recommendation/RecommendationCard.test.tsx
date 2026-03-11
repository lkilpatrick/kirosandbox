import { render, screen, waitFor } from '@testing-library/react';
import { RecommendationCard } from './RecommendationCard';
import {
  MockTideProvider,
  MockMarineWeatherProvider,
  MockWindProvider,
  MockSwellProvider,
  MockDiveConditionsProvider
} from '@/services/providers/mock';

// Mock all providers
jest.mock('@/services/providers/mock', () => ({
  MockTideProvider: jest.fn(),
  MockMarineWeatherProvider: jest.fn(),
  MockWindProvider: jest.fn(),
  MockSwellProvider: jest.fn(),
  MockDiveConditionsProvider: jest.fn(),
}));

describe('RecommendationCard', () => {
  const mockTideData = {
    nextHigh: new Date('2024-01-15T14:30:00'),
    nextLow: new Date('2024-01-15T08:15:00'),
    tideTrend: 'rising' as const,
  };

  const mockWeatherData = {
    summary: 'Partly cloudy',
    airTemp: 58,
    marineLayer: true,
  };

  const mockWindData = {
    speed: 8,
    gust: 12,
    direction: 'NW',
  };

  const mockSwellData = {
    height: 3,
    period: 10,
    direction: 'NW',
  };

  const mockDiveData = {
    estimatedVisibility: 25,
    waterTemp: 54,
    surgeRisk: 'low' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementations
    (MockTideProvider as jest.Mock).mockImplementation(() => ({
      getTideData: jest.fn().mockResolvedValue(mockTideData),
    }));

    (MockMarineWeatherProvider as jest.Mock).mockImplementation(() => ({
      getWeatherData: jest.fn().mockResolvedValue(mockWeatherData),
    }));

    (MockWindProvider as jest.Mock).mockImplementation(() => ({
      getWindData: jest.fn().mockResolvedValue(mockWindData),
    }));

    (MockSwellProvider as jest.Mock).mockImplementation(() => ({
      getSwellData: jest.fn().mockResolvedValue(mockSwellData),
    }));

    (MockDiveConditionsProvider as jest.Mock).mockImplementation(() => ({
      getDiveConditions: jest.fn().mockResolvedValue(mockDiveData),
    }));
  });

  it('displays loading state initially', () => {
    render(<RecommendationCard locationId="monterey-harbor" activityType="boating" />);
    
    expect(screen.getByText('Recommendation')).toBeInTheDocument();
    expect(screen.getByText('Analyzing conditions...')).toBeInTheDocument();
  });

  it('displays Go recommendation with green styling for favorable conditions', async () => {
    render(<RecommendationCard locationId="monterey-harbor" activityType="boating" />);

    await waitFor(() => {
      expect(screen.getByText('Go')).toBeInTheDocument();
    });

    const statusBadge = screen.getByText('Go').closest('div');
    expect(statusBadge).toHaveClass('bg-green-100', 'text-green-800');
    expect(screen.getByText(/Score:/)).toBeInTheDocument();
  });

  it('displays Caution recommendation with yellow styling for moderate conditions', async () => {
    // Set up moderate wind conditions
    (MockWindProvider as jest.Mock).mockImplementation(() => ({
      getWindData: jest.fn().mockResolvedValue({
        speed: 18,
        gust: 22,
        direction: 'NW',
      }),
    }));

    render(<RecommendationCard locationId="monterey-harbor" activityType="boating" />);

    await waitFor(() => {
      expect(screen.getByText('Caution')).toBeInTheDocument();
    });

    const statusBadge = screen.getByText('Caution').closest('div');
    expect(statusBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('displays No-Go recommendation with red styling for unsafe conditions', async () => {
    // Set up unsafe conditions
    (MockWindProvider as jest.Mock).mockImplementation(() => ({
      getWindData: jest.fn().mockResolvedValue({
        speed: 30,
        gust: 40,
        direction: 'NW',
      }),
    }));

    (MockSwellProvider as jest.Mock).mockImplementation(() => ({
      getSwellData: jest.fn().mockResolvedValue({
        height: 12,
        period: 16,
        direction: 'NW',
      }),
    }));

    render(<RecommendationCard locationId="monterey-harbor" activityType="boating" />);

    await waitFor(() => {
      expect(screen.getByText('No-Go')).toBeInTheDocument();
    });

    const statusBadge = screen.getByText('No-Go').closest('div');
    expect(statusBadge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('displays contributing factors', async () => {
    render(<RecommendationCard locationId="monterey-harbor" activityType="boating" />);

    await waitFor(() => {
      expect(screen.getByText('Contributing Factors')).toBeInTheDocument();
      expect(screen.getByText('Light winds')).toBeInTheDocument();
      expect(screen.getByText('Small swell')).toBeInTheDocument();
    });
  });

  it('displays caution flags when present', async () => {
    // Set up conditions with caution flags
    (MockWindProvider as jest.Mock).mockImplementation(() => ({
      getWindData: jest.fn().mockResolvedValue({
        speed: 18,
        gust: 22,
        direction: 'NW',
      }),
    }));

    render(<RecommendationCard locationId="monterey-harbor" activityType="boating" />);

    await waitFor(() => {
      expect(screen.getByText('Caution')).toBeInTheDocument();
      expect(screen.getByText(/Wind speed 15-20 knots/)).toBeInTheDocument();
    });
  });

  it('displays activity-specific title', async () => {
    const { rerender } = render(
      <RecommendationCard locationId="monterey-harbor" activityType="boating" />
    );

    await waitFor(() => {
      expect(screen.getByText('Boating Recommendation')).toBeInTheDocument();
    });

    rerender(<RecommendationCard locationId="monterey-harbor" activityType="diving" />);

    await waitFor(() => {
      expect(screen.getByText('Diving Recommendation')).toBeInTheDocument();
    });
  });

  it('refetches recommendation when location changes', async () => {
    const getTideData = jest.fn().mockResolvedValue(mockTideData);
    (MockTideProvider as jest.Mock).mockImplementation(() => ({
      getTideData,
    }));

    const { rerender } = render(
      <RecommendationCard locationId="monterey-harbor" activityType="boating" />
    );

    await waitFor(() => {
      expect(getTideData).toHaveBeenCalledWith('monterey-harbor', expect.any(Date));
    });

    rerender(<RecommendationCard locationId="breakwater" activityType="boating" />);

    await waitFor(() => {
      expect(getTideData).toHaveBeenCalledWith('breakwater', expect.any(Date));
    });

    expect(getTideData).toHaveBeenCalledTimes(2);
  });

  it('refetches recommendation when activity type changes', async () => {
    const getTideData = jest.fn().mockResolvedValue(mockTideData);
    (MockTideProvider as jest.Mock).mockImplementation(() => ({
      getTideData,
    }));

    const { rerender } = render(
      <RecommendationCard locationId="monterey-harbor" activityType="boating" />
    );

    await waitFor(() => {
      expect(screen.getByText('Boating Recommendation')).toBeInTheDocument();
    });

    rerender(<RecommendationCard locationId="monterey-harbor" activityType="fishing" />);

    await waitFor(() => {
      expect(screen.getByText('Fishing Recommendation')).toBeInTheDocument();
    });

    expect(getTideData).toHaveBeenCalledTimes(2);
  });

  it('displays error message when data fetch fails', async () => {
    (MockTideProvider as jest.Mock).mockImplementation(() => ({
      getTideData: jest.fn().mockRejectedValue(new Error('Failed to fetch tide data')),
    }));

    render(<RecommendationCard locationId="invalid-location" activityType="boating" />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to generate recommendation/)).toBeInTheDocument();
    });
  });

  it('displays score value', async () => {
    render(<RecommendationCard locationId="monterey-harbor" activityType="boating" />);

    await waitFor(() => {
      expect(screen.getByText(/Score: \d+\/100/)).toBeInTheDocument();
    });
  });
});
