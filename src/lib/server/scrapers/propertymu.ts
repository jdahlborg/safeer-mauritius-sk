import * as cheerio from 'cheerio';
import type { Listing, ScrapeOptions, ScrapeResult, ScraperSource } from './types';

const BASE_URL = 'https://www.property.mu';

const PAYMENT_PATHS: Record<string, string> = {
	buy: '/for-sale',
	rent: '/for-rent'
};

const HEADERS = {
	'User-Agent':
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
	'Accept-Language': 'en-US,en;q=0.9'
};

async function scrapePage(url: string, payment: string): Promise<ScrapeResult> {
	let html: string;
	try {
		const resp = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(15000) });
		if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
		html = await resp.text();
	} catch (e) {
		return { listings: [], error: String(e) };
	}

	const $ = cheerio.load(html);
	const listings: Listing[] = [];

	// property.mu uses article.property-listing or similar structure
	$('article.property-listing, .listing-item, .property-card').each((_, card) => {
		const prop: Partial<Listing> = {};

		const titleEl = $(card).find('h2 a, h3 a, .property-title a').first();
		if (titleEl.length) {
			prop.title = titleEl.text().trim();
			const href = titleEl.attr('href') ?? '';
			prop.url = href.startsWith('http') ? href : `${BASE_URL}${href}`;
		} else {
			prop.title = '';
			prop.url = '';
		}

		prop.location = $(card).find('.location, .property-location, [class*="location"]').first().text().trim();
		prop.price = $(card).find('.price, .property-price, [class*="price"]').first().text().trim();

		prop.features = $(card)
			.find('.features li, .amenities li, [class*="feature"] li')
			.map((_, li) => $(li).text().trim())
			.get()
			.filter(Boolean);

		const bedsMatch = (prop.title + ' ' + prop.features.join(' ')).match(/(\d+)\s*(bed|bedroom)/i);
		prop.bedrooms = bedsMatch ? `${bedsMatch[1]} Bedroom${parseInt(bedsMatch[1]) !== 1 ? 's' : ''}` : '';

		const sizeMatch = (prop.title + ' ' + prop.features.join(' ')).match(/(\d[\d,]*)\s*m²/);
		prop.size = sizeMatch ? sizeMatch[0] : '';

		const imgEl = $(card).find('img').first();
		if (imgEl.length) {
			const src = imgEl.attr('src') ?? imgEl.attr('data-src') ?? '';
			prop.image = src && !src.startsWith('http') ? `${BASE_URL}${src}` : src;
		} else {
			prop.image = '';
		}

		prop.agency = $(card).find('.agency, .agent-name, [class*="agency"]').first().text().trim();
		prop.transaction_type = payment;
		prop.property_type = '';

		if (prop.title || prop.price) {
			listings.push(prop as Listing);
		}
	});

	return { listings, error: listings.length === 0 ? 'No listings found — site structure may have changed' : null };
}

export const propertyMuSource: ScraperSource = {
	id: 'propertymu',
	name: 'Property.mu',
	url: 'https://www.property.mu',
	filters: {
		transaction_type: ['buy', 'rent'],
		propertyType: ['any'],
		sortBy: ['most_recent']
	},
	async collect({ transaction_type, pages }: ScrapeOptions): Promise<ScrapeResult> {
		const path = PAYMENT_PATHS[transaction_type.toLowerCase()] ?? '/for-sale';
		const all: Listing[] = [];
		for (let page = 1; page <= pages; page++) {
			const url = `${BASE_URL}${path}?page=${page}`;
			const { listings, error } = await scrapePage(url, payment);
			all.push(...listings);
			if (error && page === 1) return { listings: all, error };
			if (page < pages) await new Promise((r) => setTimeout(r, 1000));
		}
		return { listings: all, error: null };
	}
};
