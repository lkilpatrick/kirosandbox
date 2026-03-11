/**
 * Demo script to verify RecommendationEngine functionality
 * 
 * Run with: npx tsx services/recommendation/demo.ts
 */

import { RecommendationEngine } from './RecommendationEngine';
import { MarineConditions } from '@/models/MarineConditions';

const engine = new RecommendationEngine();

// Helper to create test conditions
const createConditions = (overrides?: Partial<MarineConditions>): MarineConditions => ({
  timestamp: new Date('2024-01-15T10:00:00Z'),
  tide: {
    nextHigh: new Date('2024-01-15T12:00:00Z'),
    nextLow: new Date('2024-01-15T18:00:00Z'),
    tideTrend: 'rising'
  },
  weather: {
    summary: 'Partly cloudy',
    airTemp: 58,
    marineLayer: false
  },
  wind: {
    speed: 8,
    gust: 12,
    direction: 'NW'
  },
  swell: {
    height: 2,
    period: 8,
    direction: 'NW'
  },
  dive: {
    estimatedVisibility: 25,
    waterTemp: 54,
    surgeRisk: 'low'
  },
  ...overrides
});

console.log('=== RecommendationEngine Demo ===\n');

// Test 1: Ideal conditions for all activities
console.log('Test 1: Ideal Conditions');
const idealConditions = createConditions();
console.log('Boating:', engine.generateRecommendation(idealConditions, 'boating'));
console.log('Fishing:', engine.generateRecommendation(idealConditions, 'fishing'));
console.log('Diving:', engine.generateRecommendation(idealConditions, 'diving'));
console.log();

// Test 2: Moderate/Caution conditions
console.log('Test 2: Moderate Conditions (should be Caution)');
const moderateConditions = createConditions({
  wind: { speed: 18, gust: 22, direction: 'NW' },
  swell: { height: 6, period: 12, direction: 'NW' }
});
console.log('Boating:', engine.generateRecommendation(moderateConditions, 'boating'));
console.log();

// Test 3: Dangerous/No-Go conditions
console.log('Test 3: Dangerous Conditions (should be No-Go)');
const dangerousConditions = createConditions({
  wind: { speed: 30, gust: 38, direction: 'NW' },
  swell: { height: 12, period: 16, direction: 'NW' }
});
console.log('Boating:', engine.generateRecommendation(dangerousConditions, 'boating'));
console.log();

// Test 4: Poor diving conditions
console.log('Test 4: Poor Diving Conditions');
const poorDivingConditions = createConditions({
  dive: {
    estimatedVisibility: 8,
    waterTemp: 54,
    surgeRisk: 'high'
  },
  swell: { height: 8, period: 14, direction: 'NW' }
});
console.log('Diving:', engine.generateRecommendation(poorDivingConditions, 'diving'));
console.log();

// Test 5: Deterministic behavior
console.log('Test 5: Deterministic Behavior (same input = same output)');
const testConditions = createConditions();
const result1 = engine.generateRecommendation(testConditions, 'boating');
const result2 = engine.generateRecommendation(testConditions, 'boating');
console.log('Result 1:', result1);
console.log('Result 2:', result2);
console.log('Are they equal?', JSON.stringify(result1) === JSON.stringify(result2));
console.log();

console.log('=== Demo Complete ===');
