import * as cheerio from 'cheerio';
import type { Listing, ScrapeOptions, ScrapeResult, ScraperSource } from './types';

const BASE_URL = 'https://2futures.com';
const AGENCY = '2Futures';

const HEADERS = {
	'User-Agent':
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
	'Accept-Language': 'en-US,en;q=0.9',
	Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
};

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
	const seen = new Set<string>();

	// Each property card: <a href="/properties/..."> wraps the image,
	// followed by a sibling <div> with title/location/features, price in <h6>
	$('a[href*="/properties/"]').each((_, el) => {
		const link = $(el);
		const href = link.attr('href') ?? '';

		// Only full property listing pages (not index links)
		if (!href.match(/\/properties\/[a-z0-9\-]+$/)) return;
		const propUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;
		if (seen.has(propUrl)) return;
		seen.add(propUrl);

		const prop: Partial<Listing> = {};
		prop.url = propUrl;
		prop.agency = AGENCY;
		prop.payment = 'buy'; // 2futures only sells
		prop.features = [];

		// Image
		const imgEl = link.find('img').first();
		prop.image = imgEl.attr('src') ?? '';

		// Property type from badge spans
		const badgeSpans = link.find('span');
		prop.property_type = badgeSpans.first().text().trim();

		// Info div is the next sibling div after the <a>
		const infoDiv = link.next('div');

		// Location from h3 (strip &nbsp;)
		prop.location = infoDiv.find('h3').first().text().replace(/\u00a0/g, '').trim();

		// Title from the <a title="..."> inside info div
		const titleLink = infoDiv.find('a[title]').first();
		const titleAttr = titleLink.attr('title') ?? '';
		// Format: "Type | Project Name" or full desc in title attr — use title attr if available
		prop.title = titleAttr || titleLink.text().replace(/\|/g, '–').replace(/\s+/g, ' ').trim();

		// Fallback: use img alt
		if (!prop.title) {
			prop.title = imgEl.attr('alt') ?? '';
		}

		// Bedrooms and size from ul > li > span
		const liSpans = infoDiv.find('ul li span').map((_, s) => $(s).text().trim()).get();
		prop.bedrooms = liSpans[0] ? `${liSpans[0]} Bedroom${liSpans[0] !== '1' ? 's' : ''}` : '';
		prop.size = liSpans.find(s => s.includes('m²')) ?? '';

		// Price from h6 (may be in grandparent sibling)
		// Try: infoDiv parent's next sibling h6, or search upward
		let priceText = '';
		let node = link.parent();
		for (let i = 0; i < 4; i++) {
			const h6 = node.find('h6').first().text();
			if (h6) { priceText = h6; break; }
			node = node.parent();
		}
		prop.price = priceText.replace(/\u00a0/g, '').trim();

		if (prop.title || prop.price) {
			listings.push(prop as Listing);
		}
	});

	return {
		listings,
		error: listings.length === 0 ? 'No listings found — site structure may have changed' : null
	};
}

export const twofuturesSource: ScraperSource = {
	id: '2futures',
	name: '2Futures',
	url: 'https://2futures.com/properties',
	filters: {
		payment: ['buy'],
		propertyType: ['any'],
		sortBy: ['most_recent']
	},
	async collect({ pages }: ScrapeOptions): Promise<ScrapeResult> {
		const all: Listing[] = [];
		for (let page = 1; page <= pages; page++) {
			const url = page === 1 ? `${BASE_URL}/properties` : `${BASE_URL}/properties?page=${page}`;
			const { listings, error } = await scrapePage(url);
			all.push(...listings);
			if (error) return { listings: all, error: page === 1 ? error : null };
			if (page < pages) await new Promise((r) => setTimeout(r, 1000));
		}
		return { listings: all, error: null };
	}
};
