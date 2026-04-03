import { json } from '@sveltejs/kit';
import { getPartners, savePartner } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const partners = await getPartners();
	return json({ partners });
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const result = await savePartner({
		name: String(body.name ?? '').trim(),
		company: String(body.company ?? '').trim(),
		email: String(body.email ?? '').trim(),
		phone: String(body.phone ?? '').trim(),
		partner_type: String(body.partner_type ?? '').trim(),
		message: String(body.message ?? '').trim(),
		agreed_terms: false,
	});
	return json(result);
};
