/**
 * Tests for Mock Provider Implementations
 * 
 * Verifies that mock providers correctly load and return data from JSON files.
 */

import { describe, it, expect } from 'vitest';
import { MockTideProvider } from './MockTideProvider';
import { MockMarineWeatherProvider } from './MockMarineWeatherProvider';
import { MockWindProvider } from './MockWindProvider';
import { MockSwellProvider } from './MockSwellProvider';
import { MockDiveConditionsProvider } from './MockDiveConditionsProvider';

describe('MockTideProvider', () => {
  const provider = new MockTideProvider();

  it('should return tide data for a valid location and timestamp', async () => {
    const timestamp = new Date('2024-01-15T08:00:00Z');
    const data = await provider.getTideData('monterey-harbor', timestamp);

    expect(data).toBeDefined();
    expect(data.nextHigh).toBeInstanceOf(Date);
    expect(data.nextLow).toBeInstanceOf(Date);
    expect(['rising', 'falling']).toContain(data.tideTrend);
  });

  it('should find closest timestamp match', async () => {
    const timestamp = new Date('2024-01-15T09:00:00Z'); // Between data points
    const data = await provider.getTideData('monterey-harbor', timestamp);

    expect(data).toBeDefined();
  });

  it('should throw error for invalid location', async () => {
    const timestamp = new Date('2024-01-15T08:00:00Z');
    await expect(provider.getTideData('invalid-location', timestamp)).rejects.toThrow();
  });
});

describe('MockMarineWeatherProvider', () => {
  const provider = new MockMarineWeatherProvider();

  it('should return weather data for a valid location and timestamp', async () => {
    const timestamp = new Date('2024-01-15T08:00:00Z');
    const data = await provider.getWeatherData('monterey-harbor', timestamp);

    expect(data).toBeDefined();
    expect(data.summary).toBeTruthy();
    expect(typeof data.airTemp).toBe('number');
    expect(typeof data.marineLayer).toBe('boolean');
  });

  it('should throw error for invalid location', async () => {
    const timestamp = new Date('2024-01-15T08:00:00Z');
    await expect(provider.getWeatherData('invalid-location', timestamp)).rejects.toThrow();
  });
});

describe('MockWindProvider', () => {
  const provider = new MockWindProvider();

  it('should return wind data for a valid location and timestamp', async () => {
    const timestamp = new Date('2024-01-15T08:00:00Z');
    const data = await provider.getWindData('monterey-harbor', timestamp);

    expect(data).toBeDefined();
    expect(typeof data.speed).toBe('number');
    expect(typeof data.gust).toBe('number');
    expect(data.direction).toBeTruthy();
  });

  it('should throw error for invalid location', async () => {
    const timestamp = new Date('2024-01-15T08:00:00Z');
    await expect(provider.getWindData('invalid-location', timestamp)).rejects.toThrow();
  });
});

describe('MockSwellProvider', () => {
  const provider = new MockSwellProvider();

  it('should return swell data for a valid location and timestamp', async () => {
    const timestamp = new Date('2024-01-15T08:00:00Z');
    const data = await provider.getSwellData('monterey-harbor', timestamp);

    expect(data).toBeDefined();
    expect(typeof data.height).toBe('number');
    expect(typeof data.period).toBe('number');
    expect(data.direction).toBeTruthy();
  });

  it('should throw error for invalid location', async () => {
    const timestamp = new Date('2024-01-15T08:00:00Z');
    await expect(provider.getSwellData('invalid-location', timestamp)).rejects.toThrow();
  });
});

describe('MockDiveConditionsProvider', () => {
  const provider = new MockDiveConditionsProvider();

  it('should return dive conditions for a valid location and timestamp', async () => {
    const timestamp = new Date('2024-01-15T08:00:00Z');
    const data = await provider.getDiveConditions('monterey-harbor', timestamp);

    expect(data).toBeDefined();
    expect(typeof data.estimatedVisibility).toBe('number');
    expect(typeof data.waterTemp).toBe('number');
    expect(['low', 'moderate', 'high']).toContain(data.surgeRisk);
  });

  it('should throw error for invalid location', async () => {
    const timestamp = new Date('2024-01-15T08:00:00Z');
    await expect(provider.getDiveConditions('invalid-location', timestamp)).rejects.toThrow();
  });
});
