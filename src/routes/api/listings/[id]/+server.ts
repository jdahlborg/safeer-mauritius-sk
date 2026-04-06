import { json } from '@sveltejs/kit';
import { deleteListing, updateListingFull } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params }) => {
	const ok = await deleteListing(parseInt(params.id));
	return json({ ok });
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	const id = parseInt(params.id);
	const body = await request.json();
	await updateListingFull(id, body);
	return json({ ok: true });
};
