import { json } from '@sveltejs/kit';
import { collect } from '$lib/server/scraper';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const payment = url.searchParams.get('payment') ?? 'buy';
	const property_type = url.searchParams.get('property_type') ?? 'apartment';
	const sort_by = url.searchParams.get('sort_by') ?? 'most_recent';
	const pages = Math.min(parseInt(url.searchParams.get('pages') ?? '1'), 5);

	const { listings, error } = await collect(payment, property_type, sort_by, pages);

	for (const l of listings) {
		l.payment = payment;
		l.property_type = property_type;
	}

	return json({ listings, count: listings.length, error });
};
