import * as cheerio from 'cheerio';
import type { Listing, ScrapeOptions, ScrapeResult, ScraperSource } from './types';

const BASE_URL = 'https://www.allys.mu';
const AGENCY = "Ally's";

const HEADERS = {
	'User-Agent':
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
	'Accept-Language': 'en-US,en;q=0.9',
	Accept: 'text/html,application/xhtml+xml,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
};

/** Decode a Next.js /_next/image?url=... srcSet entry to get the original image URL */
function decodeNextImageUrl(srcSet: string): string {
	const firstEntry = srcSet.split(',')[0].trim();
	const match = firstEntry.match(/url=([^&\s]+)/);
	if (!match) return '';
	try {
		return decodeURIComponent(match[1]);
	} catch {
		return '';
	}
}

/** Parse structured metadata out of the markdown-style description paragraph */
function parseDescription(text: string): { price: string; bedrooms: string; size: string; location: string } {
	const price = text.match(/\*\*Price:\*\*\s*([^|*\n]+)/)?.[1]?.trim() ?? '';
	const bedrooms = text.match(/\*\*Bedrooms?:\*\*\s*([^|*\n]+)/)?.[1]?.trim() ?? '';
	const size = text.match(/\*\*Size:\*\*\s*([^|*\n]+)/)?.[1]?.trim() ?? '';
	const location = text.match(/\*\*Location:\*\*\s*([^|*\n]+)/)?.[1]?.trim() ?? '';
	return { price, bedrooms, size, location };
}

async function scrapePage(url: string): Promise<ScrapeResult> {
	let html: string;
	try {
		const resp = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(20000) });
		if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
		html = await resp.text();
	} catch (e) {
		return { listings: [], error: String(e) };
	}

	const $ = cheerio.load(html);
	const listings: Listing[] = [];

	// Each property card is wrapped in <a href="/en/properties/{id}">
	$('a[href^="/en/properties/"]').each((_, el) => {
		const link = $(el);
		const href = link.attr('href') ?? '';
		if (!href.match(/^\/en\/properties\/[a-z0-9]+$/)) return; // skip non-listing links

		const prop: Partial<Listing> = {};

		prop.url = `${BASE_URL}${href}`;

		// Title: h3 inside the card
		prop.title = link.find('h3').first().text().trim();

		// Fallback title from img alt
		if (!prop.title) {
			prop.title = link.find('img').first().attr('alt') ?? '';
		}

		// Image: decode from first img srcSet
		const imgEl = link.find('img').first();
		const srcSet = imgEl.attr('srcset') ?? imgEl.attr('srcSet') ?? '';
		prop.image = decodeNextImageUrl(srcSet);

		// Payment type: look for "For Sale" / "For Rent" badge text
		const badgeText = link.text();
		if (/for\s*rent/i.test(badgeText)) {
			prop.payment = 'rent';
		} else {
			prop.payment = 'buy'; // default to sale
		}

		// Description paragraph with markdown metadata
		const descText = link.find('p').first().text();
		const { price, bedrooms, size, location } = parseDescription(descText);

		// Price: from description or from Rs span
		if (price) {
			prop.price = price;
		} else {
			// Find the deepest span containing Rs
			prop.price = '';
			link.find('span').each((_, s) => {
				const t = $(s).text().trim();
				if (/^Rs[\u00a0\s]?[0-9,]+$/.test(t)) {
					prop.price = t;
				}
			});
		}

		prop.location = location || '';
		prop.bedrooms = bedrooms ? bedrooms.split(/[\s|(]/)[0] + (parseInt(bedrooms) === 1 ? ' Bedroom' : ' Bedrooms') : '';
		prop.size = size || '';
		prop.agency = AGENCY;
		prop.property_type = '';
		prop.features = [];

		if (prop.title || prop.price) {
			listings.push(prop as Listing);
		}
	});

	return {
		listings,
		error: listings.length === 0 ? 'No listings found — page may be dynamically rendered or structure changed' : null
	};
}

export const allysSource: ScraperSource = {
	id: 'allysmu',
	name: "Ally's Real Estate",
	url: 'https://www.allys.mu/en/properties',
	filters: {
		payment: ['buy', 'rent'],
		propertyType: ['any'],
		sortBy: ['most_recent']
	},
	async collect({ pages }: ScrapeOptions): Promise<ScrapeResult> {
		const all: Listing[] = [];
		for (let page = 1; page <= pages; page++) {
			const url = page === 1 ? `${BASE_URL}/en/properties` : `${BASE_URL}/en/properties?page=${page}`;
			const { listings, error } = await scrapePage(url);
			all.push(...listings);
			if (error) return { listings: all, error: page === 1 ? error : null };
			if (page < pages) await new Promise((r) => setTimeout(r, 1000));
		}
		return { listings: all, error: null };
	}
};
