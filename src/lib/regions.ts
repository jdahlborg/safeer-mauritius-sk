/** Maps each Mauritius district to one of the 5 regions */
export const DISTRICT_REGION: Record<string, Region> = {
	'Pamplemousses':    'North',
	'Riviere du Rempart': 'North',
	'Port Louis':       'Center',
	'Moka':             'Center',
	'Plaines Wilhems':  'Center',
	'Black River':      'West',
	'Savanne':          'South',
	'Grand Port':       'South',
	'Flacq':            'East',
};

export const REGIONS = {
	North: {
		bounds: [[-20.15, 57.29], [-19.98, 57.82]] as [[number, number], [number, number]],
		center: [-20.065, 57.555] as [number, number],
		color: '#0077b6',
	},
	South: {
		bounds: [[-20.52, 57.29], [-20.38, 57.82]] as [[number, number], [number, number]],
		center: [-20.45, 57.555] as [number, number],
		color: '#e76f51',
	},
	West: {
		bounds: [[-20.38, 57.29], [-20.15, 57.45]] as [[number, number], [number, number]],
		center: [-20.265, 57.37] as [number, number],
		color: '#2d6a4f',
	},
	Center: {
		bounds: [[-20.38, 57.45], [-20.15, 57.65]] as [[number, number], [number, number]],
		center: [-20.265, 57.55] as [number, number],
		color: '#8b5cf6',
	},
	East: {
		bounds: [[-20.38, 57.65], [-20.15, 57.82]] as [[number, number], [number, number]],
		center: [-20.265, 57.735] as [number, number],
		color: '#c9a96e',
	},
} as const;

export type Region = keyof typeof REGIONS;
export const REGION_NAMES = Object.keys(REGIONS) as Region[];

/** Get region from coordinates */
export function getRegion(lat: number, lng: number): Region {
	if (lat > -20.15) return 'North';
	if (lat < -20.38) return 'South';
	if (lng < 57.45) return 'West';
	if (lng > 57.65) return 'East';
	return 'Center';
}

/** Keyword-based fallback for listings without coordinates */
const LOCATION_MAP: Record<string, Region> = {
	'grand baie': 'North', 'pereybere': 'North', 'cap malheureux': 'North',
	'trou aux biches': 'North', 'balaclava': 'North', 'triolet': 'North',
	'goodlands': 'North', 'rivière du rempart': 'North', 'mapou': 'North',
	'flic en flac': 'West', 'tamarin': 'West', 'black river': 'West',
	'rivière noire': 'West', 'la gaulette': 'West', 'chamarel': 'West',
	'case noyale': 'West', 'albion': 'West',
	'mahebourg': 'South', 'bel ombre': 'South', 'souillac': 'South',
	'blue bay': 'South', 'baie du cap': 'South', 'saint aubin': 'South',
	'rivière des anguilles': 'South', 'surinam': 'South',
	'belle mare': 'East', 'trou d\'eau douce': 'East', 'flacq': 'East',
	'centre de flacq': 'East', 'beau champ': 'East', 'poste de flacq': 'East',
	'roches noires': 'East', 'saint julien': 'East',
	'curepipe': 'Center', 'vacoas': 'Center', 'rose hill': 'Center',
	'quatre bornes': 'Center', 'beau bassin': 'Center', 'port louis': 'Center',
	'phoenix': 'Center', 'floreal': 'Center', 'moka': 'Center',
	'ebene': 'Center', 'réduit': 'Center',
};

export function getRegionFromLocation(location: string): Region | null {
	const lower = location.toLowerCase();
	for (const [key, region] of Object.entries(LOCATION_MAP)) {
		if (lower.includes(key)) return region;
	}
	return null;
}
