import { json } from '@sveltejs/kit';
import { getSource, SOURCES } from '$lib/server/scrapers/registry';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const sourceId = url.searchParams.get('source') ?? 'lexpress';
	const payment = url.searchParams.get('payment') ?? 'buy';
	const property_type = url.searchParams.get('property_type') ?? 'apartment';
	const sort_by = url.searchParams.get('sort_by') ?? 'most_recent';
	const pages = Math.min(parseInt(url.searchParams.get('pages') ?? '1'), 5);

	const source = getSource(sourceId);
	if (!source) {
		const ids = SOURCES.map(s => s.id).join(', ');
		return json({ listings: [], count: 0, error: `Unknown source "${sourceId}". Available: ${ids}` }, { status: 400 });
	}

	const { listings, error } = await source.collect({ payment, propertyType: property_type, sortBy: sort_by, pages });

	return json({ listings, count: listings.length, error, source: source.id });
};
