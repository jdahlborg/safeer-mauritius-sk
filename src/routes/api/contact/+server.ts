import { json } from '@sveltejs/kit';
import { saveLead } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	if (!data.email) return json({ ok: false, error: 'Email required' }, { status: 400 });
	const result = await saveLead({
		name: data.name,
		email: data.email,
		phone: data.phone,
		message: data.message,
		listing_id: data.listing_id ?? null,
		partner_id: data.partner_id ?? null,
		source: data.source ?? 'general',
	});
	return json(result);
};
