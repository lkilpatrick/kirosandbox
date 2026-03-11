/**
 * RecommendationEngine Tests
 * 
 * Tests the rules-based recommendation scoring logic for all activity types.
 */

import { RecommendationEngine } from './RecommendationEngine';
import { MarineConditions } from '@/models/MarineConditions';

describe('RecommendationEngine', () => {
  const engine = new RecommendationEngine();
  
  // Helper to create base marine conditions
  const createBaseConditions = (): MarineConditions => ({
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
    }
  });
  
  describe('Deterministic Behavior', () => {
    it('should produce identical results for the same input', () => {
      const conditions = createBaseConditions();
      
      const result1 = engine.generateRecommendation(conditions, 'boating');
      const result2 = engine.generateRecommendation(conditions, 'boating');
      
      expect(result1).toEqual(result2);
      expect(result1.score).toBe(result2.score);
      expect(result1.status).toBe(result2.status);
    });
  });
  
  describe('Boating Recommendations', () => {
    it('should return Go status for ideal boating conditions', () => {
      const conditions = createBaseConditions();
      conditions.wind.speed = 8;
      conditions.swell.height = 2;
      
      const result = engine.generateRecommendation(conditions, 'boating');
      
      expect(result.activityType).toBe('boating');
      expect(result.status).toBe('Go');
      expect(result.score).toBeGreaterThanOrEqual(70);
      expect(result.reasons.length).toBeGreaterThan(0);
    });
    
    it('should return Caution status for moderate boating conditions', () => {
      const conditions = createBaseConditions();
      conditions.wind.speed = 18;
      conditions.swell.height = 5;
      
      const result = engine.generateRecommendation(conditions, 'boating');
      
      expect(result.status).toBe('Caution');
      expect(result.score).toBeGreaterThanOrEqual(40);
      expect(result.score).toBeLessThan(70);
      expect(result.cautionFlags.length).toBeGreaterThan(0);
    });
    
    it('should return No-Go status for dangerous boating conditions', () => {
      const conditions = createBaseConditions();
      conditions.wind.speed = 30;
      conditions.swell.height = 12;
      
      const result = engine.generateRecommendation(conditions, 'boating');
      
      expect(result.status).toBe('No-Go');
      expect(result.score).toBeLessThan(40);
      expect(result.cautionFlags.length).toBeGreaterThan(0);
    });
    
    it('should flag high wind speeds', () => {
      const conditions = createBaseConditions();
      conditions.wind.speed = 26;
      
      const result = engine.generateRecommendation(conditions, 'boating');
      
      expect(result.cautionFlags.some(flag => 
        flag.toLowerCase().includes('wind')
      )).toBe(true);
    });
    
    it('should flag large swell heights', () => {
      const conditions = createBaseConditions();
      conditions.swell.height = 11;
      
      const result = engine.generateRecommendation(conditions, 'boating');
      
      expect(result.cautionFlags.some(flag => 
        flag.toLowerCase().includes('swell')
      )).toBe(true);
    });
  });
  
  describe('Fishing Recommendations', () => {
    it('should return Go status for ideal fishing conditions', () => {
      const conditions = createBaseConditions();
      conditions.wind.speed = 10;
      conditions.swell.height = 3;
      conditions.tide.tideTrend = 'rising';
      
      const result = engine.generateRecommendation(conditions, 'fishing');
      
      expect(result.activityType).toBe('fishing');
      expect(result.status).toBe('Go');
      expect(result.score).toBeGreaterThanOrEqual(70);
    });
    
    it('should favor rising tide for fishing', () => {
      const conditions = createBaseConditions();
      conditions.tide.tideTrend = 'rising';
      
      const result = engine.generateRecommendation(conditions, 'fishing');
      
      expect(result.reasons.some(reason => 
        reason.toLowerCase().includes('rising tide')
      )).toBe(true);
    });
    
    it('should return Caution status for moderate fishing conditions', () => {
      const conditions = createBaseConditions();
      conditions.wind.speed = 20;
      conditions.swell.height = 6;
      
      const result = engine.generateRecommendation(conditions, 'fishing');
      
      expect(result.status).toBe('Caution');
      expect(result.score).toBeGreaterThanOrEqual(40);
      expect(result.score).toBeLessThan(70);
    });
    
    it('should return No-Go status for dangerous fishing conditions', () => {
      const conditions = createBaseConditions();
      conditions.wind.speed = 28;
      conditions.swell.height = 11;
      
      const result = engine.generateRecommendation(conditions, 'fishing');
      
      expect(result.status).toBe('No-Go');
      expect(result.score).toBeLessThan(40);
    });
  });
  
  describe('Diving Recommendations', () => {
    it('should return Go status for ideal diving conditions', () => {
      const conditions = createBaseConditions();
      conditions.wind.speed = 5;
      conditions.swell.height = 2;
      conditions.dive.surgeRisk = 'low';
      conditions.dive.estimatedVisibility = 35;
      conditions.tide.nextHigh = new Date(Date.now() + 30 * 60 * 1000); // 30 min away
      
      const result = engine.generateRecommendation(conditions, 'diving');
      
      expect(result.activityType).toBe('diving');
      expect(result.status).toBe('Go');
      expect(result.score).toBeGreaterThanOrEqual(70);
    });
    
    it('should flag high surge risk', () => {
      const conditions = createBaseConditions();
      conditions.dive.surgeRisk = 'high';
      
      const result = engine.generateRecommendation(conditions, 'diving');
      
      expect(result.cautionFlags.some(flag => 
        flag.toLowerCase().includes('surge')
      )).toBe(true);
    });
    
    it('should flag poor visibility', () => {
      const conditions = createBaseConditions();
      conditions.dive.estimatedVisibility = 8;
      
      const result = engine.generateRecommendation(conditions, 'diving');
      
      expect(result.cautionFlags.some(flag => 
        flag.toLowerCase().includes('visibility')
      )).toBe(true);
    });
    
    it('should return Caution status for moderate diving conditions', () => {
      const conditions = createBaseConditions();
      conditions.swell.height = 6;
      conditions.dive.surgeRisk = 'moderate';
      conditions.dive.estimatedVisibility = 15;
      
      const result = engine.generateRecommendation(conditions, 'diving');
      
      expect(result.status).toBe('Caution');
      expect(result.score).toBeGreaterThanOrEqual(40);
      expect(result.score).toBeLessThan(70);
    });
    
    it('should return No-Go status for dangerous diving conditions', () => {
      const conditions = createBaseConditions();
      conditions.wind.speed = 25;
      conditions.swell.height = 10;
      conditions.dive.surgeRisk = 'high';
      conditions.dive.estimatedVisibility = 5;
      
      const result = engine.generateRecommendation(conditions, 'diving');
      
      expect(result.status).toBe('No-Go');
      expect(result.score).toBeLessThan(40);
    });
  });
  
  describe('Score Calculation', () => {
    it('should return scores between 0 and 100', () => {
      const conditions = createBaseConditions();
      
      const activities: Array<'boating' | 'fishing' | 'diving'> = ['boating', 'fishing', 'diving'];
      
      activities.forEach(activity => {
        const result = engine.generateRecommendation(conditions, activity);
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(100);
      });
    });
    
    it('should return integer scores', () => {
      const conditions = createBaseConditions();
      
      const result = engine.generateRecommendation(conditions, 'boating');
      
      expect(Number.isInteger(result.score)).toBe(true);
    });
  });
  
  describe('Status Thresholds', () => {
    it('should classify score 70+ as Go', () => {
      const conditions = createBaseConditions();
      conditions.wind.speed = 5;
      conditions.swell.height = 2;
      
      const result = engine.generateRecommendation(conditions, 'boating');
      
      if (result.score >= 70) {
        expect(result.status).toBe('Go');
      }
    });
    
    it('should classify score 40-69 as Caution', () => {
      const conditions = createBaseConditions();
      conditions.wind.speed = 18;
      conditions.swell.height = 6;
      
      const result = engine.generateRecommendation(conditions, 'boating');
      
      if (result.score >= 40 && result.score < 70) {
        expect(result.status).toBe('Caution');
      }
    });
    
    it('should classify score <40 as No-Go', () => {
      const conditions = createBaseConditions();
      conditions.wind.speed = 30;
      conditions.swell.height = 12;
      
      const result = engine.generateRecommendation(conditions, 'boating');
      
      if (result.score < 40) {
        expect(result.status).toBe('No-Go');
      }
    });
  });
  
  describe('Recommendation Structure', () => {
    it('should include all required fields', () => {
      const conditions = createBaseConditions();
      
      const result = engine.generateRecommendation(conditions, 'boating');
      
      expect(result).toHaveProperty('activityType');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('reasons');
      expect(result).toHaveProperty('cautionFlags');
    });
    
    it('should have reasons array', () => {
      const conditions = createBaseConditions();
      
      const result = engine.generateRecommendation(conditions, 'boating');
      
      expect(Array.isArray(result.reasons)).toBe(true);
      expect(result.reasons.length).toBeGreaterThan(0);
    });
    
    it('should have cautionFlags array', () => {
      const conditions = createBaseConditions();
      
      const result = engine.generateRecommendation(conditions, 'boating');
      
      expect(Array.isArray(result.cautionFlags)).toBe(true);
    });
  });
  
  describe('Wind Speed Evaluation', () => {
    it('should score light winds (0-10 knots) highly', () => {
      const conditions = createBaseConditions();
      conditions.wind.speed = 8;
      
      const result = engine.generateRecommendation(conditions, 'boating');
      
      expect(result.reasons.some(r => r.toLowerCase().includes('light'))).toBe(true);
    });
    
    it('should flag strong winds (20+ knots)', () => {
      const conditions = createBaseConditions();
      conditions.wind.speed = 22;
      
      const result = engine.generateRecommendation(conditions, 'boating');
      
      expect(result.cautionFlags.some(f => f.toLowerCase().includes('wind'))).toBe(true);
    });
  });
  
  describe('Swell Period Evaluation', () => {
    it('should recognize short period swell', () => {
      const conditions = createBaseConditions();
      conditions.swell.period = 8;
      
      const result = engine.generateRecommendation(conditions, 'boating');
      
      expect(result.reasons.some(r => 
        r.toLowerCase().includes('short period')
      )).toBe(true);
    });
    
    it('should flag long period swell as more powerful', () => {
      const conditions = createBaseConditions();
      conditions.swell.period = 16;
      
      const result = engine.generateRecommendation(conditions, 'boating');
      
      expect(result.cautionFlags.some(f => 
        f.toLowerCase().includes('period')
      )).toBe(true);
    });
  });
});
