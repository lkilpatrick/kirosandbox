/**
 * Species data model for Monterey Bay marine species
 */

export interface Species {
  key: string;
  common_name: string;
  scientific_name: string;
  emoji: string;
  category: string;
  image_url: string;
  natural_history: string;
  max_size: string;
  max_age: string;
  depth_range_ft: [number, number];
  fishing_zone: string;
  best_spots: string[];
  cdfw_bag_limit: string;
  cdfw_size_min: string;
  cdfw_season: string;
  cdfw_always_open: boolean;
  months_best: number[];
  gear: {
    rod: string;
    reel: string;
    line: string;
    leader: string;
    hook: string;
    bait_or_lure: string;
  };
  tips: string;
  inaturalist_url: string;
}

export interface SpeciesData {
  _comment: string;
  _reg_note: string;
  species: Species[];
}
