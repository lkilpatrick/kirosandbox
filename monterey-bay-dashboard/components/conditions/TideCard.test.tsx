import { render, screen, waitFor } from '@testing-library/react';
import { TideCard } from './TideCard';
import { MockTideProvider } from '@/services/providers/mock';

// Mock the provider
jest.mock('@/services/providers/mock', () => ({
  MockTideProvider: jest.fn(),
}));

describe('TideCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state initially', () => {
    const mockGetTideData = jest.fn(() => new Promise(() => {}));
    (MockTideProvider as jest.Mock).mockImplementation(() => ({
      getTideData: mockGetTideData,
    }));

    render(<TideCard locationId="monterey-harbor" />);
    
    expect(screen.getByText('Tide')).toBeInTheDocument();
    expect(screen.getByText('Loading tide data...')).toBeInTheDocument();
  });

  it('displays tide data when loaded successfully', async () => {
    const mockTideData = {
      nextHigh: new Date('2024-01-15T10:24:00Z'),
      nextLow: new Date('2024-01-15T16:42:00Z'),
      tideTrend: 'rising' as const,
    };

    const mockGetTideData = jest.fn().mockResolvedValue(mockTideData);
    (MockTideProvider as jest.Mock).mockImplementation(() => ({
      getTideData: mockGetTideData,
    }));

    render(<TideCard locationId="monterey-harbor" />);

    await waitFor(() => {
      expect(screen.getByText('Next High:')).toBeInTheDocument();
      expect(screen.getByText('Next Low:')).toBeInTheDocument();
      expect(screen.getByText('Current Trend:')).toBeInTheDocument();
      expect(screen.getByText('↑ Rising')).toBeInTheDocument();
    });

    expect(mockGetTideData).toHaveBeenCalledWith('monterey-harbor', expect.any(Date));
  });

  it('displays falling tide trend correctly', async () => {
    const mockTideData = {
      nextHigh: new Date('2024-01-15T22:48:00Z'),
      nextLow: new Date('2024-01-15T16:42:00Z'),
      tideTrend: 'falling' as const,
    };

    const mockGetTideData = jest.fn().mockResolvedValue(mockTideData);
    (MockTideProvider as jest.Mock).mockImplementation(() => ({
      getTideData: mockGetTideData,
    }));

    render(<TideCard locationId="breakwater" />);

    await waitFor(() => {
      expect(screen.getByText('↓ Falling')).toBeInTheDocument();
    });
  });

  it('displays error message when data fetch fails', async () => {
    const mockGetTideData = jest.fn().mockRejectedValue(new Error('Failed to fetch tide data'));
    (MockTideProvider as jest.Mock).mockImplementation(() => ({
      getTideData: mockGetTideData,
    }));

    render(<TideCard locationId="invalid-location" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch tide data')).toBeInTheDocument();
    });
  });

  it('refetches data when locationId changes', async () => {
    const mockTideData = {
      nextHigh: new Date('2024-01-15T10:24:00Z'),
      nextLow: new Date('2024-01-15T16:42:00Z'),
      tideTrend: 'rising' as const,
    };

    const mockGetTideData = jest.fn().mockResolvedValue(mockTideData);
    (MockTideProvider as jest.Mock).mockImplementation(() => ({
      getTideData: mockGetTideData,
    }));

    const { rerender } = render(<TideCard locationId="monterey-harbor" />);

    await waitFor(() => {
      expect(mockGetTideData).toHaveBeenCalledWith('monterey-harbor', expect.any(Date));
    });

    rerender(<TideCard locationId="breakwater" />);

    await waitFor(() => {
      expect(mockGetTideData).toHaveBeenCalledWith('breakwater', expect.any(Date));
    });

    expect(mockGetTideData).toHaveBeenCalledTimes(2);
  });
});
