import { json } from '@sveltejs/kit';
import { getPartnerListings } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.partner) return json({ ok: false }, { status: 401 });
	const listings = await getPartnerListings(locals.partner.id);
	return json({ listings });
};
