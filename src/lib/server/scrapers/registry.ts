import { lexpressSource } from './lexpress';
import { propertyMuSource } from './propertymu';
import type { ScraperSource } from './types';

export const SOURCES: ScraperSource[] = [
	lexpressSource,
	propertyMuSource
];

export function getSource(id: string): ScraperSource | undefined {
	return SOURCES.find(s => s.id === id);
}

export type { ScraperSource, Listing, ScrapeOptions, ScrapeResult } from './types';
