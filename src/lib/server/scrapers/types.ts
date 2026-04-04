export interface Listing {
	title: string;
	url: string;
	location: string;
	price: string;
	features: string[];
	bedrooms: string;
	size: string;
	image: string;
	images: string[];
	scheme: string;
	year_built: string;
	agency: string;
	payment: string;
	property_type: string;
}

export interface ScrapeOptions {
	payment: string;
	propertyType: string;
	sortBy: string;
	pages: number;
}

export interface ScrapeResult {
	listings: Listing[];
	error: string | null;
}

export interface ScraperSource {
	id: string;
	name: string;
	url: string;
	filters: {
		payment: string[];
		propertyType: string[];
		sortBy: string[];
	};
	collect(opts: ScrapeOptions): Promise<ScrapeResult>;
}
