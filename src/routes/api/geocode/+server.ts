import { json } from '@sveltejs/kit';
import { getSaved, updateListingCoords } from '$lib/server/db';
import { geocodeLocation } from '$lib/server/geocode';
import type { RequestHandler } from './$types';

/** POST /api/geocode — geocodes all listings that lack coordinates */
export const POST: RequestHandler = async () => {
	const listings = await getSaved();
	const missing = listings.filter(l => l.lat == null && l.location);

	let updated = 0;
	for (const l of missing) {
		const coords = await geocodeLocation(l.location);
		if (coords) {
			await updateListingCoords(l.id, coords.lat, coords.lng);
			updated++;
		}
		// Nominatim rate limit: 1 req/sec
		await new Promise(r => setTimeout(r, 1100));
	}

	return json({ ok: true, updated, total: missing.length });
};
