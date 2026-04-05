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
	available_from: string;
	agency: string;
	transaction_type: string;
	property_type: string;
}

export interface ScrapeOptions {
	transaction_type: string;
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
		transaction_type: string[];
		propertyType: string[];
		sortBy: string[];
	};
	collect(opts: ScrapeOptions): Promise<ScrapeResult>;
}
