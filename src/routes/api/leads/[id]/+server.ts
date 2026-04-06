import { json } from '@sveltejs/kit';
import { markLeadRead } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ params, request }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) return json({ ok: false }, { status: 400 });
	const body = await request.json();
	if (body.read === true) await markLeadRead(id);
	return json({ ok: true });
};
