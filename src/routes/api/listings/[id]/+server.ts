import { json } from '@sveltejs/kit';
import { deleteListing, updateNotes, updateListingScheme, updateListingYearBuilt } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params }) => {
	const ok = await deleteListing(parseInt(params.id));
	return json({ ok });
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	const id = parseInt(params.id);
	const body = await request.json();
	if (body.notes !== undefined) await updateNotes(id, body.notes ?? '');
	if (body.scheme !== undefined) await updateListingScheme(id, body.scheme ?? '');
	if (body.year_built !== undefined) await updateListingYearBuilt(id, body.year_built ?? '');
	return json({ ok: true });
};
