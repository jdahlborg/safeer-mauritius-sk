import { json } from '@sveltejs/kit';
import { deleteListing, updateNotes } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params }) => {
	const ok = await deleteListing(parseInt(params.id));
	return json({ ok });
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	const { notes } = await request.json();
	const ok = await updateNotes(parseInt(params.id), notes ?? '');
	return json({ ok });
};
