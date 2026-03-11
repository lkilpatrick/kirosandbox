import { render, screen, waitFor } from '@testing-library/react';
import { WindCard } from './WindCard';
import { MockWindProvider } from '@/services/providers/mock';

// Mock the provider
jest.mock('@/services/providers/mock', () => ({
  MockWindProvider: jest.fn(),
}));

describe('WindCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state initially', () => {
    const mockGetWindData = jest.fn(() => new Promise(() => {}));
    (MockWindProvider as jest.Mock).mockImplementation(() => ({
      getWindData: mockGetWindData,
    }));

    render(<WindCard locationId="monterey-harbor" />);
    
    expect(screen.getByText('Wind')).toBeInTheDocument();
    expect(screen.getByText('Loading wind data...')).toBeInTheDocument();
  });

  it('displays wind data when loaded successfully', async () => {
    const mockWindData = {
      speed: 15,
      gust: 20,
      direction: 'NW',
    };

    const mockGetWindData = jest.fn().mockResolvedValue(mockWindData);
    (MockWindProvider as jest.Mock).mockImplementation(() => ({
      getWindData: mockGetWindData,
    }));

    render(<WindCard locationId="monterey-harbor" />);

    await waitFor(() => {
      expect(screen.getByText('Speed:')).toBeInTheDocument();
      expect(screen.getByText('15 kts')).toBeInTheDocument();
      expect(screen.getByText('Gust:')).toBeInTheDocument();
      expect(screen.getByText('20 kts')).toBeInTheDocument();
      expect(screen.getByText('Direction:')).toBeInTheDocument();
      expect(screen.getByText('NW')).toBeInTheDocument();
    });

    expect(mockGetWindData).toHaveBeenCalledWith('monterey-harbor', expect.any(Date));
  });

  it('displays different wind directions correctly', async () => {
    const mockWindData = {
      speed: 8,
      gust: 12,
      direction: 'SE',
    };

    const mockGetWindData = jest.fn().mockResolvedValue(mockWindData);
    (MockWindProvider as jest.Mock).mockImplementation(() => ({
      getWindData: mockGetWindData,
    }));

    render(<WindCard locationId="breakwater" />);

    await waitFor(() => {
      expect(screen.getByText('SE')).toBeInTheDocument();
    });
  });

  it('displays error message when data fetch fails', async () => {
    const mockGetWindData = jest.fn().mockRejectedValue(new Error('Failed to fetch wind data'));
    (MockWindProvider as jest.Mock).mockImplementation(() => ({
      getWindData: mockGetWindData,
    }));

    render(<WindCard locationId="invalid-location" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch wind data')).toBeInTheDocument();
    });
  });

  it('refetches data when locationId changes', async () => {
    const mockWindData = {
      speed: 10,
      gust: 14,
      direction: 'NW',
    };

    const mockGetWindData = jest.fn().mockResolvedValue(mockWindData);
    (MockWindProvider as jest.Mock).mockImplementation(() => ({
      getWindData: mockGetWindData,
    }));

    const { rerender } = render(<WindCard locationId="monterey-harbor" />);

    await waitFor(() => {
      expect(mockGetWindData).toHaveBeenCalledWith('monterey-harbor', expect.any(Date));
    });

    rerender(<WindCard locationId="breakwater" />);

    await waitFor(() => {
      expect(mockGetWindData).toHaveBeenCalledWith('breakwater', expect.any(Date));
    });

    expect(mockGetWindData).toHaveBeenCalledTimes(2);
  });

  it('displays low wind speeds correctly', async () => {
    const mockWindData = {
      speed: 3,
      gust: 5,
      direction: 'W',
    };

    const mockGetWindData = jest.fn().mockResolvedValue(mockWindData);
    (MockWindProvider as jest.Mock).mockImplementation(() => ({
      getWindData: mockGetWindData,
    }));

    render(<WindCard locationId="stillwater-cove" />);

    await waitFor(() => {
      expect(screen.getByText('3 kts')).toBeInTheDocument();
      expect(screen.getByText('5 kts')).toBeInTheDocument();
    });
  });
});
