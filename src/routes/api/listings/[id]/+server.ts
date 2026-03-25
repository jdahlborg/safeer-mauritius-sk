import { json } from '@sveltejs/kit';
import { deleteListing, updateNotes } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = ({ params }) => {
	const ok = deleteListing(parseInt(params.id));
	return json({ ok });
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	const { notes } = await request.json();
	const ok = updateNotes(parseInt(params.id), notes ?? '');
	return json({ ok });
};
