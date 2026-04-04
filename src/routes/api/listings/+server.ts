import { json } from '@sveltejs/kit';
import { getSaved, saveListing, updateListingCoords } from '$lib/server/db';
import { geocodeLocation } from '$lib/server/geocode';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search') ?? '';
	const property_type = url.searchParams.get('property_type') ?? '';
	const payment = url.searchParams.get('payment') ?? '';
	const listings = await getSaved(search, property_type, payment);
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
