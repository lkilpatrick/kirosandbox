/**
 * Species Service
 * 
 * Provides access to Monterey Bay species data with filtering and matching capabilities
 */

import speciesData from '@/data/monterey_bay_species.json';
import { Species } from '@/models/Species';

export class SpeciesService {
  private species: Species[];
  
  constructor() {
    this.species = speciesData.species as Species[];
  }
  
  /**
   * Get all species
   */
  getAllSpecies(): Species[] {
    return this.species;
  }
  
  /**
   * Get species by key
   */
  getSpeciesByKey(key: string): Species | undefined {
    return this.species.find(s => s.key === key);
  }
  
  /**
   * Get species of the day (rotates daily)
   */
  getSpeciesOfTheDay(): Species {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const index = dayOfYear % this.species.length;
    return this.species[index];
  }
  
  /**
   * Get species in season for current month
   * Only returns species that:
   * 1. Have a defined season (months_best array exists and has values)
   * 2. Are currently in season OR are always open
   * 3. Are actually fishable (have fishing-related data)
   */
  getSpeciesInSeason(month?: number): Species[] {
    const currentMonth = month ?? new Date().getMonth() + 1;
    return this.species.filter(s => {
      // Must have months_best defined (even if empty) or be always open
      const hasSeasonData = s.months_best !== undefined || s.cdfw_always_open;
      
      // Must be in season or always open
      const isInSeason = s.months_best?.includes(currentMonth) || s.cdfw_always_open;
      
      // Must have fishing-related data (bag limit indicates it's fishable)
      const isFishable = s.cdfw_bag_limit !== undefined && s.cdfw_bag_limit !== null;
      
      return hasSeasonData && isInSeason && isFishable;
    });
  }
  
  /**
   * Get species by location
   */
  getSpeciesByLocation(locationName: string): Species[] {
    return this.species.filter(s =>
      s.best_spots && Array.isArray(s.best_spots) && s.best_spots.some(spot => 
        spot && spot.toLowerCase().includes(locationName.toLowerCase()) ||
        locationName.toLowerCase().includes(spot.toLowerCase())
      )
    );
  }
  
  /**
   * Get species by category
   */
  getSpeciesByCategory(category: string): Species[] {
    return this.species.filter(s => s.category === category);
  }
  
  /**
   * Get what's biting now - species in season for location
   */
  getWhatsBiting(locationName: string, month?: number): Species[] {
    const inSeason = this.getSpeciesInSeason(month);
    const atLocation = this.getSpeciesByLocation(locationName);
    
    // Find species that are both in season and at this location
    const biting = inSeason.filter(s => 
      atLocation.some(l => l.key === s.key)
    );
    
    // If we have matches, return them; otherwise return in-season species
    return biting.length > 0 ? biting : inSeason.slice(0, 5);
  }
  
  /**
   * Get random species (for variety)
   */
  getRandomSpecies(count: number = 1): Species[] {
    const shuffled = [...this.species].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
  
  /**
   * Search species by name
   */
  searchSpecies(query: string): Species[] {
    const lowerQuery = query.toLowerCase();
    return this.species.filter(s =>
      s.common_name?.toLowerCase().includes(lowerQuery) ||
      s.scientific_name?.toLowerCase().includes(lowerQuery)
    );
  }
}
