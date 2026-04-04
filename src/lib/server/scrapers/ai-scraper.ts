import * as cheerio from 'cheerio';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '$env/dynamic/private';
import type { Listing } from './types';

const HEADERS = {
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
	'Accept-Language': 'en-US,en;q=0.9',
	Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

/** Strip non-content elements and return cleaned text-lean HTML */
function extractContent(html: string, baseUrl: string): string {
	const $ = cheerio.load(html);

	// Remove noise
	$('script, style, noscript, iframe, svg, head, nav, footer, header, [role="banner"], [role="navigation"], [aria-hidden="true"]').remove();
	$('[class*="cookie"], [class*="popup"], [class*="modal"], [id*="cookie"], [id*="popup"]').remove();

	// Make relative URLs absolute
	const origin = new URL(baseUrl).origin;
	$('a[href]').each((_, el) => {
		const href = $(el).attr('href') ?? '';
		if (href.startsWith('/')) $(el).attr('href', origin + href);
	});
	$('img[src]').each((_, el) => {
		const src = $(el).attr('src') ?? '';
		if (src.startsWith('/')) $(el).attr('src', origin + src);
	});

	// Return condensed HTML (keep links and images for URL/image extraction)
	return $.html('body').slice(0, 80000); // cap at ~80k chars
}

/** Find the next-page URL if pagination exists */
function findNextPage(html: string, baseUrl: string): string | null {
	const $ = cheerio.load(html);
	const origin = new URL(baseUrl).origin;

	// Common next-page patterns
	const candidates = [
		$('a[rel="next"]').attr('href'),
		$('a:contains("Next")').last().attr('href'),
		$('a:contains("›")').last().attr('href'),
		$('a:contains("→")').last().attr('href'),
		$('[class*="next"] a').first().attr('href'),
		$('[class*="pagination"] a').last().attr('href'),
	].filter(Boolean) as string[];

	for (const href of candidates) {
		if (!href || href === '#') continue;
		const abs = href.startsWith('http') ? href : origin + href;
		if (abs !== baseUrl) return abs;
	}
	return null;
}

/** Use Claude to extract structured property listings from page HTML */
async function extractWithAI(html: string, baseUrl: string, agency: string): Promise<Listing[]> {
	const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

	const prompt = `Extract all property listings from this HTML from ${baseUrl}.

Return a JSON array (no markdown, no explanation) where each item has:
- title: string
- price: string (with currency symbol)
- location: string
- bedrooms: string (number or empty string)
- size: string (floor area or empty string)
- features: string[] (amenities list, can be empty)
- image: string (absolute image URL or empty string)
- payment: "buy" | "rent"
- property_type: string (apartment/villa/house/land/penthouse/office or empty string)
- url: string (absolute URL to the listing detail page)
- agency: string (set to "${agency}")

Rules:
- Only include actual property listings (not navigation links, banners, etc.)
- All URLs must be absolute (prepend ${new URL(baseUrl).origin} to relative paths)
- If a field is unknown, use empty string
- Return [] if no listings are found

HTML:
${html}`;

	const msg = await client.messages.create({
		model: 'claude-haiku-4-5-20251001',
		max_tokens: 4096,
		messages: [{ role: 'user', content: prompt }],
	});

	const text = msg.content[0].type === 'text' ? msg.content[0].text : '';

	// Strip markdown code fences if present
	const clean = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();

	try {
		const parsed = JSON.parse(clean);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export interface AIScrapeResult {
	listings: Listing[];
	error: string | null;
	pages_scraped: number;
}

export async function scrapePartnerSite(
	websiteUrl: string,
	agency: string,
	maxPages = 3
): Promise<AIScrapeResult> {
	if (!env.ANTHROPIC_API_KEY) {
		return { listings: [], error: 'ANTHROPIC_API_KEY not configured', pages_scraped: 0 };
	}

	const allListings: Listing[] = [];
	const seen = new Set<string>();
	let currentUrl = websiteUrl;
	let pagesScraped = 0;

	for (let page = 0; page < maxPages; page++) {
		let html: string;
		try {
			const resp = await fetch(currentUrl, {
				headers: HEADERS,
				signal: AbortSignal.timeout(20000),
			});
			if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
			html = await resp.text();
		} catch (e) {
			return {
				listings: allListings,
				error: page === 0 ? `Failed to fetch ${currentUrl}: ${e}` : null,
				pages_scraped: pagesScraped,
			};
		}

		const content = extractContent(html, currentUrl);
		const listings = await extractWithAI(content, currentUrl, agency);

		// Deduplicate by URL
		for (const l of listings) {
			if (l.url && !seen.has(l.url)) {
				seen.add(l.url);
				allListings.push(l);
			}
		}

		pagesScraped++;

		// Stop if no listings found or no next page
		if (listings.length === 0) break;
		const next = findNextPage(html, currentUrl);
		if (!next) break;
		currentUrl = next;
	}

	return { listings: allListings, error: null, pages_scraped: pagesScraped };
}
