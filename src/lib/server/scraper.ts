import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.lexpressproperty.com/en';

const PAYMENT_SLUGS: Record<string, string> = {
	buy: 'buy-mauritius',
	rent: 'rent-mauritius',
	holiday: 'holiday-mauritius'
};

const PROPERTY_SLUGS: Record<string, string> = {
	apartment: 'apartment',
	villa: 'villa',
	house: 'house',
	land: 'land',
	office: 'office',
	warehouse: 'warehouse',
	commercial: 'commercial',
	penthouse: 'penthouse'
};

const SORT_PARAMS: Record<string, string> = {
	most_recent: '-created_at',
	least_expensive: 'price',
	most_expensive: '-price'
};

const HEADERS = {
	'User-Agent':
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
	'Accept-Language': 'en-US,en;q=0.9'
};

export interface Listing {
	title: string;
	url: string;
	location: string;
	price: string;
	features: string[];
	bedrooms: string;
	size: string;
	image: string;
	agency: string;
	payment: string;
	property_type: string;
}

function buildUrl(payment: string, propertyType: string, sortBy: string, page: number): string {
	const pSlug = PAYMENT_SLUGS[payment.toLowerCase()] ?? 'buy-mauritius';
	const tSlug = PROPERTY_SLUGS[propertyType.toLowerCase()] ?? 'apartment';
	const sort = SORT_PARAMS[sortBy] ?? '-created_at';
	return `${BASE_URL}/${pSlug}/${tSlug}?sort=${sort}&p=${page}`;
}

async function scrapePage(url: string): Promise<{ listings: Listing[]; error: string | null }> {
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

	$('div.card-result-gallery').each((_, card) => {
		const prop: Partial<Listing> = {};

		// Title + URL
		const titleEl = $(card).find('.title-holder h2 a, .title-holder h3 a').first();
		if (titleEl.length) {
			prop.title = titleEl.text().trim();
			const href = titleEl.attr('href') ?? '';
			prop.url = href.startsWith('http') ? href : `https://www.lexpressproperty.com${href}`;
		} else {
			prop.title = '';
			prop.url = '';
		}

		// Location
		const locEl = $(card).find('address a, address').first();
		prop.location = locEl.length ? locEl.text().trim() : '';

		// Price
		const priceEl = $(card).find('strong.price, .card-foot-price strong').first();
		prop.price = priceEl.length ? priceEl.text().trim() : '';

		// Features
		prop.features = $(card)
			.find('ul.option-list li')
			.map((_, li) => $(li).text().trim())
			.get()
			.filter(Boolean);

		// Bedrooms
		const bedsMatch = prop.title?.match(/(\d+)\s+Bedroom/i);
		prop.bedrooms = bedsMatch ? bedsMatch[0] : '';

		// Size
		const sizeMatch = prop.title?.match(/(\d[\d,]*)\s*m²/);
		prop.size = sizeMatch ? sizeMatch[0] : '';

		// Image
		const imgEl = $(card).find('.carousel-item.active img, .carousel-item img').first();
		if (imgEl.length) {
			const src = imgEl.attr('src') ?? '';
			prop.image =
				src && !src.startsWith('http') ? `https://www.lexpressproperty.com/${src}` : src;
		} else {
			prop.image = '';
		}

		// Agency
		const agencyEl = $(card).find('.logo-holder img').first();
		prop.agency = agencyEl.length ? (agencyEl.attr('alt') ?? '') : '';

		if (prop.title || prop.price) {
			listings.push(prop as Listing);
		}
	});

	return { listings, error: null };
}

export async function collect(
	payment = 'buy',
	propertyType = 'apartment',
	sortBy = 'most_recent',
	pages = 1
): Promise<{ listings: Listing[]; error: string | null }> {
	const all: Listing[] = [];
	for (let page = 1; page <= pages; page++) {
		const url = buildUrl(payment, propertyType, sortBy, page);
		const { listings, error } = await scrapePage(url);
		all.push(...listings);
		if (error) return { listings: all, error };
		if (page < pages) await new Promise((r) => setTimeout(r, 1000));
	}
	return { listings: all, error: null };
}
