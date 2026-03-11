import { render, screen, waitFor } from '@testing-library/react';
import { SwellCard } from './SwellCard';
import { MockSwellProvider } from '@/services/providers/mock';

// Mock the provider
jest.mock('@/services/providers/mock', () => ({
  MockSwellProvider: jest.fn(),
}));

describe('SwellCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state initially', () => {
    const mockGetSwellData = jest.fn(() => new Promise(() => {}));
    (MockSwellProvider as jest.Mock).mockImplementation(() => ({
      getSwellData: mockGetSwellData,
    }));

    render(<SwellCard locationId="monterey-harbor" />);
    
    expect(screen.getByText('Swell')).toBeInTheDocument();
    expect(screen.getByText('Loading swell data...')).toBeInTheDocument();
  });

  it('displays swell data when loaded successfully', async () => {
    const mockSwellData = {
      height: 3.5,
      period: 12,
      direction: 'NW',
    };

    const mockGetSwellData = jest.fn().mockResolvedValue(mockSwellData);
    (MockSwellProvider as jest.Mock).mockImplementation(() => ({
      getSwellData: mockGetSwellData,
    }));

    render(<SwellCard locationId="monterey-harbor" />);

    await waitFor(() => {
      expect(screen.getByText('Height:')).toBeInTheDocument();
      expect(screen.getByText('3.5 ft')).toBeInTheDocument();
      expect(screen.getByText('Period:')).toBeInTheDocument();
      expect(screen.getByText('12 sec')).toBeInTheDocument();
      expect(screen.getByText('Direction:')).toBeInTheDocument();
      expect(screen.getByText('NW')).toBeInTheDocument();
    });

    expect(mockGetSwellData).toHaveBeenCalledWith('monterey-harbor', expect.any(Date));
  });

  it('displays different swell directions correctly', async () => {
    const mockSwellData = {
      height: 5.0,
      period: 14,
      direction: 'SW',
    };

    const mockGetSwellData = jest.fn().mockResolvedValue(mockSwellData);
    (MockSwellProvider as jest.Mock).mockImplementation(() => ({
      getSwellData: mockGetSwellData,
    }));

    render(<SwellCard locationId="breakwater" />);

    await waitFor(() => {
      expect(screen.getByText('SW')).toBeInTheDocument();
    });
  });

  it('displays error message when data fetch fails', async () => {
    const mockGetSwellData = jest.fn().mockRejectedValue(new Error('Failed to fetch swell data'));
    (MockSwellProvider as jest.Mock).mockImplementation(() => ({
      getSwellData: mockGetSwellData,
    }));

    render(<SwellCard locationId="invalid-location" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch swell data')).toBeInTheDocument();
    });
  });

  it('refetches data when locationId changes', async () => {
    const mockSwellData = {
      height: 4.2,
      period: 13,
      direction: 'NW',
    };

    const mockGetSwellData = jest.fn().mockResolvedValue(mockSwellData);
    (MockSwellProvider as jest.Mock).mockImplementation(() => ({
      getSwellData: mockGetSwellData,
    }));

    const { rerender } = render(<SwellCard locationId="monterey-harbor" />);

    await waitFor(() => {
      expect(mockGetSwellData).toHaveBeenCalledWith('monterey-harbor', expect.any(Date));
    });

    rerender(<SwellCard locationId="breakwater" />);

    await waitFor(() => {
      expect(mockGetSwellData).toHaveBeenCalledWith('breakwater', expect.any(Date));
    });

    expect(mockGetSwellData).toHaveBeenCalledTimes(2);
  });

  it('displays large swell heights correctly', async () => {
    const mockSwellData = {
      height: 8.5,
      period: 16,
      direction: 'NW',
    };

    const mockGetSwellData = jest.fn().mockResolvedValue(mockSwellData);
    (MockSwellProvider as jest.Mock).mockImplementation(() => ({
      getSwellData: mockGetSwellData,
    }));

    render(<SwellCard locationId="sand-city" />);

    await waitFor(() => {
      expect(screen.getByText('8.5 ft')).toBeInTheDocument();
      expect(screen.getByText('16 sec')).toBeInTheDocument();
    });
  });

  it('displays small swell heights correctly', async () => {
    const mockSwellData = {
      height: 2.2,
      period: 10,
      direction: 'W',
    };

    const mockGetSwellData = jest.fn().mockResolvedValue(mockSwellData);
    (MockSwellProvider as jest.Mock).mockImplementation(() => ({
      getSwellData: mockGetSwellData,
    }));

    render(<SwellCard locationId="breakwater" />);

    await waitFor(() => {
      expect(screen.getByText('2.2 ft')).toBeInTheDocument();
      expect(screen.getByText('10 sec')).toBeInTheDocument();
    });
  });
});
