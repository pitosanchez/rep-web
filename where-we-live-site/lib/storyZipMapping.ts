/**
 * Mapping between story neighborhoods and ZIP codes
 * Based on historical NYC neighborhood data
 */

export const neighborhoodToZips: Record<string, string[]> = {
  'Mott Haven': ['10451', '10452'],
  'Fordham': ['10458', '10468'],
  'Morrisania': ['10456', '10457'],
  // Add more neighborhoods as needed
};

export const zipToNeighborhood: Record<string, string> = {
  '10451': 'Mott Haven',
  '10452': 'Mott Haven',
  '10453': 'Hunts Point',
  '10454': 'South Bronx',
  '10455': 'Hunts Point',
  '10456': 'Morrisania',
  '10457': 'Morrisania',
  '10458': 'Fordham',
  '10459': 'Melrose',
  '10460': 'Hunts Point',
  '10461': 'Pelham Parkway',
  '10462': 'Pelham Parkway',
  '10463': 'Throgs Neck',
  '10464': 'Throggs Neck',
  '10465': 'Pelham Parkway',
  '10466': 'Pelham Parkway',
  '10467': 'Van Cortlandt',
  '10468': 'Fordham',
  '10469': 'Pelham Parkway',
  '10470': 'Van Cortlandt',
  '10471': 'Riverdale',
  '10472': 'East Tremont',
  '10473': 'Castle Hill',
  '10474': 'Concourse',
  '10475': 'Parkchester',
  '10499': 'Long Island City', // This might be outside Bronx
};

/**
 * Get ZIP codes for a given neighborhood name
 */
export function getZipsForNeighborhood(neighborhood: string): string[] {
  return neighborhoodToZips[neighborhood] || [];
}

/**
 * Get neighborhood for a ZIP code
 */
export function getNeighborhoodForZip(zip: string): string {
  return zipToNeighborhood[zip] || 'Unassigned';
}
