import { render, screen, waitFor } from '@testing-library/react';
import { DiveConditionsCard } from './DiveConditionsCard';
import { MockDiveConditionsProvider } from '@/services/providers/mock';

// Mock the provider
jest.mock('@/services/providers/mock', () => ({
  MockDiveConditionsProvider: jest.fn(),
}));

describe('DiveConditionsCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state initially', () => {
    const mockGetDiveConditions = jest.fn(() => new Promise(() => {}));
    (MockDiveConditionsProvider as jest.Mock).mockImplementation(() => ({
      getDiveConditions: mockGetDiveConditions,
    }));

    render(<DiveConditionsCard locationId="monterey-harbor" />);
    
    expect(screen.getByText('Dive Conditions')).toBeInTheDocument();
    expect(screen.getByText('Loading dive conditions...')).toBeInTheDocument();
  });

  it('displays dive conditions data when loaded successfully', async () => {
    const mockDiveData = {
      estimatedVisibility: 25,
      waterTemp: 54,
      surgeRisk: 'low' as const,
    };

    const mockGetDiveConditions = jest.fn().mockResolvedValue(mockDiveData);
    (MockDiveConditionsProvider as jest.Mock).mockImplementation(() => ({
      getDiveConditions: mockGetDiveConditions,
    }));

    render(<DiveConditionsCard locationId="monterey-harbor" />);

    await waitFor(() => {
      expect(screen.getByText('Visibility:')).toBeInTheDocument();
      expect(screen.getByText('25 ft')).toBeInTheDocument();
      expect(screen.getByText('Water Temp:')).toBeInTheDocument();
      expect(screen.getByText('54°F')).toBeInTheDocument();
      expect(screen.getByText('Surge Risk:')).toBeInTheDocument();
      expect(screen.getByText('low')).toBeInTheDocument();
    });

    expect(mockGetDiveConditions).toHaveBeenCalledWith('monterey-harbor', expect.any(Date));
  });

  it('displays moderate surge risk with yellow styling', async () => {
    const mockDiveData = {
      estimatedVisibility: 15,
      waterTemp: 52,
      surgeRisk: 'moderate' as const,
    };

    const mockGetDiveConditions = jest.fn().mockResolvedValue(mockDiveData);
    (MockDiveConditionsProvider as jest.Mock).mockImplementation(() => ({
      getDiveConditions: mockGetDiveConditions,
    }));

    render(<DiveConditionsCard locationId="breakwater" />);

    await waitFor(() => {
      const surgeElement = screen.getByText('moderate');
      expect(surgeElement).toBeInTheDocument();
      expect(surgeElement).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });
  });

  it('displays high surge risk with red styling', async () => {
    const mockDiveData = {
      estimatedVisibility: 8,
      waterTemp: 50,
      surgeRisk: 'high' as const,
    };

    const mockGetDiveConditions = jest.fn().mockResolvedValue(mockDiveData);
    (MockDiveConditionsProvider as jest.Mock).mockImplementation(() => ({
      getDiveConditions: mockGetDiveConditions,
    }));

    render(<DiveConditionsCard locationId="sand-city" />);

    await waitFor(() => {
      const surgeElement = screen.getByText('high');
      expect(surgeElement).toBeInTheDocument();
      expect(surgeElement).toHaveClass('bg-red-100', 'text-red-800');
    });
  });

  it('displays error message when data fetch fails', async () => {
    const mockGetDiveConditions = jest.fn().mockRejectedValue(new Error('Failed to load dive conditions'));
    (MockDiveConditionsProvider as jest.Mock).mockImplementation(() => ({
      getDiveConditions: mockGetDiveConditions,
    }));

    render(<DiveConditionsCard locationId="invalid-location" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load dive conditions')).toBeInTheDocument();
    });
  });

  it('refetches data when locationId changes', async () => {
    const mockDiveData = {
      estimatedVisibility: 20,
      waterTemp: 53,
      surgeRisk: 'low' as const,
    };

    const mockGetDiveConditions = jest.fn().mockResolvedValue(mockDiveData);
    (MockDiveConditionsProvider as jest.Mock).mockImplementation(() => ({
      getDiveConditions: mockGetDiveConditions,
    }));

    const { rerender } = render(<DiveConditionsCard locationId="monterey-harbor" />);

    await waitFor(() => {
      expect(mockGetDiveConditions).toHaveBeenCalledWith('monterey-harbor', expect.any(Date));
    });

    rerender(<DiveConditionsCard locationId="breakwater" />);

    await waitFor(() => {
      expect(mockGetDiveConditions).toHaveBeenCalledWith('breakwater', expect.any(Date));
    });

    expect(mockGetDiveConditions).toHaveBeenCalledTimes(2);
  });
});
