import { json } from '@sveltejs/kit';
import { getListings, saveListing, updateListingCoords } from '$lib/server/db';
import { geocodeLocation } from '$lib/server/geocode';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search') ?? '';
	const property_type = url.searchParams.get('property_type') ?? '';
	const transaction_type = url.searchParams.get('transaction_type') ?? '';
	const listings = await getListings(search, property_type, transaction_type);
	return json({ listings, count: listings.length });
};

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const result = await saveListing(data);
	if (result.ok && result.id && data.location && data.lat == null) {
		// Fire-and-forget geocode
		geocodeLocation(String(data.location)).then(coords => {
			if (coords && result.id) updateListingCoords(result.id, coords.lat, coords.lng);
		}).catch(() => {});
	}
	return json(result, { status: result.ok ? 200 : 400 });
};
