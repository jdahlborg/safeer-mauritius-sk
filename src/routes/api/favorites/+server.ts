import { json } from '@sveltejs/kit';
import { toggleFavorite } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) return json({ ok: false, error: 'Not signed in' }, { status: 401 });

	const { listingId } = await request.json();
	if (!listingId) return json({ ok: false, error: 'listingId required' }, { status: 400 });

	const favorited = await toggleFavorite(locals.user.id, Number(listingId));
	return json({ ok: true, favorited });
};
