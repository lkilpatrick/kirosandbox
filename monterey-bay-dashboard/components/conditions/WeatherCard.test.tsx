import { render, screen, waitFor } from '@testing-library/react';
import { WeatherCard } from './WeatherCard';
import { MockMarineWeatherProvider } from '@/services/providers/mock';

// Mock the provider
jest.mock('@/services/providers/mock', () => ({
  MockMarineWeatherProvider: jest.fn(),
}));

describe('WeatherCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state initially', () => {
    const mockGetWeatherData = jest.fn(() => new Promise(() => {}));
    (MockMarineWeatherProvider as jest.Mock).mockImplementation(() => ({
      getWeatherData: mockGetWeatherData,
    }));

    render(<WeatherCard locationId="monterey-harbor" />);
    
    expect(screen.getByText('Marine Weather')).toBeInTheDocument();
    expect(screen.getByText('Loading weather data...')).toBeInTheDocument();
  });

  it('displays weather data when loaded successfully', async () => {
    const mockWeatherData = {
      summary: 'Partly Cloudy',
      airTemp: 58,
      marineLayer: true,
    };

    const mockGetWeatherData = jest.fn().mockResolvedValue(mockWeatherData);
    (MockMarineWeatherProvider as jest.Mock).mockImplementation(() => ({
      getWeatherData: mockGetWeatherData,
    }));

    render(<WeatherCard locationId="monterey-harbor" />);

    await waitFor(() => {
      expect(screen.getByText('Conditions:')).toBeInTheDocument();
      expect(screen.getByText('Partly Cloudy')).toBeInTheDocument();
      expect(screen.getByText('Air Temp:')).toBeInTheDocument();
      expect(screen.getByText('58°F')).toBeInTheDocument();
      expect(screen.getByText('Marine Layer:')).toBeInTheDocument();
      expect(screen.getByText('Yes')).toBeInTheDocument();
    });

    expect(mockGetWeatherData).toHaveBeenCalledWith('monterey-harbor', expect.any(Date));
  });

  it('displays "No" for marine layer when false', async () => {
    const mockWeatherData = {
      summary: 'Clear',
      airTemp: 65,
      marineLayer: false,
    };

    const mockGetWeatherData = jest.fn().mockResolvedValue(mockWeatherData);
    (MockMarineWeatherProvider as jest.Mock).mockImplementation(() => ({
      getWeatherData: mockGetWeatherData,
    }));

    render(<WeatherCard locationId="breakwater" />);

    await waitFor(() => {
      expect(screen.getByText('No')).toBeInTheDocument();
    });
  });

  it('displays error message when data fetch fails', async () => {
    const mockGetWeatherData = jest.fn().mockRejectedValue(new Error('Failed to fetch weather data'));
    (MockMarineWeatherProvider as jest.Mock).mockImplementation(() => ({
      getWeatherData: mockGetWeatherData,
    }));

    render(<WeatherCard locationId="invalid-location" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch weather data')).toBeInTheDocument();
    });
  });

  it('refetches data when locationId changes', async () => {
    const mockWeatherData = {
      summary: 'Partly Cloudy',
      airTemp: 58,
      marineLayer: true,
    };

    const mockGetWeatherData = jest.fn().mockResolvedValue(mockWeatherData);
    (MockMarineWeatherProvider as jest.Mock).mockImplementation(() => ({
      getWeatherData: mockGetWeatherData,
    }));

    const { rerender } = render(<WeatherCard locationId="monterey-harbor" />);

    await waitFor(() => {
      expect(mockGetWeatherData).toHaveBeenCalledWith('monterey-harbor', expect.any(Date));
    });

    rerender(<WeatherCard locationId="breakwater" />);

    await waitFor(() => {
      expect(mockGetWeatherData).toHaveBeenCalledWith('breakwater', expect.any(Date));
    });

    expect(mockGetWeatherData).toHaveBeenCalledTimes(2);
  });

  it('displays different weather summaries correctly', async () => {
    const mockWeatherData = {
      summary: 'Foggy with light winds',
      airTemp: 52,
      marineLayer: true,
    };

    const mockGetWeatherData = jest.fn().mockResolvedValue(mockWeatherData);
    (MockMarineWeatherProvider as jest.Mock).mockImplementation(() => ({
      getWeatherData: mockGetWeatherData,
    }));

    render(<WeatherCard locationId="moss-landing" />);

    await waitFor(() => {
      expect(screen.getByText('Foggy with light winds')).toBeInTheDocument();
    });
  });
});
