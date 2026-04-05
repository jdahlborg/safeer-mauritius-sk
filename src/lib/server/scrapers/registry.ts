import { lexpressSource } from './lexpress';
import { allysSource } from './allysmu';
import { twofuturesSource } from './twofutures';
import type { ScraperSource } from './types';

export const SOURCES: ScraperSource[] = [
	lexpressSource,
	allysSource,
	twofuturesSource
];

export function getSource(id: string): ScraperSource | undefined {
	return SOURCES.find(s => s.id === id);
}

export type { ScraperSource, Listing, ScrapeOptions, ScrapeResult } from './types';
