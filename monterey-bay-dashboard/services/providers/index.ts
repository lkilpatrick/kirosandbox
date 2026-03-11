/**
 * Provider Interfaces
 * 
 * This module exports all provider interfaces for marine condition data.
 * These interfaces define the contract for data sources, allowing the application
 * to work with mock data during development and easily swap to live API providers
 * in production without changing the UI or business logic.
 * 
 * Provider Pattern Benefits:
 * - Decouples data sources from application logic
 * - Enables easy testing with mock implementations
 * - Allows seamless transition from mock to live data
 * - Supports multiple data source implementations
 */

export type { TideProvider, TideData } from './TideProvider';
export type { MarineWeatherProvider, MarineWeatherData } from './MarineWeatherProvider';
export type { WindProvider, WindData } from './WindProvider';
export type { SwellProvider, SwellData } from './SwellProvider';
export type { DiveConditionsProvider, DiveConditionsData } from './DiveConditionsProvider';

// Mock implementations
export {
  MockTideProvider,
  MockMarineWeatherProvider,
  MockWindProvider,
  MockSwellProvider,
  MockDiveConditionsProvider,
} from './mock';
